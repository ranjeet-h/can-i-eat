import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from './store/useAppStore';
import { useAdminAuthStore } from './store/useAdminAuthStore';
import App from './App.tsx';
import './index.css';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Create a AppWrapper component to handle initialization
const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  // Use a stable selector
  const isDarkMode = useAppStore(state => state.isDarkMode);
  // Check admin auth status on app load
  const checkAdminSession = useAdminAuthStore(state => state.checkAdminSession);
  // Track initial load
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Apply dark mode class to HTML element when necessary
    // For a dark theme by default, we don't need to toggle classes
    if (!isDarkMode) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [isDarkMode]);

  // Check admin session when app loads
  useEffect(() => {
    checkAdminSession();
  }, [checkAdminSession]);

  // Signal that React has loaded
  useEffect(() => {
    if (initialLoad) {
      // A small delay to ensure everything is rendered
      const timer = setTimeout(() => {
        // Send a message to index.html when React has mounted
        window.postMessage('can-i-eat-react-loaded', '*');
        console.log('React app fully loaded');
        setInitialLoad(false);
      }, 300); // Reasonable delay for actual app loading
      
      return () => clearTimeout(timer);
    }
  }, [initialLoad]);

  return <>{children}</>;
};

// Set default theme color in meta tag
const setDefaultMetaThemeColor = () => {
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  meta.content = '#282a36'; // Dracula background color
  document.head.appendChild(meta);
};

// Call this function immediately
setDefaultMetaThemeColor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppWrapper>
        <App />
      </AppWrapper>
    </QueryClientProvider>
  </StrictMode>
);
