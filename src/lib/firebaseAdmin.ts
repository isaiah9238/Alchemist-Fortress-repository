import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminDb: Firestore;

if (!getApps().length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) 
    : undefined;

  if (serviceAccount) {
    // Path A: Use the explicit key from your .env
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Path B: Fallback to the ADC (what you have now)
    initializeApp();
  }
}

adminDb = getFirestore();
export { adminDb };