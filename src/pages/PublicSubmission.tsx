import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cx } from '../utils/cn';
import { ProductPlaceholderSVG } from '../utils/placeholders';
import AutocompleteSearchBar from '../components/search/AutocompleteSearchBar';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react';
import { FaCheck } from 'react-icons/fa6';

const PublicSubmission = () => {
  const [submissionType, setSubmissionType] = useState<'new' | 'edit'>('new');
  const [step, setStep] = useState(1); // 1: type selection, 2: product form, 3: success
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    ingredients: '',
    healthScore: 50,
    compatibility: {
      vegan: false,
      vegetarian: false,
      glutenFree: false,
      dairyFree: false
    },
    contactEmail: '',
    notes: ''
  });
  
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
  
  // Handle search for existing product
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for product:', query);
    
    // Note: In a real implementation, this would trigger a database search
    // and update the products shown in search results based on the query
  };
  
  // Handle product selection for edit
  const handleProductSelect = (productId: number) => {
    setSelectedProductId(productId);
    // In a real app, you would fetch product details here and populate the form
    
    // Move to step 2 for editing
    setStep(2);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert ingredients string to array
    const ingredientsArray = formData.ingredients
      .split(',')
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0);
    
    const submissionData = {
      type: submissionType,
      ...(submissionType === 'edit' && selectedProductId ? { originalProductId: selectedProductId } : {}),
      product: {
        ...formData,
        ingredients: ingredientsArray
      },
      contactEmail: formData.contactEmail,
      notes: formData.notes
    };
    
    // Simulate API call - replace with real submission when connected to Supabase
    console.log('Submitting data:', submissionData);
    
    // Move to success step
    setTimeout(() => {
      setStep(3);
    }, 1000);
  };
  
  // Categories for the select dropdown
  const categories = [
    { id: 1, name: 'Snacks' },
    { id: 2, name: 'Beverages' },
    { id: 3, name: 'Dairy' },
    { id: 4, name: 'Breakfast' },
    { id: 5, name: 'Ready to Eat' },
    { id: 6, name: 'Chocolates' },
  ];
  
  // Render step 1: Submission type selection
  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Submit a Product</h1>
      
      <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden p-6">
        <h2 className="text-xl font-bold mb-4">What would you like to do?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.button
            className={cx(
              "p-6 rounded-lg border-2 text-left transition-colors",
              submissionType === 'new' 
                ? "border-purple bg-purple/10" 
                : "border-dark-800 hover:bg-dark-800/30"
            )}
            onClick={() => setSubmissionType('new')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">➕</span>
              <h3 className="font-bold">Add a New Product</h3>
            </div>
            <p className="text-sm text-comment">
              Submit a new food product that is not yet in our database
            </p>
          </motion.button>
          
          <motion.button
            className={cx(
              "p-6 rounded-lg border-2 text-left transition-colors",
              submissionType === 'edit' 
                ? "border-purple bg-purple/10" 
                : "border-dark-800 hover:bg-dark-800/30"
            )}
            onClick={() => setSubmissionType('edit')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">✏️</span>
              <h3 className="font-bold">Edit an Existing Product</h3>
            </div>
            <p className="text-sm text-comment">
              Suggest changes or corrections to a product already in our database
            </p>
          </motion.button>
        </div>
        
        {submissionType === 'edit' && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Search for the product you want to edit:</h3>
            <AutocompleteSearchBar 
              onSearch={handleSearch}
              placeholder="Search by product name or brand..."
            />
            
            <div className="mt-4">
              {/* This would be a real product list fetched based on the search query */}
              <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                <h4 className="font-medium mb-2">Search Results</h4>
                <ul className="space-y-2">
                  <li 
                    className="p-2 hover:bg-dark-700 rounded cursor-pointer transition-colors"
                    onClick={() => handleProductSelect(101)}
                  >
                    Lays Classic Potato Chips (Lays)
                  </li>
                  <li 
                    className="p-2 hover:bg-dark-700 rounded cursor-pointer transition-colors"
                    onClick={() => handleProductSelect(103)}
                  >
                    Maggi 2-Minute Noodles (Nestle)
                  </li>
                  <li 
                    className="p-2 hover:bg-dark-700 rounded cursor-pointer transition-colors"
                    onClick={() => handleProductSelect(102)}
                  >
                    Amul Pure Milk (Amul)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <motion.button
            className={cx(
              "btn btn-primary", 
              (submissionType === 'edit' && !selectedProductId) && "btn-disabled"
            )}
            onClick={() => submissionType === 'new' ? setStep(2) : null}
            disabled={submissionType === 'edit' && !selectedProductId}
            whileHover={submissionType === 'new' ? { scale: 1.05 } : {}}
            whileTap={submissionType === 'new' ? { scale: 0.95 } : {}}
          >
            Continue
          </motion.button>
        </div>
      </div>
    </div>
  );
  
  // Render step 2: Product form
  const renderStep2 = () => (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {submissionType === 'new' ? 'Add New Product' : 'Suggest Edits for Product'}
        </h1>
        <button 
          onClick={() => setStep(1)}
          className="text-comment hover:text-foreground"
        >
          ← Back
        </button>
      </div>
      
      <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
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
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-dark-800"
                />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Category <span className="text-red">*</span>
                </label>
                <div className="relative w-full">
                  <Listbox
                    value={formData.category}
                    onChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        category: value
                      }));
                    }}
                  >
                    <ListboxButton className="w-full cursor-default py-2 pl-3 pr-10 text-left bg-dark-800 border border-dark-700 rounded-md">
                      <span className="block truncate">
                        {formData.category || "Select a category"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </ListboxButton>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <ListboxOptions 
                        anchor="bottom" 
                        className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-dark-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        {categories.map((category) => (
                          <ListboxOption
                            key={category.id}
                            value={category.name}
                            className={cx(
                              "relative cursor-default select-none py-2 pl-10 pr-4",
                              "data-[focus]:bg-purple/10 data-[focus]:text-light-50",
                              "data-[selected]:font-medium"
                            )}
                          >
                            {({ selected }) => (
                              <>
                                <span className="block truncate">
                                  {category.name}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple">
                                    <FaCheck className="h-4 w-4" />
                                  </span>
                                )}
                              </>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </Transition>
                  </Listbox>
                </div>
              </div>
              
              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium mb-1">
                  Ingredients <span className="text-red">*</span>
                </label>
                <p className="text-xs text-comment mb-1">
                  Enter ingredients separated by commas
                </p>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  required
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  rows={4}
                  className="textarea textarea-bordered w-full bg-dark-800"
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
                  step="1"
                  value={formData.healthScore}
                  onChange={handleHealthScoreChange}
                  className="range range-sm range-primary w-full"
                />
                <div className="flex justify-between text-xs text-comment">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>
            
            {/* Right column */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Dietary Compatibility</h3>
                <div className="space-y-2 bg-dark-800 p-3 rounded-md border border-dark-700">
                  {Object.entries(formData.compatibility).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name={key}
                        checked={value}
                        onChange={handleCompatibilityChange}
                        className="checkbox checkbox-sm checkbox-primary"
                      />
                      <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">
                  Contact Email <span className="text-red">*</span>
                </label>
                <p className="text-xs text-comment mb-1">
                  We'll only use this to contact you if we need more information
                </p>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  required
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-dark-800"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="textarea textarea-bordered w-full bg-dark-800"
                  placeholder="Any additional information you'd like to share..."
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Product Image</h3>
                <div className="border-2 border-dashed border-dark-700 rounded-md p-4 text-center">
                  <ProductPlaceholderSVG width={200} height={150} className="mx-auto" />
                  <p className="mt-2 text-sm text-comment">
                    Product image upload will be available in a future update
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form actions */}
          <div className="mt-8 pt-4 border-t border-dark-800 flex justify-end space-x-3">
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="btn btn-outline"
            >
              Back
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
  // Render step 3: Success message
  const renderStep3 = () => (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-dark-900 rounded-lg border border-dark-800 p-8 text-center">
        <div className="w-16 h-16 bg-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Submission Received!</h1>
        <p className="text-comment mb-6">
          Thank you for your contribution. Our team will review your submission and update our database accordingly.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="btn btn-outline"
          >
            Return Home
          </Link>
          <button
            onClick={() => {
              // Reset form and go back to step 1
              setFormData({
                name: '',
                brand: '',
                category: '',
                ingredients: '',
                healthScore: 50,
                compatibility: {
                  vegan: false,
                  vegetarian: false,
                  glutenFree: false,
                  dairyFree: false
                },
                contactEmail: '',
                notes: ''
              });
              setSubmissionType('new');
              setSelectedProductId(null);
              setStep(1);
            }}
            className="btn btn-primary"
          >
            Submit Another
          </button>
        </div>
      </div>
    </div>
  );
  
  // Render the appropriate step
  return (
    <div className="public-submission">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default PublicSubmission; 