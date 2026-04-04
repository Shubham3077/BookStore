"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Book } from "@/lib/types";
import { highlightText } from "@/lib/search.service";

interface SearchResultCardProps {
  book: Book;
  searchTerm: string;
  onClose?: () => void;
}

const SearchResultCard = ({
  book,
  searchTerm,
  onClose,
}: SearchResultCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    onClose?.();
    router.push(`/product/${book.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="p-3 hover:bg-secondary/40 cursor-pointer transition-colors border-b border-border/40 last:border-b-0"
    >
      <div className="flex gap-3 items-start">
        {/* Book Cover */}
        <div className="relative w-12 h-16 shrink-0 bg-secondary rounded overflow-hidden">
          {book.cover ? (
            <Image
              src={book.cover}
              alt={book.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center text-xs text-muted-foreground">
              No img
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
            {highlightText(book.title, searchTerm)}
          </h4>
          <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
            by {highlightText(book.author, searchTerm)}
          </p>
          <p className="text-sm font-semibold text-primary">
            ₹{book.price.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
