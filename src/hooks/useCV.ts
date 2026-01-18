import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCV,
  saveCV,
  deleteCV,
  transformToApiFormat,
  transformToFrontendFormat,
  type CVData,
  type CVRequest,
} from '@/api';
import type { CVData as FrontendCVData } from '@/contexts/CVContext.new';

// ============================================
// QUERY KEYS
// ============================================

export const cvKeys = {
  all: ['cv'] as const,
  detail: () => [...cvKeys.all, 'detail'] as const,
};

// ============================================
// HOOKS
// ============================================

/**
 * Hook to fetch user's CV
 */
export function useCV() {
  return useQuery({
    queryKey: cvKeys.detail(),
    queryFn: async () => {
      const apiCV = await getCV();
      if (apiCV) {
        return transformToFrontendFormat(apiCV);
      }
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to save CV
 */
export function useSaveCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (frontendCV: FrontendCVData) => {
      const apiFormat = transformToApiFormat(frontendCV);
      return saveCV(apiFormat);
    },
    onSuccess: () => {
      // Invalidate CV cache
      queryClient.invalidateQueries({ queryKey: cvKeys.all });
    },
  });
}

/**
 * Hook to delete CV
 */
export function useDeleteCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCV,
    onSuccess: () => {
      // Invalidate CV cache
      queryClient.invalidateQueries({ queryKey: cvKeys.all });
    },
  });
}

/**
 * Hook to invalidate CV cache
 */
export function useInvalidateCV() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: cvKeys.all });
  };
}
