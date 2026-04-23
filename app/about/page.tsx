import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  BookOpenText,
  Compass,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const values = [
  {
    title: "Curated",
    description:
      "Every title earns its place through literary value, relevance, and craft.",
    icon: BookOpenText,
  },
  {
    title: "Thoughtful",
    description:
      "We build collections for slow reading, study, gifting, and lasting ownership.",
    icon: Compass,
  },
  {
    title: "Trusted",
    description:
      "Careful selection, dependable delivery, and a consistently refined experience.",
    icon: ShieldCheck,
  },
  {
    title: "Discoverable",
    description:
      "From timeless classics to overlooked gems, we help readers find what matters.",
    icon: Sparkles,
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-16 lg:py-24">
        <section className="mx-auto w-[80%] max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              About Us
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-foreground lg:text-6xl">
              A bookstore shaped by curiosity, care, and enduring writing.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground lg:text-lg">
              The Reading Nook is a curated online bookstore for readers who value quality,
              craft, and the quiet pleasure of discovering books that stay with them.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-16">
            <div className="mx-auto grid max-w-5xl gap-5 rounded-[1.75rem] bg-primary px-6 py-8 shadow-sm sm:grid-cols-2 lg:grid-cols-4 lg:px-10 lg:py-10">
              {values.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="flex items-start gap-4 rounded-xl bg-background/10 px-4 py-4 text-primary-foreground transition-all duration-300 hover:bg-background/15 hover:-translate-y-0.5"
                >
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-foreground/25 bg-background/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-primary-foreground/85">
                      {description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mx-auto -mt-3 rounded-[2rem] bg-card px-6 pb-8 pt-16 shadow-sm lg:px-12 lg:pb-12 lg:pt-20">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
                <article className="border-b border-border pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-12">
                  <div className="flex items-center gap-3 text-foreground">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                      <Target className="h-5 w-5" />
                    </div>
                    <h2 className="text-3xl font-semibold">Our vision</h2>
                  </div>
                  <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                    To become a trusted home for readers seeking books with depth, beauty, and
                    lasting intellectual value—whether for study, reflection, or personal
                    collections.
                  </p>
                </article>

                <article>
                  <div className="flex items-center gap-3 text-foreground">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                      <Compass className="h-5 w-5" />
                    </div>
                    <h2 className="text-3xl font-semibold">Our mission</h2>
                  </div>
                  <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                    We handpick literature, ideas, and essential contemporary works with an
                    editorial eye—making it easier to discover books worth owning, returning to,
                    and recommending.
                  </p>
                </article>
              </div>

              <div className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-3">
                <div>
                  <p className="text-3xl font-semibold text-foreground">Carefully chosen</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    No clutter, just books selected for substance and staying power.
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-foreground">Reader-first</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Clear collections, thoughtful recommendations, and a calm browsing experience.
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-foreground">Built to last</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    A bookstore for meaningful gifts, personal libraries, and lifelong reading.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
