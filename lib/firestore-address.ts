import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc,
  type DocumentData,
} from "firebase/firestore"
import { db } from "./firebase"
import type { UserAddress } from "./types"

const toData = (id: string, data: DocumentData) => ({ id, ...data })

/**
 * Get user's saved addresses (max 2 most recent)
 */
export async function getUserAddresses(userId: string): Promise<UserAddress[]> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return []
  try {
    const q = query(
      collection(db, "users", userId, "addresses"),
      orderBy("createdAt", "desc"),
      limit(2)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => toData(d.id, d.data()) as UserAddress)
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return []
  }
}

/**
 * Add a new address for user
 */
export async function addUserAddress(
  userId: string,
  address: Omit<UserAddress, "id" | "createdAt" | "updatedAt">
): Promise<UserAddress | null> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return null
  try {
    const now = new Date().toISOString()
    const docRef = await addDoc(collection(db, "users", userId, "addresses"), {
      ...address,
      createdAt: now,
      updatedAt: now,
    })
    return {
      id: docRef.id,
      ...address,
      createdAt: now,
      updatedAt: now,
    } as UserAddress
  } catch (error) {
    console.error("Error adding address:", error)
    return null
  }
}

/**
 * Update an existing address
 */
export async function updateUserAddress(
  userId: string,
  addressId: string,
  updates: Partial<UserAddress>
): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return false
  try {
    const addressRef = doc(db, "users", userId, "addresses", addressId)
    await updateDoc(addressRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    return true
  } catch (error) {
    console.error("Error updating address:", error)
    return false
  }
}

/**
 * Delete an address
 */
export async function deleteUserAddress(userId: string, addressId: string): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return false
  try {
    await deleteDoc(doc(db, "users", userId, "addresses", addressId))
    return true
  } catch (error) {
    console.error("Error deleting address:", error)
    return false
  }
}
