
'use client';

import React from 'react';

/**
 * A static SVG diagram illustrating the components of a horizontal curve.
 * This is a visual aid for the horizontal curve calculator, with geometry
 * calculated dynamically based on set parameters.
 * The SVG is styled with CSS variables to adapt to the application's theme.
 */
export function HorizontalCurveDiagram() {
  // Viewbox settings
  const width = 600;
  const height = 500;
  
  // Geometric Parameters (Centralized for easy adjustment)
  const center = { x: 300, y: 450 };
  const radius = 350;
  const startAngle = -125; // in degrees
  const endAngle = -55;   // in degrees
  const deflectionAngle = endAngle - startAngle; // "I" or "Δ"
  
  // Helper to convert polar to cartesian
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Key Points
  const PC = polarToCartesian(center.x, center.y, radius, startAngle);
  const PT = polarToCartesian(center.x, center.y, radius, endAngle);
  
  // Intersection Point (PI) calculation using Tangent length T = R * tan(I/2)
  const halfI = (deflectionAngle / 2) * (Math.PI / 180);
  const tangentLength = radius * Math.tan(halfI);
  const PI_Dist = radius / Math.cos(halfI);
  const PI = polarToCartesian(center.x, center.y, PI_Dist, startAngle + deflectionAngle / 2);
  
  // Middle of Curve (POC)
  const POC = polarToCartesian(center.x, center.y, radius, startAngle + deflectionAngle / 2);
  
  const midLongChord = {
      x: (PC.x + PT.x) / 2,
      y: (PC.y + PT.y) / 2
  }

  return (
    <div className="flex justify-center p-4">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full max-w-2xl h-auto font-sans"
        style={{
            '--primary-color': 'hsl(var(--primary))',
            '--foreground-color': 'hsl(var(--foreground))',
            '--muted-color': 'hsl(var(--muted-foreground))',
            '--border-color': 'hsl(var(--border))',
        } as React.CSSProperties }
      >
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--foreground-color)" />
            </marker>
        </defs>

        {/* --- Background Tangent Lines --- */}
        <line x1={PC.x - 100} y1={PC.y + 70} x2={PI.x} y2={PI.y} stroke="var(--muted-color)" strokeWidth="1.5" />
        <line x1={PT.x + 100} y1={PT.y + 70} x2={PI.x} y2={PI.y} stroke="var(--muted-color)" strokeWidth="1.5" />

        {/* --- Radial & Construction Lines --- */}
        <g stroke="var(--primary-color)" strokeWidth="1.5" fill="none">
          <line x1={center.x} y1={center.y} x2={PC.x} y2={PC.y} />
          <line x1={center.x} y1={center.y} x2={PT.x} y2={PT.y} />
          <line x1={center.x} y1={center.y} x2={PI.x} y2={PI.y} strokeDasharray="5,5" />
          <line x1={PC.x} y1={PC.y} x2={PT.x} y2={PT.y} /> {/* Long Chord (LC) */}
          <line x1={PI.x} y1={PI.y} x2={POC.x} y2={POC.y} strokeDasharray="5,5" />
          <line x1={midLongChord.x} y1={midLongChord.y} x2={POC.x} y2={POC.y} strokeDasharray="5,5" />
        </g>

        {/* --- The Main Curve --- */}
        <path
          d={`M ${PC.x} ${PC.y} A ${radius} ${radius} 0 0 1 ${PT.x} ${PT.y}`}
          fill="none"
          stroke="var(--foreground-color)"
          strokeWidth="2.5"
        />

        {/* --- Right Angle Markers --- */}
        <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="var(--muted-color)" transform={`translate(${PC.x}, ${PC.y}) rotate(${startAngle + 90})`} />
        <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="var(--muted-color)" transform={`translate(${PT.x}, ${PT.y}) rotate(${endAngle + 90})`} />

        {/* --- Point Markers & Labels --- */}
        <circle cx={PC.x} cy={PC.y} r="4" fill="var(--foreground-color)" />
        <text x={PC.x - 45} y={PC.y - 5} className="text-sm font-bold" fill="var(--foreground-color)">PC</text>

        <circle cx={PT.x} cy={PT.y} r="4" fill="var(--foreground-color)" />
        <text x={PT.x + 20} y={PT.y - 15} className="text-sm font-bold" fill="var(--foreground-color)">PT</text>
        
        <circle cx={PI.x} cy={PI.y} r="4" fill="var(--foreground-color)" />
        <text x={PI.x} y={PI.y - 5} textAnchor="middle" className="text-sm font-bold" fill="var(--foreground-color)">PI</text>
        
        {/* Variable Labels */}
        <g fill="var(--primary-color)" className="font-bold italic">
            <text x={(PC.x + PI.x)/2 - 40} y={(PC.y + PI.y)/2} >T</text>
            <text x={(PT.x + PI.x)/2 + 40} y={(PT.y + PI.y)/2} >T</text>
            <text x={center.x - 25} y={(center.y + PC.y)/2} >R</text>
            <text x={(midLongChord.x + POC.x)/2 - 15} y={(midLongChord.y + POC.y)/2} >M</text>
            <text x={(PI.x + POC.x)/2 + 5} y={(PI.y + POC.y)/2 + 5} >E</text>
            <text x={(PC.x + PT.x) / 2 + 15} y={(PC.y + PT.y) / 2 - 10}>LC</text>
            <text x={center.x} y={center.y - 60} textAnchor="middle" className="text-lg">Δ</text>
        </g>
        
        {/* Deflection Angle Arcs */}
        <path d={`M ${center.x - 40} ${center.y - 50} A 60 60 0 0 1 ${center.x + 40} ${center.y - 50}`} fill="none" stroke="var(--foreground-color)" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
      </svg>
    </div>
  );
};
