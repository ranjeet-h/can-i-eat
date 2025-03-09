import { useQuery } from '@tanstack/react-query';
import { productsDb } from '../services/productsApi';

// Hook to fetch products with optional search and pagination
export const useProducts = (options: {
  query?: string;
  page?: number;
  limit?: number;
  filters?: Record<string, unknown>;
}) => {
  const { query, page = 1, limit = 10, filters = {} } = options;
  
  return useQuery({
    queryKey: ['products', { query, page, limit, ...filters }],
    queryFn: async () => {
      // Get all products with applied filters
      const allProducts = await productsDb.getAll(filters);
      
      // Apply search filter if query exists
      let filteredProducts = allProducts;
      if (query && query.trim() !== '') {
        const searchTermLower = query.toLowerCase();
        filteredProducts = allProducts.filter(product => 
          product.name?.toLowerCase().includes(searchTermLower) || 
          product.brand?.toLowerCase().includes(searchTermLower) ||
          product.category?.toLowerCase().includes(searchTermLower)
        );
      }
      
      // Calculate pagination
      const totalCount = filteredProducts.length;
      const totalPages = Math.ceil(totalCount / limit);
      const startIndex = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
      
      return {
        products: paginatedProducts,
        pagination: {
          total: totalCount,
          page,
          totalPages,
          limit
        }
      };
    }
  });
}; 