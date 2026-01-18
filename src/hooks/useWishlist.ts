import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWishlist,
  saveToWishlist,
  removeFromWishlist,
  checkIsJobSaved,
  getWishlistStats,
  type SavedJob,
} from '@/api/wishlist';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const wishlistKeys = {
  all: ['wishlist'] as const,
  list: () => [...wishlistKeys.all, 'list'] as const,
  stats: () => [...wishlistKeys.all, 'stats'] as const,
  check: (jobId: number) => [...wishlistKeys.all, 'check', jobId] as const,
};

/**
 * Hook to fetch wishlist items
 */
export function useWishlist(params: { page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: [...wishlistKeys.list(), params],
    queryFn: () => getWishlist(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch wishlist statistics
 */
export function useWishlistStats() {
  return useQuery({
    queryKey: wishlistKeys.stats(),
    queryFn: getWishlistStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to check if a job is saved
 */
export function useIsJobSaved(jobId: number) {
  return useQuery({
    queryKey: wishlistKeys.check(jobId),
    queryFn: () => checkIsJobSaved(jobId),
    enabled: jobId > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to save a job to wishlist
 */
export function useSaveToWishlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: saveToWishlist,
    onSuccess: () => {
      // Invalidate wishlist queries
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      toast({
        title: 'Tersimpan!',
        description: 'Lowongan berhasil disimpan ke wishlist',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menyimpan',
        description: error.message || 'Terjadi kesalahan saat menyimpan lowongan',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to remove a job from wishlist
 */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      // Invalidate wishlist queries
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      toast({
        title: 'Dihapus',
        description: 'Lowongan berhasil dihapus dari wishlist',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menghapus',
        description: error.message || 'Terjadi kesalahan saat menghapus lowongan',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to toggle job save status
 */
export function useToggleWishlist(jobId: number) {
  const { data: isSaved, isLoading: isChecking } = useIsJobSaved(jobId);
  const saveMutation = useSaveToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const toggle = async () => {
    if (isSaved) {
      await removeMutation.mutateAsync(jobId);
    } else {
      await saveMutation.mutateAsync(jobId);
    }
  };

  return {
    isSaved: isSaved || false,
    isLoading: isChecking || saveMutation.isPending || removeMutation.isPending,
    toggle,
  };
}
