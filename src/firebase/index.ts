'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';

// This function initializes Firebase and returns the SDKs
function _initializeFirebase() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const functions = getFunctions(app, 'us-central1');

  // NOTE: The emulator connections have been removed.
  // This application will now connect to the live Firebase services.

  return {
    firebaseApp: app,
    auth: auth,
    firestore: firestore,
    functions: functions,
  };
}


// A memoized singleton for Firebase services to ensure it's initialized only once
let firebaseServices: {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  functions: Functions;
} | null = null;


export function initializeFirebase() {
    if (typeof window !== 'undefined') { // Ensure this only runs on the client
        if (!firebaseServices) {
        firebaseServices = _initializeFirebase();
        }
        return firebaseServices;
    }
    // On the server, we return a placeholder object. 
    // The provider will prevent this from being used.
    return { firebaseApp: null, auth: null, firestore: null, functions: null };
}


// Re-exporting all necessary components for easy access
export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';
