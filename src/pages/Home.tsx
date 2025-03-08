import { useState } from 'react';
import { motion } from 'framer-motion';
import AutocompleteSearchBar from '../components/search/AutocompleteSearchBar';
import './Home.css';

// Mock data for featured categories (will be replaced with real data from API)
const foodCategories = [
  {
    id: 1,
    name: 'Snacks',
    icon: '🍿',
    color: 'text-orange border-orange/30 hover:border-orange/60',
  },
  { id: 2, name: 'Beverages', icon: '🥤', color: 'text-cyan border-cyan/30 hover:border-cyan/60' },
  {
    id: 3,
    name: 'Dairy',
    icon: '🥛',
    color: 'text-light-50 border-light-50/30 hover:border-light-50/60',
  },
  {
    id: 4,
    name: 'Breakfast',
    icon: '🥣',
    color: 'text-yellow border-yellow/30 hover:border-yellow/60',
  },
  {
    id: 5,
    name: 'Ready to Eat',
    icon: '🍲',
    color: 'text-green border-green/30 hover:border-green/60',
  },
  {
    id: 6,
    name: 'Chocolates',
    icon: '🍫',
    color: 'text-purple border-purple/30 hover:border-purple/60',
  },
];

// Mock trending products (will be replaced with real data)
const trendingProducts = [
  {
    id: 101,
    name: 'Lays Classic Potato Chips',
    brand: 'Lays',
    healthScore: 68,
    ingredients: ['Potatoes', 'Vegetable Oil', 'Salt'],
    compatibility: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      dairyFree: true,
    },
  },
  {
    id: 102,
    name: 'Amul Pure Milk',
    brand: 'Amul',
    healthScore: 85,
    ingredients: ['Milk', 'Vitamin A', 'Vitamin D'],
    compatibility: {
      vegan: false,
      vegetarian: true,
      glutenFree: true,
      dairyFree: false,
    },
  },
  {
    id: 103,
    name: 'Maggi 2-Minute Noodles',
    brand: 'Nestle',
    healthScore: 45,
    ingredients: ['Wheat Flour', 'Vegetable Oil', 'Salt', 'MSG'],
    compatibility: {
      vegan: false,
      vegetarian: true,
      glutenFree: false,
      dairyFree: false,
    },
  },
  {
    id: 104,
    name: 'MTR Instant Upma',
    brand: 'MTR',
    healthScore: 72,
    ingredients: ['Semolina', 'Spices', 'Salt', 'Dried Vegetables'],
    compatibility: {
      vegan: true,
      vegetarian: true,
      glutenFree: false,
      dairyFree: true,
    },
  },
];

// Mock recently viewed products (will be replaced with real data)
const recentlyViewed = [
  { id: 101, name: 'Lays Classic Potato Chips', brand: 'Lays', healthScore: 68 },
  { id: 102, name: 'Amul Pure Milk', brand: 'Amul', healthScore: 85 },
  { id: 103, name: 'Maggi 2-Minute Noodles', brand: 'Nestle', healthScore: 45 },
];

// Mock featured insights (will be replaced with real data)
const featuredInsights = [
  {
    id: 201,
    title: 'Understanding Food Additives',
    summary: 'Learn about common food additives and their health implications.',
    icon: '🧪',
  },
  {
    id: 202,
    title: 'Sugar in Packaged Foods',
    summary: 'Hidden sugars in your favorite packaged foods and their alternatives.',
    icon: '🍭',
  },
  {
    id: 203,
    title: 'Decoding Nutrition Labels',
    summary: 'A guide to understanding nutrition information on food packages.',
    icon: '📋',
  },
];

// Dietary compatibility badges
const CompatibilityBadges = ({ compatibility }: { compatibility: Record<string, boolean> }) => {
  return (
    <div className="mt-2 flex gap-1">
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
    >
      {score}
    </div>
  );
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Navigate to search results page with query parameter
    window.location.href = `/search?query=${encodeURIComponent(query)}`;
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
        window.location.href = `/search?category=${encodeURIComponent(category.name)}`;
      }
    }
  };

  // Handler for product card click
  const handleProductClick = (productId: number) => {
    // Navigate to product details page
    window.location.href = `/product/${productId}`;
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
          <h2 className="mb-5 flex items-center text-2xl font-bold">
            <span className="mr-2">🔥</span> Trending Products
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trendingProducts.map(product => (
              <motion.div
                key={product.id}
                className="bg-dark-900 border-dark-800 hover:border-purple/40 cursor-pointer rounded-lg border p-6 shadow-lg transition-colors"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => handleProductClick(product.id)}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-comment text-sm">{product.brand}</p>
                  </div>
                  <HealthScoreBadge score={product.healthScore} />
                </div>

                <div className="border-dark-800 mt-3 border-t pt-3">
                  <p className="text-comment mb-1 text-xs">Key Ingredients:</p>
                  <p className="text-sm">{product.ingredients.join(', ')}</p>
                  <CompatibilityBadges compatibility={product.compatibility} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <motion.button
              className="bg-purple text-light-50 hover:bg-primary-600 active:bg-primary-700 rounded-md px-4 py-2 font-medium shadow-md transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = '/search')}
            >
              Browse All Products
            </motion.button>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section (like caniuse.com) */}
      <section className="py-8">
        <div className="container mx-auto">
          <h2 className="mb-5 flex items-center text-2xl font-bold">
            <span className="mr-2">🕒</span> Recently Viewed
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {recentlyViewed.map(product => (
              <motion.div
                key={product.id}
                className="bg-dark-900 border-dark-800 hover:border-purple/40 cursor-pointer rounded-lg border p-6 shadow-lg transition-colors"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => handleProductClick(product.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-comment text-sm">{product.brand}</p>
                  </div>
                  <HealthScoreBadge score={product.healthScore} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Featured Health Insights */}
      <section className="py-8">
        <div className="container mx-auto">
          <h2 className="mb-5 flex items-center text-2xl font-bold">
            <span className="mr-2">💡</span> Featured Health Insights
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featuredInsights.map(insight => (
              <motion.div
                key={insight.id}
                className="bg-dark-900 border-dark-800 hover:border-cyan/40 cursor-pointer rounded-lg border p-6 shadow-lg transition-colors"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start">
                  <div className="mr-4 text-2xl">{insight.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold">{insight.title}</h3>
                    <p className="text-comment text-sm">{insight.summary}</p>
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
                  Can I Eat empowers consumers to make informed food choices by providing
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
