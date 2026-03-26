"use client"

import { useEffect } from "react"
import { FirebaseAuthProvider } from "@/lib/firebase-auth-context"
import { CartProvider } from "@/lib/cart-context"
import { getAnalyticsClient } from "@/lib/firebase"

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getAnalyticsClient()
  }, [])

  return (
    <FirebaseAuthProvider>
      <CartProvider>{children}</CartProvider>
    </FirebaseAuthProvider>
  )
}
