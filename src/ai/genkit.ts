import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { db } from '@/lib/firebase-admin';

// 1. Initialize Genkit (The Brain)
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    })
  ],
  model: 'googleai/gemini-2.5-flash', 
});

// 2. Export Authority (Firestore reference from central config)
export const adminDb = db;
