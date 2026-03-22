"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { Book } from "@/lib/firestore"
import type { UserAddress } from "@/lib/types"

interface PaymentGatewayProps {
  book: Book
  address: UserAddress
  onPaymentSuccess: () => void
  onCancel: () => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentGateway({
  book,
  address,
  onPaymentSuccess,
  onCancel,
}: PaymentGatewayProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => {
      console.log("Razorpay script loaded")
    }
    script.onerror = () => {
      setError("Failed to load payment gateway")
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    setLoading(true)
    setError("")

    try {
      // Create order on backend
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: book.price,
          bookId: book.id,
          userId: address.userId,
          addressId: address.id,
        }),
      })

      const orderData = await response.json()

      if (!response.ok) {
        throw new Error(orderData.error || "Failed to create payment order")
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "Mudita Book Store",
        description: `Purchase of ${book.title}`,
        customer_notif: 1,
        handler: async (response: any) => {
          // Verify payment on backend
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: orderData.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                bookId: book.id,
                userId: address.userId,
                addressId: address.id,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || "Payment verification failed")
            }

            // Show success
            onPaymentSuccess()
          } catch (error) {
            console.error("Payment verification error:", error)
            setError("Payment verification failed. Please contact support.")
          }
        },
        prefill: {
          name: address.fullName,
          email: `user@example.com`, // Should fetch from user profile
          contact: address.phoneNumber,
        },
        notes: {
          bookId: book.id,
          bookTitle: book.title,
        },
        theme: {
          color: "#9CA764",
        },
      }

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options)
        razorpay.open()
      } else {
        setError("Payment gateway not loaded. Please try again.")
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const price = parseFloat(book.price.replace("$", ""))
  const total = price * 1.05

  return (
    <div className="space-y-6">
      {/* Order Summary for Payment */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">{book.title}</span>
          <span className="font-semibold">${price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (5%)</span>
          <span className="font-semibold">${(price * 0.05).toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-300 pt-3 flex justify-between font-bold text-lg">
          <span>Total Amount</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm font-semibold text-foreground mb-2">📍 Delivering to:</p>
        <p className="text-sm text-gray-700">{address.fullName}</p>
        <p className="text-sm text-gray-700">{address.fullAddress}</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Payment Methods Info */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          ✓ Secure payment with Razorpay<br />
          ✓ 1-Click Checkout<br />
          ✓ Support for Credit/Debit Card, UPI, Wallets & Bank Transfer
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 bg-primary text-white hover:bg-primary/90"
        >
          {loading ? "Processing..." : `Pay ₹${Math.round(total)}`}
        </Button>
      </div>

      {/* Secure Badge */}
      <p className="text-center text-xs text-gray-500">
        🔒 Your payment information is secure and encrypted
      </p>
    </div>
  )
}
