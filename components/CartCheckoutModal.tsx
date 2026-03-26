"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import type { CartItem } from "@/lib/cart.service"
import type { UserAddress } from "@/lib/types"
import { getUserAddresses } from "@/lib/firestore-address"
import { useAuth } from "@/lib/firebase-auth-context"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import AddressSelector from "./AddressSelector"
import AddressForm from "./AddressForm"
import DeliveryAddressModal from "./modals/DeliveryAddressModal"

import {
  loadRazorpayScript,
  createRazorpayOrder,
  initiatePayment,
  type CheckoutItem,
} from "@/lib/checkout.service"
import CartCheckoutSummary from "./CartCheckoutSummary"
import CartPaymentModal from "./modals/CartPaymentModal"

type CheckoutStep = "addresses" | "addAddress" | "summary" | "payment" | "success" | "error"

interface CartCheckoutModalProps {
  open: boolean
  onClose: () => void
}

export default function CartCheckoutModal({
  open,
  onClose,
}: CartCheckoutModalProps) {
  const { user } = useAuth()
  const { items, subtotal, tax, total, clearCart } = useCart()
  const router = useRouter()

  const [step, setStep] = useState<CheckoutStep>("addresses")
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load user addresses on mount
  useEffect(() => {
    if (open && user?.uid) {
      loadAddresses()
      loadRazorpayScriptAsync()
    }
  }, [open, user?.uid])

  const loadAddresses = async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const userAddresses = await getUserAddresses(user.uid)
      setAddresses(userAddresses)

      if (userAddresses.length > 0) {
        setStep("addresses")
      } else {
        setStep("addAddress")
      }
    } catch (err) {
      console.error("Error loading addresses:", err)
      setError("Failed to load addresses. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const loadRazorpayScriptAsync = async () => {
    try {
      await loadRazorpayScript()
    } catch (err) {
      console.error("Error loading Razorpay:", err)
      // Don't block UI, will show error when trying to pay
    }
  }

  const handleAddressSelect = (address: UserAddress) => {
    setSelectedAddress(address)
    setError(null)
    setStep("summary")
  }

  const handleAddNewAddress = () => {
    setStep("addAddress")
  }

  const handleAddressSaved = (newAddress: UserAddress) => {
    setAddresses([newAddress, ...addresses])
    setSelectedAddress(newAddress)
    setError(null)
    setStep("summary")
  }

  const handleProceedToPayment = () => {
    setError(null)
    setStep("payment")
  }

  const handlePayment = async () => {
    if (!selectedAddress || items.length === 0) {
      setError("Invalid checkout state")
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Prepare checkout config
      const checkoutItems: CheckoutItem[] = items.map((item) => ({
        bookId: item.bookId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        cover: item.cover,
      }))

      const checkoutConfig = {
        type: "cart" as const,
        items: checkoutItems,
        userId: user!.uid,
        addressId: selectedAddress.id,
        userFullName: selectedAddress.fullName,
        userPhone: selectedAddress.phoneNumber,
        totalAmount: total,
      }

      // Create Razorpay order
      const orderData = await createRazorpayOrder(checkoutConfig)

      // Initiate payment
      await initiatePayment(
        checkoutConfig,
        orderData,
        async () => {
          // Payment successful
          try {
            // Clear cart after successful payment
            await clearCart()
            setStep("success")

            // Redirect after delay
            setTimeout(() => {
              onClose()
              router.push("/orders")
            }, 2000)
          } catch (err) {
            console.error("Error clearing cart:", err)
            setStep("success") // Still show success
          }
        },
        (errorMessage) => {
          setError(errorMessage)
          setProcessing(false)
        }
      )
    } catch (err) {
      console.error("Payment error:", err)
      const errorMessage =
        err instanceof Error ? err.message : "Payment failed. Please try again."
      setError(errorMessage)
      setProcessing(false)
    }
  }

  const handleCloseModal = () => {
    if (!processing) {
      setError(null)
      setStep("addresses")
      onClose()
    }
  }

  if (!user) {
    return null
  }

  // Loading state
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      {/* Delivery Address Modal */}
      {step === "addresses" && open && (
        <DeliveryAddressModal
          open={true}
          onClose={handleCloseModal}
          addresses={addresses}
          onSelect={handleAddressSelect}
          onAddNew={handleAddNewAddress}
        />
      )}

      {/* Add Address Dialog */}
      <Dialog open={step === "addAddress" && open} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl bg-card">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <AddressForm
              userId={user.uid}
              onAddressSaved={handleAddressSaved}
              onCancel={handleCloseModal}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Checkout Summary Modal */}
      {step === "summary" && open && selectedAddress && (
        <CartCheckoutSummary
          open={true}
          onClose={handleCloseModal}
          onProceed={handleProceedToPayment}
          onChangeAddress={() => setStep("addresses")}
          items={items}
          address={selectedAddress}
          subtotal={subtotal}
          tax={tax}
          total={total}
          error={error}
        />
      )}

      {/* Payment Modal */}
      {step === "payment" && open && selectedAddress && (
        <CartPaymentModal
          open={true}
          onClose={handleCloseModal}
          onPay={handlePayment}
          items={items}
          address={selectedAddress}
          subtotal={subtotal}
          tax={tax}
          total={total}
          processing={processing}
          error={error}
        />
      )}

      {/* Success Modal */}
      <Dialog open={step === "success" && open} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h2 className="text-2xl font-semibold text-foreground">Payment Successful!</h2>
            <p className="text-center text-muted-foreground">
              Your order has been placed successfully. You will be redirected to your orders page.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error State Modal */}
      {step === "error" && open && (
        <Dialog open={true} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                Checkout Error
              </DialogTitle>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <p className="text-foreground">{error}</p>
              <Button onClick={() => setStep("summary")} className="w-full">
                Try Again
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
