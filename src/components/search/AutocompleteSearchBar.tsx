import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, cx } from '../../utils/cn';
import { useSupabaseAutocomplete, AutocompleteSuggestion } from '../../hooks/useSupabaseSearch';
import { useProductDetails } from '../../hooks/useSupabaseSearch';
import ProductQuickView from '../product/ProductQuickView';

interface AutocompleteSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

const AutocompleteSearchBar = ({
  onSearch,
  placeholder = 'Search for a food product...',
  initialValue = '',
}: AutocompleteSearchBarProps) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get autocomplete suggestions
  const { data: suggestions = [], isLoading } = useSupabaseAutocomplete(query);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Arrow up/down
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!showSuggestions) {
        setShowSuggestions(true);
        return;
      }

      if (suggestions.length === 0) return;

      const direction = e.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = (highlightedIndex + direction + suggestions.length) % suggestions.length;
      setHighlightedIndex(nextIndex);
    }
    // Enter
    else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault();
        handleSuggestionSelection(suggestions[highlightedIndex]);
      } else if (query.trim()) {
        setShowSuggestions(false);
        onSearch(query.trim());
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      if (selectedProductId) {
        setSelectedProductId(null);
      } else {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelection = (suggestion: AutocompleteSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    setHighlightedIndex(-1);

    // If it's a product suggestion, show product details
    if (suggestion.type === 'product' && suggestion.productId) {
      setSelectedProductId(suggestion.productId);
    } else {
      // For other types, perform search
      onSearch(suggestion.text);
    }
  };

  // Get icon for suggestion type
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'product':
        return (
          <svg
            className="text-purple h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path
              d="M16 2V6M8 2V6M4 10H20M8 14H8.01M12 14H12.01M16 14H16.01M8 18H8.01M12 18H12.01M16 18H16.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'brand':
        return (
          <svg
            className="text-cyan h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 15L15 9M16 8C16 9.10457 15.1046 10 14 10C12.8954 10 12 9.10457 12 8C12 6.89543 12.8954 6 14 6C15.1046 6 16 6.89543 16 8ZM12 16C12 17.1046 11.1046 18 10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14C11.1046 14 12 14.8954 12 16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        );
      case 'ingredient':
        return (
          <svg
            className="text-green h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 11L12 6L17 11M12 18V10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Close product details view
  const closeProductDetails = () => {
    setSelectedProductId(null);
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div ref={inputContainerRef} className="relative flex-1">
          <motion.div 
            className={cx(
              "absolute inset-0 rounded-lg bg-purple",
              {
                "opacity-0": !isFocused,
              }
            )}
            animate={{ 
              scale: isFocused ? 1.0 : 1,
              opacity: isFocused ? 0.15 : 0
            }}
            transition={{ duration: 0.2 }}
          />

          <div className="relative flex items-center pr-1">
            <motion.input
              ref={inputRef}
              type="text"
              className={cn(
                "w-full rounded-lg border py-3 px-10 pl-12 transition-colors",
                "bg-current-line border-dark-700 text-foreground placeholder-comment",
                "focus:outline-none focus:border-purple"
              )}
              placeholder={placeholder}
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                if (e.target.value.length >= 2) {
                  setShowSuggestions(true);
                  setHighlightedIndex(-1);
                } else {
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => {
                setIsFocused(true);
                if (query.length >= 2) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-expanded={showSuggestions}
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-activedescendant={
                highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
              }
            />

            <motion.svg
              className="text-comment absolute left-4"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={{
                scale: isFocused ? 1.1 : 1,
                rotate: isFocused ? 5 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>

            {query && (
              <motion.button
                type="button"
                className="text-white hover:text-foreground bg-purple absolute right-16 rounded-full p-1"
                onClick={() => {
                  setQuery('');
                  setShowSuggestions(false);
                  setSelectedProductId(null);
                  inputRef.current?.focus();
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Clear search"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            )}

            <motion.button
              type="submit"
              className="bg-purple text-foreground hover:bg-primary-600 active:bg-primary-700 ml-2 rounded-lg p-3.5 transition-colors"
              disabled={!query.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Search"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </form>

      {/* Autocomplete Suggestions */}
      <AnimatePresence>
        {showSuggestions && query.length >= 2 && (
          <motion.div
            ref={suggestionsRef}
            id="search-suggestions"
            className="bg-dark-900 border-dark-800 absolute z-50 mt-1 w-full overflow-hidden rounded-lg border shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            role="listbox"
          >
            {isLoading ? (
              <div className="text-comment p-4 text-center">
                <motion.div
                  className="inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path
                      opacity="0.5"
                      d="M12 18V22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.2"
                      d="M4.93 4.93L7.76 7.76"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.6"
                      d="M16.24 16.24L19.07 19.07"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.3"
                      d="M2 12H6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.7"
                      d="M18 12H22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.4"
                      d="M4.93 19.07L7.76 16.24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.8"
                      d="M16.24 7.76L19.07 4.93"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
                <span className="ml-2">Loading suggestions...</span>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-comment p-4 text-center">
                <svg
                  className="mx-auto mb-2 h-10 w-10 opacity-60"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 7H11M7 10H13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="text-sm font-medium">No suggestions found for "{query}"</p>
                <p className="mt-1 text-xs">Try a different search term or press Enter to search</p>
              </div>
            ) : (
              <ul className="max-h-60 overflow-y-auto py-1">
                {suggestions.map((suggestion, index) => (
                  <motion.li
                    key={index}
                    id={`suggestion-${index}`}
                    className={cx(
                      "px-4 py-2 cursor-pointer transition-colors truncate flex items-center",
                      {
                        "bg-dark-800": highlightedIndex === index,
                        "hover:bg-dark-800/50": highlightedIndex !== index,
                        "cursor-pointer": suggestion.type === 'product'
                      }
                    )}
                    whileHover={{ x: 5 }}
                    onClick={() => handleSuggestionSelection(suggestion)}
                    role="option"
                    aria-selected={highlightedIndex === index}
                  >
                    <span className="mr-2">{getSuggestionIcon(suggestion.type)}</span>
                    <div className="flex-1">
                      <HighlightMatch text={suggestion.text} query={query} />
                      {suggestion.type === 'product' && (
                        <div className="text-comment mt-0.5 text-xs">
                          Click to view product details
                        </div>
                      )}
                    </div>
                    {suggestion.type === 'product' && (
                      <span className="text-purple text-sm">View</span>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Quick View - only render when productId exists */}
      {selectedProductId && (
        <ProductQuickView productId={selectedProductId} onClose={closeProductDetails} />
      )}
    </div>
  );
};

// Helper component to highlight matching parts of text
const HighlightMatch = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <span>{text}</span>;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return <span>{text}</span>;

  const beforeMatch = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const afterMatch = text.slice(index + query.length);

  return (
    <span>
      {beforeMatch}
      <span className="text-cyan font-bold">{match}</span>
      {afterMatch}
    </span>
  );
};

export default AutocompleteSearchBar;
