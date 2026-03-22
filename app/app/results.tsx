import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../stores/gameStore';
import { getSocket } from '../services/socket';
import PlayerList from '../components/PlayerList';
import Timeline from '../components/Timeline';

export default function ResultsScreen() {
  const router = useRouter();
  const socket = getSocket();

  const winnerId = useGameStore((s) => s.winnerId);
  const players = useGameStore((s) => s.players);
  const myId = useGameStore((s) => s.myId);

  const winner = winnerId ? players[winnerId] : null;

  const sortedPlayers = Object.values(players).sort(
    (a, b) => b.timeline.length - a.timeline.length
  );

  const handlePlayAgain = () => {
    // Return to lobby with same room
    router.replace('/lobby');
  };

  const handleGoHome = () => {
    socket.emit('leave-room');
    useGameStore.getState().reset();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Winner Banner */}
        <View style={styles.winnerBanner}>
          <Text style={styles.winnerLabel}>HITSTER!</Text>
          <Text style={styles.winnerName}>
            {winner?.id === myId ? 'You Win!' : `${winner?.name || '???'} Wins!`}
          </Text>
          <Text style={styles.winnerCards}>
            {winner?.timeline.length} cards collected
          </Text>
        </View>

        {/* Standings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Final Standings</Text>
          {sortedPlayers.map((player, index) => (
            <View key={player.id} style={styles.standing}>
              <View style={styles.standingHeader}>
                <Text style={styles.rank}>#{index + 1}</Text>
                <Text style={styles.standingName}>
                  {player.name}
                  {player.id === myId ? ' (You)' : ''}
                </Text>
                <Text style={styles.standingCards}>
                  {player.timeline.length} cards
                </Text>
              </View>
              <Timeline cards={player.timeline} />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 16,
    paddingTop: 56,
    gap: 24,
  },
  winnerBanner: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#16213e',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1DB954',
  },
  winnerLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1DB954',
    letterSpacing: 4,
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  winnerCards: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  standing: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    overflow: 'hidden',
  },
  standingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  rank: {
    color: '#f9a825',
    fontSize: 18,
    fontWeight: '900',
    width: 36,
  },
  standingName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  standingCards: {
    color: '#888',
    fontSize: 14,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    gap: 8,
  },
  playAgainButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: '#16213e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  homeButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
});
