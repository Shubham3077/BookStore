import BlogSection from "@/components/BlogSection"
import DiscountBanner from "@/components/DiscountBanner"
import Footer from "@/components/Footer"
import HeroSection from "@/components/HeroSection"
import NewCollection from "@/components/NewCollection"
import Recommended from "@/components/Recommended"
import {
  getBooks,
  getHero,
  getDiscount,
  getRecommendedBooks,
  getBlogPosts,
} from "@/lib/firestore"

export default async function Home() {
  const [hero, discount, books, recommended, blogs] = await Promise.all([
    getHero(),
    getDiscount(),
    getBooks(),
    getRecommendedBooks(),
    getBlogPosts(),
  ])

  return (
    <>
      <HeroSection data={hero} />
      <NewCollection books={books} />
      <DiscountBanner data={discount} />
      <Recommended books={recommended} />
      <BlogSection posts={blogs} />
      <Footer />
    </>
  )
}
