// src/features/resection/math.ts
import type { Point } from '@/types/geometry';

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

/**
 * Computes a rigorous Least Squares Resection adjustment.
 * Uses an initial approximate coordinate, then iteratively solves the matrix equation: At*W*A * dX = At*W*L
 */
export function computeLeastSquaresResection(
  observations: ResectionObservation[]
): ResectionOutput {
  if (observations.length < 3) {
    throw new Error("A minimum of 3 observed points is required for a resection adjustment.");
  }

  // 1. Generate an initial approximate coordinate (Centroid of control points)
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

  // Gauss-Newton iterative adjustment matrix run
  while (maxChange > 1e-4 && iterations < 20) {
    iterations++;
    const numObs = observations.length - 1; // Number of unique shape angles
    
    // Initialize Normal Matrix elements
    let ATA_00 = 0, ATA_01 = 0, ATA_11 = 0;
    let ATL_0 = 0, ATL_1 = 0;

    const computedAngles: number[] = [];
    const partialsY: number[] = [];
    const partialsX: number[] = [];

    // Compute direction partial derivatives to all landmarks
    observations.forEach((obs) => {
      const dN = obs.knownPoint.y - estimateY;
      const dE = obs.knownPoint.x - estimateX;
      const distSq = dE * dE + dN * dN;
      const dist = Math.sqrt(distSq);

      let az = Math.atan2(dE, dN); // Radians
      if (az < 0) az += 2 * Math.PI;

      computedAngles.push(az);
      // Partial derivatives of azimuth with respect to station Y and X
      partialsY.push(-dE / distSq);
      partialsX.push(dN / distSq);
    });

    // Formulate design matrix rows based on differences between consecutive rays
    const A: number[][] = [];
    const L: number[] = [];

    for (let i = 0; i < observations.length - 1; i++) {
      // Measured angle change from target i to target i+1
      const measuredAngleDiff = (observations[i+1].observedAngleDD - observations[i].observedAngleDD) * Math.PI / 180;
      
      // Computed azimuth change from target i to target i+1
      let computedAngleDiff = computedAngles[i+1] - computedAngles[i];
      if (computedAngleDiff < -Math.PI) computedAngleDiff += 2 * Math.PI;
      if (computedAngleDiff > Math.PI) computedAngleDiff -= 2 * Math.PI;

      // Partial derivatives for the angle difference row
      const dY = partialsY[i+1] - partialsY[i];
      const dX = partialsX[i+1] - partialsX[i];
      
      A.push([dY, dX]);
      
      let deltaL = measuredAngleDiff - computedAngleDiff;
      if (deltaL < -Math.PI) deltaL += 2 * Math.PI;
      if (deltaL > Math.PI) deltaL -= 2 * Math.PI;
      L.push(deltaL);
    }

    // Accumulate Normal Equation components: (A^T * A) and (A^T * L)
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

    // Solve the 2x2 Normal Equation matrix inversion system using Cramer's Rule
    const det = ATA_00 * ATA_11 - ATA_01 * ATA_01;
    if (Math.abs(det) < 1e-12) {
      throw new Error("Geometry matrix singular. Unknown location unresolvable from these baselines.");
    }

    const deltaY = (ATL_0 * ATA_11 - ATL_1 * ATA_01) / det;
    const deltaX = (ATA_00 * ATL_1 - ATA_01 * ATL_0) / det;

    // Apply corrections to current coordinates estimate
    estimateY += deltaY;
    estimateX += deltaX;

    maxChange = Math.max(Math.abs(deltaY), Math.abs(deltaX));

    // On final stable calculation pass, extract standard errors and residuals
    if (maxChange <= 1e-4 || iterations === 20) {
      const degreesOfFreedom = L.length - 2;
      let sumSqResiduals = 0;
      
      for (let i = 0; i < A.length; i++) {
        const v = (A[i][0] * deltaY + A[i][1] * deltaX) - L[i];
        finalResiduals.push(v * 180 / Math.PI * 3600); // Store residuals as seconds of arc
        sumSqResiduals += v * v;
      }

      const sigma0 = degreesOfFreedom > 0 ? Math.sqrt(sumSqResiduals / degreesOfFreedom) : 0.001;
      stdY = sigma0 * Math.sqrt(ATA_11 / det);
      stdX = sigma0 * Math.sqrt(ATA_00 / det);
    }
  }

  return {
    y: estimateY,
    x: estimateX,
    stdY,
    stdX,
    residuals: finalResiduals
  };
}