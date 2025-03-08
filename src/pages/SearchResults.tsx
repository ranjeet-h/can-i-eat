import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductSearch } from '../hooks/useSearch';
import AutocompleteSearchBar from '../components/search/AutocompleteSearchBar';
import { Product, SearchParams } from '../services/api';
import { ProductPlaceholderSVG } from '../utils/placeholders';

// Dietary filter options
const dietaryOptions = [
  { id: 'vegan', label: 'Vegan', color: 'bg-green/10 text-green border-green/30' },
  { id: 'vegetarian', label: 'Vegetarian', color: 'bg-green/10 text-green border-green/30' },
  { id: 'glutenFree', label: 'Gluten-Free', color: 'bg-cyan/10 text-cyan border-cyan/30' },
  { id: 'dairyFree', label: 'Dairy-Free', color: 'bg-cyan/10 text-cyan border-cyan/30' },
];

// Category filter options
const categoryOptions = [
  { id: 'Snacks', label: 'Snacks', icon: '🍿' },
  { id: 'Beverages', label: 'Beverages', icon: '🥤' },
  { id: 'Dairy', label: 'Dairy', icon: '🥛' },
  { id: 'Breakfast', label: 'Breakfast', icon: '🥣' },
  { id: 'Ready to Eat', label: 'Ready to Eat', icon: '🍲' },
  { id: 'Chocolates', label: 'Chocolates', icon: '🍫' },
];

// Health score badge component
const HealthScoreBadge = ({ score }: { score: number }) => {
  let scoreClass = '';

  if (score >= 80) {
    scoreClass = 'bg-green text-dark-950';
  } else if (score >= 60) {
    scoreClass = 'bg-yellow text-dark-950';
  } else if (score >= 40) {
    scoreClass = 'bg-orange text-dark-950';
  } else {
    scoreClass = 'bg-red text-dark-950';
  }

  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-md ${scoreClass}`}
      title={`Health Score: ${score}/100`}
    >
      {score}
    </div>
  );
};

// Compatibility badges component
const CompatibilityBadges = ({ compatibility }: { compatibility: Record<string, boolean> }) => {
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {compatibility.vegan && (
        <span className="bg-green/20 text-green rounded px-1.5 py-0.5 text-xs font-medium">
          Vegan
        </span>
      )}
      {compatibility.vegetarian && (
        <span className="bg-green/20 text-green rounded px-1.5 py-0.5 text-xs font-medium">
          Vegetarian
        </span>
      )}
      {compatibility.glutenFree && (
        <span className="bg-cyan/20 text-cyan rounded px-1.5 py-0.5 text-xs font-medium">
          Gluten-Free
        </span>
      )}
      {compatibility.dairyFree && (
        <span className="bg-cyan/20 text-cyan rounded px-1.5 py-0.5 text-xs font-medium">
          Dairy-Free
        </span>
      )}
    </div>
  );
};

// Product card component
const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div
      className="bg-dark-900 border-dark-800 hover:border-purple/40 overflow-hidden rounded-lg border shadow-lg transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      layout
    >
      <div className="relative h-40 overflow-hidden">
        <div className="bg-dark-800 h-full w-full">
          <ProductPlaceholderSVG width={200} height={160} className="h-full w-full" />
        </div>
        <div className="absolute top-2 right-2">
          <HealthScoreBadge score={product.healthScore} />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <h3 className="truncate text-lg font-bold">{product.name}</h3>
          <p className="text-comment text-sm">{product.brand}</p>
        </div>
        <div className="mt-3 text-sm">
          <p className="text-comment mb-1 text-xs">Key Ingredients:</p>
          <p className="truncate">{product.ingredients.join(', ')}</p>
          <CompatibilityBadges compatibility={product.compatibility} />
        </div>
      </div>
    </motion.div>
  );
};

// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('...');
    }

    // Add pages in the range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    // Add last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-dark-900 border-dark-800 rounded-md border p-2 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous page"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="text-comment px-3 py-1">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
              currentPage === page
                ? 'bg-purple text-light-50'
                : 'bg-dark-900 border-dark-800 hover:bg-dark-800 border'
            } `}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-dark-900 border-dark-800 rounded-md border p-2 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next page"
      >
        <svg
          width="16"
          height="16"
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
      </button>
    </div>
  );
};

// Main SearchResults component
const SearchResults = () => {
  // URL parameters handling
  const getInitialSearchParams = (): SearchParams => {
    const urlParams = new URLSearchParams(window.location.search);

    const query = urlParams.get('query') || '';
    const category = urlParams.get('category') || undefined;
    const page = parseInt(urlParams.get('page') || '1', 10);

    const dietaryParams: Record<string, boolean> = {};
    dietaryOptions.forEach(option => {
      if (urlParams.get(option.id) === 'true') {
        dietaryParams[option.id] = true;
      }
    });

    return {
      query,
      category,
      page,
      dietary: Object.keys(dietaryParams).length > 0 ? dietaryParams : undefined,
      limit: 6,
    };
  };

  // State for search parameters
  const [searchParams, setSearchParams] = useState<SearchParams>(getInitialSearchParams);

  // Effect to update URL when search params change
  useEffect(() => {
    const urlParams = new URLSearchParams();

    if (searchParams.query) {
      urlParams.set('query', searchParams.query);
    }

    if (searchParams.category) {
      urlParams.set('category', searchParams.category);
    }

    if (searchParams.page && searchParams.page > 1) {
      urlParams.set('page', String(searchParams.page));
    }

    if (searchParams.dietary) {
      Object.entries(searchParams.dietary).forEach(([key, value]) => {
        if (value) {
          urlParams.set(key, 'true');
        }
      });
    }

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }, [searchParams]);

  // Fetch search results
  const { data, isPending, isError } = useProductSearch(searchParams);

  // Handle search from autocomplete
  const handleSearch = (query: string) => {
    setSearchParams(prev => ({ ...prev, query, page: 1 }));
  };

  // Handle category filter change
  const handleCategoryChange = (categoryId: string | undefined) => {
    setSearchParams(prev => ({
      ...prev,
      category: prev.category === categoryId ? undefined : categoryId,
      page: 1,
    }));
  };

  // Handle dietary filter change
  const handleDietaryChange = (optionId: string) => {
    setSearchParams(prev => {
      const currentDietary = prev.dietary || {};
      const updatedDietary = {
        ...currentDietary,
        [optionId]: !currentDietary[optionId as keyof typeof currentDietary],
      };

      // If filter is being turned off and it's the only active one, set dietary to undefined
      if (
        !updatedDietary[optionId as keyof typeof updatedDietary] &&
        Object.values(updatedDietary).filter(Boolean).length === 0
      ) {
        return { ...prev, dietary: undefined, page: 1 };
      }

      return { ...prev, dietary: updatedDietary, page: 1 };
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({
      query: searchParams.query,
      page: 1,
      limit: searchParams.limit,
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    searchParams.category ||
      (searchParams.dietary && Object.values(searchParams.dietary).some(Boolean))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto mb-8 max-w-3xl">
        <h1 className="mb-6 text-center text-3xl font-bold">Food Search</h1>
        <AutocompleteSearchBar
          onSearch={handleSearch}
          placeholder="Search for food products, brands, or ingredients..."
          initialValue={searchParams.query}
        />
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Filters sidebar */}
        <div className="w-full space-y-6 md:w-64">
          <div className="bg-dark-900 border-dark-800 rounded-lg border p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              {hasActiveFilters && (
                <button
                  className="text-comment hover:text-cyan text-sm transition-colors"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category filter */}
            <div className="mb-6">
              <h3 className="text-light-50/80 mb-2 font-medium">Categories</h3>
              <div className="space-y-2">
                {categoryOptions.map(category => (
                  <button
                    key={category.id}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-left transition-colors ${
                      searchParams.category === category.id
                        ? 'bg-dark-800 border-purple border-l-2'
                        : 'hover:bg-dark-800/50'
                    } `}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary filter */}
            <div>
              <h3 className="text-light-50/80 mb-2 font-medium">Dietary Preferences</h3>
              <div className="space-y-2">
                {dietaryOptions.map(option => (
                  <label key={option.id} className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="checkbox"
                      className="text-purple focus:ring-purple rounded"
                      checked={Boolean(
                        searchParams.dietary?.[option.id as keyof typeof searchParams.dietary]
                      )}
                      onChange={() => handleDietaryChange(option.id)}
                    />
                    <span className={`rounded px-2 py-1 text-sm ${option.color} `}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search results */}
        <div className="flex-1">
          <div className="bg-dark-900 border-dark-800 rounded-lg border p-4">
            {/* Results header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {searchParams.query ? `Results for "${searchParams.query}"` : 'All Products'}
              </h2>
              <div className="text-comment text-sm">
                {data?.total ? `${data.total} products found` : '\u00A0'}
              </div>
            </div>

            {/* Results content */}
            <AnimatePresence mode="wait">
              {isPending ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-12"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-2"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2V6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        opacity="0.3"
                        d="M12 18V22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        opacity="0.7"
                        d="M4.93 4.93L7.76 7.76"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        opacity="0.3"
                        d="M16.24 16.24L19.07 19.07"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        opacity="0.5"
                        d="M2 12H6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        opacity="0.3"
                        d="M18 12H22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        opacity="0.3"
                        d="M4.93 19.07L7.76 16.24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        opacity="0.6"
                        d="M16.24 7.76L19.07 4.93"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <span>Loading results...</span>
                </motion.div>
              ) : isError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-red py-12 text-center"
                >
                  <svg
                    className="mx-auto mb-4 h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mb-2 text-xl font-bold">Error Loading Results</h3>
                  <p>Something went wrong. Please try again later.</p>
                </motion.div>
              ) : data?.products.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-comment py-12 text-center"
                >
                  <svg
                    className="mx-auto mb-4 h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="mb-2 text-xl font-bold">No Products Found</h3>
                  <p>Try adjusting your search or filters to find what you're looking for.</p>
                  {hasActiveFilters && (
                    <button className="text-cyan mt-4 hover:underline" onClick={clearFilters}>
                      Clear all filters
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data.products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={data.page}
                    totalPages={data.totalPages}
                    onPageChange={handlePageChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
