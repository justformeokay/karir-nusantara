import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProfile,
  updateProfile,
  deleteProfile,
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  setPrimaryDocument,
  ApplicantProfile,
  ApplicantDocument,
  UpdateProfileRequest,
} from '@/api/profile';
import { toast } from 'sonner';

// ============================================
// QUERY KEYS
// ============================================

export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
  documents: () => [...profileKeys.all, 'documents'] as const,
  document: (id: string | number) => [...profileKeys.documents(), id] as const,
};

// ============================================
// PROFILE HOOKS
// ============================================

/**
 * Hook to fetch current user's profile
 */
export function useProfile() {
  return useQuery<ApplicantProfile>({
    queryKey: profileKeys.detail(),
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to update profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileKeys.detail(), updatedProfile);
      toast.success('Profil berhasil diperbarui');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui profil');
    },
  });
}

/**
 * Hook to delete profile
 */
export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: profileKeys.all });
      toast.success('Profil berhasil dihapus');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus profil');
    },
  });
}

// ============================================
// DOCUMENT HOOKS
// ============================================

/**
 * Hook to fetch all documents
 */
export function useDocuments() {
  return useQuery<ApplicantDocument[]>({
    queryKey: profileKeys.documents(),
    queryFn: getDocuments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a specific document
 */
export function useDocument(docId: string | number) {
  return useQuery<ApplicantDocument>({
    queryKey: profileKeys.document(docId),
    queryFn: () => getDocument(docId),
    enabled: !!docId,
  });
}

/**
 * Hook to upload a document
 */
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      documentType,
      options,
    }: {
      file: File;
      documentType: string;
      options?: { description?: string; isPrimary?: boolean };
    }) => uploadDocument(file, documentType, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.documents() });
      toast.success('Dokumen berhasil diupload');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengupload dokumen');
    },
  });
}

/**
 * Hook to update document metadata
 */
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      docId,
      data,
    }: {
      docId: string | number;
      data: { name?: string; description?: string };
    }) => updateDocument(docId, data),
    onSuccess: (updatedDoc) => {
      queryClient.setQueryData(profileKeys.document(updatedDoc.id), updatedDoc);
      queryClient.invalidateQueries({ queryKey: profileKeys.documents() });
      toast.success('Dokumen berhasil diperbarui');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui dokumen');
    },
  });
}

/**
 * Hook to delete a document
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (docId: string | number) => deleteDocument(docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.documents() });
      toast.success('Dokumen berhasil dihapus');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus dokumen');
    },
  });
}

/**
 * Hook to set a document as primary
 */
export function useSetPrimaryDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (docId: string | number) => setPrimaryDocument(docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.documents() });
      toast.success('Dokumen berhasil diset sebagai utama');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengubah dokumen utama');
    },
  });
}
