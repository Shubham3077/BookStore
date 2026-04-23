import { Lightbulb, BookOpen } from "lucide-react"

interface WhatYouWillLearnSectionProps {
  learningOutcomes?: string[]
  learningHighlights?: string[]
  loading?: boolean
}

export default function WhatYouWillLearnSection({
  learningOutcomes = [],
  learningHighlights = [],
  loading = false,
}: WhatYouWillLearnSectionProps) {
  if (loading) {
    return (
      <div className="rounded-[1.75rem] bg-primary px-5 py-6 shadow-sm md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.75fr)] lg:items-start">
          <div className="space-y-5 animate-pulse">
            <div className="h-40 bg-background/35 rounded-xl" />
          </div>
          <div className="animate-pulse">
            <div className="h-48 bg-background/35 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!learningOutcomes || learningOutcomes.length === 0) {
    return null
  }

  return (
    <div className="rounded-[1.75rem] bg-primary px-5 py-6 shadow-sm md:px-8 md:py-8 lg:px-10 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.75fr)] lg:items-start">
        <div className="space-y-5">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/65">
              Reader outcomes
            </p>
            <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl lg:text-[2.5rem] lg:leading-tight">
              What You Will Learn
            </h2>
            <p className="text-sm leading-relaxed text-foreground/75 md:text-base">
              Each chapter helps readers connect historical ideas to current conversations with sharper clarity.
            </p>
          </div>

          <div className="space-y-3">
            {learningOutcomes.map((item, index) => (
              <article
                key={index}
                className="group flex items-start gap-4 rounded-xl border border-foreground/10 bg-background/35 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-background/45 hover:shadow-md md:p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background/55 text-primary transition-colors duration-300 group-hover:bg-background/80">
                  <Lightbulb className="h-5 w-5" />
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/45">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="text-base leading-relaxed text-foreground md:text-sm">
                    {item}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {learningHighlights && learningHighlights.length > 0 && (
          <aside className="rounded-xl border border-foreground/10 bg-background/25 p-6 shadow-sm lg:sticky lg:top-28">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background/60 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-semibold leading-tight text-foreground">
                    A concise intellectual companion
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/70 md:text-base">
                    Ideal if you want rigorous insight without losing readability.
                  </p>
                </div>

                <div className="space-y-3 border-t border-foreground/10 pt-4">
                  {learningHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <p className="text-sm leading-relaxed text-foreground/75">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
