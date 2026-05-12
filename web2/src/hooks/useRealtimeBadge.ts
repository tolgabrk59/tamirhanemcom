'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket';

const APPOINTMENT_EVENTS = [
  'appointment:created', 'appointment:updated', 'appointment:dateMatched',
  'appointment:accepted', 'appointment:rejected', 'appointment:offered',
  'appointment:offerAccepted', 'appointment:offerRejected',
  'appointment:completed', 'appointment:cancelled',
  'appointment:progressUpdated', 'appointment:processStarted',
  'appointment:vehicleReady', 'appointment:noShow',
];

interface BadgeState {
  appointmentBadge: number;
  notificationBadge: number;
  isConnected: boolean;
}

export function useRealtimeBadge(jwt: string | null) {
  const [state, setState] = useState<BadgeState>({
    appointmentBadge: 0,
    notificationBadge: 0,
    isConnected: false,
  });
  const handlersRef = useRef<Record<string, () => void>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchBadges = useCallback(async () => {
    if (!jwt) return;
    try {
      const [apptRes, notifRes] = await Promise.allSettled([
        fetch(
          '/api/appointments?filters[status][$in][0]=Beklemede&filters[status][$in][1]=Tarih%20Belirlendi&filters[status][$in][2]=M%C3%BC%C5%9Fteri%20Onay%C4%B1%20Bekleniyor&pagination[pageSize]=1',
          { headers: { Authorization: `Bearer ${jwt}` } }
        ),
        fetch('/api/notifications/unread-count', {
          headers: { Authorization: `Bearer ${jwt}` },
        }),
      ]);

      if (apptRes.status === 'fulfilled' && apptRes.value.ok) {
        const data = await apptRes.value.json();
        const count = data?.meta?.pagination?.total ?? (data?.data?.length ?? 0);
        setState(prev => ({ ...prev, appointmentBadge: count }));
      }

      if (notifRes.status === 'fulfilled' && notifRes.value.ok) {
        const data = await notifRes.value.json();
        const count = data?.count ?? data?.unreadCount ?? data?.data ?? 0;
        setState(prev => ({ ...prev, notificationBadge: typeof count === 'number' ? count : 0 }));
      }
    } catch {
      // silent
    }
  }, [jwt]);

  useEffect(() => {
    if (!jwt) return;

    let userId: number | null = null;
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      userId = payload.id;
    } catch {
      return;
    }

    if (!userId) return;

    const socket = getSocket();

    connectSocket(userId);

    const onConnect = () => setState(prev => ({ ...prev, isConnected: true }));
    const onDisconnect = () => setState(prev => ({ ...prev, isConnected: false }));
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    const fetchHandler = () => { fetchBadges(); };
    handlersRef.current = {};
    APPOINTMENT_EVENTS.forEach(event => {
      handlersRef.current[event] = fetchHandler;
      socket.on(event, fetchHandler);
    });

    const notifHandler = () =>
      setState(prev => ({ ...prev, notificationBadge: prev.notificationBadge + 1 }));
    handlersRef.current['notification:new'] = notifHandler;
    socket.on('notification:new', notifHandler);

    fetchBadges();

    intervalRef.current = setInterval(fetchBadges, 60000);

    return () => {
      Object.entries(handlersRef.current).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      if (intervalRef.current) clearInterval(intervalRef.current);
      disconnectSocket();
    };
  }, [jwt, fetchBadges]);

  return state;
}
