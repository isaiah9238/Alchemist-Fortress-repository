// src/ai/flows/genkit.ts
import { defineFlow } from '@genkit-ai/flow';
import { generate } from '@genkit-ai/ai';
import { gemini15Flash } from '@genkit-ai/googleai';
import { z } from 'zod';

export const anomalyDetectionFlow = defineFlow(
  {
    name: 'anomalyDetectionFlow',
    inputSchema: z.string(),
    outputSchema: z.object({
      integrity: z.number(),
      analysis: z.string(),
    }),
  },
  async (logData) => {
    const response = await generate({
      model: gemini15Flash,
      prompt: `Analyze these Alchemist Fortress logs for anomalies: ${logData}`,
    });

    return {
      integrity: 100, // You can make this dynamic later
      analysis: response.text(),
    };
  }
);