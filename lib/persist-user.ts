import { type User } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./firebase"

async function persistToFirestore(user: User): Promise<void> {
  try {
    if (!db) return
    const userRef = doc(db, "users", user.uid)
    const snap = await getDoc(userRef)
    if (snap.exists()) return

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      createdAt: new Date().toISOString(),
    })
  } catch {
    // Silently fail - user is still logged in
  }
}

export async function persistUser(user: User): Promise<void> {
  try {
    const token = await user.getIdToken()
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
      }),
    })

    if (res.status === 503) {
      await persistToFirestore(user)
    }
  } catch {
    await persistToFirestore(user)
  }
}
