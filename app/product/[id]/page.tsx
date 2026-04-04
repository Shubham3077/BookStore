"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import DeliveryAddressModal from "@/components/modals/DeliveryAddressModal"
import OrderSummaryModal from "@/components/modals/OrderSummaryModal"
import PaymentModal from "@/components/modals/PaymentModal"
import { getBookById, type Book } from "@/lib/firestore"
import { getUserAddresses } from "@/lib/firestore-address"
import { useAuth } from "@/lib/firebase-auth-context"
import { useCart } from "@/lib/cart-context"
import { AlertCircle } from "lucide-react"
import Image from "next/image"
import type { UserAddress } from "@/lib/types"

type BookFormat = "hardcover" | "ebook"
type CheckoutStep = "none" | "address" | "summary" | "payment"

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [format, setFormat] = useState<BookFormat>("hardcover")
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("none")
  const [addingToCart, setAddingToCart] = useState(false)
  const [addToCartFeedback, setAddToCartFeedback] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null)

  // Fetch book data
  useEffect(() => {
    async function fetchBook() {
      if (!params.id) return
      try {
        const bookData = await getBookById(params.id as string)
        if (!bookData) {
          // Redirect to collections if book not found
          router.push("/collections")
          return
        }
        setBook(bookData)
      } catch (error) {
        console.error("Error fetching book:", error)
        router.push("/collections")
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [params.id, router])

  // Fetch user addresses when checkout starts
  useEffect(() => {
    async function fetchAddresses() {
      if (!user || checkoutStep === "none") return
      try {
        const userAddresses = await getUserAddresses(user.uid)
        setAddresses(userAddresses)
        if (userAddresses.length > 0) {
          setSelectedAddress(userAddresses[0])
        }
      } catch (error) {
        console.error("Error fetching addresses:", error)
      }
    }

    fetchAddresses()
  }, [user, checkoutStep])

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!book) return

    setAddingToCart(true)
    setAddToCartFeedback(null)

    try {
      const price =
        typeof book.price === "number" ? book.price : parseFloat(String(book.price))
      if (!isFinite(price)) {
        throw new Error("Invalid product price")
      }
      await addToCart(book.id, book.title, price, book.cover)
      setAddToCartFeedback({ message: "Added to cart!", type: "success" })
      setTimeout(() => setAddToCartFeedback(null), 3000)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add to cart"
      setAddToCartFeedback({ message, type: "error" })
      setTimeout(() => setAddToCartFeedback(null), 3000)
      console.error("Error adding to cart:", error)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = () => {
    if (!user) {
      router.push("/login")
      return
    }
    setCheckoutStep("address")
  }

  const handleAddressSelect = (address: UserAddress) => {
    setSelectedAddress(address)
    setCheckoutStep("summary")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="w-[90%] md:w-[80%] mx-auto py-8 md:py-16">
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <main className="w-[90%] md:w-[80%] mx-auto py-8 md:py-16">
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <p className="text-muted-foreground">Product not found</p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to collections
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Calculate prices based on format
  const hardcoverPrice = book.price
  const ebookPrice = Math.round(hardcoverPrice * 0.67 * 100) / 100 // ~67% of hardcover
  const currentPrice = format === "hardcover" ? hardcoverPrice : ebookPrice

  return (
    <div className="min-h-screen bg-background">

      <main className="w-[90%] md:w-[80%] mx-auto py-8 md:py-16">
        {/* Breadcrumb */}
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* LEFT: Content */}
          <div className="order-2 lg:order-1 space-y-6">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {book.title}
              </h1>
              {book.authorDescription && (
                <p className="text-muted-foreground text-base md:text-lg mt-2">
                  {book.authorDescription}
                </p>
              )}
            </div>

            <p className="text-foreground text-sm md:text-base font-medium">{book.author}</p>

            {/* Format Selector */}
            <div className="flex items-center gap-6">
              {(["hardcover", "ebook"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors",
                    format === f
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                      format === f
                        ? "border-foreground"
                        : "border-muted-foreground/40"
                    )}
                  >
                    {format === f && (
                      <div className="w-2 h-2 rounded-full bg-foreground" />
                    )}
                  </div>
                  {f === "hardcover" ? "Hardcover" : "eBook"}
                </button>
              ))}
            </div>

            {/* Price */}
            <div className="space-y-1">
              <p className="font-serif text-3xl font-bold text-foreground">₹{currentPrice}</p>
              {format === "hardcover" && (
                <p className="text-sm text-muted-foreground">Free shipping on orders over ₹250</p>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:gap-3 w-full sm:w-auto">
              <Button
                onClick={handleBuyNow}
                className="h-10 sm:h-11 px-4 sm:px-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover font-semibold text-xs sm:text-sm transition-all duration-200 w-full sm:w-auto"
              >
                Buy Now
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                variant="outline"
                className="h-10 sm:h-11 px-4 sm:px-8 rounded-lg border-border text-foreground font-medium text-xs sm:text-sm disabled:opacity-60 transition-all duration-200 w-full sm:w-auto"
              >
                {addingToCart ? (
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="w-3 h-3 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Add to Cart</span>
                  </span>
                )}
              </Button>
            </div>

            {/* Add to Cart Feedback */}
            {addToCartFeedback && (
              <div
                className={`text-sm font-medium p-3 rounded flex items-center gap-2 ${
                  addToCartFeedback.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {addToCartFeedback.type === "error" && (
                  <AlertCircle className="h-4 w-4" />
                )}
                {addToCartFeedback.message}
              </div>
            )}

            {/* Meta */}
            {book.bookDetails && (
              <div className="space-y-2 text-sm text-muted-foreground pt-4 border-t border-border">
                {book.bookDetails.publisher && (
                  <p className="pt-2">Publisher: {book.bookDetails.publisher}</p>
                )}
                {book.bookDetails.pages && <p>Pages: {book.bookDetails.pages}</p>}
                {book.bookDetails.dimensions && (
                  <p>Dimensions: {book.bookDetails.dimensions}</p>
                )}
              </div>
            )}

            {/* Book Description */}
            {book.bookDescription && (
              <div className="space-y-2 text-sm text-foreground pt-4">
                <h3 className="font-medium text-foreground">About this book</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {book.bookDescription}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Book Image */}
          <div className="order-1 lg:order-2 flex items-start justify-center">
            <div className="bg-secondary/40 rounded-xl w-full max-w-md aspect-[3/4] flex items-center justify-center p-8 lg:p-12 sticky top-24">
              <Image
                src={book.cover}
                alt={`Cover of ${book.title}`}
                className="w-full max-w-[280px] h-auto object-contain drop-shadow-lg"
                width={280}
                height={400}
              />
            </div>
          </div>
        </div>
      </main>


      {/* Checkout Flow Modals */}
      <DeliveryAddressModal
        open={checkoutStep === "address"}
        onClose={() => setCheckoutStep("none")}
        onSelect={handleAddressSelect}
        addresses={addresses}
      />
      {selectedAddress && book && (
        <>
          <OrderSummaryModal
            open={checkoutStep === "summary"}
            onClose={() => setCheckoutStep("none")}
            onProceed={() => setCheckoutStep("payment")}
            onChangeAddress={() => setCheckoutStep("address")}
            book={book}
            address={selectedAddress}
          />
          <PaymentModal
            open={checkoutStep === "payment"}
            onClose={() => setCheckoutStep("none")}
            onPay={() => {
              setCheckoutStep("none")
              alert("Payment initiated!")
            }}
            book={book}
            address={selectedAddress}
          />
        </>
      )}
    </div>
  )
}
