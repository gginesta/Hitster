import { useEffect } from 'react';
import { getSocket, connectSocket } from '../services/socket';
import { useGameStore } from '../stores/gameStore';
import { playTrack } from '../services/spotify';

export function useSocket() {
  const store = useGameStore();

  useEffect(() => {
    const socket = connectSocket();

    socket.on('connect', () => {
      store.setConnected(true);
    });

    socket.on('disconnect', () => {
      store.setConnected(false);
    });

    socket.on('room-created', ({ code, playerId }) => {
      store.setMyId(playerId);
      store.setRoomCode(code);
      store.setIsHost(true);
    });

    socket.on('room-joined', ({ room, playerId }) => {
      store.setMyId(playerId);
      store.setRoomCode(room.code);
      store.setIsHost(false);
      store.syncRoom(room);
    });

    socket.on('player-joined', (player) => {
      store.addPlayer(player);
    });

    socket.on('player-left', (playerId) => {
      store.removePlayer(playerId);
    });

    socket.on('settings-updated', (settings) => {
      store.setSettings(settings);
    });

    socket.on('game-started', ({ gameState }) => {
      store.setPhase(gameState.phase);
      store.setCurrentTurn(gameState.currentTurnPlayerId!);
      store.setDeckSize(gameState.deckSize);
    });

    socket.on('new-turn', ({ turnPlayerId, songCard }) => {
      store.setPhase('playing');
      store.setCurrentTurn(turnPlayerId);
      store.setCurrentSong(songCard);
      store.setPendingPlacement(null);
      store.setLastReveal(null);
    });

    socket.on('play-song', async ({ spotifyTrackId }) => {
      const token = useGameStore.getState().spotifyAccessToken;
      if (token && useGameStore.getState().isHost) {
        await playTrack(spotifyTrackId, token);
      }
    });

    socket.on('card-placed', ({ position }) => {
      store.setPendingPlacement(position);
      store.setPhase('challenge');
    });

    socket.on('challenge-made', () => {
      // UI can show challenge indicator
    });

    socket.on('reveal', (data) => {
      store.setPhase('reveal');
      store.setLastReveal(data);
    });

    socket.on('tokens-updated', ({ playerId, tokens }) => {
      store.updatePlayerTokens(playerId, tokens);
    });

    socket.on('timeline-updated', ({ playerId, timeline }) => {
      store.updatePlayerTimeline(playerId, timeline);
    });

    socket.on('game-over', ({ winnerId }) => {
      store.setPhase('game_over');
      store.setWinner(winnerId);
    });

    socket.on('state-sync', (room) => {
      store.syncRoom(room);
    });

    socket.on('error', ({ message }) => {
      console.warn('Server error:', message);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return getSocket();
}
