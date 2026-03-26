"use client"

import { X, Phone, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { CartItem } from "@/lib/cart.service"
import type { UserAddress } from "@/lib/types"

interface CartCheckoutSummaryProps {
  open: boolean
  onClose: () => void
  onProceed: () => void
  onChangeAddress: () => void
  items: CartItem[]
  address: UserAddress
  subtotal: number
  tax: number
  total: number
  error?: string | null
}

export default function CartCheckoutSummary({
  open,
  onClose,
  onProceed,
  onChangeAddress,
  items,
  address,
  subtotal,
  tax,
  total,
  error,
}: CartCheckoutSummaryProps) {
  if (!open) return null

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
          {/* Error Alert */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Cart Items */}
          <div className="bg-background rounded-lg border border-border p-4">
            <h3 className="font-serif text-sm font-semibold text-foreground mb-3">
              Order Items ({items.length})
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0"
                >
                  <div className="w-12 h-16 bg-secondary/50 rounded flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      width={48}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Qty: {item.quantity}
                    </p>
                    <p className="font-serif font-bold text-primary text-sm mt-1">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
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
                {address.fullName}
              </p>
              <p className="text-muted-foreground text-sm">
                {address.fullAddress}
              </p>
              <p className="text-muted-foreground text-sm">
                {address.city}, {address.state} - {address.pincode}
              </p>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm pt-1">
                <Phone className="w-3.5 h-3.5" />
                {address.phoneNumber}
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
                <span className="text-muted-foreground">Subtotal</span>
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
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3 border-t border-border/60">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 rounded-lg border-border text-foreground font-medium mt-4"
          >
            Cancel
          </Button>
          <Button
            onClick={onProceed}
            className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover font-semibold mt-4"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  )
}
