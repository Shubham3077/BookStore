/**
 * Seed Firestore with initial data.
 * Run: npm run db:seed
 *
 * Loads env from .env.local (create from .env.example)
 */
import { config } from "dotenv"
config({ path: ".env.local" })
import { initializeApp } from "firebase/app"
import { getFirestore, setDoc, doc, collection, writeBatch } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

async function seed() {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  // Hero config
  await setDoc(doc(db, "config", "hero"), {
    title: "The Silent Garden",
    author: "Elena Morales",
    cover: "/images/book-cover-1.jpg",
    ctaText: "Discover the book",
    ctaLink: "#",
  })

  // Discount config
  await setDoc(doc(db, "config", "discount"), {
    title: "Student Discount — Save 20%",
    description: "Verify your student status and enjoy exclusive pricing on every order.",
    ctaText: "Shop Now",
    ctaLink: "#",
  })

  const batch = writeBatch(db)

  // Books (New Collection)
  const books = [
    { title: "The Silent Garden", author: "Elena Morales", price: "$24.99", cover: "/images/book-cover-1.jpg", badge: "New" },
    { title: "Letters to Nowhere", author: "James Whitfield", price: "$19.99", cover: "/images/book-cover-2.jpg", badge: "Featured" },
    { title: "Verdant Reverie", author: "Ava Chen", price: "$21.50", cover: "/images/book-cover-3.jpg", badge: "New" },
    { title: "Midnight Folio", author: "Oscar Beaumont", price: "$28.00", cover: "/images/book-cover-4.jpg", badge: null },
    { title: "Midnight Dreams", author: "Papid Beaumont", price: "$24.00", cover: "/images/book-cover-3.jpg", badge: null },
  ]
  books.forEach((b, i) => {
    batch.set(doc(collection(db, "books"), `book-${i + 1}`), { ...b, order: i + 1 })
  })

  // Recommended
  const recommended = [
    { title: "The Silent Garden", author: "Elena Morales", rating: 5, review: "A beautifully written meditation on solitude and growth.", cover: "/images/book-cover-1.jpg" },
    { title: "Letters to Nowhere", author: "James Whitfield", rating: 4, review: "Deeply moving epistolary fiction that lingers long after.", cover: "/images/book-cover-2.jpg" },
    { title: "Verdant Reverie", author: "Ava Chen", rating: 5, review: "Lush prose and vivid imagery — an absolute gem.", cover: "/images/book-cover-3.jpg" },
    { title: "Midnight Folio", author: "Oscar Beaumont", rating: 4, review: "A masterclass in atmospheric storytelling.", cover: "/images/book-cover-4.jpg" },
  ]
  recommended.forEach((r, i) => {
    batch.set(doc(collection(db, "recommended"), `rec-${i + 1}`), { ...r, order: i + 1 })
  })

  // Blogs
  const blogs = [
    { title: "10 Books to Read Before Spring", excerpt: "Our editors share their top picks for the season — from literary fiction to thought-provoking essays.", date: "2026-02-15", image: "/images/blog-1.jpg", link: "#" },
    { title: "Building a Reading Habit That Sticks", excerpt: "Practical tips from avid readers on how to make reading a consistent part of your daily life.", date: "2026-02-08", image: "/images/blog-2.jpg", link: "#" },
    { title: "Why Independent Bookstores Matter", excerpt: "A love letter to the local bookshop and its irreplaceable role in our literary culture.", date: "2026-01-30", image: "/images/blog-3.jpg", link: "#" },
  ]
  blogs.forEach((b, i) => {
    batch.set(doc(collection(db, "blogs"), `blog-${i + 1}`), b)
  })

  await batch.commit()
  console.log("Firestore seeded successfully.")
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
