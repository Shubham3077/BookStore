import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, paymentId, signature, bookId, userId, addressId } = body

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify Razorpay signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    const data = orderId + "|" + paymentId
    hmac.update(data)
    const generated_signature = hmac.digest("hex")

    if (generated_signature !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    // Payment verified - save order to Firestore
    const orderRef = doc(db, "orders", `${userId}_${Date.now()}`)
    await setDoc(orderRef, {
      userId,
      bookId,
      addressId,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      status: "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified and order created",
        orderId: orderRef.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    )
  }
}
