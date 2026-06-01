
'use client';

import React from 'react';
import { calculateSpiral, getSpiralPoint } from '@/lib/spiralMath';
import type { SpiralElements } from '@/lib/spiralMath';

const SpiralCurveDiagram: React.FC = () => {
  // Input parameters
  const R = 300;
  const Ls = 200;
  const DeltaTotal = 80;
  
  const data: SpiralElements = calculateSpiral(R, Ls, DeltaTotal);
  const scale = 0.8; // Scale for visual fit

  // 1. Generate Points for the Entrance Spiral (TS to SC)
  const entrancePoints: string[] = [];
  for (let l = 0; l <= Ls; l += 5) {
    const pt = getSpiralPoint(l, Ls, R);
    entrancePoints.push(`${pt.x * scale},${-pt.y * scale}`);
  }

  // 2. Calculate Circular Arc (SC to CS)
  const scPoint = getSpiralPoint(Ls, Ls, R);
  const deltaCircularRad = (DeltaTotal - (2 * data.thetaS_deg)) * (Math.PI / 180);

  // Find the center of the circular curve. The center is offset from the original
  // tangent line by the 'throw' (p) plus the radius (R). Its X-coordinate is at 'k'.
  const circleCenter = {
      x: data.k * scale,
      y: -(R + data.p) * scale
  };
  
  // Calculate the end point of the circular arc (CS) by rotating from the SC position
  // around the new circle center. The angle of rotation is the delta of the circular arc.
  const angleAtSC = Math.PI/2 - data.thetaS;
  const csPoint = {
      x: circleCenter.x + R * scale * Math.cos(angleAtSC - deltaCircularRad),
      y: circleCenter.y - R * scale * Math.sin(angleAtSC - deltaCircularRad)
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      <svg viewBox="-50 -250 600 300" 
          className="w-full h-auto"
           style={{
            '--primary-color': 'hsl(var(--primary))',
            '--destructive-color': 'hsl(var(--destructive))',
            '--foreground-color': 'hsl(var(--foreground))',
            '--muted-color': 'hsl(var(--muted-foreground))',
        } as React.CSSProperties} // <--- Add this cast here
        >
        
        {/* Tangent Line */}
        <line x1="-50" y1="0" x2="500" y2="0" stroke="var(--muted-color)" strokeWidth="1" strokeDasharray="4" />

        {/* 1. Entrance Spiral (TS -> SC) */}
        <polyline
          points={entrancePoints.join(' ')}
          fill="none"
          stroke="var(--primary-color)"
          strokeWidth="2.5"
        />

        {/* 2. Circular Arc (SC -> CS) - using large-arc-flag 0 */}
        <path
          d={`M ${scPoint.x * scale} ${-scPoint.y * scale} 
              A ${R * scale} ${R * scale} 0 0 0 
              ${csPoint.x} ${csPoint.y}`}
          fill="none"
          stroke="var(--destructive-color)"
          strokeWidth="2.5"
        />

        {/* Point Markers */}
        <circle cx="0" cy="0" r="4" fill="var(--foreground-color)" /> {/* TS */}
        <circle cx={scPoint.x * scale} cy={-scPoint.y * scale} r="4" fill="var(--foreground-color)" /> {/* SC */}
        <circle cx={csPoint.x} cy={csPoint.y} r="4" fill="var(--foreground-color)" /> {/* CS */}


        {/* Labels */}
        <text x="0" y="20" textAnchor="middle" className="text-xs font-bold" fill="var(--foreground-color)">TS</text>
        <text x={scPoint.x * scale} y={-scPoint.y * scale - 15} textAnchor="middle" className="text-xs font-bold" fill="var(--foreground-color)">SC</text>
        
        {/* Dimension Lines */}
        <line x1={scPoint.x * scale} y1="0" x2={scPoint.x * scale} y2={-scPoint.y * scale} stroke="var(--muted-color)" strokeWidth="1" strokeDasharray="2" />
        <text x={(scPoint.x * scale) + 5} y={-scPoint.y * scale / 2} className="text-[10px] fill-muted-foreground" dominantBaseline="middle">Yc</text>
      </svg>
      
      <div className="flex gap-4 mt-2 justify-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-primary"></span> Spiral
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-destructive"></span> Circular Curve
        </div>
      </div>
    </div>
  );
};

export default SpiralCurveDiagram;

