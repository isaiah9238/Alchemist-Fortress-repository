
import {z} from "genkit";

export const FactorPolynomialInputSchema = z.object({
  expression: z.string().describe("The polynomial expression to factor. For example: x^2 - 3*x - 10"),
});
export type FactorPolynomialInput = z.infer<typeof FactorPolynomialInputSchema>;

export const FactorPolynomialOutputSchema = z.object({
  factored: z.string().describe("The factored form of the polynomial. For example: (x-5)(x+2)"),
  roots: z.array(z.string()).describe("The roots of the polynomial. For example: [\"5\", \"-2\"]"),
  latex: z.string().describe("The LaTeX representation of the factored form."),
});
export type FactorPolynomialOutput = z.infer<typeof FactorPolynomialOutputSchema>;

