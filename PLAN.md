# Spotify Integration Plan

## Design Principles

Like the real Hitster app, the game UI during playback is minimal: **play, pause, and place the card**. No song metadata is ever shown until the reveal. Only the **host** needs Spotify Premium — the game is designed for in-person play where the host's device speakers play the music for the room.

---

## Architecture Overview

```
Host clicks "Host Game"
  → Spotify OAuth popup (PKCE flow, client-side only)
  → Access token stored in browser memory
  → Token sent to server via `create-room` (already supported)
  → Token also used client-side for Web Playback SDK

Game starts:
  → Server resolves Spotify track IDs for entire deck (batch, using existing resolveSpotifyTrackId)
  → Server emits `play-song` with trackId each turn

Host's browser receives `play-song`:
  → Calls Spotify Web API to play track on the SDK device
  → UI shows play/pause controls on the mystery card
  → All other metadata hidden until reveal
```

---

## Step-by-Step Implementation

### Step 1: Spotify OAuth Service (`app/src/services/spotify.ts`) — NEW FILE

Create a client-side Spotify auth module using the **PKCE authorization flow** (no backend secret needed).

**Functions:**
- `getSpotifyAuthUrl()` — Generates auth URL with PKCE code challenge, scopes, and redirect URI. Stores code verifier in sessionStorage.
- `exchangeCodeForToken(code: string)` — Exchanges auth code for access + refresh tokens via Spotify's token endpoint.
- `refreshAccessToken(refreshToken: string)` — Uses refresh token to get a new access token before expiry.
- `openSpotifyLogin()` — Opens a popup window to the auth URL. Returns a Promise that resolves with the access token when the popup completes the OAuth flow.

**Scopes needed:** `streaming`, `user-read-email`, `user-read-private`, `user-modify-playback-state`, `user-read-playback-state`

**Config:** Reads `VITE_SPOTIFY_CLIENT_ID` from env. Redirect URI: `${window.location.origin}/callback`.

**Token storage:** In-memory (zustand store) — not localStorage, to avoid leaking tokens. Refresh token in sessionStorage for tab persistence.

### Step 2: OAuth Callback Route (`app/src/components/SpotifyCallback.tsx`) — NEW FILE

A simple component that:
1. Reads the `code` query parameter from the URL
2. Calls `exchangeCodeForToken(code)`
3. Sends the token back to the opener window via `window.opener.postMessage`
4. Closes itself

This handles the popup callback. App.tsx needs a route check: if `window.location.search` includes `code=`, render the callback component instead of the normal app.

### Step 3: Spotify Playback SDK Service (`app/src/services/spotifyPlayer.ts`) — NEW FILE

Manages the Spotify Web Playback SDK lifecycle.

**Setup:**
- Dynamically load the SDK script (`https://sdk.scdn.co/spotify-player.js`)
- Wait for `window.onSpotifyWebPlaybackSDKReady` callback
- Create a `Spotify.Player` instance with the access token
- Connect and wait for `ready` event → get `device_id`

**Playback methods:**
- `playTrack(trackId: string)` — Calls `PUT https://api.spotify.com/v1/me/player/play` with `{"uris": ["spotify:track:{trackId}"], "position_ms": 0}` targeting our device_id
- `pause()` — Calls `player.pause()`
- `resume()` — Calls `player.resume()`
- `getPlaybackState()` — Returns current playing/paused state

**Cleanup:**
- `disconnect()` — Disconnects player on unmount

**Token refresh:** The SDK accepts a `getOAuthToken` callback that fires when the token expires. Wire this to the refresh logic from Step 1.

### Step 4: Update Env Types (`app/src/vite-env.d.ts`)

Add `VITE_SPOTIFY_CLIENT_ID: string` to `ImportMetaEnv`.

Create `app/.env.example` with:
```
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
```

### Step 5: Add Spotify State to Store (`app/src/store.ts`)

Add to the store:
```typescript
// Spotify
spotifyToken: string | null;
spotifyDeviceId: string | null;
spotifyReady: boolean;
isPlaying: boolean;
setSpotifyToken: (token: string | null) => void;
setSpotifyDeviceId: (id: string | null) => void;
setSpotifyReady: (ready: boolean) => void;
setIsPlaying: (playing: boolean) => void;
```

### Step 6: Update Home.tsx — Host Flow

When user clicks "Host Game":
1. If no Spotify token in store → call `openSpotifyLogin()` (popup)
2. On success → store token, then emit `create-room` with `{ playerName, spotifyAccessToken }`
3. Show "Connecting to Spotify..." state during the popup flow
4. If popup fails/cancelled → show error, stay on home screen

The "Create Room" button becomes a "Connect Spotify & Create Room" button with the Spotify green color. Non-hosts joining don't need Spotify at all — their flow is unchanged.

### Step 7: Initialize Playback SDK on Game Start (`app/src/hooks/useSpotifyPlayer.ts`) — NEW FILE

A React hook that:
1. Watches for `spotifyToken` in the store
2. When token is available and we're in the game screen, initializes the SDK player
3. Sets `spotifyDeviceId` and `spotifyReady` in the store
4. Cleans up on unmount

Called in `App.tsx` (or `Game.tsx`) — only runs for the host (check if `myId === hostId` and token exists).

### Step 8: Server — Resolve Track IDs on Game Start (`server/src/rooms.ts` + `server/src/songs.ts`)

In the `start-game` handler in `rooms.ts`:
1. After selecting the deck via `selectGameDeck()`
2. If the GameEngine has a Spotify token, batch-resolve track IDs for the deck
3. Use existing `resolveSpotifyTrackId()` with concurrency limit (5 at a time to avoid rate limits)
4. Update each card's `spotifyTrackId` before passing to `engine.startGame(deck)`

New function in `songs.ts`:
```typescript
export async function resolveTrackIds(deck: SongCard[], accessToken: string): Promise<void>
```
Resolves track IDs in parallel batches. Logs how many were resolved.

**Note:** This adds a delay before the game starts (maybe 3-5 seconds for 50 songs at 5 concurrent). Emit a `resolving-tracks` event so the client can show a loading state.

### Step 9: Handle `play-song` Event on Client (`app/src/hooks/useSocket.ts`)

Add listener for the `play-song` event:
```typescript
socket.on('play-song', ({ spotifyTrackId }) => {
  // Store the track ID for playback
  store.setCurrentTrackId(spotifyTrackId);
});
```

In the `useSpotifyPlayer` hook (or a useEffect in Game.tsx):
- Watch for `currentTrackId` changes
- When it changes and SDK is ready, call `playTrack(trackId)`
- Auto-play when a new turn starts

### Step 10: Update Game.tsx — Playback UI

Replace the static mystery card with a **playback-aware** card. The mystery card center area changes to:

**When host & playing phase:**
- Large play/pause toggle button (like real Hitster)
- Animated sound bars when playing
- "Now Playing" / "Paused" status text
- No song metadata shown

**When not host:**
- Same mystery card as before ("?" with "Now Playing" indicator)
- Sound wave animation when host is playing (sync via a new `playback-state` socket event, or just show it based on phase)

**During challenge phase:**
- Music pauses automatically
- Card shows "Challenge!" state (already exists)

**During reveal:**
- Music stops
- Song details shown (already exists)

The play/pause button is simple:
```tsx
<button onClick={isPlaying ? pause : resume}>
  {isPlaying ? <Pause /> : <Play />}
</button>
```

### Step 11: Add Spotify Type Declarations (`app/src/types/spotify.d.ts`) — NEW FILE

Declare the Spotify Web Playback SDK types:
```typescript
declare namespace Spotify {
  interface Player { ... }
  interface WebPlaybackState { ... }
  // etc.
}
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
  }
}
```

### Step 12: Auto-pause/resume Logic

In the Game engine flow:
- **New turn starts** → auto-play the song
- **Card placed (challenge phase)** → auto-pause
- **Reveal** → stop playback
- **Skip** → stop playback, advance turn

This is handled in the `useSpotifyPlayer` hook by watching `phase` changes:
- `phase === 'playing'` + new track → play
- `phase === 'challenge'` → pause
- `phase === 'reveal'` → pause

---

## Files Changed (Summary)

| File | Action | Purpose |
|------|--------|---------|
| `app/src/services/spotify.ts` | **NEW** | OAuth PKCE flow |
| `app/src/services/spotifyPlayer.ts` | **NEW** | Web Playback SDK wrapper |
| `app/src/components/SpotifyCallback.tsx` | **NEW** | OAuth popup callback |
| `app/src/hooks/useSpotifyPlayer.ts` | **NEW** | React hook for SDK lifecycle |
| `app/src/types/spotify.d.ts` | **NEW** | TypeScript declarations for SDK |
| `app/.env.example` | **NEW** | Environment variable template |
| `app/src/vite-env.d.ts` | Edit | Add `VITE_SPOTIFY_CLIENT_ID` |
| `app/src/store.ts` | Edit | Add Spotify state fields |
| `app/src/App.tsx` | Edit | Handle OAuth callback route |
| `app/src/components/Home.tsx` | Edit | Spotify login on host flow |
| `app/src/components/Game.tsx` | Edit | Play/pause UI on mystery card |
| `app/src/hooks/useSocket.ts` | Edit | Handle `play-song` event |
| `server/src/rooms.ts` | Edit | Resolve track IDs on game start |
| `server/src/songs.ts` | Edit | Add batch track resolution |
| `shared/src/events.ts` | Edit | Add `resolving-tracks` event |

---

## Testing Steps

After implementation, to test:

1. **Register a Spotify app:**
   - Go to https://developer.spotify.com/dashboard
   - Create a new app
   - Set redirect URI to `http://localhost:5173/callback`
   - Copy the Client ID

2. **Configure the app:**
   - Create `app/.env` with `VITE_SPOTIFY_CLIENT_ID=<your_client_id>`

3. **Run the app:**
   - `npm run dev` (starts server + client)

4. **Test the flow:**
   - Enter name, click "Host Game"
   - Spotify login popup opens → authorize
   - Room created, you land in lobby
   - Open a second browser tab, join with room code
   - Host clicks "Start Game"
   - Music should auto-play on host's browser
   - Host sees play/pause controls
   - Place card → music pauses during challenge window
   - Reveal → song details shown, music stopped
   - Continue → next turn, new song auto-plays

5. **Edge cases to test:**
   - Popup blocked by browser → show "allow popups" message
   - Token expires mid-game → refresh token auto-renews
   - Song not found on Spotify → skip playback, game continues silently
   - Non-host player experience → no playback controls, just game UI
