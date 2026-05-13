'use client'

import { useEffect, useRef } from 'react'

export function usePolling(fn: (() => void) | null, intervalMs: number): void {
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    if (!fn) return

    let intervalId: ReturnType<typeof setInterval>

    function start() {
      fnRef.current?.()
      intervalId = setInterval(() => fnRef.current?.(), intervalMs)
    }

    function onVisibility() {
      if (document.visibilityState === 'visible') {
        clearInterval(intervalId)
        start()
      } else {
        clearInterval(intervalId)
      }
    }

    start()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs])
}
