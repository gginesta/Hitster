# Implementation Plan — Playtest Feedback Sprint

## Status: PLANNED (8 issues)

---

## Issue 1: Allow Late Joiners Mid-Game

**Problem:** `join-room` rejects with "Game already in progress" when `phase !== 'lobby'`.

**Goal:** Let new players join an ongoing game as spectators who get dealt into the next round, or join the turn order immediately with a starting card from the deck.

### Changes

**`server/src/rooms.ts`** — Update `join-room` handler:
- Remove the `phase !== 'lobby'` rejection block (lines 261-264)
- When joining a game in progress:
  1. Create the player as usual (add to `room.players`)
  2. Call `engine.addLatecomer(playerId)` to integrate them into the game
  3. Emit `room-joined` to the new player with full room state
  4. Emit `player-joined` to other clients
  5. Send `game-started` + `new-turn` to the late joiner so they enter the game screen

**`server/src/game.ts`** — New method `addLatecomer(playerId: string)`:
- Deal the player a starting anchor card from the deck (if cards remain)
- Set their tokens to `STARTING_TOKENS`
- Insert them into `turnOrder` at the position **after** the current turn index (so they don't have to wait a full cycle)
- Initialize their `playerStats` entry
- Emit `timeline-updated` for their initial card
- Log the late join

**`shared/src/constants.ts`**:
- Add `MAX_PLAYERS = 12` (changed from 10 — see Issue 2)

**`app/src/hooks/useSocket.ts`**:
- No changes needed — `room-joined` + `game-started` + `new-turn` already handle the full state sync

### Edge cases:
- If the deck has fewer than 2 cards, reject the late join (not enough songs left to be fun)
- Late joiner cannot be host (host already exists)
- If game is in `game_over` phase, reject join (use "restart game" flow instead)

---

## Issue 2: Increase Max Players to 12

**Problem:** `MAX_PLAYERS` is 10 in `shared/src/constants.ts`.

### Changes

**`shared/src/constants.ts`** (line 1):
```
- export const MAX_PLAYERS = 10;
+ export const MAX_PLAYERS = 12;
```

**`README.md`** (line 16):
```
- - **Real-time multiplayer** -- 2-10 players per room via Socket.io
+ - **Real-time multiplayer** -- 2-12 players per room via Socket.io
```

**`ROADMAP.md`** (line 9):
```
- - [x] Real-time multiplayer via Socket.io (2-10 players)
+ - [x] Real-time multiplayer via Socket.io (2-12 players)
```

No UI changes needed — the player score bar already uses `overflow-x-auto` for horizontal scrolling.

---

## Issue 3: Fix Player Order Display

**Problem:** Top bar renders `Object.values(players)` which uses arbitrary JS object insertion order, not the actual `turnOrder`. Players appear out of turn sequence.

**Root cause:** `turnOrder` from the server's `gameState` is never stored in the client store.

### Changes

**`app/src/store.ts`**:
- Add `turnOrder: string[]` to `GameStore` interface (after `currentTurnPlayerId`)
- Add `setTurnOrder: (order: string[]) => void` action
- Initialize to `[]` in `initialState`
- Add to `syncRoom()`: `turnOrder: room.gameState.turnOrder || []`

**`app/src/hooks/useSocket.ts`**:
- In `game-started` handler: add `store.setTurnOrder(gameState.turnOrder || [])`
- In `game-restarted` handler: clear `turnOrder: []`

**`app/src/components/Game.tsx`** — Replace `playerList` ordering:
```tsx
// Before:
const playerList = Object.values(players);

// After:
const turnOrder = useGameStore((s) => s.turnOrder);
const playerList = turnOrder.length > 0
  ? turnOrder.map((id) => players[id]).filter(Boolean)
  : Object.values(players);
```

This ensures the score bar follows turn order. The currently-active player is already highlighted with a green border.

---

## Issue 4: Fix Fuzzy Matching + Song Naming in Original Mode

**Problem A:** Fuzzy matching is too strict — correct guesses are rejected.
**Problem B:** In Original mode, artist is required to submit even though naming is optional.

### Diagnosis

The fuzzy threshold is `0.2` (distance / maxLen). For a song title like "September" (9 chars), this allows ~1.8 chars of error. But normalization strips punctuation and articles — if the user types something reasonable it should still work. The real issue is likely:
- Parenthetical suffixes: "Bohemian Rhapsody (Remaster)" vs "Bohemian Rhapsody" — user types the short version, server has the long version → distance too high
- Featured artists: "Bad Guy (feat. Justin Bieber)" vs "Bad Guy"

### Changes

**`server/src/fuzzy.ts`** — Improve matching:
1. Strip parenthetical suffixes before matching: `result.replace(/\(.*?\)/g, '').trim()`
2. Strip "feat.", "ft.", "featuring", and everything after from artist names
3. Add substring containment check: if the normalized guess is fully contained in the actual (or vice versa), accept it
4. Increase threshold from 0.2 to 0.3 for more forgiveness

**`shared/src/constants.ts`**:
```
- export const FUZZY_THRESHOLD_RATIO = 0.2;
+ export const FUZZY_THRESHOLD_RATIO = 0.3;
```

**`app/src/components/Game.tsx`** — Fix artist requirement in Original mode:

The submit button condition (line 875) requires both `guessTitle && guessArtist`. In Original mode, naming is optional, so the player should be able to submit with just a title guess.

```tsx
// Before:
) : guessTitle && guessArtist ? (
  <button onClick={handleNameSong} ...>Submit Song Guess</button>
) : null}

// After:
) : guessTitle ? (
  <button onClick={handleNameSong} ...>Submit Song Guess</button>
) : null}
```

**`server/src/game.ts`** — Update `nameSong()` to handle missing artist in Original mode:
- If `guess.artist` is empty/missing and mode is `original` or `coop`, only check title match
- In pro/expert, keep requiring both (server already enforces this via the `correct = titleMatch && artistMatch` check)

```typescript
// In nameSong():
const titleMatch = fuzzyMatch(guess.title, gs.currentSong.title);
const artistMatch = guess.artist?.trim()
  ? fuzzyMatch(guess.artist, gs.currentSong.artist)
  : false;

// Original/coop: title alone is enough for the token
// Pro/expert: both required
const correct = (this.mode === 'original' || this.mode === 'coop')
  ? titleMatch
  : titleMatch && artistMatch;
```

---

## Issue 5: Allow Card Placement Before/After Song Naming (Place-Then-Guess)

**Problem:** Once a card is placed, the phase changes to `challenge` and the song naming inputs disappear. Players can't place tentatively then type their guess. If the timer runs out, they lose both the placement and the naming opportunity.

### Changes

**`app/src/components/Game.tsx`** — Keep song naming visible during challenge phase:

Change the condition for showing song naming inputs (line 818):
```tsx
// Before:
{isMyTurn && phase === 'playing' && (

// After:
{isMyTurn && (phase === 'playing' || phase === 'challenge') && !songNameResult?.playerId && (
```

This lets the active player continue typing their song guess during the challenge window. The inputs hide once they've submitted a guess or the reveal happens.

Also reorder the UI so guessing fields appear ABOVE the timeline/placement area (or keep them persistent in a fixed area), so they don't jump around when the phase changes.

**`server/src/game.ts`** — No changes needed. `nameSong()` already has no phase restriction — it only checks that `currentSong` exists and the player hasn't already guessed. The song-naming-during-challenge-phase flow is already supported server-side.

### Interaction order becomes:
1. Song plays → player sees title/artist/year input fields + timeline
2. Player can type guess immediately while listening
3. Player places card on timeline → phase changes to `challenge`
4. Song naming inputs remain visible → player can still submit their guess
5. Challenge window plays out → reveal happens → inputs finally hide

---

## Issue 6: Fix Duplicate Songs ("September" by Earth, Wind & Fire)

**Problem:** `data/songs.json` has two entries for the same song with slightly different artist names:
- Line 1263: `"artist": "Earth, Wind & Fire"` (with comma)
- Line 1305: `"artist": "Earth Wind & Fire"` (without comma)

The dedup in `selectGameDeck()` uses exact `title::artist` matching after lowercasing, so these are treated as different songs.

### Changes

**`data/songs.json`** — Remove the duplicate entry (line 1305-1310, the one without the comma). Keep the canonical spelling "Earth, Wind & Fire".

**`server/src/songs.ts`** — Make dedup more robust by normalizing artist names the same way fuzzy matching does:
```typescript
// Before:
const key = `${song.title.toLowerCase()}::${song.artist.toLowerCase()}`;

// After (import normalizeName from fuzzy.ts):
const key = `${normalizeName(song.title)}::${normalizeName(song.artist)}`;
```

This strips punctuation, collapses whitespace, and removes articles — so "Earth, Wind & Fire" and "Earth Wind & Fire" both become `"earth wind fire"` and deduplicate correctly.

**`server/src/fuzzy.ts`** — Export `normalizeName` (already exported, confirm).

### Additional data cleanup:
- Scan `songs.json` for other near-duplicate entries using the same normalization
- Fix any found duplicates

---

## Issue 7: Fix Challenge Result Popup (Says "Correct" When Challenger Lost)

**Problem:** Challenger challenges a placement. The active player's placement was correct. The challenger's proposed position also happens to be valid. The popup says "Your challenge position was correct!" — but the challenger LOST (they spent a token and didn't steal anything because the active player was right).

**Root cause:** `challengeResults[myId].correct` only tells the challenger whether their proposed position was geometrically valid — not whether they "won" the challenge. A challenger "wins" only when the active player's placement is WRONG AND the challenger's position is correct.

### Changes

**`app/src/components/Game.tsx`** — Rewrite challenge feedback (lines 789-802):

```tsx
{phase === 'reveal' && lastReveal && challengers.includes(myId) && (
  <motion.div ...>
    {!lastReveal.correct && lastReveal.stolenBy === myId ? (
      // Challenger won: stole the card
      'You stole the card!'
    ) : !lastReveal.correct && lastReveal.stolenBy && lastReveal.stolenBy !== myId ? (
      // Another challenger stole it
      `${players[lastReveal.stolenBy]?.name || 'Another challenger'} stole the card`
    ) : !lastReveal.correct && !lastReveal.stolenBy ? (
      // Placement was wrong but no challenger had the right position either
      'Placement was wrong, but no one had the right spot — card discarded'
    ) : (
      // Placement was correct — challenger lost their token
      'Placement was correct — you lost your challenge token'
    )}
  </motion.div>
)}
```

The key change: we base the message on the **outcome** (did the challenger steal the card?), not on whether their position was geometrically valid.

---

## Issue 8: Swap Trivia/WaitingState with Timeline Prominence

**Problem:** When it's not your turn, WaitingState (trivia + visualizer) takes center screen while the timeline is pushed to the bottom with `opacity-60`. The timeline should be more prominent.

### Changes

**`app/src/components/Game.tsx`** — Restructure the non-active-player layout:

1. **Move timeline UP** into the center area when not your turn, giving it full prominence
2. **Move WaitingState DOWN** below the timeline, or render it as a compact bar/strip rather than the full center content
3. **Remove the `opacity-60`** on the timeline section when it's not your turn:

```tsx
// Before (line 948-949):
className={`bg-black/60 border-t border-white/10 px-4 pt-3 pb-4 transition-opacity duration-500 ${
  !isMyTurn && phase !== 'reveal' && phase !== 'challenge' ? 'opacity-60' : ''
}`}

// After:
className="bg-black/60 border-t border-white/10 px-4 pt-3 pb-4"
```

4. **Make WaitingState compact**: Instead of the large center layout with visualizer + trivia card, show a single-line trivia question or a compact horizontal bar below the timeline. The buzz button can remain accessible as a floating button or inline element.

### Revised layout (not your turn):
```
┌────────────────────────────┐
│ Top Bar (scores in order)  │
├────────────────────────────┤
│ Song Card (mystery/reveal) │
│                            │
│ Your Timeline (full size)  │
│ ←→ scrollable             │
├────────────────────────────┤
│ Compact: Trivia + Buzz btn │
└────────────────────────────┘
```

---

## Implementation Order

### Phase 1 — Critical bug fixes (do first, independent):
| Task | Issue | Risk |
|------|-------|------|
| Fix duplicate September + normalize dedup | Issue 6 | Low — data + server change |
| Fix challenge result popup | Issue 7 | Low — client display only |
| Fix player order display | Issue 3 | Low — client store + render |
| Fix Original mode artist requirement | Issue 4 (part B) | Low — client + server |

### Phase 2 — UX improvements (can be parallel):
| Task | Issue | Risk |
|------|-------|------|
| Place-then-guess flow | Issue 5 | Medium — UI reflow |
| Swap trivia/timeline prominence | Issue 8 | Medium — layout refactor |
| Improve fuzzy matching | Issue 4 (part A) | Low — server only |

### Phase 3 — Feature addition:
| Task | Issue | Risk |
|------|-------|------|
| Max players → 12 | Issue 2 | None — constant change |
| Late joiner support | Issue 1 | Medium — new game flow |

---

## Files Changed Summary

| File | Issues |
|------|--------|
| `shared/src/constants.ts` | 2, 4 |
| `server/src/game.ts` | 1, 4, 5 |
| `server/src/rooms.ts` | 1 |
| `server/src/fuzzy.ts` | 4, 6 |
| `server/src/songs.ts` | 6 |
| `data/songs.json` | 6 |
| `app/src/store.ts` | 3 |
| `app/src/hooks/useSocket.ts` | 3 |
| `app/src/components/Game.tsx` | 3, 4, 5, 7, 8 |
| `app/src/components/WaitingState.tsx` | 8 |
| `README.md` | 2 |
| `ROADMAP.md` | 2 |
