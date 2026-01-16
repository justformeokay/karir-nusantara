import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cvData, setCvData] = useState<CVData>(() => {
    const saved = localStorage.getItem('cvData');
    return saved ? JSON.parse(saved) : defaultCVData;
  });

  const saveToLocalStorage = (data: CVData) => {
    localStorage.setItem('cvData', JSON.stringify(data));
  };

  const updatePersonalInfo = (data: Partial<CVData['personalInfo']>) => {
    setCvData(prev => {
      const updated = {
        ...prev,
        personalInfo: { ...prev.personalInfo, ...data },
      };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const addEducation = (education: Omit<Education, 'id'>) => {
    setCvData(prev => {
      const updated = {
        ...prev,
        education: [...prev.education, { ...education, id: Date.now().toString() }],
      };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const updateEducation = (id: string, education: Partial<Education>) => {
    setCvData(prev => {
      const updated = {
        ...prev,
        education: prev.education.map(e => (e.id === id ? { ...e, ...education } : e)),
      };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const removeEducation = (id: string) => {
    setCvData(prev => {
      const updated = {
        ...prev,
        education: prev.education.filter(e => e.id !== id),
      };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const addWorkExperience = (experience: Omit<WorkExperience, 'id'>) => {
    setCvData(prev => {
      const updated = {
        ...prev,
        workExperience: [...prev.workExperience, { ...experience, id: Date.now().toString() }],
      };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const updateWorkExperience = (id: string, experience: Partial<WorkExperience>) => {
    setCvData(prev => {
      const updated = {
        ...prev,
        workExperience: prev.workExperience.map(e => (e.id === id ? { ...e, ...experience } : e)),
      };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const removeWorkExperience = (id: string) => {
    setCvData(prev => {
      const updated = {
        ...prev,
        workExperience: prev.workExperience.filter(e => e.id !== id),
      };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const updateSkills = (skills: string[]) => {
    setCvData(prev => {
      const updated = { ...prev, skills };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const addCertification = (certification: Omit<Certification, 'id'>) => {
    setCvData(prev => {
      const updated = {
        ...prev,
        certifications: [...prev.certifications, { ...certification, id: Date.now().toString() }],
      };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const updateCertification = (id: string, certification: Partial<Certification>) => {
    setCvData(prev => {
      const updated = {
        ...prev,
        certifications: prev.certifications.map(c => (c.id === id ? { ...c, ...certification } : c)),
      };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const removeCertification = (id: string) => {
    setCvData(prev => {
      const updated = {
        ...prev,
        certifications: prev.certifications.filter(c => c.id !== id),
      };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const resetCV = () => {
    setCvData(defaultCVData);
    localStorage.removeItem('cvData');
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
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
