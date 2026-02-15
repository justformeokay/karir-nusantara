import { api } from './client';
import { ENDPOINTS } from './config';
import type { Job } from './jobs';

// ============================================
// TYPES (matching backend schema)
// ============================================

export type ApplicationStatus = 
  | 'submitted' 
  | 'reviewing' 
  | 'shortlisted' 
  | 'interview_scheduled' 
  | 'interviewed' 
  | 'offered' 
  | 'accepted' 
  | 'rejected' 
  | 'withdrawn';

export interface TimelineEvent {
  id: number;
  application_id: number;
  status: ApplicationStatus;
  notes?: string;
  note?: string; // Alternative field name from backend
  created_at: string;
  created_by?: string;
  updated_by_type?: string;
  
  // Interview scheduling fields from backend
  scheduled_at?: string;
  scheduled_location?: string;
  scheduled_notes?: string;
  interview_type?: 'online' | 'offline' | 'whatsapp_notification';
  meeting_link?: string;
  meeting_platform?: string;
  interview_address?: string;
  contact_person?: string;
  contact_phone?: string;
}

// Job info dalam application response (simplified)
export interface ApplicationJob {
  id: number;
  hash_id: string;
  title: string;
  company: {
    id: number;
    hash_id: string;
    name: string;
    logo_url?: string;
  };
  city?: string;
  province?: string;
  status?: string;
  jobType?: string;
  location?: string;
}

export interface Application {
  id: number;
  hash_id: string;
  job_id?: number;
  user_id?: number;
  cv_snapshot_id?: number;
  cover_letter?: string;
  
  // API returns current_status, not status
  status?: ApplicationStatus;
  current_status: ApplicationStatus;
  status_label?: string;
  
  applied_at: string;
  updated_at?: string;
  last_status_update?: string;
  
  // Populated from joins
  job?: ApplicationJob;
  timeline?: TimelineEvent[];
}

export interface ApplicationListParams {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
}

export interface ApplicationListResponse {
  data: Application[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApplyRequest {
  job_id: number;
  cover_letter?: string;
  cv_source?: 'built' | 'uploaded'; // CV source: from system builder or uploaded document
  uploaded_document_id?: number;    // Required if cv_source='uploaded'
}

// ============================================
// APPLICATION API FUNCTIONS
// ============================================

/**
 * Apply to a job
 */
export async function applyToJob(request: ApplyRequest): Promise<Application> {
  const response = await api.post<Application>(
    ENDPOINTS.APPLICATIONS.APPLY,
    request
  );
  
  if (!response.data) {
    throw new Error('Gagal mengirim lamaran');
  }
  
  return response.data;
}

/**
 * Get my applications
 */
export async function getMyApplications(
  params: ApplicationListParams = {}
): Promise<ApplicationListResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.status) searchParams.set('status', params.status);
  
  const queryString = searchParams.toString();
  const endpoint = queryString 
    ? `${ENDPOINTS.APPLICATIONS.MY_APPLICATIONS}?${queryString}`
    : ENDPOINTS.APPLICATIONS.MY_APPLICATIONS;
  
  // API returns { success, data: [...], meta: {...} }
  // Not { success, data: { data: [...], meta: {...} } }
  const response = await api.get<Application[]>(endpoint);
  
  // Extract data (array) and meta from response
  const applications = response.data || [];
  const meta = (response as unknown as { meta?: { page: number; per_page: number; total_items: number; total_pages: number } }).meta;
  
  return { 
    data: applications, 
    meta: meta ? {
      page: meta.page,
      limit: meta.per_page,
      total: Number(meta.total_items),
      total_pages: meta.total_pages,
    } : { page: 1, limit: 10, total: 0, total_pages: 0 } 
  };
}

/**
 * Get application by ID
 */
export async function getApplicationById(id: number): Promise<Application | null> {
  try {
    const response = await api.get<Application>(
      ENDPOINTS.APPLICATIONS.BY_ID(id)
    );
    return response.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Get application timeline
 */
export async function getApplicationTimeline(
  applicationId: number
): Promise<TimelineEvent[]> {
  const response = await api.get<TimelineEvent[]>(
    ENDPOINTS.APPLICATIONS.TIMELINE(applicationId)
  );
  return response.data ?? [];
}

/**
 * Withdraw application
 */
export async function withdrawApplication(id: number): Promise<void> {
  await api.patch(ENDPOINTS.APPLICATIONS.WITHDRAW(id), {});
}

/**
 * Check if user has already applied to a job
 */
export async function hasAppliedToJob(jobId: number): Promise<boolean> {
  try {
    const response = await getMyApplications({ limit: 100 });
    return response.data.some(app => app.job_id === jobId);
  } catch {
    return false;
  }
}

// ============================================
// STATUS HELPERS
// ============================================

/**
 * Get Indonesian label for status
 */
export function getStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    submitted: 'Terkirim',
    reviewing: 'Sedang Ditinjau',
    shortlisted: 'Masuk Shortlist',
    interview_scheduled: 'Jadwal Interview',
    interviewed: 'Sudah Interview',
    offered: 'Ditawari Posisi',
    accepted: 'Diterima',
    rejected: 'Ditolak',
    withdrawn: 'Dibatalkan',
  };
  return labels[status] || status;
}

/**
 * Get badge variant for status
 */
export function getStatusVariant(
  status: ApplicationStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'accepted':
    case 'offered':
      return 'default'; // success-like
    case 'rejected':
    case 'withdrawn':
      return 'destructive';
    case 'submitted':
    case 'reviewing':
      return 'secondary';
    default:
      return 'outline';
  }
}

/**
 * Get status color for timeline
 */
export function getStatusColor(status: ApplicationStatus): string {
  switch (status) {
    case 'accepted':
    case 'offered':
      return 'text-green-600 bg-green-50';
    case 'rejected':
      return 'text-red-600 bg-red-50';
    case 'withdrawn':
      return 'text-gray-600 bg-gray-50';
    case 'interview_scheduled':
    case 'interviewed':
      return 'text-blue-600 bg-blue-50';
    case 'shortlisted':
      return 'text-purple-600 bg-purple-50';
    default:
      return 'text-yellow-600 bg-yellow-50';
  }
}

/**
 * Format application date in Indonesian
 */
export function formatApplicationDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Check if application can be withdrawn
 */
export function canWithdraw(status: ApplicationStatus): boolean {
  const nonWithdrawableStatuses: ApplicationStatus[] = [
    'accepted',
    'rejected',
    'withdrawn',
  ];
  return !nonWithdrawableStatuses.includes(status);
}
