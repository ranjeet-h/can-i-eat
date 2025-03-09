import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductPlaceholderSVG } from '../../utils/placeholders';
import { cx } from '../../utils/cn';

// Mock submission for the detail view (will replace with API)
const mockSubmission = {
  id: 1,
  type: 'new',
  status: 'pending',
  createdAt: '2024-08-14T14:22:33Z',
  submittedBy: 'user123@example.com',
  product: {
    name: 'Bournvita Health Drink',
    brand: 'Cadbury',
    category: 'Beverages',
    healthScore: 55,
    ingredients: ['Malt Extract', 'Sugar', 'Cocoa Powder', 'Vitamins', 'Minerals'],
    imageUrl: 'https://via.placeholder.com/150',
    compatibility: {
      vegan: false,
      vegetarian: true,
      glutenFree: false,
      dairyFree: false
    }
  },
  notes: 'I believe this product contains more sugar than advertised. Please verify the health score.'
};

const AdminApproval = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Form state (initialize with submission data)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    ingredients: '',
    healthScore: 50,
    imageUrl: '',
    compatibility: {
      vegan: false,
      vegetarian: false,
      glutenFree: false,
      dairyFree: false
    }
  });
  
  const [submission, setSubmission] = useState<typeof mockSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'approve_with_edits' | 'reject' | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  
  // Fetch submission data
  useEffect(() => {
    if (!id) {
      navigate('/admin/submissions');
      return;
    }
    
    // Simulate API call to fetch submission
    const fetchSubmission = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In real implementation, you would call an API endpoint
        // const data = await getSubmissionById(parseInt(id, 10));
        
        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 800));
        setSubmission(mockSubmission);
        
        // Initialize form with submission data
        setFormData({
          name: mockSubmission.product.name,
          brand: mockSubmission.product.brand,
          category: mockSubmission.product.category,
          ingredients: mockSubmission.product.ingredients.join(', '),
          healthScore: mockSubmission.product.healthScore,
          imageUrl: mockSubmission.product.imageUrl || '',
          compatibility: { ...mockSubmission.product.compatibility }
        });
      } catch (err) {
        setError('Failed to load submission data. Please try again.');
        console.error('Error loading submission:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmission();
  }, [id, navigate]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle compatibility checkbox changes
  const handleCompatibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      compatibility: {
        ...prev.compatibility,
        [name]: checked
      }
    }));
  };
  
  // Handle health score change
  const handleHealthScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData(prev => ({
      ...prev,
      healthScore: value
    }));
  };
  
  // Check if form data has been modified from original submission
  const hasEdits = () => {
    if (!submission) return false;
    
    const originalIngredients = submission.product.ingredients.join(', ');
    
    return (
      formData.name !== submission.product.name ||
      formData.brand !== submission.product.brand ||
      formData.category !== submission.product.category ||
      formData.ingredients !== originalIngredients ||
      formData.healthScore !== submission.product.healthScore ||
      formData.imageUrl !== (submission.product.imageUrl || '') ||
      formData.compatibility.vegan !== submission.product.compatibility.vegan ||
      formData.compatibility.vegetarian !== submission.product.compatibility.vegetarian ||
      formData.compatibility.glutenFree !== submission.product.compatibility.glutenFree ||
      formData.compatibility.dairyFree !== submission.product.compatibility.dairyFree
    );
  };
  
  // Handle submission processing
  const handleProcessSubmission = async (action: 'approve' | 'approve_with_edits' | 'reject') => {
    if (!submission || !id) return;
    
    setActionType(action);
    setIsProcessing(true);
    
    try {
      // Convert ingredients string to array for edited data
      const ingredientsArray = formData.ingredients
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0);
      
      // Data to send to the API
      const requestData = {
        submissionId: parseInt(id, 10),
        action,
        feedback: feedbackNote,
        ...(action === 'approve_with_edits' && {
          editedProduct: {
            ...formData,
            ingredients: ingredientsArray
          }
        })
      };
      
      // Simulate API call
      console.log('Processing submission:', requestData);
      
      // In real implementation, you would call an API endpoint
      // await processSubmission(requestData);
      
      // Simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Navigate back to submissions list with success message
      const actionMessage = 
        action === 'approve' ? 'approved' : 
        action === 'approve_with_edits' ? 'approved with edits' : 
        'rejected';
      
      navigate('/admin/submissions', { 
        state: { successMessage: `Submission successfully ${actionMessage}!` } 
      });
    } catch (err) {
      setError(`Failed to ${action} submission. Please try again.`);
      console.error(`Error ${action}ing submission:`, err);
      setIsProcessing(false);
      setActionType(null);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
            <p className="text-comment">Loading submission data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !submission) {
    return (
      <div className="py-8">
        <div className="bg-red/10 border border-red/30 p-4 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red mb-2">Error Loading Submission</h2>
          <p className="mb-4">
            {error || 'Unable to load submission data. The submission may have been deleted or processed already.'}
          </p>
          <Link to="/admin/submissions" className="px-4 py-2 bg-dark-800 rounded-md hover:bg-dark-700 transition-colors">
            Return to Submissions
          </Link>
        </div>
      </div>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Review Submission</h1>
        <Link 
          to="/admin/submissions" 
          className="px-4 py-2 bg-dark-800 rounded-md hover:bg-dark-700 transition-colors"
        >
          Back to Submissions
        </Link>
      </div>
      
      {/* Submission Info */}
      <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden mb-6">
        <div className="p-4 border-b border-dark-800">
          <h2 className="font-bold">Submission Details</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-comment mb-1">Submission ID</p>
              <p>{submission.id}</p>
            </div>
            <div>
              <p className="text-sm text-comment mb-1">Submitted By</p>
              <p>{submission.submittedBy}</p>
            </div>
            <div>
              <p className="text-sm text-comment mb-1">Submission Date</p>
              <p>{formatDate(submission.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-comment mb-1">Type</p>
              <p className="capitalize">{submission.type} Product</p>
            </div>
            {submission.notes && (
              <div className="md:col-span-2">
                <p className="text-sm text-comment mb-1">Submitter Notes</p>
                <p className="p-2 bg-dark-800 rounded-md">{submission.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Product Form */}
      <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden mb-6">
        <div className="p-4 border-b border-dark-800">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Product Information</h2>
            <div className="text-sm">
              {hasEdits() && (
                <span className="px-2 py-1 bg-purple/10 text-purple rounded-full">
                  Edited
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Basic info */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Product Name <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-purple"
                />
              </div>
              
              <div>
                <label htmlFor="brand" className="block text-sm font-medium mb-1">
                  Brand <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-purple"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category <span className="text-red">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-purple"
                >
                  <option value="">Select a category</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Ready to Eat">Ready to Eat</option>
                  <option value="Cereals">Cereals</option>
                  <option value="Sauces & Condiments">Sauces & Condiments</option>
                  <option value="Confectionery">Confectionery</option>
                </select>
              </div>
            </div>
            
            {/* Middle column - More details */}
            <div className="space-y-4">
              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium mb-1">
                  Ingredients <span className="text-red">*</span>
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  required
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  placeholder="Comma-separated list of ingredients"
                  rows={5}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-purple"
                />
              </div>
              
              <div>
                <label htmlFor="healthScore" className="block text-sm font-medium mb-1">
                  Health Score: {formData.healthScore}
                </label>
                <input
                  type="range"
                  id="healthScore"
                  name="healthScore"
                  min="0"
                  max="100"
                  value={formData.healthScore}
                  onChange={handleHealthScoreChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-comment">
                  <span>Unhealthy</span>
                  <span>Neutral</span>
                  <span>Healthy</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-purple"
                />
              </div>
            </div>
            
            {/* Right column - Compatibility and image */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Product Image</h3>
                <div className="border border-dark-700 rounded-lg p-2 h-40 flex items-center justify-center">
                  {formData.imageUrl ? (
                    <img 
                      src={formData.imageUrl} 
                      alt={formData.name || 'Product'} 
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                      }}
                    />
                  ) : (
                    <ProductPlaceholderSVG className="w-24 h-24 text-dark-700" />
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Dietary Compatibility</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="vegan"
                      checked={formData.compatibility.vegan}
                      onChange={handleCompatibilityChange}
                      className="mr-2"
                    />
                    Vegan
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="vegetarian"
                      checked={formData.compatibility.vegetarian}
                      onChange={handleCompatibilityChange}
                      className="mr-2"
                    />
                    Vegetarian
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="glutenFree"
                      checked={formData.compatibility.glutenFree}
                      onChange={handleCompatibilityChange}
                      className="mr-2"
                    />
                    Gluten Free
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="dairyFree"
                      checked={formData.compatibility.dairyFree}
                      onChange={handleCompatibilityChange}
                      className="mr-2"
                    />
                    Dairy Free
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback and Actions */}
      <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden mb-6">
        <div className="p-4 border-b border-dark-800">
          <h2 className="font-bold">Feedback & Review</h2>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="feedbackNote" className="block text-sm font-medium mb-1">
              Feedback for Submitter (optional)
            </label>
            <textarea
              id="feedbackNote"
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              placeholder="Add feedback or notes about your decision..."
              rows={3}
              className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-purple"
            />
          </div>
          
          <div className="flex flex-wrap gap-4 justify-end">
            <motion.button
              onClick={() => handleProcessSubmission('reject')}
              disabled={isProcessing}
              className={cx(
                "px-6 py-2 bg-red text-white rounded-md hover:bg-red/90 transition-colors",
                "disabled:opacity-70 disabled:cursor-not-allowed"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing && actionType === 'reject' ? 'Rejecting...' : 'Reject Submission'}
            </motion.button>
            
            <motion.button
              onClick={() => handleProcessSubmission('approve')}
              disabled={isProcessing}
              className={cx(
                "px-6 py-2 bg-green text-white rounded-md hover:bg-green/90 transition-colors",
                "disabled:opacity-70 disabled:cursor-not-allowed"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing && actionType === 'approve' ? 'Approving...' : 'Approve As-Is'}
            </motion.button>
            
            <motion.button
              onClick={() => handleProcessSubmission('approve_with_edits')}
              disabled={isProcessing || !hasEdits()}
              className={cx(
                "px-6 py-2 bg-purple text-white rounded-md hover:bg-purple/90 transition-colors",
                "disabled:opacity-70 disabled:cursor-not-allowed"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing && actionType === 'approve_with_edits' 
                ? 'Approving with Edits...' 
                : 'Approve with Edits'
              }
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApproval; 