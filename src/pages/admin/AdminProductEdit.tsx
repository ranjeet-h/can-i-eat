import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsDb, Product } from '../../services/productsApi';
import { ProductPlaceholderSVG } from '../../utils/placeholders';
import { useToastContext } from '../../components/ToastProvider';

const AdminProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: '',
    ingredients: '',
    health_score: 50,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_organic: false,
    is_published: false,
    requires_approval: false,
    description: '',
    image_url: ''
  });
  
  // Fetch product data directly from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const product = await productsDb.getById(id);
        
        if (product) {
          setFormData({
            name: product.name || '',
            brand: product.brand || '',
            category: product.category || '',
            ingredients: product.ingredients || '',
            health_score: product.health_score || 50,
            is_vegetarian: product.is_vegetarian || false,
            is_vegan: product.is_vegan || false,
            is_gluten_free: product.is_gluten_free || false,
            is_organic: product.is_organic || false,
            is_published: product.is_published || false,
            requires_approval: product.requires_approval || false,
            description: product.description || '',
            image_url: product.image_url || ''
          });
        } else {
          setError('Product not found');
          showToast({
            title: 'Error',
            message: 'Product not found or may have been deleted',
            type: 'error'
          });
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product details');
        showToast({
          title: 'Error',
          message: 'Failed to load product details',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, showToast]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare ingredients from string to array format
    const ingredientsArray = formData.ingredients 
      ? formData.ingredients.split(',').map(i => i.trim()).filter(Boolean)
      : [];
    
    // Basic validation
    if (!formData.name) {
      alert('Product name is required');
      return;
    }
    
    // Optimistic update
    setIsSubmitting(true);
    
    // Simulate API call to update product
    setTimeout(() => {
      // In a real app, you would send this data to your API
      const updatedProduct = {
        ...formData,
        ingredients: ingredientsArray,
        // For new products, we'd let the backend generate an ID
        ...(id === 'new' ? {} : { id })
      };
      
      console.log('Saving product:', updatedProduct);
      
      // Reset form submission state
      setIsSubmitting(false);
      
      // Show success message and navigate back to dashboard
      setTimeout(() => {
        console.log(`Product ${id === 'new' ? 'created' : 'updated'} successfully!`);
        navigate('/admin');
      }, 1000);
    }, 1500);
  };

  // Loading state while fetching product
  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mr-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path opacity="0.3" d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path opacity="0.7" d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path opacity="0.3" d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path opacity="0.5" d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path opacity="0.3" d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path opacity="0.3" d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path opacity="0.6" d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.div>
          <span>Loading product details...</span>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red/10 border border-red/30 p-4 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red mb-2">Error Loading Product</h2>
          <p className="mb-4">{error}</p>
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
        <h1 className="text-2xl font-bold">
          {id === 'new' ? 'Add New Product' : 'Edit Product'}
        </h1>
        <Link 
          to="/admin" 
          className="px-4 py-2 bg-dark-800 rounded-md hover:bg-dark-700 transition-colors"
        >
          Cancel
        </Link>
      </div>
      
      <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
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
                  <option value="Beverages">Beverages</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Ready to Eat">Ready to Eat</option>
                  <option value="Chocolates">Chocolates</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="health_score" className="block text-sm font-medium mb-1">
                  Health Score: {formData.health_score}
                </label>
                <input
                  type="range"
                  id="health_score"
                  name="health_score"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.health_score}
                  onChange={handleInputChange}
                  className="w-full accent-purple"
                />
                <div className="flex justify-between text-xs text-comment">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>
            
            {/* Middle column - Ingredients */}
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium mb-1">
                Ingredients <span className="text-red">*</span>
              </label>
              <p className="text-xs text-comment mb-2">
                Enter ingredients separated by commas
              </p>
              <textarea
                id="ingredients"
                name="ingredients"
                required
                value={formData.ingredients}
                onChange={handleInputChange}
                rows={10}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-purple"
              />
            </div>
            
            {/* Right column - Compatibility and image */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Dietary Compatibility</h3>
                <div className="space-y-2 bg-dark-800 p-3 rounded-md border border-dark-700">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_vegetarian"
                      checked={formData.is_vegetarian}
                      onChange={handleInputChange}
                      className="rounded text-purple focus:ring-purple"
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_vegan"
                      checked={formData.is_vegan}
                      onChange={handleInputChange}
                      className="rounded text-purple focus:ring-purple"
                    />
                    <span>Vegan</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_gluten_free"
                      checked={formData.is_gluten_free}
                      onChange={handleInputChange}
                      className="rounded text-purple focus:ring-purple"
                    />
                    <span>Gluten-Free</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_organic"
                      checked={formData.is_organic}
                      onChange={handleInputChange}
                      className="rounded text-purple focus:ring-purple"
                    />
                    <span>Organic</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Publishing Status</h3>
                <div className="space-y-2 bg-dark-800 p-3 rounded-md border border-dark-700">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleInputChange}
                      className="rounded text-purple focus:ring-purple"
                    />
                    <span>Published</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="requires_approval"
                      checked={formData.requires_approval}
                      onChange={handleInputChange}
                      className="rounded text-purple focus:ring-purple"
                    />
                    <span>Requires Approval</span>
                  </label>
                  <p className="text-xs text-comment mt-1">
                    {formData.is_published ? 
                      "This product is visible to all users." : 
                      "This product is not visible to users."}
                  </p>
                  <p className="text-xs text-comment mt-1">
                    {formData.requires_approval ? 
                      "This product is awaiting review by an admin." : 
                      "This product does not need approval."}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Product Image</h3>
                <div className="border-2 border-dashed border-dark-700 rounded-md p-4 text-center">
                  <ProductPlaceholderSVG width={200} height={150} className="mx-auto" />
                  <p className="mt-2 text-sm text-comment">
                    Product image upload will be available when connected to storage backend
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form actions */}
          <div className="mt-8 flex space-x-3">
            <Link 
              to="/admin" 
              className="px-4 py-2 bg-dark-800 rounded-md hover:bg-dark-700 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-4 py-2 ${isSubmitting ? 'bg-purple/70' : 'bg-purple'} text-light-50 rounded-md hover:bg-primary-600 transition-colors`}
            >
              {isSubmitting 
                ? 'Saving...' 
                : (id === 'new' ? 'Add Product' : 'Save Changes')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductEdit; 