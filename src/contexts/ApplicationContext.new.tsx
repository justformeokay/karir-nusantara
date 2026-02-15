import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext.new';
import {
  applyToJob as apiApplyToJob,
  getMyApplications,
  getApplicationById as apiGetApplicationById,
  getApplicationTimeline,
  withdrawApplication as apiWithdrawApplication,
  getStatusLabel,
  getStatusColor,
  type Application as ApiApplication,
  type ApplicationStatus as ApiApplicationStatus,
  type TimelineEvent as ApiTimelineEvent,
} from '@/api';
import { STATIC_BASE_URL } from '@/api/config';
import type { Job } from '@/data/jobs';

// ============================================
// TYPES (Frontend format)
// ============================================

export type ApplicationStatus =
  | 'submitted'
  | 'viewed'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'offer_extended'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export interface TimelineEvent {
  id: string;
  status: ApplicationStatus;
  timestamp: string;
  note?: string;
  updatedBy: 'system' | 'company' | 'applicant';
  metadata?: {
    interviewDate?: string;
    interviewType?: 'online' | 'onsite';
    interviewLocation?: string;
    interviewLink?: string;
    meetingPlatform?: string;
    notificationMethod?: 'whatsapp';
    contactPerson?: string;
    contactPhone?: string;
    scheduledNotes?: string;
    rejectionReason?: string;
    offerDetails?: string;
  };
}

export interface Application {
  id: string;
  jobId: string;
  job: Pick<Job, 'id' | 'title' | 'company' | 'companyLogo' | 'location' | 'type'> & { hashId?: string };
  applicantId: string;
  appliedAt: string;
  currentStatus: ApplicationStatus;
  timeline: TimelineEvent[];
  lastUpdatedAt: string;
  isActive: boolean;
  hasResponse: boolean;
  daysInCurrentStatus: number;
}

export interface ApplicationStats {
  total: number;
  active: number;
  interviews: number;
  offers: number;
  rejected: number;
  responseRate: number;
  averageResponseDays: number;
}

// ============================================
// STATUS MAPPING
// ============================================

const API_TO_FRONTEND_STATUS: Record<ApiApplicationStatus, ApplicationStatus> = {
  submitted: 'submitted',
  reviewing: 'viewed',
  shortlisted: 'shortlisted',
  interview_scheduled: 'interview_scheduled',
  interviewed: 'interview_completed',
  offered: 'offer_extended',
  accepted: 'hired',
  rejected: 'rejected',
  withdrawn: 'withdrawn',
};

// ============================================
// CONTEXT
// ============================================

interface ApplicationContextType {
  applications: Application[];
  stats: ApplicationStats;
  isLoading: boolean;
  error: string | null;
  
  getApplicationById: (id: string) => Application | undefined;
  getApplicationsByStatus: (status: ApplicationStatus) => Application[];
  getActiveApplications: () => Application[];
  hasAppliedToJob: (jobId: string) => boolean;
  
  applyToJob: (jobId: string, jobDetails: Application['job'], coverLetter?: string, cvSource?: 'built' | 'uploaded', uploadedDocumentId?: number) => Promise<Application>;
  withdrawApplication: (applicationId: string) => Promise<void>;
  refreshApplications: () => Promise<void>;
  clearError: () => void;
}

interface ApplicationProviderProps {
  children: React.ReactNode;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// ============================================
// HELPERS
// ============================================

function transformApiApplication(api: ApiApplication): Application {
  // API returns current_status, not status
  const apiStatus = api.current_status || api.status || 'submitted';
  const status = API_TO_FRONTEND_STATUS[apiStatus] || 'submitted';
  const appliedAt = api.applied_at || new Date().toISOString();
  const now = new Date();
  const appliedDate = new Date(appliedAt);
  const daysInStatus = Math.floor((now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const timeline: TimelineEvent[] = (api.timeline || []).map((evt: ApiTimelineEvent) => {
    const metadata: TimelineEvent['metadata'] = {};
    
    // Map interview details from backend fields for interview_scheduled status
    if (evt.status === 'interview_scheduled') {
      if (evt.scheduled_at) {
        metadata.interviewDate = evt.scheduled_at;
      }
      
      if (evt.interview_type) {
        // Map backend interview_type to frontend format
        if (evt.interview_type === 'online') {
          metadata.interviewType = 'online';
          if (evt.meeting_link) {
            metadata.interviewLink = evt.meeting_link;
          }
          if (evt.meeting_platform) {
            metadata.meetingPlatform = evt.meeting_platform;
          }
        } else if (evt.interview_type === 'offline') {
          metadata.interviewType = 'onsite';
          metadata.interviewLocation = evt.interview_address || evt.scheduled_location;
        } else if (evt.interview_type === 'whatsapp_notification') {
          // WhatsApp notification - they will be notified via WhatsApp
          metadata.interviewType = 'online';
          metadata.notificationMethod = 'whatsapp';
        }
      }
      
      // Add contact information
      if (evt.contact_person) {
        metadata.contactPerson = evt.contact_person;
      }
      
      if (evt.contact_phone) {
        metadata.contactPhone = evt.contact_phone;
      }
      
      // Add scheduled notes
      if (evt.scheduled_notes) {
        metadata.scheduledNotes = evt.scheduled_notes;
      }
    }
    
    return {
      id: String(evt.id),
      status: API_TO_FRONTEND_STATUS[evt.status] || 'submitted',
      timestamp: evt.created_at,
      note: evt.notes || evt.note,
      updatedBy: evt.updated_by_type === 'applicant' ? 'applicant' : evt.updated_by_type === 'company' ? 'company' : 'system',
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };
  });

  // Default timeline with submitted if empty
  if (timeline.length === 0) {
    timeline.push({
      id: 'evt-1',
      status: 'submitted',
      timestamp: appliedAt,
      updatedBy: 'system',
    });
  }

  // Build location from city and province if location not available
  const jobLocation = api.job?.location || 
    (api.job?.city && api.job?.province 
      ? `${api.job.city}, ${api.job.province}` 
      : api.job?.city || api.job?.province || '');

  // Build full logo URL from relative path
  const getFullLogoUrl = (logoUrl?: string): string => {
    if (!logoUrl) return '';
    if (logoUrl.startsWith('http')) return logoUrl;
    return `${STATIC_BASE_URL}${logoUrl}`;
  };

  return {
    id: String(api.id),
    jobId: api.job?.hash_id || String(api.job?.id || api.job_id || 0),
    job: api.job ? {
      id: api.job.hash_id || String(api.job.id),
      hashId: api.job.hash_id,
      title: api.job.title,
      company: api.job.company?.name || 'Unknown Company',
      companyLogo: getFullLogoUrl(api.job.company?.logo_url),
      location: jobLocation,
      type: (api.job.jobType as Application['job']['type']) || 'Full-time',
    } : {
      id: String(api.job_id || 0),
      title: 'Unknown Position',
      company: 'Unknown Company',
      companyLogo: '',
      location: '',
      type: 'Full-time',
    },
    applicantId: String(api.user_id || 0),
    appliedAt,
    currentStatus: status,
    timeline,
    lastUpdatedAt: api.last_status_update || api.updated_at || appliedAt,
    isActive: !['rejected', 'withdrawn', 'hired'].includes(status),
    hasResponse: status !== 'submitted',
    daysInCurrentStatus: daysInStatus,
  };
}

function calculateStats(applications: Application[]): ApplicationStats {
  const total = applications.length;
  const active = applications.filter(a => a.isActive).length;
  const interviews = applications.filter(a =>
    ['interview_scheduled', 'interview_completed'].includes(a.currentStatus)
  ).length;
  const offers = applications.filter(a =>
    ['offer_extended', 'hired'].includes(a.currentStatus)
  ).length;
  const rejected = applications.filter(a => a.currentStatus === 'rejected').length;
  const responded = applications.filter(a => a.hasResponse).length;
  
  return {
    total,
    active,
    interviews,
    offers,
    rejected,
    responseRate: total > 0 ? Math.round((responded / total) * 100) : 0,
    averageResponseDays: 0, // TODO: Calculate from timeline
  };
}

// ============================================
// PROVIDER
// ============================================

export function ApplicationProvider({ children }: ApplicationProviderProps) {
  const { isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load applications from API or localStorage
  const loadApplications = useCallback(async () => {
    if (!isAuthenticated) {
      // Try to load from localStorage when not authenticated
      try {
        const stored = localStorage.getItem('karir_applications');
        if (stored) {
          setApplications(JSON.parse(stored));
        }
      } catch {
        // Ignore localStorage errors
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getMyApplications({ limit: 100 });
      const applications = response?.data || [];
      const transformed = applications.map(transformApiApplication);
      setApplications(transformed);
      
      // Also save to localStorage as cache
      localStorage.setItem('karir_applications', JSON.stringify(transformed));
    } catch (err) {
      console.error('Failed to load applications:', err);
      setError('Gagal memuat riwayat lamaran');
      
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem('karir_applications');
        if (stored) {
          setApplications(JSON.parse(stored));
        }
      } catch {
        // Ignore localStorage errors
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load on mount and when auth changes
  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // Calculate stats
  const stats = useMemo(() => calculateStats(applications), [applications]);

  // ============================================
  // GETTERS
  // ============================================

  const getApplicationById = useCallback((id: string): Application | undefined => {
    return applications.find(app => app.id === id);
  }, [applications]);

  const getApplicationsByStatus = useCallback((status: ApplicationStatus): Application[] => {
    return applications.filter(app => app.currentStatus === status);
  }, [applications]);

  const getActiveApplications = useCallback((): Application[] => {
    return applications.filter(app => app.isActive);
  }, [applications]);

  const hasAppliedToJob = useCallback((jobId: string): boolean => {
    return applications.some(app => app.jobId === jobId);
  }, [applications]);

  // ============================================
  // ACTIONS
  // ============================================

  const applyToJob = useCallback(async (
    jobId: string,
    jobDetails: Application['job'],
    coverLetter?: string,
    cvSource?: 'built' | 'uploaded',
    uploadedDocumentId?: number
  ): Promise<Application> => {
    // Check if already applied
    const existing = applications.find(app => app.jobId === jobId);
    if (existing) {
      throw new Error('Anda sudah melamar untuk posisi ini');
    }

    if (!isAuthenticated) {
      throw new Error('Silakan login terlebih dahulu untuk melamar');
    }

    setError(null);

    try {
      const apiResponse = await apiApplyToJob({
        job_id: parseInt(jobId, 10),
        cover_letter: coverLetter,
        cv_source: cvSource,
        uploaded_document_id: uploadedDocumentId,
      });

      const now = new Date().toISOString();
      const newApplication: Application = {
        id: String(apiResponse.id),
        jobId,
        job: jobDetails,
        applicantId: String(apiResponse.user_id),
        appliedAt: apiResponse.applied_at || now,
        currentStatus: 'submitted',
        lastUpdatedAt: now,
        isActive: true,
        hasResponse: false,
        daysInCurrentStatus: 0,
        timeline: [
          {
            id: `evt-${Date.now()}`,
            status: 'submitted',
            timestamp: now,
            updatedBy: 'system',
          },
        ],
      };

      setApplications(prev => {
        const updated = [newApplication, ...prev];
        localStorage.setItem('karir_applications', JSON.stringify(updated));
        return updated;
      });

      return newApplication;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengirim lamaran';
      setError(message);
      throw new Error(message);
    }
  }, [applications, isAuthenticated]);

  const withdrawApplication = useCallback(async (applicationId: string): Promise<void> => {
    setError(null);

    try {
      if (isAuthenticated) {
        await apiWithdrawApplication(parseInt(applicationId, 10));
      }

      const now = new Date().toISOString();

      setApplications(prev => {
        const updated = prev.map(app => {
          if (app.id !== applicationId) return app;

          return {
            ...app,
            currentStatus: 'withdrawn' as ApplicationStatus,
            isActive: false,
            lastUpdatedAt: now,
            timeline: [
              ...app.timeline,
              {
                id: `evt-${Date.now()}`,
                status: 'withdrawn' as ApplicationStatus,
                timestamp: now,
                updatedBy: 'applicant' as const,
                note: 'Lamaran dibatalkan oleh pelamar',
              },
            ],
          };
        });

        localStorage.setItem('karir_applications', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal membatalkan lamaran';
      setError(message);
      throw new Error(message);
    }
  }, [isAuthenticated]);

  const refreshApplications = useCallback(async (): Promise<void> => {
    await loadApplications();
  }, [loadApplications]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: ApplicationContextType = {
    applications,
    stats,
    isLoading,
    error,
    getApplicationById,
    getApplicationsByStatus,
    getActiveApplications,
    hasAppliedToJob,
    applyToJob,
    withdrawApplication,
    refreshApplications,
    clearError,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

// ============================================
// HOOKS
// ============================================

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
}

export function useApplication(id: string) {
  const { getApplicationById } = useApplications();
  return getApplicationById(id);
}

export function useApplicationStats() {
  const { stats } = useApplications();
  return stats;
}

// Re-export helpers from API
export { getStatusLabel, getStatusColor };
