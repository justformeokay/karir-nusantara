import { apiRequest, ApiResponse } from './client';

// ============================================
// TYPES
// ============================================

export interface ApplicantProfile {
  id: number;
  hash_id: string;
  user_id: number;

  // Personal Information
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality?: string;
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed';

  // Identity
  nik?: string;

  // Address
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;

  // Professional Links
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  personal_website?: string;

  // Bio/Summary
  professional_summary?: string;
  headline?: string;

  // Job Preferences
  expected_salary_min?: number;
  expected_salary_max?: number;
  preferred_job_types?: string[];
  preferred_locations?: string[];
  available_from?: string;
  willing_to_relocate: boolean;

  // Profile Completeness
  profile_completeness: number;

  created_at: string;
  updated_at: string;
}

export interface ApplicantDocument {
  id: number;
  hash_id: string;
  document_type: 'cv_uploaded' | 'cv_generated' | 'certificate' | 'transcript' | 'portfolio' | 'ktp' | 'other';
  document_name: string;
  document_url: string;
  file_size?: number;
  mime_type?: string;
  is_primary: boolean;
  description?: string;
  uploaded_at: string;
  expires_at?: string;
}

export interface UpdateProfileRequest {
  // Personal Information
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality?: string;
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed';

  // Identity
  nik?: string;

  // Address
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;

  // Professional Links
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  personal_website?: string;

  // Bio/Summary
  professional_summary?: string;
  headline?: string;

  // Job Preferences
  expected_salary_min?: number;
  expected_salary_max?: number;
  preferred_job_types?: string[];
  preferred_locations?: string[];
  available_from?: string;
  willing_to_relocate?: boolean;
}

// ============================================
// API FUNCTIONS - PROFILE
// ============================================

/**
 * Get current user's applicant profile
 */
export async function getProfile(): Promise<ApplicantProfile> {
  const response = await apiRequest<ApplicantProfile>('/api/v1/profile');
  if (!response.data) {
    throw new Error('Failed to get profile');
  }
  return response.data;
}

/**
 * Update current user's profile
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<ApplicantProfile> {
  const response = await apiRequest<ApplicantProfile>('/api/v1/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response.data) {
    throw new Error('Failed to update profile');
  }
  return response.data;
}

/**
 * Delete current user's profile
 */
export async function deleteProfile(): Promise<void> {
  await apiRequest('/api/v1/profile', {
    method: 'DELETE',
  });
}

// ============================================
// API FUNCTIONS - DOCUMENTS
// ============================================

/**
 * Get all documents for current user
 */
export async function getDocuments(): Promise<ApplicantDocument[]> {
  const response = await apiRequest<ApplicantDocument[]>('/api/v1/profile/documents');
  return response.data || [];
}

/**
 * Get a specific document by ID
 */
export async function getDocument(docId: string | number): Promise<ApplicantDocument> {
  const response = await apiRequest<ApplicantDocument>(`/api/v1/profile/documents/${docId}`);
  if (!response.data) {
    throw new Error('Failed to get document');
  }
  return response.data;
}

/**
 * Upload a new document
 */
export async function uploadDocument(
  file: File,
  documentType: string,
  options?: {
    description?: string;
    isPrimary?: boolean;
  }
): Promise<ApplicantDocument> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', documentType);
  
  if (options?.description) {
    formData.append('description', options.description);
  }
  if (options?.isPrimary) {
    formData.append('is_primary', 'true');
  }

  const response = await apiRequest<ApplicantDocument>('/api/v1/profile/documents', {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type for FormData - browser will set it with boundary
    },
  });
  
  if (!response.data) {
    throw new Error('Failed to upload document');
  }
  return response.data;
}

/**
 * Update document metadata
 */
export async function updateDocument(
  docId: string | number,
  data: { name?: string; description?: string }
): Promise<ApplicantDocument> {
  const response = await apiRequest<ApplicantDocument>(`/api/v1/profile/documents/${docId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response.data) {
    throw new Error('Failed to update document');
  }
  return response.data;
}

/**
 * Delete a document
 */
export async function deleteDocument(docId: string | number): Promise<void> {
  await apiRequest(`/api/v1/profile/documents/${docId}`, {
    method: 'DELETE',
  });
}

/**
 * Set a document as primary
 */
export async function setPrimaryDocument(docId: string | number): Promise<void> {
  await apiRequest(`/api/v1/profile/documents/${docId}/primary`, {
    method: 'POST',
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getDocumentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    cv_uploaded: 'CV (Uploaded)',
    cv_generated: 'CV (Generated)',
    certificate: 'Sertifikat',
    transcript: 'Transkrip',
    portfolio: 'Portfolio',
    ktp: 'KTP',
    other: 'Lainnya',
  };
  return labels[type] || type;
}

export function getGenderLabel(gender: string): string {
  const labels: Record<string, string> = {
    male: 'Laki-laki',
    female: 'Perempuan',
    other: 'Lainnya',
    prefer_not_to_say: 'Tidak ingin menyebutkan',
  };
  return labels[gender] || gender;
}

export function getMaritalStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    single: 'Belum Menikah',
    married: 'Menikah',
    divorced: 'Cerai',
    widowed: 'Duda/Janda',
  };
  return labels[status] || status;
}

export function formatSalary(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
