/**
 * Shared Type Definitions for AI Flows
 * These are self-contained and match the Genkit schemas to avoid 
 * importing server-only logic into client components.
 */

import { z } from 'zod';

// Derivative
export const CalculateDerivativeInputSchema = z.object({
  expression: z.string(),
  variable: z.string(),
});
export const CalculateDerivativeOutputSchema = z.object({
  derivative: z.string(),
  simplified: z.string(),
  latex: z.string(),
});

// Integral
export const CalculateIntegralInputSchema = z.object({
  expression: z.string().describe("The mathematical expression to integrate. For example: x^2 + 3*x + 5"),
  variable: z.string().default("x").describe("The variable to integrate with respect to. For example: x"),
  lowerBound: z.string().optional().describe("The lower bound for a definite integral. Leave empty for indefinite integral."),
  upperBound: z.string().optional().describe("The upper bound for a definite integral. Leave empty for indefinite integral."),
});
export const CalculateIntegralOutputSchema = z.object({
  integral: z.string().describe("The calculated integral of the expression. For indefinite integrals, include the constant C."),
  simplified: z.string().describe("The simplified form of the integral."),
  latex: z.string().describe("The LaTeX representation of the simplified integral."),
  value: z.number().optional().describe("The numerical value if it is a definite integral."),
});

// Factor Polynomial
export const FactorPolynomialInputSchema = z.object({
  expression: z.string().describe("The polynomial expression to factor. For example: x^2 - 3*x - 10"),
});
export const FactorPolynomialOutputSchema = z.object({
  factored: z.string().describe("The factored form of the polynomial. For example: (x-5)(x+2)"),
  roots: z.array(z.string()).describe("The roots of the polynomial. For example: [\"5\", \"-2\"]"),
  latex: z.string().describe("The LaTeX representation of the factored form."),
});

// Least Squares Adjustment
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

export const AdjustedPointSchema = z.object({
  pointNumber: z.number().describe('The point number in the traverse sequence (starting from 0 for the initial point).'),
  y: z.number().describe('The adjusted Northing (Y) coordinate.'),
  x: z.number().describe('The adjusted Easting (X) coordinate.'),
});

export const LeastSquaresAdjustmentOutputSchema = z.object({
  adjustedPoints: z.array(AdjustedPointSchema).describe('The adjusted coordinates for each point in the traverse.'),
  summary: z.string().describe('A brief summary of the adjustment process and the final misclosure.'),
});

// Resection Adjustment
export const KnownPointSchema = z.object({
  name: z.string(),
  y: z.number().describe('Northing coordinate of the known point.'),
  x: z.number().describe('Easting coordinate of the known point.'),
});

export const ObservationSchema = z.object({
  to: z.string().describe('The name of the foresight point.'),
  angle: z.number().optional().describe('The clockwise angle in decimal degrees measured from the backsight.'),
  distance: z.number().optional().describe('The measured distance from the unknown setup to the foresight point.'),
});

export const ResectionAdjustmentInputSchema = z.object({
  knownPoints: z.array(KnownPointSchema),
  observations: z.array(ObservationSchema),
});

export const PointAnalysisSchema = z.object({
    observationId: z.string().describe("Identifier for the observation."),
    type: z.enum(['Angle', 'Distance']).describe("The type of the observation."),
    residual: z.number().describe("The residual error for this observation."),
    isOutlier: z.boolean().describe("True if this observation is a statistical outlier."),
    standardizedResidual: z.number().optional().describe("The standardized residual (w-statistic)."),
});

export const ResectionAdjustmentOutputSchema = z.object({
  northing: z.number().describe('The final adjusted Northing (Y) of the unknown station.'),
  easting: z.number().describe('The final adjusted Easting (X) of the unknown station.'),
  summary: z.string().describe('A summary of the adjustment process and results.'),
  sigma0: z.number().optional().describe('Standard deviation of unit weight.'),
  stdX: z.number().optional().describe('Standard deviation of the final Easting coordinate.'),
  stdY: z.number().optional().describe('Standard deviation of the final Northing coordinate.'),
  redundancy: z.number().optional().describe('The number of redundant observations.'),
  covarianceXX: z.number().optional().describe('Variance of X.'),
  covarianceYY: z.number().optional().describe('Variance of Y.'),
  covarianceXY: z.number().optional().describe('Covariance of X and Y.'),
  pointAnalysis: z.array(PointAnalysisSchema).optional().describe("An analysis of each observation's residual error.")
});

// Suggest Tolerance Standard
export const SuggestToleranceStandardInputSchema = z.object({
  surveyType: z.enum(['ALTA', 'Construction', 'Boundary', 'Industrial-GD&T'])
    .describe("The type of survey being conducted."),
  terrain: z.string()
    .describe("The terrain of the survey area."),
  modifiers: z.array(z.enum(['MMC', 'LMC', 'RFS', 'CZ', 'OZ']))
    .optional()
    .describe("GD&T modifiers."),
  accuracyRequirements: z.string()
    .optional()
    .describe("Any specific accuracy requirements."),
});

export const SuggestToleranceStandardOutputSchema = z.object({
  standardName: z.string().describe("The name of the suggested tolerance standard."),
  description: z.string().describe("A description of the suggested tolerance standard."),
  toleranceValue: z.string().describe("The recommended tolerance value."),
  justification: z.string().describe("The reasoning behind suggesting this standard."),
});

// Circle Fit
export const CircleFitInputSchema = z.object({
  points: z.array(z.object({
    id: z.string().optional(),
    x: z.number(),
    y: z.number(),
  })).min(3, "At least 3 points are required to fit a circle."),
});

export const CircleFitOutputSchema = z.object({
  center: z.object({
    x: z.number(),
    y: z.number(),
  }),
  radius: z.number(),
  rmse: z.number().describe("Root Mean Square Error of the fit."),
  observations: z.array(z.object({
    id: z.string().optional(),
    residual: z.number().describe("The radial distance from the point to the fitted circle edge."),
    isOutlier: z.boolean().describe("True if the residual exceeds the 3-sigma threshold."),
  })),
  analysis: z.string().describe("AI's professional assessment of the data quality."),
});

// Type Inference
export type CalculateDerivativeInput = z.infer<typeof CalculateDerivativeInputSchema>;
export type CalculateDerivativeOutput = z.infer<typeof CalculateDerivativeOutputSchema>;
export type CalculateIntegralInput = z.infer<typeof CalculateIntegralInputSchema>;
export type CalculateIntegralOutput = z.infer<typeof CalculateIntegralOutputSchema>;
export type FactorPolynomialInput = z.infer<typeof FactorPolynomialInputSchema>;
export type FactorPolynomialOutput = z.infer<typeof FactorPolynomialOutputSchema>;
export type LeastSquaresAdjustmentInput = z.infer<typeof LeastSquaresAdjustmentInputSchema>;
export type LeastSquaresAdjustmentOutput = z.infer<typeof LeastSquaresAdjustmentOutputSchema>;
export type KnownPoint = z.infer<typeof KnownPointSchema>;
export type Observation = z.infer<typeof ObservationSchema>;
export type PointAnalysis = z.infer<typeof PointAnalysisSchema>;
export type ResectionAdjustmentInput = z.infer<typeof ResectionAdjustmentInputSchema>;
export type ResectionAdjustmentOutput = z.infer<typeof ResectionAdjustmentOutputSchema>;
export type SuggestToleranceStandardInput = z.infer<typeof SuggestToleranceStandardInputSchema>;
export type SuggestToleranceStandardOutput = z.infer<typeof SuggestToleranceStandardOutputSchema>;
export type CircleFitInput = z.infer<typeof CircleFitInputSchema>;
export type CircleFitOutput = z.infer<typeof CircleFitOutputSchema>;
