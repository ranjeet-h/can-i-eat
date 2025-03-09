-- Drop the existing policy 
DROP POLICY IF EXISTS "Admins can do everything with products" ON public.products;

-- Create an updated policy for admins that works without directly querying auth.users
CREATE POLICY "Admins can do everything with products v2" 
    ON public.products
    FOR ALL
    USING (
        auth.role() = 'authenticated' AND (
            current_setting('request.jwt.claims', true)::json->>'role' = 'admin' OR
            (current_setting('request.jwt.claims', true)::json->'app_metadata'->>'role')::text = 'admin' OR
            (current_setting('request.jwt.claims', true)::json->'user_metadata'->>'isAdmin')::boolean = true
        )
    );

-- Make the submitted_by field nullable
ALTER TABLE public.products ALTER COLUMN submitted_by DROP NOT NULL; 