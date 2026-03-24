"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserAddress } from "@/lib/types"
import { addUserAddress } from "@/lib/firestore-address"

interface AddressFormProps {
  userId: string
  onAddressSaved: (address: UserAddress) => void
  onCancel: () => void
}

export default function AddressForm({ userId, onAddressSaved, onCancel }: AddressFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    pincode: "",
    city: "",
    state: "",
    fullAddress: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newAddress = await addUserAddress(userId, {
        userId,
        ...formData,
        isDefault: false,
      })

      if (newAddress) {
        onAddressSaved(newAddress)
      }
    } catch (error) {
      console.error("Error saving address:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      {/* Full Name */}
      <div>
        <Label htmlFor="fullName" className="text-sm font-medium">
          Full Name *
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          required
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          className="mt-2 h-11 border-border bg-background"
        />
      </div>

      {/* Phone Number */}
      <div>
        <Label htmlFor="phoneNumber" className="text-sm font-medium">
          Phone Number *
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          required
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+91 98765 43210"
          className="mt-2 h-11 border-border bg-background"
        />
      </div>

      {/* Pincode */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pincode" className="text-sm font-medium">
            Pincode *
          </Label>
          <Input
            id="pincode"
            name="pincode"
            type="text"
            required
            value={formData.pincode}
            onChange={handleChange}
            placeholder="110001"
            className="mt-2 h-11 border-border bg-background"
          />
        </div>

        {/* City */}
        <div>
          <Label htmlFor="city" className="text-sm font-medium">
            City *
          </Label>
          <Input
            id="city"
            name="city"
            type="text"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="New Delhi"
            className="mt-2 h-11 border-border bg-background"
          />
        </div>
      </div>

      {/* State */}
      <div>
        <Label htmlFor="state" className="text-sm font-medium">
          State *
        </Label>
        <Input
          id="state"
          name="state"
          type="text"
          required
          value={formData.state}
          onChange={handleChange}
          placeholder="Delhi"
          className="mt-2 h-11 border-border bg-background"
        />
      </div>

      {/* Full Address */}
      <div>
        <Label htmlFor="fullAddress" className="text-sm font-medium">
          Full Address *
        </Label>
        <textarea
          id="fullAddress"
          name="fullAddress"
          required
          value={formData.fullAddress}
          onChange={handleChange}
          placeholder="Apartment/House No., Road name..."
          rows={3}
          className="w-full px-3 py-2 mt-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-background text-foreground"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 h-11 rounded-lg border-border text-foreground font-medium"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover font-semibold"
        >
          {loading ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  )
}
