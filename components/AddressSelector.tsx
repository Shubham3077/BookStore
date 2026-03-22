"use client"

import { Button } from "@/components/ui/button"
import type { UserAddress } from "@/lib/types"
import { Check, Plus } from "lucide-react"

interface AddressSelectorProps {
  addresses: UserAddress[]
  loading: boolean
  onSelectAddress: (address: UserAddress) => void
  onAddNewAddress: () => void
}

export default function AddressSelector({
  addresses,
  loading,
  onSelectAddress,
  onAddNewAddress,
}: AddressSelectorProps) {
  if (loading) {
    return <div className="text-center py-12">Loading addresses...</div>
  }

  return (
    <div className="space-y-4">
      {/* Address Cards */}
      <div className="grid gap-3">
        {addresses.map((address) => (
          <button
            key={address.id}
            onClick={() => onSelectAddress(address)}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{address.fullName}</h4>
                <p className="text-sm text-gray-600">{address.fullAddress}</p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-sm text-gray-600 mt-1">📞 {address.phoneNumber}</p>
              </div>
              <div className="ml-4">
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  {address.isDefault && <Check className="h-4 w-4 text-primary" />}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Add New Address Button */}
      <Button
        onClick={onAddNewAddress}
        variant="outline"
        className="w-full border-2 border-gray-300 hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Address
      </Button>
    </div>
  )
}
