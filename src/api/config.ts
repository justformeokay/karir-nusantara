// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';
export const STATIC_BASE_URL = import.meta.env.VITE_STATIC_URL || 'http://localhost:8081';

// Token storage keys
export const ACCESS_TOKEN_KEY = 'karir_access_token';
export const REFRESH_TOKEN_KEY = 'karir_refresh_token';

// API Endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Jobs
  JOBS: {
    LIST: '/jobs',
    BY_ID: (id: string) => `/jobs/${id}`,
    BY_SLUG: (slug: string) => `/jobs/slug/${slug}`,
    COMPANY: '/jobs/company',
  },
  
  // CV
  CV: {
    GET: '/cv',
    CREATE_OR_UPDATE: '/cv',
    DELETE: '/cv',
  },
  
  // Applications
  APPLICATIONS: {
    APPLY: '/applications',
    CREATE: '/applications',
    MY_APPLICATIONS: '/applications/me',
    LIST_MINE: '/applications/me',
    BY_ID: (id: number | string) => `/applications/${id}`,
    TIMELINE: (id: number | string) => `/applications/${id}/timeline`,
    WITHDRAW: (id: number | string) => `/applications/${id}/withdraw`,
  },
  
  // Wishlist (Saved Jobs)
  WISHLIST: {
    LIST: '/wishlist',
    SAVE: '/wishlist',
    STATS: '/wishlist/stats',
    CHECK: (jobId: number | string) => `/wishlist/check/${jobId}`,
    REMOVE: (jobId: number | string) => `/wishlist/${jobId}`,
  },
  
  // Companies (Public)
  COMPANIES: {
    BY_HASH_ID: (hashId: string) => `/companies/${hashId}`,
  },
  
  // Recommendations
  RECOMMENDATIONS: {
    GET: '/recommendations',
  },
} as const;
