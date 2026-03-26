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

  // Books (New Collection) - Updated with numeric prices
  const books = [
    {
      title: "The Essential Green Handbook",
      author: "Editorial Team",
      authorDescription: "Experts in sustainability, ESG, and climate studies.",
      badge: "New",
      bookDescription: "Covers climate change, biodiversity, ESG, and sustainability concepts in an accessible format.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 300, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/green-handbook.jpg",
      price: 900,
      order: 1,
    },
    {
      title: "The Mega Book of Facts",
      author: "Editorial Team",
      authorDescription: "Knowledge-focused editorial team for competitive exam preparation.",
      badge: "Popular",
      bookDescription: "A vast collection of facts covering history, geography, science, and general awareness.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 500, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/mega-facts.jpg",
      price: 1650,
      order: 2,
    },
    {
      title: "The Political Science Companion",
      author: "Editorial Team",
      authorDescription: "Specialists in political science and governance.",
      badge: "New",
      bookDescription: "A practical guide to political science concepts including constitution and international relations.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 350, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/political-science.jpg",
      price: 1050,
      order: 3,
    },
    {
      title: "A Basic Manual of Freight Forwarding",
      author: "Editorial Team",
      authorDescription: "Industry experts in logistics and supply chain.",
      badge: "Trending",
      bookDescription: "An introduction to freight forwarding, logistics, and international trade practices.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 280, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/freight.jpg",
      price: 950,
      order: 4,
    },
    {
      title: "Handbook of Economic Terminology",
      author: "Editorial Team",
      authorDescription: "Economics educators simplifying complex topics.",
      badge: "New",
      bookDescription: "Explains key economic, banking, and business terminology for beginners.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 250, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/economics.jpg",
      price: 700,
      order: 5,
    },
    {
      title: "Handbook on Union Budget",
      author: "Editorial Team",
      authorDescription: "Public finance experts.",
      badge: "Recommended",
      bookDescription: "Explains India's budget process, constitutional framework, and financial governance.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 220, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/budget.jpg",
      price: 400,
      order: 6,
    },
    {
      title: "Climate Change: A Human Development Perspective",
      author: "Editorial Team",
      authorDescription: "Environmental and sustainability researchers.",
      badge: "Hot",
      bookDescription: "Covers global warming, sustainability, and international climate initiatives.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 320, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/climate.jpg",
      price: 850,
      order: 7,
    },
    {
      title: "What If I Was a Bird?",
      author: "Darshita",
      authorDescription: "A young writer exploring imagination and philosophy.",
      badge: "Featured",
      bookDescription: "A reflective journey exploring life, emotions, and societal thoughts.",
      bookDetails: { dimensions: "5 x 8 inches", pages: 180, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/bird.jpg",
      price: 550,
      order: 8,
    },
    {
      title: "A Lexicon of Contemporary Existential Issues",
      author: "Editorial Team",
      authorDescription: "Experts in global issues, AI, and sustainability.",
      badge: "New",
      bookDescription: "A glossary of modern topics including AI, climate change, and cryptocurrency.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 400, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/lexicon.jpg",
      price: 1150,
      order: 9,
    },
    {
      title: "Handbook of Computer Science, AI, Cryptocurrency & Industry 4.0",
      author: "Editorial Team",
      authorDescription: "Technology educators and researchers.",
      badge: "Trending",
      bookDescription: "Covers computer science, AI, blockchain, and quantum technologies.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 420, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/ai.jpg",
      price: 900,
      order: 10,
    },
    {
      title: "Sustainable Development: A Human Development Perspective",
      author: "Editorial Team",
      authorDescription: "Experts in sustainability and global development.",
      badge: "Recommended",
      bookDescription: "Explores sustainability frameworks, SDGs, and global development strategies.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 300, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/sustainable.jpg",
      price: 950,
      order: 11,
    },
    {
      title: "Handbook of Biological Science and Genetics",
      author: "Editorial Team",
      authorDescription: "Researchers in biology and genetics.",
      badge: "New",
      bookDescription: "Covers biological sciences, genetics, and modern scientific developments.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 280, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/biology.jpg",
      price: 600,
      order: 12,
    },
    {
      title: "A Book of Quiz & Quote",
      author: "Editorial Team",
      authorDescription: "Content creators for knowledge and inspiration.",
      badge: "Fun",
      bookDescription: "A collection of quizzes and quotes for learning and entertainment.",
      bookDetails: { dimensions: "5 x 8 inches", pages: 200, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/quiz.jpg",
      price: 900,
      order: 13,
    },
    {
      title: "Daily Inspirations: A Tapestry of Wisdom",
      author: "Editorial Team",
      authorDescription: "Curators of motivational and inspirational content.",
      badge: "Popular",
      bookDescription: "A collection of quotes offering motivation, clarity, and wisdom.",
      bookDetails: { dimensions: "5 x 8 inches", pages: 220, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/wisdom1.jpg",
      price: 500,
      order: 14,
    },
    {
      title: "Echoes of Insight: A Diverse Collection of Wisdom",
      author: "Editorial Team",
      authorDescription: "Writers compiling philosophical and societal insights.",
      badge: "New",
      bookDescription: "A curated collection of quotes on life, society, and human experience.",
      bookDetails: { dimensions: "5 x 8 inches", pages: 220, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/wisdom2.jpg",
      price: 500,
      order: 15,
    },
    {
      title: "Reflections on Existence: A Journey Through Life",
      author: "Editorial Team",
      authorDescription: "Philosophical writers and thinkers.",
      badge: "New",
      bookDescription: "Explores life, innovation, society, and human nature through curated quotes.",
      bookDetails: { dimensions: "5 x 8 inches", pages: 220, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/wisdom3.jpg",
      price: 500,
      order: 16,
    },
    {
      title: "An Introduction to Women Nobel Laureates",
      author: "Editorial Team",
      authorDescription: "Researchers in global history and achievements.",
      badge: "Upcoming",
      bookDescription: "Profiles women Nobel laureates across different fields.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 300, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/nobel-women.jpg",
      price: 900,
      order: 17,
    },
    {
      title: "An Introduction to Chemistry Nobel Laureates",
      author: "Editorial Team",
      authorDescription: "Science historians and researchers.",
      badge: "Upcoming",
      bookDescription: "Covers Nobel Prize winners in chemistry and their contributions.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 400, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/nobel-chem.jpg",
      price: 2850,
      order: 18,
    },
    {
      title: "An Introduction to Physics Nobel Laureates",
      author: "Editorial Team",
      authorDescription: "Physics educators and historians.",
      badge: "Upcoming",
      bookDescription: "Highlights achievements of Nobel laureates in physics.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 400, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/nobel-physics.jpg",
      price: 2850,
      order: 19,
    },
    {
      title: "An Introduction to Peace Nobel Laureates",
      author: "Editorial Team",
      authorDescription: "Experts in global peace and international relations.",
      badge: "Upcoming",
      bookDescription: "Documents Nobel Peace Prize winners and their contributions.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 400, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/nobel-peace.jpg",
      price: 2850,
      order: 20,
    },
    {
      title: "An Introduction to Literature Nobel Laureates",
      author: "Editorial Team",
      authorDescription: "Literature scholars and researchers.",
      badge: "Upcoming",
      bookDescription: "Explores Nobel laureates in literature and their works.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 350, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/nobel-literature.jpg",
      price: 1900,
      order: 21,
    },
    {
      title: "An Introduction to Economic Science Nobel Laureates",
      author: "Editorial Team",
      authorDescription: "Economics researchers and analysts.",
      badge: "Upcoming",
      bookDescription: "Covers Nobel laureates in economics and their theories.",
      bookDetails: { dimensions: "6 x 9 inches", pages: 350, publisher: "Mudita Learning and Knowledge Pvt. Ltd." },
      cover: "/images/nobel-economics.jpg",
      price: 1450,
      order: 22,
    },
  ]
  books.forEach((b) => {
    batch.set(doc(collection(db, "books"), `book-${b.order}`), b)
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
