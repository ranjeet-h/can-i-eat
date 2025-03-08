import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductDetails } from '../../hooks/useSearch';
import ProductHealthBar from './ProductHealthBar';
import { ProductPlaceholderSVG } from '../../utils/placeholders';

interface ProductQuickViewProps {
  productId: number | null;
  onClose: () => void;
}

const ProductQuickView = ({ productId, onClose }: ProductQuickViewProps) => {
  const { data: product, isLoading, isError } = useProductDetails(productId);

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
    if (product) {
      window.location.href = `/product/${product.id}`;
    }
  };

  return (
    <AnimatePresence>
      {productId && (
        <motion.div
          className="bg-dark-900 border-dark-800 mt-2 w-full overflow-hidden rounded-lg border shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="mr-2"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path
                    opacity="0.3"
                    d="M12 18V22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    opacity="0.7"
                    d="M4.93 4.93L7.76 7.76"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    opacity="0.3"
                    d="M16.24 16.24L19.07 19.07"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    opacity="0.5"
                    d="M2 12H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    opacity="0.3"
                    d="M18 12H22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    opacity="0.3"
                    d="M4.93 19.07L7.76 16.24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    opacity="0.6"
                    d="M16.24 7.76L19.07 4.93"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
              <span>Loading product details...</span>
            </div>
          ) : isError ? (
            <div className="text-red p-6 text-center">
              <p>Error loading product details. Please try again.</p>
            </div>
          ) : product ? (
            <div>
              {/* Header with close button */}
              <div className="bg-dark-800 flex items-center justify-between p-4">
                <div>
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-comment text-sm">{product.brand}</p>
                </div>
                <button
                  onClick={onClose}
                  className="hover:bg-dark-700 rounded-full p-1 transition-colors"
                  aria-label="Close"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                {/* Health Score Bar */}
                <ProductHealthBar score={product.healthScore} />

                {/* Product Image */}
                <div className="mt-4 flex flex-col gap-4 md:flex-row">
                  <div className="w-full md:w-1/3">
                    <div className="bg-dark-800 h-auto w-full overflow-hidden rounded-md shadow-md">
                      <ProductPlaceholderSVG width={300} height={200} className="h-full w-full" />
                    </div>
                  </div>

                  <div className="w-full md:w-2/3">
                    {/* Ingredients */}
                    <div className="mb-4">
                      <h4 className="text-md mb-1 font-bold">Ingredients:</h4>
                      <p className="text-sm">{product.ingredients.join(', ')}</p>
                    </div>

                    {/* Dietary Information */}
                    <div className="mb-4">
                      <h4 className="text-md mb-2 font-bold">Dietary Information:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className={`rounded-md px-3 py-2 text-sm ${product.compatibility.vegan ? 'bg-green/10 text-green' : 'bg-dark-800 text-comment'}`}
                        >
                          Vegan: {product.compatibility.vegan ? 'Yes' : 'No'}
                        </div>
                        <div
                          className={`rounded-md px-3 py-2 text-sm ${product.compatibility.vegetarian ? 'bg-green/10 text-green' : 'bg-dark-800 text-comment'}`}
                        >
                          Vegetarian: {product.compatibility.vegetarian ? 'Yes' : 'No'}
                        </div>
                        <div
                          className={`rounded-md px-3 py-2 text-sm ${product.compatibility.glutenFree ? 'bg-cyan/10 text-cyan' : 'bg-dark-800 text-comment'}`}
                        >
                          Gluten-Free: {product.compatibility.glutenFree ? 'Yes' : 'No'}
                        </div>
                        <div
                          className={`rounded-md px-3 py-2 text-sm ${product.compatibility.dairyFree ? 'bg-cyan/10 text-cyan' : 'bg-dark-800 text-comment'}`}
                        >
                          Dairy-Free: {product.compatibility.dairyFree ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>

                    {/* View Full Details Button */}
                    <div className="mt-4 flex justify-end">
                      <motion.button
                        className="bg-purple text-light-50 hover:bg-primary-600 rounded-md px-4 py-2 shadow-md transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleViewFullDetails}
                      >
                        View Full Details
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-comment p-6 text-center">
              <p>Product not found.</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickView;
