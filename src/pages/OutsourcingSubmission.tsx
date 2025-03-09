import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductPlaceholderSVG } from '../utils/placeholders';
import { cx } from '../utils/cn';
import { productsDb, Product } from '../services/productsApi';
import { useToastContext } from '../components/ToastProvider';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from '@headlessui/react';
import { FaCheck } from 'react-icons/fa6';

/**
 * OutsourcingSubmission - A page that allows public users to contribute
 * to the food database by submitting product information.
 */
const OutsourcingSubmission = () => {
  // Submission step tracking
  const [step, setStep] = useState(1); // 1: form, 2: success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  // Form state
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
      dairyFree: false,
    },
    contactEmail: '',
    notes: '',
    sourceUrl: '',
    verificationImage: null as File | null,
  });

  // Categories for the select dropdown
  const categories = [
    { id: 1, name: 'Snacks' },
    { id: 2, name: 'Dairy' },
    { id: 3, name: 'Beverages' },
    { id: 4, name: 'Bakery' },
    { id: 5, name: 'Ready to Eat' },
    { id: 6, name: 'Cereals' },
    { id: 7, name: 'Sauces & Condiments' },
    { id: 8, name: 'Confectionery' },
  ];

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle compatibility checkbox changes
  const handleCompatibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      compatibility: {
        ...prev.compatibility,
        [name]: checked,
      },
    }));
  };

  // Handle health score change
  const handleHealthScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData(prev => ({
      ...prev,
      healthScore: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        verificationImage: e.target.files?.[0] || null,
      }));
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.brand || !formData.category || !formData.ingredients) {
        throw new Error('Please fill in all required fields');
      }

      // Convert ingredients string to array
      const ingredientsArray = formData.ingredients
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0);

      // Prepare submission data for Supabase
      const productData: Partial<Product> = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        ingredients: ingredientsArray.join(', '),
        health_score: formData.healthScore,
        image_url: formData.imageUrl || undefined,
        is_vegetarian: formData.compatibility.vegetarian,
        is_vegan: formData.compatibility.vegan,
        is_gluten_free: formData.compatibility.glutenFree,
        user_submitted: true,
        is_published: false, // Contributor submissions start unpublished
        description: formData.notes || undefined
      };

      // Store contributor email in notes if provided
      if (formData.contactEmail) {
        productData.description = `${productData.description || ''}\n\nSubmitted by: ${formData.contactEmail}`;
      }

      // If source URL provided, add to description
      if (formData.sourceUrl) {
        productData.description = `${productData.description || ''}\n\nSource: ${formData.sourceUrl}`;
      }

      // Submit to Supabase
      console.log('Submitting to Supabase:', productData);
      await productsDb.create(productData as Product);
      
      showToast({
        title: 'Submission Successful',
        message: 'Your product submission has been received and is awaiting approval.',
        type: 'success'
      });

      // Move to success step
      setStep(2);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit contribution. Please try again.');
      }
      console.error('Error submitting contribution:', err);
      
      showToast({
        title: 'Submission Failed',
        message: err instanceof Error ? err.message : 'An error occurred while submitting your product',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form for another submission
  const handleSubmitAnother = () => {
    setFormData({
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
        dairyFree: false,
      },
      contactEmail: '',
      notes: '',
      sourceUrl: '',
      verificationImage: null,
    });
    setStep(1);
  };

  // Go to home page after successful submission
  const goToHome = () => {
    navigate('/');
  };

  // Render the appropriate step
  return (
    <motion.div
      className="relative mb-12 mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {step === 1 ? (
        // Form Step
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Contribute to Our Database</h1>
            <p className="text-comment mt-2">
              Help us expand our food product database by submitting details about products you've found.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red/10 p-4 text-red">
              <p>{error}</p>
            </div>
          )}

          <div className="mx-auto max-w-3xl rounded-lg border border-dark-800 bg-dark-900 shadow-xl">
            <div className="border-b border-dark-800 p-5">
              <h2 className="text-xl font-semibold">Product Information</h2>
              <p className="mt-1 text-sm text-comment">Fields marked with * are required</p>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left column - Basic info */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium">
                      Product Name <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input input-bordered bg-dark-800 w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="brand" className="mb-1 block text-sm font-medium">
                      Brand <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      required
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="input input-bordered bg-dark-800 w-full"
                    />
                  </div>

                  <div className="relative">
                    <label className="mb-1 block text-sm font-medium">
                      Category <span className="text-red">*</span>
                    </label>
                    <div className="relative w-full">
                      <Listbox
                        value={formData.category}
                        onChange={value => {
                          setFormData(prev => ({
                            ...prev,
                            category: value,
                          }));
                        }}
                      >
                        <ListboxButton className="bg-dark-800 border-dark-700 w-full cursor-default rounded-md border py-2 pr-10 pl-3 text-left">
                          <span className="block truncate">
                            {formData.category || 'Select a category'}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
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
                            className="bg-dark-800 ring-opacity-5 absolute z-10 mt-1 max-h-60 overflow-auto rounded-md py-1 shadow-lg ring-1 ring-black focus:outline-none"
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
                    <label htmlFor="sourceUrl" className="mb-1 block text-sm font-medium">
                      Source URL
                    </label>
                    <input
                      type="url"
                      id="sourceUrl"
                      name="sourceUrl"
                      value={formData.sourceUrl}
                      onChange={handleInputChange}
                      placeholder="https://brand-website.com/product"
                      className="input input-bordered bg-dark-800 w-full"
                    />
                    <p className="text-comment mt-1 text-xs">
                      Link to the official product page or where you found this information
                    </p>
                  </div>
                </div>

                {/* Middle column - More details */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="ingredients" className="mb-1 block text-sm font-medium">
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
                      className="textarea textarea-bordered bg-dark-800 w-full"
                    />
                    <p className="text-comment mt-1 text-xs">
                      As listed on the packaging, separated by commas
                    </p>
                  </div>

                  <div>
                    <label htmlFor="healthScore" className="mb-1 block text-sm font-medium">
                      Your Health Score Rating: {formData.healthScore}
                    </label>
                    <input
                      type="range"
                      id="healthScore"
                      name="healthScore"
                      min="0"
                      max="100"
                      value={formData.healthScore}
                      onChange={handleHealthScoreChange}
                      className="range range-sm range-primary w-full"
                    />
                    <div className="text-comment flex justify-between text-xs">
                      <span>Unhealthy</span>
                      <span>Neutral</span>
                      <span>Healthy</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="mb-1 block text-sm font-medium">
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional information you'd like to share..."
                      rows={3}
                      className="textarea textarea-bordered bg-dark-800 w-full"
                    />
                  </div>
                </div>

                {/* Right column - Compatibility, image, and contact */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="imageUrl" className="mb-1 block text-sm font-medium">
                      Product Image URL
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="input input-bordered bg-dark-800 w-full"
                    />
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium">Product Image</h3>
                    <div className="border-dark-700 mb-2 flex h-32 items-center justify-center rounded-lg border p-2">
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl}
                          alt={formData.name || 'Product'}
                          className="max-h-full max-w-full object-contain"
                          onError={e => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                          }}
                        />
                      ) : (
                        <ProductPlaceholderSVG className="text-dark-700 h-16 w-16" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="verificationImage" className="mb-1 block text-sm font-medium">
                      Upload Packaging Image
                    </label>
                    <input
                      type="file"
                      id="verificationImage"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input file-input-bordered bg-dark-800 w-full"
                    />
                    <p className="text-comment mt-1 text-xs">
                      Upload a clear image of the packaging to help verify information
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium">Dietary Compatibility</h3>
                    <div className="space-y-2">
                      <label className="flex cursor-pointer items-center space-x-2">
                        <input
                          type="checkbox"
                          name="vegan"
                          checked={formData.compatibility.vegan}
                          onChange={handleCompatibilityChange}
                          className="checkbox checkbox-sm checkbox-primary"
                        />
                        <span>Vegan</span>
                      </label>
                      <label className="flex cursor-pointer items-center space-x-2">
                        <input
                          type="checkbox"
                          name="vegetarian"
                          checked={formData.compatibility.vegetarian}
                          onChange={handleCompatibilityChange}
                          className="checkbox checkbox-sm checkbox-primary"
                        />
                        <span>Vegetarian</span>
                      </label>
                      <label className="flex cursor-pointer items-center space-x-2">
                        <input
                          type="checkbox"
                          name="glutenFree"
                          checked={formData.compatibility.glutenFree}
                          onChange={handleCompatibilityChange}
                          className="checkbox checkbox-sm checkbox-primary"
                        />
                        <span>Gluten Free</span>
                      </label>
                      <label className="flex cursor-pointer items-center space-x-2">
                        <input
                          type="checkbox"
                          name="dairyFree"
                          checked={formData.compatibility.dairyFree}
                          onChange={handleCompatibilityChange}
                          className="checkbox checkbox-sm checkbox-primary"
                        />
                        <span>Dairy Free</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="mb-1 block text-sm font-medium">
                      Contact Email (optional)
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="input input-bordered bg-dark-800 w-full"
                    />
                    <p className="text-comment mt-1 text-xs">
                      We'll only use this to contact you if we need clarification about your submission
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={cx('btn btn-primary', isSubmitting && 'loading')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Success Step
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-lg">
            <div className="mb-8 flex flex-col items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green/20 text-green">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-bold">Submission Successful!</h2>
              <p className="mt-2 text-comment">
                Thank you for contributing! Your submission will be reviewed by our team before being added to the database.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={goToHome}
                className="rounded-md bg-dark-800 px-6 py-2 transition-colors hover:bg-dark-700"
              >
                Return to Home
              </button>
              <button
                onClick={handleSubmitAnother}
                className="rounded-md bg-purple px-6 py-2 text-white transition-colors hover:bg-purple/80"
              >
                Submit Another Product
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OutsourcingSubmission;
