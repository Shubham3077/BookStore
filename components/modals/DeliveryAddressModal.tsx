"use client"

import { useState } from "react"
import { X, Phone, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { UserAddress } from "@/lib/types"

interface DeliveryAddressModalProps {
  open: boolean
  onClose: () => void
  onSelect: (address: UserAddress) => void
  addresses?: UserAddress[]
  onAddNew?: () => void
}

const DeliveryAddressModal = ({
  open,
  onClose,
  onSelect,
  addresses = [],
  onAddNew,
}: DeliveryAddressModalProps) => {
  const [selected, setSelected] = useState<string>(addresses[0]?.id || "")

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-card rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-border/60 animate-in zoom-in-95 fade-in-0 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Delivery Address
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Address List */}
        <div className="px-6 pb-4 space-y-3 max-h-[50vh] overflow-y-auto">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              type="button"
              onClick={() => setSelected(addr.id)}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all duration-200",
                selected === addr.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-background hover:border-primary/40"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">
                    {addr.fullName}
                  </p>
                  <p className="text-muted-foreground text-sm">{addr.fullAddress}</p>
                  <p className="text-muted-foreground text-sm">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm pt-1">
                    <Phone className="w-3.5 h-3.5" />
                    {addr.phoneNumber}
                  </div>
                </div>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-colors",
                    selected === addr.id
                      ? "border-primary"
                      : "border-muted-foreground/40"
                  )}
                >
                  {selected === addr.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </button>
          ))}
          {/* Add New Address */}
          {onAddNew && (
            <button
              type="button"
              onClick={onAddNew}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-primary/40 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          )}
        </div>
        {/* Footer */}
        <div className="px-6 pb-6 pt-2 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 rounded-lg border-border text-foreground font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const addr = addresses.find((a) => a.id === selected)
              if (addr) onSelect(addr)
            }}
            className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover font-semibold"
          >
            Deliver Here
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeliveryAddressModal
