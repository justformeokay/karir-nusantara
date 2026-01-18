import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  setAccessToken,
  removeAccessToken,
  getAccessToken,
  type User as ApiUser,
  type RegisterRequest,
} from '@/api';

// ============================================
// TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// HELPERS
// ============================================

/**
 * Transform API user to frontend user format
 */
function transformUser(apiUser: ApiUser): User {
  return {
    id: String(apiUser.id),
    email: apiUser.email,
    name: apiUser.full_name,
    phone: apiUser.phone,
  };
}

// ============================================
// PROVIDER
// ============================================

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const apiUser = await getCurrentUser();
        if (apiUser) {
          setUser(transformUser(apiUser));
        } else {
          // Token invalid, clean up
          removeAccessToken();
          localStorage.removeItem('user');
        }
      } catch {
        // API error, try localStorage fallback
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem('user');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiLogin({ email, password });
      
      // Store token
      setAccessToken(response.access_token);
      
      // Transform and set user
      const transformedUser = transformUser(response.user);
      setUser(transformedUser);
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login gagal. Silakan coba lagi.';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const request: RegisterRequest = {
        full_name: name,
        email,
        password,
        ...(phone && { phone }),
      };

      const response = await apiRegister(request);
      
      // Store token
      setAccessToken(response.access_token);
      
      // Transform and set user
      const transformedUser = transformUser(response.user);
      setUser(transformedUser);
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registrasi gagal. Silakan coba lagi.';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiLogout();
    } catch {
      // Ignore logout errors, proceed with local cleanup
    } finally {
      removeAccessToken();
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('cvData');
      localStorage.removeItem('karir_applications');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
