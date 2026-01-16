import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Mail, Phone, MapPin, Linkedin, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CVData } from '@/contexts/CVContext';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';

interface CVPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: CVData;
}

// Register fonts for PDF
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf', fontWeight: 700 },
  ],
});

// PDF Styles - Flat Design Color Palette
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#111827', // Primary text
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
    color: '#2563EB', // Primary blue
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  contactItem: {
    fontSize: 9,
    color: '#6B7280', // Secondary text
  },
  summary: {
    fontSize: 10,
    color: '#374151', // Darker secondary
    marginTop: 12,
    lineHeight: 1.5,
    textAlign: 'center',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#2563EB', // Primary blue
    borderBottomWidth: 1,
    borderBottomColor: '#10B981', // Accent green
    paddingBottom: 4,
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 700,
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#6B7280', // Secondary text
  },
  itemDate: {
    fontSize: 9,
    color: '#9CA3AF', // Muted text
  },
  itemDescription: {
    fontSize: 9,
    color: '#374151', // Darker secondary
    lineHeight: 1.4,
    marginTop: 4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skill: {
    backgroundColor: '#DBEAFE', // Light blue background
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 9,
    color: '#1D4ED8', // Dark blue
  },
});

// PDF Document Component
const CVDocument: React.FC<{ data: CVData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Header */}
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.name}>{data.personalInfo.fullName || 'Nama Anda'}</Text>
        <View style={pdfStyles.contactRow}>
          {data.personalInfo.email && (
            <Text style={pdfStyles.contactItem}>{data.personalInfo.email}</Text>
          )}
          {data.personalInfo.phone && (
            <Text style={pdfStyles.contactItem}>• {data.personalInfo.phone}</Text>
          )}
          {data.personalInfo.address && (
            <Text style={pdfStyles.contactItem}>• {data.personalInfo.address}</Text>
          )}
        </View>
        {(data.personalInfo.linkedIn || data.personalInfo.portfolio) && (
          <View style={pdfStyles.contactRow}>
            {data.personalInfo.linkedIn && (
              <Text style={pdfStyles.contactItem}>{data.personalInfo.linkedIn}</Text>
            )}
            {data.personalInfo.portfolio && (
              <Text style={pdfStyles.contactItem}>• {data.personalInfo.portfolio}</Text>
            )}
          </View>
        )}
        {data.personalInfo.summary && (
          <Text style={pdfStyles.summary}>{data.personalInfo.summary}</Text>
        )}
      </View>

      {/* Education */}
      {data.education.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>PENDIDIKAN</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={pdfStyles.itemContainer}>
              <View style={pdfStyles.itemHeader}>
                <Text style={pdfStyles.itemTitle}>{edu.institution}</Text>
                <Text style={pdfStyles.itemDate}>
                  {edu.startYear} - {edu.endYear}
                </Text>
              </View>
              <Text style={pdfStyles.itemSubtitle}>
                {edu.degree} {edu.field && `- ${edu.field}`}
              </Text>
              {edu.description && (
                <Text style={pdfStyles.itemDescription}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>PENGALAMAN KERJA</Text>
          {data.workExperience.map((exp) => (
            <View key={exp.id} style={pdfStyles.itemContainer}>
              <View style={pdfStyles.itemHeader}>
                <Text style={pdfStyles.itemTitle}>{exp.position}</Text>
                <Text style={pdfStyles.itemDate}>
                  {exp.startDate} - {exp.isCurrentJob ? 'Sekarang' : exp.endDate}
                </Text>
              </View>
              <Text style={pdfStyles.itemSubtitle}>{exp.company}</Text>
              {exp.description && (
                <Text style={pdfStyles.itemDescription}>{exp.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>KEAHLIAN</Text>
          <View style={pdfStyles.skillsContainer}>
            {data.skills.map((skill) => (
              <Text key={skill} style={pdfStyles.skill}>
                {skill}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>SERTIFIKASI</Text>
          {data.certifications.map((cert) => (
            <View key={cert.id} style={pdfStyles.itemContainer}>
              <View style={pdfStyles.itemHeader}>
                <Text style={pdfStyles.itemTitle}>{cert.name}</Text>
                <Text style={pdfStyles.itemDate}>{cert.year}</Text>
              </View>
              <Text style={pdfStyles.itemSubtitle}>{cert.issuer}</Text>
              {cert.credentialId && (
                <Text style={pdfStyles.itemDescription}>
                  Credential ID: {cert.credentialId}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

const CVPreview: React.FC<CVPreviewProps> = ({ isOpen, onClose, data }) => {
  useEffect(() => {
    if (isOpen) {
      console.log('📄 CVPreview - Modal opened with CV Data:', {
        personalInfo: data.personalInfo,
        education: data.education,
        workExperience: data.workExperience,
        skills: data.skills,
        certifications: data.certifications,
      });
    }
  }, [isOpen, data]);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Pratinjau CV</h2>
              <div className="flex items-center gap-3">
                <PDFDownloadLink
                  document={<CVDocument data={data} />}
                  fileName={`CV_${data.personalInfo.fullName || 'CV'}.pdf`}
                >
                  {({ loading }) => (
                    <Button disabled={loading}>
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <Download className="w-5 h-5 mr-2" />
                      )}
                      Unduh PDF
                    </Button>
                  )}
                </PDFDownloadLink>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CV Preview */}
            <div className="flex-1 overflow-auto p-6 bg-muted">
              <div className="max-w-2xl mx-auto bg-background shadow-lg rounded-lg overflow-hidden">
                {/* CV Content */}
                <div className="p-8 md:p-12">
                  {/* Header */}
                  <div className="text-center mb-8 pb-6 border-b border-border">
                    <h1 className="text-3xl font-bold text-primary mb-3">
                      {data.personalInfo.fullName || 'Nama Anda'}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                      {data.personalInfo.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {data.personalInfo.email}
                        </span>
                      )}
                      {data.personalInfo.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {data.personalInfo.phone}
                        </span>
                      )}
                      {data.personalInfo.address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {data.personalInfo.address}
                        </span>
                      )}
                    </div>
                    {(data.personalInfo.linkedIn || data.personalInfo.portfolio) && (
                      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mt-2">
                        {data.personalInfo.linkedIn && (
                          <span className="flex items-center gap-1">
                            <Linkedin className="w-4 h-4" />
                            {data.personalInfo.linkedIn}
                          </span>
                        )}
                        {data.personalInfo.portfolio && (
                          <span className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            {data.personalInfo.portfolio}
                          </span>
                        )}
                      </div>
                    )}
                    {data.personalInfo.summary && (
                      <p className="mt-4 text-muted-foreground leading-relaxed">
                        {data.personalInfo.summary}
                      </p>
                    )}
                  </div>

                  {/* Education */}
                  {data.education.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-primary border-b border-primary pb-2 mb-4">
                        PENDIDIKAN
                      </h2>
                      <div className="space-y-4">
                        {data.education.map((edu) => (
                          <div key={edu.id}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-foreground">{edu.institution}</p>
                                <p className="text-muted-foreground">
                                  {edu.degree} {edu.field && `- ${edu.field}`}
                                </p>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {edu.startYear} - {edu.endYear}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {data.workExperience.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-primary border-b border-primary pb-2 mb-4">
                        PENGALAMAN KERJA
                      </h2>
                      <div className="space-y-4">
                        {data.workExperience.map((exp) => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-foreground">{exp.position}</p>
                                <p className="text-muted-foreground">{exp.company}</p>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {exp.startDate} - {exp.isCurrentJob ? 'Sekarang' : exp.endDate}
                              </span>
                            </div>
                            {exp.description && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {data.skills.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-primary border-b border-primary pb-2 mb-4">
                        KEAHLIAN
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {data.certifications.length > 0 && (
                    <div>
                      <h2 className="text-lg font-bold text-primary border-b border-primary pb-2 mb-4">
                        SERTIFIKASI
                      </h2>
                      <div className="space-y-3">
                        {data.certifications.map((cert) => (
                          <div key={cert.id} className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-foreground">{cert.name}</p>
                              <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                            </div>
                            <span className="text-sm text-muted-foreground">{cert.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CVPreview;
