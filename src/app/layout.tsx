import type { Metadata } from 'next';
import '../app/globals.css'; // Updated path tracking to clear VS Code error 2882
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'; // Added Shadcn structural trigger
import { SidebarNav } from '../components/sidebar-nav';

export const metadata: Metadata = {
  title: 'THE_ALCHEMIST_FORTRESS',
  description: 'Secure Console Dashboard - Data Conveyor and Watchtower',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden">
        {/* SidebarProvider natively handles responsiveness and collapsing states */}
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-screen bg-black text-white">
            
            {/* Collapsible Left Panel Navigation Container */}
            <aside className="border-r border-zinc-800/60 bg-black p-2 flex flex-col justify-between group-data-[collapsible=icon]:w-12 transition-all duration-200">
              <SidebarNav />
            </aside>

            {/* Right Main Panel Interface Display */}
            <main className="flex-1 relative overflow-y-auto bg-black p-4">
              {/* Floating Trigger control lets you toggle the navigation menu away to maximize screen space */}
              <div className="absolute top-2 left-2 z-50">
                <SidebarTrigger className="h-6 w-6 border border-zinc-800 bg-zinc-950 text-cyan-400 hover:text-cyan-300" />
              </div>
              
              <div className="pt-8">
                {children}
              </div>
            </main>

          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}