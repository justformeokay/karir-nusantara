import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Languages,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  Save,
  Eye,
  Download,
  FileText,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle,
  XCircle,
  Camera,
  Upload,
  File,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.new';
import { getProfile, updateProfile, ApplicantProfile, uploadAvatar, getDocuments, uploadDocument, deleteDocument, ApplicantDocument } from '@/api/profile';
import { STATIC_BASE_URL } from '@/api/config';
import {
  getCV,
  saveCV,
  CVData,
  CVRequest,
  PersonalInfo,
  Education,
  Experience,
  Skill,
  Certification,
  Language,
} from '@/api/cv';
import CVPDFGenerator, { CVDataForPDF } from '@/components/cv/CVPDFGenerator';
import { calculateCVCompleteness } from '@/lib/cv-helper';

// ============================================
// TYPES
// ============================================

type Step = 'personal' | 'education' | 'experience' | 'skills' | 'certifications' | 'languages';
type CVMode = 'upload' | 'builder' | null;

interface StepConfig {
  id: Step;
  label: string;
  icon: React.ElementType;
  description: string;
}

const steps: StepConfig[] = [
  { id: 'personal', label: 'Data Diri', icon: User, description: 'Informasi pribadi dan kontak' },
  { id: 'education', label: 'Pendidikan', icon: GraduationCap, description: 'Riwayat pendidikan formal' },
  { id: 'experience', label: 'Pengalaman', icon: Briefcase, description: 'Pengalaman kerja dan magang' },
  { id: 'skills', label: 'Keahlian', icon: Code, description: 'Skill teknis dan soft skill' },
  { id: 'certifications', label: 'Sertifikasi', icon: Award, description: 'Sertifikat dan penghargaan' },
  { id: 'languages', label: 'Bahasa', icon: Languages, description: 'Kemampuan berbahasa' },
];

// ============================================
// COMPONENT
// ============================================

const CVPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [hasCV, setHasCV] = useState(false);
  
  // CV Mode and Upload States
  const [cvMode, setCvMode] = useState<CVMode>(null);
  const [uploadedCV, setUploadedCV] = useState<ApplicantDocument | null>(null);
  const [uploadingCV, setUploadingCV] = useState(false);
  const cvFileInputRef = useRef<HTMLInputElement>(null);
  
  // CV Data States
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    summary: '',
    linkedin: '',
    portfolio: '',
  });
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  // Editing states for forms
  const [newEducation, setNewEducation] = useState<Partial<Education>>({});
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({});
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState<Partial<Certification>>({});
  const [newLanguage, setNewLanguage] = useState<Partial<Language>>({});

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  // Load CV on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    loadCV();
  }, [isAuthenticated]);

  const loadCV = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading CV data...');
      
      // Load CV, Profile, and Documents data in parallel
      const [cv, profile, documents] = await Promise.all([
        getCV().catch(() => null),
        getProfile().catch(() => null),
        getDocuments().catch(() => []),
      ]);
      
      // Check for uploaded CV document
      const uploadedCVDoc = documents.find(doc => doc.document_type === 'cv_uploaded');
      if (uploadedCVDoc) {
        setUploadedCV(uploadedCVDoc);
        setCvMode('upload');
        console.log('✅ Found uploaded CV:', uploadedCVDoc);
      }
      
      // Merge data from both sources
      // Priority: CV data first, then Profile data as fallback
      const mergedPersonalInfo: PersonalInfo = {
        full_name: cv?.personal_info?.full_name || user?.name || '',
        email: cv?.personal_info?.email || user?.email || '',
        phone: cv?.personal_info?.phone || user?.phone || '',
        address: cv?.personal_info?.address || profile?.address || '',
        city: cv?.personal_info?.city || profile?.city || '',
        province: cv?.personal_info?.province || profile?.province || '',
        summary: cv?.personal_info?.summary || profile?.professional_summary || '',
        linkedin: cv?.personal_info?.linkedin || profile?.linkedin_url || '',
        portfolio: cv?.personal_info?.portfolio || profile?.portfolio_url || '',
        photo_url: cv?.personal_info?.photo_url || '',
      };
      
      setPersonalInfo(mergedPersonalInfo);
      console.log('✅ Personal Info loaded:', mergedPersonalInfo);
      
      // Set photo URL from user avatar
      if (user?.avatarUrl) {
        const avatarFullUrl = user.avatarUrl.startsWith('http') 
          ? user.avatarUrl 
          : `${STATIC_BASE_URL}${user.avatarUrl}`;
        setPhotoUrl(avatarFullUrl);
      }
      
      if (cv) {
        setHasCV(true);
        // If no uploaded CV, set builder mode
        if (!uploadedCVDoc) {
          setCvMode('builder');
        }
        setEducation(cv.education || []);
        setExperience(cv.experience || []);
        setSkills(cv.skills || []);
        setCertifications(cv.certifications || []);
        setLanguages(cv.languages || []);
        console.log('✅ CV data loaded from backend');
      }
    } catch (error) {
      console.error('Failed to load CV:', error);
      toast.error('Gagal memuat CV');
    } finally {
      setLoading(false);
      console.log('🏁 Loading complete');
    }
  };
  
  // Handle CV file upload
  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format file harus PDF atau Word (DOC/DOCX)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }
    
    try {
      setUploadingCV(true);
      
      // Delete existing uploaded CV if exists
      if (uploadedCV) {
        await deleteDocument(uploadedCV.id);
      }
      
      // Upload new CV
      const newDoc = await uploadDocument(file, 'cv_uploaded', {
        description: 'CV yang diupload oleh user',
        isPrimary: true,
      });
      
      setUploadedCV(newDoc);
      setCvMode('upload');
      toast.success('CV berhasil diupload!');
    } catch (error) {
      console.error('Failed to upload CV:', error);
      toast.error('Gagal mengupload CV');
    } finally {
      setUploadingCV(false);
      // Reset input
      if (cvFileInputRef.current) {
        cvFileInputRef.current.value = '';
      }
    }
  };
  
  // Handle delete uploaded CV
  const handleDeleteUploadedCV = async () => {
    if (!uploadedCV) return;
    
    try {
      await deleteDocument(uploadedCV.id);
      setUploadedCV(null);
      setCvMode(hasCV ? 'builder' : null);
      toast.success('CV berhasil dihapus');
    } catch (error) {
      console.error('Failed to delete CV:', error);
      toast.error('Gagal menghapus CV');
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!personalInfo.full_name || !personalInfo.email) {
        toast.error('Nama lengkap dan email harus diisi');
        setSaving(false);
        return;
      }
      
      // Auto-add pending form data before saving
      let updatedEducation = [...education];
      let updatedExperience = [...experience];
      let updatedCertifications = [...certifications];
      let updatedLanguages = [...languages];
      
      // Auto-add education if form is filled
      if (newEducation.institution && newEducation.degree && newEducation.field_of_study && newEducation.start_date) {
        updatedEducation = [...education, newEducation as Education];
        setEducation(updatedEducation);
        setNewEducation({});
      } else if (newEducation.institution || newEducation.degree || newEducation.field_of_study) {
        toast.error('Pendidikan: Lengkapi semua field yang wajib (Institusi, Gelar, Jurusan, Tahun Mulai)');
        setSaving(false);
        return;
      }
      
      // Auto-add experience if form is filled
      if (newExperience.company && newExperience.position && newExperience.start_date) {
        updatedExperience = [...experience, newExperience as Experience];
        setExperience(updatedExperience);
        setNewExperience({});
      } else if (newExperience.company || newExperience.position) {
        toast.error('Pengalaman: Lengkapi semua field yang wajib (Perusahaan, Posisi, Tahun Mulai)');
        setSaving(false);
        return;
      }
      
      // Auto-add certification if form is filled
      if (newCertification.name && newCertification.issuer && newCertification.issue_date) {
        updatedCertifications = [...certifications, newCertification as Certification];
        setCertifications(updatedCertifications);
        setNewCertification({});
      } else if (newCertification.name || newCertification.issuer) {
        toast.error('Sertifikasi: Lengkapi semua field yang wajib (Nama, Penerbit, Tanggal Terbit)');
        setSaving(false);
        return;
      }
      
      // Auto-add language if form is filled
      if (newLanguage.name && newLanguage.proficiency) {
        if (!languages.some(l => l.name === newLanguage.name)) {
          updatedLanguages = [...languages, newLanguage as Language];
          setLanguages(updatedLanguages);
          setNewLanguage({});
        }
      } else if (newLanguage.name || newLanguage.proficiency) {
        toast.error('Bahasa: Pilih bahasa dan tingkat kemahiran');
        setSaving(false);
        return;
      }
      
      // Clean up personal info - remove empty strings
      const cleanPersonalInfo = {
        full_name: personalInfo.full_name,
        email: personalInfo.email,
        ...(personalInfo.phone && { phone: personalInfo.phone }),
        ...(personalInfo.address && { address: personalInfo.address }),
        ...(personalInfo.city && { city: personalInfo.city }),
        ...(personalInfo.province && { province: personalInfo.province }),
        ...(personalInfo.summary && { summary: personalInfo.summary }),
        ...(personalInfo.linkedin && { linkedin: personalInfo.linkedin }),
        ...(personalInfo.portfolio && { portfolio: personalInfo.portfolio }),
        ...(personalInfo.photo_url && { photo_url: personalInfo.photo_url }),
      };
      
      const cvData: CVRequest = {
        personal_info: cleanPersonalInfo,
        education: updatedEducation || [],
        experience: updatedExperience || [],
        skills: skills || [],
        certifications: updatedCertifications || [],
        languages: updatedLanguages || [],
      };
      
      // Save CV
      await saveCV(cvData);
      
      // Also sync to Profile (update shared fields)
      try {
        await updateProfile({
          address: personalInfo.address,
          city: personalInfo.city,
          province: personalInfo.province,
          linkedin_url: personalInfo.linkedin,
          portfolio_url: personalInfo.portfolio,
          professional_summary: personalInfo.summary,
        });
      } catch (profileError) {
        // Profile update is secondary, don't fail the whole save
        console.warn('Profile sync failed:', profileError);
      }
      
      setHasCV(true);
      toast.success('CV berhasil disimpan dan profil disinkronkan!');
    } catch (error: any) {
      console.error('Failed to save CV:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Gagal menyimpan CV';
      const errorDetails = error.response?.data?.errors || error.response?.data?.details;
      
      if (errorDetails) {
        console.error('Validation errors:', errorDetails);
      }
      
      toast.error(`${errorMsg}${errorDetails ? ' - Periksa console untuk detail' : ''}`);
    } finally {
      setSaving(false);
    }
  };

  const goNext = async () => {
    if (currentStepIndex < steps.length - 1) {
      // Don't proceed if still loading
      if (loading) {
        toast.error('Mohon tunggu, data sedang dimuat...');
        return;
      }
      
      // Auto-save before moving to next step
      try {
        setAutoSaving(true);
        
        // Validate required fields
        if (!personalInfo.full_name || !personalInfo.email) {
          toast.error('Nama lengkap dan email harus diisi. Silakan kembali ke step Data Diri.');
          setAutoSaving(false);
          return;
        }
        
        // Auto-add pending form data before saving
        let updatedEducation = [...education];
        let updatedExperience = [...experience];
        let updatedCertifications = [...certifications];
        let updatedLanguages = [...languages];
        
        // Auto-add education if form is filled
        if (newEducation.institution && newEducation.degree && newEducation.field_of_study && newEducation.start_date) {
          updatedEducation = [...education, newEducation as Education];
          setEducation(updatedEducation);
          setNewEducation({});
          toast.success('Pendidikan ditambahkan otomatis');
        } else if (newEducation.institution || newEducation.degree || newEducation.field_of_study) {
          // Form partially filled - warn user
          toast.error('Pendidikan: Lengkapi semua field yang wajib (Institusi, Gelar, Jurusan, Tahun Mulai)');
          setAutoSaving(false);
          return;
        }
        
        // Auto-add experience if form is filled
        if (newExperience.company && newExperience.position && newExperience.start_date) {
          updatedExperience = [...experience, newExperience as Experience];
          setExperience(updatedExperience);
          setNewExperience({});
          toast.success('Pengalaman ditambahkan otomatis');
        } else if (newExperience.company || newExperience.position) {
          // Form partially filled - warn user
          toast.error('Pengalaman: Lengkapi semua field yang wajib (Perusahaan, Posisi, Tahun Mulai)');
          setAutoSaving(false);
          return;
        }
        
        // Auto-add certification if form is filled
        if (newCertification.name && newCertification.issuer && newCertification.issue_date) {
          updatedCertifications = [...certifications, newCertification as Certification];
          setCertifications(updatedCertifications);
          setNewCertification({});
          toast.success('Sertifikasi ditambahkan otomatis');
        } else if (newCertification.name || newCertification.issuer) {
          // Form partially filled - warn user
          toast.error('Sertifikasi: Lengkapi semua field yang wajib (Nama, Penerbit, Tanggal Terbit)');
          setAutoSaving(false);
          return;
        }
        
        // Auto-add language if form is filled
        if (newLanguage.name && newLanguage.proficiency) {
          if (!languages.some(l => l.name === newLanguage.name)) {
            updatedLanguages = [...languages, newLanguage as Language];
            setLanguages(updatedLanguages);
            setNewLanguage({});
            toast.success('Bahasa ditambahkan otomatis');
          }
        } else if (newLanguage.name || newLanguage.proficiency) {
          // Form partially filled - warn user
          toast.error('Bahasa: Pilih bahasa dan tingkat kemahiran');
          setAutoSaving(false);
          return;
        }
        
        // Clean up personal info - remove empty strings
        const cleanPersonalInfo = {
          full_name: personalInfo.full_name,
          email: personalInfo.email,
          ...(personalInfo.phone && { phone: personalInfo.phone }),
          ...(personalInfo.address && { address: personalInfo.address }),
          ...(personalInfo.city && { city: personalInfo.city }),
          ...(personalInfo.province && { province: personalInfo.province }),
          ...(personalInfo.summary && { summary: personalInfo.summary }),
          ...(personalInfo.linkedin && { linkedin: personalInfo.linkedin }),
          ...(personalInfo.portfolio && { portfolio: personalInfo.portfolio }),
          ...(personalInfo.photo_url && { photo_url: personalInfo.photo_url }),
        };
        
        const cvData: CVRequest = {
          personal_info: cleanPersonalInfo,
          education: updatedEducation || [],
          experience: updatedExperience || [],
          skills: skills || [],
          certifications: updatedCertifications || [],
          languages: updatedLanguages || [],
        };
        
        console.log('=== CV Data Debug ===');
        console.log('Personal Info:', cleanPersonalInfo);
        console.log('Education:', updatedEducation);
        console.log('Experience:', updatedExperience);
        console.log('Skills:', skills);
        console.log('Full CV Data:', JSON.stringify(cvData, null, 2));
        console.log('===================');
        
        await saveCV(cvData);
        toast.success('Data tersimpan otomatis');
        setCurrentStep(steps[currentStepIndex + 1].id);
      } catch (error: any) {
        console.error('Auto-save failed:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Gagal menyimpan data';
        const errorDetails = error.response?.data?.errors || error.response?.data?.details;
        
        if (errorDetails) {
          console.error('Validation errors:', errorDetails);
        }
        
        toast.error(`${errorMsg}${errorDetails ? ' - Periksa console untuk detail' : ''}`);
      } finally {
        setAutoSaving(false);
      }
    }
  };

  const goPrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran foto maksimal 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);
      const response = await uploadAvatar(file);
      
      // Update photo URL
      const newPhotoUrl = response.avatar_url.startsWith('http') 
        ? response.avatar_url 
        : `${STATIC_BASE_URL}${response.avatar_url}`;
      setPhotoUrl(newPhotoUrl);
      
      // Also update personal info
      setPersonalInfo(prev => ({
        ...prev,
        photo_url: response.avatar_url,
      }));
      
      toast.success('Foto berhasil diupload');
    } catch (error) {
      console.error('Failed to upload photo:', error);
      toast.error('Gagal mengupload foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Check step completion
  const isStepComplete = (stepId: Step): boolean => {
    switch (stepId) {
      case 'personal':
        return !!(personalInfo.full_name && personalInfo.email && personalInfo.phone);
      case 'education':
        return education.length > 0;
      case 'experience':
        return experience.length > 0;
      case 'skills':
        return skills.length >= 3;
      case 'certifications':
        return true; // Optional
      case 'languages':
        return languages.length > 0;
      default:
        return false;
    }
  };

  // Calculate completeness
  // Uses standardized calculation from lib/cv-helper
  const calculateCompleteness = (): number => {
    // Construct a temporary CVData object to use the helper function
    const tempCV: any = {
      personal_info: personalInfo,
      education: education,
      experience: experience,
      skills: skills,
      certifications: certifications,
      languages: languages
    };
    
    return calculateCVCompleteness(tempCV);
  };

  // Add handlers
  const addEducation = () => {
    if (!newEducation.institution || !newEducation.degree || !newEducation.field_of_study || !newEducation.start_date) {
      toast.error('Lengkapi semua field yang wajib diisi');
      return;
    }
    setEducation([...education, newEducation as Education]);
    setNewEducation({});
    toast.success('Pendidikan ditambahkan');
  };

  const addExperience = () => {
    if (!newExperience.company || !newExperience.position || !newExperience.start_date) {
      toast.error('Lengkapi semua field yang wajib diisi');
      return;
    }
    setExperience([...experience, newExperience as Experience]);
    setNewExperience({});
    toast.success('Pengalaman ditambahkan');
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === newSkill.toLowerCase())) {
      toast.error('Skill sudah ada');
      return;
    }
    setSkills([...skills, { name: newSkill.trim(), level: 'intermediate' }]);
    setNewSkill('');
  };

  const addCertification = () => {
    if (!newCertification.name || !newCertification.issuer || !newCertification.issue_date) {
      toast.error('Lengkapi semua field yang wajib diisi');
      return;
    }
    setCertifications([...certifications, newCertification as Certification]);
    setNewCertification({});
    toast.success('Sertifikasi ditambahkan');
  };

  const addLanguage = () => {
    if (!newLanguage.name || !newLanguage.proficiency) {
      toast.error('Pilih bahasa dan tingkat kemahiran');
      return;
    }
    if (languages.some(l => l.name === newLanguage.name)) {
      toast.error('Bahasa sudah ada');
      return;
    }
    setLanguages([...languages, newLanguage as Language]);
    setNewLanguage({});
    toast.success('Bahasa ditambahkan');
  };

  // ============================================
  // RENDER STEP CONTENT
  // ============================================

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Photo Upload Section */}
      <div className="flex flex-col items-center gap-4 pb-6 border-b">
        <div className="relative">
          <input
            type="file"
            ref={photoInputRef}
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <div 
            className="w-32 h-32 rounded-full bg-muted border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors"
            onClick={() => photoInputRef.current?.click()}
          >
            {uploadingPhoto ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-muted-foreground">Uploading...</span>
              </div>
            ) : photoUrl ? (
              <img 
                src={photoUrl} 
                alt="Foto Profil" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Camera className="w-8 h-8" />
                <span className="text-xs">Upload Foto</span>
              </div>
            )}
          </div>
          {photoUrl && !uploadingPhoto && (
            <button
              onClick={() => photoInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Klik untuk upload foto profil (maks. 5MB)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <Input
            value={personalInfo.full_name}
            onChange={(e) => setPersonalInfo({ ...personalInfo, full_name: e.target.value })}
            placeholder="Masukkan nama lengkap"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            No. Telepon <span className="text-red-500">*</span>
          </label>
          <Input
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Kota</label>
          <Input
            value={personalInfo.city || ''}
            onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
            placeholder="Jakarta"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Provinsi</label>
          <Input
            value={personalInfo.province || ''}
            onChange={(e) => setPersonalInfo({ ...personalInfo, province: e.target.value })}
            placeholder="DKI Jakarta"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">LinkedIn</label>
          <Input
            value={personalInfo.linkedin || ''}
            onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
            placeholder="linkedin.com/in/username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Portfolio</label>
          <Input
            value={personalInfo.portfolio || ''}
            onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
            placeholder="https://portfolio.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Alamat</label>
          <Input
            value={personalInfo.address || ''}
            onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
            placeholder="Alamat lengkap"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Ringkasan Profil
          <span className="text-muted-foreground text-xs ml-2">(Deskripsi singkat tentang diri Anda)</span>
        </label>
        <Textarea
          value={personalInfo.summary || ''}
          onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
          placeholder="Tulis ringkasan profil profesional Anda dalam 2-3 kalimat..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {/* Existing Education */}
      {education.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Pendidikan Tersimpan</h4>
          {education.map((edu, index) => (
            <div key={index} className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">{edu.degree} - {edu.field_of_study}</p>
                <p className="text-xs text-muted-foreground">{edu.start_date} - {edu.end_date || 'Sekarang'}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-600"
                onClick={() => setEducation(education.filter((_, i) => i !== index))}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Education */}
      <div className="border border-dashed border-primary/30 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-foreground flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Pendidikan
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Institusi <span className="text-red-500">*</span>
            </label>
            <Input
              value={newEducation.institution || ''}
              onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              placeholder="Universitas Indonesia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Gelar <span className="text-red-500">*</span>
            </label>
            <Select
              value={newEducation.degree || ''}
              onValueChange={(value) => setNewEducation({ ...newEducation, degree: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih gelar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                <SelectItem value="D1">D1</SelectItem>
                <SelectItem value="D2">D2</SelectItem>
                <SelectItem value="D3">D3</SelectItem>
                <SelectItem value="D4">D4</SelectItem>
                <SelectItem value="S1">S1 (Sarjana)</SelectItem>
                <SelectItem value="S2">S2 (Magister)</SelectItem>
                <SelectItem value="S3">S3 (Doktor)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Jurusan <span className="text-red-500">*</span>
            </label>
            <Input
              value={newEducation.field_of_study || ''}
              onChange={(e) => setNewEducation({ ...newEducation, field_of_study: e.target.value })}
              placeholder="Teknik Informatika"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">IPK</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={newEducation.gpa || ''}
              onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
              placeholder="3.50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Tahun Mulai <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={newEducation.start_date || ''}
              onChange={(e) => setNewEducation({ ...newEducation, start_date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Tahun Selesai</label>
            <Input
              type="date"
              value={newEducation.end_date || ''}
              onChange={(e) => setNewEducation({ ...newEducation, end_date: e.target.value })}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Button onClick={addEducation} className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Pendidikan
          </Button>
          {newEducation.institution && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Form akan otomatis ditambahkan saat klik "Selanjutnya"
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      {/* Existing Experience */}
      {experience.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Pengalaman Tersimpan</h4>
          {experience.map((exp, index) => (
            <div key={index} className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{exp.position}</p>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
                <p className="text-xs text-muted-foreground">
                  {exp.start_date} - {exp.is_current ? 'Sekarang' : exp.end_date}
                </p>
                {exp.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{exp.description}</p>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-600"
                onClick={() => setExperience(experience.filter((_, i) => i !== index))}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Experience */}
      <div className="border border-dashed border-primary/30 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-foreground flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Pengalaman Kerja
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Perusahaan <span className="text-red-500">*</span>
            </label>
            <Input
              value={newExperience.company || ''}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              placeholder="PT Example Indonesia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Posisi <span className="text-red-500">*</span>
            </label>
            <Input
              value={newExperience.position || ''}
              onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
              placeholder="Software Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Lokasi</label>
            <Input
              value={newExperience.location || ''}
              onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
              placeholder="Jakarta"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isCurrent"
              checked={newExperience.is_current || false}
              onChange={(e) => setNewExperience({ ...newExperience, is_current: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="isCurrent" className="text-sm text-foreground">
              Masih bekerja di sini
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Tanggal Mulai <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={newExperience.start_date || ''}
              onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Tanggal Selesai</label>
            <Input
              type="date"
              value={newExperience.end_date || ''}
              onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
              disabled={newExperience.is_current}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Deskripsi Pekerjaan</label>
            <Textarea
              value={newExperience.description || ''}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."
              rows={3}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Button onClick={addExperience} className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Pengalaman
          </Button>
          {newExperience.company && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Form akan otomatis ditambahkan saat klik "Selanjutnya"
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Tips untuk Skill</p>
            <p className="text-sm text-muted-foreground">
              Tambahkan minimal 3 skill untuk meningkatkan akurasi rekomendasi pekerjaan. 
              Fokus pada skill yang relevan dengan bidang karir yang Anda inginkan.
            </p>
          </div>
        </div>
      </div>

      {/* Existing Skills */}
      {skills.length > 0 && (
        <div>
          <h4 className="font-medium text-foreground mb-3">Skill Anda ({skills.length})</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="gap-2 py-1.5 px-3">
                {skill.name}
                <button
                  onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add New Skill */}
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Tambah skill baru (cth: JavaScript, Project Management)"
          onKeyDown={(e) => e.key === 'Enter' && addSkill()}
        />
        <Button onClick={addSkill} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah
        </Button>
      </div>

      {/* Suggested Skills */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Skill Populer</h4>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'Figma', 'Excel', 'Communication', 'Leadership', 'Problem Solving', 'Teamwork']
            .filter(s => !skills.some(skill => skill.name.toLowerCase() === s.toLowerCase()))
            .slice(0, 8)
            .map((skill) => (
              <Button
                key={skill}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSkills([...skills, { name: skill, level: 'intermediate' }]);
                  toast.success(`${skill} ditambahkan`);
                }}
                className="gap-1"
              >
                <Plus className="w-3 h-3" /> {skill}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-6">
      {/* Existing Certifications */}
      {certifications.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Sertifikasi Tersimpan</h4>
          {certifications.map((cert, index) => (
            <div key={index} className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{cert.name}</p>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                <p className="text-xs text-muted-foreground">{cert.issue_date}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-600"
                onClick={() => setCertifications(certifications.filter((_, i) => i !== index))}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Certification */}
      <div className="border border-dashed border-primary/30 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-foreground flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Sertifikasi
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Nama Sertifikat <span className="text-red-500">*</span>
            </label>
            <Input
              value={newCertification.name || ''}
              onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
              placeholder="AWS Certified Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Penerbit <span className="text-red-500">*</span>
            </label>
            <Input
              value={newCertification.issuer || ''}
              onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
              placeholder="Amazon Web Services"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Tanggal Terbit <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={newCertification.issue_date || ''}
              onChange={(e) => setNewCertification({ ...newCertification, issue_date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Tanggal Kadaluarsa</label>
            <Input
              type="date"
              value={newCertification.expiry_date || ''}
              onChange={(e) => setNewCertification({ ...newCertification, expiry_date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Credential ID</label>
            <Input
              value={newCertification.credential_id || ''}
              onChange={(e) => setNewCertification({ ...newCertification, credential_id: e.target.value })}
              placeholder="ABC123XYZ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Credential URL</label>
            <Input
              value={newCertification.credential_url || ''}
              onChange={(e) => setNewCertification({ ...newCertification, credential_url: e.target.value })}
              placeholder="https://verify.example.com/cert/123"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Button onClick={addCertification} className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Sertifikasi
          </Button>
          {newCertification.name && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Form akan otomatis ditambahkan saat klik "Selanjutnya"
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        <AlertCircle className="w-4 h-4 inline mr-1" />
        Sertifikasi bersifat opsional, tapi dapat meningkatkan peluang Anda.
      </p>
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-6">
      {/* Existing Languages */}
      {languages.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Bahasa yang Dikuasai</h4>
          {languages.map((lang, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">{lang.name}</span>
                <Badge variant="outline">{lang.proficiency}</Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-600"
                onClick={() => setLanguages(languages.filter((_, i) => i !== index))}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Language */}
      <div className="border border-dashed border-primary/30 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-foreground flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Bahasa
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Bahasa <span className="text-red-500">*</span>
            </label>
            <Select
              value={newLanguage.name || ''}
              onValueChange={(value) => setNewLanguage({ ...newLanguage, name: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih bahasa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Indonesia">Indonesia</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Mandarin">Mandarin</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="Korean">Korean</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Tingkat Kemahiran <span className="text-red-500">*</span>
            </label>
            <Select
              value={newLanguage.proficiency || ''}
              onValueChange={(value) => setNewLanguage({ ...newLanguage, proficiency: value as Language['proficiency'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tingkat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
                <SelectItem value="proficient">Proficient</SelectItem>
                <SelectItem value="fluent">Fluent</SelectItem>
                <SelectItem value="native">Native</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Button onClick={addLanguage} className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Bahasa
          </Button>
          {newLanguage.name && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Form akan otomatis ditambahkan saat klik "Simpan CV"
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return renderPersonalInfo();
      case 'education':
        return renderEducation();
      case 'experience':
        return renderExperience();
      case 'skills':
        return renderSkills();
      case 'certifications':
        return renderCertifications();
      case 'languages':
        return renderLanguages();
      default:
        return null;
    }
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat CV...</p>
        </div>
      </div>
    );
  }

  const completeness = calculateCompleteness();

  // Render CV Upload Section
  const renderCVUploadSection = () => (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Upload className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Upload CV Anda</h3>
          <p className="text-sm text-muted-foreground">
            Upload file CV dalam format PDF atau Word (max 5MB)
          </p>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={cvFileInputRef}
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleCVUpload}
        className="hidden"
      />
      
      {uploadedCV ? (
        // Show uploaded CV
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white border border-green-200 rounded-lg flex items-center justify-center">
                <File className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">{uploadedCV.document_name || 'CV Terupload'}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {uploadedCV.file_size && (
                    <span>{formatFileSize(uploadedCV.file_size)}</span>
                  )}
                  <span>•</span>
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Terupload
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = uploadedCV.document_url.startsWith('http')
                    ? uploadedCV.document_url
                    : `${STATIC_BASE_URL}${uploadedCV.document_url}`;
                  window.open(url, '_blank');
                }}
                className="gap-1"
              >
                <Eye className="w-4 h-4" /> Lihat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => cvFileInputRef.current?.click()}
                disabled={uploadingCV}
              >
                {uploadingCV ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Ganti'
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteUploadedCV}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Upload button
        <div 
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => cvFileInputRef.current?.click()}
        >
          {uploadingCV ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Mengupload CV...</p>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                Klik untuk upload atau drag & drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, DOCX (max 5MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );

  // Render CV Mode Selection (when no CV exists)
  const renderCVModeSelection = () => (
    <div className="container mx-auto px-4 py-12 pb-40">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Pilih Metode CV Anda</h2>
          <p className="text-muted-foreground">
            Anda dapat mengupload CV yang sudah ada atau membuat CV baru menggunakan sistem kami
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload CV Option */}
          <div 
            className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => setCvMode('upload')}
          >
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Upload className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Upload CV</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload file CV yang sudah Anda miliki dalam format PDF atau Word
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Proses cepat & mudah</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Gunakan CV yang sudah ada</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Format PDF atau Word</span>
              </li>
            </ul>
            <Button className="w-full mt-6 gap-2" variant="outline">
              <Upload className="w-4 h-4" /> Upload CV
            </Button>
          </div>
          
          {/* CV Builder Option */}
          <div 
            className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => setCvMode('builder')}
          >
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Buat CV dengan Sistem</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Buat CV profesional dengan panduan langkah demi langkah dari sistem kami
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Template profesional</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Panduan step-by-step</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Download sebagai PDF</span>
              </li>
            </ul>
            <Button className="w-full mt-6 gap-2">
              <Sparkles className="w-4 h-4" /> Buat CV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // If no CV mode selected and no existing CV, show mode selection
  if (!cvMode && !hasCV && !uploadedCV) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-primary" />
              <Badge variant="secondary">CV</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Buat CV Anda
            </h1>
            <p className="text-muted-foreground">
              Pilih metode yang paling sesuai untuk membuat CV Anda
            </p>
          </div>
        </div>
        {renderCVModeSelection()}
      </div>
    );
  }

  // If upload mode is selected, show upload section first
  if (cvMode === 'upload' && !hasCV) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-8 md:py-12">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCvMode(null)}
              className="mb-4 -ml-2"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
            </Button>
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-6 h-6 text-primary" />
              <Badge variant="secondary">Upload CV</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Upload CV Anda
            </h1>
            <p className="text-muted-foreground">
              Upload file CV yang sudah Anda miliki
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12 pb-40">
          <div className="max-w-xl mx-auto">
            {renderCVUploadSection()}
            
            {uploadedCV && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  CV Anda sudah siap digunakan untuk melamar pekerjaan!
                </p>
                <div className="flex justify-center gap-3">
                  <Link to="/lowongan">
                    <Button className="gap-2">
                      <ExternalLink className="w-4 h-4" /> Cari Lowongan
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setCvMode('builder')}>
                    <Sparkles className="w-4 h-4 mr-2" /> Buat CV Tambahan
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Ingin membuat CV dengan panduan sistem kami?{' '}
                <button 
                  onClick={() => setCvMode('builder')}
                  className="text-primary hover:underline font-medium"
                >
                  Buat CV dengan Sistem
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-6 h-6 text-primary" />
                <Badge variant="secondary">CV Builder</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {hasCV ? 'Edit CV Anda' : 'Buat CV Anda'}
              </h1>
              <p className="text-muted-foreground">
                Lengkapi CV untuk mendapatkan rekomendasi pekerjaan yang lebih akurat
              </p>
            </div>
            
            {/* Completeness Indicator */}
            <div className="bg-card border border-border rounded-xl p-4 min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Kelengkapan CV</span>
                <span className={`text-lg font-bold ${
                  completeness >= 80 ? 'text-green-500' : 
                  completeness >= 50 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {completeness}%
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completeness}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${
                    completeness >= 80 ? 'bg-green-500' : 
                    completeness >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {completeness >= 80 ? '✨ CV Anda sudah lengkap!' :
                 completeness >= 50 ? '👍 Tambah lebih banyak detail' :
                 '⚠️ Lengkapi data untuk hasil optimal'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 pb-40">
        {/* Show uploaded CV section if exists */}
        {(uploadedCV || cvMode === 'upload') && renderCVUploadSection()}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Step Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-4 sticky top-24">
              <h3 className="font-semibold text-foreground mb-4">Langkah-langkah</h3>
              <div className="space-y-2">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isComplete = isStepComplete(step.id);
                  const Icon = step.icon;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-primary-foreground/20' :
                        isComplete ? 'bg-green-500/20 text-green-500' :
                        'bg-muted'
                      }`}>
                        {isComplete && !isActive ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                          {step.label}
                        </p>
                        <p className={`text-xs ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {step.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Save Button */}
              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? 'Menyimpan...' : 'Simpan CV'}
                </Button>
                
                {/* PDF Download */}
                <CVPDFGenerator 
                  data={{
                    personalInfo: {
                      full_name: personalInfo.full_name,
                      email: personalInfo.email,
                      phone: personalInfo.phone,
                      address: personalInfo.address || '',
                      city: personalInfo.city || '',
                      province: personalInfo.province || '',
                      summary: personalInfo.summary || '',
                      linkedin: personalInfo.linkedin || '',
                      portfolio: personalInfo.portfolio || '',
                      photo_url: photoUrl || '',
                    },
                    education,
                    experience,
                    skills,
                    certifications,
                    languages,
                  }}
                />
                
                <Link to="/rekomendasi">
                  <Button variant="outline" className="w-full gap-2">
                    <Sparkles className="w-4 h-4" />
                    Lihat Rekomendasi
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3 mb-20">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              {/* Step Header */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  {React.createElement(steps[currentStepIndex].icon, { className: 'w-5 h-5 text-primary' })}
                  {steps[currentStepIndex].label}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {steps[currentStepIndex].description}
                </p>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={goPrev}
                  disabled={currentStepIndex === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentStepIndex + 1} / {steps.length}
                  </span>
                </div>

                {currentStepIndex === steps.length - 1 ? (
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Simpan CV
                  </Button>
                ) : (
                  <Button onClick={goNext} disabled={autoSaving} className="gap-2">
                    {autoSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        Selanjutnya <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVPage;
