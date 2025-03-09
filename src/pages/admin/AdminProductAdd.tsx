import { useState, Fragment } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { useToastContext } from '../../components/ToastProvider';
import { cx } from '../../utils/cn';
import { FaCheck } from 'react-icons/fa6';
import { productsDb, Product } from '../../services/productsApi';

// Role switcher component for demonstration purposes
const RoleSwitcher = () => {
  const [role, setRole] = useState(localStorage.getItem('user_role') || 'admin');
  
  const handleRoleChange = (newRole: string) => {
    localStorage.setItem('user_role', newRole);
    setRole(newRole);
    window.location.reload(); // Reload to apply changes
  };
  
  return (
    <div className="mb-6 p-3 rounded-md bg-dark-800 border border-dark-700">
      <h3 className="text-sm font-medium mb-2">Demo Mode: Switch User Role</h3>
      <div className="flex gap-3">
        <button 
          onClick={() => handleRoleChange('admin')}
          className={cx(
            "px-3 py-1.5 rounded-md text-sm transition-colors",
            role === 'admin' 
              ? "bg-purple text-white" 
              : "bg-dark-700 hover:bg-dark-600"
          )}
        >
          Admin
        </button>
        <button 
          onClick={() => handleRoleChange('contributor')}
          className={cx(
            "px-3 py-1.5 rounded-md text-sm transition-colors",
            role === 'contributor' 
              ? "bg-purple text-white" 
              : "bg-dark-700 hover:bg-dark-600"
          )}
        >
          Contributor
        </button>
      </div>
      <p className="mt-2 text-xs text-comment">
        This is for demonstration purposes only. In a real app, roles would be determined by authentication.
      </p>
    </div>
  );
};

const AdminProductAdd = () => {
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Basic product form state
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    brand: '',
    description: '',
    ingredients: '',
    health_score: 50,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_organic: false,
    is_published: false,
    category: '',
    user_submitted: false,
    image_url: '',
  });

  // Product categories
  const categories = [
    'Snacks',
    'Beverages',
    'Dairy',
    'Bakery',
    'Frozen',
    'Canned',
    'Condiments',
    'Cereals',
    'Sweets',
    'Proteins'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProduct({ ...product, [name]: checked });
    } else if (name === 'health_score') {
      setProduct({ ...product, [name]: parseInt(value, 10) });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Parse ingredients from comma-separated string to array
      const ingredientsArray = product.ingredients
        ? product.ingredients
            .split(',')
            .map(ingredient => ingredient.trim())
            .filter(ingredient => ingredient.length > 0)
        : [];
      
      // Get the user's role - in a real app, you'd get this from your auth context
      // For now we'll simulate this - replace with your actual auth logic
      const userRole = localStorage.getItem('user_role') || 'admin'; // Default to admin for testing
      const isAdmin = userRole === 'admin';
      
      // Set product status based on role
      // Admin: Published immediately
      // Contributor: Not published, needs approval
      const productData: Partial<Product> = {
        ...product,
        ingredients: ingredientsArray.join(', '), // Use the processed ingredients
        // Don't include submitted_by field to avoid permission issues
        submitted_by: undefined, 
        user_submitted: userRole !== 'admin', // Mark as user_submitted if not admin
        is_published: isAdmin ? true : false, // Auto-publish for admins only
        requires_approval: !isAdmin, // Flag for approval queue
        allergens: [], // Initialize with empty allergens
        tags: [] // Initialize with empty tags
      };
      
      // Create the product using Supabase
      const newProduct = await productsDb.create(productData as Product);
      
      // Log the new product for debugging
      console.log('Product created successfully:', newProduct);
      
      // Redirect based on role
      setTimeout(() => {
        // Always redirect to admin page since we don't have a separate contributor dashboard
        navigate('/admin');
        
        // Show a toast message based on role
        showToast({
          title: isAdmin ? 'Product Published' : 'Product Submitted',
          message: isAdmin 
            ? 'Your product has been published and is now live on the site.' 
            : 'Your product has been submitted for review by an admin.',
          type: 'success'
        });
      }, 2000);
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
      
      showToast({
        title: 'Error',
        message: 'There was a problem adding the product',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-8"
    >
      {/* Role switcher for demo purposes */}
      <RoleSwitcher />
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        
        <div className="flex items-center gap-3">
          {/* Role indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-dark-800">
            <span className="text-sm font-medium">
              Role:
            </span>
            <span className={cx(
              "text-sm font-medium px-2 py-0.5 rounded",
              localStorage.getItem('user_role') === 'admin' || !localStorage.getItem('user_role') 
                ? "bg-green/20 text-green" 
                : "bg-yellow/20 text-yellow"
            )}>
              {localStorage.getItem('user_role') === 'admin' || !localStorage.getItem('user_role') ? 'Admin' : 'Contributor'}
            </span>
          </div>
          
          <Link
            to="/admin"
            className="px-3 py-1.5 bg-dark-800 rounded-md hover:bg-dark-700 transition-colors text-sm"
          >
            Cancel
          </Link>
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-800 p-5 rounded-xl shadow-md">
        {/* Approval notice */}
        <div className={cx(
          "mb-6 p-3 rounded-md",
          localStorage.getItem('user_role') === 'admin' || !localStorage.getItem('user_role')
            ? "bg-green/10 border border-green/20"
            : "bg-yellow/10 border border-yellow/20"
        )}>
          <h3 className={cx(
            "text-sm font-medium mb-1",
            localStorage.getItem('user_role') === 'admin' || !localStorage.getItem('user_role')
              ? "text-green" 
              : "text-yellow"
          )}>
            {localStorage.getItem('user_role') === 'admin' || !localStorage.getItem('user_role')
              ? "Admin Publishing Mode" 
              : "Contributor Submission Mode"
            }
          </h3>
          <p className="text-sm text-comment">
            {localStorage.getItem('user_role') === 'admin' || !localStorage.getItem('user_role')
              ? "Products you add will be published immediately." 
              : "Products you add will be sent for approval before being published."
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red/10 border border-red/20 p-3 rounded-md">
            <p className="text-red">{error}</p>
          </div>
        )}

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
                  value={product.name}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-dark-800"
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
                  value={product.brand}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-dark-800"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Category <span className="text-red">*</span>
                </label>
                <div className="relative w-full">
                  <Listbox
                    value={product.category}
                    onChange={(value) => {
                      setProduct(prev => ({
                        ...prev,
                        category: value
                      }));
                    }}
                  >
                    <div className="relative">
                      <ListboxButton className="relative w-full cursor-default py-2 pl-3 pr-10 text-left rounded-md border border-dark-700 bg-dark-800">
                        <span className="block truncate">
                          {product.category || "Select a category"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </ListboxButton>
                      <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-dark-800 py-1 shadow-lg ring-1 ring-dark-700 ring-opacity-5 focus:outline-none">
                        {categories.map((category) => (
                          <ListboxOption
                            key={category}
                            value={category}
                            as={Fragment}
                          >
                            {({ active, selected }) => (
                              <li
                                className={cx(
                                  "relative cursor-default select-none py-2 pl-10 pr-4",
                                  active ? "bg-purple/10 text-light-50" : "text-gray-200"
                                )}
                              >
                                <span className={cx("block truncate", selected ? "font-medium" : "font-normal")}>
                                  {category}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple">
                                    <FaCheck className="h-4 w-4" />
                                  </span>
                                )}
                              </li>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                </div>
              </div>

              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium mb-1">
                  Ingredients <span className="text-red">*</span>
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  required
                  value={product.ingredients}
                  onChange={handleChange}
                  placeholder="Comma-separated list of ingredients"
                  rows={5}
                  className="textarea textarea-bordered w-full bg-dark-800"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={product.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="textarea textarea-bordered w-full bg-dark-800"
                />
              </div>
            </div>

            {/* Middle column - More details */}
            <div className="space-y-4">
              <div>
                <label htmlFor="health_score" className="block text-sm font-medium mb-1">
                  Health Score: {product.health_score}
                </label>
                <input
                  type="range"
                  id="health_score"
                  name="health_score"
                  min="0"
                  max="100"
                  value={product.health_score}
                  onChange={handleChange}
                  className="range range-sm range-primary w-full"
                />
                <div className="flex justify-between text-xs text-comment">
                  <span>Unhealthy</span>
                  <span>Neutral</span>
                  <span>Healthy</span>
                </div>
              </div>

              <div>
                <label htmlFor="image_url" className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={product.image_url || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered w-full bg-dark-800"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Product Image</h3>
                <div className="border border-dark-700 rounded-lg p-2 h-40 flex items-center justify-center">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name || 'Product'} 
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                      }}
                    />
                  ) : (
                    <div className="text-center text-comment">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-1 text-sm">No image provided</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column - Compatibility and submit */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Dietary Compatibility</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_vegan"
                      checked={product.is_vegan}
                      onChange={handleChange}
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    <span>Vegan</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_vegetarian"
                      checked={product.is_vegetarian}
                      onChange={handleChange}
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_gluten_free"
                      checked={product.is_gluten_free}
                      onChange={handleChange}
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    <span>Gluten Free</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_organic"
                      checked={product.is_organic}
                      onChange={handleChange}
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    <span>Organic</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={product.is_published}
                    onChange={handleChange}
                    className="checkbox checkbox-sm checkbox-primary"
                  />
                  <span>Publish immediately</span>
                </label>
              </div>

              <div className="mt-auto pt-4">
                <motion.button 
                  type="submit"
                  disabled={isSubmitting}
                  className={cx(
                    "btn btn-primary w-full",
                    isSubmitting && "loading"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Creating Product...' : 'Create Product'}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminProductAdd; 