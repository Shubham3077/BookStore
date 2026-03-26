"use client";

import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogImg1 from "@/assets/blog-1.jpg";
import blogImg2 from "@/assets/blog-2.jpg";
import blogImg3 from "@/assets/blog-3.jpg";
import Image from "next/image";

const posts = [
  { id: 1, image: blogImg1, category: "Recommendations", date: "February 15, 2026", title: "10 Books to Read Before Spring", excerpt: "Our editors share their top picks for the season — from literary fiction to thought-provoking essays that will keep you engaged." },
  { id: 2, image: blogImg2, category: "Reading Tips", date: "February 8, 2026", title: "Building a Reading Habit That Sticks", excerpt: "Practical tips from avid readers on how to make reading a consistent part of your daily life, no matter how busy you are." },
  { id: 3, image: blogImg3, category: "Culture", date: "January 30, 2026", title: "Why Independent Bookstores Matter", excerpt: "A love letter to the local bookshop and its irreplaceable role in our literary culture and community building." },
  { id: 4, image: blogImg1, category: "Lists", date: "January 22, 2026", title: "The Best Non-Fiction of 2025", excerpt: "From memoirs to investigative journalism, these are the non-fiction titles that defined the year and sparked important conversations." },
  { id: 5, image: blogImg2, category: "Guides", date: "January 15, 2026", title: "How to Start a Book Club", excerpt: "Everything you need to know to launch a thriving book club — from choosing titles to fostering meaningful discussions." },
  { id: 6, image: blogImg3, category: "Interviews", date: "January 8, 2026", title: "In Conversation with Maya Lin", excerpt: "We sit down with the acclaimed author to discuss her latest novel, creative process, and the future of literary fiction." },
];

const featuredPost = posts[0];
const remainingPosts = posts.slice(1);

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">

      <main>
        {/* Page Header */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-[80%]">
            <h1 className="text-4xl lg:text-6xl font-serif font-semibold text-foreground text-center mb-4">
              Our Blog
            </h1>
            <p className="text-center text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
              Stories, recommendations, and reflections from our community of readers and writers.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        <section className="pb-16 lg:pb-20">
          <div className="mx-auto max-w-[80%]">
            <article className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col justify-center p-6 lg:p-10 lg:pr-12">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                  {featuredPost.category}
                </span>
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                  {featuredPost.date}
                </p>
                <h2 className="font-serif font-semibold text-foreground text-2xl lg:text-3xl mb-4 leading-snug">
                  {featuredPost.title}
                </h2>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-6">
                  {featuredPost.excerpt}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-200 group/link"
                >
                  Read Full Article
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* All Posts Grid */}
        <section className="pb-20 lg:pb-28">
          <div className="mx-auto max-w-[80%]">
            <h2 className="text-2xl lg:text-3xl font-serif font-semibold text-foreground mb-10">
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 lg:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {post.date}
                      </p>
                    </div>
                    <h3 className="font-serif font-semibold text-foreground text-lg mb-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <a
                      href="#"
                      className="text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-200"
                    >
                      Read More →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
