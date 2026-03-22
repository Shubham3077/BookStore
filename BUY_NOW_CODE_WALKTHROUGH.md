# 🛒 Buy Now Flow - Complete Code Walkthrough

## Overview

The Buy Now feature uses a state-machine pattern to manage multi-step checkout flow. Here's how it all fits together:

---

## 1. Entry Point: Product Card

**File:** `components/NewCollection.tsx`

```tsx
const NewCollection = ({ books }: Props) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);

  const handleBuyNow = (book: Book) => {
    setSelectedBook(book);
    setIsBuyNowOpen(true); // Open modal
  };

  return (
    <>
      {/* Product Cards */}
      <Button onClick={() => handleBuyNow(book)}>Buy Now</Button>

      {/* Modal Portal */}
      {selectedBook && (
        <BuyNowModal
          book={selectedBook}
          isOpen={isBuyNowOpen}
          onClose={() => setIsBuyNowOpen(false)}
        />
      )}
    </>
  );
};
```

---

## 2. Modal Orchestrator

**File:** `components/BuyNowModal.tsx`

```tsx
type BuyNowStep =
  | "addresses"
  | "addAddress"
  | "summary"
  | "payment"
  | "success";

export default function BuyNowModal({
  book,
  isOpen,
  onClose,
}: BuyNowModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<BuyNowStep>("addresses");
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(
    null,
  );

  // Flow: Load addresses → Show addresses/form → Summary → Payment → Success

  useEffect(() => {
    if (isOpen && user?.uid) {
      // Load user's addresses (max 2)
      const addresses = await getUserAddresses(user.uid);
      setAddresses(addresses);

      // Decide first step
      if (addresses.length > 0) {
        setStep("addresses"); // Show selector
      } else {
        setStep("addAddress"); // Show form
      }
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        {/* Step 1: Address Selection */}
        {step === "addresses" && (
          <AddressSelector
            addresses={addresses}
            onSelectAddress={(addr) => {
              setSelectedAddress(addr);
              setStep("summary");
            }}
            onAddNewAddress={() => setStep("addAddress")}
          />
        )}

        {/* Step 2: Add New Address */}
        {step === "addAddress" && (
          <AddressForm
            userId={user?.uid || ""}
            onAddressSaved={(newAddr) => {
              setAddresses([newAddr, ...addresses]);
              setSelectedAddress(newAddr);
              setStep("summary");
            }}
          />
        )}

        {/* Step 3: Order Summary */}
        {step === "summary" && selectedAddress && (
          <OrderSummary
            book={book}
            address={selectedAddress}
            onProceedToPayment={() => setStep("payment")}
          />
        )}

        {/* Step 4: Payment */}
        {step === "payment" && selectedAddress && (
          <PaymentGateway
            book={book}
            address={selectedAddress}
            onPaymentSuccess={() => setStep("success")}
          />
        )}

        {/* Step 5: Success */}
        {step === "success" && <SuccessScreen onClose={handleClose} />}
      </DialogContent>
    </Dialog>
  );
}
```

---

## 3. Backend: Create Razorpay Order

**File:** `app/api/payments/create-order/route.ts`

```tsx
import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: NextRequest) {
  const { amount, bookId, userId, addressId } = await request.json();

  // Convert $19.99 to 1999 paise
  const paise = Math.round(parseFloat(amount.replace("$", "")) * 100);

  // Create order in Razorpay
  const order = await razorpay.orders.create({
    amount: paise,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: { bookId, userId, addressId },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
}
```

**Flow:**

1. Frontend sends: `{ amount: "$19.99", bookId, userId, addressId }`
2. Backend converts to paise: `1999`
3. Razorpay creates order: `order_xxx`
4. Returns order ID to frontend

---

## 4. Frontend: Initialize Razorpay Checkout

**File:** `components/PaymentGateway.tsx`

```tsx
const handlePayment = async () => {
  // Step 1: Create order on backend
  const response = await fetch("/api/payments/create-order", {
    method: "POST",
    body: JSON.stringify({
      amount: book.price, // "$19.99"
      bookId: book.id,
      userId: address.userId,
      addressId: address.id,
    }),
  });
  const orderData = await response.json(); // { orderId, amount, currency }

  // Step 2: Store original order ID for verification
  const orderId = orderData.orderId;

  // Step 3: Open Razorpay checkout
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: orderData.currency,
    order_id: orderId,
    name: "Mudita Book Store",
    description: `Purchase of ${book.title}`,

    // Payment Success Callback
    handler: async (response: any) => {
      // response includes:
      // - razorpay_payment_id
      // - razorpay_order_id
      // - razorpay_signature

      // Verify on backend
      const verifyResponse = await fetch("/api/payments/verify", {
        method: "POST",
        body: JSON.stringify({
          orderId: orderData.orderId,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          bookId,
          userId,
          addressId,
        }),
      });

      if (verifyResponse.ok) {
        onPaymentSuccess(); // Show success screen
      }
    },
    prefill: {
      name: address.fullName,
      contact: address.phoneNumber,
    },
    theme: { color: "#9CA764" },
  };

  new window.Razorpay(options).open();
};
```

**Flow:**

1. User clicks "Pay Now"
2. Frontend calls backend to create order
3. Backend returns `orderId` from Razorpay
4. Frontend opens Razorpay checkout UI
5. User completes payment on Razorpay popup
6. Razorpay returns payment details to frontend callback

---

## 5. Backend: Verify Payment & Save Order

**File:** `app/api/payments/verify/route.ts`

```tsx
import crypto from "crypto";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  const { orderId, paymentId, signature, bookId, userId, addressId } =
    await request.json();

  // Verify signature using HMAC-SHA256
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
  hmac.update(orderId + "|" + paymentId);
  const generated_signature = hmac.digest("hex");

  // If signature doesn't match, payment is fake/tampered
  if (generated_signature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Signature verified ✓ Payment is authentic!

  // Save order to Firestore
  const orderRef = doc(db, "orders", `${userId}_${Date.now()}`);
  await setDoc(orderRef, {
    userId,
    bookId,
    addressId,
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    status: "completed",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    message: "Payment verified and order created",
    orderId: orderRef.id,
  });
}
```

**Security Flow:**

1. Frontend sends: `orderId|paymentId` (unsigned)
2. Backend receives signature from Razorpay
3. Backend regenerates signature using secret key
4. Backend compares signatures
5. If match → Payment is verified & authentic
6. Save to database immediately

---

## 6. Data Storage: Firestore

### Address Storage

```typescript
// Collection: users/{userId}/addresses
{
  id: "address_123",
  userId: "user_456",
  fullName: "John Doe",
  phoneNumber: "+91 98765 43210",
  pincode: "110001",
  city: "New Delhi",
  state: "Delhi",
  fullAddress: "123 Main Street, Apt 4B",
  isDefault: true,
  createdAt: "2024-03-22T10:30:00Z",
  updatedAt: "2024-03-22T10:30:00Z",
}
```

### Order Storage

```typescript
// Collection: orders
{
  id: "user_456_1711098600000",
  userId: "user_456",
  bookId: "book_789",
  addressId: "address_123",
  razorpayOrderId: "order_P1zX4qN7vXlZ3Y",
  razorpayPaymentId: "pay_P1zX4qO8wYmA4Z",
  status: "completed",
  createdAt: "2024-03-22T10:30:00Z",
  updatedAt: "2024-03-22T10:30:00Z",
}
```

---

## 7. Error Handling

```tsx
// In PaymentGateway.tsx
try {
  const response = await fetch("/api/payments/create-order", {
    method: "POST",
    body: JSON.stringify({
      /* data */
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create payment order");
  }

  // Continue with checkout...
} catch (error) {
  setError(error.message);
  // Show error message to user
}
```

---

## 8. Complete User Journey (Example)

### Scenario: New User Buying a Book

1. **User Views Product** → Sees "Buy Now" button
2. **Clicks "Buy Now"** → Modal opens
3. **Step 1 - No Addresses Found** → Shows "Add Address" form
4. **Fills Address Form**:
   - Name: "Alice Smith"
   - Phone: "+91 9876543210"
   - Pincode: "110001"
   - City: "Delhi"
   - State: "Delhi"
   - Address: "123 Main Street"
5. **Clicks "Save Address"** → Saved to Firestore
6. **Step 2 - Order Summary**:
   - Shows: "The Silent Garden" by Elena Morales
   - Address: Alice's saved address
   - Price breakdown: $24.99 + $1.25 tax = $26.24
7. **Clicks "Proceed to Payment"**
8. **Step 3 - Payment Gateway**:
   - Backend creates Razorpay order
   - Checkout form opens
   - User selects card payment
   - Enters card: 4111 1111 1111 1111
   - Razorpay processes payment
   - Returns success response
9. **Step 4 - Success Screen**:
   - Shows "Order Confirmed!"
   - Backend verified and saved order
   - Order record created in Firestore

---

## 9. Testing the Flow

### Test Razorpay Payment

**Card Details:**

- Number: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)

**Successful Payment:**

- Card will be charged (in test mode, amount is 0)
- Razorpay returns success response
- Backend receives callback
- Order saved to Firestore

---

## 10. State Management Pattern

```tsx
// BuyNowModal manages:
const [step, setStep] = useState<BuyNowStep>(); // Current step
const [addresses, setAddresses] = useState<UserAddress[]>(); // Loaded addresses
const [selectedAddress, setSelectedAddress] = useState(); // Chosen address

// Each child component receives props:
// - Data to display
// - Callbacks to update parent state
// - No internal state management (controlled components)

// Benefits:
// ✓ Single source of truth
// ✓ Easy to debug flow
// ✓ Can add analytics easily
// ✓ Easy to add validation
// ✓ Can restore state on error
```

---

## Summary

The Buy Now flow implements:

1. ✅ **Modal** - Overlays on product card
2. ✅ **Multi-step** - Clear progression through checkout
3. ✅ **Address Management** - Save reusable addresses
4. ✅ **Razorpay Integration** - Secure payment processing
5. ✅ **Signature Verification** - Ensures payment authenticity
6. ✅ **Firestore Storage** - Persistent data
7. ✅ **Error Handling** - User-friendly messages
8. ✅ **Loading States** - Clear feedback

All components work together to create a seamless checkout experience!
