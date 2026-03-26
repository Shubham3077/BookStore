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
  const [paymentAttempted, setPaymentAttempted] = useState(false)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => {
      console.log("✅ Razorpay script loaded successfully")
    }
    script.onerror = () => {
      console.error("❌ Failed to load Razorpay script")
      setError("Payment gateway failed to load. Please refresh the page and try again.")
    }
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
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
          type: "single",
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
          // Payment gateway returned a valid response
          try {
            console.log("✅ Payment successful, verifying with server...")
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
              console.error("❌ Verification failed:", verifyData.error)
              throw new Error(verifyData.error || "Payment verification failed. Please contact support.")
            }

            console.log("✅ Payment verified successfully")
            // Show success
            onPaymentSuccess()
            setLoading(false)
          } catch (error) {
            console.error("❌ Payment verification error:", error)
            const errorMsg = error instanceof Error ? error.message : "Payment verification failed. Please contact support."
            setError(errorMsg)
            setLoading(false)
            setPaymentAttempted(false)
          }
        },
        modal: {
          ondismiss: () => {
            // Handle when user closes the Razorpay modal
            console.log("🔴 Payment modal closed/dismissed")
            if (paymentAttempted) {
              setError("Payment was not completed. Please try again.")
            }
            setLoading(false)
            setPaymentAttempted(false)
          },
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
        try {
          const razorpay = new window.Razorpay(options)
          setPaymentAttempted(true) // Mark that payment attempt is in progress
          razorpay.open()
        } catch (err) {
          console.error("❌ Failed to open Razorpay modal:", err)
          setError("Failed to open payment gateway. Please try again.")
          setLoading(false)
          setPaymentAttempted(false)
        }
      } else {
        console.error("❌ Razorpay SDK not loaded")
        setError("Payment gateway is not available. Please refresh and try again.")
        setLoading(false)
        setPaymentAttempted(false)
      }
    } catch (err) {
      console.error("❌ Payment initialization error:", err)
      
      // Provide detailed error messages based on error type
      let userErrorMessage = "Payment initialization failed. Please try again."
      
      if (err instanceof TypeError) {
        userErrorMessage = "Network error. Please check your internet connection and try again."
      } else if (err instanceof Error) {
        userErrorMessage = err.message
      } else if (typeof err === "object" && err !== null && "message" in err) {
        userErrorMessage = (err as any).message
      }
      
      setError(userErrorMessage)
      setLoading(false)
      setPaymentAttempted(false)
    } finally {
      // Ensure loading is reset even if try-catch misses something
      // (though the explicit setLoading calls above should handle it)
    }
  }

  // Price is now numeric from database
  const price = typeof book.price === "number" ? book.price : 0
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
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-sm font-medium text-red-900 mb-3">{error}</p>
          <div className="flex gap-2">
            <Button
              onClick={() => setError("")}
              variant="outline"
              size="sm"
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              Dismiss
            </Button>
            <Button
              onClick={handlePayment}
              disabled={loading}
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Retry Payment
            </Button>
          </div>
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
