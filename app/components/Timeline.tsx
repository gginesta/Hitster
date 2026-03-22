import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { SongCard as SongCardType } from '@hitster/shared';
import SongCard from './SongCard';

interface Props {
  cards: SongCardType[];
  onInsert?: (position: number) => void;
  interactive?: boolean;
  selectedPosition?: number | null;
}

export default function Timeline({
  cards,
  onInsert,
  interactive = false,
  selectedPosition,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {interactive && (
        <InsertMarker
          position={0}
          selected={selectedPosition === 0}
          onPress={() => onInsert?.(0)}
        />
      )}

      {cards.map((card, index) => (
        <View key={card.id} style={styles.cardWrapper}>
          <SongCard song={card} compact />
          {interactive && (
            <InsertMarker
              position={index + 1}
              selected={selectedPosition === index + 1}
              onPress={() => onInsert?.(index + 1)}
            />
          )}
        </View>
      ))}

      {cards.length === 0 && !interactive && (
        <Text style={styles.empty}>No cards yet</Text>
      )}
    </ScrollView>
  );
}

function InsertMarker({
  position,
  selected,
  onPress,
}: {
  position: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.insertMarker, selected && styles.insertMarkerSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.insertText, selected && styles.insertTextSelected]}>
        {selected ? 'HERE' : '+'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  empty: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  insertMarker: {
    width: 36,
    height: 64,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insertMarkerSelected: {
    borderColor: '#1DB954',
    backgroundColor: '#1DB95420',
    borderStyle: 'solid',
  },
  insertText: {
    color: '#666',
    fontSize: 20,
    fontWeight: '700',
  },
  insertTextSelected: {
    color: '#1DB954',
    fontSize: 12,
  },
});
