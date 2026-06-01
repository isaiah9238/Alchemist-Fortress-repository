
'use client';

import React from 'react';

interface Props {
  sigmaX2: number;  // Variance X (from covariance matrix [0,0])
  sigmaY2: number;  // Variance Y (from [1,1])
  sigmaXY: number;  // Covariance (from [0,1])
  scale?: number;   // Pixels per meter for visualization
}

const ErrorEllipse: React.FC<Props> = ({ sigmaX2, sigmaY2, sigmaXY, scale = 1000 }) => {
  // 1. Calculate Orientation
  const phi = 0.5 * Math.atan2(2 * sigmaXY, sigmaX2 - sigmaY2);
  const phiDegrees = (phi * 180) / Math.PI;

  // 2. Calculate Eigenvalues (Semi-axes squared)
  const commonTerm = Math.sqrt(Math.pow((sigmaX2 - sigmaY2) / 2, 2) + Math.pow(sigmaXY, 2));
  const lambda1 = (sigmaX2 + sigmaY2) / 2 + commonTerm;
  const lambda2 = (sigmaX2 + sigmaY2) / 2 - commonTerm;

  // 3. Convert to axis lengths (apply 95% confidence interval factor of 2.45)
  const a = Math.sqrt(lambda1) * 2.45 * scale; 
  const b = Math.sqrt(lambda2) * 2.45 * scale;

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <g transform="translate(100, 100)">
        {/* Crosshair for the calculated point */}
        <line x1="-5" y1="0" x2="5" y2="0" stroke="hsl(var(--destructive))" strokeWidth="1" />
        <line x1="0" y1="-5" x2="0" y2="5" stroke="hsl(var(--destructive))" strokeWidth="1" />
        
        {/* The Error Ellipse */}
        <ellipse
          cx="0"
          cy="0"
          rx={a}
          ry={b}
          transform={`rotate(${phiDegrees})`}
          fill="hsla(var(--destructive) / 0.2)"
          stroke="hsl(var(--destructive))"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};

export default ErrorEllipse;
