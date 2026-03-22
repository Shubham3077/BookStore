import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

function init() {
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!sa) return { adminAuth: null, adminDb: null }
  try {
    const cred = JSON.parse(sa) as ServiceAccount
    if (!getApps().length) {
      initializeApp({ credential: cert(cred) })
    }
    return { adminAuth: getAuth(), adminDb: getFirestore() }
  } catch (e) {
    console.warn("Firebase Admin init failed:", e)
    return { adminAuth: null, adminDb: null }
  }
}

const { adminAuth, adminDb } = init()

export { adminAuth, adminDb }
