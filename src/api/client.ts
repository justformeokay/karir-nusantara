import { API_BASE_URL, ACCESS_TOKEN_KEY } from './config';

// ============================================
// TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export class ApiException extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, string>;

  constructor(message: string, code: string, status: number, details?: Record<string, string>) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// ============================================
// TOKEN MANAGEMENT
// ============================================

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// ============================================
// BASE FETCH WRAPPER
// ============================================

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get('content-type');
  
  if (!contentType?.includes('application/json')) {
    if (!response.ok) {
      throw new ApiException(
        'Terjadi kesalahan pada server',
        'SERVER_ERROR',
        response.status
      );
    }
    return { success: true } as ApiResponse<T>;
  }

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    const error = json.error;
    throw new ApiException(
      error?.message || 'Terjadi kesalahan',
      error?.code || 'UNKNOWN_ERROR',
      response.status,
      error?.details
    );
  }

  return json;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { skipAuth = false, headers: customHeaders, body, ...rest } = options;

  // Check if body is FormData - if so, don't set Content-Type
  const isFormData = body instanceof FormData;

  const headers: HeadersInit = isFormData
    ? { ...customHeaders }
    : {
        'Content-Type': 'application/json',
        ...customHeaders,
      };

  // Add auth header if token exists and not skipped
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...rest,
      body,
      headers,
      credentials: 'include', // For refresh token cookies
    });

    // Handle 401 - Unauthorized (token expired)
    if (response.status === 401 && !skipAuth) {
      // Try to refresh token
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        // Retry the original request with new token
        const newToken = getAccessToken();
        if (newToken) {
          (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        }
        const retryResponse = await fetch(url, {
          ...rest,
          body,
          headers,
          credentials: 'include',
        });
        return handleResponse<T>(retryResponse);
      }
      
      // Refresh failed, clear auth state
      removeAccessToken();
      window.dispatchEvent(new CustomEvent('auth:logout'));
      throw new ApiException(
        'Sesi Anda telah berakhir. Silakan login kembali.',
        'SESSION_EXPIRED',
        401
      );
    }

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }

    // Network or other errors
    console.error('API Request failed:', error);
    throw new ApiException(
      'Gagal terhubung ke server. Periksa koneksi internet Anda.',
      'NETWORK_ERROR',
      0
    );
  }
}

// ============================================
// TOKEN REFRESH
// ============================================

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  // Prevent multiple simultaneous refresh attempts
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        return false;
      }

      const json: ApiResponse<{ access_token: string }> = await response.json();
      if (json.success && json.data?.access_token) {
        setAccessToken(json.data.access_token);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ============================================
// CONVENIENCE METHODS
// ============================================

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
