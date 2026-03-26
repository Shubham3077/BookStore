"use client"

import { X, MapPin, Check, ShieldCheck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CartItem } from "@/lib/cart.service"
import type { UserAddress } from "@/lib/types"

interface CartPaymentModalProps {
  open: boolean
  onClose: () => void
  onPay: () => void
  items: CartItem[]
  address: UserAddress
  subtotal: number
  tax: number
  total: number
  processing?: boolean
  error?: string | null
}

export default function CartPaymentModal({
  open,
  onClose,
  onPay,
  items,
  address,
  subtotal,
  tax,
  total,
  processing = false,
  error,
}: CartPaymentModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={() => !processing && onClose()}
      />
      <div className="relative z-10 w-full max-w-lg bg-card rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-border/60 animate-in zoom-in-95 fade-in-0 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Payment
          </h2>
          <button
            onClick={onClose}
            disabled={processing}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="bg-background rounded-lg border border-border p-4">
            <h3 className="font-serif text-sm font-semibold text-foreground mb-3">
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
                </span>
                <span className="text-foreground">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (18%)</span>
                <span className="text-foreground">₹{tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">
                  Total Amount
                </span>
                <span className="font-serif font-bold text-foreground text-lg">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivering To */}
          <div className="bg-accent/10 rounded-lg border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground text-sm">
                Delivering to:
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              {address.fullName}
            </p>
            <p className="text-muted-foreground text-sm">
              {address.fullAddress}
            </p>
            <p className="text-muted-foreground text-sm">
              {address.city}, {address.state} - {address.pincode}
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
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 space-y-3 border-t border-border/60">
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={processing}
              className="flex-1 h-11 rounded-lg border-border text-foreground font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={onPay}
              disabled={processing}
              className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover font-semibold"
            >
              {processing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
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
