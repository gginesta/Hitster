import { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function RoomCodeInput({ value, onChange }: Props) {
  const inputRef = useRef<TextInput>(null);

  const handleChange = (text: string) => {
    const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    onChange(cleaned);
  };

  const letters = value.padEnd(4, ' ').split('');

  return (
    <View style={styles.container}>
      {letters.map((letter, i) => (
        <View
          key={i}
          style={[styles.box, i < value.length && styles.boxFilled]}
        >
          <TextInput
            ref={i === 0 ? inputRef : undefined}
            style={styles.letter}
            value={letter.trim()}
            editable={false}
          />
        </View>
      ))}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={handleChange}
        maxLength={4}
        autoCapitalize="characters"
        autoCorrect={false}
        autoFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    position: 'relative',
  },
  box: {
    width: 56,
    height: 64,
    backgroundColor: '#16213e',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: {
    borderColor: '#1DB954',
  },
  letter: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
  },
});
