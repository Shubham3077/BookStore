"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import type { Book } from "@/lib/firestore"
import { useRef, useState } from "react"
import BuyNowModal from "./BuyNowModal"

type Props = { books: Book[] }

const NewCollection = ({ books }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  const handleBuyNow = (book: Book) => {
    setSelectedBook(book)
    setIsBuyNowOpen(true)
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
              className="absolute left-0 lg:left-1 top-1/2 -translate-y-1/2 z-20 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white/90 text-foreground hover:bg-white shadow-lg hover:shadow-xl border border-gray-200/50 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>

            {/* Right Arrow - Properly centered */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 lg:right-1 top-1/2 -translate-y-1/2 z-20 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white/90 text-foreground hover:bg-white shadow-lg hover:shadow-xl border border-gray-200/50 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
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
                <div
                  key={book.id}
                  className="group shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-10px)] lg:w-[calc(25%-12px)] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Image Container */}
                  <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
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
                      <Badge className="absolute top-3 left-3 bg-primary text-white text-xs px-3 py-1 font-medium tracking-wide rounded-full shadow-sm">
                        {book.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="p-4 lg:p-5 flex flex-col">
                    {/* Title */}
                    <h3 className="font-serif font-semibold text-foreground text-sm lg:text-base mb-1.5 leading-tight line-clamp-2 min-h-8">
                      {book.title}
                    </h3>

                    {/* Author */}
                    <p className="text-xs lg:text-sm text-gray-600 mb-2.5 line-clamp-1">{book.author}</p>

                    {/* Price */}
                    <p className="text-lg lg:text-xl font-bold text-foreground mb-4">{book.price}</p>

                    {/* Button Container - Spacer to push to bottom */}
                    <div className="flex gap-2 mt-auto">
                      {/* Add to Cart Button */}
                      <Button
                        variant="outline"
                        className="flex-1 bg-white border-2 border-gray-300 text-foreground hover:bg-gray-50 hover:border-primary text-xs lg:text-sm font-medium rounded-full py-2 lg:py-2.5 h-10 lg:h-11 transition-all duration-200"
                      >
                        Cart
                      </Button>

                      {/* Buy Now Button */}
                      <Button
                        onClick={() => handleBuyNow(book)}
                        className="flex-1 bg-primary text-white hover:bg-primary/90 text-xs lg:text-sm font-semibold rounded-full py-2 lg:py-2.5 h-10 lg:h-11 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                      >
                        Buy Now
                      </Button>
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
          onClose={() => setIsBuyNowOpen(false)}
        />
      )}
    </>
  )
}

export default NewCollection
