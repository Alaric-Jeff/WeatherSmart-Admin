import admin from 'firebase-admin';

let initialized = false;

export function initializeFirebase() {
  if (initialized) return;
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
  
  initialized = true;
  console.log('[Firebase] Admin SDK initialized');
}

export function getAuth() {
  return admin.auth();
}

export function getFirestore() {
  return admin.firestore();
}
