import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AutocompleteSearchBar from '../components/search/AutocompleteSearchBar';
import {
  useTrendingProducts,
  useCategories,
  useHealthInsightsProducts,
  useRecentlyViewedProducts,
} from '../hooks/useHomeData';
import { addToRecentlyViewed } from '../utils/recentlyViewed';
import './Home.css';

// Type for category used in UI
interface CategoryUI {
  id: number;
  name: string;
  icon: string;
  count: number;
  color: string;
}

// Map categorical colors to ensure consistent UI
const getCategoryColor = (index: number): string => {
  const colors = [
    'text-orange border-orange/30 hover:border-orange/60',
    'text-cyan border-cyan/30 hover:border-cyan/60',
    'text-light-50 border-light-50/30 hover:border-light-50/60',
    'text-yellow border-yellow/30 hover:border-yellow/60',
    'text-green border-green/30 hover:border-green/60',
    'text-purple border-purple/30 hover:border-purple/60',
    'text-pink border-pink/30 hover:border-pink/60',
    'text-red border-red/30 hover:border-red/60',
  ];

  return colors[index % colors.length];
};

// Mock featured insights (will be replaced with real data)
const featuredInsights = [
  {
    id: 1,
    title: 'Benefits of Sugar-Free Alternatives',
    excerpt:
      'Discover how sugar substitutes can help reduce calorie intake without sacrificing sweetness.',
    image: '🧪',
  },
  {
    id: 2,
    title: 'Understanding Food Additives',
    excerpt: 'Learn about common food additives, their purposes, and potential health impacts.',
    image: '🔬',
  },
  {
    id: 3,
    title: 'Plant-Based Protein Sources',
    excerpt: 'Explore non-animal protein options that provide all the essential amino acids.',
    image: '🌱',
  },
];

// Dietary compatibility badges
const CompatibilityBadges = ({ compatibility }: { compatibility: Record<string, boolean> }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {Object.entries(compatibility).map(
        ([key, value]) =>
          value && (
            <span key={key} className="bg-green/10 text-green rounded-full px-1.5 py-0.5 text-xs">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
          )
      )}
    </div>
  );
};

const HealthScoreBadge = ({ score }: { score: number }) => {
  let colorClass = 'bg-red text-red-800';
  if (score >= 80) {
    colorClass = 'bg-green text-green-800';
  } else if (score >= 60) {
    colorClass = 'bg-yellow text-yellow-800';
  } else if (score >= 40) {
    colorClass = 'bg-orange text-orange-800';
  }

  return (
    <div
      className={`${colorClass} inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold`}
    >
      {score}
    </div>
  );
};

// Helper function to get emoji for category
const getEmojiForCategory = (categoryName: string): string => {
  const emojiMap: Record<string, string> = {
    Snacks: '🍿',
    Beverages: '🥤',
    Dairy: '🥛',
    Cereals: '🥣',
    Bakery: '🍞',
    Condiments: '🧂',
    Spices: '🌶️',
    Sweets: '🍫',
    'Health Supplements': '💊',
    Superfoods: '🌱',
  };

  return emojiMap[categoryName] || '🍽️'; // Default emoji
};

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Fetch real data using our hooks
  const { data: trendingProducts } = useTrendingProducts();
  const { data: categoriesData } = useCategories();
  const { data: healthInsightsProducts } = useHealthInsightsProducts();
  const { data: recentlyViewed } = useRecentlyViewedProducts();

  // Process categories data for UI
  const foodCategories: CategoryUI[] = (categoriesData || []).map((category, index) => ({
    id: category.id,
    name: category.name,
    icon: getEmojiForCategory(category.name),
    count: typeof category.count === 'number' ? category.count : 0,
    color: getCategoryColor(index),
  }));

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Navigate to search results page with query parameter
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleCategoryClick = (categoryId: number) => {
    // If already selected, toggle it off
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);

      // Get the category name
      const category = foodCategories.find(cat => cat.id === categoryId);
      if (category) {
        // Navigate to search results with category filter
        navigate(`/search?category=${encodeURIComponent(category.name)}`);
      }
    }
  };

  // Handler for product card click
  const handleProductClick = (productId: string | undefined) => {
    if (productId) {
      // Add to recently viewed
      addToRecentlyViewed(productId);
      // Navigate to product details page
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Hero Section */}
      <section className="py-10 md:py-16">
        <motion.h1
          className="mb-4 text-center text-4xl font-bold md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Is it <span className="text-pink">safe</span> to <span className="text-cyan">eat</span>?
        </motion.h1>

        <motion.p
          className="text-comment mx-auto mb-8 max-w-2xl text-center text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Search any packaged food product in India to discover its ingredients, nutritional value,
          and health score at a glance.
        </motion.p>

        {/* Search Bar with AutoComplete */}
        <div className="relative mx-auto max-w-2xl">
          <AutocompleteSearchBar
            onSearch={handleSearch}
            placeholder="Search by product name, brand, or ingredients..."
          />
        </div>

        {/* Quick Category Filters */}
        <motion.div
          className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {foodCategories.map(category => (
            <motion.button
              key={category.id}
              className={`bg-dark-900 hover:bg-dark-800 rounded-md border px-4 py-2 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:transform ${category.color} ${selectedCategory === category.id ? 'ring-purple ring-2' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Trending Products Section */}
      <section className="py-8">
        <div className="container mx-auto">
          <h2 className="mb-6 text-2xl font-bold">Trending Products</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trendingProducts?.map(product => (
              <motion.div
                key={product.id}
                className="bg-dark-900 border-dark-800 hover:border-purple/50 cursor-pointer overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-md"
                whileHover={{ y: -5 }}
                onClick={() => handleProductClick(product.id)}
              >
                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="text-comment text-sm">{product.brand}</p>
                    </div>
                    <HealthScoreBadge score={product.health_score || 0} />
                  </div>

                  <CompatibilityBadges
                    compatibility={{
                      vegan: product.is_vegan || false,
                      vegetarian: product.is_vegetarian || false,
                      'gluten-free': product.is_gluten_free || false,
                      organic: product.is_organic || false,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto">
            <h2 className="mb-6 text-2xl font-bold">Recently Viewed</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {recentlyViewed.map(product => (
                <motion.div
                  key={product.id}
                  className="bg-dark-900 border-dark-800 hover:border-purple/50 cursor-pointer overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-md"
                  whileHover={{ y: -5 }}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-comment text-sm">{product.brand}</p>
                      </div>
                      <HealthScoreBadge score={product.health_score || 0} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Support Status Section (inspired by caniuse.com) */}
      <section className="py-8">
        <div className="container mx-auto">
          <h2 className="mb-5 flex items-center text-2xl font-bold">
            <span className="mr-2">🍽️</span> Dietary Support Status
          </h2>

          <div className="bg-dark-950 border-dark-800 rounded-lg border p-6 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-dark-800 border-b">
                    <th className="px-3 py-2 text-left">Diet Type</th>
                    <th className="px-3 py-2 text-center">Snacks</th>
                    <th className="px-3 py-2 text-center">Beverages</th>
                    <th className="px-3 py-2 text-center">Dairy</th>
                    <th className="px-3 py-2 text-center">Breakfast</th>
                    <th className="px-3 py-2 text-center">Ready to Eat</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-dark-800 border-b">
                    <td className="px-3 py-2 font-medium">Vegan</td>
                    <td className="text-green px-3 py-2 text-center">65%</td>
                    <td className="text-green px-3 py-2 text-center">82%</td>
                    <td className="text-red px-3 py-2 text-center">12%</td>
                    <td className="text-yellow px-3 py-2 text-center">48%</td>
                    <td className="text-yellow px-3 py-2 text-center">55%</td>
                  </tr>
                  <tr className="border-dark-800 border-b">
                    <td className="px-3 py-2 font-medium">Vegetarian</td>
                    <td className="text-green px-3 py-2 text-center">89%</td>
                    <td className="text-green px-3 py-2 text-center">91%</td>
                    <td className="text-green px-3 py-2 text-center">98%</td>
                    <td className="text-green px-3 py-2 text-center">92%</td>
                    <td className="text-green px-3 py-2 text-center">78%</td>
                  </tr>
                  <tr className="border-dark-800 border-b">
                    <td className="px-3 py-2 font-medium">Gluten-Free</td>
                    <td className="text-yellow px-3 py-2 text-center">45%</td>
                    <td className="text-green px-3 py-2 text-center">88%</td>
                    <td className="text-green px-3 py-2 text-center">95%</td>
                    <td className="text-red px-3 py-2 text-center">28%</td>
                    <td className="text-yellow px-3 py-2 text-center">52%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">Dairy-Free</td>
                    <td className="text-green px-3 py-2 text-center">72%</td>
                    <td className="text-green px-3 py-2 text-center">85%</td>
                    <td className="text-red px-3 py-2 text-center">5%</td>
                    <td className="text-yellow px-3 py-2 text-center">58%</td>
                    <td className="text-yellow px-3 py-2 text-center">62%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-comment mt-4 text-sm">
              <p>
                * Percentages indicate the proportion of products in our database that support each
                dietary restriction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Health Insights Section */}
      <section className="py-8">
        <div className="container mx-auto">
          <h2 className="mb-6 text-2xl font-bold">Featured Health Insights</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {healthInsightsProducts?.map(product => (
              <motion.div
                key={product.id}
                className="bg-dark-900 border-dark-800 hover:border-purple/50 cursor-pointer overflow-hidden rounded-lg border transition-all duration-300"
                whileHover={{ y: -5 }}
                onClick={() => handleProductClick(product.id)}
              >
                <div className="p-4">
                  <div className="flex flex-col">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-bold">{product.name}</h3>
                      <HealthScoreBadge score={product.health_score || 0} />
                    </div>
                    <p className="text-comment mb-2 text-sm">{product.brand}</p>
                    <p className="mb-3 line-clamp-2 text-sm">{product.description}</p>

                    {product.tags && product.tags.length > 0 && (
                      <div className="mt-auto flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="bg-purple/10 text-purple rounded-full px-1.5 py-0.5 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-8">
        <div className="container mx-auto">
          <motion.div
            className="from-dark-900 to-dark-950 border-purple/30 rounded-lg border bg-gradient-to-br p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:w-3/4">
                <h2 className="text-purple mb-3 text-2xl font-bold">
                  Supporting "Label Padhega India"
                </h2>
                <p className="text-comment mb-4">
                  "Can I Eat" empowers consumers to make informed food choices by providing
                  transparent information about packaged food products. Our mission is to promote
                  healthy eating habits and raise awareness about the ingredients in everyday foods.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    className="bg-primary-500 text-light-50 hover:bg-primary-600 active:bg-primary-700 rounded-md px-4 py-2 font-medium shadow-md transition-all duration-300 hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                  <motion.button
                    className="bg-secondary-500 text-light-50 hover:bg-secondary-600 active:bg-secondary-700 rounded-md px-4 py-2 font-medium shadow-md transition-all duration-300 hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contribute
                  </motion.button>
                </div>
              </div>
              <div className="mt-6 flex justify-center md:mt-0 md:w-1/4">
                <div className="bg-purple/20 flex h-24 w-24 items-center justify-center rounded-full">
                  <span className="text-4xl">📱</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
