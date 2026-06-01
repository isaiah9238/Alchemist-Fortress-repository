"use client"

import { useHeartbeat } from '@/hooks/useHeartbeat';
import { Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ThePulse() {
  const { status, latency, lastCheck } = useHeartbeat();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col h-full bg-card border border-primary/20 rounded-lg p-3 relative shadow-[0_0_20px_rgba(0,229,255,0.05)] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${status === 'flatline' ? 'text-destructive' : 'text-primary'} animate-pulse`} />
          <h2 className="text-xs font-bold tracking-[0.2em] text-primary uppercase">The Pulse</h2>
        </div>
        <div className={`text-[10px] font-code px-2 py-0.5 rounded border ${
          status === 'stable' ? 'border-primary/30 text-primary' : 
          status === 'warning' ? 'border-amber-500/30 text-amber-500' : 'border-destructive/30 text-destructive'
        }`}>
          {status.toUpperCase()}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        <div className="relative w-full h-12 flex items-center justify-center">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 60">
            <path
              d={status === 'flatline' ? "M0 30 L200 30" : "M0 30 L20 30 L30 10 L40 50 L50 30 L80 30 L90 15 L100 45 L110 30 L150 30 L160 5 L170 55 L180 30 L200 30"}
              fill="none"
              stroke={status === 'flatline' ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
              strokeWidth="1.5"
              className={status !== 'flatline' ? "animate-[dash_2s_linear_infinite]" : ""}
              style={{
                strokeDasharray: '200',
                strokeDashoffset: '200'
              }}
            />
          </svg>
          <style jsx>{`
            @keyframes dash {
              from { stroke-dashoffset: 400; }
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full text-[10px] font-code">
          <div className="space-y-1">
            <div className="text-muted-foreground uppercase">Latency</div>
            <div className={`text-sm ${status === 'warning' ? 'text-amber-500' : 'text-foreground'}`}>{latency}ms</div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-muted-foreground uppercase">Last Check</div>
            <div className="text-sm">
              {mounted && lastCheck ? lastCheck.toLocaleTimeString([], { hour12: false }) : '--:--:--'}
            </div>
          </div>
        </div>
      </div>

      {status === 'flatline' && (
        <div className="absolute inset-0 bg-destructive/5 flex items-center justify-center backdrop-blur-[1px]">
          <div className="bg-destructive text-white px-3 py-1 text-[10px] font-bold rounded animate-pulse">
            EMERGENCY: CONVEYOR_REROUTING
          </div>
        </div>
      )}
    </div>
  );
}
