import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  Application,
  ApplicationStats,
  ApplicationStatus,
  mockApplications,
  calculateApplicationStats,
} from '@/data/applications';

// ============================================
// TYPES
// ============================================

interface ApplicationContextType {
  // Data
  applications: Application[];
  stats: ApplicationStats;
  isLoading: boolean;
  
  // Getters
  getApplicationById: (id: string) => Application | undefined;
  getApplicationsByStatus: (status: ApplicationStatus) => Application[];
  getActiveApplications: () => Application[];
  
  // Actions
  applyToJob: (jobId: string, jobDetails: Application['job']) => Promise<Application>;
  withdrawApplication: (applicationId: string) => Promise<void>;
  refreshApplications: () => Promise<void>;
}

interface ApplicationProviderProps {
  children: React.ReactNode;
}

// ============================================
// CONTEXT
// ============================================

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export function ApplicationProvider({ children }: ApplicationProviderProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load applications on mount
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in production, this would fetch from backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to load from localStorage first, fallback to mock data
      const stored = localStorage.getItem('karir_applications');
      if (stored) {
        const parsed = JSON.parse(stored);
        setApplications(parsed);
      } else {
        setApplications(mockApplications);
        localStorage.setItem('karir_applications', JSON.stringify(mockApplications));
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
      setApplications(mockApplications);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats whenever applications change
  const stats = useMemo(() => {
    return calculateApplicationStats(applications);
  }, [applications]);

  // Save to localStorage whenever applications change
  useEffect(() => {
    if (applications.length > 0) {
      localStorage.setItem('karir_applications', JSON.stringify(applications));
    }
  }, [applications]);

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

  // ============================================
  // ACTIONS
  // ============================================

  const applyToJob = useCallback(async (
    jobId: string,
    jobDetails: Application['job']
  ): Promise<Application> => {
    // Check if already applied
    const existing = applications.find(app => app.jobId === jobId);
    if (existing) {
      throw new Error('Anda sudah melamar untuk posisi ini');
    }

    const now = new Date().toISOString();
    const newApplication: Application = {
      id: `app-${Date.now()}`,
      jobId,
      job: jobDetails,
      applicantId: 'user-1', // In production, get from auth context
      appliedAt: now,
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

    setApplications(prev => [newApplication, ...prev]);
    return newApplication;
  }, [applications]);

  const withdrawApplication = useCallback(async (applicationId: string): Promise<void> => {
    const now = new Date().toISOString();
    
    setApplications(prev => prev.map(app => {
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
            updatedBy: 'applicant',
            note: 'Lamaran dibatalkan oleh pelamar',
          },
        ],
      };
    }));
  }, []);

  const refreshApplications = useCallback(async (): Promise<void> => {
    await loadApplications();
  }, []);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: ApplicationContextType = {
    applications,
    stats,
    isLoading,
    getApplicationById,
    getApplicationsByStatus,
    getActiveApplications,
    applyToJob,
    withdrawApplication,
    refreshApplications,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
}

// ============================================
// SELECTORS (for optimized re-renders)
// ============================================

export function useApplication(id: string) {
  const { getApplicationById } = useApplications();
  return getApplicationById(id);
}

export function useApplicationStats() {
  const { stats } = useApplications();
  return stats;
}
