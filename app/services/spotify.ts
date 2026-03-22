const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export async function playTrack(trackId: string, accessToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${SPOTIFY_API_BASE}/me/player/play`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: [`spotify:track:${trackId}`],
      }),
    });
    return res.ok || res.status === 204;
  } catch {
    return false;
  }
}

export async function pausePlayback(accessToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${SPOTIFY_API_BASE}/me/player/pause`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.ok || res.status === 204;
  } catch {
    return false;
  }
}

export async function getDevices(
  accessToken: string
): Promise<Array<{ id: string; name: string; is_active: boolean }>> {
  try {
    const res = await fetch(`${SPOTIFY_API_BASE}/me/player/devices`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.devices || [];
  } catch {
    return [];
  }
}

export async function searchTrack(
  title: string,
  artist: string,
  accessToken: string
): Promise<string | null> {
  try {
    const query = encodeURIComponent(`track:${title} artist:${artist}`);
    const res = await fetch(
      `${SPOTIFY_API_BASE}/search?q=${query}&type=track&limit=1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.tracks?.items?.[0]?.id || null;
  } catch {
    return null;
  }
}
