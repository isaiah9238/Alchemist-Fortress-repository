import type { Point } from '@/lib/types';

export type IntersectionResult = {
  p1: Point;
  p2?: Point;
  solutionCount: 0 | 1 | 2;
};

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

// You can add computeBearingDistance and computeDistanceDistance below here 
// using the same pattern, returning { p1, p2?, solutionCount } objects.