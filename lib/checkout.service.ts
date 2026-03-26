/**
 * Checkout Service
 * Handles payment initiation for both single products and cart items
 */

declare global {
  interface Window {
    Razorpay: any
  }
}

export interface CheckoutItem {
  bookId: string
  title: string
  price: number
  quantity: number
  cover?: string
}

export interface CheckoutConfig {
  type: "single" | "cart"
  items: CheckoutItem[]
  userId: string
  addressId: string
  userFullName: string
  userPhone: string
  totalAmount: number
}

export interface RazorpayOrderResponse {
  orderId: string
  amount: number
  currency: string
}

/**
 * Create Razorpay order via backend API
 */
export async function createRazorpayOrder(
  config: CheckoutConfig
): Promise<RazorpayOrderResponse> {
  const response = await fetch("/api/payments/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: config.totalAmount,
      bookId: config.type === "single" ? config.items[0]?.bookId : undefined,
      userId: config.userId,
      addressId: config.addressId,
      items: config.type === "cart" ? config.items : undefined,
      type: config.type,
    }),
  })

  const orderData = await response.json()

  if (!response.ok) {
    throw new Error(orderData.error || "Failed to create payment order")
  }

  return orderData
}

/**
 * Verify payment via backend API
 */
export async function verifyPayment(
  config: CheckoutConfig,
  razorpayOrderId: string,
  paymentId: string,
  signature: string
): Promise<{ success: boolean; orderId: string }> {
  const response = await fetch("/api/payments/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId: razorpayOrderId,
      paymentId,
      signature,
      bookId: config.type === "single" ? config.items[0]?.bookId : undefined,
      userId: config.userId,
      addressId: config.addressId,
      items: config.type === "cart" ? config.items : undefined,
      type: config.type,
    }),
  })

  const verifyData = await response.json()

  if (!response.ok) {
    throw new Error(verifyData.error || "Payment verification failed")
  }

  return verifyData
}

/**
 * Initiate Razorpay payment flow
 */
export async function initiatePayment(
  config: CheckoutConfig,
  orderData: RazorpayOrderResponse,
  onPaymentSuccess: () => void,
  onPaymentError: (error: string) => void
): Promise<void> {
  // Validate Razorpay script is loaded
  if (!window.Razorpay) {
    throw new Error("Payment gateway not loaded. Please try again.")
  }

  const razorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: orderData.currency,
    order_id: orderData.orderId,
    name: "Mudita Book Store",
    description:
      config.type === "single"
        ? `Purchase of ${config.items[0]?.title}`
        : `Order for ${config.items.length} book(s)`,
    customer_notif: 1,
    handler: async (response: any) => {
      try {
        // Verify payment on backend
        const verifyData = await verifyPayment(
          config,
          orderData.orderId,
          response.razorpay_payment_id,
          response.razorpay_signature
        )

        if (verifyData.success) {
          onPaymentSuccess()
        } else {
          onPaymentError("Payment verification failed")
        }
      } catch (error) {
        console.error("Payment verification error:", error)
        const errorMessage =
          error instanceof Error ? error.message : "Payment verification failed"
        onPaymentError(errorMessage)
      }
    },
    prefill: {
      name: config.userFullName,
      contact: config.userPhone,
    },
    notes: {
      orderType: config.type,
      ...(config.type === "single" && { bookId: config.items[0]?.bookId }),
      ...(config.type === "cart" && { itemCount: config.items.length }),
    },
    theme: {
      color: "#9CA764",
    },
  }

  const razorpay = new window.Razorpay(razorpayOptions)
  razorpay.open()
}

/**
 * Load Razorpay checkout script
 */
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already loaded
    if (window.Razorpay) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true

    script.onload = () => {
      console.log("Razorpay script loaded")
      resolve()
    }

    script.onerror = () => {
      console.error("Failed to load Razorpay script")
      reject(new Error("Failed to load payment gateway"))
    }

    document.body.appendChild(script)
  })
}
