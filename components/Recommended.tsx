import { Star, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Book } from "@/lib/firestore"

type Props = { books: Book[] }

const Recommended = ({ books }: Props) => {
  if (!books.length) return null

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[80%]">
        <div className="flex items-end justify-between mb-16">
          <h2 className="text-3xl lg:text-5xl font-serif font-semibold text-foreground">
            Recommended by Frequent Readers
          </h2>
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-200 shrink-0 group"
          >
            See Full Collection
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/product/${book.id}`}
              className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 block"
            >
              <div className="aspect-[3/4] overflow-hidden bg-(muted)">
                <Image
                  src={book.cover}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={300}
                  height={400}
                />
              </div>
              <div className="p-4 lg:p-5">
                <h3 className="font-serif font-semibold text-foreground text-sm lg:text-base mb-1 leading-snug">
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < (book.rating ?? 0) ? "fill-primary text-primary" : "text-border"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-2">
                  &quot;{book.review}&quot;
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-200 group"
          >
            See Full Collection
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Recommended
