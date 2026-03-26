import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/firebase"
import { doc, setDoc, collection } from "firebase/firestore"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, paymentId, signature, bookId, userId, addressId, items, type = "single" } = body

    // Validate all required fields BEFORE any processing
    if (!orderId || !paymentId || !signature) {
      console.warn("⚠️ Missing payment fields:", { orderId: !!orderId, paymentId: !!paymentId, signature: !!signature })
      return NextResponse.json(
        { error: "Missing required fields: orderId, paymentId, signature" },
        { status: 400 }
      )
    }

    if (!userId || !addressId) {
      console.warn("⚠️ Missing user fields:", { userId: !!userId, addressId: !!addressId })
      return NextResponse.json(
        { error: "Missing required fields: userId, addressId" },
        { status: 400 }
      )
    }

    // CRITICAL: Verify Razorpay signature BEFORE creating any order
    // This is the only point of trust for payment confirmation
    console.log("🔐 Verifying Razorpay payment signature...")
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    const data = orderId + "|" + paymentId
    hmac.update(data)
    const generated_signature = hmac.digest("hex")

    if (generated_signature !== signature) {
      console.error("❌ Payment signature verification FAILED")
      console.error("Expected:", generated_signature)
      console.error("Received:", signature)
      return NextResponse.json(
        { error: "Payment verification failed: Invalid signature" },
        { status: 401 }
      )
    }

    console.log("✅ Payment signature verified successfully")

    // ONLY after signature verification, validate order data
    if (type === "single" && !bookId) {
      console.warn("⚠️ Single order missing bookId")
      return NextResponse.json(
        { error: "bookId required for single orders" },
        { status: 400 }
      )
    }

    if (type === "cart" && (!Array.isArray(items) || items.length === 0)) {
      console.warn("⚠️ Cart order missing items array")
      return NextResponse.json(
        { error: "items array required for cart orders" },
        { status: 400 }
      )
    }

    // Prepare order data
    console.log(`📝 Creating ${type} order for user: ${userId}`)
    const timestamp = Date.now()
    const orderDocId = `${userId}_${timestamp}`
    
    // Calculate totals and prepare items
    let totalAmount = 0
    let itemsToStore = []

    if (type === "single") {
      itemsToStore = [{ bookId }]
      console.log("Single product order - bookId:", bookId)
    } else if (type === "cart") {
      itemsToStore = items.map((item: any) => ({
        bookId: item.bookId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }))

      totalAmount = items.reduce((sum: number, item: any) => {
        const price = typeof item.price === "number" ? item.price : 0
        const quantity = item.quantity || 1
        return sum + price * quantity
      }, 0)
      
      console.log("Cart order - items count:", items.length, "total:", totalAmount)
    }

    // FINAL CHECK: Ensure all order data is valid before saving
    if (!orderDocId || !userId) {
      console.error("❌ Invalid order data before save")
      return NextResponse.json(
        { error: "Internal error: Invalid order data" },
        { status: 500 }
      )
    }

    // Save order to Firestore ONLY AFTER signature verification
    console.log("💾 Saving order to Firestore:", orderDocId)
    const orderRef = doc(db, "orders", orderDocId)
    const orderData = {
      userId,
      addressId,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      status: "completed",
      orderType: type,
      items: itemsToStore,
      totalAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await setDoc(orderRef, orderData)
    console.log("✅ Order successfully created in Firestore:", orderDocId)

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified and order created",
        orderId: orderDocId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Payment verification error:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    // DO NOT create order if any error occurs
    return NextResponse.json(
      { error: "Payment verification failed. Please contact support." },
      { status: 500 }
    )
  }
}
