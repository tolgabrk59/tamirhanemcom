'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/webPush';

export function PushNotificationInit() {
  useEffect(() => {
    registerServiceWorker();
  }, []);
  return null;
}
