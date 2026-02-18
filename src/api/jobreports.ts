import { apiRequest } from './client';

// ============================================
// TYPES
// ============================================

export interface JobReport {
  id: number;
  job_id: number;
  user_id: number;
  reason: 'scam' | 'misleading' | 'inappropriate' | 'discriminatory' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
  admin_note: string;
  reviewed_by: { Int64: number; Valid: boolean } | null;
  reviewed_at: { Time: string; Valid: boolean } | null;
  created_at: string;
  updated_at: string;
}

export interface JobReportWithDetails extends JobReport {
  job_title: string;
  job_status: string;
  company_id: number;
  company_name: string;
  company_status: string;
  reporter_name: string;
  reporter_email: string;
  total_reports: number;
}

export interface CreateReportRequest {
  reason: 'scam' | 'misleading' | 'inappropriate' | 'discriminatory' | 'other';
  description: string;
}

export interface CreateReportResponse {
  message: string;
  report: JobReportWithDetails;
}

export interface CheckReportStatusResponse {
  has_reported: boolean;
}

// Report reason labels
export const REPORT_REASONS = [
  { value: 'scam' as const, label: 'Penipuan / Scam', description: 'Lowongan ini merupakan penipuan atau pungutan liar' },
  { value: 'misleading' as const, label: 'Informasi Menyesatkan', description: 'Deskripsi pekerjaan tidak sesuai kenyataan' },
  { value: 'inappropriate' as const, label: 'Konten Tidak Pantas', description: 'Mengandung konten yang tidak pantas atau tidak profesional' },
  { value: 'discriminatory' as const, label: 'Diskriminatif', description: 'Mengandung diskriminasi berdasarkan SARA, gender, dll' },
  { value: 'other' as const, label: 'Lainnya', description: 'Alasan lain yang perlu dilaporkan' },
];

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Create a new job report
 */
export async function createJobReport(jobId: string | number, data: CreateReportRequest): Promise<CreateReportResponse> {
  const response = await apiRequest<CreateReportResponse>(`/jobs/${jobId}/reports`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (response.data) {
    return response.data;
  }
  return response as unknown as CreateReportResponse;
}

/**
 * Check if user has already reported a job
 */
export async function checkReportStatus(jobId: string | number): Promise<CheckReportStatusResponse> {
  const response = await apiRequest<CheckReportStatusResponse>(`/jobs/${jobId}/reports/status`);
  if (response.data) {
    return response.data;
  }
  return response as unknown as CheckReportStatusResponse;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get human-readable label for report reason
 */
export function getReasonLabel(reason: string): string {
  const found = REPORT_REASONS.find(r => r.value === reason);
  return found?.label || reason;
}

/**
 * Get human-readable label for report status
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'pending': 'Menunggu Review',
    'reviewed': 'Sudah Direview',
    'dismissed': 'Diabaikan',
    'action_taken': 'Tindakan Diambil',
  };
  return labels[status] || status;
}
