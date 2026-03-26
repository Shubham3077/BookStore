import {
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  type QueryConstraint,
} from "firebase/firestore"
import { db } from "./firebase"

export interface CartItem {
  id: string
  bookId: string
  title: string
  price: number
  cover: string
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface CartItemInput {
  bookId: string
  title: string
  price: number
  cover: string
}

/**
 * Firestore Cart Service
 *
 * Structure: /users/{userId}/cart/{cartItemId}
 *
 * Handles all cart operations: Create, Read, Update, Delete
 */

/**
 * Add item to cart or increment quantity if already exists
 */
export async function addToCart(
  userId: string,
  item: CartItemInput
): Promise<CartItem> {
  if (!userId || !item.bookId) {
    throw new Error("Missing userId or bookId")
  }

  // Validate price
  const price = typeof item.price === "number" ? item.price : 0
  if (!isFinite(price) || price < 0) {
    throw new Error(`Invalid price: ${item.price}`)
  }

  try {
    // Check if item already exists
    const existingItem = await getCartItemByBookId(userId, item.bookId)

    if (existingItem) {
      // Increment quantity
      return await updateCartItemQuantity(userId, existingItem.id, existingItem.quantity + 1)
    }

    // Add new item
    const cartRef = collection(db, "users", userId, "cart")
    const now = new Date().toISOString()

    const docRef = await addDoc(cartRef, {
      bookId: item.bookId,
      title: item.title,
      price: price,
      cover: item.cover,
      quantity: 1,
      createdAt: now,
      updatedAt: now,
    })

    return {
      id: docRef.id,
      bookId: item.bookId,
      title: item.title,
      price: price,
      cover: item.cover,
      quantity: 1,
      createdAt: now,
      updatedAt: now,
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

/**
 * Get all cart items for a user
 */
export async function getCartItems(userId: string): Promise<CartItem[]> {
  if (!userId) {
    throw new Error("Missing userId")
  }

  try {
    const cartRef = collection(db, "users", userId, "cart")
    const snap = await getDocs(cartRef)

    return snap.docs.map((doc) => {
      const data = doc.data() as Record<string, unknown>
      // Ensure price is a valid number
      const price = typeof data.price === "number" ? data.price : 0
      
      return {
        id: doc.id,
        bookId: data.bookId as string,
        title: data.title as string,
        price: price,
        cover: data.cover as string,
        quantity: Math.max(1, (data.quantity as number) || 1),
        createdAt: data.createdAt as string,
        updatedAt: data.updatedAt as string,
      }
    })
  } catch (error) {
    console.error("Error fetching cart items:", error)
    throw error
  }
}

/**
 * Get a specific cart item by ID
 */
export async function getCartItem(userId: string, cartItemId: string): Promise<CartItem | null> {
  if (!userId || !cartItemId) {
    throw new Error("Missing userId or cartItemId")
  }

  try {
    const cartRef = collection(db, "users", userId, "cart")
    const snapshot = await getDocs(
      query(cartRef, where("__name__", "==", cartItemId)) as any
    )

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    const data = doc.data() as Record<string, unknown>
    const price = typeof data.price === "number" ? data.price : 0
    
    return {
      id: doc.id,
      bookId: data.bookId as string,
      title: data.title as string,
      price: price,
      cover: data.cover as string,
      quantity: Math.max(1, (data.quantity as number) || 1),
      createdAt: data.createdAt as string,
      updatedAt: data.updatedAt as string,
    }
  } catch (error) {
    console.error("Error fetching cart item:", error)
    throw error
  }
}

/**
 * Get cart item by book ID
 */
export async function getCartItemByBookId(
  userId: string,
  bookId: string
): Promise<CartItem | null> {
  if (!userId || !bookId) {
    throw new Error("Missing userId or bookId")
  }

  try {
    const cartRef = collection(db, "users", userId, "cart")
    const snapshot = await getDocs(query(cartRef, where("bookId", "==", bookId)))

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    const data = doc.data() as Record<string, unknown>
    const price = typeof data.price === "number" ? data.price : 0
    
    return {
      id: doc.id,
      bookId: data.bookId as string,
      title: data.title as string,
      price: price,
      cover: data.cover as string,
      quantity: Math.max(1, (data.quantity as number) || 1),
      createdAt: data.createdAt as string,
      updatedAt: data.updatedAt as string,
    }
  } catch (error) {
    console.error("Error fetching cart item by bookId:", error)
    throw error
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  userId: string,
  cartItemId: string,
  quantity: number
): Promise<CartItem> {
  if (!userId || !cartItemId) {
    throw new Error("Missing userId or cartItemId")
  }

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1")
  }

  try {
    const cartItemRef = doc(db, "users", userId, "cart", cartItemId)
    const now = new Date().toISOString()

    await updateDoc(cartItemRef, {
      quantity,
      updatedAt: now,
    })

    // Fetch and return updated item
    return (await getCartItem(userId, cartItemId)) as CartItem
  } catch (error) {
    console.error("Error updating cart item quantity:", error)
    throw error
  }
}

/**
 * Increment cart item quantity
 */
export async function incrementCartItemQuantity(
  userId: string,
  cartItemId: string
): Promise<CartItem> {
  if (!userId || !cartItemId) {
    throw new Error("Missing userId or cartItemId")
  }

  try {
    const cartItem = await getCartItem(userId, cartItemId)
    if (!cartItem) {
      throw new Error("Cart item not found")
    }

    return await updateCartItemQuantity(userId, cartItemId, cartItem.quantity + 1)
  } catch (error) {
    console.error("Error incrementing cart item quantity:", error)
    throw error
  }
}

/**
 * Decrement cart item quantity
 */
export async function decrementCartItemQuantity(
  userId: string,
  cartItemId: string
): Promise<CartItem | null> {
  if (!userId || !cartItemId) {
    throw new Error("Missing userId or cartItemId")
  }

  try {
    const cartItem = await getCartItem(userId, cartItemId)
    if (!cartItem) {
      throw new Error("Cart item not found")
    }

    if (cartItem.quantity <= 1) {
      // Delete item if quantity would be 0
      await removeFromCart(userId, cartItemId)
      return null
    }

    return await updateCartItemQuantity(userId, cartItemId, cartItem.quantity - 1)
  } catch (error) {
    console.error("Error decrementing cart item quantity:", error)
    throw error
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(userId: string, cartItemId: string): Promise<void> {
  if (!userId || !cartItemId) {
    throw new Error("Missing userId or cartItemId")
  }

  try {
    const cartItemRef = doc(db, "users", userId, "cart", cartItemId)
    await deleteDoc(cartItemRef)
  } catch (error) {
    console.error("Error removing from cart:", error)
    throw error
  }
}

/**
 * Clear entire cart
 */
export async function clearCart(userId: string): Promise<void> {
  if (!userId) {
    throw new Error("Missing userId")
  }

  try {
    const cartItems = await getCartItems(userId)

    if (cartItems.length === 0) {
      return
    }

    const batch = writeBatch(db)

    cartItems.forEach((item) => {
      const cartItemRef = doc(db, "users", userId, "cart", item.id)
      batch.delete(cartItemRef)
    })

    await batch.commit()
  } catch (error) {
    console.error("Error clearing cart:", error)
    throw error
  }
}

/**
 * Get cart summary
 */
export async function getCartSummary(userId: string): Promise<{
  itemCount: number
  subtotal: number
  tax: number
  total: number
  items: CartItem[]
}> {
  if (!userId) {
    throw new Error("Missing userId")
  }

  try {
    const items = await getCartItems(userId)

    // Safe calculation with validation
    const subtotal = items.reduce((sum, item) => {
      const price = typeof item.price === "number" ? item.price : 0
      const quantity = item.quantity || 0
      
      if (!isFinite(price)) {
        console.warn(`Invalid price for item ${item.id}:`, item.price)
        return sum
      }
      
      return sum + price * quantity
    }, 0)

    const safeSubtotal = isFinite(subtotal) ? subtotal : 0
    const tax = safeSubtotal * 0.18 // 18% tax
    const total = safeSubtotal + tax

    return {
      itemCount: items.length,
      subtotal: Math.round(safeSubtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      items,
    }
  } catch (error) {
    console.error("Error getting cart summary:", error)
    throw error
  }
}
