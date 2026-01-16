import React, { useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Upload, X } from 'lucide-react';
import { CVData } from '@/contexts/CVContext';
import { Button } from '@/components/ui/button';

interface CVMiniPreviewProps {
  data: CVData;
  onPhotoChange?: (photoUrl: string) => void;
}

const CVMiniPreview: React.FC<CVMiniPreviewProps> = ({ data, onPhotoChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug: Log setiap kali data berubah
  useEffect(() => {
    console.log('📋 CVMiniPreview - Data updated:', {
      personalInfo: data.personalInfo,
      educationCount: data.education?.length || 0,
      experienceCount: data.workExperience?.length || 0,
      skillsCount: data.skills?.length || 0,
      certificationsCount: data.certifications?.length || 0,
      fullData: data,
    });
  }, [data]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoUrl = event.target?.result as string;
        onPhotoChange?.(photoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    onPhotoChange?.('');
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
        <div className="flex items-start gap-4">
          {/* Photo Upload Area */}
          <div className="relative">
            {data.personalInfo.photo ? (
              <div className="relative group">
                <img
                  src={data.personalInfo.photo}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white"
                />
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors"
              >
                <Upload className="w-8 h-8 text-white" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Personal Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {data.personalInfo.fullName || 'Nama Anda'}
            </h1>
            {data.personalInfo.summary && (
              <p className="text-white/90 text-sm mt-1 line-clamp-2">
                {data.personalInfo.summary}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      {(data.personalInfo.email ||
        data.personalInfo.phone ||
        data.personalInfo.address ||
        data.personalInfo.linkedIn ||
        data.personalInfo.portfolio) && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-600 space-y-1">
          <div className="flex flex-wrap gap-3">
            {data.personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="truncate">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.address && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{data.personalInfo.address}</span>
              </div>
            )}
          </div>
          {(data.personalInfo.linkedIn || data.personalInfo.portfolio) && (
            <div className="flex flex-wrap gap-3">
              {data.personalInfo.linkedIn && (
                <div className="flex items-center gap-1">
                  <Linkedin className="w-3 h-3" />
                  <span className="truncate">{data.personalInfo.linkedIn}</span>
                </div>
              )}
              {data.personalInfo.portfolio && (
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span className="truncate">{data.personalInfo.portfolio}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Education Section */}
      {data.education.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">
            Pendidikan
          </h3>
          <div className="space-y-2">
            {data.education.slice(0, 2).map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-semibold text-gray-900">{edu.institution}</div>
                <div className="text-gray-600">
                  {edu.degree} {edu.field && `- ${edu.field}`}
                </div>
                <div className="text-gray-500">
                  {edu.startYear} - {edu.endYear}
                </div>
              </div>
            ))}
            {data.education.length > 2 && (
              <div className="text-xs text-gray-500 italic">
                +{data.education.length - 2} pendidikan lainnya
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {data.workExperience.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">
            Pengalaman Kerja
          </h3>
          <div className="space-y-2">
            {data.workExperience.slice(0, 2).map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="font-semibold text-gray-900">{exp.position}</div>
                <div className="text-gray-600">{exp.company}</div>
                <div className="text-gray-500">
                  {exp.startDate} - {exp.isCurrentJob ? 'Sekarang' : exp.endDate}
                </div>
                {exp.description && (
                  <div className="text-gray-600 line-clamp-2 mt-1">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
            {data.workExperience.length > 2 && (
              <div className="text-xs text-gray-500 italic">
                +{data.workExperience.length - 2} pengalaman lainnya
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {data.skills.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">
            Keahlian
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.slice(0, 6).map((skill, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {data.skills.length > 6 && (
              <span className="inline-block px-2 py-1 text-gray-600 text-xs font-medium">
                +{data.skills.length - 6} skill
              </span>
            )}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {data.certifications.length > 0 && (
        <div className="px-6 py-4">
          <h3 className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">
            Sertifikasi
          </h3>
          <div className="space-y-1">
            {data.certifications.slice(0, 3).map((cert) => (
              <div key={cert.id} className="text-xs">
                <div className="font-semibold text-gray-900">{cert.name}</div>
                <div className="text-gray-600">{cert.issuer}</div>
                <div className="text-gray-500">{cert.year}</div>
              </div>
            ))}
            {data.certifications.length > 3 && (
              <div className="text-xs text-gray-500 italic">
                +{data.certifications.length - 3} sertifikasi lainnya
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVMiniPreview;
