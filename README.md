# Hitster

A real-time multiplayer music party game where players compete to build a chronological timeline of hit songs. Inspired by the popular Hitster card game.

## How It Works

1. **Host a room** — One player creates a game room and shares the 4-letter code
2. **Others join** — Friends enter the code to join the lobby
3. **A song plays** — Each turn, a mystery song is revealed to all players
4. **Place it on your timeline** — The active player guesses where the song falls chronologically among their existing cards
5. **Challenge!** — Other players can spend a token to challenge if they think the placement is wrong
6. **First to collect enough cards wins!**

## Features

- **Real-time multiplayer** — 2-10 players per room via WebSockets
- **233 songs** spanning 1931-2024 with decade-balanced deck selection
- **Token economy** — Skip songs, challenge placements, buy cards, or earn tokens by naming songs
- **4 game modes** — Original, Pro, Expert, and Co-op
- **Challenge system** — 15-second window for other players to challenge a placement; steal cards from wrong guesses
- **Song naming bonus** — Guess the title and artist correctly to earn extra tokens
- **Connection handling** — Tracks player online/offline status, reassigns host on disconnect
- **Spotify-ready** — Server supports Spotify track ID resolution for music playback

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS 4, Zustand, Motion |
| Backend | Node.js, Express, Socket.io |
| Shared | TypeScript types, constants, and typed Socket.io events |
| Data | JSON song database (233 tracks) |

## Project Structure

```
hitster/
├── app/                    # React frontend
│   └── src/
│       ├── components/     # Home, Lobby, Game, Results, Rules screens
│       ├── hooks/          # useSocket — wires Socket.io events to Zustand
│       ├── services/       # Socket.io client singleton
│       └── store.ts        # Zustand state management
├── server/                 # Express + Socket.io backend
│   └── src/
│       ├── index.ts        # Server entry point
│       ├── rooms.ts        # Room creation, joining, leaving
│       ├── game.ts         # GameEngine — turns, placement, challenges, scoring
│       └── songs.ts        # Song loading and deck selection
├── shared/                 # Shared TypeScript package
│   └── src/
│       ├── types.ts        # Player, Room, GameState, SongCard, etc.
│       ├── constants.ts    # Game constants (tokens, costs, limits)
│       └── events.ts       # Typed client/server Socket.io events
└── data/
    └── songs.json          # 233 songs from 1931-2024
```

## Getting Started

### Prerequisites

- Node.js 18+

### Install & Run

```bash
npm install
npm run dev
```

This builds the shared types, then starts both the server (port 3000) and the frontend (port 5173) concurrently. The frontend proxies Socket.io connections to the server automatically.

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build:shared
npm run build:server
npm run build:app
```

## Game Rules

### Objective

Be the first player to collect the target number of song cards (default: 10) by placing them in the correct chronological order on your timeline.

### Tokens

Each player starts with 2 tokens (max 5). Use them for:

| Action | Cost |
|--------|------|
| Skip a song | 1 token |
| Challenge a placement | 1 token |
| Buy a card (auto-placed correctly) | 3 tokens |
| Name the song correctly | +1 token |

### Turn Flow

1. A mystery song card is drawn from the deck
2. The active player places it on their timeline
3. Other players have 15 seconds to challenge the placement (costs 1 token)
4. The song is revealed:
   - **Correct placement** — the active player keeps the card
   - **Wrong placement + challenger** — the first challenger steals the card
   - **Wrong placement + no challenger** — the card is discarded

### Game Modes

- **Original** — Place the card. Optionally name the song for a bonus token.
- **Pro** — Must place correctly AND name the song.
- **Expert** — Must place, name, AND guess the exact year.
- **Co-op** — Shared timeline, work together!

## License

Private project.
