import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listJobs,
  getJobById,
  getJobBySlug,
  type Job,
  type JobListParams,
  type JobListResponse,
} from '@/api/jobs';

// ============================================
// QUERY KEYS
// ============================================

export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (params: JobListParams) => [...jobKeys.lists(), params] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: number) => [...jobKeys.details(), id] as const,
  slug: (slug: string) => [...jobKeys.details(), 'slug', slug] as const,
};

// ============================================
// HOOKS
// ============================================

/**
 * Hook to fetch paginated job listings with filters
 */
export function useJobs(params: JobListParams = {}) {
  return useQuery<JobListResponse>({
    queryKey: jobKeys.list(params),
    queryFn: () => listJobs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch a single job by ID
 */
export function useJob(id: number | undefined) {
  return useQuery<Job | null>({
    queryKey: jobKeys.detail(id!),
    queryFn: () => getJobById(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a job by slug
 */
export function useJobBySlug(slug: string | undefined) {
  return useQuery<Job | null>({
    queryKey: jobKeys.slug(slug!),
    queryFn: () => getJobBySlug(slug!),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for infinite scrolling job list
 */
export function useInfiniteJobs(params: Omit<JobListParams, 'page'>) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: async () => {
      const result = await listJobs({ ...params, page: 1 });
      return result;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to prefetch job details
 */
export function usePrefetchJob() {
  const queryClient = useQueryClient();

  return async (id: number) => {
    await queryClient.prefetchQuery({
      queryKey: jobKeys.detail(id),
      queryFn: () => getJobById(id),
      staleTime: 10 * 60 * 1000,
    });
  };
}

/**
 * Hook to invalidate job cache
 */
export function useInvalidateJobs() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: jobKeys.all });
  };
}
