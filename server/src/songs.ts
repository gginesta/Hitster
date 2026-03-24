import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { SongCard, SongData } from '@hitster/shared';
import { DECK_SIZE } from '@hitster/shared';
import { logger } from './logger';

let allSongs: SongData[] = [];

// In-memory cache: "title::artist" → { trackId, previewUrl }
const trackCache = new Map<string, { trackId: string; previewUrl?: string }>();

function cacheKey(song: SongData): string {
  return `${song.title.toLowerCase()}::${song.artist.toLowerCase()}`;
}

export function loadSongs() {
  logger.debug('Song loader paths', { __dirname, cwd: process.cwd() });

  // Try multiple possible locations for songs.json
  const candidates = [
    path.join(__dirname, '..', '..', 'data', 'songs.json'),   // from server/src or server/dist
    path.join(__dirname, '..', 'data', 'songs.json'),          // from server/
    path.join(process.cwd(), 'data', 'songs.json'),            // from project root (npm workspaces)
  ];

  logger.debug('Song file candidates', {
    candidates: candidates.map(c => ({ path: c, exists: fs.existsSync(c) })),
  });

  const songsPath = candidates.find(p => fs.existsSync(p)) || candidates[0];
  logger.info('Loading songs', { path: songsPath });

  try {
    const raw = fs.readFileSync(songsPath, 'utf-8');
    allSongs = JSON.parse(raw);
    logger.info('Songs loaded successfully', { count: allSongs.length });
  } catch (err) {
    logger.error('Failed to load songs', { error: String(err) });
    allSongs = [];
  }
}

export function selectGameDeck(count: number = DECK_SIZE): SongCard[] {
  if (allSongs.length === 0) {
    logger.warn('No songs loaded, returning empty deck');
    return [];
  }

  // Group songs by decade for balanced selection
  const byDecade = new Map<number, SongData[]>();
  for (const song of allSongs) {
    const decade = Math.floor(song.year / 10) * 10;
    if (!byDecade.has(decade)) byDecade.set(decade, []);
    byDecade.get(decade)!.push(song);
  }

  const selected: SongData[] = [];
  const decades = [...byDecade.keys()].sort();
  const perDecade = Math.max(1, Math.ceil(count / decades.length));

  // Pick from each decade
  for (const decade of decades) {
    const songs = byDecade.get(decade)!;
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    selected.push(...shuffled.slice(0, perDecade));
  }

  // Shuffle and trim to count
  const deck: SongCard[] = selected
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((song) => ({
      ...song,
      id: uuidv4(),
      spotifyTrackId: undefined,
    }));

  return deck;
}

export async function resolveSpotifyTrack(
  song: SongData,
  accessToken: string
): Promise<{ trackId: string; previewUrl?: string } | null> {
  try {
    const query = encodeURIComponent(`track:${song.title} artist:${song.artist}`);
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const track = data.tracks?.items?.[0];
    if (!track?.id) return null;
    return { trackId: track.id, previewUrl: track.preview_url || undefined };
  } catch {
    return null;
  }
}

/**
 * Batch-resolve Spotify track IDs for a deck.
 * Uses cache to avoid redundant API calls.
 * Filters out songs that couldn't be resolved.
 * Returns only playable songs.
 */
export async function resolveTrackIds(
  deck: SongCard[],
  accessToken: string,
): Promise<SongCard[]> {
  const CONCURRENCY = 5;
  let resolved = 0;
  let cached = 0;

  // First pass: fill from cache
  for (const card of deck) {
    const key = cacheKey(card);
    const cachedEntry = trackCache.get(key);
    if (cachedEntry) {
      card.spotifyTrackId = cachedEntry.trackId;
      card.previewUrl = cachedEntry.previewUrl;
      cached++;
      resolved++;
    }
  }

  // Collect uncached cards
  const uncached = deck.filter((c) => !c.spotifyTrackId);

  // Resolve in batches with concurrency limit
  for (let i = 0; i < uncached.length; i += CONCURRENCY) {
    const batch = uncached.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (card) => {
        const result = await resolveSpotifyTrack(card, accessToken);
        if (result) {
          card.spotifyTrackId = result.trackId;
          card.previewUrl = result.previewUrl;
          trackCache.set(cacheKey(card), result);
          resolved++;
        }
      }),
    );

    // Brief pause between batches to be nice to rate limits
    if (i + CONCURRENCY < uncached.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  const playable = deck.filter((c) => c.spotifyTrackId);
  logger.info('Track resolution complete', {
    resolved,
    total: deck.length,
    cached,
    playable: playable.length,
  });

  return playable;
}
