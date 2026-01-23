import { api } from './client';
import { ENDPOINTS } from './config';

// ============================================
// TYPES (matching backend schema)
// ============================================

export interface PersonalInfo {
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  summary?: string;
  linkedin?: string;
  portfolio?: string;
  photo_url?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  gpa?: string; // Backend expects string
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

export interface Skill {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
}

export interface Language {
  name: string;
  proficiency: 'basic' | 'conversational' | 'proficient' | 'fluent' | 'native';
}

export interface CVData {
  id?: number;
  user_id?: number;
  personal_info: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  completeness?: number;
  completeness_score?: number; // Backend sends this
  last_updated_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CVRequest {
  personal_info: PersonalInfo;
  education?: Education[];
  experience?: Experience[];
  skills?: Skill[];
  certifications?: Certification[];
  languages?: Language[];
}

// ============================================
// CV API FUNCTIONS
// ============================================

/**
 * Get current user's CV
 */
export async function getCV(): Promise<CVData | null> {
  try {
    const response = await api.get<CVData>(ENDPOINTS.CV.GET);
    return response.data ?? null;
  } catch {
    // Return null if CV doesn't exist yet
    return null;
  }
}

/**
 * Create or update CV
 */
export async function saveCV(data: CVRequest): Promise<CVData> {
  try {
    // Ensure all required fields are present
    if (!data.personal_info?.full_name || !data.personal_info?.email) {
      throw new Error('Full name and email are required');
    }
    
    // Sanitize education data - ensure GPA is string
    const sanitizedEducation = data.education?.map(edu => ({
      ...edu,
      gpa: edu.gpa !== undefined ? String(edu.gpa) : undefined,
    })) || [];
    
    const sanitizedData: CVRequest = {
      ...data,
      education: sanitizedEducation,
    };
    
    console.log('📤 Sending CV to backend:', JSON.stringify(sanitizedData, null, 2));
    const response = await api.post<CVData>(ENDPOINTS.CV.CREATE_OR_UPDATE, sanitizedData);
    
    if (!response.data) {
      throw new Error('Failed to save CV');
    }
    
    console.log('✅ CV saved successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to save CV:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
}

/**
 * Delete CV
 */
export async function deleteCV(): Promise<void> {
  await api.delete(ENDPOINTS.CV.DELETE);
}

// ============================================
// TRANSFORMER: Frontend <-> API
// ============================================

/**
 * Transform frontend CV format to API format
 */
export function transformToApiFormat(frontendCV: {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedIn?: string;
    portfolio?: string;
    summary: string;
    photo?: string;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    description?: string;
  }>;
  workExperience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    isCurrentJob: boolean;
    description: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    year: string;
    credentialId?: string;
  }>;
}): CVRequest {
  return {
    personal_info: {
      full_name: frontendCV.personalInfo.fullName,
      email: frontendCV.personalInfo.email,
      phone: frontendCV.personalInfo.phone || undefined,
      address: frontendCV.personalInfo.address || undefined,
      summary: frontendCV.personalInfo.summary || undefined,
      linkedin: frontendCV.personalInfo.linkedIn || undefined,
      portfolio: frontendCV.personalInfo.portfolio || undefined,
      photo_url: frontendCV.personalInfo.photo || undefined,
    },
    education: frontendCV.education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field,
      start_date: `${edu.startYear}-01-01`,
      end_date: edu.endYear ? `${edu.endYear}-12-31` : undefined,
      description: edu.description,
    })),
    experience: frontendCV.workExperience.map(exp => ({
      company: exp.company,
      position: exp.position,
      start_date: exp.startDate,
      end_date: exp.isCurrentJob ? undefined : exp.endDate,
      is_current: exp.isCurrentJob,
      description: exp.description,
    })),
    skills: frontendCV.skills.map(skill => ({
      name: skill,
      level: 'intermediate' as const,
    })),
    certifications: frontendCV.certifications.map(cert => ({
      name: cert.name,
      issuer: cert.issuer,
      issue_date: `${cert.year}-01-01`,
      credential_id: cert.credentialId,
    })),
    languages: [],
  };
}

/**
 * Transform API CV format to frontend format
 */
export function transformToFrontendFormat(apiCV: CVData): {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedIn: string;
    portfolio: string;
    summary: string;
    photo: string;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    description?: string;
  }>;
  workExperience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    isCurrentJob: boolean;
    description: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    year: string;
    credentialId?: string;
  }>;
} {
  return {
    personalInfo: {
      fullName: apiCV.personal_info.full_name || '',
      email: apiCV.personal_info.email || '',
      phone: apiCV.personal_info.phone || '',
      address: apiCV.personal_info.address || '',
      linkedIn: apiCV.personal_info.linkedin || '',
      portfolio: apiCV.personal_info.portfolio || '',
      summary: apiCV.personal_info.summary || '',
      photo: apiCV.personal_info.photo_url || '',
    },
    education: (apiCV.education || []).map((edu, index) => ({
      id: String(index + 1),
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field_of_study,
      startYear: edu.start_date ? new Date(edu.start_date).getFullYear().toString() : '',
      endYear: edu.end_date ? new Date(edu.end_date).getFullYear().toString() : '',
      description: edu.description,
    })),
    workExperience: (apiCV.experience || []).map((exp, index) => ({
      id: String(index + 1),
      company: exp.company,
      position: exp.position,
      startDate: exp.start_date || '',
      endDate: exp.end_date || '',
      isCurrentJob: exp.is_current,
      description: exp.description || '',
    })),
    skills: (apiCV.skills || []).map(skill => skill.name),
    certifications: (apiCV.certifications || []).map((cert, index) => ({
      id: String(index + 1),
      name: cert.name,
      issuer: cert.issuer,
      year: cert.issue_date ? new Date(cert.issue_date).getFullYear().toString() : '',
      credentialId: cert.credential_id,
    })),
  };
}
