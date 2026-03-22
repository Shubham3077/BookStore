# 🛒 Buy Now Feature - Complete Setup Guide

## Overview

The Buy Now feature implements a complete e-commerce checkout flow with multi-step address selection, order summary review, and Razorpay payment integration.

## ✨ Features Implemented

### 1. **Enhanced UI (Pixel-Perfect)**

- ✅ Fixed carousel arrow positioning and centering
- ✅ Improved product card spacing and layout
- ✅ Better badge styling with consistent positioning
- ✅ Enhanced "Add to Cart" and "Buy Now" button styling
- ✅ Improved typography hierarchy
- ✅ Better navbar spacing and icon alignment
- ✅ Smooth hover effects and animations

### 2. **Address Management System**

- ✅ Fetch user's saved addresses (max 2 most recent)
- ✅ Add new address form with validation
- ✅ Select address for delivery
- ✅ Firestore integration for persistence

### 3. **Multi-Step Buy Now Flow**

```
Step 1: Address Selection
├─ Show saved addresses (max 2)
├─ Option to add new address
└─ User selects address or adds new one

Step 2: Add New Address (if needed)
├─ Form with all required fields
├─ Save to Firestore
└─ Continue to next step

Step 3: Order Summary
├─ Display book details
├─ Show selected address
├─ Display price breakdown
└─ Proceed to payment

Step 4: Payment (Razorpay)
├─ Create order on backend
├─ Initialize Razorpay checkout
├─ Handle payment callback
└─ Verify signature

Step 5: Success
└─ Show confirmation
```

### 4. **Razorpay Payment Integration**

- ✅ Backend order creation API
- ✅ Payment signature verification
- ✅ Secure payment processing
- ✅ Order saved to Firestore on success

---

## 🔧 Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
# Already installed:
# - razorpay (for server-side)
# - @radix-ui/react-dialog (for modal)
```

### Step 2: Configure Razorpay

1. **Create Razorpay Account**
   - Go to https://razorpay.com
   - Sign up and complete KYC

2. **Get API Keys**
   - Login to Dashboard: https://dashboard.razorpay.com
   - Go to Settings → API Keys
   - Copy Key ID and Key Secret

3. **Add to `.env.local`**
   ```env
   # .env.local
   RAZORPAY_KEY_ID=your_key_id_here
   RAZORPAY_KEY_SECRET=your_key_secret_here
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id_here
   ```

### Step 3: Test the Feature

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Navigate to Home Page**
   - You should see the improved product cards
   - Click "Buy Now" button on any book

3. **Test Flow**
   - **New User**: Should go directly to "Add Address" form
   - **Returning User**: Should see saved addresses
   - **Address Form**: Fill and save address
   - **Order Summary**: Review before payment
   - **Payment**: Use Razorpay test keys for testing

4. **Razorpay Test Cards**
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g., 12/25)
   - CVV: Any 3 digits (e.g., 123)

---

## 📁 File Structure

```
components/
├── BuyNowModal.tsx          # Main modal orchestrator
├── AddressSelector.tsx      # Display saved addresses
├── AddressForm.tsx          # Add new address form
├── OrderSummary.tsx         # Order review page
├── PaymentGateway.tsx       # Razorpay payment UI
├── NewCollection.tsx        # Updated with Buy Now
├── Navbar.tsx               # Fixed spacing issues
└── ui/
    └── dialog.tsx           # Radix dialog component

lib/
├── types.ts                 # TypeScript types
├── firestore-address.ts     # Address CRUD functions
└── firestore.ts             # Existing Firestore functions

app/api/payments/
├── create-order/route.ts    # Razorpay order creation
└── verify/route.ts          # Payment verification

.env.local                   # Environment variables
```

---

## 🔐 Database Schema (Firestore)

### Collection: `users/{userId}/addresses`

```typescript
{
  id: string                  // Auto-generated
  userId: string             // User ID
  fullName: string           // Customer's name
  phoneNumber: string        // Contact number
  pincode: string            // Postal code
  city: string               // City name
  state: string              // State name
  fullAddress: string        // Complete address
  isDefault?: boolean        // Default address flag
  createdAt: string          // ISO timestamp
  updatedAt: string          // ISO timestamp
}
```

### Collection: `orders`

```typescript
{
  id: string; // {userId}_{timestamp}
  userId: string; // User who placed order
  bookId: string; // Book purchased
  addressId: string; // Delivery address reference
  status: string; // "completed" | "pending" | "failed"
  amount: number; // Total amount in INR
  razorpayOrderId: string; // Razorpay order ID
  razorpayPaymentId: string; // Razorpay payment ID
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

---

## 🔗 API Routes

### POST `/api/payments/create-order`

**Create Razorpay Order**

Request:

```json
{
  "amount": "$19.99",
  "bookId": "book_id",
  "userId": "user_id",
  "addressId": "address_id"
}
```

Response:

```json
{
  "orderId": "order_xxx",
  "amount": 1999,
  "currency": "INR"
}
```

### POST `/api/payments/verify`

**Verify Payment & Create Order**

Request:

```json
{
  "orderId": "order_xxx",
  "paymentId": "pay_yyy",
  "signature": "signature_zzz",
  "bookId": "book_id",
  "userId": "user_id",
  "addressId": "address_id"
}
```

Response:

```json
{
  "success": true,
  "message": "Payment verified and order created",
  "orderId": "document_id"
}
```

---

## 🎯 Usage Example

### In Components:

```tsx
import BuyNowModal from "@/components/BuyNowModal";
import { useState } from "react";

export default function BookCard({ book }: { book: Book }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Buy Now</button>
      <BuyNowModal
        book={book}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

---

## 🧪 Testing Checklist

- [ ] UI improvements visible on product cards
- [ ] Carousel arrows properly centered
- [ ] Navbar spacing improved
- [ ] "Buy Now" button opens modal
- [ ] New user sees address form
- [ ] Existing user sees saved addresses
- [ ] Can add new address
- [ ] Address form validates correctly
- [ ] Order summary displays correctly
- [ ] Payment gateway initializes
- [ ] Test payment processes successfully
- [ ] Order recorded in Firestore
- [ ] Success screen displays

---

## ⚠️ Important Notes

1. **Environment Variables**: Never commit `.env.local` with real keys
2. **Test Mode**: Use Razorpay test keys for development
3. **HTTPS**: Razorpay checkout requires HTTPS in production
4. **User Authentication**: Ensure user is logged in before "Buy Now"
5. **Address Validation**: Implement postal code validation for your region
6. **Tax Calculation**: Adjust tax rate in OrderSummary.tsx for your region

---

## 🚀 Next Steps

1. Replace test Razorpay keys with production keys
2. Add email notifications on order confirmation
3. Implement order tracking page
4. Add wishlist/favorites feature
5. Implement inventory management
6. Add customer reviews/ratings

---

## 💡 Troubleshooting

### Issue: "Razorpay script failed to load"

- Check internet connection
- Verify CDN isn't blocked
- Check browser console for errors

### Issue: "Payment verification failed"

- Ensure Razorpay keys are correct in .env.local
- Check signature verification logic
- Verify API route is accessible

### Issue: "Cannot find module"

- Run `npm install` again
- Clear `.next` cache: `rm -rf .next`
- Restart dev server

### Issue: "Address not saving"

- Check Firestore rules allow writes to `users/{userId}/addresses`
- Verify user is authenticated
- Check browser console for Firebase errors

---

## 📚 Resources

- [Razorpay Docs](https://razorpay.com/docs/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Radix UI Dialog](https://www.radix-ui.com/docs/primitives/components/dialog)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## ✅ Implementation Complete!

All features have been implemented and are ready for testing. The Buy Now flow is fully integrated with Razorpay payment gateway and Firestore for persistent address storage.
