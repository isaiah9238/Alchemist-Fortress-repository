"use client"

import { ScryingPool } from '@/components/dashboard/ScryingPool';
import { ThePulse } from '@/components/dashboard/ThePulse';
import { VaultMap } from '@/components/dashboard/VaultMap';
import { LibrariansDesk } from '@/components/dashboard/LibrariansDesk';

export default function DashboardPage() {
  return (
    <main className="min-h-screen w-screen bg-background flex flex-col p-2 md:p-4 gap-4 select-none overflow-x-hidden overflow-y-auto terminal-scroll">
      {/* Top Section */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-4 h-auto md:min-h-[300px]">
        <div className="w-full md:col-span-8 h-[350px] md:h-[400px]">
          <ScryingPool />
        </div>
        <div className="w-full md:col-span-4 h-[250px] md:h-[400px]">
          <ThePulse />
        </div>
      </div>

      {/* Middle Section (Vault Map) */}
      <div className="flex-1 min-h-[500px]">
        <VaultMap />
      </div>

      {/* Bottom Section (Librarian's Desk) */}
      <div className="h-auto md:h-16 shrink-0 mt-4 sticky bottom-0 z-50">
        <LibrariansDesk />
      </div>

      {/* Decorative Branding / HUD elements - Fixed positions */}
      <div className="hidden lg:block fixed top-1/2 right-0 translate-y-[-50%] p-1 text-[10px] font-code text-primary/20 [writing-mode:vertical-rl] tracking-[0.5em] pointer-events-none uppercase z-0">
        THE_ALCHEMIST_FORTRESS_V1.0 // SYSTEM_STABLE
      </div>
      
      <div className="hidden lg:block fixed top-1/2 left-0 translate-y-[-50%] p-1 text-[10px] font-code text-primary/20 [writing-mode:vertical-rl] tracking-[0.5em] pointer-events-none rotate-180 uppercase z-0">
        NIX_ENVIRONMENT_ISOLATED // VERIFIED_HANDSHAKE
      </div>
    </main>
  );
}
