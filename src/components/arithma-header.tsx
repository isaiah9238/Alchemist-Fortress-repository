'use client';

import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ArithmaHeader() {
  const pathname = usePathname();

  if (pathname === '/arithma-sketch') return null;

  // Simple breadcrumb-style text for the current location
  const getPageTitle = () => {
    if (pathname === '/') return 'Mission Control';
    const parts = pathname.split('/').filter(Boolean);
    return parts[parts.length - 1].replace(/-/g, ' ').toUpperCase();
  };

  return (
    <header className="sticky top-0 w-full h-[var(--header-height)] bg-background border-b border-border z-40 flex items-center shadow-sm select-none shrink-0 overflow-hidden">
      <div className="flex items-center h-full border-r border-border px-3 bg-background z-50">
        <SidebarTrigger className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
      </div>

      <div className="flex items-center gap-2 px-4 whitespace-nowrap overflow-hidden">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
          <Home className="h-3.5 w-3.5" />
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary truncate">
          {getPageTitle()}
        </span>
      </div>
    </header>
  );
}
