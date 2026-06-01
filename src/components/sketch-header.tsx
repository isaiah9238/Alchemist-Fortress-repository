'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, LineChart, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SketchHeader() {
  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="h-2 w-2" />, href: '/' },
    { label: 'Graphs', icon: <LineChart className="h-2 w-2" />, href: '/calculators/interactive-demo' },
    { label: 'Console', icon: <Activity className="h-2 w-2" />, href: '/calculators/arithma-console' },
    { label: 'Horizontal', href: '/calculators/geometry' },
    { label: 'Vertical', href: '/calculators/geometry/level-notes' },
    { label: 'Geodetic', href: '/calculators/geodetic/combined-factor' },
    { label: 'Converter', href: '/calculators/tools/unit-converter' },
    { label: 'Curve', href: '/calculators/geometry/curve' },
    { label: 'Stakeout', href: '/calculators/stakeout/slope-staking' },
    { label: 'Coordinate', href: '/calculators/transformation' },
    { label: 'Storm Water', href: '/calculators/storm-water' },
    { label: 'Calculus', href: '/calculators/algebra/derivative' },
    { label: 'Learn', href: '/learn/survey-standards' },
  ];

  const RibbonList = () => (
    <div className="flex items-center gap-2 px-4 shrink-0">
      {navItems.map((item, index) => (
        <Link key={item.label + index} href={item.href} passHref>
          <Button 
            variant="outline" 
            size="sm"
            className="h-5 px-2 text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-transparent border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-400/50 transition-all"
          >
            {item.icon && <span className="mr-1">{item.icon}</span>}
            {item.label}
          </Button>
        </Link>
      ))}
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 h-10 bg-[#020617] border-b border-slate-800 z-40 flex items-center shadow-md overflow-hidden select-none min-w-0">
      <div className="flex-1 h-full relative overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#020617] to-transparent pointer-events-none z-30" />
        
        <div className="absolute inset-0 flex items-center animate-sketch-marquee group-hover:[animation-play-state:paused]">
          <RibbonList />
          <RibbonList />
          <RibbonList />
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#020617] to-transparent pointer-events-none z-30" />
      </div>

      <div className="hidden lg:block h-full bg-transparent border-l border-slate-800/50 shrink-0" />
    </nav>
  );
}
