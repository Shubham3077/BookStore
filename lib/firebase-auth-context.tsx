"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  type User,
  type ConfirmationResult,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth"
import { auth } from "./firebase"

const isAuthConfigured = typeof auth?.onAuthStateChanged === "function"

type AuthContextType = {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<User>
  signInWithFacebook: () => Promise<User>
  signInWithEmail: (email: string, password: string) => Promise<User>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<User>
  signInWithPhone: (phone: string) => Promise<ConfirmationResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthConfigured) {
      setLoading(false)
      return
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const signInWithGoogle = async () => {
    if (!isAuthConfigured) throw new Error("Firebase not configured")
    const { user } = await signInWithPopup(auth, new GoogleAuthProvider())
    return user
  }

  const signInWithFacebook = async () => {
    if (!isAuthConfigured) throw new Error("Firebase not configured")
    const { user } = await signInWithPopup(auth, new FacebookAuthProvider())
    return user
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (!isAuthConfigured) throw new Error("Firebase not configured")
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    return user
  }

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    if (!isAuthConfigured) throw new Error("Firebase not configured")
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) await updateProfile(user, { displayName })
    return user
  }

  const signInWithPhone = async (phone: string) => {
    if (!isAuthConfigured) throw new Error("Firebase not configured")
    if (typeof window === "undefined") throw new Error("Phone auth requires browser")
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {},
    })
    return signInWithPhoneNumber(auth, phone, verifier)
  }

  const signOut = async () => {
    if (!isAuthConfigured) return
    await firebaseSignOut(auth)
  }

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    signInWithPhone,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <div id="recaptcha-container" />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within FirebaseAuthProvider")
  return ctx
}
