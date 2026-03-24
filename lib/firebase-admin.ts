import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

function init() {
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  
  if (!sa) {
    if (typeof window === "undefined") {
      console.warn(
        "[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_KEY is not configured. " +
        "Server-side operations will not work. " +
        "To fix:\n" +
        "1. Go to Firebase Console → Project Settings → Service Accounts\n" +
        "2. Generate a new private key (JSON file)\n" +
        "3. Add to .env.local: FIREBASE_SERVICE_ACCOUNT_KEY='{...json...}'\n" +
        "4. For production (Vercel/etc), add the same to Environment Variables"
      )
    }
    return { adminAuth: null, adminDb: null }
  }
  
  try {
    const cred = JSON.parse(sa) as ServiceAccount
    if (!getApps().length) {
      initializeApp({ credential: cert(cred) })
    }
    return { adminAuth: getAuth(), adminDb: getFirestore() }
  } catch (e) {
    console.error(
      "[Firebase Admin] Failed to initialize. FIREBASE_SERVICE_ACCOUNT_KEY may be malformed JSON:",
      e instanceof Error ? e.message : e
    )
    return { adminAuth: null, adminDb: null }
  }
}

const { adminAuth, adminDb } = init()

export { adminAuth, adminDb }
