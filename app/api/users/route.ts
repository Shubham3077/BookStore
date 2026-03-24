import { NextResponse } from "next/server"
import { adminDb, adminAuth } from "@/lib/firebase-admin"

export async function POST(req: Request) {
  try {
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { 
          error: "Server not configured. Add FIREBASE_SERVICE_ACCOUNT_KEY.",
          details: "To fix: Go to Firebase Console → Project Settings → Service Accounts → Generate new private key. Add to .env.local: FIREBASE_SERVICE_ACCOUNT_KEY='{...}' (full JSON as string)"
        },
        { status: 503 }
      )
    }

    const authHeader = req.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    let decodedToken
    try {
      decodedToken = await adminAuth.verifyIdToken(token)
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { uid, email } = decodedToken
    const body = await req.json()
    const displayName = body.displayName ?? decodedToken.name ?? null
    const photoURL = body.photoURL ?? decodedToken.picture ?? null

    const usersRef = adminDb.collection("users")
    const userDoc = usersRef.doc(uid)

    const existing = await userDoc.get()
    if (existing.exists) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 200 }
      )
    }

    await userDoc.set({
      uid,
      email: email ?? null,
      displayName,
      photoURL,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error("[POST /api/users]", err)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
