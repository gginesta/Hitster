import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../stores/gameStore';
import { getSocket } from '../services/socket';
import SongCard from '../components/SongCard';
import Timeline from '../components/Timeline';
import TokenDisplay from '../components/TokenDisplay';

export default function GameScreen() {
  const router = useRouter();
  const socket = getSocket();

  const myId = useGameStore((s) => s.myId);
  const players = useGameStore((s) => s.players);
  const phase = useGameStore((s) => s.phase);
  const currentTurnPlayerId = useGameStore((s) => s.currentTurnPlayerId);
  const currentSong = useGameStore((s) => s.currentSong);
  const myTimeline = useGameStore((s) => s.myTimeline);
  const myTokens = useGameStore((s) => s.myTokens);
  const deckSize = useGameStore((s) => s.deckSize);
  const lastReveal = useGameStore((s) => s.lastReveal);
  const settings = useGameStore((s) => s.settings);

  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [guessTitle, setGuessTitle] = useState('');
  const [guessArtist, setGuessArtist] = useState('');
  const [hasGuessed, setHasGuessed] = useState(false);

  const isMyTurn = currentTurnPlayerId === myId;
  const turnPlayerName =
    currentTurnPlayerId ? players[currentTurnPlayerId]?.name || '...' : '...';

  // Navigate to results on game over
  useGameStore.subscribe((state, prevState) => {
    if (state.phase === 'game_over' && prevState.phase !== 'game_over') {
      router.push('/results');
    }
  });

  const handlePlace = () => {
    if (selectedPosition === null) return;
    socket.emit('place-card', { position: selectedPosition });
    setSelectedPosition(null);
  };

  const handleSkip = () => {
    socket.emit('skip-song');
  };

  const handleChallenge = () => {
    socket.emit('challenge');
  };

  const handleNameSong = () => {
    if (!guessTitle.trim() || !guessArtist.trim()) return;
    socket.emit('name-song', {
      title: guessTitle.trim(),
      artist: guessArtist.trim(),
    });
    setHasGuessed(true);
  };

  const handleBuyCard = () => {
    socket.emit('buy-card');
  };

  const handleConfirmReveal = () => {
    socket.emit('confirm-reveal');
    setGuessTitle('');
    setGuessArtist('');
    setHasGuessed(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.turnInfo}>
          <Text style={styles.turnLabel}>
            {isMyTurn ? 'Your Turn!' : `${turnPlayerName}'s Turn`}
          </Text>
          <Text style={styles.deckInfo}>{deckSize} cards left</Text>
        </View>
        <TokenDisplay count={myTokens} size="large" />
      </View>

      {/* Player Scores */}
      <ScrollView horizontal style={styles.scoreBar} showsHorizontalScrollIndicator={false}>
        {Object.values(players).map((player) => (
          <View
            key={player.id}
            style={[
              styles.scoreChip,
              player.id === currentTurnPlayerId && styles.scoreChipActive,
            ]}
          >
            <Text style={styles.scoreName} numberOfLines={1}>
              {player.name}
            </Text>
            <Text style={styles.scoreCount}>
              {player.timeline.length}/{settings.cardsToWin}
            </Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView style={styles.mainArea} contentContainerStyle={styles.mainContent}>
        {/* Current Song Card */}
        {phase === 'playing' && currentSong && (
          <View style={styles.currentCard}>
            <Text style={styles.nowPlaying}>Now Playing...</Text>
            <SongCard song={currentSong} revealed={false} />
          </View>
        )}

        {/* Reveal */}
        {phase === 'reveal' && lastReveal && (
          <View style={styles.revealSection}>
            <SongCard
              song={lastReveal.song}
              revealed
              isCorrect={lastReveal.correct}
            />
            <Text
              style={[
                styles.revealText,
                { color: lastReveal.correct ? '#1DB954' : '#ff4757' },
              ]}
            >
              {lastReveal.correct
                ? 'Correct!'
                : lastReveal.stolenBy
                  ? `Stolen by ${players[lastReveal.stolenBy]?.name}!`
                  : 'Wrong placement!'}
            </Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleConfirmReveal}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Challenge Phase */}
        {phase === 'challenge' && !isMyTurn && (
          <View style={styles.challengeSection}>
            <Text style={styles.challengeText}>
              {turnPlayerName} placed their card. Challenge?
            </Text>
            <TouchableOpacity
              style={[styles.challengeButton, myTokens < 1 && styles.buttonDisabled]}
              onPress={handleChallenge}
              disabled={myTokens < 1}
            >
              <Text style={styles.challengeButtonText}>
                Challenge! (1 token)
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'challenge' && isMyTurn && (
          <Text style={styles.waitingText}>
            Waiting for challenges...
          </Text>
        )}

        {/* Name the Song (available during playing/challenge) */}
        {(phase === 'playing' || phase === 'challenge') && !hasGuessed && (
          <View style={styles.guessSection}>
            <Text style={styles.guessTitle}>Name this song (+1 token)</Text>
            <TextInput
              style={styles.guessInput}
              placeholder="Song title"
              placeholderTextColor="#666"
              value={guessTitle}
              onChangeText={setGuessTitle}
            />
            <TextInput
              style={styles.guessInput}
              placeholder="Artist"
              placeholderTextColor="#666"
              value={guessArtist}
              onChangeText={setGuessArtist}
            />
            <TouchableOpacity style={styles.guessButton} onPress={handleNameSong}>
              <Text style={styles.guessButtonText}>Submit Guess</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* My Timeline */}
      <View style={styles.timelineSection}>
        <Text style={styles.timelineLabel}>Your Timeline</Text>
        <Timeline
          cards={myTimeline}
          interactive={isMyTurn && phase === 'playing'}
          onInsert={setSelectedPosition}
          selectedPosition={selectedPosition}
        />
      </View>

      {/* Action Bar */}
      {isMyTurn && phase === 'playing' && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.actionButton, styles.skipButton, myTokens < 1 && styles.buttonDisabled]}
            onPress={handleSkip}
            disabled={myTokens < 1}
          >
            <Text style={styles.actionText}>Skip (1)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.placeButton,
              selectedPosition === null && styles.buttonDisabled,
            ]}
            onPress={handlePlace}
            disabled={selectedPosition === null}
          >
            <Text style={styles.actionText}>Place Card</Text>
          </TouchableOpacity>

          {myTokens >= 3 && (
            <TouchableOpacity
              style={[styles.actionButton, styles.buyButton]}
              onPress={handleBuyCard}
            >
              <Text style={styles.actionText}>Buy (3)</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 8,
  },
  turnInfo: {
    flex: 1,
  },
  turnLabel: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  deckInfo: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  scoreBar: {
    maxHeight: 44,
    paddingHorizontal: 12,
  },
  scoreChip: {
    backgroundColor: '#16213e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreChipActive: {
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  scoreName: {
    color: '#aaa',
    fontSize: 13,
    maxWidth: 80,
  },
  scoreCount: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  mainArea: {
    flex: 1,
  },
  mainContent: {
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  currentCard: {
    alignItems: 'center',
    gap: 12,
  },
  nowPlaying: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: '600',
  },
  revealSection: {
    alignItems: 'center',
    gap: 12,
  },
  revealText: {
    fontSize: 20,
    fontWeight: '800',
  },
  continueButton: {
    backgroundColor: '#16213e',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  challengeSection: {
    alignItems: 'center',
    gap: 12,
  },
  challengeText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  challengeButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  challengeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  waitingText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  guessSection: {
    width: '100%',
    maxWidth: 300,
    gap: 8,
    padding: 16,
    backgroundColor: '#16213e',
    borderRadius: 12,
  },
  guessTitle: {
    color: '#f9a825',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  guessInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    fontSize: 14,
  },
  guessButton: {
    backgroundColor: '#f9a825',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  guessButtonText: {
    color: '#1a1a2e',
    fontSize: 14,
    fontWeight: '700',
  },
  timelineSection: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  timelineLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  actionBar: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeButton: {
    backgroundColor: '#1DB954',
    flex: 2,
  },
  skipButton: {
    backgroundColor: '#666',
  },
  buyButton: {
    backgroundColor: '#f9a825',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
