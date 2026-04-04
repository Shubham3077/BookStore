"use client";

import { Book } from "@/lib/types";
import SearchResultCard from "./SearchResultCard";
import { AlertCircle, BookOpen } from "lucide-react";

interface SearchResultsProps {
  results: Book[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  onClose?: () => void;
}

const SearchResults = ({
  results,
  loading,
  error,
  searchTerm,
  onClose,
}: SearchResultsProps) => {
  // Empty search
  if (!searchTerm.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <BookOpen className="w-10 h-10 text-muted-foreground/40 mb-2" />
        <p className="text-xs text-muted-foreground">
          Start typing to search for books
        </p>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="space-y-2 py-4">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className="flex gap-3 p-3 rounded bg-secondary/20 animate-pulse"
          >
            <div className="w-12 h-16 rounded bg-secondary/40 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-secondary/40 rounded w-3/4" />
              <div className="h-2 bg-secondary/40 rounded w-1/2" />
              <div className="h-3 bg-secondary/40 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <AlertCircle className="w-10 h-10 text-destructive mb-2" />
        <p className="text-sm text-destructive font-medium">{error}</p>
      </div>
    );
  }

  // No results
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <BookOpen className="w-10 h-10 text-muted-foreground/40 mb-2" />
        <p className="text-sm font-medium text-foreground mb-1">
          No books found
        </p>
        <p className="text-xs text-muted-foreground">
          Currently this book is not available, but you can keep looking for
          other books
        </p>
      </div>
    );
  }

  // Results found
  return (
    <div className="max-h-[500px] overflow-y-auto">
      <p className="text-xs text-muted-foreground px-3 py-2 sticky top-0 bg-background/95 backdrop-blur-sm">
        Found {results.length} result{results.length !== 1 ? "s" : ""}
      </p>
      {results.map((book) => (
        <SearchResultCard
          key={book.id}
          book={book}
          searchTerm={searchTerm}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default SearchResults;
