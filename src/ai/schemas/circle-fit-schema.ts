import { z } from 'genkit';

/**
 * @fileOverview Schemas for the Circle Fit analytical flow.
 */

export const CircleFitInputSchema = z.object({
  points: z.array(z.object({
    id: z.string().optional().describe("Optional label or point number."),
    x: z.number().describe("Easting or X coordinate."),
    y: z.number().describe("Northing or Y coordinate."),
  })).min(3, "At least 3 points are required to fit a circle mathematically."),
});

export const CircleFitOutputSchema = z.object({
  center: z.object({
    x: z.number().describe("The calculated center Easting (X) coordinate."),
    y: z.number().describe("The calculated center Northing (Y) coordinate."),
  }),
  radius: z.number().describe("The best-fit radius calculated from the provided points."),
  rmse: z.number().describe("Root Mean Square Error (RMSE) of the radial residuals, indicating the tightness of the fit."),
  observations: z.array(z.object({
    id: z.string().optional().describe("The point identifier from the input."),
    residual: z.number().describe("The radial distance from this point to the edge of the fitted circle."),
    isOutlier: z.boolean().describe("Flagged true if this point's error is statistically significant (potential blunder)."),
  })),
  analysis: z.string().describe("The AI's professional assessment of the data quality, geometry, and confidence in the fit."),
});

export type CircleFitInput = z.infer<typeof CircleFitInputSchema>;
export type CircleFitOutput = z.infer<typeof CircleFitOutputSchema>;
