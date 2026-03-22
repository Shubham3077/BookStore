"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { Book } from "@/lib/firestore"
import type { UserAddress } from "@/lib/types"

interface OrderSummaryProps {
  book: Book
  address: UserAddress
  onEditAddress: () => void
  onProceedToPayment: () => void
}

export default function OrderSummary({
  book,
  address,
  onEditAddress,
  onProceedToPayment,
}: OrderSummaryProps) {
  const price = parseFloat(book.price.replace("$", ""))

  return (
    <div className="space-y-6">
      {/* Book Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Book Details</h3>
        <div className="flex gap-4">
          <div className="relative w-20 h-28 shrink-0">
            <Image
              src={book.cover}
              alt={book.title}
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{book.title}</h4>
            <p className="text-sm text-gray-600">by {book.author}</p>
            <p className="text-lg font-bold text-primary mt-2">{book.price}</p>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Delivery Address</h3>
          <button
            onClick={onEditAddress}
            className="text-primary text-sm font-medium hover:underline"
          >
            Change
          </button>
        </div>
        <div className="space-y-1 text-sm">
          <p className="font-medium text-foreground">{address.fullName}</p>
          <p className="text-gray-600">{address.fullAddress}</p>
          <p className="text-gray-600">
            {address.city}, {address.state} - {address.pincode}
          </p>
          <p className="text-gray-600">📞 {address.phoneNumber}</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Price Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Price</span>
            <span className="text-gray-900">${price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">${(price * 0.05).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
            <span className="text-foreground">Total Amount</span>
            <span className="text-primary">${(price * 1.05).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1">
          Save for Later
        </Button>
        <Button
          onClick={onProceedToPayment}
          className="flex-1 bg-primary text-white hover:bg-primary/90"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  )
}
