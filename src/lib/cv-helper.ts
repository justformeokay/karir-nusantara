import { CVData } from '@/api/cv';

export function calculateCVCompleteness(cv: CVData | null): number {
  if (!cv) return 0;

  let score = 0;
  
  // 1. Personal Info (Max 30%)
  const { personal_info } = cv;
  if (personal_info) {
    // Basic Details (10%)
    if (personal_info.full_name && personal_info.email) score += 10;
    
    // Contact Info (10%)
    if (personal_info.phone && (personal_info.address || personal_info.city)) score += 10;
    
    // Professional Summary (5%)
    if (personal_info.summary && personal_info.summary.length > 20) score += 5;
    
    // Social / Portfolio / Photo (5%)
    if (personal_info.photo_url || personal_info.linkedin || personal_info.portfolio) score += 5;
  }

  // 2. Work Experience (Max 25%)
  // Most critical section for recruiters
  if (cv.experience && cv.experience.length > 0) {
    score += 25;
  }

  // 3. Education (Max 20%)
  if (cv.education && cv.education.length > 0) {
    score += 20;
  }

  // 4. Skills (Max 15%)
  if (cv.skills && cv.skills.length > 0) {
    score += 10;
    // Bonus for having multiple skills (>= 3)
    if (cv.skills.length >= 3) score += 5;
  }

  // 5. Additional Info (Max 10%)
  const hasCertifications = cv.certifications && cv.certifications.length > 0;
  const hasLanguages = cv.languages && cv.languages.length > 0;

  if (hasCertifications) score += 5;
  if (hasLanguages) score += 5;

  return Math.min(score, 100);
}

export function getCompletenessStatus(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Sangat Lengkap', color: 'text-green-600' };
  if (score >= 60) return { label: 'Cukup Lengkap', color: 'text-blue-600' };
  if (score >= 40) return { label: 'Perlu Dilengkapi', color: 'text-yellow-600' };
  return { label: 'Belum Lengkap', color: 'text-red-600' };
}

