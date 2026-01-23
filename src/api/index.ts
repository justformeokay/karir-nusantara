// API Service Layer - Clean Exports
// ====================================

// Configuration
export { API_BASE_URL, ENDPOINTS, ACCESS_TOKEN_KEY } from './config';

// HTTP Client
export { 
  api, 
  getAccessToken, 
  setAccessToken, 
  removeAccessToken,
  ApiException,
  type ApiResponse,
} from './client';

// Auth API
export {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  type User,
  type AuthResponse,
  type RegisterRequest,
  type LoginRequest,
} from './auth';

// Jobs API
export {
  listJobs,
  getJobById,
  getJobBySlug,
  formatSalary,
  getJobTypeLabel,
  getExperienceLabel,
  getTimeAgo,
  type Job,
  type JobCompany,
  type JobListParams,
  type JobListResponse,
} from './jobs';

// CV API
export {
  getCV,
  saveCV,
  deleteCV,
  transformToApiFormat,
  transformToFrontendFormat,
  type CVData,
  type CVRequest,
  type PersonalInfo,
  type Education,
  type Experience,
  type Skill,
  type Certification,
  type Language,
} from './cv';

// Applications API
export {
  applyToJob,
  getMyApplications,
  getApplicationById,
  getApplicationTimeline,
  withdrawApplication,
  hasAppliedToJob,
  getStatusLabel,
  getStatusVariant,
  getStatusColor,
  formatApplicationDate,
  canWithdraw,
  type Application,
  type ApplicationStatus,
  type TimelineEvent,
  type ApplicationListParams,
  type ApplicationListResponse,
  type ApplyRequest,
} from './applications';

// Profile API
export {
  getProfile,
  updateProfile,
  deleteProfile,
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  setPrimaryDocument,
  getDocumentTypeLabel,
  getGenderLabel,
  getMaritalStatusLabel,
  formatFileSize,
  type ApplicantProfile,
  type ApplicantDocument,
  type UpdateProfileRequest,
} from './profile';
