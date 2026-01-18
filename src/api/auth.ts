import { api, setAccessToken, removeAccessToken } from './client';
import { ENDPOINTS } from './config';

// ============================================
// TYPES
// ============================================

export interface User {
  id: number;
  email: string;
  full_name: string;
  name?: string; // Alias for compatibility
  role: 'job_seeker' | 'company' | 'admin';
  phone?: string;
  avatar_url?: string;
  // Company fields (only for role: company)
  company_name?: string;
  company_description?: string;
  company_industry?: string;
  company_size?: string;
  company_location?: string;
  company_logo_url?: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  expires_in: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: 'job_seeker' | 'company';
  phone?: string;
  // Company fields
  company_name?: string;
  company_description?: string;
  company_industry?: string;
  company_size?: string;
  company_location?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ============================================
// AUTH API FUNCTIONS
// ============================================

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    ENDPOINTS.AUTH.REGISTER,
    data,
    { skipAuth: true }
  );
  
  if (response.data) {
    setAccessToken(response.data.access_token);
    return response.data;
  }
  
  throw new Error('Registration failed');
}

/**
 * Login user
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    ENDPOINTS.AUTH.LOGIN,
    data,
    { skipAuth: true }
  );
  
  if (response.data) {
    setAccessToken(response.data.access_token);
    return response.data;
  }
  
  throw new Error('Login failed');
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  try {
    await api.post(ENDPOINTS.AUTH.LOGOUT);
  } finally {
    // Always clear local token
    removeAccessToken();
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<User>(ENDPOINTS.AUTH.ME);
    return response.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<string | null> {
  try {
    const response = await api.post<{ access_token: string }>(
      ENDPOINTS.AUTH.REFRESH,
      undefined,
      { skipAuth: true }
    );
    
    if (response.data?.access_token) {
      setAccessToken(response.data.access_token);
      return response.data.access_token;
    }
    return null;
  } catch {
    return null;
  }
}
