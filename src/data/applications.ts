/**
 * Application Transparency Timeline - Data Model
 * 
 * This module defines the data structures for tracking job applications
 * with full transparency for job seekers.
 */

import type { Job } from './jobs';

// ============================================
// ENUMS & TYPES
// ============================================

/**
 * All possible application statuses in chronological order
 * Each status represents a milestone in the hiring process
 */
export type ApplicationStatus =
  | 'submitted'           // CV Terkirim
  | 'viewed'              // Dilihat Perusahaan
  | 'shortlisted'         // Masuk Shortlist
  | 'interview_scheduled' // Interview Dijadwalkan
  | 'interview_completed' // Interview Selesai
  | 'offer_extended'      // Penawaran Dikirim
  | 'hired'               // Diterima
  | 'rejected'            // Ditolak
  | 'withdrawn';          // Dibatalkan Pelamar

/**
 * Status metadata for UI display
 */
export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  order: number;
  isTerminal: boolean;
}> = {
  submitted: {
    label: 'CV Terkirim',
    description: 'Lamaran Anda telah berhasil dikirim',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: 'send',
    order: 1,
    isTerminal: false,
  },
  viewed: {
    label: 'Dilihat Perusahaan',
    description: 'CV Anda telah dilihat oleh tim rekrutmen',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: 'eye',
    order: 2,
    isTerminal: false,
  },
  shortlisted: {
    label: 'Masuk Shortlist',
    description: 'Selamat! Anda masuk dalam daftar kandidat pilihan',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: 'star',
    order: 3,
    isTerminal: false,
  },
  interview_scheduled: {
    label: 'Interview Dijadwalkan',
    description: 'Interview telah dijadwalkan',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    icon: 'calendar',
    order: 4,
    isTerminal: false,
  },
  interview_completed: {
    label: 'Interview Selesai',
    description: 'Interview telah selesai dilakukan',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    icon: 'check-circle',
    order: 5,
    isTerminal: false,
  },
  offer_extended: {
    label: 'Penawaran Dikirim',
    description: 'Perusahaan telah mengirimkan penawaran kerja',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    icon: 'gift',
    order: 6,
    isTerminal: false,
  },
  hired: {
    label: 'Diterima',
    description: 'Selamat! Anda diterima bekerja',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: 'trophy',
    order: 7,
    isTerminal: true,
  },
  rejected: {
    label: 'Tidak Lolos',
    description: 'Maaf, lamaran Anda tidak dapat dilanjutkan',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: 'x-circle',
    order: 8,
    isTerminal: true,
  },
  withdrawn: {
    label: 'Dibatalkan',
    description: 'Anda telah membatalkan lamaran ini',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: 'log-out',
    order: 9,
    isTerminal: true,
  },
};

// ============================================
// INTERFACES
// ============================================

/**
 * A single event in the application timeline
 * Events are immutable and append-only
 */
export interface TimelineEvent {
  id: string;
  status: ApplicationStatus;
  timestamp: string; // ISO 8601 format
  note?: string; // Optional note from company
  updatedBy: 'system' | 'company' | 'applicant';
  metadata?: {
    interviewDate?: string;
    interviewType?: 'online' | 'onsite';
    interviewLocation?: string;
    interviewLink?: string;
    rejectionReason?: string;
    offerDetails?: string;
  };
}

/**
 * Complete application record
 */
export interface Application {
  id: string;
  jobId: string;
  job: Pick<Job, 'id' | 'title' | 'company' | 'companyLogo' | 'location' | 'type'>;
  applicantId: string;
  appliedAt: string; // ISO 8601
  currentStatus: ApplicationStatus;
  timeline: TimelineEvent[];
  lastUpdatedAt: string;
  
  // Derived fields for quick access
  isActive: boolean; // Not rejected, withdrawn, or hired
  hasResponse: boolean; // Company has responded (viewed or beyond)
  daysInCurrentStatus: number;
}

/**
 * Application statistics for dashboard
 */
export interface ApplicationStats {
  total: number;
  active: number;
  interviews: number;
  offers: number;
  rejected: number;
  responseRate: number; // Percentage of applications that got responses
  averageResponseDays: number;
}

// ============================================
// MOCK DATA
// ============================================

export const mockApplications: Application[] = [
  {
    id: 'app-001',
    jobId: 'job-1',
    job: {
      id: 'job-1',
      title: 'Senior Frontend Developer',
      company: 'Tokopedia',
      companyLogo: 'https://logo.clearbit.com/tokopedia.com',
      location: 'Jakarta',
      type: 'Full-time',
    },
    applicantId: 'user-1',
    appliedAt: '2026-01-10T09:00:00Z',
    currentStatus: 'interview_scheduled',
    lastUpdatedAt: '2026-01-15T14:30:00Z',
    isActive: true,
    hasResponse: true,
    daysInCurrentStatus: 2,
    timeline: [
      {
        id: 'evt-001',
        status: 'submitted',
        timestamp: '2026-01-10T09:00:00Z',
        updatedBy: 'system',
      },
      {
        id: 'evt-002',
        status: 'viewed',
        timestamp: '2026-01-11T10:30:00Z',
        updatedBy: 'company',
        note: 'CV Anda sedang direview oleh tim HR',
      },
      {
        id: 'evt-003',
        status: 'shortlisted',
        timestamp: '2026-01-13T15:00:00Z',
        updatedBy: 'company',
        note: 'Profil Anda sesuai dengan kebutuhan kami',
      },
      {
        id: 'evt-004',
        status: 'interview_scheduled',
        timestamp: '2026-01-15T14:30:00Z',
        updatedBy: 'company',
        note: 'Interview akan dilakukan secara online via Google Meet',
        metadata: {
          interviewDate: '2026-01-20T10:00:00Z',
          interviewType: 'online',
          interviewLink: 'https://meet.google.com/xxx-xxxx-xxx',
        },
      },
    ],
  },
  {
    id: 'app-002',
    jobId: 'job-2',
    job: {
      id: 'job-2',
      title: 'UI/UX Designer',
      company: 'Gojek',
      companyLogo: 'https://logo.clearbit.com/gojek.com',
      location: 'Jakarta',
      type: 'Full-time',
    },
    applicantId: 'user-1',
    appliedAt: '2026-01-05T14:00:00Z',
    currentStatus: 'hired',
    lastUpdatedAt: '2026-01-16T09:00:00Z',
    isActive: false,
    hasResponse: true,
    daysInCurrentStatus: 1,
    timeline: [
      {
        id: 'evt-010',
        status: 'submitted',
        timestamp: '2026-01-05T14:00:00Z',
        updatedBy: 'system',
      },
      {
        id: 'evt-011',
        status: 'viewed',
        timestamp: '2026-01-06T09:15:00Z',
        updatedBy: 'company',
      },
      {
        id: 'evt-012',
        status: 'shortlisted',
        timestamp: '2026-01-07T11:00:00Z',
        updatedBy: 'company',
        note: 'Portfolio Anda sangat mengesankan!',
      },
      {
        id: 'evt-013',
        status: 'interview_scheduled',
        timestamp: '2026-01-08T14:00:00Z',
        updatedBy: 'company',
        metadata: {
          interviewDate: '2026-01-12T14:00:00Z',
          interviewType: 'onsite',
          interviewLocation: 'Gojek Tower, Jakarta',
        },
      },
      {
        id: 'evt-014',
        status: 'interview_completed',
        timestamp: '2026-01-12T16:00:00Z',
        updatedBy: 'company',
        note: 'Interview berjalan dengan baik',
      },
      {
        id: 'evt-015',
        status: 'offer_extended',
        timestamp: '2026-01-14T10:00:00Z',
        updatedBy: 'company',
        note: 'Kami ingin menawarkan posisi ini kepada Anda',
        metadata: {
          offerDetails: 'Paket kompensasi lengkap akan dikirim via email',
        },
      },
      {
        id: 'evt-016',
        status: 'hired',
        timestamp: '2026-01-16T09:00:00Z',
        updatedBy: 'company',
        note: 'Selamat bergabung dengan keluarga Gojek!',
      },
    ],
  },
  {
    id: 'app-003',
    jobId: 'job-3',
    job: {
      id: 'job-3',
      title: 'Data Scientist',
      company: 'Shopee',
      companyLogo: 'https://logo.clearbit.com/shopee.co.id',
      location: 'Jakarta',
      type: 'Full-time',
    },
    applicantId: 'user-1',
    appliedAt: '2026-01-08T11:00:00Z',
    currentStatus: 'rejected',
    lastUpdatedAt: '2026-01-14T16:00:00Z',
    isActive: false,
    hasResponse: true,
    daysInCurrentStatus: 3,
    timeline: [
      {
        id: 'evt-020',
        status: 'submitted',
        timestamp: '2026-01-08T11:00:00Z',
        updatedBy: 'system',
      },
      {
        id: 'evt-021',
        status: 'viewed',
        timestamp: '2026-01-09T08:30:00Z',
        updatedBy: 'company',
      },
      {
        id: 'evt-022',
        status: 'shortlisted',
        timestamp: '2026-01-10T14:00:00Z',
        updatedBy: 'company',
      },
      {
        id: 'evt-023',
        status: 'interview_scheduled',
        timestamp: '2026-01-11T10:00:00Z',
        updatedBy: 'company',
        metadata: {
          interviewDate: '2026-01-13T15:00:00Z',
          interviewType: 'online',
        },
      },
      {
        id: 'evt-024',
        status: 'interview_completed',
        timestamp: '2026-01-13T16:30:00Z',
        updatedBy: 'company',
      },
      {
        id: 'evt-025',
        status: 'rejected',
        timestamp: '2026-01-14T16:00:00Z',
        updatedBy: 'company',
        note: 'Terima kasih atas partisipasi Anda. Saat ini kami melanjutkan dengan kandidat lain yang lebih sesuai dengan kebutuhan spesifik kami.',
        metadata: {
          rejectionReason: 'Kami membutuhkan pengalaman lebih di bidang NLP dan Machine Learning untuk posisi ini.',
        },
      },
    ],
  },
  {
    id: 'app-004',
    jobId: 'job-4',
    job: {
      id: 'job-4',
      title: 'Product Manager',
      company: 'Bukalapak',
      companyLogo: 'https://logo.clearbit.com/bukalapak.com',
      location: 'Jakarta',
      type: 'Full-time',
    },
    applicantId: 'user-1',
    appliedAt: '2026-01-12T16:00:00Z',
    currentStatus: 'viewed',
    lastUpdatedAt: '2026-01-14T11:00:00Z',
    isActive: true,
    hasResponse: true,
    daysInCurrentStatus: 3,
    timeline: [
      {
        id: 'evt-030',
        status: 'submitted',
        timestamp: '2026-01-12T16:00:00Z',
        updatedBy: 'system',
      },
      {
        id: 'evt-031',
        status: 'viewed',
        timestamp: '2026-01-14T11:00:00Z',
        updatedBy: 'company',
        note: 'Terima kasih telah melamar. CV Anda sedang kami review.',
      },
    ],
  },
  {
    id: 'app-005',
    jobId: 'job-5',
    job: {
      id: 'job-5',
      title: 'Backend Engineer',
      company: 'Traveloka',
      companyLogo: 'https://logo.clearbit.com/traveloka.com',
      location: 'Jakarta',
      type: 'Full-time',
    },
    applicantId: 'user-1',
    appliedAt: '2026-01-15T10:00:00Z',
    currentStatus: 'submitted',
    lastUpdatedAt: '2026-01-15T10:00:00Z',
    isActive: true,
    hasResponse: false,
    daysInCurrentStatus: 2,
    timeline: [
      {
        id: 'evt-040',
        status: 'submitted',
        timestamp: '2026-01-15T10:00:00Z',
        updatedBy: 'system',
      },
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the expected next status(es) based on current status
 */
export function getNextPossibleStatuses(currentStatus: ApplicationStatus): ApplicationStatus[] {
  switch (currentStatus) {
    case 'submitted':
      return ['viewed', 'rejected'];
    case 'viewed':
      return ['shortlisted', 'rejected'];
    case 'shortlisted':
      return ['interview_scheduled', 'rejected'];
    case 'interview_scheduled':
      return ['interview_completed', 'rejected'];
    case 'interview_completed':
      return ['offer_extended', 'rejected', 'interview_scheduled']; // Can have multiple rounds
    case 'offer_extended':
      return ['hired', 'rejected'];
    case 'hired':
    case 'rejected':
    case 'withdrawn':
      return []; // Terminal states
    default:
      return [];
  }
}

/**
 * Calculate application statistics
 */
export function calculateApplicationStats(applications: Application[]): ApplicationStats {
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
  const responseRate = total > 0 ? (responded / total) * 100 : 0;
  
  // Calculate average response time (simplified)
  const responseTimes = applications
    .filter(a => a.timeline.length > 1)
    .map(a => {
      const submitted = new Date(a.timeline[0].timestamp);
      const firstResponse = new Date(a.timeline[1].timestamp);
      return (firstResponse.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24);
    });
  
  const averageResponseDays = responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;

  return {
    total,
    active,
    interviews,
    offers,
    rejected,
    responseRate: Math.round(responseRate),
    averageResponseDays: Math.round(averageResponseDays * 10) / 10,
  };
}

/**
 * Format timestamp to Indonesian locale
 */
export function formatTimelineDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTimelineTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 60) {
    return `${diffMinutes} menit lalu`;
  } else if (diffHours < 24) {
    return `${diffHours} jam lalu`;
  } else if (diffDays === 1) {
    return 'Kemarin';
  } else if (diffDays < 7) {
    return `${diffDays} hari lalu`;
  } else {
    return formatTimelineDate(timestamp);
  }
}
