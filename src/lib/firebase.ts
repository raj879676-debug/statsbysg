import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Check if config is real or placeholder
const isPlaceholder = !firebaseConfig.projectId || firebaseConfig.projectId.includes('remixed-') || firebaseConfig.projectId === 'your-project-id';

let app;
try {
  if (getApps().length) {
    app = getApp();
  } else if (!isPlaceholder) {
    app = initializeApp(firebaseConfig);
  } else {
    app = null;
  }
} catch (error) {
  console.error("Firebase failed to initialize:", error);
  app = null;
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId) : null;
export const googleProvider = new GoogleAuthProvider();
export const isFirebaseConfigured = !isPlaceholder && app !== null;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate Connection to Firestore
async function testConnection() {
  if (db && isFirebaseConfigured) {
    try {
      // Try to get a non-existent doc to test connectivity and rules
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log("Firebase connection successful.");
    } catch (error) {
      console.error("Firebase connection test failed with full error:", error);
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('the client is offline') || msg.includes('failed-precondition')) {
          console.error("Please check your Firebase configuration. The client might be offline or project settings might be incorrect (e.g. invalid API key or restricted domain).");
        } else if (msg.includes('permission-denied')) {
          console.error("Firebase permission denied. This means the connection is working but rules restricted access. Check your Firestore rules.");
        } else {
          console.error(`Firebase error: ${error.message}`);
        }
      }
    }
  } else {
    if (isPlaceholder) {
      console.warn("Firebase is using placeholder configuration. Please run the setup tool.");
    } else if (!app) {
      console.error("Firebase app failed to initialize. Check if all config fields are present.");
    } else if (!db) {
      console.error("Firestore database failed to initialize. Check if firestoreDatabaseId is valid.");
    }
  }
}

testConnection();
