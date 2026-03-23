import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Discount } from "@/lib/firestore"

type Props = { data: Discount | null }

const DiscountBanner = ({ data }: Props) => {
  if (!data) return null
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[80%]">
        <div className="bg-primary/10 border border-primary/20 rounded-xl px-8 py-12 lg:px-16 lg:py-16 text-center shadow-sm">
        <h2 className="text-3xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            {data.title}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 font-light max-w-lg mx-auto">
            {data.description}
          </p>
          <a href={data.ctaLink}>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary-hover px-10 py-6 text-base font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              {data.ctaText}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}

export default DiscountBanner
