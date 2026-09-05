import 'dotenv/config';
import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

let firebaseAuth: Auth | undefined;

function getFirebaseApp(): App {
  const existingApp = getApps()[0];
  if (existingApp) {
    return existingApp;
  }

  const projectId = process.env['FIREBASE_PROJECT_ID'];
  const clientEmail = process.env['FIREBASE_CLIENT_EMAIL'];
  const privateKey = process.env['FIREBASE_PRIVATE_KEY'];

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
    );
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getApps().length > 0 ? getApp() : getFirebaseApp());
  }

  return firebaseAuth;
}
