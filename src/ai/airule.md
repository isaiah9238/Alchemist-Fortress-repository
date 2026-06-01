# Project Rules & Context

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Library:** React 19
- **Backend:** Firebase (Auth, Firestore, Hosting)
- **AI:** Genkit
- **Language:** TypeScript

## Coding Preferences
- Use **Functional Components** and **Arrow Functions**.
- Use **Tailwind CSS** for all styling.
- Prioritize **Server Components** by default; use `'use client'` only when necessary for interactivity.
- When generating Firebase code, use the **Modular SDK (v10+)** syntax.
- Use **Lucide React** for icons and **Radix UI** for accessible components.

## Project Structure
- Source code is in the `src/` directory.
- Genkit logic is located in `src/ai/`.
- Use the `$PORT` environment variable for local development.

## Deployment & Hosting
- We use `firebase.json` with `"source": "."` for framework-aware hosting.
- Always exclude `node_modules` and `.next` from deployments.
