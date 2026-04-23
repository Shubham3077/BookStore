"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface RecommendedBook {
  id: string
  title: string
  cover: string
  price: number
}

interface RecommendedBooksSectionProps {
  books?: RecommendedBook[]
  loading?: boolean
}

export default function RecommendedBooksSection({
  books = [],
  loading = false,
}: RecommendedBooksSectionProps) {
  const router = useRouter()

  const handleBookClick = (bookId: string) => {
    router.push(`/product/${bookId}`)
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
              Recommended Books
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Continue exploring adjacent ideas with a few thoughtfully paired titles.
            </p>
          </div>
        </div>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[78%] snap-start rounded-lg border border-border/70 bg-background/80 p-4 sm:min-w-[48%] lg:min-w-0 h-32 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!books || books.length === 0) {
    return null
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Recommended Books
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Continue exploring adjacent ideas with a few thoughtfully paired titles.
          </p>
        </div>
      </div>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
        {books.map((book) => (
          <article
            key={book.id}
            className="min-w-[78%] snap-start rounded-lg border border-border/70 bg-background/80 p-4 sm:min-w-[48%] lg:min-w-0 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-background/90 hover:shadow-md"
            onClick={() => handleBookClick(book.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleBookClick(book.id)
              }
            }}
          >
            <div className="flex gap-4">
              <div className="flex aspect-[3/4] w-24 shrink-0 items-center justify-center rounded-md bg-secondary/50 p-3">
                <Image
                  src={book.cover}
                  alt={`${book.title} book cover`}
                  className="h-full w-full object-contain"
                  width={96}
                  height={128}
                  loading="lazy"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <p className="font-serif text-lg font-semibold leading-tight text-foreground line-clamp-2">
                    {book.title}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">
                    ₹{book.price.toFixed(2)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg px-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBookClick(book.id)
                    }}
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
