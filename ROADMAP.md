# Development Roadmap

## Current Status

The core game is fully functional as a local multiplayer experience. Players can host/join rooms, play through rounds of timeline placement, challenge each other, name songs for bonus tokens, and see final results.

### What's Built

- [x] Real-time multiplayer via Socket.io (2-10 players)
- [x] Room creation and joining with 4-letter codes
- [x] Full game loop: turns, placement, challenges, reveals, scoring
- [x] Token economy (skip, challenge, buy, name-song bonus)
- [x] 4 game mode options (Original, Pro, Expert, Co-op)
- [x] 233-song database spanning 1931-2024
- [x] Decade-balanced deck selection
- [x] Zustand state management with typed Socket.io events
- [x] Connection tracking and host reassignment
- [x] Animated UI with Motion library
- [x] How to Play / Rules screen
- [x] Responsive mobile-first design

---

## Phase 1: Spotify Integration

Make the game playable with real music.

- [ ] **Spotify OAuth flow** — Host authenticates via Spotify to enable music playback
- [ ] **Spotify Web Playback SDK** — Embed the Spotify player in the browser for the host
- [ ] **Track resolution** — Resolve song database entries to Spotify track IDs on game start
- [ ] **Playback controls** — Auto-play 30-second previews during each turn
- [ ] **Fallback for non-Premium** — Use Spotify preview URLs (30s clips) for free-tier users

## Phase 2: Game Mode Implementation

Currently the mode setting is stored but all modes play like Original.

- [ ] **Pro mode** — Require correct song naming in addition to placement to keep the card
- [ ] **Expert mode** — Require placement + song name + exact year guess
- [ ] **Co-op mode** — Shared timeline for all players; lose a token on wrong placement
- [ ] **Mode-specific UI** — Show different prompts and requirements per mode

## Phase 3: Polish & UX

- [ ] **Sound effects** — Card placement, correct/wrong feedback, challenge alert, win celebration
- [ ] **Turn timer** — Optional countdown for placing cards (30s, 60s, or unlimited)
- [ ] **Player avatars** — Choose from preset avatars or upload a photo
- [ ] **Chat / reactions** — Quick emoji reactions during gameplay
- [ ] **Spectator mode** — Join a room as an observer
- [ ] **Rematch flow** — Seamless "Play Again" that keeps the same room and rotates host

## Phase 4: Content Expansion

- [ ] **Expand song database** — Target 500+ songs with better decade/genre coverage
- [ ] **Genre packs** — Rock, Hip-Hop, Pop, Country, Electronic, etc.
- [ ] **Decade packs** — Focus on specific eras (60s, 80s, 2000s, etc.)
- [ ] **Regional packs** — UK hits, Latin music, K-pop, Bollywood
- [ ] **Custom playlists** — Host imports a Spotify playlist as the song source

## Phase 5: Persistence & Accounts

- [ ] **User accounts** — Sign in with Spotify or email
- [ ] **Game history** — Track wins, streaks, and favourite decades
- [ ] **Leaderboards** — Global and friend-based rankings
- [ ] **Statistics** — Which decades you're strongest at, most challenged songs, etc.

## Phase 6: Deployment & Infrastructure

- [ ] **Production deployment** — Host on a cloud provider (Railway, Fly.io, or Vercel + separate server)
- [ ] **Environment config** — Proper .env handling for Spotify credentials and server URLs
- [ ] **Database** — Move rooms/game state to Redis for horizontal scaling
- [ ] **CDN** — Serve the frontend via CDN for fast global access
- [ ] **Monitoring** — Error tracking and basic analytics

---

## Known Issues

- Game modes (Pro, Expert, Co-op) are selectable but don't enforce mode-specific rules yet
- Spotify playback is wired on the server but the frontend doesn't have the Web Playback SDK integrated
- No persistent storage — rooms are lost if the server restarts
- `concurrently` package is referenced in the root dev script but not listed as a dependency
