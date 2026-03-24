import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// StrictMode is intentionally removed because it causes React 18's
// double-mount behavior (mount → unmount → mount) which breaks the
// Spotify Web Playback SDK. The SDK connects a device on mount, then
// StrictMode's cleanup disconnects it, then the re-mount connects a
// NEW device — but Spotify's servers get confused by the rapid
// connect/disconnect/connect and the device never registers properly.
// This is a known issue: https://community.spotify.com/t5/Spotify-for-Developers/Spotify-Web-Playback-SDK-example-playback-buttons-don-t-work/td-p/5516960
createRoot(document.getElementById('root')!).render(<App />);
