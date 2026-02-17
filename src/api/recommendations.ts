import { api } from './client';
import { ENDPOINTS } from './config';
import { Job, JobApiResponse, JobCompany } from './jobs';

// ============================================
// TYPES
// ============================================

// Raw API response with snake_case fields
interface RecommendationScoreApiResponse {
  job: JobApiResponse;
  score: number;
  match_reasons: string[];
  mismatch_reasons?: string[];
}

// Frontend-friendly format
export interface RecommendationScore {
  job: Job;
  score: number;
  match_reasons: string[];
  mismatch_reasons?: string[];
}

export interface RecommendationsResponse {
  recommendations: RecommendationScore[];
  total_jobs: number;
  matched_jobs: number;
  average_score: number;
  profile_complete: boolean;
}

// Transform API job response to frontend Job format
function transformJob(apiJob: JobApiResponse): Job {
  return {
    id: apiJob.id,
    hashId: apiJob.hash_id,
    title: apiJob.title,
    slug: apiJob.slug,
    description: apiJob.description,
    requirements: apiJob.requirements,
    responsibilities: apiJob.responsibilities,
    benefits: apiJob.benefits,
    city: apiJob.location?.city || '',
    province: apiJob.location?.province || '',
    location: apiJob.location ? `${apiJob.location.city}, ${apiJob.location.province}` : '',
    isRemote: apiJob.location?.is_remote || false,
    jobType: apiJob.job_type,
    experienceLevel: apiJob.experience_level,
    salaryMin: apiJob.salary?.min,
    salaryMax: apiJob.salary?.max,
    salaryCurrency: apiJob.salary?.currency || 'IDR',
    isSalaryVisible: !!apiJob.salary,
    skills: apiJob.skills || [],
    company: apiJob.company,
    status: apiJob.status,
    viewsCount: apiJob.views_count || 0,
    applicationsCount: apiJob.applications_count || 0,
    applicationDeadline: apiJob.application_deadline,
    publishedAt: apiJob.published_at,
    createdAt: apiJob.created_at,
  };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get personalized job recommendations based on user profile and CV
 */
export async function getRecommendations(limit: number = 20): Promise<RecommendationsResponse> {
  interface ApiResponse {
    recommendations: RecommendationScoreApiResponse[];
    total_jobs: number;
    matched_jobs: number;
    average_score: number;
    profile_complete: boolean;
  }

  const response = await api.get<ApiResponse>(
    `${ENDPOINTS.RECOMMENDATIONS.GET}?limit=${limit}`
  );
  
  const data = response.data;
  
  if (!data) {
    return {
      recommendations: [],
      total_jobs: 0,
      matched_jobs: 0,
      average_score: 0,
      profile_complete: false,
    };
  }

  // Transform recommendations with transformed jobs
  return {
    recommendations: (data.recommendations || []).map(rec => ({
      job: transformJob(rec.job),
      score: rec.score,
      match_reasons: rec.match_reasons || [],
      mismatch_reasons: rec.mismatch_reasons || [],
    })),
    total_jobs: data.total_jobs,
    matched_jobs: data.matched_jobs,
    average_score: data.average_score,
    profile_complete: data.profile_complete,
  };
}
