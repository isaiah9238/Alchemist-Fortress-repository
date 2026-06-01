/**
 * Surveyor's Spiral Math Engine
 * Calculates elements for a Circular Curve with Symmetric Spiral Transitions
 */

export interface SpiralElements {
  thetaS: number;      // Spiral angle (radians)
  thetaS_deg: number;  // Spiral angle (degrees)
  xc: number;          // Large X coordinate at SC
  yc: number;          // Large Y coordinate at SC
  p: number;           // "Throw" (Offset from tangent to shifted circle)
  k: number;           // Distance from TS to shifted PC
  Ts: number;          // Total Tangent Distance (TS to PI)
  Es: number;          // External Distance
  Lc: number;          // Length of circular arc
  totalLength: number; // Total length (Ls + Lc + Ls)
}

export const calculateSpiral = (
  radius: number, 
  spiralLength: number, 
  deltaTotalDeg: number
): SpiralElements => {
  const deltaTotalRad = (deltaTotalDeg * Math.PI) / 180;
  
  // 1. Spiral Angle (theta_s)
  const thetaS = spiralLength / (2 * radius);
  const thetaS_deg = (thetaS * 180) / Math.PI;

  // 2. Coordinates at SC (using 3-term power series for high precision)
  const xc = spiralLength * (1 - Math.pow(thetaS, 2) / 10 + Math.pow(thetaS, 4) / 216);
  const yc = spiralLength * (thetaS / 3 - Math.pow(thetaS, 3) / 42 + Math.pow(thetaS, 5) / 1320);

  // 3. Throw (p) and Distance to shifted PC (k)
  const p = yc - radius * (1 - Math.cos(thetaS));
  const k = xc - radius * Math.sin(thetaS);

  // 4. Total Tangent Distance (Ts)
  const Ts = k + (radius + p) * Math.tan(deltaTotalRad / 2);

  // 5. External Distance (Es)
  const Es = (radius + p) / Math.cos(deltaTotalRad / 2) - radius;

  // 6. Circular Curve Length (Lc)
  // The central angle of the circular portion is Delta - 2*thetaS
  const deltaCircularRad = deltaTotalRad - (2 * thetaS);
  const Lc = radius * deltaCircularRad;

  return {
    thetaS,
    thetaS_deg,
    xc,
    yc,
    p,
    k,
    Ts,
    Es,
    Lc,
    totalLength: (2 * spiralLength) + Lc
  };
};

/**
 * Get (X, Y) coordinates for any point along the spiral for staking
 * @param l Distance from TS along the spiral
 */
export const getSpiralPoint = (l: number, Ls: number, Rc: number) => {
  const theta = (l * l) / (2 * Rc * Ls);
  const x = l * (1 - Math.pow(theta, 2) / 10 + Math.pow(theta, 4) / 216);
  const y = l * (theta / 3 - Math.pow(theta, 3) / 42 + Math.pow(theta, 5) / 1320);
  return { x, y };
};