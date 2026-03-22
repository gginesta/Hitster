import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getSocket } from '../services/socket';
import { useGameStore } from '../stores/gameStore';
import { useSpotify } from '../hooks/useSpotify';
import RoomCodeInput from '../components/RoomCodeInput';

export default function HomeScreen() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState<'idle' | 'host' | 'join'>('idle');
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useSpotify();
  const spotifyAccessToken = useGameStore((s) => s.spotifyAccessToken);
  const roomCode = useGameStore((s) => s.roomCode);

  const socket = getSocket();

  // Navigate when room is created/joined
  useGameStore.subscribe((state, prevState) => {
    if (state.roomCode && state.roomCode !== prevState.roomCode) {
      router.push('/lobby');
    }
  });

  const handleHost = async () => {
    if (!playerName.trim()) {
      setError('Enter your name');
      return;
    }

    if (!isAuthenticated) {
      const success = await login();
      if (!success) {
        setError('Spotify login required to host');
        return;
      }
    }

    setError('');
    socket.emit('create-room', {
      playerName: playerName.trim(),
      spotifyAccessToken: spotifyAccessToken || undefined,
    });
  };

  const handleJoin = () => {
    if (!playerName.trim()) {
      setError('Enter your name');
      return;
    }
    if (joinCode.length !== 4) {
      setError('Enter a 4-letter room code');
      return;
    }

    setError('');
    socket.emit('join-room', {
      code: joinCode.toUpperCase(),
      playerName: playerName.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>HITSTER</Text>
        <Text style={styles.subtitle}>The Music Timeline Game</Text>

        <TextInput
          style={styles.nameInput}
          placeholder="Your name"
          placeholderTextColor="#666"
          value={playerName}
          onChangeText={setPlayerName}
          maxLength={20}
          autoCapitalize="words"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {mode === 'idle' && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.hostButton]}
              onPress={() => setMode('host')}
            >
              <Text style={styles.buttonText}>Host Game</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.joinButton]}
              onPress={() => setMode('join')}
            >
              <Text style={styles.buttonText}>Join Game</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'host' && (
          <View style={styles.actionArea}>
            {!isAuthenticated && (
              <Text style={styles.hint}>
                As host, you'll need Spotify Premium to play music
              </Text>
            )}
            <TouchableOpacity
              style={[styles.button, styles.spotifyButton]}
              onPress={handleHost}
            >
              <Text style={styles.buttonText}>
                {isAuthenticated ? 'Create Room' : 'Connect Spotify & Host'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('idle')}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'join' && (
          <View style={styles.actionArea}>
            <Text style={styles.hint}>Enter room code</Text>
            <RoomCodeInput value={joinCode} onChange={setJoinCode} />
            <TouchableOpacity
              style={[
                styles.button,
                styles.joinButton,
                joinCode.length !== 4 && styles.buttonDisabled,
              ]}
              onPress={handleJoin}
              disabled={joinCode.length !== 4}
            >
              <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('idle')}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1DB954',
    letterSpacing: 8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
  },
  nameInput: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  error: {
    color: '#ff4757',
    fontSize: 14,
    marginBottom: 12,
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
    marginTop: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  hostButton: {
    backgroundColor: '#1DB954',
  },
  joinButton: {
    backgroundColor: '#e94560',
  },
  spotifyButton: {
    backgroundColor: '#1DB954',
    width: '100%',
    maxWidth: 300,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  actionArea: {
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
    width: '100%',
    maxWidth: 300,
  },
  hint: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  backText: {
    color: '#888',
    fontSize: 16,
    marginTop: 8,
  },
});
