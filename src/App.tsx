import { useAppStore } from './store/useAppStore';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductEdit from './pages/admin/AdminProductEdit';
import AdminProductAdd from './pages/admin/AdminProductAdd';
import AdminProductDelete from './pages/admin/AdminProductDelete';
import AdminSubmissionReview from './pages/admin/AdminSubmissionReview';
import AdminApproval from './pages/admin/AdminApproval';
import AdminLogin from './pages/admin/AdminLogin';
import PublicSubmission from './pages/PublicSubmission';
import OutsourcingSubmission from './pages/OutsourcingSubmission';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import ToastProvider from './components/ToastProvider';
import ProductDetail from './pages/ProductDetail';

// Modern Logo component with Dracula theme colors
const Logo = () => (
  <motion.div
    className="logo"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Link to="/" className="flex items-center gap-1">
      <span className="text-pink">Can</span> <span className="text-foreground">I</span>{' '}
      <span className="text-purple">Eat</span>
      <motion.div
        className="from-purple to-pink absolute -bottom-1 left-0 h-1 rounded-full bg-gradient-to-r"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
      />
    </Link>
  </motion.div>
);

function App() {
  // Use separate selectors for better performance
  // const isDarkMode = useAppStore(state => state.isDarkMode);
  // const toggleDarkMode = useAppStore(state => state.toggleDarkMode);

  return (
    <Router>
      <ToastProvider>
        <motion.div
          className="bg-background text-foreground min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="from-purple via-pink to-cyan h-1 w-full bg-gradient-to-r"></div>
          <header className="border-current-line border-b">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
              <Logo />
              <div className="flex items-center space-x-4">
                {/* <Link
                  to="/submit"
                  className="text-sm font-medium hover:text-purple transition-colors"
                >
                  Submit Product
                </Link> */}
                <Link
                  to="/contribute"
                  className="text-sm font-medium hover:text-purple transition-colors"
                >
                  Contribute
                </Link>
                {/* <motion.button
                  onClick={toggleDarkMode}
                  className="bg-current-line text-foreground hover:bg-dark-700 rounded-md p-2 transition-colors"
                  aria-label="Toggle dark mode"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </motion.button> */}
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/submit" element={<PublicSubmission />} />
              <Route path="/contribute" element={<OutsourcingSubmission />} />
              
              {/* Admin Auth Route */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/product/new"
                element={
                  <AdminProtectedRoute>
                    <AdminProductAdd />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/product/:id"
                element={
                  <AdminProtectedRoute>
                    <AdminProductEdit />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/product/delete/:id"
                element={
                  <AdminProtectedRoute>
                    <AdminProductDelete />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/submissions"
                element={
                  <AdminProtectedRoute>
                    <AdminSubmissionReview />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/submissions/:id"
                element={
                  <AdminProtectedRoute>
                    <AdminApproval />
                  </AdminProtectedRoute>
                }
              />
              
              {/* 404 Page */}
              <Route
                path="*"
                element={
                  <div className="py-20 text-center">
                    <h1 className="text-3xl font-bold">Page Not Found</h1>
                  </div>
                }
              />
            </Routes>
          </main>

          <footer className="border-current-line mt-auto border-t">
            <div className="text-comment container mx-auto px-4 py-6 text-center">
              <p>© {new Date().getFullYear()} Can I Eat. All rights reserved.</p>
            </div>
          </footer>
        </motion.div>
      </ToastProvider>
    </Router>
  );
}

export default App;
