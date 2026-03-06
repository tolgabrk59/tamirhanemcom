'use client';

import { useEffect } from 'react';
import { addToCodeHistory } from '@/lib/code-history';

interface CodeHistoryTrackerProps {
  code: string;
  title: string;
  severity?: string;
}

export default function CodeHistoryTracker({ code, title, severity }: CodeHistoryTrackerProps) {
  useEffect(() => {
    // Sayfa yüklendiğinde kodu geçmişe ekle
    addToCodeHistory({
      code: code.toUpperCase(),
      title,
      severity
    });
  }, [code, title, severity]);

  // Bu component görsel bir şey render etmez, sadece side effect
  return null;
}
