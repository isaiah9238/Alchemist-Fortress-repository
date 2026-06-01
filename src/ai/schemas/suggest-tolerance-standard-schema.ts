import { z } from "zod";

// We merged the broad string inputs with your specific enum modifiers
export const SuggestToleranceStandardInputSchema = z.object({
  surveyType: z.enum([
    'ALTA', 
    'Construction', 
    'Boundary', 
    'Industrial-GD&T'
  ]).describe("The type of survey being conducted."),
  
  terrain: z.string().describe("The terrain of the survey area (e.g., flat, mountainous)."),
  
  // Added your new modifiers from the chart
  modifiers: z.array(z.enum(['MMC', 'LMC', 'RFS', 'CZ', 'OZ']))
    .optional()
    .describe("Specific geometric dimensioning and tolerancing modifiers."),
    
  accuracyRequirements: z.string()
    .optional()
    .describe("Any specific accuracy requirements for the survey."),
});

export type SuggestToleranceStandardInput = z.infer<typeof SuggestToleranceStandardInputSchema>;

export const SuggestToleranceStandardOutputSchema = z.object({
  standardName: z.string().describe("The name of the suggested tolerance standard."),
  description: z.string().describe("A description of the suggested tolerance standard."),
  toleranceValue: z.string().describe("The recommended tolerance value according to the standard."),
  justification: z.string().describe("The reasoning behind suggesting this particular standard."),
});

export type SuggestToleranceStandardOutput = z.infer<typeof SuggestToleranceStandardOutputSchema>;