import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://api.tamirhanem.net';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (typeof window === 'undefined') {
    throw new Error('Socket is only available on the client side');
  }
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: false,
    });
  }
  return socket;
}

export function connectSocket(userId: number, serviceId?: number) {
  if (typeof window === 'undefined') return;
  const s = getSocket();
  if (!s.connected) s.connect();
  s.emit('joinRoom', { userId, serviceId });
}

export function disconnectSocket() {
  if (typeof window === 'undefined') return;
  if (socket?.connected) socket.disconnect();
}

export default getSocket;
