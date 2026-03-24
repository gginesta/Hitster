declare namespace Spotify {
  class Player {
    constructor(options: PlayerOptions);
    connect(): Promise<boolean>;
    disconnect(): void;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    getCurrentState(): Promise<PlaybackState | null>;
    setVolume(volume: number): Promise<void>;
    addListener(event: 'ready', callback: (data: { device_id: string }) => void): void;
    addListener(event: 'not_ready', callback: (data: { device_id: string }) => void): void;
    addListener(event: 'player_state_changed', callback: (state: PlaybackState | null) => void): void;
    addListener(event: 'initialization_error', callback: (error: WebPlaybackError) => void): void;
    addListener(event: 'authentication_error', callback: (error: WebPlaybackError) => void): void;
    addListener(event: 'account_error', callback: (error: WebPlaybackError) => void): void;
    addListener(event: 'playback_error', callback: (error: WebPlaybackError) => void): void;
    removeListener(event: string): void;
  }

  interface PlayerOptions {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume?: number;
  }

  interface PlaybackState {
    paused: boolean;
    position: number;
    duration: number;
    track_window: {
      current_track: Track;
      previous_tracks: Track[];
      next_tracks: Track[];
    };
  }

  interface Track {
    uri: string;
    id: string;
    name: string;
    artists: { name: string; uri: string }[];
    album: { name: string; uri: string; images: { url: string }[] };
    duration_ms: number;
  }

  interface WebPlaybackError {
    message: string;
  }
}

interface Window {
  onSpotifyWebPlaybackSDKReady: () => void;
  Spotify: { Player: typeof Spotify.Player };
}
