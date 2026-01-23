import { api } from './client';
import { ENDPOINTS, API_BASE_URL } from './config';

// ============================================
// TYPES
// ============================================

export interface PublicCompanyResponse {
  id: number;
  hash_id: string;
  company_name: string;
  company_description?: string;
  company_website?: string;
  company_logo_url?: string;
  company_industry?: string;
  company_size?: string;
  company_city?: string;
  company_province?: string;
  established_year?: number;
}

// Frontend-friendly Company type
export interface Company {
  id: number;
  hashId: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
  size?: string;
  city?: string;
  province?: string;
  establishedYear?: number;
}

// ============================================
// HELPERS
// ============================================

/**
 * Convert relative logo URL to absolute URL
 */
function getAbsoluteLogoUrl(logoPath?: string): string | undefined {
  if (!logoPath) return undefined;
  
  // If already absolute, return as is
  if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
    return logoPath;
  }
  
  // Convert relative path to absolute
  if (logoPath.startsWith('/')) {
    // Remove /api/v1 from API_BASE_URL to get backend base
    const backendBase = API_BASE_URL.replace('/api/v1', '');
    return `${backendBase}${logoPath}`;
  }
  
  return logoPath;
}

// ============================================
// TRANSFORMERS
// ============================================

function transformCompany(apiCompany: PublicCompanyResponse): Company {
  return {
    id: apiCompany.id,
    hashId: apiCompany.hash_id,
    name: apiCompany.company_name,
    description: apiCompany.company_description,
    website: apiCompany.company_website,
    logoUrl: getAbsoluteLogoUrl(apiCompany.company_logo_url),
    industry: apiCompany.company_industry,
    size: apiCompany.company_size,
    city: apiCompany.company_city,
    province: apiCompany.company_province,
    establishedYear: apiCompany.established_year,
  };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get public company profile by hash_id
 */
export async function getCompanyByHashId(hashId: string): Promise<Company | null> {
  try {
    // api.get returns ApiResponse<T> where data is already the company object
    const response = await api.get<PublicCompanyResponse>(ENDPOINTS.COMPANIES.BY_HASH_ID(hashId));
    if (response.data) {
      return transformCompany(response.data);
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching company:', error);
    if (error.status === 404 || error.code === 'NOT_FOUND') {
      return null;
    }
    throw error;
  }
}
