'use client'
import { BookOpen, Shield, Users, Layers, Brain } from "lucide-react";

const features = [
  {
    id: 1,
    icon: BookOpen,
    heading: "Clarity Over Complexity",
    description: "Complex ideas explained with elegant simplicity.",
  },
  {
    id: 2,
    icon: Shield,
    heading: "Curated & Authentic",
    description: "Sourced from verified experts and trusted voices.",
  },
  {
    id: 3,
    icon: Users,
    heading: "For Every Reader",
    description: "Designed for students and lifelong learners alike.",
  },
  {
    id: 4,
    icon: Layers,
    heading: "Multi-Subject Depth",
    description: "Diverse topics, unified by quality and rigor.",
  },
  {
    id: 5,
    icon: Brain,
    heading: "Lasting Understanding",
    description: "Build knowledge that endures beyond the page.",
  },
];

const WhyOurBooks = () => {
  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="mx-auto max-w-[80%]">
        <h2 className="text-3xl lg:text-5xl font-serif font-semibold text-foreground text-center mb-16">
          Why Our Books
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            // Last row handling: center the last 2 items on desktop
            const isLastRow = index >= 3;
            return (
              <div
                key={feature.id}
                className={`
                  group bg-card rounded-lg p-6 lg:p-8 shadow-sm 
                  hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5
                  border border-border/50 hover:border-primary/20
                  ${isLastRow ? "lg:col-span-1 lg:last:col-start-2" : ""}
                `}
              >
                <div className="mb-4 lg:mb-5">
                  <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-serif font-semibold text-foreground text-lg lg:text-xl mb-2 leading-snug">
                  {feature.heading}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyOurBooks;
