import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
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
  infinite: (params: Omit<JobListParams, 'page'>) => [...jobKeys.lists(), 'infinite', params] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...jobKeys.details(), id] as const,
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
 * Hook to fetch a single job by ID (supports hash_id)
 */
export function useJob(id: string | number | undefined) {
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
 * Hook for infinite scrolling job list - fetches 10 jobs per page
 */
export function useInfiniteJobs(params: Omit<JobListParams, 'page' | 'per_page'>) {
  return useInfiniteQuery({
    queryKey: jobKeys.infinite(params),
    queryFn: async ({ pageParam = 1 }) => {
      const result = await listJobs({ 
        ...params, 
        page: pageParam, 
        per_page: 10 
      });
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined;
      const { page, total_pages } = lastPage.meta;
      return page < total_pages ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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
