import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, bookId, userId, addressId } = body

    if (!amount || !bookId || !userId || !addressId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(parseFloat(amount.toString().replace("$", "")) * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        bookId,
        userId,
        addressId,
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
    console.error("Razorpay error:", error)
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    )
  }
}
