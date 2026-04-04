import {
  collection,
  addDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export type ContactData = {
  name: string
  email: string
  message: string
  userId?: string | null
}

export type ContactDocument = {
  id: string
  name: string
  email: string
  message: string
  userId: string | null
  createdAt: Timestamp
}

/**
 * Save contact form data to Firestore
 * @param data - Contact form data
 * @param userId - Current user ID (optional, null for guests)
 * @returns Promise with the document ID
 */
export async function saveContact(
  data: ContactData,
  userId?: string | null
): Promise<string> {
  try {
    const contactRef = collection(db, "contacts")
    const docRef = await addDoc(contactRef, {
      name: data.name,
      email: data.email,
      message: data.message,
      userId: userId || null,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error saving contact:", error)
    throw new Error("Failed to save contact. Please try again.")
  }
}
