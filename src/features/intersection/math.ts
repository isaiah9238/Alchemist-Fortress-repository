import type { Point } from '@/types/geometry';

export type IntersectionResult = {
  p1?: Point;
  p2?: Point;
  solutionCount: 0 | 1 | 2;
};

/**
 * Calculates the intersection of two lines given their starting points and bearings.
 */
export function computeBearingBearing(
  p1: Point, b1DD: number,
  p2: Point, b2DD: number
): Point {
  const b1Rad = b1DD * (Math.PI / 180);
  const b2Rad = b2DD * (Math.PI / 180);

  const sinB1 = Math.sin(b1Rad);
  const cosB1 = Math.cos(b1Rad);
  const sinB2 = Math.sin(b2Rad);
  const cosB2 = Math.cos(b2Rad);

  const denominator = cosB1 * sinB2 - cosB2 * sinB1;

  if (Math.abs(denominator) < 1e-9) {
    throw new Error("Bearings are parallel; no unique intersection exists.");
  }

  const y = (p1.y * sinB1 * cosB2 - p2.y * sinB2 * cosB1 + (p2.x - p1.x) * cosB1 * cosB2) / -denominator;
  const x = (p1.x * cosB1 * sinB2 - p2.x * cosB2 * sinB1 + (p2.y - p1.y) * sinB1 * sinB2) / denominator;

  return { y, x };
}

/**
 * Calculates the intersection points of a line from P1 (bearing) and a circle from P2 (distance).
 */
export function computeBearingDistance(
  p1: Point,
  bearingDD: number,
  p2: Point,
  distance: number
): IntersectionResult {
  const rad = bearingDD * (Math.PI / 180);
  const dx = Math.sin(rad);
  const dy = Math.cos(rad);

  // Vector from P1 to P2
  const ex = p2.x - p1.x;
  const ey = p2.y - p1.y;

  // Project P2 onto the line radiating from P1
  const t = ex * dx + ey * dy;
  
  // Closest point on the line to P2
  const cx = p1.x + t * dx;
  const cy = p1.y + t * dy;

  // Perpendicular distance from P2 to the line
  const pDist = Math.hypot(p2.x - cx, p2.y - cy);

  // No intersection if the distance to the line is greater than the radius
  if (pDist > distance) {
    return { solutionCount: 0 };
  }

  // Tangent intersection (1 solution)
  if (Math.abs(pDist - distance) < 1e-6) {
    return { p1: { x: cx, y: cy }, solutionCount: 1 };
  }

  // Two intersections (secant line)
  const offset = Math.sqrt(distance * distance - pDist * pDist);
  
  return {
    p1: { x: cx - offset * dx, y: cy - offset * dy },
    p2: { x: cx + offset * dx, y: cy + offset * dy },
    solutionCount: 2
  };
}

/**
 * Calculates the intersection points of two circles centered at P1 and P2 with known distances.
 */
export function computeDistanceDistance(
  p1: Point,
  d1: number,
  p2: Point,
  d2: number
): IntersectionResult {
  // Distance between centers
  const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);

  // Check if circles are separate, nested inside each other, or coincident
  if (d > d1 + d2 || d < Math.abs(d1 - d2) || d < 1e-9) {
    return { solutionCount: 0 };
  }

  // Distance from P1 to the chord dividing the intersection lens
  const a = (d1 * d1 - d2 * d2 + d * d) / (2 * d);
  
  // Perpendicular height from chord to intersection points
  const h = Math.sqrt(Math.max(0, d1 * d1 - a * a));

  // Point along the line between centers where the chord crosses
  const cx = p1.x + (a * (p2.x - p1.x)) / d;
  const cy = p1.y + (a * (p2.y - p1.y)) / d;

  // Direction offsets for the height vector
  const rx = -(p2.y - p1.y) / d;
  const ry = (p2.x - p1.x) / d;

  if (h < 1e-6) {
    return { p1: { x: cx, y: cy }, solutionCount: 1 };
  }

  return {
    p1: { x: cx + h * rx, y: cy + h * ry },
    p2: { x: cx - h * rx, y: cy - h * ry },
    solutionCount: 2
  };
}