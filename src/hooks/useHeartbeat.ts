"use client"

import { useState, useEffect, useCallback } from 'react';

export type HeartbeatStatus = 'stable' | 'warning' | 'flatline';

export function useHeartbeat() {
  const [status, setStatus] = useState<HeartbeatStatus>('stable');
  const [latency, setLatency] = useState<number>(0);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkPulse = useCallback(async () => {
    const start = performance.now();
    try {
      // Simulate connection check
      const response = await fetch('/api/health', { method: 'HEAD' }).catch(() => ({ ok: false }));
      const end = performance.now();
      const currentLatency = Math.round(end - start);
      
      setLatency(currentLatency);
      setLastCheck(new Date());

      if (currentLatency > 1000) {
        setStatus('warning');
      } else {
        setStatus('stable');
      }
    } catch (err) {
      setStatus('flatline');
    }
  }, []);

  useEffect(() => {
    setLastCheck(new Date());
    const interval = setInterval(checkPulse, 5000);
    return () => clearInterval(interval);
  }, [checkPulse]);

  // Handle browser online/offline events
  useEffect(() => {
    const handleOnline = () => setStatus('stable');
    const handleOffline = () => setStatus('flatline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { status, latency, lastCheck };
}
