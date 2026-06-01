
import { z } from 'genkit';

export const KnownPointSchema = z.object({
  name: z.string(),
  y: z.number().describe('Northing coordinate of the known point.'),
  x: z.number().describe('Easting coordinate of the known point.'),
});

export const ObservedAngleSchema = z.object({
  from: z.string().describe('The name of the point sighted first.'),
  to: z.string().describe('The name of the point sighted second.'),
  angle: z.number().describe('The clockwise angle in decimal degrees measured from the "from" point to the "to" point.'),
});

export const ResectionAdjustmentInputSchema = z.object({
  knownPoints: z.array(KnownPointSchema),
  observedAngles: z.array(ObservedAngleSchema),
});

export const PointAnalysisSchema = z.object({
    pointId: z.string().describe("The name or identifier of the observation/point being analyzed."),
    residual: z.number().describe("The residual error for this observation, in seconds of arc."),
    isOutlier: z.boolean().describe("True if this observation is a statistical outlier (blunder).")
});

export const ResectionAdjustmentOutputSchema = z.object({
  northing: z.number().describe('The final adjusted Northing (Y) of the unknown station.'),
  easting: z.number().describe('The final adjusted Easting (X) of the unknown station.'),
  summary: z.string().describe('A summary of the adjustment process and results.'),
  sigma0: z.number().optional().describe('Standard deviation of unit weight, indicating the overall quality of the adjustment.'),
  stdX: z.number().optional().describe('Standard deviation of the final Easting coordinate.'),
  stdY: z.number().optional().describe('Standard deviation of the final Northing coordinate.'),
  redundancy: z.number().optional().describe('The number of redundant observations in the adjustment.'),
  covarianceXX: z.number().optional().describe('The XX (Easting, Easting) component of the covariance matrix (variance of X).'),
  covarianceYY: z.number().optional().describe('The YY (Northing, Northing) component of the covariance matrix (variance of Y).'),
  covarianceXY: z.number().optional().describe('The XY (Easting, Northing) component of the covariance matrix.'),
  pointAnalysis: z.array(PointAnalysisSchema).optional().describe("An analysis of each observation's residual error.")
});
