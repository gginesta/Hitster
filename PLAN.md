# Spotify Integration Plan

## Design Principles

Like the real Hitster app, the game UI during playback is minimal: **play, pause, and place the card**. No song metadata is ever shown until the reveal. Only the **host** needs Spotify Premium — the game is designed for in-person play where the host's device speakers play the music for the room.

---

## Architecture Overview

```
Host clicks "Host Game"
  → Spotify OAuth popup (PKCE flow, client-side only)
  → Lightweight callback.html exchanges code for tokens, posts to opener
  → Access token stored in zustand store (memory)
  → Refresh token stored in sessionStorage (survives refresh)
  → Token sent to server via `create-room` (already supported)
  → Token also used client-side for Web Playback SDK

Game starts:
  → Server resolves Spotify track IDs for entire deck (batch, cached)
  → Songs that fail resolution are filtered out of the deck
  → Server emits `play-song` with trackId each turn

Host's browser receives `play-song`:
  → Calls Spotify Web API to play track on the SDK device
  → UI shows play/pause controls on the mystery card
  → All other metadata hidden until reveal

Token refresh:
  → SDK's `getOAuthToken` callback triggers client-side refresh
  → All track IDs resolved upfront so server never needs a fresh token
```

---

## Step-by-Step Implementation

### Step 1: Spotify OAuth Service (`app/src/services/spotify.ts`) — NEW FILE

Client-side Spotify auth using the **PKCE authorization flow** (no backend secret).

**Functions:**
- `getSpotifyAuthUrl()` — Generates auth URL with PKCE code challenge, scopes, and redirect URI. Stores code verifier in sessionStorage.
- `exchangeCodeForToken(code: string)` — Exchanges auth code for access + refresh tokens via Spotify's token endpoint. Returns `{ accessToken, refreshToken, expiresIn }`.
- `refreshAccessToken(refreshToken: string)` — Uses refresh token to get a new access token before expiry.
- `openSpotifyLogin()` — Opens a popup window to the auth URL. Listens for `postMessage` from the popup. Returns a Promise that resolves with `{ accessToken, refreshToken }`.

**Scopes needed:** `streaming`, `user-read-email`, `user-read-private`, `user-modify-playback-state`, `user-read-playback-state`

**Config:** Reads `VITE_SPOTIFY_CLIENT_ID` from env. Redirect URI: `${window.location.origin}/callback.html`.

**Token storage:**
- Access token: zustand store (in-memory only, never persisted)
- Refresh token: sessionStorage (survives tab refresh, clears on tab close)

### Step 2: OAuth Callback Page (`app/public/callback.html`) — NEW FILE

A **lightweight static HTML file** (no React, no bundle) that:
1. Reads the `code` query parameter from the URL
2. Reads the PKCE code verifier from sessionStorage (shared with opener since same origin)
3. Calls Spotify's token endpoint via `fetch` to exchange code for tokens
4. Sends `{ accessToken, refreshToken, expiresIn }` to opener via `window.opener.postMessage`
5. Closes itself

This avoids loading the entire React app in the popup. ~30 lines of vanilla JS.

**Note:** The Client ID is embedded in this file. Since it's a public PKCE app (no secret), this is safe — same as any SPA.

### Step 3: Spotify Playback SDK Service (`app/src/services/spotifyPlayer.ts`) — NEW FILE

Manages the Spotify Web Playback SDK lifecycle as a singleton.

**Setup:**
- `initPlayer(getToken: () => Promise<string>)` — Dynamically loads SDK script (`https://sdk.scdn.co/spotify-player.js`), waits for `window.onSpotifyWebPlaybackSDKReady`, creates `Spotify.Player` instance. The `getToken` callback is wired to token refresh logic from Step 1. Connects and waits for `ready` event → stores `device_id`. Guards against double-init (idempotent).
- Listens for `authentication_error` → sets `spotifyReady: false` in store, surfaces "Spotify Premium required" error.

**Playback methods:**
- `playTrack(trackId: string)` — Calls `PUT https://api.spotify.com/v1/me/player/play` with `{"uris": ["spotify:track:{trackId}"], "position_ms": 0}` targeting our device_id.
- `pause()` — Calls `player.pause()`
- `resume()` — Calls `player.resume()`

**Cleanup:**
- `disconnect()` — Disconnects player on unmount

**Error handling:**
- `authentication_error` → "Spotify Premium required" message surfaced to UI
- `playback_error` → Log and continue (non-fatal)
- Network errors on `playTrack` → Retry once, then skip silently

### Step 4: Update Env Types + Config

**`app/src/vite-env.d.ts`** — Add `VITE_SPOTIFY_CLIENT_ID: string` to `ImportMetaEnv`.

**`app/.env.example`** — NEW FILE:
```
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
```

### Step 5: Add Spotify State to Store (`app/src/store.ts`)

```typescript
// Spotify
spotifyToken: string | null;       // access token (memory only)
spotifyRefreshToken: string | null; // refresh token (also in sessionStorage)
spotifyDeviceId: string | null;
spotifyReady: boolean;
spotifyError: string | null;       // e.g. "Spotify Premium required"
isPlaying: boolean;
isHost: boolean;                   // derived from hostId === myId
```

Plus corresponding setters. The `reset()` action clears all Spotify state.

On store init, check sessionStorage for a refresh token — if found, attempt a silent token refresh to restore the session (host tab refresh recovery).

### Step 6: Update Home.tsx — Host Flow

When user clicks "Host Game" → enters the host sub-screen:
1. Show "Connect to Spotify" button (Spotify green, with Spotify icon)
2. On click → call `openSpotifyLogin()` (popup)
3. Show "Connecting to Spotify..." spinner during popup flow
4. On success → store tokens, then emit `create-room` with `{ playerName, spotifyAccessToken }`
5. If popup blocked → show "Please allow popups for this site"
6. If popup closed without completing → show "Spotify login cancelled"

Non-hosts joining don't see any Spotify UI — their flow is unchanged.

### Step 7: Spotify Player Hook (`app/src/hooks/useSpotifyPlayer.ts`) — NEW FILE

A React hook used in `Game.tsx` that:
1. Checks if user is the host AND has a Spotify token
2. If yes, calls `initPlayer()` from Step 3
3. On `ready` → sets `spotifyDeviceId` and `spotifyReady` in store
4. Watches `phase` changes for auto-play/pause:
   - `phase === 'playing'` + new `currentTrackId` → `playTrack(trackId)`
   - `phase === 'challenge'` → `pause()`
   - `phase === 'reveal'` → `pause()`
5. Exposes `togglePlayback()` for the play/pause button
6. Cleans up on unmount → `disconnect()`

**Host refresh recovery:** On mount, if sessionStorage has a refresh token but no active SDK player, re-initializes the player. The server will re-emit `play-song` for the current track on reconnect (via `state-sync`).

### Step 8: Server — Resolve Track IDs on Game Start

**`server/src/songs.ts`** — Add:
```typescript
// In-memory cache: "title::artist" → spotifyTrackId
const trackIdCache = new Map<string, string>();

export async function resolveTrackIds(
  deck: SongCard[],
  accessToken: string
): Promise<SongCard[]>
```
- Checks cache first for each song
- Resolves uncached songs via `resolveSpotifyTrackId()` with concurrency limit of 5
- Caches successful results
- **Filters out songs that couldn't be resolved** (returns only playable songs)
- Logs: "Resolved 47/50 tracks (3 not found on Spotify)"

**`server/src/rooms.ts`** — In the `start-game` handler:
1. Select deck via `selectGameDeck()`
2. If GameEngine has a Spotify token, call `resolveTrackIds(deck, token)`
3. Emit `'resolving-tracks'` before resolution so client can show loading
4. Use the filtered deck (only songs with track IDs)
5. Pass to `engine.startGame(filteredDeck)`

**`shared/src/events.ts`** — Add server-to-client event:
```typescript
'resolving-tracks': () => void;
```

### Step 9: Handle `play-song` Event on Client (`app/src/hooks/useSocket.ts`)

Add listener:
```typescript
socket.on('play-song', ({ spotifyTrackId }) => {
  store.setCurrentTrackId(spotifyTrackId);
});

socket.on('resolving-tracks', () => {
  // Could set a loading state if desired
});
```

Add `currentTrackId: string | null` to the store. The `useSpotifyPlayer` hook watches this and triggers playback.

### Step 10: Update Game.tsx — Playback UI

The mystery card center area becomes playback-aware:

**Host sees (during `playing` phase):**
- Large circular play/pause toggle button (centered, ~80px)
- Animated equalizer bars when playing
- Text: "Now Playing" or "Paused"
- No song title, artist, or year — just the controls

**Non-host sees:**
- The existing "?" mystery card
- Equalizer animation when phase is `playing` (assumes host is playing)
- Text: "Listen to the song..."

**During challenge phase:**
- Music auto-pauses
- Card shows "Challenge!" (existing behavior)

**During reveal:**
- Music stopped
- Song details shown (existing behavior)

**Lobby loading state:**
- When `resolving-tracks` is received, show "Loading songs..." overlay before game starts

### Step 11: Spotify Type Declarations (`app/src/types/spotify.d.ts`) — NEW FILE

Declare the Spotify Web Playback SDK types needed:
```typescript
declare namespace Spotify {
  class Player {
    constructor(options: PlayerOptions);
    connect(): Promise<boolean>;
    disconnect(): void;
    pause(): Promise<void>;
    resume(): Promise<void>;
    getCurrentState(): Promise<PlaybackState | null>;
    addListener(event: string, callback: Function): void;
    removeListener(event: string): void;
  }
  interface PlayerOptions {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume?: number;
  }
  interface PlaybackState {
    paused: boolean;
    position: number;
    duration: number;
    track_window: { current_track: Track };
  }
  interface Track {
    uri: string;
    id: string;
    name: string;
    artists: { name: string }[];
  }
  interface WebPlaybackError {
    message: string;
  }
}

interface Window {
  onSpotifyWebPlaybackSDKReady: () => void;
  Spotify: { Player: typeof Spotify.Player };
}
```

### Step 12: Auto-pause/resume Logic

Handled in the `useSpotifyPlayer` hook by watching store state:

| Trigger | Action |
|---------|--------|
| `phase` → `playing` + new `currentTrackId` | `playTrack(trackId)` |
| `phase` → `challenge` | `pause()` |
| `phase` → `reveal` | `pause()` |
| Host clicks play/pause button | `resume()` / `pause()` |
| Skip song | Playback stops (new turn auto-plays next) |

---

## Files Changed (Summary)

| File | Action | Purpose |
|------|--------|---------|
| `app/src/services/spotify.ts` | **NEW** | OAuth PKCE flow + token refresh |
| `app/src/services/spotifyPlayer.ts` | **NEW** | Web Playback SDK wrapper (singleton) |
| `app/public/callback.html` | **NEW** | Lightweight OAuth callback (vanilla JS) |
| `app/src/hooks/useSpotifyPlayer.ts` | **NEW** | React hook for SDK lifecycle + auto-play |
| `app/src/types/spotify.d.ts` | **NEW** | TypeScript declarations for SDK |
| `app/.env.example` | **NEW** | Environment variable template |
| `app/src/vite-env.d.ts` | Edit | Add `VITE_SPOTIFY_CLIENT_ID` |
| `app/src/store.ts` | Edit | Add Spotify state + currentTrackId |
| `app/src/components/Home.tsx` | Edit | Spotify login on host flow |
| `app/src/components/Game.tsx` | Edit | Play/pause UI on mystery card |
| `app/src/hooks/useSocket.ts` | Edit | Handle `play-song` + `resolving-tracks` |
| `server/src/rooms.ts` | Edit | Resolve track IDs on game start |
| `server/src/songs.ts` | Edit | Batch resolution + cache + filtering |
| `shared/src/events.ts` | Edit | Add `resolving-tracks` event |

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Popup blocked | Show "Please allow popups" message on Home screen |
| Popup closed early | Show "Spotify login cancelled" |
| Free Spotify account | SDK emits `authentication_error` → show "Spotify Premium required" |
| Song not found on Spotify | Filtered out of deck before game starts |
| All songs fail resolution | Show error, don't start game |
| Token expires mid-game | SDK's `getOAuthToken` callback triggers refresh via stored refresh token |
| Host refreshes browser | Re-init SDK from sessionStorage refresh token; server re-syncs state |
| `playTrack` API fails | Retry once, then skip (game continues without audio for that turn) |
| Network error during resolution | Retry failed songs once, then filter them out |

---

## Production Notes

- **HTTPS required:** The Spotify Web Playback SDK requires HTTPS in production. Localhost (`http://localhost`) is the only HTTP exception. Any deployment must use HTTPS.
- **Spotify app settings:** The redirect URI in the Spotify Developer Dashboard must exactly match `{origin}/callback.html` for each environment (localhost, production domain).
- **Rate limits:** Spotify Search API allows ~30 req/s. With concurrency of 5 and 50 songs, we're well within limits. The in-memory cache prevents redundant calls across games.

---

## Testing Steps

1. **Register a Spotify app:**
   - Go to https://developer.spotify.com/dashboard
   - Create a new app
   - Add `Web API` and `Web Playback SDK` to the app's APIs
   - Set redirect URI to `http://localhost:5173/callback.html`
   - Copy the Client ID

2. **Configure the app:**
   - Create `app/.env` with `VITE_SPOTIFY_CLIENT_ID=<your_client_id>`

3. **Run the app:**
   - `npm run dev` (starts server on :3000 + client on :5173)

4. **Test the full flow:**
   - Enter name, click "Host Game"
   - Click "Connect to Spotify" → popup opens → authorize
   - Room created, you land in lobby
   - Open a second browser tab (or incognito), enter name, join with room code
   - Host clicks "Start Game"
   - Brief "Loading songs..." while track IDs resolve
   - Music auto-plays on host's browser
   - Host sees large play/pause button on mystery card
   - Other player sees "?" card with "Listen to the song..."
   - Place card → music pauses during challenge window
   - Reveal → song details shown, music stopped
   - Continue → next turn, new song auto-plays

5. **Edge cases to verify:**
   - Popup blocked → helpful message shown
   - Close popup without authorizing → "cancelled" message
   - Host refreshes mid-game → SDK reconnects, game resumes
   - Free Spotify account → "Premium required" error
   - Song missing from Spotify → silently filtered, game uses remaining songs
