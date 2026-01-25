import { api, PaginationMeta } from './client';
import { ENDPOINTS } from './config';

// ============================================
// TYPES
// ============================================

export interface WishlistJobCompany {
  id: number;
  name: string;
  logo_url?: string;
}

export interface WishlistJob {
  id: number;
  title: string;
  slug: string;
  city: string;
  province: string;
  is_remote: boolean;
  job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experience_level: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  salary_min?: number;
  salary_max?: number;
  status: string;
  created_at: string;
  company?: WishlistJobCompany;
}

export interface WishlistItem {
  id: number;
  job_id: number;
  saved_at: string;
  job: WishlistJob;
}

export interface WishlistListResponse {
  data: WishlistItem[];
  meta: PaginationMeta;
}

export interface WishlistStats {
  total_saved: number;
}

export interface SaveJobRequest {
  job_id: number;
}

// ============================================
// TRANSFORMED TYPES (Frontend-friendly)
// ============================================

export interface SavedJob {
  id: number;
  jobId: number;
  savedAt: string;
  job: {
    id: number;
    title: string;
    slug: string;
    city: string;
    province: string;
    location: string;
    isRemote: boolean;
    jobType: string;
    experienceLevel: string;
    salaryMin?: number;
    salaryMax?: number;
    status: string;
    createdAt: string;
    company: {
      id: number;
      name: string;
      logoUrl?: string;
    };
  };
}

// ============================================
// TRANSFORMERS
// ============================================

function transformWishlistItem(item: WishlistItem): SavedJob {
  return {
    id: item.id,
    jobId: item.job_id,
    savedAt: item.saved_at,
    job: {
      id: item.job.id,
      title: item.job.title,
      slug: item.job.slug,
      city: item.job.city,
      province: item.job.province,
      location: `${item.job.city}, ${item.job.province}`,
      isRemote: item.job.is_remote,
      jobType: item.job.job_type,
      experienceLevel: item.job.experience_level,
      salaryMin: item.job.salary_min,
      salaryMax: item.job.salary_max,
      status: item.job.status,
      createdAt: item.job.created_at,
      company: {
        id: item.job.company?.id || 0,
        name: item.job.company?.name || 'Unknown Company',
        logoUrl: item.job.company?.logo_url,
      },
    },
  };
}

// ============================================
// WISHLIST API FUNCTIONS
// ============================================

/**
 * Get all saved jobs (wishlist)
 */
export async function getWishlist(params: {
  page?: number;
  per_page?: number;
} = {}): Promise<{ items: SavedJob[]; meta: PaginationMeta }> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.per_page) searchParams.set('per_page', String(params.per_page));
  
  const queryString = searchParams.toString();
  const endpoint = queryString 
    ? `${ENDPOINTS.WISHLIST.LIST}?${queryString}`
    : ENDPOINTS.WISHLIST.LIST;
  
  // Backend returns { success: true, data: [...], meta: {...} }
  // Not { success: true, data: { data: [...], meta: {...} } }
  const response = await api.get<WishlistItem[]>(endpoint);
  
  // Extract data (array) and meta from response
  const items = response.data || [];
  const meta = (response as unknown as { meta?: { page: number; per_page: number; total_items: number; total_pages: number } }).meta;
  
  return {
    items: items.map(transformWishlistItem),
    meta: meta ? {
      page: meta.page,
      per_page: meta.per_page,
      total_items: Number(meta.total_items),
      total_pages: meta.total_pages,
    } : { page: 1, per_page: 20, total_items: 0, total_pages: 0 }
  };
}

/**
 * Save a job to wishlist
 * Supports both numeric jobId and hash_id (string starting with "kn_")
 */
export async function saveToWishlist(jobId: number | string): Promise<SavedJob> {
  // Determine if it's a hash_id or numeric id
  const isHashId = typeof jobId === 'string' && jobId.startsWith('kn_');
  
  const requestBody = isHashId 
    ? { hash_id: jobId }
    : { job_id: typeof jobId === 'string' ? parseInt(jobId, 10) : jobId };
  
  const response = await api.post<WishlistItem>(
    ENDPOINTS.WISHLIST.SAVE,
    requestBody
  );
  
  if (!response.data) {
    throw new Error('Failed to save job to wishlist');
  }
  
  return transformWishlistItem(response.data);
}

/**
 * Remove a job from wishlist
 * Supports both numeric jobId and hash_id (string starting with "kn_")
 */
export async function removeFromWishlist(jobId: number | string): Promise<void> {
  await api.delete(ENDPOINTS.WISHLIST.REMOVE(jobId));
}

/**
 * Check if a job is saved
 * Supports both numeric jobId and hash_id (string starting with "kn_")
 */
export async function checkIsJobSaved(jobId: number | string): Promise<boolean> {
  try {
    const response = await api.get<{ is_saved: boolean }>(
      ENDPOINTS.WISHLIST.CHECK(jobId)
    );
    return response.data?.is_saved || false;
  } catch {
    return false;
  }
}

/**
 * Get wishlist statistics
 */
export async function getWishlistStats(): Promise<WishlistStats> {
  const response = await api.get<WishlistStats>(ENDPOINTS.WISHLIST.STATS);
  return response.data || { total_saved: 0 };
}
