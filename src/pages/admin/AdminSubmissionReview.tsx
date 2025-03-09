import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cx } from '../../utils/cn';
import HealthScoreBadge from '../../components/product/HealthScoreBadge';
import { ProductPlaceholderSVG } from '../../utils/placeholders';
import { productsDb, Product } from '../../services/productsApi';
import { useToastContext } from '../../components/ToastProvider';

const AdminSubmissionReview = () => {
  const [submissions, setSubmissions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // 'all', 'new', 'edit'
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);
  const { showToast } = useToastContext();

  // Fetch products that require approval
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all products that are user submitted but not published
        // (Temporary approach until requires_approval column is added to database)
        const products = await productsDb.getAll({ 
          is_published: false,
          user_submitted: true
        });
        
        setSubmissions(products);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load submissions');
        showToast({
          title: 'Error',
          message: 'Failed to load product submissions',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get active submission
  const activeSubmission = activeSubmissionId 
    ? submissions.find(sub => sub.id === activeSubmissionId) 
    : null;

  // Filter submissions based on user_submitted flag
  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true;
    if (filter === 'new') return submission.user_submitted === true;
    if (filter === 'edit') return submission.user_submitted === false;
    return true;
  });

  const handleApprove = async (productId: string) => {
    if (!productId) return;
    
    try {
      // Update the product to be published
      // (Removed requires_approval until column is added to database)
      await productsDb.update(productId, {
        is_published: true
      });
      
      // Remove the product from the list
      setSubmissions(submissions.filter(s => s.id !== productId));
      setActiveSubmissionId(null);
      
      showToast({
        title: 'Success',
        message: 'Product has been approved and published',
        type: 'success'
      });
    } catch (err) {
      console.error('Error approving product:', err);
      showToast({
        title: 'Error',
        message: 'Failed to approve product',
        type: 'error'
      });
    }
  };

  const handleReject = async (productId: string) => {
    if (!productId) return;
    
    if (!confirm('Are you sure you want to reject this product?')) return;
    
    try {
      // Just delete the product since we can't mark it as rejected yet
      // (Alternative approach until requires_approval column is added)
      await productsDb.delete(productId);
      
      // Remove the product from the list
      setSubmissions(submissions.filter(s => s.id !== productId));
      setActiveSubmissionId(null);
      
      showToast({
        title: 'Success',
        message: 'Product has been rejected',
        type: 'success'
      });
    } catch (err) {
      console.error('Error rejecting product:', err);
      showToast({
        title: 'Error',
        message: 'Failed to reject product',
        type: 'error'
      });
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
          <p className="mt-4">Loading submissions...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red/10 p-6 text-center">
          <h2 className="mb-2 text-xl font-bold text-red">Error Loading Submissions</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="rounded-md bg-dark-800 px-4 py-2 hover:bg-dark-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Submissions Review</h1>
          <p className="text-comment">Review and approve user-submitted products</p>
        </div>

        {/* Filter controls */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={cx(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              filter === 'all' ? "bg-purple text-white" : "bg-dark-800 hover:bg-dark-700"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter('new')}
            className={cx(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              filter === 'new' ? "bg-purple text-white" : "bg-dark-800 hover:bg-dark-700"
            )}
          >
            New Products
          </button>
          <button
            onClick={() => setFilter('edit')}
            className={cx(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              filter === 'edit' ? "bg-purple text-white" : "bg-dark-800 hover:bg-dark-700"
            )}
          >
            Edits
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* Submissions list */}
        <div className="md:col-span-2">
          <div className="rounded-lg border border-dark-800 bg-dark-900">
            <div className="border-dark-800 border-b p-4">
              <h2 className="font-medium">Pending Submissions</h2>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto">
              {filteredSubmissions.length === 0 ? (
                <div className="p-6 text-center text-comment">
                  No submissions found.
                </div>
              ) : (
                <ul className="divide-y divide-dark-800">
                  {filteredSubmissions.map(submission => (
                    <motion.li 
                      key={submission.id || Math.random().toString()}
                      className={cx(
                        "cursor-pointer p-4 transition-colors hover:bg-dark-800",
                        activeSubmissionId === submission.id ? "bg-dark-800" : ""
                      )}
                      onClick={() => submission.id && setActiveSubmissionId(submission.id)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      <div className="flex justify-between">
                        <div>
                          <span className={cx(
                            "mb-2 inline-block rounded-full px-2 py-0.5 text-xs",
                            submission.user_submitted
                              ? "bg-green/20 text-green" 
                              : "bg-yellow/20 text-yellow"
                          )}>
                            {submission.user_submitted ? 'New Product' : 'Edit'}
                          </span>
                          <h3 className="truncate text-sm font-medium">{submission.name}</h3>
                          <p className="text-xs text-comment">{submission.brand}</p>
                        </div>
                        <div className="text-right">
                          <HealthScoreBadge score={submission.health_score || 0} size="sm" />
                          <p className="mt-1 text-xs text-comment">
                            {formatDate(submission.created_at || '')}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Submission details */}
        <div className="md:col-span-3">
          {activeSubmission ? (
            <div className="rounded-lg border border-dark-800 bg-dark-900">
              <div className="border-dark-800 flex items-center justify-between border-b p-4">
                <div>
                  <h2 className="font-bold">
                    {activeSubmission.user_submitted ? 'New Product Submission' : 'Product Edit Submission'}
                  </h2>
                  <p className="text-sm text-comment">
                    Submitted {activeSubmission.submitted_by ? `by ${activeSubmission.submitted_by}` : ''} on {formatDate(activeSubmission.created_at || '')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {activeSubmission.id && (
                    <>
                      <button
                        onClick={() => handleReject(activeSubmission.id || '')}
                        className="rounded px-3 py-1 text-red transition-colors hover:bg-red/30 bg-red/20"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(activeSubmission.id || '')}
                        className="rounded px-3 py-1 text-green transition-colors hover:bg-green/30 bg-green/20"
                      >
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="mb-6 space-y-6">
                  {/* Product details grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-comment">Product Name</h3>
                      <p>{activeSubmission.name}</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-comment">Brand</h3>
                      <p>{activeSubmission.brand}</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-comment">Category</h3>
                      <p>{activeSubmission.category}</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-comment">Health Score</h3>
                      <HealthScoreBadge score={activeSubmission.health_score || 0} showText />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-1 text-sm font-medium text-comment">Ingredients</h3>
                    <p className="rounded-md border border-dark-700 bg-dark-800 p-3">
                      {activeSubmission.ingredients}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-1 text-sm font-medium text-comment">Dietary Compatibility</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div 
                        className={cx(
                          "rounded-md border p-2",
                          activeSubmission.is_vegetarian 
                            ? "border-green/30 bg-green/10 text-green" 
                            : "border-dark-700 bg-dark-800 text-comment"
                        )}
                      >
                        Vegetarian
                      </div>
                      <div 
                        className={cx(
                          "rounded-md border p-2",
                          activeSubmission.is_vegan 
                            ? "border-green/30 bg-green/10 text-green" 
                            : "border-dark-700 bg-dark-800 text-comment"
                        )}
                      >
                        Vegan
                      </div>
                      <div 
                        className={cx(
                          "rounded-md border p-2",
                          activeSubmission.is_gluten_free 
                            ? "border-green/30 bg-green/10 text-green" 
                            : "border-dark-700 bg-dark-800 text-comment"
                        )}
                      >
                        Gluten-Free
                      </div>
                      <div 
                        className={cx(
                          "rounded-md border p-2",
                          activeSubmission.is_organic 
                            ? "border-green/30 bg-green/10 text-green" 
                            : "border-dark-700 bg-dark-800 text-comment"
                        )}
                      >
                        Organic
                      </div>
                    </div>
                  </div>

                  {activeSubmission.description && (
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-comment">Description/Notes</h3>
                      <p className="rounded-md border border-dark-700 bg-dark-800 p-3 whitespace-pre-line">
                        {activeSubmission.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dark-800 bg-dark-900 p-10 text-center">
              <ProductPlaceholderSVG width={160} height={160} className="mb-4 text-dark-700" />
              <h3 className="mb-2 text-lg font-medium">No Submission Selected</h3>
              <p className="text-comment">Select a submission from the list to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissionReview; 