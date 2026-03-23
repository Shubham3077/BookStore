"use client";

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

// Required Firebase config fields for initialization
const REQUIRED_CONFIG_FIELDS = ['apiKey', 'authDomain', 'projectId', 'appId'] as const

function validateFirebaseConfig() {
  const missing = REQUIRED_CONFIG_FIELDS.filter(
    (field) => !firebaseConfig[field as keyof typeof firebaseConfig]
  )
  
  if (missing.length > 0) {
    console.error(
      `Firebase configuration incomplete. Missing env vars: ${missing
        .map((f) => `NEXT_PUBLIC_FIREBASE_${f.toUpperCase()}`)
        .join(', ')}`
    )
    return false
  }
  return true
}

const isConfigured = validateFirebaseConfig()

let app: FirebaseApp
let auth: Auth
let db: Firestore

if (isConfigured && typeof window !== 'undefined') {
  try {
    app = getApps().length ? (getApps()[0] as FirebaseApp) : initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (error) {
    console.error('Firebase initialization error:', error)
    app = null as unknown as FirebaseApp
    auth = null as unknown as Auth
    db = null as unknown as Firestore
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn('Firebase not initialized - configuration missing or running on server')
  }
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
