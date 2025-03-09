import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductDetails } from '../../hooks/useSupabaseSearch';
import ProductHealthBar from './ProductHealthBar';
import { ProductPlaceholderSVG } from '../../utils/placeholders';
import { useNavigate } from 'react-router-dom';

interface ProductQuickViewProps {
  productId: string | null;
  onClose: () => void;
}

const ProductQuickView = ({ productId, onClose }: ProductQuickViewProps) => {
  const { data: product, isLoading, isError } = useProductDetails(productId);
  const navigate = useNavigate();

  // Close on escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  // Handle view full details click
  const handleViewFullDetails = () => {
    if (product && product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="max-w-2xl rounded-lg bg-dark-900 p-6">
          <div className="flex h-40 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="max-w-2xl rounded-lg bg-dark-900 p-6">
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <div className="mb-2 text-xl">Error</div>
            <p className="text-comment">An error occurred loading the product details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div 
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-dark-900 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-dark-800 p-4">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <button
            className="rounded-full p-2 hover:bg-dark-800"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {/* Left column */}
          <div>
            <div className="mb-4 overflow-hidden rounded-lg bg-dark-800">
              <div className="flex h-48 items-center justify-center">
                <ProductPlaceholderSVG width={120} height={120} />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-medium">Health Score</h3>
              <ProductHealthBar score={product.health_score || 0} />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-1 font-medium">Brand</h3>
              <p>{product.brand || 'Unknown'}</p>
            </div>

            {product.ingredients && (
              <div>
                <h3 className="mb-1 font-medium">Ingredients</h3>
                <p className="text-sm">{product.ingredients}</p>
              </div>
            )}

            <div>
              <h3 className="mb-1 font-medium">Dietary Information</h3>
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`rounded border p-2 text-sm ${
                    product.is_vegetarian
                      ? 'border-green/30 bg-green/10 text-green'
                      : 'border-dark-700 bg-dark-800 text-comment'
                  }`}
                >
                  Vegetarian
                </div>
                <div
                  className={`rounded border p-2 text-sm ${
                    product.is_vegan
                      ? 'border-green/30 bg-green/10 text-green'
                      : 'border-dark-700 bg-dark-800 text-comment'
                  }`}
                >
                  Vegan
                </div>
                <div
                  className={`rounded border p-2 text-sm ${
                    product.is_gluten_free
                      ? 'border-green/30 bg-green/10 text-green'
                      : 'border-dark-700 bg-dark-800 text-comment'
                  }`}
                >
                  Gluten-Free
                </div>
                <div
                  className={`rounded border p-2 text-sm ${
                    product.is_organic
                      ? 'border-green/30 bg-green/10 text-green'
                      : 'border-dark-700 bg-dark-800 text-comment'
                  }`}
                >
                  Organic
                </div>
              </div>
            </div>

            <button
              className="mt-4 w-full rounded-md bg-purple px-4 py-2 font-medium text-white hover:bg-purple/90"
              onClick={handleViewFullDetails}
            >
              View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
