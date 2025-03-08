import { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = 'Search for a food product...' }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          className={`bg-purple absolute inset-0 rounded-lg opacity-20 ${isFocused ? 'opacity-30' : 'opacity-0'} `}
          animate={{
            scale: isFocused ? 1.02 : 1,
            opacity: isFocused ? 0.15 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        <div className="relative flex items-center">
          <motion.input
            type="text"
            className="bg-current-line border-dark-700 text-foreground placeholder-comment focus:border-purple w-full rounded-lg border px-10 py-3 pl-12 transition-colors focus:outline-none"
            placeholder={placeholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
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
              className="bg-dark-800 text-comment hover:text-foreground absolute right-12 rounded-full p-1"
              onClick={() => setQuery('')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
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
            className="bg-purple text-foreground hover:bg-primary-600 active:bg-primary-700 ml-2 rounded-lg p-3 transition-colors"
            disabled={!query.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
      </form>
    </motion.div>
  );
};

export default SearchBar;
