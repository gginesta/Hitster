import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSocket } from '../hooks/useSocket';

export default function RootLayout() {
  useSocket();

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}
