/**
 * Spotify Web Playback SDK integration.
 *
 * Key SDK requirements (from Spotify docs):
 * - Spotify Premium required
 * - activateElement() must be called during a user gesture before playback
 *   can start, otherwise browsers block it as autoplay
 * - The 'autoplay_failed' event fires when the browser blocks playback
 * - player_state_changed fires with null when the device is not active
 * - Use PUT /v1/me/player/play?device_id=X to transfer + start playback
 */

let player: Spotify.Player | null = null;
let deviceId: string | null = null;
let sdkLoaded = false;
let sdkReady: Promise<void> | null = null;
let activated = false;

function loadSDK(): Promise<void> {
  if (sdkLoaded) return Promise.resolve();
  if (sdkReady) return sdkReady;

  sdkReady = new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    window.onSpotifyWebPlaybackSDKReady = () => {
      sdkLoaded = true;
      resolve();
    };

    document.body.appendChild(script);
  });

  return sdkReady;
}

export interface SpotifyPlayerCallbacks {
  onReady: (id: string) => void;
  onNotReady: () => void;
  onError: (message: string) => void;
  onStateChange: (paused: boolean) => void;
  onAutoplayFailed: () => void;
  onActive: (active: boolean) => void;
}

export async function initPlayer(
  getToken: () => Promise<string>,
  callbacks: SpotifyPlayerCallbacks,
): Promise<void> {
  // Guard against double-init
  if (player) return;

  await loadSDK();

  player = new window.Spotify.Player({
    name: 'Hitster Game',
    getOAuthToken: (cb) => {
      getToken().then(cb).catch(() => cb(''));
    },
    volume: 0.8,
  });

  player.addListener('ready', ({ device_id }) => {
    deviceId = device_id;
    console.log('[Hitster] Spotify SDK ready, device:', device_id);
    callbacks.onReady(device_id);
  });

  player.addListener('not_ready', ({ device_id }) => {
    console.warn('[Hitster] Spotify device offline:', device_id);
    deviceId = null;
    callbacks.onNotReady();
  });

  player.addListener('authentication_error', (err) => {
    console.error('[Hitster] Spotify auth error:', err.message);
    callbacks.onError('Spotify authentication failed. Try reconnecting.');
  });

  player.addListener('initialization_error', (err) => {
    console.error('[Hitster] Spotify init error:', err.message);
    callbacks.onError('Failed to initialize Spotify player');
  });

  player.addListener('account_error', (err) => {
    console.error('[Hitster] Spotify account error:', err.message);
    callbacks.onError('Spotify Premium is required to play music');
  });

  player.addListener('playback_error', (err) => {
    console.error('[Hitster] Spotify playback error:', err.message);
  });

  // autoplay_failed: browser blocked playback (no user gesture yet)
  player.addListener('autoplay_failed', () => {
    console.warn('[Hitster] Autoplay blocked by browser — user must click play');
    callbacks.onAutoplayFailed();
  });

  player.addListener('player_state_changed', (state) => {
    if (!state) {
      callbacks.onActive(false);
      return;
    }
    callbacks.onActive(true);
    callbacks.onStateChange(state.paused);
  });

  const connected = await player.connect();
  if (!connected) {
    callbacks.onError('Failed to connect to Spotify');
  } else {
    console.log('[Hitster] Spotify player connected');
  }
}

/**
 * Must be called during a user gesture (click/tap) to allow the browser
 * to start audio playback. Call this once before the first playTrack.
 */
export function activateElement(): void {
  if (player && !activated) {
    player.activateElement();
    activated = true;
    console.log('[Hitster] activateElement() called');
  }
}

/**
 * Start playback of a track on the SDK device via the Spotify Web API.
 * This also transfers playback to our device if it's not already active.
 */
export async function playTrack(
  trackId: string,
  accessToken: string,
): Promise<boolean> {
  if (!deviceId) {
    console.error('[Hitster] playTrack: no deviceId — player not ready');
    return false;
  }

  // Ensure audio element is activated
  activateElement();

  console.log('[Hitster] playTrack:', trackId, 'device:', deviceId);

  const doPlay = () =>
    fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          uris: [`spotify:track:${trackId}`],
          position_ms: 0,
        }),
      },
    );

  let res = await doPlay();

  // 204 = success, 200 = success
  if (res.ok || res.status === 204) {
    console.log('[Hitster] playTrack success');
    return true;
  }

  // 401 = token expired — caller should refresh and retry
  if (res.status === 401) {
    console.warn('[Hitster] playTrack: token expired (401)');
    return false;
  }

  // 404 = device not found, or 502/503 = temporary server issue — retry once
  console.warn('[Hitster] playTrack attempt 1 failed:', res.status, await res.text().catch(() => ''));
  await new Promise((r) => setTimeout(r, 1500));
  res = await doPlay();

  if (res.ok || res.status === 204) {
    console.log('[Hitster] playTrack retry success');
    return true;
  }

  console.error('[Hitster] playTrack retry failed:', res.status, await res.text().catch(() => ''));
  return false;
}

export async function pause(): Promise<void> {
  if (player) {
    await player.pause().catch((err) => {
      console.warn('[Hitster] pause failed:', err);
    });
  }
}

export async function resume(): Promise<void> {
  if (player) {
    activateElement();
    await player.resume().catch((err) => {
      console.warn('[Hitster] resume failed:', err);
    });
  }
}

export async function togglePlay(): Promise<void> {
  if (player) {
    activateElement();
    await player.togglePlay().catch((err) => {
      console.warn('[Hitster] togglePlay failed:', err);
    });
  }
}

export async function getCurrentState(): Promise<Spotify.PlaybackState | null> {
  if (!player) return null;
  return player.getCurrentState();
}

export function disconnect(): void {
  if (player) {
    player.disconnect();
    player = null;
    deviceId = null;
    activated = false;
  }
}

export function getDeviceId(): string | null {
  return deviceId;
}

export function isInitialized(): boolean {
  return player !== null && deviceId !== null;
}
