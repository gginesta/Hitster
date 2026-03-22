import { View, Text, StyleSheet } from 'react-native';
import type { Player } from '@hitster/shared';

interface Props {
  players: Record<string, Player>;
  hostId?: string;
  myId?: string | null;
  showCards?: boolean;
}

const PLAYER_COLORS = [
  '#1DB954', '#e94560', '#f9a825', '#00bcd4',
  '#ab47bc', '#ff7043', '#66bb6a', '#42a5f5',
  '#ef5350', '#26c6da',
];

export default function PlayerList({ players, hostId, myId, showCards }: Props) {
  const playerList = Object.values(players);

  return (
    <View style={styles.container}>
      {playerList.map((player, index) => (
        <View key={player.id} style={styles.playerRow}>
          <View
            style={[styles.avatar, { backgroundColor: PLAYER_COLORS[index % PLAYER_COLORS.length] }]}
          >
            <Text style={styles.avatarText}>
              {player.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>
              {player.name}
              {player.id === myId ? ' (You)' : ''}
            </Text>
            {player.id === hostId && (
              <Text style={styles.hostBadge}>HOST</Text>
            )}
          </View>
          {showCards && (
            <Text style={styles.cardCount}>
              {player.timeline.length} cards
            </Text>
          )}
          {!player.connected && (
            <Text style={styles.disconnected}>offline</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hostBadge: {
    color: '#f9a825',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: '#f9a82520',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardCount: {
    color: '#888',
    fontSize: 14,
  },
  disconnected: {
    color: '#ff4757',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
