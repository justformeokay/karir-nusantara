import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  applyToJob,
  getMyApplications,
  getApplicationById,
  getApplicationTimeline,
  withdrawApplication,
  hasAppliedToJob,
  type Application,
  type ApplicationListParams,
  type ApplyRequest,
  type TimelineEvent,
} from '@/api';

// ============================================
// QUERY KEYS
// ============================================

export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
  list: (params: ApplicationListParams) => [...applicationKeys.lists(), params] as const,
  details: () => [...applicationKeys.all, 'detail'] as const,
  detail: (id: number) => [...applicationKeys.details(), id] as const,
  timeline: (id: number) => [...applicationKeys.details(), id, 'timeline'] as const,
  hasApplied: (jobId: number) => [...applicationKeys.all, 'hasApplied', jobId] as const,
};

// ============================================
// HOOKS
// ============================================

/**
 * Hook to fetch my applications
 */
export function useMyApplications(params: ApplicationListParams = {}) {
  return useQuery({
    queryKey: applicationKeys.list(params),
    queryFn: () => getMyApplications(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a single application by ID
 */
export function useApplication(id: number | undefined) {
  return useQuery({
    queryKey: applicationKeys.detail(id!),
    queryFn: () => getApplicationById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch application timeline
 */
export function useApplicationTimeline(applicationId: number | undefined) {
  return useQuery({
    queryKey: applicationKeys.timeline(applicationId!),
    queryFn: () => getApplicationTimeline(applicationId!),
    enabled: !!applicationId,
    staleTime: 1 * 60 * 1000, // 1 minute - timeline updates frequently
  });
}

/**
 * Hook to check if user has applied to a job
 */
export function useHasApplied(jobId: number | undefined) {
  return useQuery({
    queryKey: applicationKeys.hasApplied(jobId!),
    queryFn: () => hasAppliedToJob(jobId!),
    enabled: !!jobId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to apply to a job
 */
export function useApplyToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ApplyRequest) => applyToJob(request),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: applicationKeys.hasApplied(variables.job_id) 
      });
    },
  });
}

/**
 * Hook to withdraw an application
 */
export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: number) => withdrawApplication(applicationId),
    onSuccess: (_, applicationId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: applicationKeys.detail(applicationId) 
      });
    },
  });
}

/**
 * Hook to invalidate application cache
 */
export function useInvalidateApplications() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: applicationKeys.all });
  };
}
