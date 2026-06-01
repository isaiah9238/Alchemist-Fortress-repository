import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Added global flag /g for multi-line keys
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const firestore = admin.firestore();

// Helpful for cleaner data handling
firestore.settings({
  ignoreUndefinedProperties: true,
});

export const db = firestore;
export const auth = admin.auth();
export const storage = admin.storage();
