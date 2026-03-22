import { useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useGameStore } from '../stores/gameStore';

WebBrowser.maybeCompleteAuthSession();

const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID || 'YOUR_CLIENT_ID';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const scopes = [
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
];

export function useSpotify() {
  const setSpotifyAccessToken = useGameStore((s) => s.setSpotifyAccessToken);
  const accessToken = useGameStore((s) => s.spotifyAccessToken);

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'hitster',
    path: 'callback',
  });

  const login = useCallback(async () => {
    try {
      const request = new AuthSession.AuthRequest({
        clientId: SPOTIFY_CLIENT_ID,
        scopes,
        redirectUri,
        usePKCE: true,
        responseType: AuthSession.ResponseType.Code,
      });

      const result = await request.promptAsync(discovery);

      if (result.type === 'success' && result.params.code) {
        // Exchange code for token
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: SPOTIFY_CLIENT_ID,
            code: result.params.code,
            redirectUri,
            extraParams: {
              code_verifier: request.codeVerifier!,
            },
          },
          discovery
        );

        if (tokenResult.accessToken) {
          setSpotifyAccessToken(tokenResult.accessToken);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Spotify auth error:', error);
      return false;
    }
  }, [redirectUri, setSpotifyAccessToken]);

  return {
    login,
    isAuthenticated: !!accessToken,
    accessToken,
  };
}
