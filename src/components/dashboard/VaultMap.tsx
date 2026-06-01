
"use client"

import { useState } from 'react';
import { VAULTS } from '@/lib/mock-data';
import { Shield, Lock, Map } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

export function VaultMap() {
  const [activeVault, setActiveVault] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-card/30 border border-primary/20 rounded-lg p-3 md:p-6 relative shadow-[inset_0_0_50px_rgba(0,229,255,0.02)] overflow-hidden">
      <div className="flex items-center gap-2 mb-4 md:mb-8 shrink-0">
        <Map className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        <h2 className="text-xs md:text-sm font-bold tracking-[0.3em] text-primary uppercase">Neural Map & Interconnected Vaults</h2>
      </div>

      <ScrollArea className="flex-1 h-full pr-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8 relative pb-4">
          {/* Background Grid Lines - Purely decorative */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-4 grid-rows-4 opacity-[0.03]">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-primary" />
            ))}
          </div>

          {VAULTS.map((vault) => (
            <div 
              key={vault.id}
              onMouseEnter={() => setActiveVault(vault.id)}
              onMouseLeave={() => setActiveVault(null)}
              className={`group relative p-4 border transition-all duration-500 cursor-pointer overflow-hidden ${
                activeVault === vault.id 
                  ? 'border-primary/60 bg-primary/5 translate-y-[-2px] shadow-[0_10px_20px_rgba(0,229,255,0.05)]' 
                  : 'border-primary/10 bg-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className={`text-xs font-bold tracking-widest uppercase transition-colors ${
                    activeVault === vault.id ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {vault.name}
                  </h3>
                  <div className="text-[10px] font-code opacity-50 uppercase">{vault.status}</div>
                </div>
                {vault.status === 'locked' ? (
                  <Lock className="w-4 h-4 text-destructive" />
                ) : (
                  <Shield className={`w-4 h-4 ${activeVault === vault.id ? 'text-primary animate-pulse' : 'text-primary/40'}`} />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] font-code text-muted-foreground">
                  <span>INTEGRITY_INDEX</span>
                  <span>{(vault.level * 100).toFixed(0)}%</span>
                </div>
                <Progress 
                  value={vault.level * 100} 
                  className="h-1 bg-primary/10" 
                />
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40 group-hover:border-primary" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/40 group-hover:border-primary" />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Central Hub visualization in background - Desktop only */}
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary/5 rounded-full animate-spin-slow pointer-events-none" />
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/2 rounded-full animate-reverse-spin-slow pointer-events-none" />

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes reverse-spin-slow {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-reverse-spin-slow { animation: reverse-spin-slow 30s linear infinite; }
      `}</style>
    </div>
  );
}
