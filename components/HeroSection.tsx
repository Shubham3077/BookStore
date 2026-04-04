import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Hero } from "@/lib/firestore"

type Props = { data: Hero | null }

const HeroSection = ({ data }: Props) => {
  if (!data) return null
  const href = data.id ? `/product/${data.id}` : data.ctaLink
  return (
    <Link href={href}>
      <section className="w-full bg-primary py-16 lg:py-24 cursor-pointer transition-opacity hover:opacity-95">
        <div className="mx-auto w-[80%] text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.15] mb-3">
            {data.title}
          </h1>
          <p className="text-base lg:text-lg text-foreground/60 mb-10 font-light tracking-wide">
            {data.author}
          </p>
          <div className="flex justify-center mb-10">
            <Image
              src={data.cover}
              alt={`Cover of ${data.title} by ${data.author}`}
              className="w-48 sm:w-56 lg:w-64 rounded-sm shadow-2xl hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3)] transition-shadow"
              loading="eager"
              width={400}
              height={400}
            />
          </div>
          <div className="inline-flex items-center gap-2 text-foreground/70 group">
            <span className="text-sm font-medium">{data.ctaText}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </section>
    </Link>
  )
}

export default HeroSection
