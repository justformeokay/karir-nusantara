import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Award,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCV, Education, WorkExperience, Certification, CVData } from '@/contexts/CVContext';
import CVPreview from '@/components/cv/CVPreview';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

type Step = 'personal' | 'education' | 'experience' | 'skills' | 'certifications';

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'personal', label: 'Data Diri', icon: User },
  { id: 'education', label: 'Pendidikan', icon: GraduationCap },
  { id: 'experience', label: 'Pengalaman', icon: Briefcase },
  { id: 'skills', label: 'Keahlian', icon: Lightbulb },
  { id: 'certifications', label: 'Sertifikasi', icon: Award },
];

const CVBuilderPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const {
    cvData,
    updatePersonalInfo,
    addEducation,
    removeEducation,
    addWorkExperience,
    removeWorkExperience,
    updateSkills,
    addCertification,
    removeCertification,
  } = useCV();

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const isStepComplete = (stepId: Step): boolean => {
    switch (stepId) {
      case 'personal':
        return !!(cvData.personalInfo.fullName && cvData.personalInfo.email);
      case 'education':
        return cvData.education.length > 0;
      case 'experience':
        return true; // Optional
      case 'skills':
        return cvData.skills.length > 0;
      case 'certifications':
        return true; // Optional
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 mt-6">
            CV Builder
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Buat CV profesional dalam hitungan menit. Isi data Anda dan download langsung dalam format PDF.
          </p>
        </motion.div>

        {/* Step Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : isStepComplete(step.id)
                      ? 'bg-success/10 text-success border border-success/30'
                      : 'bg-card text-muted-foreground border border-border hover:border-primary/30'
                  }`}
                >
                  {isStepComplete(step.id) && currentStep !== step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-border hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 md:p-8"
            >
              <AnimatePresence mode="wait">
                {currentStep === 'personal' && (
                  <PersonalInfoForm
                    data={cvData.personalInfo}
                    onChange={updatePersonalInfo}
                  />
                )}
                {currentStep === 'education' && (
                  <EducationForm
                    data={cvData.education}
                    onAdd={addEducation}
                    onRemove={removeEducation}
                  />
                )}
                {currentStep === 'experience' && (
                  <ExperienceForm
                    data={cvData.workExperience}
                    onAdd={addWorkExperience}
                    onRemove={removeWorkExperience}
                  />
                )}
                {currentStep === 'skills' && (
                  <SkillsForm
                    data={cvData.skills}
                    onChange={updateSkills}
                  />
                )}
                {currentStep === 'certifications' && (
                  <CertificationsForm
                    data={cvData.certifications}
                    onAdd={addCertification}
                    onRemove={removeCertification}
                  />
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={goPrev}
                  disabled={currentStepIndex === 0}
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Sebelumnya
                </Button>
                {currentStepIndex < steps.length - 1 ? (
                  <Button onClick={goNext}>
                    Selanjutnya
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={() => setIsPreviewOpen(true)}>
                    <Eye className="w-5 h-5 mr-2" />
                    Lihat CV
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Preview Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="sticky top-24 space-y-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Pratinjau CV</h3>
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border border-border">
                  <div className="w-full h-full p-4 text-xs">
                    <CVPreviewMini data={cvData} />
                  </div>
                </div>
              </div>
              <Button onClick={() => setIsPreviewOpen(true)} className="w-full">
                <Eye className="w-5 h-5 mr-2" />
                Lihat Pratinjau
              </Button>
              <Link to="/check-cv" className="block">
                <Button variant="outline" className="w-full gap-2">
                  <Zap className="w-5 h-5" />
                  Check CV Quality
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Mobile Preview Button */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <Button
            onClick={() => setIsPreviewOpen(true)}
            size="lg"
            className="rounded-full shadow-lg"
          >
            <Eye className="w-5 h-5 mr-2" />
            Lihat CV
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <CVPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={cvData}
      />
    </div>
  );
};

// Personal Info Form
const PersonalInfoForm: React.FC<{
  data: CVData['personalInfo'];
  onChange: (data: Partial<CVData['personalInfo']>) => void;
}> = ({ data, onChange }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div>
      <h2 className="text-xl font-bold text-foreground mb-2">Informasi Pribadi</h2>
      <p className="text-muted-foreground text-sm">Masukkan data diri Anda</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Nama Lengkap *</label>
        <Input
          placeholder="John Doe"
          value={data.fullName}
          onChange={e => onChange({ fullName: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Email *</label>
        <Input
          type="email"
          placeholder="john@email.com"
          value={data.email}
          onChange={e => onChange({ email: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Nomor Telepon</label>
        <Input
          placeholder="08123456789"
          value={data.phone}
          onChange={e => onChange({ phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Alamat</label>
        <Input
          placeholder="Jakarta, Indonesia"
          value={data.address}
          onChange={e => onChange({ address: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">LinkedIn (opsional)</label>
        <Input
          placeholder="linkedin.com/in/johndoe"
          value={data.linkedIn}
          onChange={e => onChange({ linkedIn: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Portfolio (opsional)</label>
        <Input
          placeholder="www.johndoe.com"
          value={data.portfolio}
          onChange={e => onChange({ portfolio: e.target.value })}
        />
      </div>
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Ringkasan Profil</label>
      <Textarea
        placeholder="Ceritakan tentang diri Anda dalam beberapa kalimat..."
        value={data.summary}
        onChange={e => onChange({ summary: e.target.value })}
        rows={4}
      />
    </div>
  </motion.div>
);

// Education Form
const EducationForm: React.FC<{
  data: Education[];
  onAdd: (education: Omit<Education, 'id'>) => void;
  onRemove: (id: string) => void;
}> = ({ data, onAdd, onRemove }) => {
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    startYear: '',
    endYear: '',
    description: '',
  });

  const handleAdd = () => {
    if (!newEducation.institution || !newEducation.degree) {
      toast.error('Institusi dan gelar wajib diisi');
      return;
    }
    onAdd(newEducation);
    setNewEducation({
      institution: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      description: '',
    });
    toast.success('Pendidikan berhasil ditambahkan');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">Riwayat Pendidikan</h2>
        <p className="text-muted-foreground text-sm">Tambahkan riwayat pendidikan Anda</p>
      </div>

      {/* Existing Education */}
      {data.length > 0 && (
        <div className="space-y-3">
          {data.map(edu => (
            <div
              key={edu.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div>
                <p className="font-medium text-foreground">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">
                  {edu.degree} - {edu.field} ({edu.startYear} - {edu.endYear})
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onRemove(edu.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Education */}
      <div className="p-4 border border-dashed border-border rounded-lg space-y-4">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Pendidikan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Institusi *</label>
            <Input
              placeholder="Universitas Indonesia"
              value={newEducation.institution}
              onChange={e => setNewEducation({ ...newEducation, institution: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Pendidikan Terakhir *</label>
            <Select value={newEducation.degree} onValueChange={value => setNewEducation({ ...newEducation, degree: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tingkat pendidikan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SMP">SMP</SelectItem>
                <SelectItem value="SMA">SMA</SelectItem>
                <SelectItem value="SMK">SMK</SelectItem>
                <SelectItem value="D1">Diploma 1 (D1)</SelectItem>
                <SelectItem value="D2">Diploma 2 (D2)</SelectItem>
                <SelectItem value="D3">Diploma 3 (D3)</SelectItem>
                <SelectItem value="S1">Sarjana (S1)</SelectItem>
                <SelectItem value="S2">Magister (S2)</SelectItem>
                <SelectItem value="S3">Doktor (S3)</SelectItem>
                <SelectItem value="Profesi">Program Profesi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Bidang Studi</label>
            <Input
              placeholder="Teknik Informatika"
              value={newEducation.field}
              onChange={e => setNewEducation({ ...newEducation, field: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tahun Mulai</label>
              <Input
                placeholder="2018"
                value={newEducation.startYear}
                onChange={e => setNewEducation({ ...newEducation, startYear: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tahun Selesai</label>
              <Input
                placeholder="2022"
                value={newEducation.endYear}
                onChange={e => setNewEducation({ ...newEducation, endYear: e.target.value })}
              />
            </div>
          </div>
        </div>
        <Button onClick={handleAdd} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pendidikan
        </Button>
      </div>
    </motion.div>
  );
};

// Experience Form (similar structure)
const ExperienceForm: React.FC<{
  data: WorkExperience[];
  onAdd: (experience: Omit<WorkExperience, 'id'>) => void;
  onRemove: (id: string) => void;
}> = ({ data, onAdd, onRemove }) => {
  const [newExp, setNewExp] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrentJob: false,
    description: '',
  });

  const handleAdd = () => {
    if (!newExp.company || !newExp.position) {
      toast.error('Perusahaan dan posisi wajib diisi');
      return;
    }
    onAdd(newExp);
    setNewExp({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      description: '',
    });
    toast.success('Pengalaman kerja berhasil ditambahkan');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">Pengalaman Kerja</h2>
        <p className="text-muted-foreground text-sm">Tambahkan pengalaman kerja Anda (opsional)</p>
      </div>

      {data.length > 0 && (
        <div className="space-y-3">
          {data.map(exp => (
            <div
              key={exp.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div>
                <p className="font-medium text-foreground">{exp.position}</p>
                <p className="text-sm text-muted-foreground">
                  {exp.company} ({exp.startDate} - {exp.isCurrentJob ? 'Sekarang' : exp.endDate})
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onRemove(exp.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 border border-dashed border-border rounded-lg space-y-4">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Pengalaman
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Perusahaan *</label>
            <Input
              placeholder="PT. Maju Bersama"
              value={newExp.company}
              onChange={e => setNewExp({ ...newExp, company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Posisi *</label>
            <Input
              placeholder="Software Engineer"
              value={newExp.position}
              onChange={e => setNewExp({ ...newExp, position: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tanggal Mulai</label>
            <Input
              placeholder="Jan 2022"
              value={newExp.startDate}
              onChange={e => setNewExp({ ...newExp, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tanggal Selesai</label>
            <Input
              placeholder="Des 2023"
              value={newExp.endDate}
              onChange={e => setNewExp({ ...newExp, endDate: e.target.value })}
              disabled={newExp.isCurrentJob}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Deskripsi Pekerjaan</label>
          <Textarea
            placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."
            value={newExp.description}
            onChange={e => setNewExp({ ...newExp, description: e.target.value })}
            rows={3}
          />
        </div>
        <Button onClick={handleAdd} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengalaman
        </Button>
      </div>
    </motion.div>
  );
};

// Skills Form
const SkillsForm: React.FC<{
  data: string[];
  onChange: (skills: string[]) => void;
}> = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    if (!newSkill.trim()) return;
    if (data.includes(newSkill.trim())) {
      toast.error('Skill sudah ada');
      return;
    }
    onChange([...data, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemove = (skill: string) => {
    onChange(data.filter(s => s !== skill));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const suggestedSkills = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'SQL',
    'Microsoft Office',
    'Adobe Photoshop',
    'Figma',
    'Communication',
    'Leadership',
    'Project Management',
    'Data Analysis',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">Keahlian</h2>
        <p className="text-muted-foreground text-sm">Tambahkan skill yang Anda kuasai</p>
      </div>

      {/* Current Skills */}
      {data.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.map(skill => (
            <Badge
              key={skill}
              variant="secondary"
              className="py-2 px-4 gap-2 cursor-pointer hover:bg-destructive/10"
              onClick={() => handleRemove(skill)}
            >
              {skill}
              <Trash2 className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Add Skill */}
      <div className="flex gap-2">
        <Input
          placeholder="Ketik skill dan tekan Enter..."
          value={newSkill}
          onChange={e => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={handleAdd}>Tambah</Button>
      </div>

      {/* Suggested Skills */}
      <div>
        <p className="text-sm text-muted-foreground mb-3">Saran skill:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills
            .filter(s => !data.includes(s))
            .slice(0, 8)
            .map(skill => (
              <Badge
                key={skill}
                variant="outline"
                className="py-2 px-3 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onChange([...data, skill])}
              >
                <Plus className="w-3 h-3 mr-1" />
                {skill}
              </Badge>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

// Certifications Form
const CertificationsForm: React.FC<{
  data: Certification[];
  onAdd: (certification: Omit<Certification, 'id'>) => void;
  onRemove: (id: string) => void;
}> = ({ data, onAdd, onRemove }) => {
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    year: '',
    credentialId: '',
  });

  const handleAdd = () => {
    if (!newCert.name || !newCert.issuer) {
      toast.error('Nama dan penerbit sertifikasi wajib diisi');
      return;
    }
    onAdd(newCert);
    setNewCert({ name: '', issuer: '', year: '', credentialId: '' });
    toast.success('Sertifikasi berhasil ditambahkan');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">Sertifikasi</h2>
        <p className="text-muted-foreground text-sm">Tambahkan sertifikasi profesional Anda (opsional)</p>
      </div>

      {data.length > 0 && (
        <div className="space-y-3">
          {data.map(cert => (
            <div
              key={cert.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div>
                <p className="font-medium text-foreground">{cert.name}</p>
                <p className="text-sm text-muted-foreground">
                  {cert.issuer} • {cert.year}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onRemove(cert.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 border border-dashed border-border rounded-lg space-y-4">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Sertifikasi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nama Sertifikasi *</label>
            <Input
              placeholder="Google Data Analytics"
              value={newCert.name}
              onChange={e => setNewCert({ ...newCert, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Penerbit *</label>
            <Input
              placeholder="Google"
              value={newCert.issuer}
              onChange={e => setNewCert({ ...newCert, issuer: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tahun</label>
            <Input
              placeholder="2023"
              value={newCert.year}
              onChange={e => setNewCert({ ...newCert, year: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Credential ID (opsional)</label>
            <Input
              placeholder="ABC123XYZ"
              value={newCert.credentialId}
              onChange={e => setNewCert({ ...newCert, credentialId: e.target.value })}
            />
          </div>
        </div>
        <Button onClick={handleAdd} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Sertifikasi
        </Button>
      </div>
    </motion.div>
  );
};

// Mini Preview Component
const CVPreviewMini: React.FC<{ data: CVData }> = ({ data }) => (
  <div className="space-y-2">
    <div className="text-center mb-3">
      <div className="w-8 h-8 rounded-full bg-primary/20 mx-auto mb-1" />
      <p className="font-semibold text-foreground truncate">
        {data.personalInfo.fullName || 'Nama Anda'}
      </p>
      <p className="text-muted-foreground truncate">
        {data.personalInfo.email || 'email@example.com'}
      </p>
    </div>
    {data.personalInfo.summary && (
      <div className="space-y-1">
        <div className="h-1.5 bg-muted rounded w-full" />
        <div className="h-1.5 bg-muted rounded w-4/5" />
      </div>
    )}
    {data.education.length > 0 && (
      <div className="space-y-1 pt-2">
        <p className="text-[8px] font-semibold text-primary">PENDIDIKAN</p>
        <div className="h-1.5 bg-muted rounded w-3/4" />
      </div>
    )}
    {data.workExperience.length > 0 && (
      <div className="space-y-1 pt-2">
        <p className="text-[8px] font-semibold text-primary">PENGALAMAN</p>
        <div className="h-1.5 bg-muted rounded w-3/4" />
      </div>
    )}
    {data.skills.length > 0 && (
      <div className="pt-2">
        <p className="text-[8px] font-semibold text-primary">KEAHLIAN</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {data.skills.slice(0, 4).map(s => (
            <span key={s} className="text-[6px] bg-muted px-1 rounded">{s}</span>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default CVBuilderPage;
