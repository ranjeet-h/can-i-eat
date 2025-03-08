import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the store state type
interface AppState {
  isDarkMode: boolean;
  isAuthenticated: boolean;
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
  };

  // Actions
  toggleDarkMode: () => void;
  login: (userData: { id: string; name: string; email: string }) => void;
  logout: () => void;
}

// Safely check for window/localStorage availability
const isBrowser = typeof window !== 'undefined';

// Create the store with persistence
export const useAppStore = create<AppState>()(
  persist(
    set => ({
      // Initial state - always default to dark mode
      isDarkMode: true,
      isAuthenticated: false,
      user: {
        id: null,
        name: null,
        email: null,
      },

      // Actions
      toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),

      login: userData =>
        set(() => ({
          isAuthenticated: true,
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
          },
        })),

      logout: () =>
        set(() => ({
          isAuthenticated: false,
          user: {
            id: null,
            name: null,
            email: null,
          },
        })),
    }),
    {
      name: 'app-storage', // Unique name for localStorage
      storage: createJSONStorage(() =>
        isBrowser
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => undefined,
              removeItem: () => undefined,
            }
      ),
      partialize: state => ({
        isDarkMode: state.isDarkMode,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
