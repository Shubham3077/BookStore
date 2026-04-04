"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Book } from "@/lib/types";
import { searchBooks } from "@/lib/search.service";
import SearchResults from "./SearchResults";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>(null);

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Perform search with Firebase
   */
  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchBooks(term, 10);
      setResults(searchResults);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search books. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handle input change with debouncing (300ms)
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTerm = e.target.value;
      setSearchTerm(newTerm);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        performSearch(newTerm);
      }, 300);
    },
    [performSearch]
  );

  /**
   * Handle clear search
   */
  const handleClear = useCallback(() => {
    setSearchTerm("");
    setResults([]);
    setError(null);
    inputRef.current?.focus();
  }, []);

  /**
   * Handle close
   */
  const handleClose = useCallback(() => {
    setSearchTerm("");
    setResults([]);
    setError(null);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onClose();
  }, [onClose]);

  // Body overflow management
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={handleClose}
      />

      {/* Content */}
      <div className="relative z-10 bg-background border-b border-border shadow-lg animate-in slide-in-from-top-2 fade-in-0 duration-200">
        <div className="mx-auto max-w-[80%] py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-serif text-lg font-semibold text-foreground">
              The Reading Nook
            </span>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Close search"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-3 border border-foreground rounded-none px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Type to search by title, author, subject, keyword, ISBN..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-base outline-none font-sans"
              aria-label="Search for books"
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Results */}
          <div className="mt-6">
            <SearchResults
              results={results}
              loading={loading}
              error={error}
              searchTerm={searchTerm}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
