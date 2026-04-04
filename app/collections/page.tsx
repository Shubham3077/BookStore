import { ShoppingBag } from "lucide-react"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getBooks } from "@/lib/firestore"
import { Badge } from "@/components/ui/badge"
import type { Book } from "@/lib/firestore"
import Link from "next/link"

export default async function Collections() {
  const books = await getBooks()

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Page Header */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-[80%]">
            <h1 className="text-4xl lg:text-6xl font-serif font-semibold text-foreground text-center mb-4">
              Our Collections
            </h1>
            <p className="text-center text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore our curated selection of books across all genres and categories.
            </p>
          </div>
        </section>

        {/* Books Grid */}
        <section className="pb-20 lg:pb-28">
          <div className="mx-auto max-w-[80%]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {books.map((book: Book) => (
                <Link
                  key={book.id}
                  href={`/product/${book.id}`}
                  className="group relative h-full bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
                >
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
                    <h3 className="font-serif font-semibold text-foreground text-base lg:text-lg mb-1.5 leading-snug line-clamp-2">
                      {book.title}
                    </h3>

                    {/* Author */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{book.author}</p>

                    {/* Price */}
                    <p className="text-lg font-semibold text-foreground mb-5">₹{book.price}</p>

                    {/* Button Container - Spacer to push to bottom */}
                    <div className="flex gap-2 mt-auto pointer-events-none">
                      {/* Details Button */}
                      <div className="flex-1 h-10 lg:h-11 rounded-full border border-border text-foreground font-medium text-xs lg:text-sm transition-all duration-200 hover:bg-muted flex items-center justify-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Details
                      </div>

                      {/* Buy Now Button */}
                      <div className="flex-1 h-10 lg:h-11 rounded-full bg-primary text-primary-foreground font-semibold text-xs lg:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
                        Buy Now
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
