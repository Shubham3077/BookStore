import BlogSection from "@/components/BlogSection"
import Categories from "@/components/Categories"
import DiscountBanner from "@/components/DiscountBanner"
import Footer from "@/components/Footer"
import HeroSection from "@/components/HeroSection"
import NewCollection from "@/components/NewCollection"
import Recommended from "@/components/Recommended"
import Testimonials from "@/components/Testimonial"
import WhyOurBooks from "@/components/WhyOurBooks"
import {
  getBooks,
  getBookById,
  getDiscount,
  getRecommendedBooks,
  getBlogPosts,
} from "@/lib/firestore"

export default async function Home() {
  const [heroBook, discount, books, recommended, blogs] = await Promise.all([
    getBookById("book-1"),
    getDiscount(),
    getBooks(),
    getRecommendedBooks(),
    getBlogPosts(),
  ])

  return (
    <>
      <HeroSection data={heroBook} />
      <NewCollection books={books} />
      <Categories/>
      <WhyOurBooks /> 
      <DiscountBanner data={discount} />
      {/* <Recommended books={recommended} /> */}
      {/* <BlogSection posts={blogs} /> */}
      <Testimonials/>
      <Footer />
    </>
  )
}
