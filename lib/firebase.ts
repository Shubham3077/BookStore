import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const isConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== ""

let app: FirebaseApp
let auth: Auth
let db: Firestore

if (isConfigured) {
  app = getApps().length ? (getApps()[0] as FirebaseApp) : initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
} else {
  app = null as unknown as FirebaseApp
  auth = null as unknown as Auth
  db = null as unknown as Firestore
}

export async function getAnalyticsClient(): Promise<Analytics | null> {
  if (!isConfigured) return null
  const supported = await isSupported()
  return supported ? getAnalytics(app) : null
}

export { auth, db, app }
export default app
