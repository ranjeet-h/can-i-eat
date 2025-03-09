import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProductDetails } from '../../hooks/useSearch';
import HealthScoreBadge from '../../components/product/HealthScoreBadge';
import { ProductPlaceholderSVG } from '../../utils/placeholders';

const AdminProductDelete = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get product details
  const { data: product, isPending, isError } = useProductDetails(
    id ? parseInt(id, 10) : null
  );
  
  // Redirect if product ID is missing
  useEffect(() => {
    if (!id) {
      navigate('/admin');
    }
  }, [id, navigate]);
  
  // Handle confirm delete
  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      // Simulate API call - replace with real deletion when connected to Supabase
      console.log(`Deleting product ID: ${id}`);
      
      // In real implementation, you would call an API endpoint here
      // await deleteProduct(parseInt(id, 10));
      
      // Simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to dashboard with success message
      navigate('/admin', { 
        state: { successMessage: 'Product deleted successfully!' }
      });
    } catch (err) {
      setError('Failed to delete product. Please try again.');
      console.error('Error deleting product:', err);
      setIsDeleting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/admin');
  };
  
  // Loading state
  if (isPending) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
            <p className="text-comment">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (isError || !product) {
    return (
      <div className="py-8">
        <div className="bg-red/10 border border-red/30 p-4 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red mb-2">Error Loading Product</h2>
          <p className="mb-4">Unable to load product details. The product may have been deleted or you may not have permission to view it.</p>
          <Link to="/admin" className="px-4 py-2 bg-dark-800 rounded-md hover:bg-dark-700 transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Delete Product</h1>
        <Link 
          to="/admin" 
          className="px-4 py-2 bg-dark-800 rounded-md hover:bg-dark-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red/10 border border-red/30 rounded-lg text-red">
          {error}
        </div>
      )}
      
      <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden mb-6">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="bg-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
            <p className="text-comment">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
          </div>
          
          <div className="border border-dark-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 flex-shrink-0 bg-dark-800 rounded-lg flex items-center justify-center">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                    }}
                  />
                ) : (
                  <ProductPlaceholderSVG className="w-12 h-12 text-dark-700" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">{product.name}</h3>
                <div className="text-sm text-comment">
                  {product.brand} • {product.category}
                </div>
                <div className="mt-1">
                  <HealthScoreBadge score={product.healthScore} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <motion.button
              onClick={handleCancel}
              disabled={isDeleting}
              className="px-6 py-2 bg-dark-800 rounded-md hover:bg-dark-700 transition-colors disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-6 py-2 bg-red text-white rounded-md hover:bg-red/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isDeleting ? 'Deleting...' : 'Delete Product'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDelete; 