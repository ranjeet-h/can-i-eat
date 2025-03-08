import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import './Layout.css';

// Modern Logo component with Dracula theme colors
const Logo = () => (
  <motion.div
    className="logo"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <span className="text-pink">Can</span> <span className="text-foreground">I</span>{' '}
    <span className="text-purple">Eat</span>
    <motion.div
      className="from-purple to-pink absolute -bottom-1 left-0 h-1 rounded-full bg-gradient-to-r"
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
    />
  </motion.div>
);

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Use separate selectors for better performance
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const toggleDarkMode = useAppStore(state => state.toggleDarkMode);

  return (
    <motion.div
      className="layout-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-gradient"></div>
      <header className="app-header">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Logo />
          <motion.button
            onClick={toggleDarkMode}
            className="theme-toggle-btn"
            aria-label="Toggle dark mode"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </motion.button>
        </div>
      </header>

      <main className="app-main container mx-auto px-4">{children}</main>

      <footer className="app-footer">
        <div className="text-comment container mx-auto px-4 py-6 text-center">
          <p>© {new Date().getFullYear()} Can I Eat. All rights reserved.</p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Layout;
