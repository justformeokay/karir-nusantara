import { Job } from '@/data/jobs';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills?: string[];
  category?: string;
  location?: string;
  experience?: number; // in years
}

export interface RecommendationScore {
  job: Job;
  score: number; // 0-100
  matchReasons: string[];
  mismatchReasons: string[];
}

/**
 * Calculate match score between user profile and job
 * Factors:
 * - Category match (30%)
 * - Location match (25%)
 * - Experience level (25%)
 * - Skill requirements (20%)
 */
export const calculateJobScore = (
  profile: UserProfile,
  job: Job
): RecommendationScore => {
  let score = 0;
  const matchReasons: string[] = [];
  const mismatchReasons: string[] = [];

  // 1. Category Match (30%)
  const categoryWeight = 30;
  if (profile.category && profile.category.toLowerCase() === job.category.toLowerCase()) {
    score += categoryWeight;
    matchReasons.push(`Sesuai dengan kategori ${job.category}`);
  } else if (profile.category) {
    mismatchReasons.push(`Kategori berbeda: Anda mencari ${profile.category}, lowongan ini ${job.category}`);
  }

  // 2. Location Match (25%)
  const locationWeight = 25;
  if (profile.location) {
    if (job.isRemote) {
      score += locationWeight;
      matchReasons.push('Lokasi fleksibel - Work from anywhere');
    } else if (profile.location.toLowerCase() === job.province.toLowerCase()) {
      score += locationWeight;
      matchReasons.push(`Lokasi sesuai: ${job.province}`);
    } else if (
      profile.location.toLowerCase().includes('indonesia') ||
      profile.location.toLowerCase() === 'indonesia'
    ) {
      // If looking for Indonesia-wide, give partial credit
      score += locationWeight * 0.5;
      mismatchReasons.push(`Lokasi berbeda: Anda di ${profile.location}, lowongan di ${job.province}`);
    } else {
      mismatchReasons.push(`Lokasi berbeda: Anda di ${profile.location}, lowongan di ${job.province}`);
    }
  }

  // 3. Experience Level Match (25%)
  const experienceWeight = 25;
  if (profile.experience !== undefined) {
    const jobMinExp = extractMinExperience(job);
    
    if (profile.experience >= jobMinExp) {
      score += experienceWeight;
      matchReasons.push(`Pengalaman Anda sesuai (${profile.experience} tahun)`);
    } else if (profile.experience >= jobMinExp * 0.75) {
      score += experienceWeight * 0.7;
      mismatchReasons.push(`Sedikit kurang pengalaman (Anda: ${profile.experience} tahun, dibutuhkan: ${jobMinExp}+ tahun)`);
    } else {
      mismatchReasons.push(`Kurang pengalaman (Anda: ${profile.experience} tahun, dibutuhkan: ${jobMinExp}+ tahun)`);
    }
  }

  // 4. Skill Match (20%)
  const skillWeight = 20;
  if (profile.skills && profile.skills.length > 0) {
    const matchedSkills = findMatchedSkills(profile.skills, job.requirements);
    const skillMatchPercentage = matchedSkills.length / job.requirements.length;
    score += skillWeight * skillMatchPercentage;

    if (matchedSkills.length > 0) {
      matchReasons.push(`${matchedSkills.length} skill cocok: ${matchedSkills.slice(0, 3).join(', ')}`);
    }

    const missingSkills = job.requirements.filter(
      req => !profile.skills!.some(skill => req.toLowerCase().includes(skill.toLowerCase()))
    );
    if (missingSkills.length > 0) {
      mismatchReasons.push(`Skill kurang: ${missingSkills.slice(0, 2).join(', ')}`);
    }
  }

  // Bonus: Urgent job (5%)
  if (job.isUrgent) {
    score = Math.min(score + 5, 100);
    matchReasons.push('Lowongan urgent - kesempatan lebih besar');
  }

  // Bonus: Remote option (5%)
  if (job.isRemote && !matchReasons.some(r => r.includes('Work from anywhere'))) {
    score = Math.min(score + 2, 100);
    matchReasons.push('Tersedia opsi work from home');
  }

  return {
    job,
    score: Math.round(score),
    matchReasons: matchReasons.slice(0, 3),
    mismatchReasons: mismatchReasons.slice(0, 2),
  };
};

/**
 * Extract minimum experience requirement from job requirements
 */
function extractMinExperience(job: Job): number {
  const requirementText = job.requirements.join(' ').toLowerCase();
  
  // Look for patterns like "3 tahun", "3+ tahun", "3-5 tahun"
  const patterns = [
    /(\d+)\+?\s*tahun/,
    /minimal\s*(\d+)\s*tahun/,
    /at least\s*(\d+)\s*years?/,
  ];

  for (const pattern of patterns) {
    const match = requirementText.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  // Default: assume entry level = 0 years, mid-level = 2 years
  if (requirementText.includes('entry') || requirementText.includes('junior')) {
    return 0;
  }
  if (requirementText.includes('senior')) {
    return 5;
  }
  if (requirementText.includes('lead') || requirementText.includes('manager')) {
    return 7;
  }

  return 2; // Default to 2 years
}

/**
 * Find matching skills between profile and job requirements
 */
function findMatchedSkills(profileSkills: string[], jobRequirements: string[]): string[] {
  return profileSkills.filter(skill =>
    jobRequirements.some(req =>
      req.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(req.toLowerCase())
    )
  );
}

/**
 * Get recommendations for user
 * Returns top N jobs sorted by score
 */
export const getJobRecommendations = (
  profile: UserProfile,
  jobs: Job[],
  limit: number = 10
): RecommendationScore[] => {
  return jobs
    .map(job => calculateJobScore(profile, job))
    .filter(rec => rec.score > 30) // Only show jobs with >30% match
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * Get match percentage color
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#22c55e'; // green
  if (score >= 60) return '#eab308'; // yellow
  if (score >= 40) return '#f97316'; // orange
  return '#ef4444'; // red
};

/**
 * Get match status label
 */
export const getScoreLabel = (score: number): string => {
  if (score >= 85) return 'Sangat Cocok';
  if (score >= 70) return 'Cocok';
  if (score >= 50) return 'Cukup Cocok';
  if (score >= 30) return 'Mungkin Cocok';
  return 'Tidak Cocok';
};

/**
 * Build user profile from user and CV data
 */
export const buildUserProfile = (user: any, cvData?: any): UserProfile => {
  return {
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone,
    skills: cvData?.skills || [],
    category: cvData?.preferredCategory || user?.preferredCategory,
    location: cvData?.location || user?.location,
    experience: cvData?.totalExperience || 0,
  };
};
