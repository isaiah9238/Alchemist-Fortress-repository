GEMINI.md: ArithmaGen Intelligence & Architecture Directive
🏛️ Project Identity & Context
Name: ArithmaGen Studio

Stack: Next.js 15 (App Router), React 19, Genkit, Firebase (Blaze Tier).

Core Objective: High-fidelity geodetic and mathematical surveying toolkit.

Guiding Principle: AI should augment, not replace, rigorous trigonometry. Always prioritize existing Math-based logic in src/app/calculators.

🔧 Critical Authentication Rules (The "Sovereign" Protocol)
Primary Key: Use process.env.GOOGLE_GENAI_API_KEY for all Genkit/Gemini interactions.

Legacy Cleanup: Identify and flag any references to GEMINI_API_KEY.

Security: Ensure no hardcoded AIz... strings exist in any src or functions files.

🚀 Architectural Mapping
Central Nervous System: src/app/actions.ts is the primary bridge between the UI and AI logic.

The AI Brain: Transitioning Genkit logic from functions/ to src/ai/.

Modular Priority: src/app/calculators/geometry contains the "Source of Truth" for COGO and curve math.

Arithma-Sketch Bridge: src/app/arithma-sketch/ must import utilities from src/app/calculators/ to avoid logic duplication.

🔍 CLI Audit Tasks
1. Integrity & Auth Check (The "Ghost" Hunt)
Scan all files for process.env references. Flag those not using GOOGLE_GENAI_API_KEY.

Check for conflicting Firebase Admin/Client initialization that might trigger "Invalid Grant" errors.

2. Dependency & Logic Audit
Audit package.json for AI/Firebase legacy weight. Ensure @genkit-ai/google-genai is the standard.

The "Device" Blueprint: Identify all Math.sin, Math.cos, and coordinate transformation functions in src. Consolidate these into a "Core Math Assets" list for the upcoming geometry-engine.ts.

3. Arithma-Sketch "Closure" Analysis
Analyze drawing logic in arithma-sketch/page.tsx. Flag any coordinate plotting that lacks "Loop Closure" or error-adjustment routines.

Suggest integration points for linking the "Log Parcel" button to the adjustTraverseLeastSquares flow via actions.ts.

4. Next.js 15 Optimization
Flag Client Components in src/app/calculators that do not use useState or useEffect and can be converted to Server Components to save Blaze tier resources.