import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from './store/useAppStore';
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

// Create a DarkModeWrapper component to handle dark mode syncing
const DarkModeWrapper = ({ children }: { children: React.ReactNode }) => {
  // Use a stable selector
  const isDarkMode = useAppStore(state => state.isDarkMode);

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
      <DarkModeWrapper>
        <App />
      </DarkModeWrapper>
    </QueryClientProvider>
  </StrictMode>
);
