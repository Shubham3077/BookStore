import { Users, BookMarked, Lightbulb } from "lucide-react"

interface WhoShouldReadSectionProps {
  items?: string[]
  loading?: boolean
}

const defaultIcons = [Users, BookMarked, Lightbulb]

export default function WhoShouldReadSection({
  items = [],
  loading = false,
}: WhoShouldReadSectionProps) {
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Who Should Read This
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Designed for readers who want historical perspective, practical context, and a more confident grasp of a timeless public question.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-border/70 bg-secondary/25 p-5 h-40 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="space-y-5">
      <div className="max-w-2xl space-y-2">
        <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Who Should Read This
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          Designed for readers who want historical perspective, practical context, and a more confident grasp of a timeless public question.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => {
          const Icon = defaultIcons[index % defaultIcons.length]
          return (
            <article
              key={index}
              className="rounded-lg border border-border/70 bg-secondary/25 p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-secondary/35"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                {item}
              </h3>
            </article>
          )
        })}
      </div>
    </div>
  )
}
