"use client"

import { X, MapPin, Check, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Book } from "@/lib/firestore"
import type { UserAddress } from "@/lib/types"

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  onPay: () => void
  book: Book
  address: UserAddress
}

const PaymentModal = ({
  open,
  onClose,
  onPay,
  book,
  address,
}: PaymentModalProps) => {
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
      <div className="relative z-10 w-full max-w-lg bg-card rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-border/60 animate-in zoom-in-95 fade-in-0 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Payment
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 pb-6 space-y-4">
          {/* Price Breakdown */}
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{book.title}</span>
                <span className="text-foreground">{book.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (5%)</span>
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
          {/* Delivering To */}
          <div className="bg-accent/10 rounded-lg border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-destructive" />
              <span className="font-semibold text-foreground text-sm">
                Delivering to:
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {address.fullName || ""}
            </p>
            <p className="text-muted-foreground text-sm">
              {address.fullAddress || ""}
            </p>
          </div>
          {/* Trust Badges */}
          <div className="bg-primary/5 rounded-lg border border-primary/20 p-4 space-y-2">
            {[
              "Secure payment with Razorpay",
              "1-Click Checkout",
              "Support for Credit/Debit Card, UPI, Wallets & Bank Transfer",
            ].map((text) => (
              <div
                key={text}
                className="flex items-start gap-2 text-sm text-primary-hover"
              >
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="px-6 pb-5 space-y-3">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 rounded-lg border-border text-foreground font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={onPay}
              className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover font-semibold"
            >
              Pay ${total}
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
