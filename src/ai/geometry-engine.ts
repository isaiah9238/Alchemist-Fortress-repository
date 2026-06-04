'use server';

import { ai } from './genkit';
import { z } from 'genkit';

export type Point = {
  y: number; // Northing
  x: number; // Easting
  name?: string;
};

// ---------------------------------------------------------
// Existing snapToCircle (kept intact)
// ---------------------------------------------------------
export const snapToCircle = (points: Point[]) => {
  if (points.length === 0) return { centerX: 0, centerY: 0, radius: 0, perfectPoints: [] };
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  const distances = points.map(p => Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2));
  const radius = distances.reduce((sum, d) => sum + d, 0) / distances.length;

  const perfectPoints = Array.from({ length: 36 }, (_, i) => {
    const angle = (i / 36) * 2 * Math.PI;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
  return { centerX, centerY, radius, perfectPoints };
};

export const circleSnapFlow = ai.defineFlow(
  {
    name: 'circleSnapFlow',
    inputSchema: z.array(z.object({ x: z.number(), y: z.number() })),
    outputSchema: z.any(), 
  },
  async (points) => snapToCircle(points)
);

// ---------------------------------------------------------
// 1. Curves & Spiral Layout Core
// ---------------------------------------------------------

export type SimpleCurve = {
  radius: number;
  delta: number; // DD
  tangent: number;
  length: number;
  longChord: number;
};

export type CompoundCurveResult = {
  curve1: SimpleCurve;
  curve2: SimpleCurve;
  pcStation: number;
  pccStation: number;
  ptStation: number;
  totalTangent: number;
};

export function calculateCompoundCurve(
  backBearingDD: number,
  fwdBearingDD: number,
  R1: number,
  I1_dd: number,
  R2: number,
  piSta: number
): CompoundCurveResult {
  if (R1 <= 0 || R2 <= 0 || I1_dd <= 0) {
    throw new Error("Radii and Delta 1 must be positive numbers.");
  }

  let total_I = backBearingDD - fwdBearingDD;
  if (total_I < 0) total_I += 360;
  
  if (I1_dd >= total_I) {
    throw new Error("Delta 1 cannot be greater than or equal to the total deflection angle.");
  }
  
  const I2_dd = total_I - I1_dd;

  const I1_rad = I1_dd * (Math.PI / 180);
  const I2_rad = I2_dd * (Math.PI / 180);
  const total_I_rad = total_I * (Math.PI / 180);

  const T1 = R1 * Math.tan(I1_rad / 2);
  const L1 = R1 * I1_rad;
  const LC1 = 2 * R1 * Math.sin(I1_rad / 2);

  const T2 = R2 * Math.tan(I2_rad / 2);
  const L2 = R2 * I2_rad;
  const LC2 = 2 * R2 * Math.sin(I2_rad / 2);
  
  const Ta = T1 + ((T1 + T2) * Math.cos(I2_rad) + (R1 - R2) * (1 - Math.cos(I2_rad))) / Math.sin(total_I_rad);
  const totalTangent = T1 + T2;

  const pcSta = piSta - Ta;
  const pccSta = pcSta + L1;
  const ptSta = pccSta + L2;

  return {
    curve1: { radius: R1, delta: I1_dd, tangent: T1, length: L1, longChord: LC1 },
    curve2: { radius: R2, delta: I2_dd, tangent: T2, length: L2, longChord: LC2 },
    pcStation: pcSta,
    pccStation: pccSta,
    ptStation: ptSta,
    totalTangent
  };
}

export interface SpiralElements {
  thetaS: number;      
  thetaS_deg: number;  
  xc: number;          
  yc: number;          
  p: number;           
  k: number;           
  Ts: number;          
  Es: number;          
  Lc: number;          
  totalLength: number; 
}

export function calculateSpiral(
  radius: number, 
  spiralLength: number, 
  deltaTotalDeg: number
): SpiralElements {
  if (radius <= 0 || spiralLength <= 0 || deltaTotalDeg <= 0) {
    throw new Error("Radius, Spiral Length, and Delta must be positive numbers.");
  }

  const deltaTotalRad = (deltaTotalDeg * Math.PI) / 180;
  
  const thetaS = spiralLength / (2 * radius);
  const thetaS_deg = (thetaS * 180) / Math.PI;

  const xc = spiralLength * (1 - Math.pow(thetaS, 2) / 10 + Math.pow(thetaS, 4) / 216);
  const yc = spiralLength * (thetaS / 3 - Math.pow(thetaS, 3) / 42 + Math.pow(thetaS, 5) / 1320);

  const p = yc - radius * (1 - Math.cos(thetaS));
  const k = xc - radius * Math.sin(thetaS);

  const Ts = k + (radius + p) * Math.tan(deltaTotalRad / 2);
  const Es = (radius + p) / Math.cos(deltaTotalRad / 2) - radius;

  const deltaCircularRad = deltaTotalRad - (2 * thetaS);
  const Lc = radius * deltaCircularRad;

  if ((2 * thetaS_deg) > deltaTotalDeg) {
    throw new Error(`The spirals are too long for the given total delta.`);
  }

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
}

export function getSpiralPoint(l: number, Ls: number, Rc: number): Point {
  const theta = (l * l) / (2 * Rc * Ls);
  const x = l * (1 - Math.pow(theta, 2) / 10 + Math.pow(theta, 4) / 216);
  const y = l * (theta / 3 - Math.pow(theta, 3) / 42 + Math.pow(theta, 5) / 1320);
  return { x, y };
}

// ---------------------------------------------------------
// 2. Geometry Core Calculations
// ---------------------------------------------------------

export function calculateAreaByCoordinates(points: Point[]): { area: number; pointCount: number } {
  if (points.length < 3) {
    throw new Error('Please enter at least 3 points to form a polygon.');
  }

  const closedPoints = [...points];
  const firstPoint = closedPoints[0];
  const lastPoint = closedPoints[closedPoints.length - 1];
  if (firstPoint.x !== lastPoint.x || firstPoint.y !== lastPoint.y) {
    closedPoints.push(firstPoint);
  }

  let area = 0;
  for (let i = 0; i < closedPoints.length - 1; i++) {
    area += closedPoints[i].x * closedPoints[i + 1].y - closedPoints[i + 1].x * closedPoints[i].y;
  }
  
  return { area: Math.abs(area / 2.0), pointCount: points.length };
}

export type TraverseLeg = {
  bearingDD: number;
  distance: number;
};

export type LoopClosureResult = {
  totalDistance: number;
  deltaN: number;
  deltaE: number;
  misclosureDistance: number;
  area: number;
};

export function calculateLoopClosure(legs: TraverseLeg[]): LoopClosureResult {
  if (legs.length === 0) {
    throw new Error('Please enter at least one traverse leg.');
  }

  let totalDistance = 0;
  let totalDeltaN = 0;
  let totalDeltaE = 0;
  const latitudes: number[] = [];
  const departures: number[] = [];

  for (const leg of legs) {
    if (leg.distance <= 0) {
      throw new Error("Leg distance must be a positive number.");
    }
    const bearingRad = leg.bearingDD * (Math.PI / 180);
    const deltaN = leg.distance * Math.cos(bearingRad);
    const deltaE = leg.distance * Math.sin(bearingRad);
    
    latitudes.push(deltaN);
    departures.push(deltaE);

    totalDeltaN += deltaN;
    totalDeltaE += deltaE;
    totalDistance += leg.distance;
  }

  let dmds = [];
  dmds[0] = departures[0];
  let doubleArea = dmds[0] * latitudes[0];

  for (let i = 1; i < legs.length; i++) {
    dmds[i] = dmds[i-1] + departures[i-1] + departures[i];
    doubleArea += dmds[i] * latitudes[i];
  }

  const area = Math.abs(doubleArea / 2);
  const misclosureDistance = Math.sqrt(totalDeltaN ** 2 + totalDeltaE ** 2);

  return {
    totalDistance,
    deltaN: totalDeltaN,
    deltaE: totalDeltaE,
    misclosureDistance,
    area
  };
}

export function calculateSideshot(startPoint: Point, azimuthDD: number, distance: number): Point {
  if (distance <= 0) {
    throw new Error('Please enter a valid positive number for the distance.');
  }

  const azimuthRadians = azimuthDD * (Math.PI / 180);
  const deltaN = distance * Math.cos(azimuthRadians);
  const deltaE = distance * Math.sin(azimuthRadians);

  return {
    y: startPoint.y + deltaN,
    x: startPoint.x + deltaE,
  };
}

export type OffsetResult = {
  offsetDistance: number;
  stationDistance: number;
  offsetDirection: 'Left' | 'Right' | 'On Line';
  projectionPoint: Point;
};

export function calculatePointOffset(pointA: Point, pointB: Point, pointP: Point): OffsetResult {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;

  if (dx === 0 && dy === 0) {
    throw new Error("Line start and end points cannot be identical.");
  }

  const lenSq = dx * dx + dy * dy;
  const t = ((pointP.x - pointA.x) * dx + (pointP.y - pointA.y) * dy) / lenSq;

  const qx = pointA.x + t * dx;
  const qy = pointA.y + t * dy;
  
  const offsetDistance = Math.sqrt(Math.pow(pointP.x - qx, 2) + Math.pow(pointP.y - qy, 2));
  const stationDistance = Math.sqrt(Math.pow(qx - pointA.x, 2) + Math.pow(qy - pointA.y, 2));

  const crossProduct = dx * (pointP.y - pointA.y) - dy * (pointP.x - pointA.x);
  let offsetDirection: 'Left' | 'Right' | 'On Line';
  
  if (Math.abs(crossProduct) < 1e-9) {
    offsetDirection = 'On Line';
  } else if (crossProduct > 0) {
    offsetDirection = 'Right';
  } else {
    offsetDirection = 'Left';
  }
  
  return {
    offsetDistance,
    stationDistance,
    offsetDirection,
    projectionPoint: { x: qx, y: qy }
  };
}

// ---------------------------------------------------------
// 3. Vertical Curve Profiles
// ---------------------------------------------------------

export function calculateHorizontalDistanceZenith(slopeDistance: number, zenithAngleDD: number): number {
  if (slopeDistance <= 0) {
    throw new Error('Slope distance must be a positive number.');
  }
  const angleRad = zenithAngleDD * (Math.PI / 180);
  const hd = slopeDistance * Math.sin(angleRad);
  if (hd < 0) {
    throw new Error('Calculated horizontal distance is negative. Please check inputs.');
  }
  return hd;
}

export function calculateHorizontalDistanceElevation(slopeDistance: number, elevationA: number, elevationB: number): number {
  if (slopeDistance <= 0) {
    throw new Error('Slope distance must be a positive number.');
  }
  const deltaElev = Math.abs(elevationB - elevationA);
  if (deltaElev > slopeDistance) {
    throw new Error('Elevation difference cannot be greater than the slope distance.');
  }
  return Math.sqrt(Math.pow(slopeDistance, 2) - Math.pow(deltaElev, 2));
}

export type VerticalCurveResult = {
  pviStaNum: number;
  pviElevNum: number;
  pvtStaNum: number;
  pvtElevNum: number;
  r: number;
  highLowType: 'High' | 'Low' | 'N/A';
  highLowStaNum?: number;
  highLowElevNum?: number;
};

export function calculateVerticalCurve(
  g1_percent: number,
  g2_percent: number,
  L: number,
  pvcStaNum: number,
  pvcElevNum: number
): VerticalCurveResult {
  if (L <= 0) {
    throw new Error('Length must be greater than zero.');
  }

  const g1 = g1_percent / 100;
  const g2 = g2_percent / 100;

  const r = (g2 - g1) / L;

  const pviStaNum = pvcStaNum + L / 2;
  const pviElevNum = pvcElevNum + g1 * (L / 2);
  
  const pvtStaNum = pvcStaNum + L;
  const pvtElevNum = pvcElevNum + g1 * L + (r / 2) * L * L;

  let highLowType: 'High' | 'Low' | 'N/A' = 'N/A';
  let highLowStaNum: number | undefined = undefined;
  let highLowElevNum: number | undefined = undefined;
  
  if (g1 * g2 < 0) { 
    const x = -g1 / r; 
    if (x > 0 && x < L) {
      highLowType = g1 > 0 ? 'High' : 'Low';
      highLowStaNum = pvcStaNum + x;
      highLowElevNum = pvcElevNum + g1 * x + (r/2) * x * x;
    }
  }

  return {
    pviStaNum,
    pviElevNum,
    pvtStaNum,
    pvtElevNum,
    r,
    highLowType,
    highLowStaNum,
    highLowElevNum
  };
}

// ---------------------------------------------------------
// 4. Hydrology & Geodetic Infrastructure
// ---------------------------------------------------------

export type ChannelShape = 'rectangular' | 'trapezoidal' | 'circular';
export type UnitSystem = 'imperial' | 'metric';

export type ManningsResult = {
  area: number;
  wettedPerimeter: number;
  hydraulicRadius: number;
  velocity: number;
  flowRate: number;
};

export function calculateManningsEquation(
  unitSystem: UnitSystem,
  channelShape: ChannelShape,
  n: number,
  S: number,
  d: number,
  b?: number,
  z?: number,
  D?: number
): ManningsResult {
  if (n <= 0 || S < 0) {
    throw new Error("Manning's n and Channel Slope must be valid positive numbers.");
  }

  let area = 0, wettedPerimeter = 0;
  
  switch(channelShape) {
    case 'rectangular': {
      if (b === undefined || b <= 0 || d <= 0) throw new Error("Bottom Width and Flow Depth must be positive numbers.");
      area = b * d;
      wettedPerimeter = b + 2 * d;
      break;
    }
    case 'trapezoidal': {
      if (b === undefined || z === undefined || b <= 0 || d <= 0 || z < 0) throw new Error("Bottom Width, Flow Depth, and Side Slope must be valid positive numbers.");
      area = (b + z * d) * d;
      wettedPerimeter = b + 2 * d * Math.sqrt(1 + z * z);
      break;
    }
    case 'circular': {
      if(D === undefined || D <= 0 || d <= 0) throw new Error("Diameter and Flow Depth must be positive numbers.");
      if (d > D) throw new Error("Flow depth cannot be greater than the diameter.");
      const r = D / 2;
      if (d === r) { 
        area = (Math.PI * r * r) / 2;
        wettedPerimeter = Math.PI * r;
      } else if (d === D) { 
        area = Math.PI * r * r;
        wettedPerimeter = 2 * Math.PI * r;
      } else {
        const theta = 2 * Math.acos((r - d) / r);
        area = (r * r * (theta - Math.sin(theta))) / 2;
        wettedPerimeter = r * theta;
      }
      break;
    }
  }
  
  if (wettedPerimeter === 0) {
    throw new Error("Cannot calculate with zero wetted perimeter. Check inputs.");
  }
  
  const hydraulicRadius = area / wettedPerimeter;
  const k = unitSystem === 'imperial' ? 1.49 : 1.0;
  const velocity = (k / n) * Math.pow(hydraulicRadius, 2/3) * Math.pow(S, 1/2);
  const flowRate = area * velocity;

  return { area, wettedPerimeter, hydraulicRadius, velocity, flowRate };
}

export type GeodeticUnit = 'ft' | 'm';

export function calculateCombinedFactor(
  elevation: number,
  scaleFactor: number,
  units: GeodeticUnit
): { elevationFactor: number; combinedFactor: number } {
  if (scaleFactor <= 0) {
    throw new Error('Scale factor must be positive.');
  }

  const EARTH_RADIUS_FT = 20906000;
  const EARTH_RADIUS_M = 6371000;
  const R = units === 'ft' ? EARTH_RADIUS_FT : EARTH_RADIUS_M;

  const ef = R / (R + elevation);
  const cf = scaleFactor * ef;

  return {
    elevationFactor: ef,
    combinedFactor: cf
  };
}
