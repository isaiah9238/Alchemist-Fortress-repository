'use client';

import React from 'react';

/**
 * A static SVG diagram illustrating the components of a parabola for reports.
 */
export function StaticParabolaGraph() {
  const width = 600;
  const height = 400;

  // Parabola parameters: y = a(x - h)^2 + k
  const a = 0.05;
  const h = width / 2;
  const k = height * 0.75;
  
  // Calculate focus and directrix
  const p = 1 / (4 * a);
  const focus = { x: h, y: k - p };
  const directrixY = k + p;

  // Generate points for the parabola path
  const parabolaPoints = Array.from({ length: width }, (_, i) => {
    const x = i;
    const y = a * Math.pow(x - h, 2) + k;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex justify-center p-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-2xl h-auto font-sans"
        style={{
          '--primary-color': 'hsl(var(--primary))',
          '--foreground-color': 'hsl(var(--foreground))',
          '--muted-color': 'hsl(var(--muted-foreground))',
          '--accent-color': 'hsl(var(--accent))',
        } as React.CSSProperties}
      >
        {/* Grid Lines */}
        <line x1="0" y1={directrixY} x2={width} y2={directrixY} stroke="var(--muted-color)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1={h} y1="0" x2={h} y2={height} stroke="var(--muted-color)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Parabola Curve */}
        <polyline
          points={parabolaPoints}
          fill="none"
          stroke="var(--primary-color)"
          strokeWidth="2.5"
        />
        
        {/* Key Points */}
        <circle cx={h} cy={k} r="5" fill="var(--foreground-color)" />
        <circle cx={focus.x} cy={focus.y} r="4" fill="var(--accent-color)" />
        
        {/* Labels */}
        <text x={h + 10} y={k + 5} fill="var(--foreground-color)" className="text-sm font-bold">Vertex (h, k)</text>
        <text x={focus.x + 10} y={focus.y + 5} fill="var(--accent-color)" className="text-sm font-bold">Focus</text>
        <text x={10} y={directrixY - 5} fill="var(--muted-color)" className="text-sm font-bold italic">Directrix</text>
        <text x={h + 10} y={20} fill="var(--muted-color)" className="text-sm font-bold italic">Axis of Symmetry</text>
      </svg>
    </div>
  );
}
