-- Create a products table for food products 
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    description TEXT,
    image_url TEXT,
    barcode VARCHAR(100),
    ingredients TEXT,
    health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
    nutrition_data JSONB,
    allergens TEXT[],
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_gluten_free BOOLEAN DEFAULT false,
    is_organic BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    tags TEXT[],
    serving_size VARCHAR(100),
    calories_per_serving INTEGER,
    user_submitted BOOLEAN DEFAULT false,
    submitted_by UUID REFERENCES auth.users(id)
);

-- Create an index for faster searching by name and brand
CREATE INDEX idx_products_name_brand ON public.products USING GIN (
    to_tsvector('english', name || ' ' || COALESCE(brand, ''))
);

-- Create an index for barcode lookups
CREATE INDEX idx_products_barcode ON public.products(barcode);

-- Create a view for published products only (for public access)
CREATE VIEW public.published_products AS
SELECT * FROM public.products
WHERE is_published = true;

-- Set up Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows any authenticated user to read published products
CREATE POLICY "Anyone can view published products" 
    ON public.products
    FOR SELECT 
    USING (is_published = true);

-- Create a policy that allows admin users to do everything with products
CREATE POLICY "Admins can do everything with products" 
    ON public.products
    USING (
        (SELECT (role = 'admin') FROM auth.users WHERE id = auth.uid())
        OR
        (SELECT (raw_user_meta_data->>'isAdmin')::boolean FROM auth.users WHERE id = auth.uid())
    );

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add comment to the table
COMMENT ON TABLE public.products IS 'Food products information for the Can I Eat application';

-- Migration down functions
-- Use within another migration to revert changes if needed
/*
DROP TRIGGER IF EXISTS set_updated_at ON public.products;
DROP FUNCTION IF EXISTS update_modified_column;
DROP POLICY IF EXISTS "Admins can do everything with products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view published products" ON public.products;
DROP VIEW IF EXISTS public.published_products;
DROP INDEX IF EXISTS idx_products_barcode;
DROP INDEX IF EXISTS idx_products_name_brand;
DROP TABLE IF EXISTS public.products;
*/
