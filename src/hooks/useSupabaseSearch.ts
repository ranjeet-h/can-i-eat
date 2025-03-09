import { useQuery } from '@tanstack/react-query';
import { productsDb, Product } from '../services/productsApi';

// Define a type for autocomplete suggestions that matches the mock API
export interface AutocompleteSuggestion {
  text: string;
  type: 'product' | 'brand' | 'ingredient' | 'category';
  productId?: string;
}

/**
 * Hook to get autocomplete suggestions based on the user's query
 * Uses real data from Supabase
 */
export const useSupabaseAutocomplete = (query: string) => {
  return useQuery<AutocompleteSuggestion[], Error>({
    queryKey: ['supabase-autocomplete', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      
      // Get published products from Supabase
      const products = await productsDb.getAll({ is_published: true });
      
      // Build suggestions list
      const suggestions: AutocompleteSuggestion[] = [];
      const lowerQuery = query.toLowerCase();
      
      // Track unique suggestions to avoid duplicates
      const uniqueTexts = new Set<string>();
      
      // Process products for suggestions
      products.forEach(product => {
        // Add product name if it matches
        if (product.name?.toLowerCase().includes(lowerQuery)) {
          const suggestionText = product.name;
          if (!uniqueTexts.has(suggestionText + '-product')) {
            uniqueTexts.add(suggestionText + '-product');
            suggestions.push({
              text: suggestionText,
              type: 'product',
              productId: product.id
            });
          }
        }
        
        // Add brand if it matches
        if (product.brand?.toLowerCase().includes(lowerQuery)) {
          const suggestionText = product.brand;
          if (suggestionText && !uniqueTexts.has(suggestionText + '-brand')) {
            uniqueTexts.add(suggestionText + '-brand');
            suggestions.push({
              text: suggestionText,
              type: 'brand'
            });
          }
        }
        
        // Add category if it matches
        if (product.category?.toLowerCase().includes(lowerQuery)) {
          const suggestionText = product.category;
          if (suggestionText && !uniqueTexts.has(suggestionText + '-category')) {
            uniqueTexts.add(suggestionText + '-category');
            suggestions.push({
              text: suggestionText,
              type: 'category'
            });
          }
        }
        
        // Add ingredients if they match
        if (product.ingredients) {
          const ingredients = product.ingredients.split(',').map((i: string) => i.trim());
          ingredients.forEach((ingredient: string) => {
            if (ingredient && ingredient.toLowerCase().includes(lowerQuery)) {
              if (!uniqueTexts.has(ingredient + '-ingredient')) {
                uniqueTexts.add(ingredient + '-ingredient');
                suggestions.push({
                  text: ingredient,
                  type: 'ingredient'
                });
              }
            }
          });
        }
      });
      
      return suggestions.sort((a, b) => a.text.localeCompare(b.text)).slice(0, 10);
    },
    enabled: query.length >= 2 // Only run query if search term is at least 2 chars
  });
};

/**
 * Hook to get product details by ID
 */
export const useProductDetails = (id: string | null) => {
  return useQuery<Product | null>({
    queryKey: ['product-details', id],
    queryFn: async () => {
      if (!id) return null;
      return await productsDb.getById(id);
    },
    enabled: !!id
  });
}; 