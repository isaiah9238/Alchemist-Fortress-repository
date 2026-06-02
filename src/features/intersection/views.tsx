'use client';

import React, { useEffect } from 'react';
import type { IntersectionResult } from './math';

interface IntersectionViewProps {
  result: IntersectionResult | null;
}

export default function IntersectionView({ result }: IntersectionViewProps) {
  useEffect(() => {
    if (result) {
      localStorage.setItem('lastLoopPlotData', JSON.stringify(result));
    }
  }, [result]);

  return (
    <div className="p-4 border border-zinc-800 bg-zinc-950">
      {/* View UI logic will sit here */}
    </div>
  );
}