import { api, PaginationMeta } from './client';
import { ENDPOINTS } from './config';

// ============================================
// TYPES - Matching Backend API Response
// ============================================

export interface JobCompany {
  id: number;
  hash_id?: string;
  name: string;
  logo_url?: string;
  website?: string;
}

export interface JobLocation {
  city: string;
  province: string;
  is_remote: boolean;
}

export interface JobSalary {
  min?: number;
  max?: number;
  currency: string;
}

// API Response format from backend
export interface JobApiResponse {
  id: number;
  hash_id?: string;
  title: string;
  slug: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  location: JobLocation;
  job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experience_level: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  salary?: JobSalary; // Nested salary object from backend
  skills?: string[];
  company: JobCompany;
  status: 'draft' | 'active' | 'paused' | 'closed' | 'filled';
  views_count?: number;
  applications_count?: number;
  published_at?: string;
  created_at: string;
  updated_at?: string;
}

// Frontend-friendly Job type (transformed from API)
export interface Job {
  id: number;
  hashId?: string;
  title: string;
  slug: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  city: string;
  province: string;
  location: string; // Combined city + province for display
  isRemote: boolean;
  jobType: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  isSalaryVisible: boolean;
  isSalaryFixed?: boolean;
  skills: string[];
  company: JobCompany;
  status: 'draft' | 'active' | 'paused' | 'closed' | 'filled';
  viewsCount: number;
  applicationsCount: number;
  publishedAt?: string;
  createdAt: string;
}

export interface JobListParams {
  page?: number;
  per_page?: number;
  search?: string;
  city?: string;
  province?: string;
  job_type?: string;
  experience_level?: string;
  is_remote?: boolean;
  salary_min?: number;
  salary_max?: number;
  company?: string; // Company hash_id for filtering
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface JobListResponse {
  jobs: Job[];
  meta: PaginationMeta;
}

// ============================================
// TRANSFORMERS
// ============================================

/**
 * Transform API response to frontend Job format
 */
function transformJob(apiJob: JobApiResponse): Job {
  return {
    id: apiJob.id,
    hashId: apiJob.hash_id,
    title: apiJob.title,
    slug: apiJob.slug,
    description: apiJob.description,
    requirements: apiJob.requirements,
    responsibilities: apiJob.responsibilities,
    benefits: apiJob.benefits,
    city: apiJob.location?.city || '',
    province: apiJob.location?.province || '',
    location: apiJob.location ? `${apiJob.location.city}, ${apiJob.location.province}` : '',
    isRemote: apiJob.location?.is_remote || false,
    jobType: apiJob.job_type,
    experienceLevel: apiJob.experience_level,
    salaryMin: apiJob.salary?.min,
    salaryMax: apiJob.salary?.max,
    salaryCurrency: apiJob.salary?.currency || 'IDR',
    isSalaryVisible: !!apiJob.salary, // If salary object exists, it's visible
    isSalaryFixed: !!(apiJob.salary && apiJob.salary.max === 0), // If max is 0, it's fixed salary
    skills: apiJob.skills || [],
    company: apiJob.company,
    status: apiJob.status,
    viewsCount: apiJob.views_count || 0,
    applicationsCount: apiJob.applications_count || 0,
    publishedAt: apiJob.published_at,
    createdAt: apiJob.created_at,
  };
}

// ============================================
// JOBS API FUNCTIONS
// ============================================

/**
 * List all active jobs with filters
 */
export async function listJobs(params: JobListParams = {}): Promise<JobListResponse> {
  const searchParams = new URLSearchParams();
  
  // Map params to API format
  if (params.page) searchParams.append('page', String(params.page));
  if (params.per_page) searchParams.append('per_page', String(params.per_page));
  if (params.search) searchParams.append('search', params.search);
  if (params.city) searchParams.append('city', params.city);
  if (params.province) searchParams.append('province', params.province);
  if (params.job_type) searchParams.append('job_type', params.job_type);
  if (params.experience_level) searchParams.append('experience_level', params.experience_level);
  if (params.is_remote !== undefined) searchParams.append('is_remote', String(params.is_remote));
  if (params.salary_min) searchParams.append('salary_min', String(params.salary_min));
  if (params.salary_max) searchParams.append('salary_max', String(params.salary_max));
  if (params.sort_by) searchParams.append('sort_by', params.sort_by);
  if (params.sort_order) searchParams.append('sort_order', params.sort_order);

  const queryString = searchParams.toString();
  const endpoint = queryString 
    ? `${ENDPOINTS.JOBS.LIST}?${queryString}` 
    : ENDPOINTS.JOBS.LIST;

  const response = await api.get<JobApiResponse[]>(endpoint, { skipAuth: true });
  
  const jobs = (response.data ?? []).map(transformJob);
  
  return {
    jobs,
    meta: response.meta ?? {
      page: params.page || 1,
      per_page: params.per_page || 20,
      total_items: jobs.length,
      total_pages: 1,
    },
  };
}

/**
 * Get job by ID
 */
export async function getJobById(id: string | number): Promise<Job | null> {
  try {
    const response = await api.get<JobApiResponse>(
      ENDPOINTS.JOBS.BY_ID(String(id)),
      { skipAuth: true }
    );
    return response.data ? transformJob(response.data) : null;
  } catch {
    return null;
  }
}

/**
 * Get job by slug
 */
export async function getJobBySlug(slug: string): Promise<Job | null> {
  try {
    const response = await api.get<JobApiResponse>(
      ENDPOINTS.JOBS.BY_SLUG(slug),
      { skipAuth: true }
    );
    return response.data ? transformJob(response.data) : null;
  } catch {
    return null;
  }
}

/**
 * Track job view - called when a job seeker views a job detail
 * @returns true if this is a new view, false if already viewed
 */
export async function trackJobView(jobId: string | number): Promise<boolean> {
  try {
    const response = await api.post<{ is_new_view: boolean }>(
      ENDPOINTS.JOBS.TRACK_VIEW(jobId)
    );
    return response.data?.is_new_view ?? false;
  } catch {
    // Silently fail - don't interrupt user experience
    console.warn('Failed to track job view');
    return false;
  }
}

/**
 * Track job share - called when a user shares a job
 * @param platform Optional platform name (whatsapp, telegram, facebook, twitter, copy_link, etc)
 */
export async function trackJobShare(jobId: string | number, platform?: string): Promise<void> {
  try {
    await api.post(
      ENDPOINTS.JOBS.TRACK_SHARE(jobId),
      { platform: platform || '' }
    );
  } catch {
    // Silently fail - don't interrupt user experience
    console.warn('Failed to track job share');
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format salary range for display
 */
export function formatSalary(min?: number, max?: number, currency = 'IDR'): string {
  if (!min && !max) return 'Gaji tidak ditampilkan';
  
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) {
    return `Mulai ${formatter.format(min)}`;
  }
  if (max) {
    return `Hingga ${formatter.format(max)}`;
  }
  
  return 'Gaji tidak ditampilkan';
}

/**
 * Map job type to display text
 */
export function getJobTypeLabel(type: Job['jobType']): string {
  const labels: Record<string, string> = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Kontrak',
    internship: 'Magang',
    freelance: 'Freelance',
  };
  return labels[type] || type;
}

/**
 * Map experience level to display text
 */
export function getExperienceLabel(level: Job['experienceLevel']): string {
  const labels: Record<string, string> = {
    entry: 'Entry Level',
    junior: 'Junior',
    mid: 'Mid Level',
    senior: 'Senior Level',
    lead: 'Lead / Manager',
    executive: 'Executive',
  };
  return labels[level] || level;
}

/**
 * Get relative time string
 */
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} minggu lalu`;
  
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
