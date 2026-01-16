import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // Check if environment variables are set before initializing
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    // In development without credentials, you might want to mock or just log warning
    console.warn('Firebase Admin not initialized: Missing environment variables');
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
