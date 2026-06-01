'use server';

import { ai } from './genkit';
import { z } from 'genkit';

/**
 * Geometric utility to calculate a circular snap based on a centroid.
 * This provides a fast, local calculation before a rigorous AI Best Fit.
 */
export const snapToCircle = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return { centerX: 0, centerY: 0, radius: 0, perfectPoints: [] };
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  const distances = points.map(p => Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2));
  const radius = distances.reduce((sum, d) => sum + d, 0) / distances.length;

  const perfectPoints = Array.from({ length: 36 }, (_, i) => {
    const angle = (i / 36) * 2 * Math.PI;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
  return { centerX, centerY, radius, perfectPoints };
};

// Register the local snap logic as a Genkit flow for UI consistency.
export const circleSnapFlow = ai.defineFlow(
  {
    name: 'circleSnapFlow',
    inputSchema: z.array(z.object({ x: z.number(), y: z.number() })),
    outputSchema: z.any(), 
  },
  async (points) => snapToCircle(points)
);
