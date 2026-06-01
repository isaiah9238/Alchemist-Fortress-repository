
import { z } from 'genkit';

export const TraverseLegSchema = z.object({
  bearing: z.number().describe('The bearing of the traverse leg in decimal degrees.'),
  distance: z.number().describe('The distance of the traverse leg.'),
});

export const LeastSquaresAdjustmentInputSchema = z.object({
  legs: z.array(TraverseLegSchema).describe('An array of traverse legs, each with a bearing and distance.'),
  startPoint: z.object({
    y: z.number().describe('The starting Northing (Y) coordinate.'),
    x: z.number().describe('The starting Easting (X) coordinate.'),
  }).describe('The coordinates of the starting point of the traverse.'),
});

export type LeastSquaresAdjustmentInput = z.infer<typeof LeastSquaresAdjustmentInputSchema>;

export const AdjustedPointSchema = z.object({
  pointNumber: z.number().describe('The point number in the traverse sequence (starting from 0 for the initial point).'),
  y: z.number().describe('The adjusted Northing (Y) coordinate.'),
  x: z.number().describe('The adjusted Easting (X) coordinate.'),
});

export const LeastSquaresAdjustmentOutputSchema = z.object({
  adjustedPoints: z.array(AdjustedPointSchema).describe('The adjusted coordinates for each point in the traverse.'),
  summary: z.string().describe('A brief summary of the adjustment process and the final misclosure.'),
});

export type LeastSquaresAdjustmentOutput = z.infer<typeof LeastSquaresAdjustmentOutputSchema>;
