import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Calendar,
  Briefcase,
  Globe,
  Github,
  Linkedin,
  Link as LinkIcon,
  Save,
  Loader2,
  CheckCircle,
  Upload,
  FileText,
  Trash2,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  useProfile,
  useUpdateProfile,
  useDocuments,
  useUploadDocument,
  useDeleteDocument,
  useSetPrimaryDocument,
} from '@/hooks/useProfile';
import {
  ApplicantProfile,
  ApplicantDocument,
  UpdateProfileRequest,
  getDocumentTypeLabel,
  getGenderLabel,
  getMaritalStatusLabel,
  formatFileSize,
  formatSalary,
} from '@/api/profile';
import { getCV, saveCV, CVRequest } from '@/api/cv';
import { STATIC_BASE_URL } from '@/api/config';

// Provinces in Indonesia
const PROVINCES = [
  'Aceh', 'Bali', 'Banten', 'Bengkulu', 'DI Yogyakarta', 'DKI Jakarta',
  'Gorontalo', 'Jambi', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
  'Kalimantan Barat', 'Kalimantan Selatan', 'Kalimantan Tengah',
  'Kalimantan Timur', 'Kalimantan Utara', 'Kepulauan Bangka Belitung',
  'Kepulauan Riau', 'Lampung', 'Maluku', 'Maluku Utara',
  'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Papua', 'Papua Barat',
  'Riau', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tengah',
  'Sulawesi Tenggara', 'Sulawesi Utara', 'Sumatera Barat',
  'Sumatera Selatan', 'Sumatera Utara',
];

// Salary formatter helper functions
const formatSalaryInput = (value: string): string => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  if (!cleaned) return '';
  
  // Add thousand separators
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const formatSalaryDisplay = (value: number | undefined): string => {
  if (!value) return '';
  return `Rp. ${value.toLocaleString('id-ID')}`;
};

const parseSalaryInput = (value: string): number | undefined => {
  const cleaned = value.replace(/\D/g, '');
  return cleaned ? parseInt(cleaned, 10) : undefined;
};

const JOB_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Kontrak' },
  { value: 'internship', label: 'Magang' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'remote', label: 'Remote' },
];

interface ExtendedProfileFormProps {
  onSaved?: () => void;
}

export const ExtendedProfileForm: React.FC<ExtendedProfileFormProps> = ({ onSaved }) => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: documents, isLoading: documentsLoading } = useDocuments();
  const updateProfileMutation = useUpdateProfile();
  const uploadDocumentMutation = useUploadDocument();
  const deleteDocumentMutation = useDeleteDocument();
  const setPrimaryDocumentMutation = useSetPrimaryDocument();

  const [formData, setFormData] = useState<UpdateProfileRequest>({});
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [salaryMinDisplay, setSalaryMinDisplay] = useState<string>('');
  const [salaryMaxDisplay, setSalaryMaxDisplay] = useState<string>('');

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        nationality: profile.nationality || 'Indonesia',
        marital_status: profile.marital_status,
        nik: profile.nik,
        address: profile.address,
        city: profile.city,
        province: profile.province,
        postal_code: profile.postal_code,
        country: profile.country || 'Indonesia',
        linkedin_url: profile.linkedin_url,
        github_url: profile.github_url,
        portfolio_url: profile.portfolio_url,
        personal_website: profile.personal_website,
        professional_summary: profile.professional_summary,
        headline: profile.headline,
        expected_salary_min: profile.expected_salary_min,
        expected_salary_max: profile.expected_salary_max,
        available_from: profile.available_from,
        willing_to_relocate: profile.willing_to_relocate,
      });
      setSelectedJobTypes(profile.preferred_job_types || []);
      // Initialize salary display values
      if (profile.expected_salary_min) {
        setSalaryMinDisplay(formatSalaryInput(String(profile.expected_salary_min)));
      }
      if (profile.expected_salary_max) {
        setSalaryMaxDisplay(formatSalaryInput(String(profile.expected_salary_max)));
      }
    }
  }, [profile]);

  const handleInputChange = (field: keyof UpdateProfileRequest, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleJobTypeToggle = (jobType: string) => {
    setSelectedJobTypes(prev => {
      const newTypes = prev.includes(jobType)
        ? prev.filter(t => t !== jobType)
        : [...prev, jobType];
      setIsDirty(true);
      return newTypes;
    });
  };

  const handleSalaryMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSalaryInput(e.target.value);
    setSalaryMinDisplay(formatted);
    const parsed = parseSalaryInput(formatted);
    handleInputChange('expected_salary_min', parsed);
  };

  const handleSalaryMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSalaryInput(e.target.value);
    setSalaryMaxDisplay(formatted);
    const parsed = parseSalaryInput(formatted);
    handleInputChange('expected_salary_max', parsed);
  };

  const handleSubmit = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        ...formData,
        preferred_job_types: selectedJobTypes,
      });
      
      // Also sync shared fields to CV
      try {
        const existingCV = await getCV();
        if (existingCV) {
          // Update CV with profile data
          const updatedCV: CVRequest = {
            personal_info: {
              ...existingCV.personal_info,
              address: formData.address || existingCV.personal_info.address,
              city: formData.city || existingCV.personal_info.city,
              province: formData.province || existingCV.personal_info.province,
              summary: formData.professional_summary || existingCV.personal_info.summary,
              linkedin: formData.linkedin_url || existingCV.personal_info.linkedin,
              portfolio: formData.portfolio_url || existingCV.personal_info.portfolio,
            },
            education: existingCV.education,
            experience: existingCV.experience,
            skills: existingCV.skills,
            certifications: existingCV.certifications,
            languages: existingCV.languages,
          };
          await saveCV(updatedCV);
        }
      } catch (cvError) {
        // CV sync is secondary, don't fail the whole save
        console.warn('CV sync failed:', cvError);
      }
      
      setIsDirty(false);
      onSaved?.();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File terlalu besar. Maksimal 10MB');
      return;
    }

    try {
      await uploadDocumentMutation.mutateAsync({
        file,
        documentType,
        options: { isPrimary: true },
      });
    } catch (error) {
      console.error('Failed to upload document:', error);
    }

    // Reset input
    e.target.value = '';
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;
    await deleteDocumentMutation.mutateAsync(docId);
  };

  const handleSetPrimary = async (docId: number) => {
    await setPrimaryDocumentMutation.mutateAsync(docId);
  };

  if (profileLoading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const completeness = profile?.profile_completeness || 0;

  return (
    <div className="space-y-6">
      {/* Profile Completeness */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Kelengkapan Profil</CardTitle>
              <CardDescription>
                Lengkapi profil Anda untuk meningkatkan kesempatan dilirik perusahaan
              </CardDescription>
            </div>
            <div className="text-2xl font-bold text-primary">{completeness}%</div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completeness} className="h-2" />
          {completeness < 100 && (
            <p className="text-sm text-muted-foreground mt-2">
              {completeness < 50 
                ? 'Tambahkan informasi dasar seperti alamat dan ringkasan profesional'
                : completeness < 80
                ? 'Hampir selesai! Tambahkan link profesional dan preferensi pekerjaan'
                : 'Bagus! Lengkapi beberapa detail lagi untuk profil sempurna'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informasi Pribadi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select
                value={formData.gender || ''}
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                  <SelectItem value="prefer_not_to_say">Tidak ingin menyebutkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Kewarganegaraan</Label>
              <Input
                id="nationality"
                value={formData.nationality || ''}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                placeholder="Indonesia"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marital_status">Status Pernikahan</Label>
              <Select
                value={formData.marital_status || ''}
                onValueChange={(value) => handleInputChange('marital_status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Belum Menikah</SelectItem>
                  <SelectItem value="married">Menikah</SelectItem>
                  <SelectItem value="divorced">Cerai</SelectItem>
                  <SelectItem value="widowed">Duda/Janda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headline">Headline Profesional</Label>
            <Input
              id="headline"
              value={formData.headline || ''}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              placeholder="Contoh: Senior Software Engineer | Full Stack Developer"
            />
            <p className="text-xs text-muted-foreground">
              Judul singkat yang menggambarkan posisi atau keahlian Anda
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="professional_summary">Ringkasan Profesional</Label>
            <Textarea
              id="professional_summary"
              value={formData.professional_summary || ''}
              onChange={(e) => handleInputChange('professional_summary', e.target.value)}
              placeholder="Ceritakan tentang diri Anda, pengalaman, dan apa yang Anda cari..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Alamat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Textarea
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Jl. Contoh No. 123, RT 01/RW 02, Kelurahan..."
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Kota</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Jakarta Selatan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provinsi</Label>
              <Select
                value={formData.province || ''}
                onValueChange={(value) => handleInputChange('province', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih provinsi" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">Kode Pos</Label>
              <Input
                id="postal_code"
                value={formData.postal_code || ''}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Link Profesional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </Label>
              <Input
                id="linkedin_url"
                type="url"
                value={formData.linkedin_url || ''}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_url" className="flex items-center gap-2">
                <Github className="w-4 h-4" /> GitHub
              </Label>
              <Input
                id="github_url"
                type="url"
                value={formData.github_url || ''}
                onChange={(e) => handleInputChange('github_url', e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio_url" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Portfolio
              </Label>
              <Input
                id="portfolio_url"
                type="url"
                value={formData.portfolio_url || ''}
                onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                placeholder="https://portfolio.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personal_website" className="flex items-center gap-2">
                <Globe className="w-4 h-4" /> Website Pribadi
              </Label>
              <Input
                id="personal_website"
                type="url"
                value={formData.personal_website || ''}
                onChange={(e) => handleInputChange('personal_website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Preferensi Pekerjaan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tipe Pekerjaan yang Dicari</Label>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((type) => (
                <Badge
                  key={type.value}
                  variant={selectedJobTypes.includes(type.value) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleJobTypeToggle(type.value)}
                >
                  {selectedJobTypes.includes(type.value) && (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expected_salary_min">Ekspektasi Gaji (Min)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">Rp.</span>
                <Input
                  id="expected_salary_min"
                  type="text"
                  value={salaryMinDisplay}
                  onChange={handleSalaryMinChange}
                  placeholder="5.000.000"
                  className="pl-10"
                />
              </div>
              {formData.expected_salary_min && (
                <p className="text-xs text-muted-foreground">{formatSalaryDisplay(formData.expected_salary_min)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_salary_max">Ekspektasi Gaji (Max)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">Rp.</span>
                <Input
                  id="expected_salary_max"
                  type="text"
                  value={salaryMaxDisplay}
                  onChange={handleSalaryMaxChange}
                  placeholder="10.000.000"
                  className="pl-10"
                />
              </div>
              {formData.expected_salary_max && (
                <p className="text-xs text-muted-foreground">{formatSalaryDisplay(formData.expected_salary_max)}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="available_from">Tersedia Mulai</Label>
              <Input
                id="available_from"
                type="date"
                value={formData.available_from || ''}
                onChange={(e) => handleInputChange('available_from', e.target.value)}
                min="2000-01-01"
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="willing_to_relocate"
                checked={formData.willing_to_relocate || false}
                onCheckedChange={(checked) => handleInputChange('willing_to_relocate', checked as boolean)}
              />
              <Label htmlFor="willing_to_relocate" className="cursor-pointer">
                Bersedia pindah lokasi (relokasi)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Dokumen
          </CardTitle>
          <CardDescription>
            Upload CV dan dokumen pendukung lainnya
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Button */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="document-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e, 'cv_uploaded')}
            />
            <label htmlFor="document-upload" className="cursor-pointer">
              <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">Klik untuk upload CV</p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOC, DOCX, JPG, PNG (Max 10MB)
              </p>
            </label>
            {uploadDocumentMutation.isPending && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            )}
          </div>

          {/* Document List */}
          {documentsLoading ? (
            <div className="py-4 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{doc.document_name}</p>
                        {doc.is_primary && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Utama
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {getDocumentTypeLabel(doc.document_type)}
                        {doc.file_size && ` • ${formatFileSize(doc.file_size)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!doc.is_primary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetPrimary(doc.id)}
                        disabled={setPrimaryDocumentMutation.isPending}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a
                        href={`${STATIC_BASE_URL}${doc.document_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                      disabled={deleteDocumentMutation.isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Belum ada dokumen yang diupload
            </p>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3 sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
        <Button
          onClick={handleSubmit}
          disabled={!isDirty || updateProfileMutation.isPending}
          className="min-w-[150px]"
        >
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Simpan Profil
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExtendedProfileForm;
