
import {z} from "genkit";

export const CalculateIntegralInputSchema = z.object({
  expression: z.string().describe("The mathematical expression to integrate. For example: x^2 + 3*x + 5"),
  variable: z.string().default("x").describe("The variable to integrate with respect to. For example: x"),
  lowerBound: z.string().optional().describe("The lower bound for a definite integral. Leave empty for indefinite integral."),
  upperBound: z.string().optional().describe("The upper bound for a definite integral. Leave empty for indefinite integral."),
});
export type CalculateIntegralInput = z.infer<typeof CalculateIntegralInputSchema>;

export const CalculateIntegralOutputSchema = z.object({
  integral: z.string().describe("The calculated integral of the expression. For indefinite integrals, include the constant C."),
  simplified: z.string().describe("The simplified form of the integral."),
  latex: z.string().describe("The LaTeX representation of the simplified integral."),
  value: z.number().optional().describe("The numerical value if it is a definite integral."),
});
export type CalculateIntegralOutput = z.infer<typeof CalculateIntegralOutputSchema>;

