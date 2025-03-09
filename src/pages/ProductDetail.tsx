import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetails } from '../hooks/useSupabaseSearch';
import ProductHealthBar from '../components/product/ProductHealthBar';
import { motion } from 'framer-motion';
import { addToRecentlyViewed } from '../utils/recentlyViewed';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProductDetails(id || null);

  // Add to recently viewed when component mounts
  useEffect(() => {
    if (id) {
      addToRecentlyViewed(id);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-md border border-current px-4 py-2 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 mb-6 text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.brand && (
                <p className="text-muted-foreground mb-4">by {product.brand}</p>
              )}
            </div>
            {product.image_url && (
              <motion.img 
                src={product.image_url} 
                alt={product.name}
                className="w-32 h-32 object-contain rounded-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Health Score</h2>
            <div className="w-full max-w-md">
              <ProductHealthBar score={product.health_score || 0} />
              <p className="mt-2 text-muted-foreground">
                {(product.health_score ?? 0) >= 70 
                  ? "This product is generally considered safe for consumption." 
                  : (product.health_score ?? 0) >= 40 
                    ? "This product may contain ingredients that some people prefer to avoid." 
                    : "This product contains ingredients that many people prefer to avoid."}
              </p>
            </div>
          </div>

          {product.ingredients && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
              <p className="text-foreground">{product.ingredients}</p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Dietary Information</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className={`inline-block w-4 h-4 rounded-full mr-2 ${!product.is_gluten_free ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  <span>Gluten: {!product.is_gluten_free ? 'Contains' : 'Free'}</span>
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-4 h-4 rounded-full mr-2 ${!product.is_vegetarian ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  <span>Vegetarian: {product.is_vegetarian ? 'Yes' : 'No'}</span>
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-4 h-4 rounded-full mr-2 ${!product.is_vegan ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  <span>Vegan: {product.is_vegan ? 'Yes' : 'No'}</span>
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-4 h-4 rounded-full mr-2 ${!product.is_organic ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  <span>Organic: {product.is_organic ? 'Yes' : 'No'}</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Product Details</h2>
              <ul className="space-y-2 text-foreground">
                {product.barcode && (
                  <li>
                    <span className="font-medium">Barcode:</span> {product.barcode}
                  </li>
                )}
                {product.category && (
                  <li>
                    <span className="font-medium">Category:</span> {product.category}
                  </li>
                )}
                {product.is_published && (
                  <li className="flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full mr-2 bg-green-500"></span>
                    Published Product
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 