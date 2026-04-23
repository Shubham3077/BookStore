"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import Footer from "@/components/Footer"
import {
  getBooksByCategory,
  getCategoryById,
  type Book,
  type Category,
} from "@/lib/firestore"

type PageState = "loading" | "ready" | "error"

export default function CategoryCollectionsPage() {
  const params = useParams<{ id: string }>()
  const selectedCategoryId = useMemo(() => Number(params.id), [params.id])

  const [state, setState] = useState<PageState>("loading")
  const [books, setBooks] = useState<Book[]>([])
  const [category, setCategory] = useState<Category | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadCategoryBooks() {
      if (!Number.isFinite(selectedCategoryId)) {
        setState("error")
        return
      }

      setState("loading")

      try {
        const [fetchedCategory, filteredBooks] = await Promise.all([
          getCategoryById(selectedCategoryId),
          getBooksByCategory(selectedCategoryId),
        ])

        if (cancelled) return

        setCategory(fetchedCategory)
        setBooks(filteredBooks)
        setState("ready")
      } catch {
        if (cancelled) return
        setState("error")
      }
    }

    loadCategoryBooks()

    return () => {
      cancelled = true
    }
  }, [selectedCategoryId])

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-[80%]">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to collections
            </Link>

            <h1 className="text-3xl lg:text-5xl font-serif font-semibold text-foreground text-center mb-3">
              {category?.title ?? "Category"}
            </h1>
            {category?.description ? (
              <p className="text-center text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                {category.description}
              </p>
            ) : null}
          </div>
        </section>

        <section className="pb-20 lg:pb-28">
          <div className="mx-auto max-w-[80%]">
            {state === "loading" ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                Loading books...
              </div>
            ) : null}

            {state === "error" ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-foreground font-medium mb-2">
                  We couldn&apos;t load this category right now.
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  Please try again in a moment.
                </p>
                <Link
                  href="/collections"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
                >
                  Browse all books
                </Link>
              </div>
            ) : null}

            {state === "ready" && books.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-foreground font-medium mb-2">
                  No books found in this category yet.
                </p>
                <p className="text-muted-foreground text-sm">
                  Check back soon or explore other collections.
                </p>
              </div>
            ) : null}

            {state === "ready" && books.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {books.map((book) => (
                  <Link
                    key={book.id}
                    href={`/product/${book.id}`}
                    className="group relative h-full bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
                  >
                    <div className="relative aspect-3/4 overflow-hidden bg-muted">
                      <Image
                        src={book.cover}
                        alt={`Cover of ${book.title}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        width={300}
                        height={400}
                      />
                    </div>

                    <div className="p-4 lg:p-5 flex flex-col flex-1">
                      <h3 className="font-serif font-semibold text-foreground text-base lg:text-lg mb-1.5 leading-snug line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                        {book.author}
                      </p>
                      <p className="text-lg font-semibold text-foreground mt-auto">
                        ₹{book.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
