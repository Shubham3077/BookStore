"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ShoppingBag, AlertCircle } from "lucide-react"
import Image from "next/image"
import type { Book } from "@/lib/firestore"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase-auth-context"
import { useCart } from "@/lib/cart-context"
import BuyNowModal from "./BuyNowModal"

type Props = { books: Book[] }

const NewCollection = ({ books }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ bookId: string; message: string; type: "success" | "error" } | null>(null)
  const { user } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  const handleBuyNow = (book: Book) => {
    setSelectedBook(book)
    setIsBuyNowOpen(true)
  }

  const handleAddToCart = async (book: Book) => {
    if (!user) {
      router.push("/login")
      return
    }

    setAddingToCart(book.id)
    setFeedback(null)

    try {
      // Price is now strongly typed as number in Book type
      const price = typeof book.price === "number" ? book.price : parseFloat(String(book.price))
      if (!isFinite(price)) {
        throw new Error("Invalid product price")
      }
      await addToCart(book.id, book.title, price, book.cover)
      setFeedback({ bookId: book.id, message: "Added to cart!", type: "success" })
      setTimeout(() => setFeedback(null), 3000)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add to cart"
      setFeedback({ bookId: book.id, message, type: "error" })
      setTimeout(() => setFeedback(null), 3000)
      console.error("Error adding to cart:", error)
    } finally {
      setAddingToCart(null)
    }
  }

  function handleClose() {
    setIsBuyNowOpen(false)
  }

  if (!books.length) return null

  return (
    <>
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-[90%] sm:max-w-[85%] lg:max-w-[80%]">
          <h2 className="text-4xl lg:text-5xl font-serif font-semibold text-foreground text-center mb-12 lg:mb-16">
            New Collection
          </h2>
          <div className="relative">
            {/* Left Arrow - Properly centered */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-5 lg:-left-8 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-primary/10 text-foreground hover:bg-primary/20 border border-border flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>

            {/* Right Arrow - Properly centered */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-5 lg:-right-8 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-primary/10 text-foreground hover:bg-primary/20 border border-border flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {books.map((book) => (
                <div key={book.id} className="flex-shrink-0 w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                  <div className="group relative h-full bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
                    {/* Image Container */}
                    <div className="relative aspect-3/4 overflow-hidden bg-muted">
                      <Image
                        src={book.cover}
                        alt={`Cover of ${book.title}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        width={300}
                        height={400}
                      />
                      
                      {/* Badge - Fixed positioning */}
                      {book.badge && (
                        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-[10px] px-2.5 py-0.5 font-medium tracking-wide">
                          {book.badge}
                        </Badge>
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="p-4 lg:p-5 flex flex-col flex-1">
                      {/* Title */}
                      <h3 className="font-serif font-semibold text-foreground text-base lg:text-lg mb-1.5 leading-snug">
                        {book.title}
                      </h3>

                      {/* Author */}
                      <p className="text-sm text-muted-foreground mb-2">{book.author}</p>

                      {/* Price */}
                      <p className="text-lg font-semibold text-foreground mb-5">₹{book.price}</p>

                      {/* Feedback Message */}
                      {feedback?.bookId === book.id && (
                        <div className={`text-xs font-medium mb-3 p-2 rounded flex items-center gap-1 ${
                          feedback.type === "success"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {feedback.type === "error" && <AlertCircle className="h-3 w-3" />}
                          {feedback.message}
                        </div>
                      )}

                      {/* Button Container - Spacer to push to bottom */}
                      <div className="flex gap-2 mt-auto">
                        {/* Add to Cart Button */}
                        <Button
                          onClick={() => handleAddToCart(book)}
                          disabled={addingToCart === book.id}
                          variant="outline"
                          className="flex-1 h-10 lg:h-11 rounded-full border-border text-foreground font-medium text-xs lg:text-sm transition-all duration-200 disabled:opacity-60"
                        >
                          {addingToCart === book.id ? (
                            <span className="flex items-center gap-2">
                              <span className="w-3 h-3 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                              Adding...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4" />
                              Add to Cart
                            </span>
                          )}
                        </Button>

                        {/* Buy Now Button */}
                        <Button
                          onClick={() => handleBuyNow(book)}
                          className="flex-1 h-10 lg:h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover font-semibold text-xs lg:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Buy Now Modal */}
      {selectedBook && (
        <BuyNowModal
          book={selectedBook}
          isOpen={isBuyNowOpen}
          onClose={() => {
            console.log("clicked cross")
            setIsBuyNowOpen(false)
          }}
        />
      )}
    </>
  )
}

export default NewCollection
