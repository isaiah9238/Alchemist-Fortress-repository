'use client';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <FirebaseClientProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </FirebaseClientProvider>
    </ThemeProvider>
  );
}
