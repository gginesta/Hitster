import { create } from 'zustand';
import type { Room, Player, SongCard, GameSettings, GamePhase } from '@hitster/shared';

interface GameStore {
  // Connection
  myId: string | null;
  roomCode: string | null;
  isHost: boolean;
  connected: boolean;

  // Room state
  players: Record<string, Player>;
  settings: GameSettings;

  // Game state
  phase: GamePhase;
  currentTurnPlayerId: string | null;
  currentSong: Partial<SongCard> | null;
  pendingPlacement: number | null;
  myTimeline: SongCard[];
  myTokens: number;
  deckSize: number;

  // Reveal
  lastReveal: {
    song: SongCard;
    correct: boolean;
    winnerId: string | null;
    stolenBy: string | null;
  } | null;

  // Winner
  winnerId: string | null;

  // Spotify
  spotifyAccessToken: string | null;

  // Actions
  setMyId: (id: string) => void;
  setRoomCode: (code: string) => void;
  setIsHost: (isHost: boolean) => void;
  setConnected: (connected: boolean) => void;
  setSpotifyAccessToken: (token: string | null) => void;
  syncRoom: (room: Room) => void;
  setPlayers: (players: Record<string, Player>) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setSettings: (settings: GameSettings) => void;
  setPhase: (phase: GamePhase) => void;
  setCurrentTurn: (playerId: string) => void;
  setCurrentSong: (song: Partial<SongCard> | null) => void;
  setPendingPlacement: (position: number | null) => void;
  setMyTimeline: (timeline: SongCard[]) => void;
  setMyTokens: (tokens: number) => void;
  updatePlayerTimeline: (playerId: string, timeline: SongCard[]) => void;
  updatePlayerTokens: (playerId: string, tokens: number) => void;
  setDeckSize: (size: number) => void;
  setLastReveal: (reveal: GameStore['lastReveal']) => void;
  setWinner: (winnerId: string) => void;
  reset: () => void;
}

const initialState = {
  myId: null,
  roomCode: null,
  isHost: false,
  connected: false,
  players: {},
  settings: { mode: 'original' as const, cardsToWin: 10 },
  phase: 'lobby' as GamePhase,
  currentTurnPlayerId: null,
  currentSong: null,
  pendingPlacement: null,
  myTimeline: [],
  myTokens: 2,
  deckSize: 0,
  lastReveal: null,
  winnerId: null,
  spotifyAccessToken: null,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setMyId: (id) => set({ myId: id }),
  setRoomCode: (code) => set({ roomCode: code }),
  setIsHost: (isHost) => set({ isHost }),
  setConnected: (connected) => set({ connected }),
  setSpotifyAccessToken: (token) => set({ spotifyAccessToken: token }),

  syncRoom: (room) =>
    set((state) => ({
      players: room.players,
      settings: room.settings,
      phase: room.gameState.phase,
      currentTurnPlayerId: room.gameState.currentTurnPlayerId,
      deckSize: room.gameState.deckSize,
      myTimeline: state.myId ? room.players[state.myId]?.timeline || [] : [],
      myTokens: state.myId ? room.players[state.myId]?.tokens || 0 : 0,
    })),

  setPlayers: (players) => set({ players }),
  addPlayer: (player) =>
    set((state) => ({ players: { ...state.players, [player.id]: player } })),
  removePlayer: (playerId) =>
    set((state) => {
      const { [playerId]: _, ...rest } = state.players;
      return { players: rest };
    }),
  setSettings: (settings) => set({ settings }),
  setPhase: (phase) => set({ phase }),
  setCurrentTurn: (playerId) => set({ currentTurnPlayerId: playerId }),
  setCurrentSong: (song) => set({ currentSong: song }),
  setPendingPlacement: (position) => set({ pendingPlacement: position }),
  setMyTimeline: (timeline) => set({ myTimeline: timeline }),
  setMyTokens: (tokens) => set({ myTokens: tokens }),
  updatePlayerTimeline: (playerId, timeline) =>
    set((state) => {
      if (playerId === state.myId) return { myTimeline: timeline };
      const player = state.players[playerId];
      if (!player) return {};
      return {
        players: { ...state.players, [playerId]: { ...player, timeline } },
      };
    }),
  updatePlayerTokens: (playerId, tokens) =>
    set((state) => {
      if (playerId === state.myId) return { myTokens: tokens };
      const player = state.players[playerId];
      if (!player) return {};
      return {
        players: { ...state.players, [playerId]: { ...player, tokens } },
      };
    }),
  setDeckSize: (size) => set({ deckSize: size }),
  setLastReveal: (reveal) => set({ lastReveal: reveal }),
  setWinner: (winnerId) => set({ winnerId }),
  reset: () => set(initialState),
}));
