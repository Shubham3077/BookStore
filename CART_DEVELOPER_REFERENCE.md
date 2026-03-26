# Cart System - Developer Reference

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              UI Components                          │
│  ├─ NewCollection.tsx (Add to cart)               │
│  ├─ Cart Page (View & manage)                      │
│  └─ Checkout (Payment flow)                        │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│          Cart Context (State Management)            │
│  ├─ useCart() hook                                 │
│  ├─ items: CartItem[]                              │
│  ├─ subtotal, tax, total                           │
│  └─ Actions: add, remove, update                   │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│          Cart Service (Business Logic)              │
│  ├─ addToCart()                                    │
│  ├─ getCartItems()                                 │
│  ├─ updateQuantity()                               │
│  ├─ removeFromCart()                               │
│  └─ getCartSummary()                               │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│          Firestore Database                        │
│  Path: /users/{userId}/cart/{itemId}              │
└─────────────────────────────────────────────────────┘
```

---

## 💾 Data Models

### CartItem (Firestore Document)

```typescript
{
  bookId: string,           // Reference to book
  title: string,            // Book title
  price: number,            // ✅ Numeric price
  cover: string,            // Book cover image URL
  quantity: number,         // Number of copies (≥1)
  createdAt: string,        // ISO timestamp
  updatedAt: string         // ISO timestamp
}
```

### CartContext State

```typescript
{
  items: CartItem[],        // Array of cart items
  itemCount: number,        // Total unique items
  subtotal: number,         // Sum of (price × quantity)
  tax: number,              // 18% of subtotal
  total: number,            // subtotal + tax
  isLoading: boolean,       // Operation in progress
  error: string | null      // Error message if any
}
```

---

## 🎯 Common Operations

### 1. Add Item to Cart

```typescript
const { addToCart } = useCart();

const handleAddToCart = async (
  bookId: string,
  title: string,
  price: number,
  cover: string,
) => {
  try {
    await addToCart(bookId, title, price, cover);
    // If item exists, quantity auto-increments
    // Success feedback shown to user
  } catch (error) {
    // Handle error
  }
};
```

### 2. View Cart Items

```typescript
const { items, subtotal, tax, total } = useCart();

items.forEach((item) => {
  console.log(`${item.title}: ${item.quantity} × ₹${item.price}`);
});
console.log(`Total: ₹${total}`);
```

### 3. Update Quantity

```typescript
const { updateQuantity } = useCart();

// Set specific quantity
await updateQuantity(cartItemId, 5);

// Or increment/decrement
const { incrementQuantity, decrementQuantity } = useCart();
await incrementQuantity(cartItemId);
await decrementQuantity(cartItemId);
```

### 4. Remove Item

```typescript
const { removeFromCart } = useCart();
await removeFromCart(cartItemId);
```

### 5. Clear Cart

```typescript
const { clearCart } = useCart();
await clearCart();
```

---

## 🔢 Price Handling

### Safe Price Conversion

```typescript
import { toNumber } from "@/lib/utils";

const price = toNumber("900"); // ✅ 900
const price = toNumber("₹900"); // ✅ 900
const price = toNumber(900); // ✅ 900
const price = toNumber(undefined); // ✅ 0
const price = toNumber("invalid"); // ✅ 0
```

### Calculate Cart Total

```typescript
import { calculateTotal } from "@/lib/utils";

const items = [
  { price: 500, quantity: 2 },
  { price: 300, quantity: 1 },
];

const total = calculateTotal(items); // ✅ 1300
```

### Calculate Tax

```typescript
import { calculateTax } from "@/lib/utils";

const subtotal = 1000;
const { tax, total } = calculateTax(subtotal, 0.18); // 18% GST
// tax: 180, total: 1180
```

---

## ⚙️ Configuration

### Tax Rate

```typescript
// In cart context and service:
const tax = subtotal * 0.18; // 18% (GST)
```

To change tax rate, update in:

- `lib/cart-context.tsx` (line 56)
- `lib/cart.service.ts` (line 365)
- All component modals

---

## 🚨 Error Handling

### Automatic Recovery

```typescript
// If price is invalid:
const price = typeof item.price === "number" ? item.price : 0;
// ✅ Defaults to 0, prevents NaN

// If calculation fails:
try {
  // calculate
} catch (error) {
  console.error(error);
  setSubtotal(0); // Safe default
  setTax(0);
  setTotal(0);
}
```

### Manual Error Checking

```typescript
const { error } = useCart();

if (error) {
  console.error("Cart error:", error);
  // Show error UI, retry, etc.
}
```

---

## 📝 Validation Rules

### Before Adding to Cart

- ✅ User must be authenticated
- ✅ Book ID must exist
- ✅ Price must be numeric and finite
- ✅ Price must be > 0

### During Cart Operations

- ✅ Quantity must be ≥ 1
- ✅ Item must exist in cart
- ✅ User ID must match

### Before Checkout

- ✅ Cart must not be empty
- ✅ All prices must be valid
- ✅ Total must be valid number

---

## 🔍 Debugging

### Console Logging

```typescript
// Cart service logs:
- "Error adding to cart:"
- "Error fetching cart items:"
- "Error updating cart item quantity:"

// Cart context logs:
- "Error loading cart:"
- "Error calculating totals:" (with error details)
```

### Check Status

```typescript
const { items, isLoading, error } = useCart();

console.log("Items:", items.length);
console.log("Loading:", isLoading);
console.log("Error:", error);

// Check calculations
console.log("Subtotal:", subtotal);
console.log("Tax:", tax);
console.log("Total:", total);
```

### Firestore Structure

```
users/
  └─ {userId}/
     └─ cart/
        ├─ {cartItemId1}
        │  ├─ bookId: "book-1"
        │  ├─ title: "Book Title"
        │  ├─ price: 900
        │  ├─ quantity: 2
        │  └─ ...
        └─ {cartItemId2}
           └─ ...
```

---

## 🧪 Testing Scenarios

### Test Case 1: Add Item

```
1. User not logged in
   → Redirect to "/login"

2. User logged in, add book
   → Item added with quantity 1
   → Cart total updated

3. Add same book again
   → Quantity incremented to 2
   → Total recalculated
```

### Test Case 2: Calculate Total

```
1. Cart empty
   → subtotal: 0, tax: 0, total: 0

2. One item: ₹900, qty: 1
   → subtotal: 900, tax: 162, total: 1062

3. Two items: ₹900×1 + ₹500×2
   → subtotal: 1900, tax: 342, total: 2242
```

### Test Case 3: Remove Item

```
1. Remove from cart
   → Item disappears
   → Totals recalculated immediately (optimistic)
   → Firestore updated

2. Remove last item
   → Cart shows empty state
   → Show "Your cart is empty"
```

---

## 🔗 API Integration

### When Creating Order (Payment)

```typescript
const { subtotal, tax, total } = useCart();

// Send to payment API:
const paymentPayload = {
  amount: total, // Send final total with tax
  bookId: item.bookId,
  userId: user.uid,
  addressId: selectedAddress.id,
  currency: "INR",
  description: `Purchase of ${item.title}`,
};

// Your API should:
// 1. Create Razorpay order with amount
// 2. Verify signature after payment
// 3. Create order record in Firestore
// 4. Clear user's cart after confirmation
```

---

## 📱 Mobile Considerations

### Responsive Design

- Cart page responsive on all devices
- Touch-friendly quantity buttons
- Optimized modal sizes for mobile
- Scrollable on small screens

### Performance

- Lazy load images
- Debounce rapid quantity changes
- Optimize re-renders
- Cache calculations when possible

---

## 🚀 Deployment Checklist

Before deploying:

1. **Environment Variables**
   - Firebase config set in `.env.local`
   - Razorpay keys configured

2. **Firestore Security Rules**

   ```
   match /users/{userId}/cart/{document=**} {
     allow read, write: if request.auth.uid == userId;
   }
   ```

3. **Database Setup**
   - Firestore initialized
   - Collections created
   - Seed script run successfully

4. **Build Verification**
   - `npm run build` passes
   - No TypeScript errors
   - No console warnings

5. **Testing**
   - Add to cart works
   - Totals calculated correctly
   - Checkout flow completes
   - No NaN values

---

## 📚 Related Files

| File                           | Purpose          |
| ------------------------------ | ---------------- |
| `lib/cart.service.ts`          | Business logic   |
| `lib/cart-context.tsx`         | State management |
| `lib/firestore.ts`             | Types & queries  |
| `lib/utils.ts`                 | Helper functions |
| `app/cart/page.tsx`            | Cart display     |
| `components/NewCollection.tsx` | Add to cart      |

---

## 🎓 Key Concepts

### Optimistic Updates

When user modifies cart, UI updates immediately before server confirmation. If operation fails, changes rollback.

### Safe Calculations

Every price is validated before use. Invalid prices default to 0 to prevent NaN propagation.

### Firestore Subcollection

Cart items stored in `/users/{userId}/cart/` for easy scaling and user isolation.

### Tax Calculation

All totals include 18% GST (Indian tax). Applied after subtotal is calculated.

---

## ✅ Quality Assurance

- ✅ Type-safe (full TypeScript)
- ✅ Error-handled (try-catch blocks)
- ✅ Validated (input checks)
- ✅ Responsive (mobile-friendly)
- ✅ Performant (optimized re-renders)
- ✅ Accessible (semantic HTML)
- ✅ Documented (comments in code)

---

## 💡 Pro Tips

1. **Always await cart operations**

   ```typescript
   await addToCart(...)  // ✅ Wait for completion
   addToCart(...)        // ❌ Fire and forget
   ```

2. **Check authentication before adding**

   ```typescript
   if (!user) {
     router.push("/login");
     return;
   }
   ```

3. **Use useCallback to avoid re-renders**

   ```typescript
   const addToCart = useCallback(async (...) => {
     // prevents parent re-renders
   }, [...])
   ```

4. **Format prices for display**
   ```typescript
   ₹{price.toFixed(2)}  // ✅ Always show 2 decimals
   ```

---

Status: ✅ PRODUCTION READY
