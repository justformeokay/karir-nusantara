// Custom Hooks - Clean Exports
// ====================================

// Auth Hooks
export {
  useLogin,
  useRegister,
  useLogout,
  useCurrentUser,
  useRefreshToken,
} from './useAuth';

// Jobs Hooks
export {
  useJobs,
  useJob,
  useJobBySlug,
  useInfiniteJobs,
  usePrefetchJob,
  useInvalidateJobs,
  jobKeys,
} from './useJobs';

// Applications Hooks
export {
  useMyApplications,
  useApplication,
  useApplicationTimeline,
  useHasApplied,
  useApplyToJob,
  useWithdrawApplication,
  useInvalidateApplications,
  applicationKeys,
} from './useApplications';

// CV Hooks
export {
  useCV,
  useSaveCV,
  useDeleteCV,
  useInvalidateCV,
  cvKeys,
} from './useCV';

// Re-export existing hooks
export { useIsMobile } from './use-mobile';
export { useToast, toast } from './use-toast';
