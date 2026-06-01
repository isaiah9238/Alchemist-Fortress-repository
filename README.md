# THE_ALCHEMIST_FORTRESS

Welcome to **The Alchemist Fortress**, a secure, high-integrity console dashboard designed for monitoring isolated environments and data conveyors.

## 🏰 System Overview

The Alchemist Fortress is a specialized monitoring interface built with Next.js, Tailwind CSS, and Genkit AI. It provides real-time oversight of system logs, connection stability, and cryptographic vault integrity.

### Core Modules
- **Scrying Pool**: A real-time log terminal with integrated AI anomaly detection (Genkit).
- **The Pulse**: A high-frequency heartbeat monitor for tracking system latency and connection health.
- **Vault Map**: A neural visualization of interconnected data vaults and their integrity status.
- **Librarian's Desk**: A centralized command interface for system interaction and status reporting.

## 📂 Project Structure

```text
.
├── src/
│   ├── ai/                      # Genkit AI Implementation
│   │   ├── flows/               # AI logic (e.g., Anomaly Detection)
│   │   ├── dev.ts               # Genkit dev entry point
│   │   └── genkit.ts            # Genkit client configuration
│   ├── app/                     # Next.js App Router
│   │   ├── actions/             # Server Actions (AI & Data)
│   │   ├── globals.css          # Cyberpunk/Terminal theme styles
│   │   ├── layout.tsx           # Root layout with HUD elements
│   │   └── page.tsx             # Main dashboard assembly
│   ├── components/
│   │   ├── dashboard/           # Main fortress components
│   │   │   ├── LibrariansDesk.tsx
│   │   │   ├── ScryingPool.tsx
│   │   │   ├── ThePulse.tsx
│   │   │   └── VaultMap.tsx
│   │   └── ui/                  # ShadCN primitive components
│   ├── hooks/                   # Custom system hooks
│   │   ├── useConveyor.ts       # Local storage persistence
│   │   ├── useHeartbeat.ts      # Connection health logic
│   │   └── use-mobile.tsx       # Viewport detection
│   └── lib/                     # System utilities
│       ├── firebase-admin.ts    # Secure server-side Firebase configuration
│       ├── mock-data.ts         # Initial system state
│       └── utils.ts             # Tailwind merging utilities
├── public/                      # Static assets
├── tailwind.config.ts           # System color & animation definitions
└── next.config.ts               # Next.js configuration
```

## 🛠️ Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **AI Engine**: Google Genkit (Gemini 2.5 Flash)
- **Backend**: Firebase Admin SDK (VFS & Auth)
- **Icons**: Lucide React
- **Fonts**: JetBrains Mono & Inter

## 🚀 Initialization

To bring the fortress online, run the development server:

```bash
npm run dev
```

The console will be accessible at `http://localhost:9002`.
