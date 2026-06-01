'use server';

// 1. ADD THIS AT THE VERY TOP
import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

/**
 * Entry point for Genkit Registry.
 */
import './genkit'; 
import './geometry-engine';

export * from './genkit';
export * from './geometry-engine';