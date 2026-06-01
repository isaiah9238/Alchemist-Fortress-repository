"use client"

import { useState, useEffect, useRef } from 'react';
import { LogEntry, INITIAL_LOGS } from '@/lib/mock-data';
import { Terminal, Cpu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { aiLogAnomalyDetection } from '@/ai/flows/ai-log-anomaly-detection-flow';
import { cn } from '@/lib/utils';

export function ScryingPool() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLogs(INITIAL_LOGS);
    setMounted(true);
    
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString(),
        source: ['VFS', 'AUTH', 'CORE', 'NET'][Math.floor(Math.random() * 4)],
        message: `Heartbeat received from node ${Math.floor(Math.random() * 1000)} - Integrity checked.`,
        type: Math.random() > 0.9 ? 'warning' : 'info'
      };
      setLogs(prev => [...prev.slice(-49), newLog]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleRunAI = async () => {
    setIsAnalyzing(true);
    try {
      const logString = logs.map(l => `[${l.timestamp}] ${l.source}: ${l.message}`).join('\n');
      const result = await aiLogAnomalyDetection({ logs: logString });
      
      if (result.anomaliesDetected) {
        result.anomalies.forEach(anomaly => {
          const alertLog: LogEntry = {
            id: Math.random().toString(),
            timestamp: new Date().toISOString(),
            source: 'AI_SENTRY',
            message: `ANOMALY DETECTED: ${anomaly.description} (${anomaly.severity.toUpperCase()})`,
            type: anomaly.severity === 'critical' || anomaly.severity === 'high' ? 'critical' : 'warning'
          };
          setLogs(prev => [...prev, alertLog]);
        });
      } else {
        setLogs(prev => [...prev, {
          id: Math.random().toString(),
          timestamp: new Date().toISOString(),
          source: 'AI_SENTRY',
          message: 'Scan complete. No anomalies detected in current buffer.',
          type: 'info'
        }]);
      }
    } catch (err) {
      console.error('AI analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-card border border-primary/20 rounded-lg overflow-hidden relative">
        <div className="flex items-center justify-between p-3 border-b border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Scrying Pool</h2>
          </div>
        </div>
        <div className="flex-1 p-2 font-code text-[11px] text-muted-foreground animate-pulse">
          INITIALIZING_TERMINAL_INTERFACE...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card border border-primary/20 rounded-lg overflow-hidden relative shadow-[0_0_20px_rgba(0,229,255,0.05)]">
      <div className="flex items-center justify-between p-3 border-b border-primary/20 bg-primary/5 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary animate-pulse-cyan" />
          <h2 className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Scrying Pool</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRunAI} 
          disabled={isAnalyzing}
          className="h-7 text-[10px] gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-all font-code"
        >
          {isAnalyzing ? (
            <Cpu className="w-3 h-3 animate-spin" />
          ) : (
            <Search className="w-3 h-3" />
          )}
          RUN_AI_SCAN
        </Button>
      </div>
      
      <div className="flex-1 relative overflow-hidden scanline bg-black/20">
        <div 
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto terminal-scroll p-3 font-code text-[11px] leading-relaxed"
        >
          {logs.map((log) => (
            <div key={log.id} className="mb-1.5 group">
              <span className="text-muted-foreground mr-2 shrink-0">
                [{log.timestamp.includes('T') ? log.timestamp.split('T')[1].split('.')[0] : log.timestamp}]
              </span>
              <span className={cn(
                "font-bold mr-2",
                log.type === 'critical' ? 'text-destructive' : 
                log.type === 'warning' ? 'text-amber-500' : 'text-primary'
              )}>
                {log.source}:
              </span>
              <span className={cn(
                "group-hover:text-foreground/100 text-foreground/80 transition-colors",
                log.type === 'critical' && "text-destructive font-bold animate-pulse"
              )}>
                {log.message}
              </span>
            </div>
          ))}
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-primary mt-2 animate-pulse font-code">
              <span className="animate-bounce">_</span> ANALYZING_NEURAL_PATTERNS...
            </div>
          )}
          <div className="h-4" /> {/* Spacer for bottom scroll padding */}
        </div>
      </div>
    </div>
  );
}
