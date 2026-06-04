gemini.md

# ARITHMAGEN / VECTOR - CORE MATH BLUEPRINT

This file serves as our strict code style guide, structural constraint checklist, and architectural source of truth for the local agent workflow. 

## Architectural & Style Constraints
1. **Absolute Statelessness:** Every function must be a pure function. No React hooks (`useState`), no state mutations, no DOM or document references, and zero canvas context bindings.
2. **Strict TypeScript Typing:** All structural inputs and computation outputs must be strongly typed using explicit TypeScript interfaces or inline primitive object schemas.
3. **Zero UI or Presentation Leakage:** Absolutely no string formatting logic, `.toFixed()` truncations, unit-label suffixes, or toast notification hooks (`useToast`). Return raw mathematical numbers or clean objects.
4. **Defensive Math Engineering:** Gracefully handle edge cases such as collinear lines, parallel bearings, division by zero, and singular matrix determinants.

---

## ── REFERENCE EXAMPLES (THE GOLD STANDARD) ──

### Example 1: Least Squares Resection Matrix Logic
*Demonstrates rigorous iterative adjustment matrix runs, partial derivatives of azimuths, and error/covariance evaluations.*

```typescript
export type Point = {
  y: number;
  x: number;
  name?: string;
};

export type ResectionObservation = {
  knownPoint: Point;
  observedAngleDD: number; // Clockwise angle from an arbitrary reference direction
};

export type ResectionOutput = {
  y: number;
  x: number;
  stdY: number;
  stdX: number;
  residuals: number[];
};

export function computeLeastSquaresResection(
  observations: ResectionObservation[]
): ResectionOutput {
  if (observations.length < 3) {
    throw new Error("A minimum of 3 observed points is required for a resection adjustment.");
  }

  let sumY = 0, sumX = 0;
  observations.forEach(o => {
    sumY += o.knownPoint.y;
    sumX += o.knownPoint.x;
  });
  let estimateY = sumY / observations.length;
  let estimateX = sumX / observations.length;

  let iterations = 0;
  let maxChange = 1.0;
  let stdY = 0, stdX = 0;
  let finalResiduals: number[] = [];

  while (maxChange > 1e-4 && iterations < 20) {
    iterations++;
    let ATA_00 = 0, ATA_01 = 0, ATA_11 = 0;
    let ATL_0 = 0, ATL_1 = 0;

    const computedAngles: number[] = [];
    const partialsY: number[] = [];
    const partialsX: number[] = [];

    observations.forEach((obs) => {
      const dN = obs.knownPoint.y - estimateY;
      const dE = obs.knownPoint.x - estimateX;
      const distSq = dE * dE + dN * dN;

      let az = Math.atan2(dE, dN);
      if (az < 0) az += 2 * Math.PI;

      computedAngles.push(az);
      partialsY.push(-dE / distSq);
      partialsX.push(dN / distSq);
    });

    const A: number[][] = [];
    const L: number[] = [];

    for (let i = 0; i < observations.length - 1; i++) {
      const measuredAngleDiff = (observations[i+1].observedAngleDD - observations[i].observedAngleDD) * Math.PI / 180;
      
      let computedAngleDiff = computedAngles[i+1] - computedAngles[i];
      if (computedAngleDiff < -Math.PI) computedAngleDiff += 2 * Math.PI;
      if (computedAngleDiff > Math.PI) computedAngleDiff -= 2 * Math.PI;

      const dY = partialsY[i+1] - partialsY[i];
      const dX = partialsX[i+1] - partialsX[i];
      
      A.push([dY, dX]);
      
      let deltaL = measuredAngleDiff - computedAngleDiff;
      if (deltaL < -Math.PI) deltaL += 2 * Math.PI;
      if (deltaL > Math.PI) deltaL -= 2 * Math.PI;
      L.push(deltaL);
    }

    for (let i = 0; i < A.length; i++) {
      const rowY = A[i][0];
      const rowX = A[i][1];
      const errorL = L[i];

      ATA_00 += rowY * rowY;
      ATA_01 += rowY * rowX;
      ATA_11 += rowX * rowX;

      ATL_0 += rowY * errorL;
      ATL_1 += rowX * errorL;
    }

    const det = ATA_00 * ATA_11 - ATA_01 * ATA_01;
    if (Math.abs(det) < 1e-12) {
      throw new Error("Geometry matrix singular. Unknown location unresolvable from these baselines.");
    }

    const deltaY = (ATL_0 * ATA_11 - ATL_1 * ATA_01) / det;
    const deltaX = (ATA_00 * ATL_1 - ATA_01 * ATL_0) / det;

    estimateY += deltaY;
    estimateX += deltaX;

    maxChange = Math.max(Math.abs(deltaY), Math.abs(deltaX));

    if (maxChange <= 1e-4 || iterations === 20) {
      const degreesOfFreedom = L.length - 2;
      let sumSqResiduals = 0;
      
      for (let i = 0; i < A.length; i++) {
        const v = (A[i][0] * deltaY + A[i][1] * deltaX) - L[i];
        finalResiduals.push(v * 180 / Math.PI * 3600);
        sumSqResiduals += v * v;
      }

      const sigma0 = degreesOfFreedom > 0 ? Math.sqrt(sumSqResiduals / degreesOfFreedom) : 0.001;
      stdY = sigma0 * Math.sqrt(ATA_11 / det);
      stdX = sigma0 * Math.sqrt(ATA_00 / det);
    }
  }

  return { y: estimateY, x: estimateX, stdY, stdX, residuals: finalResiduals };
}


Example 2: Coordinate Intersections (BB, BD, DD)
Note: Refer to your localized file at src/features/intersection/math.ts for your specific completed analytical intersection logic checks.

── TARGET SOURCE EXTRACTION DIRECTORY ──
Scan the following specific frontend pages inside our directory tree. Analyze the component wrappers, strip out UI rendering code, and extract the underlying mathematical calculation logic into standalone pure functions matching our style guide constraints:

1. Curves & Spiral Layout Core
src/app/calculators/curves/compound-curve/compound-curve-client-page.tsx

src/app/calculators/curves/spiral-curve/spiral-curve-client-page.tsx

src/lib/spiralMath.ts

2. Geometry Core Calculations
src/app/calculators/geometry/area-by-coordinates/area-by-coordinates-client-page.tsx

src/app/calculators/geometry/loop-closure/loop-closure-client-page.tsx

src/app/calculators/geometry/sideshot/sideshot-client-page.tsx

src/app/calculators/geometry/point-offset/point-offset-client-page.tsx

3. Vertical Curve Profiles
src/app/calculators/vertical/slope-to-horizontal/slope-to-horizontal-client-page.tsx

src/app/calculators/vertical/vertical-curve/vertical-curve-client-page.tsx

4. Hydrology & Geodetic Infrastructure
src/app/calculators/storm-water/mannings-equation/mannings-equation-client-page.tsx

src/app/calculators/geodetic/combined-factor/combined-factor-client-page.tsx

