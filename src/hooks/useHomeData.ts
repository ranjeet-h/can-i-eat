import { useQuery } from '@tanstack/react-query';
import { productsDb, Product } from '../services/productsApi';
import React from 'react';
import { RECENTLY_VIEWED_UPDATED_EVENT } from '../utils/recentlyViewed';

// Hook to fetch trending products
export const useTrendingProducts = () => {
  return useQuery({
    queryKey: ['trending-products'],
    queryFn: async () => {
      // Get published products with high health scores
      const products = await productsDb.getAll({ is_published: true });
      
      // Sort by health score (highest first) and take the top 4
      return products
        .sort((a, b) => (b.health_score || 0) - (a.health_score || 0))
        .slice(0, 4);
    }
  });
};

// Hook to fetch products by category
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products-by-category', category],
    queryFn: async () => {
      // Get published products for the specific category
      return await productsDb.getAll({ 
        is_published: true,
        category: category
      });
    },
    enabled: !!category
  });
};

// Hook to fetch all available categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Get all published products
      const products = await productsDb.getAll({ is_published: true });
      
      // Extract unique categories and count products in each
      const categories = products.reduce((acc, product) => {
        if (product.category) {
          if (!acc[product.category]) {
            acc[product.category] = 0;
          }
          acc[product.category]++;
        }
        return acc;
      }, {} as Record<string, number>);
      
      // Convert to array format needed for UI
      return Object.entries(categories).map(([name, count], index) => ({
        id: index + 1,
        name,
        count,
        icon: getCategoryIcon(name)
      }));
    }
  });
};

// Hook to fetch featured health insights products
export const useHealthInsightsProducts = () => {
  return useQuery({
    queryKey: ['health-insights-products'],
    queryFn: async () => {
      // Get published products with "antioxidant" or "health" related tags
      const products = await productsDb.getAll({ is_published: true });
      
      // Filter products that have health-focused tags
      const healthProducts = products.filter(product => {
        const tags = product.tags || [];
        return tags.some((tag: string) => 
          ['antioxidant', 'omega-3', 'protein', 'vitamin', 'fiber', 'heart-healthy', 'anti-inflammatory']
            .some(healthTag => tag.includes(healthTag))
        );
      });
      
      // Take top 3 by health score
      return healthProducts
        .sort((a, b) => (b.health_score || 0) - (a.health_score || 0))
        .slice(0, 3);
    }
  });
};

// Helper function to get icon names based on category
// This function returns Font Awesome icon names
const getCategoryIcon = (category: string): string => {
  const categoryIcons: Record<string, string> = {
    'Dairy': 'fa-cheese',
    'Bakery': 'fa-bread-slice',
    'Beverages': 'fa-mug-hot',
    'Snacks': 'fa-cookie',
    'Cereals': 'fa-wheat-awn',
    'Condiments': 'fa-bottle-droplet',
    'Spices': 'fa-mortar-pestle',
    'Sweets': 'fa-candy-cane',
    'Health Supplements': 'fa-pills',
    'Superfoods': 'fa-seedling'
  };
  
  return categoryIcons[category] || 'fa-utensils'; // Default icon
};

// Hook to get recently viewed products from localStorage
export const useRecentlyViewedProducts = () => {
  // Use state to track localStorage changes
  const [recentlyViewedIds, setRecentlyViewedIds] = React.useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('recentlyViewed') || '[]') as string[];
    } catch (error) {
      console.error('Error parsing recently viewed products:', error);
      return [];
    }
  });

  // Listen for storage events and custom events
  React.useEffect(() => {
    // Function to update state from localStorage
    const updateFromStorage = () => {
      try {
        const storedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]') as string[];
        setRecentlyViewedIds(storedIds);
      } catch (error) {
        console.error('Error parsing recently viewed products:', error);
      }
    };

    // Handle storage events (for cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'recentlyViewed') {
        updateFromStorage();
      }
    };

    // Handle custom events (for same-tab updates)
    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail && e.detail.ids) {
        setRecentlyViewedIds(e.detail.ids);
      } else {
        updateFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(RECENTLY_VIEWED_UPDATED_EVENT, handleCustomEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(RECENTLY_VIEWED_UPDATED_EVENT, handleCustomEvent as EventListener);
    };
  }, []);

  return useQuery({
    queryKey: ['recently-viewed-products', recentlyViewedIds.join(',')],
    queryFn: async () => {
      if (recentlyViewedIds.length === 0) {
        return [];
      }
      
      // Get all published products
      const products = await productsDb.getAll({ is_published: true });
      
      // Filter and sort products based on recently viewed IDs
      return recentlyViewedIds
        .map(id => products.find(product => product.id === id))
        .filter(Boolean) as Product[];
    },
    refetchOnWindowFocus: true,
  });
}; 