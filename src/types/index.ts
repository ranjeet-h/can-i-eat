/**
 * Common application types
 */

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailUpdates: boolean;
  dietaryPreferences?: string[];
  allergens?: string[];
}

// Food product types
export interface Product {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  fssaiLicense?: string;
  category?: string;
  subcategory?: string;
  imageUrl?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  productId: string;
  name: string;
  quantity?: string;
  percentage?: number;
  isAllergen: boolean;
  concerns?: string[];
}

export interface Nutrition {
  id: string;
  productId: string;
  servingSize?: string;
  calories?: number;
  proteins?: number;
  carbohydrates?: number;
  fats?: number;
  saturatedFats?: number;
  transFats?: number;
  cholesterol?: number;
  sodium?: number;
  fiber?: number;
  sugars?: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
}

export interface HealthRating {
  id: string;
  productId: string;
  overallScore: number;
  nutritionalScore: number;
  additiveScore: number;
  processingScore: number;
  ecoScore: number;
  ratingAlgorithmVersion: string;
  createdAt: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Form field types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    required?: string;
    pattern?: {
      value: RegExp;
      message: string;
    };
    minLength?: {
      value: number;
      message: string;
    };
    maxLength?: {
      value: number;
      message: string;
    };
  };
}

// Route types
export interface Route {
  path: string;
  element: React.ReactNode;
  requiresAuth?: boolean;
  layout?: 'default' | 'minimal' | 'none';
  children?: Route[];
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

// Event types
export interface AppEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}
