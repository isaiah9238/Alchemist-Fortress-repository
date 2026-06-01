
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // useMemo ensures that Firebase is initialized only once per render on the client.
  const services = useMemo(() => {
    // This check is crucial. It ensures that Firebase SDK calls are only made in the browser.
    if (typeof window !== 'undefined') {
      return initializeFirebase();
    }
    return { firebaseApp: null, auth: null, firestore: null, functions: null };
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={services.firebaseApp}
      auth={services.auth}
      firestore={services.firestore}
      functions={services.functions}
    >
      {children}
    </FirebaseProvider>
  );
}
