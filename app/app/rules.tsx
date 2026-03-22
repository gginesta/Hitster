import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const SECTIONS = [
  {
    title: 'Objective',
    body: `Be the first player to collect the required number of song cards (default 10) in your personal music timeline, ordered chronologically by release year.`,
  },
  {
    title: 'How to Play',
    steps: [
      'Each player starts with 1 song card in their timeline and 2 tokens.',
      'On your turn, a mystery song plays through the host\'s device. You must guess when it was released.',
      'Place the song card in your timeline — before or after your existing cards — based on when you think it came out.',
      'Other players can challenge your placement by spending 1 token. If you were wrong, the first challenger steals the card!',
      'If your placement is correct, the card stays in your timeline.',
      'The first player to reach the target number of cards wins and earns the title of "Hitster"!',
    ],
  },
  {
    title: 'Tokens',
    items: [
      {
        label: 'Earn a token',
        desc: 'Correctly name the song title AND artist during any turn (even if it\'s not yours).',
      },
      {
        label: 'Skip a song',
        desc: 'Costs 1 token. The song is discarded and a new one is drawn.',
      },
      {
        label: 'Challenge',
        desc: 'Costs 1 token. If the active player placed their card wrong, you steal it! If they were right, you lose the token.',
      },
      {
        label: 'Buy a free card',
        desc: 'Costs 3 tokens. A card is drawn and automatically placed correctly in your timeline.',
      },
    ],
  },
  {
    title: 'Placement Rules',
    body: `You don't need to guess the exact year — just whether the song came out before or after the cards already in your timeline. Cards from the same year can be placed in either order.\n\nFor example, if your timeline has a 1975 and a 1992 song, and the mystery song is from 1983, you need to place it between them.`,
  },
];

const MODES = [
  {
    name: 'Original',
    color: '#1DB954',
    rules: [
      'Place the card in the correct position on your timeline.',
      'You do NOT need to name the song or artist to keep the card.',
      'Naming the song and artist is optional — earns you a bonus token.',
      'Start with 2 tokens.',
    ],
  },
  {
    name: 'Pro',
    color: '#f9a825',
    rules: [
      'Place the card correctly AND name the artist and song title to keep the card.',
      'If your placement is correct but you can\'t name it, the card is discarded.',
      'Start with 5 tokens.',
    ],
  },
  {
    name: 'Expert',
    color: '#e94560',
    rules: [
      'Place the card correctly AND name the artist, song title, and exact release year.',
      'All three must be correct to keep the card.',
      'Start with 3 tokens. No new tokens can be earned.',
    ],
  },
  {
    name: 'Co-op',
    color: '#00bcd4',
    rules: [
      'All players work together as one team sharing a single timeline.',
      'The team starts with 5 tokens and 1 card.',
      'Take turns placing cards — if wrong, the team loses 1 token.',
      'Collect the target number of cards before running out of tokens to win!',
    ],
  },
];

export default function RulesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How to Play</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Game Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>HITSTER</Text>
          <Text style={styles.overviewBody}>
            A music party game for 2–10 players. Listen to songs, guess their
            release era, and build the most accurate music timeline!
          </Text>
        </View>

        {/* Main Sections */}
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.body && (
              <Text style={styles.bodyText}>{section.body}</Text>
            )}

            {section.steps && (
              <View style={styles.stepList}>
                {section.steps.map((step, i) => (
                  <View key={i} style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {section.items && (
              <View style={styles.itemList}>
                {section.items.map((item) => (
                  <View key={item.label} style={styles.itemRow}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    <Text style={styles.itemDesc}>{item.desc}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Game Modes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Modes</Text>
          <Text style={styles.bodyText}>
            Players in the same game can each choose a different difficulty for a
            balanced experience.
          </Text>

          {MODES.map((mode) => (
            <View
              key={mode.name}
              style={[styles.modeCard, { borderLeftColor: mode.color }]}
            >
              <Text style={[styles.modeName, { color: mode.color }]}>
                {mode.name}
              </Text>
              {mode.rules.map((rule, i) => (
                <View key={i} style={styles.modeRuleRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.modeRule}>{rule}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          <View style={styles.itemList}>
            <View style={styles.tipRow}>
              <Text style={styles.tipText}>
                You don't need to know exact years — just whether a song is
                older or newer than what's already in your timeline.
              </Text>
            </View>
            <View style={styles.tipRow}>
              <Text style={styles.tipText}>
                Pay attention to other players' turns! You can earn tokens by
                naming songs even when it's not your turn.
              </Text>
            </View>
            <View style={styles.tipRow}>
              <Text style={styles.tipText}>
                Save your tokens for strategic challenges — stealing a card late
                in the game can change the outcome.
              </Text>
            </View>
            <View style={styles.tipRow}>
              <Text style={styles.tipText}>
                Only the host needs Spotify Premium. Everyone else just listens
                through the host's speakers!
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  backText: {
    color: '#1DB954',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    gap: 24,
  },
  overviewCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1DB95440',
  },
  overviewTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1DB954',
    letterSpacing: 6,
    marginBottom: 12,
  },
  overviewBody: {
    color: '#ccc',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  bodyText: {
    color: '#bbb',
    fontSize: 15,
    lineHeight: 22,
  },
  stepList: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    color: '#ccc',
    fontSize: 15,
    lineHeight: 22,
  },
  itemList: {
    gap: 10,
  },
  itemRow: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 14,
  },
  itemLabel: {
    color: '#f9a825',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemDesc: {
    color: '#bbb',
    fontSize: 14,
    lineHeight: 20,
  },
  modeCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    gap: 6,
  },
  modeName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  modeRuleRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  modeRule: {
    flex: 1,
    color: '#bbb',
    fontSize: 14,
    lineHeight: 20,
  },
  tipRow: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 14,
  },
  tipText: {
    color: '#bbb',
    fontSize: 14,
    lineHeight: 20,
  },
});
