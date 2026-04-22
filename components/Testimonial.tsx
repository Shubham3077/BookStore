"use client"
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  name: string;
  handle: string;
  initials: string;
  review: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Clare Bamford",
    handle: "@clare.reads",
    initials: "CB",
    review: "I started picking up books from here on a whim, and now my evenings revolve around them. Each title feels personally chosen.",
    date: "22.03.2026",
  },
  {
    name: "Daniel Mercer",
    handle: "@daniel.m",
    initials: "DM",
    review: "The curation is unmatched. I've discovered authors I would have never found on my own — thoughtful, quiet, brilliant.",
    date: "14.04.2026",
  },
  {
    name: "Sophia Lin",
    handle: "@sophialin",
    initials: "SL",
    review: "From the packaging to the recommendations, every detail feels considered. It reminds me why I fell in love with reading.",
    date: "02.02.2026",
  },
  {
    name: "Marcus Hale",
    handle: "@m.hale",
    initials: "MH",
    review: "A bookstore that respects its readers. The selection is intelligent and the experience is genuinely calming.",
    date: "19.01.2026",
  },
  {
    name: "Elena Rossi",
    handle: "@elena.r",
    initials: "ER",
    review: "I've gifted books from here a dozen times and not once been wrong. There's a real point of view behind each shelf.",
    date: "08.04.2026",
  },
  {
    name: "James O'Connor",
    handle: "@joconnor",
    initials: "JO",
    review: "Their blog and collections complement each other beautifully. It's more than a store — it feels like a literary companion.",
    date: "27.03.2026",
  },
];

const Testimonials = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-secondary/40 py-20 lg:py-28">
      <div className="mx-auto max-w-[80%]">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl text-foreground leading-tight">
            Over 200+ <em className="font-medium">reviews</em>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>from our readers
          </h2>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: "none" }}
        >
          {testimonials.map((t, i) => (
            <article
              key={i}
              className="snap-start shrink-0 w-[85%] sm:w-[45%] md:w-[32%] lg:w-[23%] bg-card border border-border/60 rounded-lg p-6 flex flex-col justify-between min-h-[260px] shadow-[0_1px_3px_0_hsl(var(--foreground)/0.04)] transition-shadow hover:shadow-[0_4px_16px_0_hsl(var(--foreground)/0.08)]"
            >
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/15 text-foreground text-xs font-medium">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <div className="text-sm font-medium text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.handle}</div>
                  </div>
                </div>
                <p className="font-serif text-[15px] leading-relaxed text-foreground/90">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground mt-6">
                {t.date}
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={() => scroll("left")}
            aria-label="Previous testimonials"
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="h-[2px] w-24 bg-border relative overflow-hidden rounded-full">
            <div className="absolute left-0 top-0 h-full w-1/3 bg-foreground/60 rounded-full" />
          </div>
          <button
            onClick={() => scroll("right")}
            aria-label="Next testimonials"
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
