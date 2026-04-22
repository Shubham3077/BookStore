"use-client"
import { BookText, Leaf, Landmark, Microscope, Lightbulb } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Knowledge & Facts",
    icon: BookText,
    description: "Expand your understanding of the world",
  },
  {
    id: 2,
    title: "Environment & Sustainability",
    icon: Leaf,
    description: "Read for a better, greener planet",
  },
  {
    id: 3,
    title: "Economy & Policy",
    icon: Landmark,
    description: "Navigate complex systems and ideas",
  },
  {
    id: 4,
    title: "Science & Technology",
    icon: Microscope,
    description: "Discover innovations shaping tomorrow",
  },
  {
    id: 5,
    title: "Thought & Inspiration",
    icon: Lightbulb,
    description: "Ignite creativity and reflection",
  },
];

const Categories = () => {
  return (
    <section className="py-16 lg:py-24 bg-primary">
      <div className="mx-auto max-w-[80%]">
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-14">
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-primary-foreground mb-3">
            Explore by Category
          </h2>
          <p className="text-primary-foreground/80 text-sm lg:text-base max-w-md mx-auto">
            Discover books curated across subjects that matter
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isLastOdd =
              index === categories.length - 1 && categories.length % 2 !== 0;

            return (
              <button
                key={category.id}
                className={`
                  group flex items-center gap-4 lg:gap-5
                  bg-secondary rounded-xl p-4 lg:p-5
                  border border-border/40
                  shadow-sm
                  transition-all duration-300 ease-out
                  hover:shadow-lg hover:-translate-y-0.5
                  hover:border-primary/30 hover:bg-secondary/95
                  active:scale-[0.99]
                  text-left cursor-pointer w-full
                  focus:outline-none focus:ring-2 focus:ring-primary-foreground/40 focus:ring-offset-2 focus:ring-offset-primary
                  ${isLastOdd ? "md:col-span-2 md:max-w-[calc(50%-0.625rem)] md:mx-auto" : ""}
                `}
              >
                {/* Left: Circular Icon */}
                <div
                  className="
                    flex-shrink-0 inline-flex items-center justify-center
                    w-14 h-14 lg:w-16 lg:h-16 rounded-full
                    bg-background/70 text-primary
                    group-hover:bg-primary group-hover:text-primary-foreground
                    transition-colors duration-300
                  "
                >
                  <Icon className="h-6 w-6 lg:h-7 lg:w-7" strokeWidth={1.5} />
                </div>

                {/* Right: Text Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-base lg:text-lg font-semibold text-foreground mb-1 leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed line-clamp-1">
                    {category.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
