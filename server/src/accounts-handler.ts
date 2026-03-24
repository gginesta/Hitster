import { Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '@hitster/shared';
import { createAccount, login } from './accounts';

type HitsterSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export function registerAuthHandlers(socket: HitsterSocket) {
  socket.on('register', ({ username, password, displayName }) => {
    const result = createAccount(username, password, displayName);
    if (result.success) {
      socket.emit('auth-result', { success: true, displayName: displayName || username });
    } else {
      socket.emit('auth-result', { success: false, error: result.error });
    }
  });

  socket.on('login', ({ username, password }) => {
    const result = login(username, password);
    socket.emit('auth-result', result);
  });
}
