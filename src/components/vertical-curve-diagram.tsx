
'use client';

import React from 'react';

/**
 * A static SVG diagram illustrating the components of a vertical curve.
 * This is a visual aid for the vertical curve calculator.
 */
export function VerticalCurveDiagram() {
  const width = 800;
  const height = 400;

  // Key points for a crest curve
  const pvc = { x: 100, y: 200 };
  const pvi = { x: 400, y: 300 }; // PVI is below PVC and PVT for a crest
  const pvt = { x: 700, y: 225 };
  
  // The control point for a quadratic Bezier curve that ensures the lines are tangent
  // is the PVI itself.
  const controlPoint = pvi;

  // Extend tangent lines for visual effect
  const tangent1_start = { 
    x: pvc.x - (pvi.x - pvc.x) * 0.5,
    y: pvc.y - (pvi.y - pvc.y) * 0.5
  };
  const tangent2_end = {
    x: pvt.x + (pvt.x - pvi.x) * 0.5,
    y: pvt.y + (pvt.y - pvi.y) * 0.5
  };


  return (
    <div className="flex justify-center p-4">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full max-w-4xl h-auto font-sans"
        style={{
            '--primary-color': 'hsl(var(--primary))',
            '--foreground-color': 'hsl(var(--foreground))',
            '--muted-color': 'hsl(var(--muted-foreground))',
            '--border-color': 'hsl(var(--border))',
            '--accent-color': 'hsl(var(--accent))',
        } as React.CSSProperties}
      >
        {/* --- Tangent Lines (Grade Lines) --- */}
        <line x1={tangent1_start.x} y1={tangent1_start.y} x2={pvi.x} y2={pvi.y} stroke="var(--muted-color)" strokeWidth="1.5" />
        <line x1={pvi.x} y1={pvi.y} x2={tangent2_end.x} y2={tangent2_end.y} stroke="var(--muted-color)" strokeWidth="1.5" />

        {/* --- The Parabolic Curve --- */}
        {/* Using a quadratic Bezier curve with the control point at the PVI ensures tangency */}
        <path
          d={`M ${pvc.x} ${pvc.y} Q ${controlPoint.x} ${controlPoint.y}, ${pvt.x} ${pvt.y}`}
          fill="none"
          stroke="var(--foreground-color)"
          strokeWidth="2.5"
        />

        {/* --- Construction Lines --- */}
        <line x1={pvc.x} y1={pvc.y} x2={pvc.x} y2={height-50} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1={pvi.x} y1={pvi.y} x2={pvi.x} y2={height-50} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1={pvt.x} y1={pvt.y} x2={pvt.x} y2={height-50} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
        
        {/* Horizontal Line for Length */}
         <line x1={pvc.x} y1={height-50} x2={pvt.x} y2={height-50} stroke="var(--muted-color)" strokeWidth="1" markerStart="url(#arrow-h)" markerEnd="url(#arrow-h)"/>
        
        {/* Tangent Labels */}
        <text x={(pvc.x + pvi.x) / 2} y={(pvc.y + pvi.y) / 2 + 15} fill="var(--primary-color)" textAnchor="middle" className="text-sm italic">g₁</text>
        <text x={(pvi.x + pvt.x) / 2} y={(pvi.y + pvt.y) / 2 + 15} fill="var(--primary-color)" textAnchor="middle" className="text-sm italic">g₂</text>

        {/* Point Markers & Labels */}
        <g fill="var(--foreground-color)">
            <circle cx={pvc.x} cy={pvc.y} r="5" />
            <text x={pvc.x} y={pvc.y - 15} textAnchor="middle" className="text-sm font-bold">PVC</text>
        </g>
        <g fill="var(--foreground-color)">
            <circle cx={pvi.x} cy={pvi.y} r="5" />
            <text x={pvi.x} y={pvi.y + 25} textAnchor="middle" className="text-sm font-bold">PVI</text>
        </g>
         <g fill="var(--foreground-color)">
            <circle cx={pvt.x} cy={pvt.y} r="5" />
            <text x={pvt.x} y={pvt.y - 15} textAnchor="middle" className="text-sm font-bold">PVT</text>
        </g>

        {/* Length Label */}
        <text x={width/2} y={height - 60} fill="var(--muted-color)" textAnchor="middle" className="text-sm font-bold italic">L (Length of Curve)</text>

        <defs>
          <marker id="arrow-h" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-color)" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};
