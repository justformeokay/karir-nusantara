import { apiRequest, ApiResponse } from './client';

// ============================================
// TYPES
// ============================================

export interface SupportTicket {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: 'open' | 'in_progress' | 'pending_response' | 'resolved' | 'closed';
  email: string;
  created_at: string;
  updated_at: string;
  resolved_at: { Time: string; Valid: boolean } | null;
  closed_at: { Time: string; Valid: boolean } | null;
}

export interface TicketWithDetails extends SupportTicket {
  user_name: string;
  user_email: string;
  last_message: string;
  last_message_at: string;
  response_count: number;
}

export interface TicketResponse {
  id: number;
  ticket_id: number;
  sender_id: number;
  sender_type: 'user' | 'admin';
  message: string;
  created_at: string;
  sender_name: string;
  sender_email: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  category: string;
  priority?: string;
  email: string;
}

export interface AddResponseRequest {
  message: string;
}

export interface CooldownResponse {
  can_create: boolean;
  remaining_seconds: number;
  remaining_minutes: number;
  cooldown_duration: number;
}

export interface TicketListResponse {
  tickets: TicketWithDetails[];
  total: number;
}

export interface TicketDetailResponse {
  ticket: TicketWithDetails;
  responses: TicketResponse[];
}

export interface CreateTicketResponse {
  message: string;
  ticket: TicketWithDetails;
}

export interface AddResponseResponse {
  message: string;
  response: TicketResponse;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Check if user can create a new ticket (cooldown status)
 */
export async function checkCooldown(): Promise<CooldownResponse> {
  const response = await apiRequest<CooldownResponse>('/tickets/cooldown');
  // API returns data directly without 'data' wrapper in this case
  if (response.data) {
    return response.data;
  }
  // Fallback for direct response
  return response as unknown as CooldownResponse;
}

/**
 * Create a new support ticket
 */
export async function createTicket(data: CreateTicketRequest): Promise<CreateTicketResponse> {
  const response = await apiRequest<CreateTicketResponse>('/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (response.data) {
    return response.data;
  }
  return response as unknown as CreateTicketResponse;
}

/**
 * Get list of user's tickets
 */
export async function getMyTickets(): Promise<TicketListResponse> {
  const response = await apiRequest<TicketListResponse>('/tickets');
  if (response.data) {
    return response.data;
  }
  return response as unknown as TicketListResponse;
}

/**
 * Get ticket detail with responses
 */
export async function getTicketDetail(ticketId: number): Promise<TicketDetailResponse> {
  const response = await apiRequest<TicketDetailResponse>(`/tickets/${ticketId}`);
  if (response.data) {
    return response.data;
  }
  return response as unknown as TicketDetailResponse;
}

/**
 * Add a response to a ticket
 */
export async function addTicketResponse(ticketId: number, data: AddResponseRequest): Promise<AddResponseResponse> {
  const response = await apiRequest<AddResponseResponse>(`/tickets/${ticketId}/responses`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (response.data) {
    return response.data;
  }
  return response as unknown as AddResponseResponse;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'account': 'Akun & Login',
    'cv-builder': 'CV Builder',
    'job-applications': 'Lamaran Kerja',
    'profile': 'Profil',
    'payment': 'Pembayaran',
    'search-filter': 'Pencarian & Filter',
    'notification': 'Notifikasi',
    'technical': 'Masalah Teknis',
    'feature-request': 'Permintaan Fitur',
    'other': 'Lainnya',
  };
  return labels[category] || category;
}

export function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    'low': 'Rendah',
    'medium': 'Sedang',
    'high': 'Tinggi',
    'urgent': 'Mendesak',
  };
  return labels[priority] || priority;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'open': 'Terbuka',
    'in_progress': 'Sedang Diproses',
    'pending_response': 'Menunggu Respons',
    'resolved': 'Terselesaikan',
    'closed': 'Ditutup',
  };
  return labels[status] || status;
}

export function formatCooldownTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}
