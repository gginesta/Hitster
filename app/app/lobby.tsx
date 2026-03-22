import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../stores/gameStore';
import { getSocket } from '../services/socket';
import PlayerList from '../components/PlayerList';
import type { GameMode } from '@hitster/shared';
import { MIN_PLAYERS, MIN_CARDS_TO_WIN, MAX_CARDS_TO_WIN } from '@hitster/shared';

const MODES: { key: GameMode; label: string; desc: string }[] = [
  { key: 'original', label: 'Original', desc: 'Place songs in timeline order' },
  { key: 'pro', label: 'Pro', desc: 'Must also name artist & title' },
  { key: 'expert', label: 'Expert', desc: 'Must name exact year too' },
  { key: 'coop', label: 'Co-op', desc: 'Work together as a team' },
];

export default function LobbyScreen() {
  const router = useRouter();
  const socket = getSocket();

  const roomCode = useGameStore((s) => s.roomCode);
  const players = useGameStore((s) => s.players);
  const isHost = useGameStore((s) => s.isHost);
  const myId = useGameStore((s) => s.myId);
  const settings = useGameStore((s) => s.settings);
  const phase = useGameStore((s) => s.phase);

  // Navigate to game when started
  useGameStore.subscribe((state, prevState) => {
    if (state.phase === 'playing' && prevState.phase === 'lobby') {
      router.push('/game');
    }
  });

  const playerCount = Object.keys(players).length;
  const canStart = playerCount >= MIN_PLAYERS;

  const handleModeChange = (mode: GameMode) => {
    socket.emit('update-settings', { mode });
  };

  const handleCardsChange = (delta: number) => {
    const newVal = Math.min(MAX_CARDS_TO_WIN, Math.max(MIN_CARDS_TO_WIN, settings.cardsToWin + delta));
    socket.emit('update-settings', { cardsToWin: newVal });
  };

  const handleStart = () => {
    socket.emit('start-game');
  };

  const handleLeave = () => {
    socket.emit('leave-room');
    useGameStore.getState().reset();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLeave}>
          <Text style={styles.leaveText}>Leave</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game Lobby</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Room Code */}
        <View style={styles.codeSection}>
          <Text style={styles.codeLabel}>Room Code</Text>
          <Text style={styles.codeValue}>{roomCode}</Text>
          <Text style={styles.codeHint}>Share this code with friends!</Text>
        </View>

        {/* Players */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Players ({playerCount})
          </Text>
          <PlayerList
            players={players}
            hostId={Object.values(players).find((p) => p.isHost)?.id}
            myId={myId}
          />
        </View>

        {/* Settings (host only) */}
        {isHost && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Settings</Text>

            <Text style={styles.settingLabel}>Game Mode</Text>
            <View style={styles.modeGrid}>
              {MODES.map((m) => (
                <TouchableOpacity
                  key={m.key}
                  style={[
                    styles.modeButton,
                    settings.mode === m.key && styles.modeButtonActive,
                  ]}
                  onPress={() => handleModeChange(m.key)}
                >
                  <Text
                    style={[
                      styles.modeLabel,
                      settings.mode === m.key && styles.modeLabelActive,
                    ]}
                  >
                    {m.label}
                  </Text>
                  <Text style={styles.modeDesc}>{m.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.settingLabel}>Cards to Win</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => handleCardsChange(-1)}
              >
                <Text style={styles.stepText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepValue}>{settings.cardsToWin}</Text>
              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => handleCardsChange(1)}
              >
                <Text style={styles.stepText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!isHost && (
          <View style={styles.section}>
            <Text style={styles.settingLabel}>
              Mode: {MODES.find((m) => m.key === settings.mode)?.label}
            </Text>
            <Text style={styles.settingLabel}>
              Cards to Win: {settings.cardsToWin}
            </Text>
            <Text style={styles.waitText}>Waiting for host to start...</Text>
          </View>
        )}
      </ScrollView>

      {isHost && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.startButton, !canStart && styles.buttonDisabled]}
            onPress={handleStart}
            disabled={!canStart}
          >
            <Text style={styles.startButtonText}>
              {canStart ? 'Start Game' : `Need ${MIN_PLAYERS - playerCount} more player(s)`}
            </Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
  },
  leaveText: {
    color: '#ff4757',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  codeSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#16213e',
    borderRadius: 16,
  },
  codeLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  codeValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1DB954',
    letterSpacing: 12,
  },
  codeHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  settingLabel: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  modeGrid: {
    gap: 8,
  },
  modeButton: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeButtonActive: {
    borderColor: '#1DB954',
  },
  modeLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modeLabelActive: {
    color: '#1DB954',
  },
  modeDesc: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    alignSelf: 'center',
    marginTop: 8,
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#16213e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  stepValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
  },
  waitText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  startButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
