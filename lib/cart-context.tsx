"use client"

import * as React from "react"
import type { CartItem } from "@/lib/cart.service"
import {
  addToCart as addToCartService,
  getCartItems,
  removeFromCart as removeFromCartService,
  updateCartItemQuantity,
  decrementCartItemQuantity as decrementService,
  incrementCartItemQuantity as incrementService,
  clearCart as clearCartService,
  getCartSummary,
} from "@/lib/cart.service"
import { useAuth } from "@/lib/firebase-auth-context"

interface CartContextType {
  items: CartItem[]
  itemCount: number
  isLoading: boolean
  error: string | null
  
  // State snapshot (cached calculation)
  subtotal: number
  tax: number
  total: number

  // Actions
  addToCart: (bookId: string, title: string, price: number, cover: string) => Promise<void>
  removeFromCart: (cartItemId: string) => Promise<void>
  incrementQuantity: (cartItemId: string) => Promise<void>
  decrementQuantity: (cartItemId: string) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  loadCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [subtotal, setSubtotal] = React.useState(0)
  const [tax, setTax] = React.useState(0)
  const [total, setTotal] = React.useState(0)
  const { user } = useAuth()

  const userId = user?.uid

  const calculateTotals = React.useCallback((items: CartItem[]) => {
    // Ensure items is an array
    if (!Array.isArray(items) || items.length === 0) {
      setSubtotal(0)
      setTax(0)
      setTotal(0)
      return
    }

    try {
      // Calculate subtotal with safe price conversion
      const sub = items.reduce((sum, item) => {
        const price = typeof item.price === "number" ? item.price : 0
        const quantity = item.quantity || 0
        
        if (isNaN(price) || !isFinite(price)) {
          console.warn(`Invalid price for item ${item.id}:`, item.price)
          return sum
        }
        
        return sum + price * quantity
      }, 0)

      // Ensure subtotal is valid
      const safeSub = isFinite(sub) ? sub : 0
      const taxAmount = safeSub * 0.18 // 18% tax
      const totalAmount = safeSub + taxAmount

      setSubtotal(Math.round(safeSub * 100) / 100)
      setTax(Math.round(taxAmount * 100) / 100)
      setTotal(Math.round(totalAmount * 100) / 100)
    } catch (error) {
      console.error("Error calculating totals:", error)
      setSubtotal(0)
      setTax(0)
      setTotal(0)
    }
  }, [])

  // Load cart when user changes
  React.useEffect(() => {
    if (userId) {
      loadCart()
    } else {
      // Clear cart when user logs out
      setItems([])
      calculateTotals([])
    }
  }, [userId])

  const loadCart = React.useCallback(async () => {
    if (!userId) {
      setError("User not authenticated")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const cartItems = await getCartItems(userId)
      setItems(cartItems)
      calculateTotals(cartItems)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load cart"
      setError(message)
      console.error("Error loading cart:", err)
    } finally {
      setIsLoading(false)
    }
  }, [userId, calculateTotals])

  const refreshCart = React.useCallback(async () => {
    return loadCart()
  }, [loadCart])

  const addToCart = React.useCallback(
    async (bookId: string, title: string, price: number, cover: string) => {
      if (!userId) {
        setError("User not authenticated")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        await addToCartService(userId, { bookId, title, price, cover })
        // Refresh cart after adding
        await loadCart()
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add to cart"
        setError(message)
        console.error("Error adding to cart:", err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [userId, loadCart]
  )

  const removeFromCart = React.useCallback(
    async (cartItemId: string) => {
      if (!userId) {
        setError("User not authenticated")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        await removeFromCartService(userId, cartItemId)
        // Update local state optimistically
        const updatedItems = items.filter((item) => item.id !== cartItemId)
        setItems(updatedItems)
        calculateTotals(updatedItems)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to remove from cart"
        setError(message)
        console.error("Error removing from cart:", err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [userId, items, calculateTotals]
  )

  const incrementQuantity = React.useCallback(
    async (cartItemId: string) => {
      if (!userId) {
        setError("User not authenticated")
        return
      }

      setError(null)

      try {
        const item = items.find((i) => i.id === cartItemId)
        if (!item) return

        // Optimistic update
        const updatedItems = items.map((i) =>
          i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        )
        setItems(updatedItems)
        calculateTotals(updatedItems)

        // Server update
        await incrementService(userId, cartItemId)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to increment quantity"
        setError(message)
        console.error("Error incrementing quantity:", err)
        throw err
      }
    },
    [userId, items, calculateTotals]
  )

  const decrementQuantity = React.useCallback(
    async (cartItemId: string) => {
      if (!userId) {
        setError("User not authenticated")
        return
      }

      setError(null)

      try {
        const item = items.find((i) => i.id === cartItemId)
        if (!item) return

        if (item.quantity <= 1) {
          // Remove item if quantity is 1
          await removeFromCart(cartItemId)
        } else {
          // Optimistic update
          const updatedItems = items.map((i) =>
            i.id === cartItemId ? { ...i, quantity: i.quantity - 1 } : i
          )
          setItems(updatedItems)
          calculateTotals(updatedItems)

          // Server update
          await decrementService(userId, cartItemId)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to decrement quantity"
        setError(message)
        console.error("Error decrementing quantity:", err)
        throw err
      }
    },
    [userId, items, removeFromCart, calculateTotals]
  )

  const updateQuantity = React.useCallback(
    async (cartItemId: string, quantity: number) => {
      if (!userId) {
        setError("User not authenticated")
        return
      }

      if (quantity < 1) {
        await removeFromCart(cartItemId)
        return
      }

      setError(null)

      try {
        // Optimistic update
        const updatedItems = items.map((i) =>
          i.id === cartItemId ? { ...i, quantity } : i
        )
        setItems(updatedItems)
        calculateTotals(updatedItems)

        // Server update
        await updateCartItemQuantity(userId, cartItemId, quantity)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update quantity"
        setError(message)
        console.error("Error updating quantity:", err)
        throw err
      }
    },
    [userId, items, removeFromCart, calculateTotals]
  )

  const clearCart = React.useCallback(async () => {
    if (!userId) {
      setError("User not authenticated")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await clearCartService(userId)
      setItems([])
      calculateTotals([])
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to clear cart"
      setError(message)
      console.error("Error clearing cart:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [userId, calculateTotals])

  const value: CartContextType = {
    items,
    itemCount: items.length,
    isLoading,
    error,
    subtotal,
    tax,
    total,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    updateQuantity,
    clearCart,
    loadCart,
    refreshCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextType {
  const context = React.useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
