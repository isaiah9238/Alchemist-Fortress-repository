'use server';
/**
 * @fileOverview This flow analyzes "Scrying Pool" logs using AI to detect and highlight unusual patterns or potential security anomalies.
 *
 * - aiLogAnomalyDetection - A function that handles the AI-powered log anomaly detection process.
 * - AiLogAnomalyDetectionInput - The input type for the aiLogAnomalyDetection function.
 * - AiLogAnomalyDetectionOutput - The return type for the aiLogAnomalyDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiLogAnomalyDetectionInputSchema = z.object({
  logs: z
    .string()
    .describe('A string containing a collection of real-time system logs from the Scrying Pool.'),
});
export type AiLogAnomalyDetectionInput = z.infer<typeof AiLogAnomalyDetectionInputSchema>;

const AiLogAnomalyDetectionOutputSchema = z.object({
  anomaliesDetected: z.boolean().describe('True if any anomalies were detected, false otherwise.'),
  anomalies: z
    .array(
      z.object({
        type: z
          .string()
          .describe(
            'The category of the anomaly (e.g., "security", "performance", "network", "unknown").'
          ),
        description: z
          .string()
          .describe('A detailed description of the detected anomaly and its potential implications.'),
        severity: z
          .enum(['low', 'medium', 'high', 'critical'])
          .describe('The severity level of the anomaly.'),
        affectedLogEntries: z
          .string()
          .describe(
            'The specific log entries or a summary of entries that are indicative of this anomaly.'
          ),
      })
    )
    .describe('An array of detected anomalies, if any.'),
});
export type AiLogAnomalyDetectionOutput = z.infer<typeof AiLogAnomalyDetectionOutputSchema>;

export async function aiLogAnomalyDetection(
  input: AiLogAnomalyDetectionInput
): Promise<AiLogAnomalyDetectionOutput> {
  return aiLogAnomalyDetectionFlow(input);
}

const aiLogAnomalyDetectionPrompt = ai.definePrompt({
  name: 'aiLogAnomalyDetectionPrompt',
  input: {schema: AiLogAnomalyDetectionInputSchema},
  output: {schema: AiLogAnomalyDetectionOutputSchema},
  prompt: `You are an expert security analyst tasked with monitoring a highly secure system. Your objective is to analyze the provided system logs from the 'Scrying Pool' and identify any unusual patterns, deviations, or potential security anomalies.

Carefully review the following log entries. If you detect any anomalies, describe them in detail, categorize their type and severity, and provide the specific log entries that are relevant to each anomaly.

If no anomalies are detected, set 'anomaliesDetected' to false and provide an empty array for 'anomalies'.

Logs:
{{{logs}}}`,
});

const aiLogAnomalyDetectionFlow = ai.defineFlow(
  {
    name: 'aiLogAnomalyDetectionFlow',
    inputSchema: AiLogAnomalyDetectionInputSchema,
    outputSchema: AiLogAnomalyDetectionOutputSchema,
  },
  async input => {
    const {output} = await aiLogAnomalyDetectionPrompt(input);
    return output!;
  }
);
