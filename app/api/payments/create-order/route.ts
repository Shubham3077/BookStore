import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

// Check if env vars are set
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("⚠️ Razorpay environment variables not configured!")
  console.error("Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local")
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, bookId, userId, addressId, items, type = "single" } = body

    // Validate required fields based on order type
    if (!amount || !userId || !addressId) {
      return NextResponse.json(
        { error: "Missing required fields: amount, userId, addressId" },
        { status: 400 }
      )
    }

    // For single product, bookId is required
    if (type === "single" && !bookId) {
      return NextResponse.json(
        { error: "bookId is required for single product orders" },
        { status: 400 }
      )
    }

    // For cart, items array is required
    if (type === "cart" && (!Array.isArray(items) || items.length === 0)) {
      return NextResponse.json(
        { error: "items array is required for cart orders" },
        { status: 400 }
      )
    }

    // Convert amount to paise (Razorpay accepts amount in paise)
    const amountInPaise = Math.round(
      typeof amount === "string"
        ? parseFloat(amount.replace(/[^\d.-]/g, "")) * 100
        : amount * 100
    )

    // Validate amount
    if (amountInPaise <= 0 || !isFinite(amountInPaise)) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      )
    }

    // Generate receipt - must be max 40 characters for Razorpay
    const timestamp = Date.now().toString().slice(-8) // Last 8 digits
    const userPrefix = userId.slice(-6) // Last 6 chars of userId
    const receipt = `rcpt_${userPrefix}_${timestamp}` // Total: ~20 chars

    // Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: receipt,
      notes: {
        userId,
        addressId,
        orderType: type,
        ...(type === "single" && { bookId }),
        ...(type === "cart" && { itemCount: items.length }),
      },
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json(
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Razorpay error:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return NextResponse.json(
      { error: "Failed to create payment order. Please check server logs." },
      { status: 500 }
    )
  }
}
