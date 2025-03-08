# "Can I Eat" Project Implementation Plan with Supabase

## Project Overview

"Can I Eat" will be a web application similar to "caniuse.com" but focused on packaged food products in India. The platform will support the "Label Padhega India" movement by helping consumers make informed food choices through easily accessible information.

Users will be able to search for food products using:

- Product name
- Product ID
- Barcode number (potentially through camera scanning)
- Brand name

The system will display:

- Overall health rating
- Detailed ingredient list
- Nutritional information in a clear tabular format
- Potential side effects of ingredients
- Alternatives for healthier options

## Technology Stack

### Frontend

- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API (simpler for initial POC)
- **UI Components**: Headless UI or Chakra UI
- **Data Visualization**: Chart.js for nutrition graphs

### Backend & Database

- **Platform**: Supabase (PostgreSQL-based)
- **Authentication**: Supabase Auth with social logins
- **Database**: PostgreSQL (provided by Supabase)
- **Storage**: Supabase Storage for images
- **Search**: PostgreSQL full-text search with pg_trgm extension

### Deployment

- **Frontend Hosting**: Vercel (free tier)
- **Backend**: Managed by Supabase
- **CI/CD**: GitHub Actions

## Database Schema

### Products Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT,
  fssai_license TEXT,
  category TEXT,
  subcategory TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE
);

-- Add trigram index for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX products_name_trgm_idx ON products USING GIN (name gin_trgm_ops);
CREATE INDEX products_brand_trgm_idx ON products USING GIN (brand gin_trgm_ops);
```

### Ingredients Table

```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity TEXT,
  percentage FLOAT,
  is_allergen BOOLEAN DEFAULT FALSE,
  concerns TEXT[]
);

CREATE INDEX ingredients_product_id_idx ON ingredients(product_id);
CREATE INDEX ingredients_name_trgm_idx ON ingredients USING GIN (name gin_trgm_ops);
```

### Nutrition Table

```sql
CREATE TABLE nutrition (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  serving_size TEXT,
  calories FLOAT,
  proteins FLOAT,
  carbohydrates FLOAT,
  fats FLOAT,
  saturated_fats FLOAT,
  trans_fats FLOAT,
  cholesterol FLOAT,
  sodium FLOAT,
  fiber FLOAT,
  sugars FLOAT,
  vitamins JSONB,
  minerals JSONB
);

CREATE INDEX nutrition_product_id_idx ON nutrition(product_id);
```

### Health Ratings Table

```sql
CREATE TABLE health_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  overall_score INTEGER,
  nutritional_score INTEGER,
  additive_score INTEGER,
  processing_score INTEGER,
  eco_score INTEGER,
  rating_algorithm_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX health_ratings_product_id_idx ON health_ratings(product_id);
```

### Users Table (Handled by Supabase Auth, but extended with)

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  dietary_preferences TEXT[],
  allergens TEXT[],
  saved_products UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Full-Text Search Configuration

```sql
-- Create a combined search vector for full-text search
ALTER TABLE products ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(brand, '')), 'B')
) STORED;

CREATE INDEX products_search_idx ON products USING GIN (search_vector);

-- Create stored procedure for search
CREATE OR REPLACE FUNCTION search_products(query_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  brand TEXT,
  category TEXT,
  image_url TEXT,
  rank FLOAT
) AS $$
  SELECT
    p.id,
    p.name,
    p.brand,
    p.category,
    p.image_url,
    ts_rank(p.search_vector, to_tsquery('english', query_text)) AS rank
  FROM products p
  WHERE p.search_vector @@ to_tsquery('english', query_text)
  ORDER BY rank DESC
  LIMIT 20;
$$ LANGUAGE sql;
```

## Implementation Phases

### Phase 1: Project Setup and Basic Structure (1 week)

1. **Create Supabase Project**

   - Set up a new project in Supabase dashboard
   - Configure authentication providers
   - Create database tables and indexes

2. **Initialize Frontend Project**

   - Set up Vite + React + TypeScript
   - Install dependencies (Tailwind CSS, Supabase client, etc.)
   - Create basic project structure

3. **Authentication Flow**
   - Implement sign-up/login with email
   - Add social login options (Google, Facebook)
   - Create protected routes

### Phase 2: Core Features (2 weeks)

1. **Product Search Implementation**

   - Build search interface with autocomplete
   - Implement full-text search using Supabase
   - Create search results display

2. **Product Detail View**

   - Design and implement product information page
   - Create tabbed layout for nutritional info, ingredients, etc.
   - Add health score visualization

3. **Admin Interface (for data entry)**
   - Create forms for adding/editing products
   - Implement batch import functionality
   - Set up validation rules

### Phase 3: Enhanced Features (2 weeks)

1. **User Personalization**

   - Create user profile management
   - Implement dietary preference settings
   - Add saved/favorite products functionality

2. **Comparison Tool**

   - Develop side-by-side product comparison
   - Implement alternative suggestions
   - Create shareable comparison links

3. **Mobile Optimization**
   - Ensure responsive design on all pages
   - Optimize for touch interfaces
   - Add barcode scanning capability (if possible in browser)

### Phase 4: Data Collection and Deployment (Ongoing)

1. **Initial Data Acquisition**

   - Manual entry of popular food products
   - Import data from available public sources
   - Set up validation workflow

2. **Deployment Pipeline**
   - Configure CI/CD with GitHub Actions
   - Set up staging and production environments on Vercel
   - Implement monitoring and error tracking

## Frontend Components Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── SearchResults.tsx
│   │   └── ProductCard.tsx
│   ├── product/
│   │   ├── ProductDetail.tsx
│   │   ├── NutritionTable.tsx
│   │   ├── IngredientsList.tsx
│   │   └── HealthScore.tsx
│   ├── compare/
│   │   ├── CompareView.tsx
│   │   └── ProductSelector.tsx
│   └── user/
│       ├── Profile.tsx
│       ├── PreferencesForm.tsx
│       └── SavedProducts.tsx
├── pages/
│   ├── Home.tsx
│   ├── Search.tsx
│   ├── Product.tsx
│   ├── Compare.tsx
│   ├── Login.tsx
│   └── Profile.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useSearch.ts
│   ├── useProduct.ts
│   └── useCompare.ts
├── lib/
│   ├── supabase.ts
│   ├── api.ts
│   └── utils.ts
├── context/
│   ├── AuthContext.tsx
│   └── PreferencesContext.tsx
└── styles/
    └── tailwind.css
```

## Supabase Integration Code Examples

### Client Setup

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Authentication

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return { user, loading, signIn, signUp, signOut };
}
```

### Product Search

```typescript
// hooks/useSearch.ts
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchProducts = async query => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Using the trigram similarity for fuzzy matching
      const { data, error: searchError } = await supabase
        .from('products')
        .select(
          `
          id,
          name,
          brand,
          category,
          image_url,
          health_ratings(overall_score)
        `
        )
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(20);

      if (searchError) throw searchError;
      setResults(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchProducts };
}
```

### Product Details

```typescript
// hooks/useProduct.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get product with related data
        const { data, error: productError } = await supabase
          .from('products')
          .select(
            `
            *,
            ingredients(*),
            nutrition(*),
            health_ratings(*)
          `
          )
          .eq('id', productId)
          .single();

        if (productError) throw productError;
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
}
```

## Data Collection Strategy

1. **Manual Entry for POC**:

   - Initial focus on 100-200 popular packaged foods in India
   - Create an admin interface for easy data entry
   - Focus on commonly consumed snacks, beverages, and breakfast items

2. **Future Data Sources**:

   - FSSAI database (official source)
   - Open Food Facts API for international products
   - User contributions with verification workflow
   - Potential partnerships with manufacturers

3. **Data Verification Process**:
   - Cross-reference with official packaging information
   - Community flagging system for incorrect data
   - Regular audits of health score algorithms

## User Interface Design

1. **Search-Centric Homepage**

   - Large, prominent search bar (similar to caniuse.com)
   - Category quick-select options
   - Recently viewed products
   - Featured health insights

2. **Product Detail Page**

   - Clear health score visualization (color-coded)
   - Tabbed layout:
     - Overview (quick facts)
     - Nutrition (detailed table)
     - Ingredients (with concerns highlighted)
     - Alternatives (healthier options)
   - Save/share functionality

3. **Comparison View**

   - Side-by-side nutritional comparison
   - Highlighted differences
   - Ingredient overlap analysis
   - Export to PDF option

4. **User Dashboard**
   - Saved products list
   - Dietary preference settings
   - Allergen alerts configuration
   - Search history

## Deployment & Scaling Plan

1. **Development Environment**

   - Local development with Supabase local emulator
   - Environment variable management with `.env` files

2. **Staging Environment**

   - Deployed to Vercel preview URLs
   - Connected to development Supabase instance
   - Used for testing and stakeholder review

3. **Production Environment**

   - Main domain deployed on Vercel
   - Production Supabase instance
   - Setup with proper security rules and row-level security

4. **Scaling Considerations**
   - Monitor Supabase usage and upgrade plan as needed
   - Implement caching strategies for popular products
   - Consider adding a CDN for image assets
   - Use edge functions for complex calculations

## Monitoring & Analytics

1. **Application Monitoring**

   - Vercel Analytics for frontend performance
   - Sentry for error tracking
   - Custom logging for critical paths

2. **Database Monitoring**

   - Supabase dashboard metrics
   - Query performance analysis
   - Regular database maintenance

3. **User Analytics**
   - Basic pageview and search tracking
   - Feature usage analysis
   - Conversion tracking (viewing to comparing)

## Conclusion

This implementation plan provides a comprehensive roadmap for building the "Can I Eat" platform using Supabase as the backend. The PostgreSQL-powered database offers superior text search capabilities essential for food product lookup, while Supabase's auth, storage, and real-time features provide everything needed for a modern web application.

The platform will start with a focused POC covering the most essential features, then scale to include more sophisticated functionality and a larger product database over time. With Supabase's free tier, development can begin immediately with minimal upfront costs.
