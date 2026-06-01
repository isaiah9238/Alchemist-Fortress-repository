
import {z} from "genkit";

export const CalculateDerivativeInputSchema = z.object({
  expression: z.string(),
  variable: z.string(),
});

export const CalculateDerivativeOutputSchema = z.object({
  derivative: z.string(),
  simplified: z.string(),
  latex: z.string(),
});

export type CalculateDerivativeInput = z.infer<typeof CalculateDerivativeInputSchema>;
export type CalculateDerivativeOutput = z.infer<typeof CalculateDerivativeOutputSchema>;

