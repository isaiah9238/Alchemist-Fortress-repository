'use server';

import {
  calculateDerivative as calculateDerivativeFlow,
  calculateIntegral as calculateIntegralFlow,
  factorPolynomial as factorPolynomialFlow,
  adjustTraverseLeastSquares as adjustTraverseLeastSquaresFlow,
  suggestToleranceStandard as suggestToleranceStandardFlow,
  runCircleFit as runCircleFitFlow,
} from '@/ai/genkit';
import { adminDb } from '@/lib/firebaseAdmin';
import type {
  CalculateDerivativeInput,
  CalculateDerivativeOutput,
  CalculateIntegralInput,
  CalculateIntegralOutput,
  FactorPolynomialInput,
  FactorPolynomialOutput,
  LeastSquaresAdjustmentInput,
  LeastSquaresAdjustmentOutput,
  ResectionAdjustmentInput,
  ResectionAdjustmentOutput,
  KnownPoint,
  SuggestToleranceStandardInput,
  SuggestToleranceStandardOutput,
  CircleFitInput,
  CircleFitOutput,
} from '@/types/ai';
import type { Point, ConversionResult } from '@/types/actions';
import * as math from 'mathjs';

export async function convertCoordinates(
  points: Point[],
  sourceDef: string,
  targetDef: string,
): Promise<ConversionResult[]> {
  try {
    const proj4 = (await import('proj4')).default;
    proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');

    const results: ConversionResult[] = points.map(point => {
      if (!isFinite(point.x) || !isFinite(point.y)) {
        throw new Error(`Invalid coordinates for point ${point.id}: (${point.x}, ${point.y})`);
      }
      const [x, y] = proj4(sourceDef, targetDef, [point.x, point.y]);
      return { id: point.id, x, y, z: point.z };
    });

    return results;
  } catch (error: any) {
    console.error('Proj4 conversion error:', error);
    throw new Error(`Coordinate conversion failed: ${error.message}`);
  }
}

export async function calculateDerivative(input: CalculateDerivativeInput): Promise<CalculateDerivativeOutput> {
  const result = await calculateDerivativeFlow(input);

  if (result && adminDb) {
    try {
      const { FieldValue } = await import('firebase-admin/firestore');
      await adminDb.collection('derivatives').add({
        ...input,
        ...result,
        createdAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
        console.warn("Could not log derivative calculation to Firestore (expected in local dev):", error);
    }
  }
  
  return result;
}

export async function calculateIntegral(input: CalculateIntegralInput): Promise<CalculateIntegralOutput> {
  return calculateIntegralFlow(input);
}

export async function factorPolynomial(input: FactorPolynomialInput): Promise<FactorPolynomialOutput> {
  return factorPolynomialFlow(input);
}

export async function adjustTraverseLeastSquares(input: LeastSquaresAdjustmentInput): Promise<LeastSquaresAdjustmentOutput> {
  return adjustTraverseLeastSquaresFlow(input);
}

export async function suggestToleranceStandard(input: SuggestToleranceStandardInput): Promise<SuggestToleranceStandardOutput> {
  return suggestToleranceStandardFlow(input);
}

export async function runCircleFit(input: CircleFitInput): Promise<CircleFitOutput> {
  return runCircleFitFlow(input);
}

export async function adjustResectionLeastSquares(
  input: ResectionAdjustmentInput
): Promise<(ResectionAdjustmentOutput & { success: true }) | { success: false, summary: string, diagnostics: any[] }> {
    const { knownPoints, observations } = input;
    const pointMap: Map<string, KnownPoint> = new Map(knownPoints.map(p => [p.name, p]));
    
    const MAX_ITERATIONS = 10;
    const CONVERGENCE_THRESHOLD = 1e-9;

    let approxX = knownPoints.reduce((sum, p) => sum + p.x, 0) / knownPoints.length;
    let approxY = knownPoints.reduce((sum, p) => sum + p.y, 0) / knownPoints.length;
    let approxO = 0; 
    
    const generateDiagnostics = () => {
        const diagnostics: any[] = [];
        for (const obs of observations) {
            const targetPoint = pointMap.get(obs.to);
            if (!targetPoint) continue;
            const dx = targetPoint.x - approxX;
            const dy = targetPoint.y - approxY;
            if (obs.angle !== undefined) {
                const observedAngleRad = obs.angle * (Math.PI / 180);
                const computedBearingRad = Math.atan2(dx, dy);
                const angleMisclosureSec = ((observedAngleRad - computedBearingRad) * 180 / Math.PI) * 3600;
                diagnostics.push({ observationId: `Angle: ${obs.to}`, type: 'Angle', misclosure: angleMisclosureSec, status: Math.abs(angleMisclosureSec) > 20 ? 'SUSPECT' : 'OK' });
            }
        }
        return diagnostics;
    }

    try {
        let iterations = 0;
        const stdDevAngleRad = (5 / 3600) * (Math.PI / 180);
        const stdDevDist = 0.02;
        const weightAngle = 1 / (stdDevAngleRad**2);
        const weightDist = 1 / (stdDevDist**2);

        while (iterations < MAX_ITERATIONS) {
            const a_rows: number[][] = [];
            const l_rows: number[] = [];
            const p_diag: number[] = [];

            for (const obs of observations) {
                const targetPoint = pointMap.get(obs.to);
                if (!targetPoint) throw new Error(`Target point "${obs.to}" not found.`);
                const dx = targetPoint.x - approxX;
                const dy = targetPoint.y - approxY;
                const s_sq = dx * dx + dy * dy;
                if (s_sq < 1e-6) throw new Error(`Setup too close to ${obs.to}.`);
                const s = Math.sqrt(s_sq);

                if (obs.angle !== undefined) {
                    a_rows.push([dy / s_sq, -dx / s_sq, -1]);
                    let angleDiff = (obs.angle * Math.PI / 180) - (Math.atan2(dx, dy) + approxO);
                    while (angleDiff <= -Math.PI) angleDiff += 2 * Math.PI;
                    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                    l_rows.push(angleDiff);
                    p_diag.push(weightAngle);
                }
                if (obs.distance !== undefined) {
                    a_rows.push([-dx / s, -dy / s, 0]);
                    l_rows.push(obs.distance - s);
                    p_diag.push(weightDist);
                }
            }
            
            if (a_rows.length < 3) throw new Error(`Insufficient observations.`);
            const A = math.matrix(a_rows);
            const L = math.matrix(l_rows);
            const P = math.diag(p_diag);
            const AT = math.transpose(A);
            const ATPA = math.multiply(AT, P, A);
            const N_inv = math.inv(ATPA);
            const ATPL = math.multiply(AT, P, L);
            const X = math.multiply(N_inv, ATPL);
            const corrections = X.toArray().flat() as number[];
            const [dY, dX, dO] = corrections;
            approxY += dY; approxX += dX; approxO += dO;
            iterations++;
            if (Math.abs(dY) < CONVERGENCE_THRESHOLD && Math.abs(dX) < CONVERGENCE_THRESHOLD) break;
        }
        
        return {
            success: true,
            northing: approxY,
            easting: approxX,
            summary: `Adjustment converged in ${iterations} iterations.`,
            pointAnalysis: [],
        };
    } catch (e: any) {
        return { success: false, summary: e.message || "Adjustment error.", diagnostics: generateDiagnostics() };
    }
}
