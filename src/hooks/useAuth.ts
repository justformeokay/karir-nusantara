import { useMutation } from '@tanstack/react-query';
import {
  login,
  register,
  logout,
  getCurrentUser,
  refreshToken,
  setAccessToken,
  removeAccessToken,
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
} from '@/api';

// ============================================
// HOOKS
// ============================================

/**
 * Hook to login
 */
export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await login(credentials);
      return response;
    },
  });
}

/**
 * Hook to register
 */
export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await register(data);
      return response;
    },
  });
}

/**
 * Hook to logout
 */
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await logout();
      removeAccessToken();
    },
  });
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  return useMutation({
    mutationFn: getCurrentUser,
  });
}

/**
 * Hook to refresh token
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: async () => {
      const newToken = await refreshToken();
      return newToken;
    },
  });
}
