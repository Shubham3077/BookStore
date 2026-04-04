import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { Book } from "./types";

/**
 * Search books by title or author
 * Case-insensitive, partial matching
 */
export const searchBooks = async (
  searchTerm: string,
  limit: number = 10
): Promise<Book[]> => {
  if (!searchTerm.trim() || !db) {
    return [];
  }

  try {
    const snapshot = await getDocs(collection(db, "books"));
    const searchLower = searchTerm.toLowerCase();

    const results = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Book))
      .filter((book) => {
        const titleMatch = book.title.toLowerCase().includes(searchLower);
        const authorMatch = book.author.toLowerCase().includes(searchLower);
        return titleMatch || authorMatch;
      })
      .slice(0, limit);

    return results;
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
};

/**
 * Highlight matching text in results
 */
export const highlightText = (
  text: string,
  searchTerm: string
): React.ReactNode[] => {
  if (!searchTerm.trim()) return [text];

  const parts: React.ReactNode[] = [];
  const regex = new RegExp(`(${searchTerm})`, "gi");
  const split = text.split(regex);

  split.forEach((part, idx) => {
    if (regex.test(part)) {
      parts.push(
        <span key={idx} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      );
    } else {
      parts.push(part);
    }
  });

  return parts;
};
