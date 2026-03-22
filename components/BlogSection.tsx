import { ArrowRight } from "lucide-react"
import Image from "next/image"
import type { BlogPost } from "@/lib/firestore"

type Props = { posts: BlogPost[] }

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

const BlogSection = ({ posts }: Props) => {
  if (!posts.length) return null

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[80%]">
        <h2 className="text-3xl lg:text-5xl font-serif font-semibold text-foreground text-center mb-16">
          Latest from Our Blog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <Image
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={400}
                  height={250}
                />
              </div>
              <div className="p-5 lg:p-6">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                  {formatDate(post.date)}
                </p>
                <h3 className="font-serif font-semibold text-foreground text-lg mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                <a
                  href={post.link}
                  className="text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-200"
                >
                  Read More →
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-14 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-base font-medium text-primary hover:text-primary-hover transition-colors duration-200 group"
          >
            Explore All Articles
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
