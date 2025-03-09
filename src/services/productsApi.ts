import { supabase } from './supabase';
import { apiClient } from './api'; // Assuming apiClient is exported from api.ts

// Define Product interface
export interface Product {
  id?: string;
  name: string;
  brand?: string;
  description?: string;
  image_url?: string;
  barcode?: string;
  ingredients?: string;
  health_score?: number;
  nutrition_data?: Record<string, number | string>;
  allergens?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_organic?: boolean;
  is_published?: boolean;
  requires_approval?: boolean;
  category?: string;
  subcategory?: string;
  tags?: string[];
  serving_size?: string;
  calories_per_serving?: number;
  user_submitted?: boolean;
  submitted_by?: string;
  created_at?: string;
  updated_at?: string;
}

// Supabase direct access methods
export const productsDb = {
  // Get all products (with optional filters)
  getAll: async (filters = {}) => {
    let query = supabase.from('products').select('*');
    
    // Apply filters if provided
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  // Get a single product by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  // Create a new product
  create: async (product: Product) => {
    // Authentication is automatically handled by the supabase client
    // as long as the user is signed in as an admin
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  // Update a product
  update: async (id: string, updates: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  // Delete a product
  delete: async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  },
  
  // Search products
  search: async (query: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .textSearch('name', query, {
        config: 'english',
      });
    
    if (error) {
      throw error;
    }
    
    return data;
  }
};

// Axios REST API methods (alternative if you prefer using REST endpoints)
export const productsApi = {
  // Get all products with optional filtering
  getAll: async (filters = {}) => {
    const response = await apiClient.get('/products', { params: filters });
    return response.data;
  },
  
  // Get a single product
  getById: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
  
  // Create a new product
  create: async (product: Product) => {
    const response = await apiClient.post('/products', product);
    return response.data;
  },
  
  // Update a product
  update: async (id: string, updates: Partial<Product>) => {
    const response = await apiClient.patch(`/products/${id}`, updates);
    return response.data;
  },
  
  // Delete a product
  delete: async (id: string) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
  
  // Search products
  search: async (query: string) => {
    const response = await apiClient.get('/products/search', { params: { q: query } });
    return response.data;
  }
};

// Default export for convenience
export default {
  db: productsDb,   // Supabase direct access
  api: productsApi  // Axios REST API
}; 