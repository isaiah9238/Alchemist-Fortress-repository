"use client"

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fortress_conveyor_buffer';

export function useConveyor<T>(key: string, initialValue: T) {
  // Initialize with initialValue to ensure server/client match on first render
  const [data, setData] = useState<T>(initialValue);

  // Load from localStorage only after component mounts to avoid hydration mismatches
  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.warn('Conveyor: Failed to parse stored data for', key);
      }
    }
  }, [key]);

  const persist = useCallback((value: T) => {
    setData(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value));
    }
  }, [key]);

  const clearConveyor = useCallback(() => {
    setData(initialValue);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${STORAGE_KEY}_${key}`);
    }
  }, [key, initialValue]);

  return { data, persist, clearConveyor };
}
