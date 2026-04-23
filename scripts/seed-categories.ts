/**
 * Seed Firestore categories collection.
 * Run: npx tsx scripts/seed-categories.ts
 */
import { config } from "dotenv"
config({ path: ".env.local" })

import { initializeApp } from "firebase/app"
import { collection, doc, getFirestore, setDoc } from "firebase/firestore"

interface Category {
  id: number
  title: string
  icon: string
  description: string
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const categories: Category[] = [
  {
    id: 1,
    title: "Knowledge & Facts",
    icon: "BookText",
    description: "Expand your understanding of the world",
  },
  {
    id: 2,
    title: "Environment & Sustainability",
    icon: "Leaf",
    description: "Read for a better, greener planet",
  },
  {
    id: 3,
    title: "Economy & Policy",
    icon: "Landmark",
    description: "Navigate complex systems and ideas",
  },
  {
    id: 4,
    title: "Science & Technology",
    icon: "Microscope",
    description: "Discover innovations shaping tomorrow",
  },
  {
    id: 5,
    title: "Thought & Inspiration",
    icon: "Lightbulb",
    description: "Ignite creativity and reflection",
  },
]

async function seedCategories() {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  await Promise.all(
    categories.map((category) =>
      setDoc(doc(collection(db, "categories"), `category-${category.id}`), category)
    )
  )

  console.log(`Seeded ${categories.length} categories in Firestore.`)
  process.exit(0)
}

seedCategories().catch((error) => {
  console.error("Failed to seed categories:", error)
  process.exit(1)
})
