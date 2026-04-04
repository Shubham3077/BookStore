import {
  collection,
  getDocs,
  doc,
  getDoc,
  type DocumentData,
} from "firebase/firestore"
import { db } from "./firebase"

export type Book = {
  id: string
  title: string
  author: string
  authorDescription?: string
  bookDescription?: string
  bookDetails?: {
    dimensions: string
    pages: number
    publisher: string
  }
  price: number
  cover: string
  badge: string | null
  order?: number
  rating?: number
  review?: string
}

export type Hero = {
  bookId: string
  id: string
  title: string
  author: string
  cover: string
  ctaText: string
  ctaLink: string
}

export type Discount = {
  id: string
  title: string
  description: string
  ctaText: string
  ctaLink: string
}

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  date: string
  image: string
  link: string
}

const toData = (id: string, data: DocumentData) => ({ id, ...data })

export async function getBooks(): Promise<Book[]> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return []
  try {
    const snap = await getDocs(collection(db, "books"))
    return snap.docs
      .map((d) => toData(d.id, d.data()) as Book & { order?: number })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  } catch {
    return []
  }
}

export async function getHero(): Promise<Hero | null> {
  console.log("getHero")
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !db) return null
  try {
    const snap = await getDoc(doc(db, "config", "hero"))
    if (!snap.exists()) return null
    return toData(snap.id, snap.data()) as Hero
  } catch (error) {
    console.error(error);
    return null
  }
}

export async function getDiscount(): Promise<Discount | null> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !db) return null
  try {
    const snap = await getDoc(doc(db, "config", "discount"))
    if (!snap.exists()) return null
    return toData(snap.id, snap.data()) as Discount
  } catch {
    return null
  }
}

export async function getRecommendedBooks(): Promise<Book[]> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return []
  try {
    const snap = await getDocs(collection(db, "recommended"))
    return snap.docs
      .map((d) => toData(d.id, d.data()) as Book & { order?: number })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, 4)
  } catch {
    return []
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return []
  try {
    const snap = await getDocs(collection(db, "blogs"))
    return snap.docs
      .map((d) => toData(d.id, d.data()) as BlogPost)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3)
  } catch {
    return []
  }
}

export async function getBookById(id: string): Promise<Book | null> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !db) return null
  try {
    const snap = await getDoc(doc(db, "books", id))
    if (!snap.exists()) return null
    return toData(snap.id, snap.data()) as Book
  } catch (error) {
    console.error("Error fetching book:", error)
    return null
  }
}
