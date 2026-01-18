import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext.new';
import {
  getCV,
  saveCV as apiSaveCV,
  transformToApiFormat,
  transformToFrontendFormat,
  type CVData as ApiCVData,
} from '@/api';

// ============================================
// TYPES (Frontend format - unchanged from original)
// ============================================

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  description?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
}

export interface CVData {
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
  education: Education[];
  workExperience: WorkExperience[];
  skills: string[];
  certifications: Certification[];
}

const defaultCVData: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedIn: '',
    portfolio: '',
    summary: '',
    photo: '',
  },
  education: [],
  workExperience: [],
  skills: [],
  certifications: [],
};

interface CVContextType {
  cvData: CVData;
  isLoading: boolean;
  isSaving: boolean;
  lastSynced: Date | null;
  updatePersonalInfo: (data: Partial<CVData['personalInfo']>) => void;
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addWorkExperience: (experience: Omit<WorkExperience, 'id'>) => void;
  updateWorkExperience: (id: string, experience: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  updateSkills: (skills: string[]) => void;
  addCertification: (certification: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  resetCV: () => void;
  syncToServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

// Helper to validate and normalize CV data schema
const normalizeCVData = (data: Partial<CVData>): CVData => {
  return {
    personalInfo: {
      fullName: data.personalInfo?.fullName ?? '',
      email: data.personalInfo?.email ?? '',
      phone: data.personalInfo?.phone ?? '',
      address: data.personalInfo?.address ?? '',
      linkedIn: data.personalInfo?.linkedIn ?? '',
      portfolio: data.personalInfo?.portfolio ?? '',
      summary: data.personalInfo?.summary ?? '',
      photo: data.personalInfo?.photo ?? '',
    },
    education: Array.isArray(data.education) ? data.education : [],
    workExperience: Array.isArray(data.workExperience) ? data.workExperience : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
  };
};

export const CVProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem('cvData');
      if (saved) {
        const parsed = JSON.parse(saved);
        return normalizeCVData(parsed);
      }
    } catch (error) {
      console.error('❌ Error loading CV data from localStorage:', error);
    }
    return defaultCVData;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Save to localStorage immediately
  const saveToLocalStorage = (data: CVData) => {
    try {
      localStorage.setItem('cvData', JSON.stringify(data));
    } catch (error) {
      console.error('❌ Error saving CV data to localStorage:', error);
    }
  };

  // Load from server when authenticated
  const loadFromServer = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const apiCV = await getCV();
      if (apiCV) {
        const frontendCV = transformToFrontendFormat(apiCV);
        setCvData(frontendCV);
        saveToLocalStorage(frontendCV);
        setLastSynced(new Date());
        console.log('✅ Loaded CV from server');
      }
    } catch (error) {
      console.error('❌ Error loading CV from server:', error);
      // Keep using localStorage data
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Sync to server
  const syncToServer = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsSaving(true);
    try {
      const apiFormat = transformToApiFormat(cvData);
      console.log('📤 Sending CV to server:', JSON.stringify(apiFormat, null, 2));
      await apiSaveCV(apiFormat);
      setLastSynced(new Date());
      console.log('✅ CV synced to server');
    } catch (error) {
      console.error('❌ Error syncing CV to server:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [isAuthenticated, cvData]);

  // Auto-load from server when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      loadFromServer();
    }
  }, [isAuthenticated, loadFromServer]);

  // Debounced auto-sync to server
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const timeoutId = setTimeout(() => {
      syncToServer().catch(console.error);
    }, 3000); // Sync 3 seconds after last change

    return () => clearTimeout(timeoutId);
  }, [cvData, isAuthenticated, syncToServer]);

  const updatePersonalInfo = useCallback((data: Partial<CVData['personalInfo']>) => {
    setCvData(prev => {
      const updated = {
        ...prev,
        personalInfo: { ...prev.personalInfo, ...data },
      };
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const addEducation = useCallback((education: Omit<Education, 'id'>) => {
    setCvData(prev => {
      const newId = Date.now().toString();
      const newEducationItem = { ...education, id: newId };
      const prevEducation = Array.isArray(prev.education) ? prev.education : [];
      const updated = {
        ...prev,
        education: [...prevEducation, newEducationItem],
      };
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const updateEducation = useCallback((id: string, education: Partial<Education>) => {
    setCvData(prev => {
      const prevEducation = Array.isArray(prev.education) ? prev.education : [];
      const updated = {
        ...prev,
        education: prevEducation.map(e => (e.id === id ? { ...e, ...education } : e)),
      };
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const removeEducation = useCallback((id: string) => {
    setCvData(prev => {
      const prevEducation = Array.isArray(prev.education) ? prev.education : [];
      const updated = {
        ...prev,
        education: prevEducation.filter(e => e.id !== id),
      };
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const addWorkExperience = useCallback((experience: Omit<WorkExperience, 'id'>) => {
    setCvData(prev => {
      const newId = Date.now().toString();
      const newExperienceItem = { ...experience, id: newId };
      const prevExperience = Array.isArray(prev.workExperience) ? prev.workExperience : [];
      const updated = {
        ...prev,
        workExperience: [...prevExperience, newExperienceItem],
      };
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const updateWorkExperience = useCallback((id: string, experience: Partial<WorkExperience>) => {
    setCvData(prev => {
      const prevExperience = Array.isArray(prev.workExperience) ? prev.workExperience : [];
      const updated = {
        ...prev,
        workExperience: prevExperience.map(e => (e.id === id ? { ...e, ...experience } : e)),
      };
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const removeWorkExperience = useCallback((id: string) => {
    setCvData(prev => {
      const prevExperience = Array.isArray(prev.workExperience) ? prev.workExperience : [];
      const updated = {
        ...prev,
        workExperience: prevExperience.filter(e => e.id !== id),
      };
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const updateSkills = useCallback((skills: string[]) => {
    setCvData(prev => {
      const safeSkills = Array.isArray(skills) ? skills : [];
      const updated = { ...prev, skills: safeSkills };
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const addCertification = useCallback((certification: Omit<Certification, 'id'>) => {
    setCvData(prev => {
      const newId = Date.now().toString();
      const newCertificationItem = { ...certification, id: newId };
      const prevCertifications = Array.isArray(prev.certifications) ? prev.certifications : [];
      const updated = {
        ...prev,
        certifications: [...prevCertifications, newCertificationItem],
      };
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const updateCertification = useCallback((id: string, certification: Partial<Certification>) => {
    setCvData(prev => {
      const prevCertifications = Array.isArray(prev.certifications) ? prev.certifications : [];
      const updated = {
        ...prev,
        certifications: prevCertifications.map(c => (c.id === id ? { ...c, ...certification } : c)),
      };
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const removeCertification = useCallback((id: string) => {
    setCvData(prev => {
      const prevCertifications = Array.isArray(prev.certifications) ? prev.certifications : [];
      const updated = {
        ...prev,
        certifications: prevCertifications.filter(c => c.id !== id),
      };
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const resetCV = useCallback(() => {
    setCvData(defaultCVData);
    localStorage.removeItem('cvData');
    console.log('🔄 CV data reset to default');
  }, []);

  return (
    <CVContext.Provider
      value={{
        cvData,
        isLoading,
        isSaving,
        lastSynced,
        updatePersonalInfo,
        addEducation,
        updateEducation,
        removeEducation,
        addWorkExperience,
        updateWorkExperience,
        removeWorkExperience,
        updateSkills,
        addCertification,
        updateCertification,
        removeCertification,
        resetCV,
        syncToServer,
        loadFromServer,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};
