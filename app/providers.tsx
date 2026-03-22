"use client"

import { useEffect } from "react"
import { FirebaseAuthProvider } from "@/lib/firebase-auth-context"
import { getAnalyticsClient } from "@/lib/firebase"

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getAnalyticsClient()
  }, [])

  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
}
