import { View, Text, StyleSheet } from 'react-native';
import type { SongCard as SongCardType } from '@hitster/shared';

interface Props {
  song: Partial<SongCardType>;
  revealed?: boolean;
  isCorrect?: boolean | null;
  compact?: boolean;
}

const DECADE_COLORS: Record<number, string> = {
  1930: '#8B4513',
  1940: '#A0522D',
  1950: '#CD853F',
  1960: '#FF6347',
  1970: '#FF8C00',
  1980: '#FF1493',
  1990: '#9370DB',
  2000: '#4169E1',
  2010: '#00CED1',
  2020: '#1DB954',
};

function getDecadeColor(year?: number): string {
  if (!year) return '#333';
  const decade = Math.floor(year / 10) * 10;
  return DECADE_COLORS[decade] || '#333';
}

export default function SongCard({ song, revealed = true, isCorrect, compact }: Props) {
  const showInfo = revealed && song.title;
  const borderColor =
    isCorrect === true ? '#1DB954' : isCorrect === false ? '#ff4757' : 'transparent';

  return (
    <View
      style={[
        compact ? styles.compactCard : styles.card,
        { borderColor, borderWidth: isCorrect !== null && isCorrect !== undefined ? 2 : 0 },
        showInfo && { backgroundColor: getDecadeColor(song.year) + '30' },
      ]}
    >
      {showInfo ? (
        <>
          <Text style={compact ? styles.compactYear : styles.year}>{song.year}</Text>
          <Text style={compact ? styles.compactTitle : styles.title} numberOfLines={compact ? 1 : 2}>
            {song.title}
          </Text>
          <Text style={compact ? styles.compactArtist : styles.artist} numberOfLines={1}>
            {song.artist}
          </Text>
        </>
      ) : (
        <View style={styles.hidden}>
          <Text style={styles.questionMark}>?</Text>
          <Text style={styles.hiddenText}>Guess the year!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    width: 140,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactCard: {
    backgroundColor: '#16213e',
    borderRadius: 8,
    padding: 8,
    width: 100,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  year: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  compactYear: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  artist: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  compactArtist: {
    fontSize: 9,
    color: '#aaa',
    textAlign: 'center',
  },
  hidden: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionMark: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1DB954',
  },
  hiddenText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
});
