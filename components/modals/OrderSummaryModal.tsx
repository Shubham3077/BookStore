"use client"

import { X, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { Book } from "@/lib/firestore"
import type { UserAddress } from "@/lib/types"

interface OrderSummaryModalProps {
  open: boolean
  onClose: () => void
  onProceed: () => void
  onChangeAddress: () => void
  book: Book
  address: UserAddress
}

const OrderSummaryModal = ({
  open,
  onClose,
  onProceed,
  onChangeAddress,
  book,
  address,
}: OrderSummaryModalProps) => {
  if (!open) return null

  const price = parseFloat(book.price.replace("$", ""))
  const tax = (price * 0.05).toFixed(2)
  const total = (price + parseFloat(tax)).toFixed(2)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg bg-card rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-border/60 animate-in zoom-in-95 fade-in-0 duration-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Order Summary
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 pb-6 space-y-4">
          {/* Book Details */}
          <div className="bg-background rounded-lg border border-border p-4">
            <h3 className="font-serif text-sm font-semibold text-foreground mb-3">
              Book Details
            </h3>
            <div className="flex gap-4">
              <div className="w-20 h-28 bg-secondary/50 rounded-md flex items-center justify-center shrink-0 overflow-hidden relative">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground text-sm">
                  {book.title}
                </p>
                <p className="text-muted-foreground text-xs">
                  by {book.author}
                </p>
                <p className="font-serif font-bold text-foreground text-lg mt-2">
                  {book.price}
                </p>
              </div>
            </div>
          </div>
          {/* Delivery Address */}
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-sm font-semibold text-foreground">
                Delivery Address
              </h3>
              <button
                onClick={onChangeAddress}
                className="text-xs text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Change
              </button>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground text-sm">
                {address.fullName || ""}
              </p>
              <p className="text-muted-foreground text-sm">
                {address.fullAddress || ""}
              </p>
              <p className="text-muted-foreground text-sm">
                {address.city}, {address.state} - {address.pincode}
              </p>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm pt-1">
                <Phone className="w-3.5 h-3.5" />
                {address.phoneNumber || ""}
              </div>
            </div>
          </div>
          {/* Price Summary */}
          <div className="bg-background rounded-lg border border-border p-4">
            <h3 className="font-serif text-sm font-semibold text-foreground mb-3">
              Price Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="text-foreground">{book.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">${tax}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">
                  Total Amount
                </span>
                <span className="font-serif font-bold text-foreground text-lg">
                  ${total}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 rounded-lg border-border text-foreground font-medium"
          >
            Save for Later
          </Button>
          <Button
            onClick={onProceed}
            className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover font-semibold"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderSummaryModal
