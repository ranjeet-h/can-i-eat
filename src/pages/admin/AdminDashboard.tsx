import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../../hooks/useProducts';
import { productsDb } from '../../services/productsApi';
import HealthScoreBadge from '../../components/product/HealthScoreBadge';
import { cx } from '../../utils/cn';
import { useToastContext } from '../../components/ToastProvider';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { showToast } = useToastContext();
  
  // Get products from Supabase
  const { data, isLoading, isError, refetch } = useProducts({ 
    query: searchQuery, 
    page, 
    limit,
  });
  
  // To track products being deleted (for optimistic UI updates)
  const [deletingProducts, setDeletingProducts] = useState<string[]>([]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };
  
  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (!productId) return;
    
    // Confirm before deleting
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    // Add to deleting list for UI feedback
    setDeletingProducts([...deletingProducts, productId]);
    
    try {
      // Delete the product using Supabase
      await productsDb.delete(productId);
      
      // Show success toast
      showToast({
        title: 'Success',
        message: 'Product deleted successfully',
        type: 'success'
      });
      
      // Refetch products to update the list
      refetch();
    } catch (err) {
      console.error('Error deleting product:', err);
      
      // Show error toast
      showToast({
        title: 'Error',
        message: 'Failed to delete product',
        type: 'error'
      });
    } finally {
      // Remove from the deleting list
      setDeletingProducts(deletingProducts.filter(id => id !== productId));
    }
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link
          to="/admin/product/new"
          className="px-4 py-2 bg-purple text-light-50 rounded-md hover:bg-primary-600 transition-colors"
        >
          Add New Product
        </Link>
      </div>
      
      <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden mb-6">
        <div className="p-4 border-b border-dark-800">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Products</h2>
            <div className="w-64">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-purple"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        
        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-800">
            <thead className="bg-dark-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-comment uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-comment uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-comment uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-comment uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-comment uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-comment uppercase tracking-wider">Health Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-comment uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <motion.div
                      className="inline-block"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path opacity="0.3" d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path opacity="0.7" d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path opacity="0.2" d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path opacity="0.5" d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path opacity="0.1" d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path opacity="0.4" d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path opacity="0.6" d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </motion.div>
                    <p className="mt-2 text-sm text-comment">Loading products...</p>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-red">
                      <p>Error loading products. Please try again.</p>
                      <button
                        className="mt-4 px-4 py-2 bg-dark-800 rounded-md hover:bg-dark-700 transition-colors"
                        onClick={() => refetch()}
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : data?.products?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-comment">
                    No products found. {searchQuery ? 'Try a different search query.' : 'Add some products to get started.'}
                  </td>
                </tr>
              ) : (
                data?.products?.map(product => (
                  <tr 
                    key={product.id} 
                    className={cx(
                      deletingProducts.includes(product.id || '') ? "opacity-50 bg-red/5" : "",
                      "transition-opacity"
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.id?.slice(-8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.brand || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.category || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cx(
                        "px-2 py-1 text-xs rounded-full",
                        product.is_published 
                          ? "bg-green/20 text-green" 
                          : product.user_submitted 
                            ? "bg-yellow/20 text-yellow"
                            : "bg-comment/20 text-comment"
                      )}>
                        {product.is_published 
                          ? "Published" 
                          : product.user_submitted 
                            ? "Needs Review" 
                            : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <HealthScoreBadge score={product.health_score || 0} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <Link
                          to={`/admin/product/${product.id}`}
                          className="text-purple hover:text-purple-600 transition-colors"
                          title="Edit Product"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => product.id && handleDeleteProduct(product.id)}
                          disabled={deletingProducts.includes(product.id || '')}
                          className={cx(
                            "text-red hover:text-red-700 transition-colors",
                            deletingProducts.includes(product.id || '') ? "cursor-not-allowed" : "cursor-pointer"
                          )}
                          title="Delete Product"
                        >
                          {deletingProducts.includes(product.id || '') ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isLoading && !isError && data && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-dark-800">
            <div className="text-sm text-comment">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.pagination.total)} of {data.pagination.total} products
            </div>
            <div className="flex space-x-2">
              <button
                className={cx(
                  "px-3 py-1 rounded-md text-sm",
                  page > 1 
                    ? "bg-dark-800 hover:bg-dark-700 transition-colors cursor-pointer" 
                    : "bg-dark-900 text-dark-700 cursor-not-allowed"
                )}
                onClick={() => page > 1 && handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </button>
              
              {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === data.pagination.totalPages || (p >= page - 1 && p <= page + 1))
                .map((p, i, arr) => (
                  <>
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span key={`ellipsis-${p}`} className="px-3 py-1 text-comment">...</span>
                    )}
                    <button
                      key={p}
                      className={cx(
                        "px-3 py-1 rounded-md text-sm",
                        p === page 
                          ? "bg-purple text-white" 
                          : "bg-dark-800 hover:bg-dark-700 transition-colors"
                      )}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  </>
                ))
              }
              
              <button
                className={cx(
                  "px-3 py-1 rounded-md text-sm",
                  page < data.pagination.totalPages 
                    ? "bg-dark-800 hover:bg-dark-700 transition-colors cursor-pointer" 
                    : "bg-dark-900 text-dark-700 cursor-not-allowed"
                )}
                onClick={() => page < data.pagination.totalPages && handlePageChange(page + 1)}
                disabled={page >= data.pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/submissions"
            className="p-4 bg-dark-900 border border-dark-800 rounded-lg hover:border-purple/40 transition-colors"
          >
            <h3 className="font-bold mb-2">Review Submissions</h3>
            <p className="text-comment">Review and approve user-submitted products and edits</p>
          </Link>
          
          <Link
            to="/admin/settings"
            className="p-4 bg-dark-900 border border-dark-800 rounded-lg hover:border-purple/40 transition-colors"
          >
            <h3 className="font-bold mb-2">Admin Settings</h3>
            <p className="text-comment">Configure application settings and permissions</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 