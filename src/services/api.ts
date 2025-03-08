import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { placeholderImageUrl } from '../utils/placeholders';

// Create a base API instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// Generic GET request
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.get(url, config);
  return response.data;
};

// Generic POST request
export const post = async <T, D = Record<string, unknown>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.post(url, data, config);
  return response.data;
};

// Generic PUT request
export const put = async <T, D = Record<string, unknown>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.put(url, data, config);
  return response.data;
};

// Generic PATCH request
export const patch = async <T, D = Record<string, unknown>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
  return response.data;
};

// Generic DELETE request
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.delete(url, config);
  return response.data;
};

// Mock data for products (will be replaced with Supabase calls)
const mockProducts = [
  {
    id: 101,
    name: 'Lays Classic Potato Chips',
    brand: 'Lays',
    healthScore: 68,
    ingredients: ['Potatoes', 'Vegetable Oil', 'Salt'],
    category: 'Snacks',
    imageUrl: placeholderImageUrl,
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
    category: 'Dairy',
    imageUrl: placeholderImageUrl,
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
    category: 'Ready to Eat',
    imageUrl: placeholderImageUrl,
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
    category: 'Breakfast',
    imageUrl: placeholderImageUrl,
    compatibility: {
      vegan: true,
      vegetarian: true,
      glutenFree: false,
      dairyFree: true,
    },
  },
  {
    id: 105,
    name: 'Cadbury Dairy Milk Chocolate',
    brand: 'Cadbury',
    healthScore: 40,
    ingredients: ['Sugar', 'Cocoa Butter', 'Milk Solids', 'Cocoa Solids'],
    category: 'Chocolates',
    imageUrl: placeholderImageUrl,
    compatibility: {
      vegan: false,
      vegetarian: true,
      glutenFree: true,
      dairyFree: false,
    },
  },
  {
    id: 106,
    name: 'Tropicana Orange Juice',
    brand: 'Tropicana',
    healthScore: 75,
    ingredients: ['Orange Juice Concentrate', 'Water', 'Sugar'],
    category: 'Beverages',
    imageUrl: placeholderImageUrl,
    compatibility: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      dairyFree: true,
    },
  },
  {
    id: 107,
    name: 'Parle-G Biscuits',
    brand: 'Parle',
    healthScore: 55,
    ingredients: ['Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Milk Solids'],
    category: 'Snacks',
    imageUrl: placeholderImageUrl,
    compatibility: {
      vegan: false,
      vegetarian: true,
      glutenFree: false,
      dairyFree: false,
    },
  },
  {
    id: 108,
    name: 'Britannia Good Day Cookies',
    brand: 'Britannia',
    healthScore: 50,
    ingredients: ['Refined Wheat Flour', 'Sugar', 'Butter', 'Cashew'],
    category: 'Snacks',
    imageUrl: placeholderImageUrl,
    compatibility: {
      vegan: false,
      vegetarian: true,
      glutenFree: false,
      dairyFree: false,
    },
  },
  {
    id: 109,
    name: 'Haldiram Aloo Bhujia',
    brand: 'Haldiram',
    healthScore: 42,
    ingredients: ['Gram Flour', 'Potato', 'Spices', 'Edible Oil'],
    category: 'Snacks',
    imageUrl: placeholderImageUrl,
    compatibility: {
      vegan: true,
      vegetarian: true,
      glutenFree: false,
      dairyFree: true,
    },
  },
  {
    id: 110,
    name: 'Amul Butter',
    brand: 'Amul',
    healthScore: 65,
    ingredients: ['Milk Fat', 'Salt'],
    category: 'Dairy',
    imageUrl: placeholderImageUrl,
    compatibility: {
      vegan: false,
      vegetarian: true,
      glutenFree: true,
      dairyFree: false,
    },
  },
];

// Type definition for a food product
export interface Product {
  id: number;
  name: string;
  brand: string;
  healthScore: number;
  ingredients: string[];
  category: string;
  imageUrl: string;
  compatibility: {
    vegan: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  };
}

// Type definition for search parameters
export interface SearchParams {
  query?: string;
  category?: string;
  dietary?: {
    vegan?: boolean;
    vegetarian?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
  };
  page?: number;
  limit?: number;
}

// Type definition for search results
export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

// Mock search function with pagination and filtering
export const searchProducts = async (params: SearchParams): Promise<SearchResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredProducts = [...mockProducts];

  // Apply search query filter
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredProducts = filteredProducts.filter(
      product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.ingredients.some(i => i.toLowerCase().includes(query))
    );
  }

  // Apply category filter
  if (params.category) {
    filteredProducts = filteredProducts.filter(product => product.category === params.category);
  }

  // Apply dietary filters
  if (params.dietary) {
    if (params.dietary.vegan) {
      filteredProducts = filteredProducts.filter(product => product.compatibility.vegan);
    }
    if (params.dietary.vegetarian) {
      filteredProducts = filteredProducts.filter(product => product.compatibility.vegetarian);
    }
    if (params.dietary.glutenFree) {
      filteredProducts = filteredProducts.filter(product => product.compatibility.glutenFree);
    }
    if (params.dietary.dairyFree) {
      filteredProducts = filteredProducts.filter(product => product.compatibility.dairyFree);
    }
  }

  // Calculate pagination
  const page = params.page || 1;
  const limit = params.limit || 6;
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limit);

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    total,
    page,
    totalPages,
  };
};

// Type for autocomplete suggestions
export interface AutocompleteSuggestion {
  text: string;
  type: 'product' | 'brand' | 'ingredient';
  productId?: number;
}

// Updated autocomplete suggestions function
export const getAutocompleteSuggestions = async (
  query: string
): Promise<AutocompleteSuggestion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  if (!query || query.length < 2) return [];

  // Build a list of suggestions
  const suggestions: AutocompleteSuggestion[] = [];
  const lowerQuery = query.toLowerCase();

  mockProducts.forEach(product => {
    // Add product name if it matches
    if (product.name.toLowerCase().includes(lowerQuery)) {
      suggestions.push({
        text: product.name,
        type: 'product',
        productId: product.id,
      });
    }

    // Add brand if it matches
    if (product.brand.toLowerCase().includes(lowerQuery)) {
      suggestions.push({
        text: product.brand,
        type: 'brand',
      });
    }

    // Add ingredients if they match
    product.ingredients.forEach(ingredient => {
      if (ingredient.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          text: ingredient,
          type: 'ingredient',
        });
      }
    });
  });

  // Remove duplicates and sort
  const uniqueSuggestions = suggestions.filter(
    (suggestion, index, self) =>
      index === self.findIndex(s => s.text === suggestion.text && s.type === suggestion.type)
  );

  return uniqueSuggestions.sort((a, b) => a.text.localeCompare(b.text));
};

// Mock get product by ID function
export const getProductById = async (id: number): Promise<Product | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const product = mockProducts.find(p => p.id === id);
  return product || null;
};

// This will be replaced with actual Supabase client code later
const api = {
  searchProducts,
  getAutocompleteSuggestions,
  getProductById,
};

export default api;
