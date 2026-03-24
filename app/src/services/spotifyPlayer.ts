/**
 * Spotify Web Playback SDK integration.
 *
 * The SDK fires 'ready' with a device_id BEFORE Spotify's API servers
 * have registered that device. Calling the REST API immediately gets
 * 404 "Device not found". To fix this, we poll GET /v1/me/player/devices
 * until our device appears in the list before attempting playback.
 */

let player: Spotify.Player | null = null;
let deviceId: string | null = null;
let sdkLoaded = false;
let sdkReady: Promise<void> | null = null;
let activated = false;
let deviceConfirmed = false;

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
  onDeviceConfirmed: () => void;
}

let currentGetToken: (() => Promise<string>) | null = null;

export async function initPlayer(
  getToken: () => Promise<string>,
  callbacks: SpotifyPlayerCallbacks,
): Promise<void> {
  if (player) return;

  currentGetToken = getToken;
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
    deviceConfirmed = false;
    console.log('[Hitster] SDK ready, device:', device_id);
    callbacks.onReady(device_id);

    // Start polling to confirm the device is registered with Spotify's servers
    pollForDevice(device_id, getToken, callbacks);
  });

  player.addListener('not_ready', ({ device_id }) => {
    console.warn('[Hitster] Device offline:', device_id);
    deviceId = null;
    deviceConfirmed = false;
    callbacks.onNotReady();
  });

  player.addListener('authentication_error', (err) => {
    console.error('[Hitster] Auth error:', err.message);
    callbacks.onError('Spotify authentication failed. Try reconnecting.');
  });

  player.addListener('initialization_error', (err) => {
    console.error('[Hitster] Init error:', err.message);
    callbacks.onError('Failed to initialize Spotify player');
  });

  player.addListener('account_error', (err) => {
    console.error('[Hitster] Account error:', err.message);
    callbacks.onError('Spotify Premium is required to play music');
  });

  player.addListener('playback_error', (err) => {
    console.error('[Hitster] Playback error:', err.message);
  });

  player.addListener('autoplay_failed', () => {
    console.warn('[Hitster] Autoplay blocked by browser');
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
    console.log('[Hitster] Player connected, waiting for device registration...');
  }
}

/**
 * Poll GET /v1/me/player/devices until our device appears.
 * This is necessary because the SDK fires 'ready' before the device
 * is actually registered with Spotify's servers.
 */
async function pollForDevice(
  targetDeviceId: string,
  getToken: () => Promise<string>,
  callbacks: SpotifyPlayerCallbacks,
): Promise<void> {
  const MAX_POLLS = 20;
  const POLL_INTERVAL = 1500;

  for (let i = 0; i < MAX_POLLS; i++) {
    // Device changed (SDK reconnected), stop this poller
    if (deviceId !== targetDeviceId) {
      console.log('[Hitster] Device changed during polling, stopping');
      return;
    }

    try {
      const token = await getToken();
      const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const devices = data.devices || [];
        console.log(`[Hitster] Devices poll ${i + 1}/${MAX_POLLS}:`, devices.map((d: { name: string; id: string }) => `${d.name} (${d.id})`));

        const found = devices.find((d: { id: string }) => d.id === targetDeviceId);
        if (found) {
          console.log('[Hitster] Device confirmed in Spotify device list!');
          deviceConfirmed = true;
          callbacks.onDeviceConfirmed();
          return;
        }
      }
    } catch (err) {
      console.warn('[Hitster] Device poll error:', err);
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }

  console.warn('[Hitster] Device never appeared in Spotify device list after', MAX_POLLS, 'polls');
  // Try to play anyway — maybe it'll work
  deviceConfirmed = true;
  callbacks.onDeviceConfirmed();
}

export function activateElement(): void {
  if (player && !activated) {
    player.activateElement();
    activated = true;
    console.log('[Hitster] activateElement() called');
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Play a track via the Spotify Web API.
 * Waits for device to be confirmed before calling the API.
 */
export async function playTrack(
  trackId: string,
  accessToken: string,
): Promise<boolean> {
  if (!deviceId) {
    console.error('[Hitster] playTrack: no deviceId');
    return false;
  }

  activateElement();

  console.log('[Hitster] playTrack:', trackId, 'device:', deviceId, 'confirmed:', deviceConfirmed);

  // If device isn't confirmed yet, wait briefly
  if (!deviceConfirmed) {
    console.log('[Hitster] Waiting for device confirmation...');
    await sleep(3000);
  }

  const doPlay = () => {
    const id = deviceId;
    if (!id) return Promise.resolve(new Response(null, { status: 404 }));

    return fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${id}`,
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
  };

  // Try up to 3 times with delays
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      console.log(`[Hitster] playTrack retry ${attempt}, waiting ${attempt * 2000}ms...`);
      await sleep(attempt * 2000);
    }

    const res = await doPlay();

    if (res.ok || res.status === 204) {
      console.log('[Hitster] playTrack success');
      return true;
    }

    if (res.status === 401) {
      console.warn('[Hitster] playTrack: token expired (401)');
      return false;
    }

    const body = await res.text().catch(() => '');
    console.warn(`[Hitster] playTrack attempt ${attempt + 1} failed:`, res.status, body);
  }

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
    deviceConfirmed = false;
    activated = false;
    currentGetToken = null;
  }
}

export function getDeviceId(): string | null {
  return deviceId;
}

export function isDeviceConfirmed(): boolean {
  return deviceConfirmed;
}

export function isInitialized(): boolean {
  return player !== null && deviceId !== null;
}
