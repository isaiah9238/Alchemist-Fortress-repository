"use client"

import { useState, useEffect } from 'react';
import { useConveyor } from '@/hooks/useConveyor';
import { 
  Database, 
  Settings, 
  HelpCircle, 
  ShieldCheck,
  ChevronRight,
  Monitor,
  Activity
} from 'lucide-react';
import { VAULTS } from '@/lib/mock-data';

export function LibrariansDesk() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const { data: commandLog, persist: logCommand, clearConveyor } = useConveyor<string[]>('commands', []);
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const processCommand = (cmd: string) => {
    const cleanCmd = cmd.toLowerCase().trim();
    let response = '';

    switch (cleanCmd) {
      case 'help':
        response = 'AVAILABLE_COMMANDS: HELP, STATUS, CLEAR, WHOAMI, VAULTS, PULSE';
        break;
      case 'status':
        response = 'SYSTEM_STATUS: STABLE // ALL_CONVEYORS_ACTIVE // SECURITY_ISOLATED';
        break;
      case 'whoami':
        response = 'IDENTITY: admin-fortress@vice44-121e4.iam.gserviceaccount.com (VERIFIED)';
        break;
      case 'vaults':
        response = VAULTS.map(v => `${v.name}: ${(v.level * 100).toFixed(0)}%`).join(' | ');
        break;
      case 'pulse':
        response = 'PULSE_REPORT: LATENCY < 50ms // SIGNAL_STRENGTH: OPTIMAL';
        break;
      case 'clear':
        clearConveyor();
        return [];
      default:
        response = `UNKNOWN_COMMAND: '${cmd}'. TYPE 'HELP' FOR ASSISTANCE.`;
    }

    return [...commandLog.slice(-10), `> ${cmd}`, `[SYS] ${response}`];
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newLog = processCommand(input);
    logCommand(newLog);
    setInput('');
  };

  return (
    <div className="h-full bg-card border-t border-primary/20 p-2 flex flex-col md:flex-row items-center gap-4 md:gap-6 relative shadow-[0_-5px_20px_rgba(0,229,255,0.03)]">
      {/* System Status Indicators */}
      <div className="flex items-center gap-4 md:gap-6 px-4 md:border-r border-primary/10 w-full md:w-auto overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 group cursor-help shrink-0" title="Firestore Virtual File System">
          <Database className="w-3 h-3 text-primary group-hover:animate-bounce" />
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[9px] text-muted-foreground leading-none mb-0.5">FIRESTORE_VFS</span>
            <span className="text-[9px] md:text-[10px] font-bold text-primary leading-none">CONNECTED</span>
          </div>
        </div>
        <div className="flex items-center gap-2 group cursor-help shrink-0" title="Security State">
          <ShieldCheck className="w-3 h-3 text-primary group-hover:animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[9px] text-muted-foreground leading-none mb-0.5">SECURITY</span>
            <span className="text-[9px] md:text-[10px] font-bold text-primary leading-none">ISOLATED</span>
          </div>
        </div>
        <div className="flex items-center gap-2 group cursor-help shrink-0" title="AICA Assessment Core">
          <Activity className="w-3 h-3 text-accent animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[9px] text-muted-foreground leading-none mb-0.5">AICA_CORE</span>
            <span className="text-[9px] md:text-[10px] font-bold text-accent leading-none">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Command Interface */}
      <div className="flex-1 flex flex-col gap-1 w-full overflow-hidden">
        <div className="hidden md:flex gap-2 h-4 overflow-hidden items-end">
          {mounted && commandLog.slice(-1).map((log, i) => (
            <span key={i} className="text-[9px] font-code text-primary/40 truncate italic">{log}</span>
          ))}
        </div>
        <div className="flex items-center gap-3 bg-background/50 rounded px-3 py-1 border border-primary/5">
          <ChevronRight className="w-4 h-4 text-primary" />
          <form onSubmit={handleCommand} className="flex-1">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ENTER_COMMAND (TYPE 'HELP')..."
              className="w-full bg-transparent border-none outline-none text-[10px] md:text-[11px] font-code text-primary placeholder:text-primary/20"
            />
          </form>
        </div>
      </div>

      {/* Right side utilities */}
      <div className="flex items-center gap-4 md:gap-6 px-4 shrink-0">
        <div className="flex flex-col items-end">
          <span className="text-[8px] md:text-[9px] text-muted-foreground font-code leading-none mb-1">LOCAL</span>
          <span className="text-[10px] md:text-xs font-bold text-primary font-code leading-none">
            {mounted && currentTime ? currentTime.toLocaleTimeString([], { hour12: false }) : '--:--:--'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 border-l border-primary/10 pl-4 md:pl-6">
          <button className="p-1 hover:text-primary transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-1 hover:text-primary transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>
          <div className="ml-2 w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center bg-primary/5 group cursor-pointer overflow-hidden">
            <Monitor className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
