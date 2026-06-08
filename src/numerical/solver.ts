
'use client';

import type { MathPoint, LabFunction, ParametricLabFunction } from './labs/types';

/**
 * A universal numerical solver to find intersection points between two Cartesian functions.
 * It uses a hybrid approach: a quick scan to find approximate roots, followed by
 * Newton's method to refine those roots to a high degree of precision.
 *
 * @param labA The first function object.
 * @param labB The second function object.
 * @param minX The minimum x-value of the area to search.
 * @param maxX The maximum x-value of the area to search.
 * @returns An array of intersection points.
 */
export function findIntersections(
  labA: LabFunction,
  labB: LabFunction,
  minX: number,
  maxX: number
): MathPoint[] {
  // 1. Scanning Phase: Find approximate locations where functions might cross.
  const initialGuesses: number[] = [];
  const step = (maxX - minX) / 5000; // Increased scan resolution
  let lastDiff: number | null = null;

  for (let x = minX; x <= maxX; x += step) {
    const yA = labA.getY(x);
    const yB = labB.getY(x);

    if (yA === null || yB === null) {
      lastDiff = null; // Reset if we are outside the domain of either function
      continue;
    }

    const currentDiff = yA - yB;
    if (lastDiff !== null && lastDiff * currentDiff < 0) {
      initialGuesses.push(x - step / 2); // Found a zero-crossing
    }
    lastDiff = currentDiff;
  }

  // 2. Newton's Method Phase: Refine each guess to a precise point.
  const refinedPoints: MathPoint[] = initialGuesses
    .map((guess) => {
      let x = guess;
      // Iterate to "slide down" the derivative to the root.
      for (let i = 0; i < 10; i++) {
        const yA = labA.getY(x);
        const yB = labB.getY(x);
        if (yA === null || yB === null) break;

        const f_x = yA - yB; // The function we want to find the root of (where it equals zero)

        const slopeA = labA.getSlope(x);
        const slopeB = labB.getSlope(x);
        if (slopeA === null || slopeB === null) break;

        const f_prime_x = slopeA - slopeB; // The derivative of our difference function
        if (Math.abs(f_prime_x) < 1e-9) break; // Avoid division by zero (happens at parallel slopes)

        x = x - f_x / f_prime_x; // Newton's step
      }
      const finalY = labA.getY(x);
      return finalY !== null ? { x, y: finalY } : null;
    })
    .filter((p): p is MathPoint => p !== null);

  // 3. Validation "Domain Guard" Phase: Filter out any "ghost points".
  const validatedIntersections: MathPoint[] = [];
  const seen = new Set<string>();

  for (const p of refinedPoints) {
    const yA = labA.getY(p.x);
    const yB = labB.getY(p.x);

    // Both points must be valid (not null).
    if (yA === null || yB === null) continue;

    // The "Guardrail": If the Y-values aren't almost identical, it's a false positive.
    if (Math.abs(yA - yB) < 0.001) {
      const key = p.x.toFixed(4);
      if (!seen.has(key)) {
        validatedIntersections.push({ x: p.x, y: yA });
        seen.add(key);
      }
    }
  }

  return validatedIntersections;
}


/**
 * Finds intersections between a parametric function and a cartesian function.
 * @param parametricLab The parametric function object.
 * @param cartesianLab The cartesian function object.
 * @returns An array of intersection points.
 */
export function findParametricCartesianIntersections(
  parametricLab: ParametricLabFunction,
  cartesianLab: LabFunction
): MathPoint[] {
    const tMin = parametricLab.getTMin();
    const tMax = parametricLab.getTMax();

    // F(t) = y_parametric(t) - y_cartesian(x_parametric(t))
    const F = (t: number): number | null => {
        const spiralX = parametricLab.getX(t);
        const spiralY = parametricLab.getY(t);
        if (spiralX === null || spiralY === null) return null;

        const cartesianY = cartesianLab.getY(spiralX);
        if (cartesianY === null) return null;

        return spiralY - cartesianY;
    }

    // F'(t) = y'_parametric(t) - y'_cartesian(x_parametric(t)) * x'_parametric(t)
    const F_prime = (t: number): number | null => {
        const spiralX = parametricLab.getX(t);
        if (spiralX === null) return null;

        const dxdt = parametricLab.getSlopeX(t);
        const dydt = parametricLab.getSlopeY(t);
        if (dxdt === null || dydt === null) return null;
        
        const cartesianSlope = cartesianLab.getSlope(spiralX);
        if (cartesianSlope === null) return null;

        return dydt - cartesianSlope * dxdt;
    }

    // Scanning phase for 't'
    const initialGuesses: number[] = [];
    const step = (tMax - tMin) / 5000;
    let lastDiff: number | null = null;
    
    for (let t = tMin; t <= tMax; t += step) {
        const currentDiff = F(t);
        if (currentDiff === null) {
            lastDiff = null;
            continue;
        }
        if (lastDiff !== null && lastDiff * currentDiff < 0) {
            initialGuesses.push(t - step / 2);
        }
        lastDiff = currentDiff;
    }

    // Newton's method to refine 't'
    const refinedPoints: MathPoint[] = initialGuesses.map(guess => {
        let t = guess;
        for (let i = 0; i < 10; i++) {
            const f_t = F(t);
            const f_prime_t = F_prime(t);

            if (f_t === null || f_prime_t === null || Math.abs(f_prime_t) < 1e-9) break;

            t = t - f_t / f_prime_t;
        }

        const finalX = parametricLab.getX(t);
        const finalY = parametricLab.getY(t);
        if (finalX === null || finalY === null) return null;
        
        const cartesianY = cartesianLab.getY(finalX);
        if(cartesianY === null || Math.abs(finalY - cartesianY) > 0.001) return null;

        return { x: finalX, y: finalY };
    }).filter((p): p is MathPoint => p !== null);
    
    // Deduplicate
    const validatedIntersections: MathPoint[] = [];
    const seen = new Set<string>();

    for (const p of refinedPoints) {
      const key = `${p.x.toFixed(4)},${p.y.toFixed(4)}`;
      if (!seen.has(key)) {
        validatedIntersections.push(p);
        seen.add(key);
      }
    }
    
    return validatedIntersections;
}

/**
 * Finds intersection points between two parametric functions by discretizing them
 * into line segments and checking for intersections.
 *
 * @param labA The first parametric function object.
 * @param labB The second parametric function object.
 * @returns An array of intersection points.
 */
export function findParametricIntersections(
  labA: ParametricLabFunction,
  labB: ParametricLabFunction
): MathPoint[] {
  const getPoints = (lab: ParametricLabFunction): (MathPoint | null)[] => {
    const points: (MathPoint | null)[] = [];
    const tMin = lab.getTMin();
    const tMax = lab.getTMax();
    const steps = 500;
    for (let i = 0; i <= steps; i++) {
      const t = tMin + (i / steps) * (tMax - tMin);
      const x = lab.getX(t);
      const y = lab.getY(t);
      if (x !== null && y !== null && isFinite(x) && isFinite(y)) {
        points.push({ x, y });
      } else {
        points.push(null); // Indicates a break in the curve
      }
    }
    return points;
  };

  const pointsA = getPoints(labA);
  const pointsB = getPoints(labB);

  const intersections: MathPoint[] = [];

  for (let i = 0; i < pointsA.length - 1; i++) {
    const p1 = pointsA[i];
    const p2 = pointsA[i + 1];
    if (!p1 || !p2) continue; // Skip segment if it's across a break

    for (let j = 0; j < pointsB.length - 1; j++) {
      const p3 = pointsB[j];
      const p4 = pointsB[j + 1];
      if (!p3 || !p4) continue;

      const denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);

      if (Math.abs(denominator) > 1e-9) { // Not parallel
        const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
        const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
          intersections.push({
            x: p1.x + ua * (p2.x - p1.x),
            y: p1.y + ua * (p2.y - p1.y),
          });
        }
      }
    }
  }

  // Deduplicate
  const uniqueIntersections: MathPoint[] = [];
  const seen = new Set<string>();
  for (const p of intersections) {
    const key = `${p.x.toFixed(3)},${p.y.toFixed(3)}`;
    if (!seen.has(key)) {
      uniqueIntersections.push(p);
      seen.add(key);
    }
  }
  
  return uniqueIntersections;
}


/**
 * Finds self-intersection points for a single parametric function.
 * @param lab The parametric function object.
 * @returns An array of intersection points.
 */
export function findSelfIntersections(
  lab: ParametricLabFunction
): MathPoint[] {
  const getPoints = (labFunc: ParametricLabFunction): (MathPoint | null)[] => {
    const points: (MathPoint | null)[] = [];
    const tMin = labFunc.getTMin();
    const tMax = labFunc.getTMax();
    const steps = 500; // Resolution of the discretization
    for (let i = 0; i <= steps; i++) {
      const t = tMin + (i / steps) * (tMax - tMin);
      const x = labFunc.getX(t);
      const y = labFunc.getY(t);
      if (x !== null && y !== null && isFinite(x) && isFinite(y)) {
        points.push({ x, y });
      } else {
        points.push(null);
      }
    }
    return points;
  };

  const points = getPoints(lab);
  const intersections: MathPoint[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (!p1 || !p2) continue;

    // Start j from i + 2 to avoid checking against itself or adjacent segments
    for (let j = i + 2; j < points.length - 1; j++) {
      const p3 = points[j];
      const p4 = points[j + 1];
      if (!p3 || !p4) continue;

      const denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);

      if (Math.abs(denominator) > 1e-9) { // Not parallel
        const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
        const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
          intersections.push({
            x: p1.x + ua * (p2.x - p1.x),
            y: p1.y + ua * (p2.y - p1.y),
          });
        }
      }
    }
  }

  // Deduplicate
  const uniqueIntersections: MathPoint[] = [];
  const seen = new Set<string>();
  for (const p of intersections) {
    const key = `${p.x.toFixed(3)},${p.y.toFixed(3)}`;
    if (!seen.has(key)) {
      uniqueIntersections.push(p);
      seen.add(key);
    }
  }
  
  return uniqueIntersections;
}

