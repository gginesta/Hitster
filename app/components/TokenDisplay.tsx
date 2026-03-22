import { View, Text, StyleSheet } from 'react-native';

interface Props {
  count: number;
  size?: 'small' | 'large';
}

export default function TokenDisplay({ count, size = 'small' }: Props) {
  const isLarge = size === 'large';

  return (
    <View style={[styles.container, isLarge && styles.containerLarge]}>
      <Text style={[styles.coin, isLarge && styles.coinLarge]}>●</Text>
      <Text style={[styles.count, isLarge && styles.countLarge]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f9a82520',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  containerLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  coin: {
    color: '#f9a825',
    fontSize: 12,
  },
  coinLarge: {
    fontSize: 18,
  },
  count: {
    color: '#f9a825',
    fontSize: 14,
    fontWeight: '700',
  },
  countLarge: {
    fontSize: 20,
  },
});
