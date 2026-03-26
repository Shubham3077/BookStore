# 🛒 Cart System Implementation Guide

## ✅ What's Been Implemented

### 1. **Cart Service** (`lib/cart.service.ts`)

Complete CRUD operations with Firestore integration.

**Key Functions:**

```typescript
// Create/Add
addToCart(userId, item): Promise<CartItem>

// Read
getCartItems(userId): Promise<CartItem[]>
getCartItem(userId, cartItemId): Promise<CartItem | null>
getCartItemByBookId(userId, bookId): Promise<CartItem | null>
getCartSummary(userId): Promise<{ itemCount, subtotal, tax, total, items }>

// Update
updateCartItemQuantity(userId, cartItemId, quantity): Promise<CartItem>
incrementCartItemQuantity(userId, cartItemId): Promise<CartItem>
decrementCartItemQuantity(userId, cartItemId): Promise<CartItem | null>

// Delete
removeFromCart(userId, cartItemId): Promise<void>
clearCart(userId): Promise<void>
```

**Firestore Structure:**

```
/users/{userId}/cart/{cartItemId}
├── bookId: string
├── title: string
├── price: number
├── cover: string
├── quantity: number
├── createdAt: timestamp
└── updatedAt: timestamp
```

---

### 2. **Cart Context** (`lib/cart-context.tsx`)

Global state management with React Context API.

**Features:**

- ✅ Auto-loads cart when user logs in
- ✅ Auto-clears cart when user logs out
- ✅ Optimistic UI updates (instant feedback)
- ✅ Real-time Firestore sync
- ✅ Automatic total calculations
- ✅ Loading and error states

**Context Hook:**

```typescript
const {
  items, // CartItem[]
  itemCount, // number of items
  isLoading,
  error, // string | null
  subtotal, // calculated
  tax, // calculated (18%)
  total, // calculated
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
  clearCart,
  loadCart,
  refreshCart,
} = useCart();
```

---

### 3. **Updated Components**

#### **Navbar** (`components/Navbar.tsx`)

✅ **Changes:**

- Cart icon navigates to `/cart` when clicked
- Shows real-time item count badge
- Badge hidden when cart is empty
- Redirects to login if not authenticated

**Usage:**

```typescript
import { useCart } from "@/lib/cart-context";
const { itemCount } = useCart();
```

#### **NewCollection** (`components/NewCollection.tsx`)

✅ **Changes:**

- "Add to Cart" button now functional
- Shows loading spinner while adding
- Displays success/error feedback
- Redirects to login if not authenticated
- Formats prices correctly
- Shopping bag icon

**User Flow:**

```
User clicks "Add to Cart"
  ↓
User logged in? → YES → Add to Firestore → Show success
                  ↓
                 NO → Redirect to /login
```

#### **Cart Page** (`app/cart/page.tsx`)

✅ **Complete Rewrite:**

- Real-time Firestore data
- Functional quantity controls (+/-)
- Working delete button
- Order summary with auto-calculated totals
- Empty cart state
- Loading states
- Auth protection (redirects to login if needed)

**Features:**

- ✅ Increment/Decrement quantity
- ✅ Remove individual items
- ✅ Automatic item removal when quantity reaches 0
- ✅ Real-time total calculations
- ✅ Optimistic updates (instant UI feedback)

#### **Providers** (`app/providers.tsx`)

✅ **Updated:**

- Added `CartProvider` to wrap entire app
- Positioned after `FirebaseAuthProvider`

---

## 🧪 Testing Checklist

### Basic Functionality

- [ ] **Add to Cart**
  1. Navigate to home page
  2. Click "Add to Cart" on any book
  3. Should show loading spinner briefly
  4. Should show "Added to cart!" success message (green)
  5. Cart count in navbar should increment

- [ ] **Cart Navigation**
  1. Click cart icon in navbar
  2. Should navigate to `/cart`
  3. Cart page should display the added item

- [ ] **View Cart**
  1. On cart page, verify all items display correctly
  2. Check book title, image, price, quantity
  3. Verify "Order Summary" calculates correctly
  4. Verify tax is 18% of subtotal

### CRUD Operations

- [ ] **Increment Quantity**
  1. Click the "+" button next to an item
  2. Quantity should increase immediately (optimistic)
  3. Total should update automatically

- [ ] **Decrement Quantity**
  1. Click "-" button next to an item
  2. Quantity should decrease
  3. If quantity reaches 0, item should be removed

- [ ] **Remove Item**
  1. Click trash icon next to an item
  2. Item should disappear immediately
  3. Cart count in navbar should update
  4. Total should recalculate

- [ ] **Empty Cart**
  1. Remove all items from cart
  2. Should show "Your cart is empty" message
  3. "Continue Shopping" button should appear

### Persistence & Sync

- [ ] **Refresh Page**
  1. Add items to cart
  2. Refresh the page (`Cmd+R` or `Ctrl+R`)
  3. Cart items should persist
  4. Cart count should be correct

- [ ] **Navigate Away & Back**
  1. Add items to cart
  2. Navigate to home (`/`)
  3. Return to `/cart`
  4. Items should still be there

- [ ] **Logout & Login**
  1. Add items to cart
  2. Logout (click logout button)
  3. Login with the same account
  4. Cart should be restored with same items

### Error Handling

- [ ] **Not Logged In**
  1. Click "Add to Cart" without logging in
  2. Should redirect to `/login`
  3. After login, cart should be empty (fresh start)

- [ ] **Unauthenticated Cart Access**
  1. Try to access `/cart` without login
  2. Should redirect to `/login`

### Edge Cases

- [ ] **Prevent Zero Quantity**
  1. Quantity field should never allow 0
  2. Decrementing from 1 should remove the item

- [ ] **Multiple Updates**
  1. Rapidly click + and - buttons
  2. All updates should apply correctly
  3. No duplicate items should be created

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────┐
│      User Interaction (Component)       │
│  - NewCollection.tsx                    │
│  - Cart Page                            │
└──────────────┬──────────────────────────┘
               │ calls useCart hook
               ▼
┌─────────────────────────────────────────┐
│        CartContext (Global State)       │
│  - Manages items, totals                │
│  - Optimistic updates                   │
│  - Auto-sync with Firestore             │
└──────────────┬──────────────────────────┘
               │ calls service functions
               ▼
┌─────────────────────────────────────────┐
│      Cart Service (CRUD)                │
│  - addToCart, removeFromCart, etc.      │
│  - Validation & error handling          │
└──────────────┬──────────────────────────┘
               │ uses Firebase SDK
               ▼
┌─────────────────────────────────────────┐
│   Firebase Firestore (Source of Truth)  │
│  /users/{userId}/cart/{cartItemId}      │
└─────────────────────────────────────────┘
```

---

## 🚀 Usage Examples

### Add to Cart

```typescript
const { addToCart } = useCart();

await addToCart(
  "book-123", // bookId
  "The Great Gatsby", // title
  12.99, // price
  "https://example.com/cover.jpg", // cover image
);
```

### Update Quantity

```typescript
const { incrementQuantity, decrementQuantity, updateQuantity } = useCart();

// Increment by 1
await incrementQuantity("cart-item-456");

// Decrement by 1
await decrementQuantity("cart-item-456");

// Set to specific value
await updateQuantity("cart-item-456", 5);
```

### Remove Item

```typescript
const { removeFromCart } = useCart();

await removeFromCart("cart-item-456");
```

### Access Cart Data

```typescript
const { items, subtotal, tax, total } = useCart();

console.log(`Cart has ${items.length} items`);
console.log(`Total: $${total.toFixed(2)}`);
```

---

## 📁 File Structure

```
bookstore/
├── lib/
│   ├── cart.service.ts          ✅ NEW - CRUD operations
│   ├── cart-context.tsx         ✅ NEW - Global state
│   ├── firebase.ts              (existing)
│   ├── firebase-auth-context.tsx (existing)
│   └── ...
├── components/
│   ├── Navbar.tsx               ✅ MODIFIED - Cart navigation
│   ├── NewCollection.tsx        ✅ MODIFIED - Add to Cart
│   └── ...
├── app/
│   ├── providers.tsx            ✅ MODIFIED - Added CartProvider
│   ├── cart/
│   │   └── page.tsx             ✅ MODIFIED - Firestore integration
│   └── ...
└── ...
```

---

## 🔧 Configuration

### Tax Rate

Currently set to 18%. To change:

```typescript
// In cart-context.tsx and cart.service.ts
const taxAmount = subtotal * 0.18; // Change this

// Example for 10% tax:
const taxAmount = subtotal * 0.1;
```

### Cart Item Limits

To add max quantity limits:

```typescript
const MAX_QUANTITY = 10; // Add this

if (quantity > MAX_QUANTITY) {
  throw new Error(`Cannot add more than ${MAX_QUANTITY} of this item`);
}
```

---

## 🐛 Troubleshooting

### "Cart is empty" after adding items

1. Check if user is logged in
2. Check browser console for errors
3. Verify Firestore rules allow read/write to `/users/{uid}/cart/**`

### Cart count not updating

1. Hard refresh browser (`Cmd+Shift+R`)
2. Check if `useCart` hook is being used in component
3. Verify CartProvider wraps the component

### Items disappear after logout

- **This is expected behavior** - Each user has their own cart in Firestore
- When you logout and login with a different account, you see their cart

### Optimistic updates not working

- Check browser console for errors
- Verify Firestore write operations succeed
- Check network tab in DevTools

---

## ⚠️ Known Limitations

1. **No Payment Integration**: Checkout button is not functional yet
2. **No Wishlist**: Can't save items for later
3. **No Bulk Operations**: Can't delete multiple items at once
4. **Single User Carts**: Cart is per user, not device-based
5. **No Stock Checking**: Can't prevent overselling

---

## 🎯 Next Steps (Future Features)

1. **Payment Gateway Integration** (Razorpay)
   - Integrate checkout flow
   - Order completion

2. **Wishlist Feature**
   - Save items for later
   - Move between wishlist and cart

3. **Coupon & Discounts**
   - Apply discount codes
   - Show original vs. discounted price

4. **Inventory Management**
   - Check stock availability
   - Show "Out of Stock" status

5. **Order History**
   - View past purchases
   - Reorder functionality

---

## 📚 Resources

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [React Context API](https://react.dev/reference/react/useContext)
- [Next.js Dynamic Rendering](https://nextjs.org/docs/app/building-your-application/rendering)

---

## ✨ Summary

Your e-commerce cart is now **fully functional** with:

- ✅ Real-time Firestore persistence
- ✅ Optimistic UI updates
- ✅ Global state management
- ✅ Full CRUD operations
- ✅ Automatic calculations
- ✅ Error handling
- ✅ Loading states
- ✅ Auth protection

**Happy selling! 🎉**
