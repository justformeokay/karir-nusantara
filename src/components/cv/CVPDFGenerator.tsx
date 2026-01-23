import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Download,
  Loader2,
  FileText,
  Palette,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  PersonalInfo,
  Education,
  Experience,
  Skill,
  Certification,
  Language,
} from '@/api/cv';

// ============================================
// TYPES
// ============================================

export interface CVDataForPDF {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  photoUrl?: string;
}

type DesignType = 'modern' | 'classic' | 'creative';

interface DesignOption {
  id: DesignType;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
}

const DESIGNS: DesignOption[] = [
  {
    id: 'modern',
    name: 'Modern Minimalis',
    description: 'Clean, professional dengan aksen biru',
    primaryColor: '#2563eb',
    accentColor: '#1e40af',
  },
  {
    id: 'classic',
    name: 'Klasik Elegan',
    description: 'Tampilan formal dengan nuansa gelap',
    primaryColor: '#1f2937',
    accentColor: '#374151',
  },
  {
    id: 'creative',
    name: 'Kreatif Dinamis',
    description: 'Warna-warni untuk industri kreatif',
    primaryColor: '#7c3aed',
    accentColor: '#5b21b6',
  },
];

// ============================================
// CV TEMPLATES
// ============================================

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'Sekarang';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
};

const ModernTemplate: React.FC<{ data: CVDataForPDF }> = ({ data }) => (
  <div className="w-[210mm] min-h-[297mm] bg-white p-8 font-sans" style={{ fontSize: '11pt' }}>
    {/* Header */}
    <div className="flex gap-6 mb-6 pb-6 border-b-4 border-blue-600">
      {data.photoUrl && (
        <img
          src={data.photoUrl}
          alt="Photo"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
        />
      )}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personalInfo.full_name}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
          {data.personalInfo.email && <span>📧 {data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
          {data.personalInfo.city && data.personalInfo.province && (
            <span>📍 {data.personalInfo.city}, {data.personalInfo.province}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-blue-600">
          {data.personalInfo.linkedin && <span>🔗 {data.personalInfo.linkedin}</span>}
          {data.personalInfo.portfolio && <span>🌐 {data.personalInfo.portfolio}</span>}
        </div>
      </div>
    </div>

    {/* Summary */}
    {data.personalInfo.summary && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-blue-600 mb-2 uppercase tracking-wide">Ringkasan Profil</h2>
        <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
      </div>
    )}

    <div className="grid grid-cols-3 gap-6">
      {/* Main Content - 2 columns */}
      <div className="col-span-2 space-y-6">
        {/* Experience */}
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide border-b-2 border-blue-200 pb-1">
              Pengalaman Kerja
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {formatDate(exp.start_date)} - {exp.is_current ? 'Sekarang' : formatDate(exp.end_date)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide border-b-2 border-blue-200 pb-1">
              Pendidikan
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                      <p className="text-gray-600">{edu.degree} - {edu.field_of_study}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                    </span>
                  </div>
                  {edu.gpa && <p className="text-sm text-gray-500">IPK: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - 1 column */}
      <div className="space-y-6">
        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide border-b-2 border-blue-200 pb-1">
              Keahlian
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide border-b-2 border-blue-200 pb-1">
              Bahasa
            </h2>
            <div className="space-y-2">
              {data.languages.map((lang, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-gray-700">{lang.name}</span>
                  <span className="text-gray-500 text-sm capitalize">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide border-b-2 border-blue-200 pb-1">
              Sertifikasi
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, idx) => (
                <div key={idx}>
                  <p className="font-medium text-gray-900 text-sm">{cert.name}</p>
                  <p className="text-gray-500 text-xs">{cert.issuer} • {formatDate(cert.issue_date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ClassicTemplate: React.FC<{ data: CVDataForPDF }> = ({ data }) => (
  <div className="w-[210mm] min-h-[297mm] bg-white p-8 font-serif" style={{ fontSize: '11pt' }}>
    {/* Header */}
    <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
      {data.photoUrl && (
        <img
          src={data.photoUrl}
          alt="Photo"
          className="w-28 h-28 rounded-lg object-cover border-2 border-gray-300 mx-auto mb-4"
        />
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-widest">
        {data.personalInfo.full_name}
      </h1>
      <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>•</span>}
        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        {data.personalInfo.city && <span>•</span>}
        {data.personalInfo.city && data.personalInfo.province && (
          <span>{data.personalInfo.city}, {data.personalInfo.province}</span>
        )}
      </div>
    </div>

    {/* Summary */}
    {data.personalInfo.summary && (
      <div className="mb-6">
        <h2 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-widest border-b border-gray-300 pb-1">
          Profil Profesional
        </h2>
        <p className="text-gray-700 leading-relaxed italic">{data.personalInfo.summary}</p>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div className="mb-6">
        <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
          Pengalaman Profesional
        </h2>
        <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="pl-4 border-l-2 border-gray-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-700">{exp.company} {exp.location && `• ${exp.location}`}</p>
                </div>
                <span className="text-sm text-gray-500 italic">
                  {formatDate(exp.start_date)} - {exp.is_current ? 'Sekarang' : formatDate(exp.end_date)}
                </span>
              </div>
              {exp.description && (
                <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div className="mb-6">
        <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
          Pendidikan
        </h2>
        <div className="space-y-3">
          {data.education.map((edu, idx) => (
            <div key={idx} className="pl-4 border-l-2 border-gray-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                  <p className="text-gray-600">{edu.degree} - {edu.field_of_study}</p>
                </div>
                <span className="text-sm text-gray-500 italic">
                  {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                </span>
              </div>
              {edu.gpa && <p className="text-sm text-gray-500">IPK: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="grid grid-cols-2 gap-6">
      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-widest border-b border-gray-300 pb-1">
            Keahlian
          </h2>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            {data.skills.map((skill, idx) => (
              <li key={idx}>{skill.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        {/* Languages */}
        {data.languages.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-widest border-b border-gray-300 pb-1">
              Bahasa
            </h2>
            <ul className="text-gray-700 text-sm space-y-1">
              {data.languages.map((lang, idx) => (
                <li key={idx}>{lang.name} - <span className="capitalize">{lang.proficiency}</span></li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-widest border-b border-gray-300 pb-1">
              Sertifikasi
            </h2>
            <ul className="text-gray-700 text-sm space-y-1">
              {data.certifications.map((cert, idx) => (
                <li key={idx}>{cert.name} ({cert.issuer})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);

const CreativeTemplate: React.FC<{ data: CVDataForPDF }> = ({ data }) => (
  <div className="w-[210mm] min-h-[297mm] bg-white font-sans" style={{ fontSize: '11pt' }}>
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-purple-700 to-purple-900 text-white p-6">
        {data.photoUrl && (
          <img
            src={data.photoUrl}
            alt="Photo"
            className="w-36 h-36 rounded-full object-cover border-4 border-white mx-auto mb-6 shadow-lg"
          />
        )}
        
        <div className="mb-6">
          <h2 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-purple-400 pb-1">
            Kontak
          </h2>
          <div className="space-y-2 text-sm">
            {data.personalInfo.email && (
              <p className="flex items-center gap-2">📧 {data.personalInfo.email}</p>
            )}
            {data.personalInfo.phone && (
              <p className="flex items-center gap-2">📱 {data.personalInfo.phone}</p>
            )}
            {data.personalInfo.city && data.personalInfo.province && (
              <p className="flex items-center gap-2">📍 {data.personalInfo.city}, {data.personalInfo.province}</p>
            )}
            {data.personalInfo.linkedin && (
              <p className="flex items-center gap-2">🔗 LinkedIn</p>
            )}
            {data.personalInfo.portfolio && (
              <p className="flex items-center gap-2">🌐 Portfolio</p>
            )}
          </div>
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-purple-400 pb-1">
              Keahlian
            </h2>
            <div className="space-y-2">
              {data.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-purple-400 pb-1">
              Bahasa
            </h2>
            <div className="space-y-2">
              {data.languages.map((lang, idx) => (
                <div key={idx}>
                  <p className="text-sm font-medium">{lang.name}</p>
                  <p className="text-xs text-purple-200 capitalize">{lang.proficiency}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div>
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-purple-400 pb-1">
              Sertifikasi
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, idx) => (
                <div key={idx}>
                  <p className="text-sm font-medium">{cert.name}</p>
                  <p className="text-xs text-purple-200">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {data.personalInfo.full_name}
          </h1>
          {data.personalInfo.summary && (
            <p className="text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
          )}
        </div>

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-purple-700 rounded"></span>
              PENGALAMAN KERJA
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-purple-300">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-purple-600 rounded-full"></div>
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-purple-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.start_date)} - {exp.is_current ? 'Sekarang' : formatDate(exp.end_date)}
                  </p>
                  {exp.description && (
                    <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-purple-700 rounded"></span>
              PENDIDIKAN
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-purple-300">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-purple-600 rounded-full"></div>
                  <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                  <p className="text-gray-600">{edu.degree} - {edu.field_of_study}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </p>
                  {edu.gpa && <p className="text-sm text-gray-500">IPK: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

interface CVPDFGeneratorProps {
  data: CVDataForPDF;
  disabled?: boolean;
}

const CVPDFGenerator: React.FC<CVPDFGeneratorProps> = ({ data, disabled }) => {
  const [selectedDesign, setSelectedDesign] = useState<DesignType>('modern');
  const [generating, setGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!cvRef.current) return;

    try {
      setGenerating(true);

      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`CV_${data.personalInfo.full_name?.replace(/\s+/g, '_') || 'Document'}.pdf`);

      setIsOpen(false);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    } finally {
      setGenerating(false);
    }
  };

  const renderTemplate = () => {
    switch (selectedDesign) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'classic':
        return <ClassicTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={disabled}>
          <Download className="w-4 h-4" />
          Download CV PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Download CV sebagai PDF
          </DialogTitle>
          <DialogDescription>
            Pilih desain CV yang Anda inginkan, lalu klik Download
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Design Selection */}
          <div className="w-64 flex-shrink-0 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Pilih Desain
            </h3>
            <div className="space-y-2">
              {DESIGNS.map((design) => (
                <button
                  key={design.id}
                  onClick={() => setSelectedDesign(design.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedDesign === design.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0"
                      style={{ backgroundColor: design.primaryColor }}
                    />
                    <div>
                      <p className="font-medium text-foreground text-sm">{design.name}</p>
                      <p className="text-xs text-muted-foreground">{design.description}</p>
                    </div>
                    {selectedDesign === design.id && (
                      <Check className="w-4 h-4 text-primary ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={generatePDF}
              disabled={generating}
              className="w-full gap-2 mt-4"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Membuat PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-auto bg-gray-100 rounded-lg p-4">
            <div className="transform scale-[0.5] origin-top-left" style={{ width: '200%' }}>
              <div ref={cvRef}>
                {renderTemplate()}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVPDFGenerator;
