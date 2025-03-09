import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session, User } from '@supabase/supabase-js';
import { 
  signIn, 
  signOut, 
  getCurrentUser,
  getCurrentSession,
  SignInCredentials
} from '../services/supabase';

interface AdminAuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loginAdmin: (credentials: SignInCredentials) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  checkAdminSession: () => Promise<void>;
  clearError: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      session: null,
      isLoading: false,
      error: null,
      
      loginAdmin: async (credentials: SignInCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await signIn(credentials);
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }
          
          // Check if the user has admin role
          // This logic depends on how you've set up your admin users in Supabase
          // You might need to check a specific claim or user metadata
          const isAdmin = data.user?.app_metadata?.role === 'admin' || 
                          data.user?.user_metadata?.isAdmin === true;
          
          if (!isAdmin) {
            set({ 
              error: 'Access denied. You do not have admin privileges.', 
              isLoading: false,
              isAuthenticated: false,
              user: null,
              session: null
            });
            // Sign them out since they're not an admin
            await signOut();
            return;
          }
          
          set({ 
            isAuthenticated: true,
            user: data.user,
            session: data.session,
            isLoading: false 
          });
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'An unknown error occurred', 
            isLoading: false 
          });
        }
      },
      
      logoutAdmin: async () => {
        set({ isLoading: true });
        
        try {
          const { error } = await signOut();
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }
          
          set({ 
            isAuthenticated: false,
            user: null,
            session: null,
            isLoading: false 
          });
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'An unknown error occurred', 
            isLoading: false 
          });
        }
      },
      
      checkAdminSession: async () => {
        set({ isLoading: true });
        
        try {
          // Check for existing session
          const { data: sessionData, error: sessionError } = await getCurrentSession();
          
          if (sessionError || !sessionData.session) {
            set({ 
              isAuthenticated: false, 
              user: null, 
              session: null,
              isLoading: false 
            });
            return;
          }
          
          // Get user data
          const { user, error: userError } = await getCurrentUser();
          
          if (userError || !user) {
            set({ 
              isAuthenticated: false, 
              user: null, 
              session: null,
              isLoading: false 
            });
            return;
          }
          
          // Check admin status
          const isAdmin = user.app_metadata?.role === 'admin' || 
                          user.user_metadata?.isAdmin === true;
          
          if (!isAdmin) {
            set({ 
              isAuthenticated: false, 
              user: null, 
              session: null,
              isLoading: false 
            });
            // Sign them out since they're not an admin
            await signOut();
            return;
          }
          
          set({ 
            isAuthenticated: true,
            user,
            session: sessionData.session,
            isLoading: false 
          });
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'An unknown error occurred', 
            isLoading: false 
          });
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'admin-auth-storage',
      // Only persist non-sensitive data
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAdminAuthStore; 