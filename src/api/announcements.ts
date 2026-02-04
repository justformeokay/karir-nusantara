// API functions for Public Announcements (Notifications, Banners, Information)
import { apiRequest, ApiResponse } from './client';

export type AnnouncementType = 'notification' | 'banner' | 'information';
export type TargetAudience = 'all' | 'company' | 'candidate' | 'partner';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: AnnouncementType;
  target_audience: TargetAudience;
  is_active: boolean;
  priority: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementsResponse {
  success: boolean;
  message: string;
  data: Announcement[];
}

// Get all active announcements (public)
export async function getAllAnnouncements(): Promise<AnnouncementsResponse> {
  const response = await apiRequest<Announcement[]>('/announcements', {
    method: 'GET',
    skipAuth: true,
  });
  
  return {
    success: response.success,
    message: response.message || 'Announcements retrieved successfully',
    data: response.data || [],
  };
}

// Get active notifications (for job seekers)
export async function getNotifications(): Promise<AnnouncementsResponse> {
  const response = await apiRequest<Announcement[]>('/announcements/notifications', {
    method: 'GET',
    skipAuth: true,
  });
  
  return {
    success: response.success,
    message: response.message || 'Notifications retrieved successfully',
    data: response.data || [],
  };
}

// Get active banners (for job seekers)
export async function getBanners(): Promise<AnnouncementsResponse> {
  const response = await apiRequest<Announcement[]>('/announcements/banners', {
    method: 'GET',
    skipAuth: true,
  });
  
  return {
    success: response.success,
    message: response.message || 'Banners retrieved successfully',
    data: response.data || [],
  };
}

// Get active information (for job seekers)
export async function getInformation(): Promise<AnnouncementsResponse> {
  const response = await apiRequest<Announcement[]>('/announcements/information', {
    method: 'GET',
    skipAuth: true,
  });
  
  return {
    success: response.success,
    message: response.message || 'Information retrieved successfully',
    data: response.data || [],
  };
}

// Filter announcements relevant to job seekers (target_audience = 'all' or 'candidate')
export function filterForJobSeekers(announcements: Announcement[]): Announcement[] {
  return announcements.filter(
    a => a.target_audience === 'all' || a.target_audience === 'candidate'
  );
}
