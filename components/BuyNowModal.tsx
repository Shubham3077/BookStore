"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Book } from "@/lib/firestore"
import type { UserAddress } from "@/lib/types"
import { getUserAddresses } from "@/lib/firestore-address"
import { useAuth } from "@/lib/firebase-auth-context"
import AddressSelector from "./AddressSelector"
import AddressForm from "./AddressForm"
import OrderSummary from "./OrderSummary"
import PaymentGateway from "./PaymentGateway"

type BuyNowStep = "addresses" | "addAddress" | "summary" | "payment" | "success"

interface BuyNowModalProps {
  book: Book
  isOpen: boolean
  onClose: () => void
}

export default function BuyNowModal({ book, isOpen, onClose }: BuyNowModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<BuyNowStep>("addresses")
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user addresses on mount
  useEffect(() => {
    if (isOpen && user?.uid) {
      loadAddresses()
    }
  }, [isOpen, user?.uid])

  const loadAddresses = async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const userAddresses = await getUserAddresses(user.uid)
      setAddresses(userAddresses)
      
      // If user has addresses, start with address selection
      if (userAddresses.length > 0) {
        setStep("addresses")
      } else {
        // If no addresses, go to add address form
        setStep("addAddress")
      }
    } catch (error) {
      console.error("Error loading addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSelect = (address: UserAddress) => {
    setSelectedAddress(address)
    setStep("summary")
  }

  const handleAddNewAddress = () => {
    setStep("addAddress")
  }

  const handleAddressSaved = (newAddress: UserAddress) => {
    setAddresses([newAddress, ...addresses])
    setSelectedAddress(newAddress)
    setStep("summary")
  }

  const handleProceedToPayment = () => {
    setStep("payment")
  }

  const handlePaymentSuccess = () => {
    setStep("success")
  }

  const handleClose = () => {
    setStep("addresses")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === "addresses" && "Delivery Address"}
            {step === "addAddress" && "Add New Address"}
            {step === "summary" && "Order Summary"}
            {step === "payment" && "Payment"}
            {step === "success" && "Order Confirmed"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {/* Step 1: Address Selection */}
          {step === "addresses" && (
            <AddressSelector
              addresses={addresses}
              loading={loading}
              onSelectAddress={handleAddressSelect}
              onAddNewAddress={handleAddNewAddress}
            />
          )}

          {/* Step 2: Add New Address */}
          {step === "addAddress" && (
            <AddressForm
              userId={user?.uid || ""}
              onAddressSaved={handleAddressSaved}
              onCancel={() => setStep(addresses.length > 0 ? "addresses" : "addresses")}
            />
          )}

          {/* Step 3: Order Summary */}
          {step === "summary" && selectedAddress && (
            <OrderSummary
              book={book}
              address={selectedAddress}
              onEditAddress={() => setStep("addresses")}
              onProceedToPayment={handleProceedToPayment}
            />
          )}

          {/* Step 4: Payment */}
          {step === "payment" && selectedAddress && (
            <PaymentGateway
              book={book}
              address={selectedAddress}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={() => setStep("summary")}
            />
          )}

          {/* Step 5: Success */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center h-16 w-16 bg-green-100 rounded-full">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Order Confirmed!</h3>
              <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
              <Button onClick={handleClose} className="bg-primary text-white hover:bg-primary/90">
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
