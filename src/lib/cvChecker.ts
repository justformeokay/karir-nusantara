import { CVData } from '@/contexts/CVContext';

export interface CVFeedback {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  strengths: string[];
  improvements: string[];
  sections: SectionFeedback[];
  overallMessage: string;
}

export interface SectionFeedback {
  section: 'personal' | 'education' | 'experience' | 'skills' | 'certifications';
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'needs-improvement';
  feedback: string[];
  suggestions: string[];
}

/**
 * Analyze CV and provide comprehensive feedback
 */
export const analyzeCVQuality = (cvData: CVData): CVFeedback => {
  const sectionFeedbacks: SectionFeedback[] = [];
  let totalScore = 0;

  // Personal Info Analysis (20%)
  const personalScore = analyzePersonalInfo(cvData);
  sectionFeedbacks.push(personalScore);
  totalScore += personalScore.score * 0.2;

  // Education Analysis (20%)
  const educationScore = analyzeEducation(cvData);
  sectionFeedbacks.push(educationScore);
  totalScore += educationScore.score * 0.2;

  // Experience Analysis (25%)
  const experienceScore = analyzeExperience(cvData);
  sectionFeedbacks.push(experienceScore);
  totalScore += experienceScore.score * 0.25;

  // Skills Analysis (20%)
  const skillsScore = analyzeSkills(cvData);
  sectionFeedbacks.push(skillsScore);
  totalScore += skillsScore.score * 0.2;

  // Certifications Analysis (15%)
  const certificationsScore = analyzeCertifications(cvData);
  sectionFeedbacks.push(certificationsScore);
  totalScore += certificationsScore.score * 0.15;

  const finalScore = Math.round(totalScore);
  const strengths = extractStrengths(sectionFeedbacks);
  const improvements = extractImprovements(sectionFeedbacks);
  const grade = getGrade(finalScore);

  return {
    score: finalScore,
    grade,
    strengths,
    improvements,
    sections: sectionFeedbacks,
    overallMessage: generateOverallMessage(finalScore, grade),
  };
};

/**
 * Analyze Personal Information
 */
function analyzePersonalInfo(cvData: CVData): SectionFeedback {
  const { personalInfo } = cvData;
  const feedback: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Check full name
  if (personalInfo.fullName && personalInfo.fullName.trim().length >= 3) {
    score += 15;
    feedback.push('✓ Nama lengkap sudah diisi dengan baik');
  } else {
    suggestions.push('Tambahkan nama lengkap yang jelas dan profesional');
  }

  // Check email
  if (personalInfo.email && isValidEmail(personalInfo.email)) {
    score += 15;
    feedback.push('✓ Email valid dan profesional');
  } else {
    suggestions.push('Gunakan email profesional (contoh: nama@email.com)');
  }

  // Check phone
  if (personalInfo.phone && personalInfo.phone.length >= 10) {
    score += 15;
    feedback.push('✓ Nomor telepon tersedia');
  } else {
    suggestions.push('Tambahkan nomor telepon yang valid');
  }

  // Check address
  if (personalInfo.address && personalInfo.address.trim().length > 0) {
    score += 10;
    feedback.push('✓ Alamat sudah diisi');
  } else {
    suggestions.push('Tambahkan kota/provinsi tempat tinggal Anda');
  }

  // Check LinkedIn
  if (personalInfo.linkedIn && personalInfo.linkedIn.trim().length > 0) {
    score += 15;
    feedback.push('✓ LinkedIn profile tersedia');
  } else {
    suggestions.push('Tambahkan profil LinkedIn untuk meningkatkan kredibilitas');
  }

  // Check portfolio
  if (personalInfo.portfolio && personalInfo.portfolio.trim().length > 0) {
    score += 15;
    feedback.push('✓ Portfolio/website tersedia');
  } else {
    suggestions.push('Jika memiliki portfolio, tambahkan linknya');
  }

  // Check summary
  if (personalInfo.summary && personalInfo.summary.trim().length > 50) {
    score += 15;
    feedback.push('✓ Professional summary / bio tersedia');
  } else {
    suggestions.push('Tulis summary singkat (50+ karakter) tentang diri Anda dan tujuan karir');
  }

  return {
    section: 'personal',
    score: Math.min(score, 100),
    status: score >= 70 ? 'excellent' : score >= 50 ? 'good' : score >= 30 ? 'fair' : 'needs-improvement',
    feedback,
    suggestions,
  };
}

/**
 * Analyze Education
 */
function analyzeEducation(cvData: CVData): SectionFeedback {
  const { education } = cvData;
  const feedback: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  if (education.length === 0) {
    suggestions.push('Tambahkan riwayat pendidikan Anda (Universitas, Sekolah)');
    return {
      section: 'education',
      score: 0,
      status: 'needs-improvement',
      feedback: ['⚠ Belum ada riwayat pendidikan'],
      suggestions,
    };
  }

  feedback.push(`✓ ${education.length} institusi pendidikan tercatat`);
  score += 30;

  // Check for degree information
  const hasDegrees = education.filter(e => e.degree && e.degree.trim().length > 0).length;
  if (hasDegrees === education.length) {
    score += 30;
    feedback.push('✓ Semua pendidikan memiliki gelar/jenjang yang jelas');
  } else {
    suggestions.push('Pastikan setiap pendidikan memiliki gelar/jenjang yang jelas (S1, D3, dll)');
  }

  // Check for field/major
  const hasFields = education.filter(e => e.field && e.field.trim().length > 0).length;
  if (hasFields === education.length) {
    score += 20;
    feedback.push('✓ Bidang studi/jurusan sudah lengkap');
  } else {
    suggestions.push('Tambahkan jurusan/bidang studi untuk setiap pendidikan');
  }

  // Check for years
  const hasYears = education.filter(e => e.startYear && e.endYear).length;
  if (hasYears === education.length) {
    score += 20;
    feedback.push('✓ Tahun masuk dan lulus sudah tercatat');
  } else {
    suggestions.push('Pastikan tahun masuk dan lulus sudah lengkap');
  }

  // Check for description (GPA, achievements)
  const hasDescriptions = education.filter(e => e.description && e.description.trim().length > 0).length;
  if (hasDescriptions >= education.length * 0.5) {
    score += 10;
    feedback.push('✓ Beberapa pencapaian akademik tercatat');
  } else {
    suggestions.push('Tambahkan deskripsi tentang pencapaian, GPA, atau aktivitas akademik');
  }

  return {
    section: 'education',
    score: Math.min(score, 100),
    status: score >= 70 ? 'excellent' : score >= 50 ? 'good' : score >= 30 ? 'fair' : 'needs-improvement',
    feedback,
    suggestions,
  };
}

/**
 * Analyze Work Experience
 */
function analyzeExperience(cvData: CVData): SectionFeedback {
  const { workExperience } = cvData;
  const feedback: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  if (workExperience.length === 0) {
    feedback.push('ℹ Belum ada riwayat pekerjaan (OK untuk fresh graduate)');
    score = 40;
    return {
      section: 'experience',
      score,
      status: 'fair',
      feedback,
      suggestions: ['Jika sudah memiliki pengalaman kerja, tambahkan detail pengalaman Anda'],
    };
  }

  feedback.push(`✓ ${workExperience.length} pengalaman kerja tercatat`);
  score += 20;

  // Check for position clarity
  const hasPositions = workExperience.filter(e => e.position && e.position.trim().length > 0).length;
  if (hasPositions === workExperience.length) {
    score += 15;
    feedback.push('✓ Semua posisi pekerjaan jelas dan spesifik');
  } else {
    suggestions.push('Gunakan nama posisi yang spesifik dan jelas');
  }

  // Check for company information
  const hasCompanies = workExperience.filter(e => e.company && e.company.trim().length > 0).length;
  if (hasCompanies === workExperience.length) {
    score += 15;
    feedback.push('✓ Nama perusahaan lengkap');
  } else {
    suggestions.push('Pastikan nama perusahaan sudah diisi untuk setiap pengalaman');
  }

  // Check for duration
  const hasDurations = workExperience.filter(e => e.startDate && e.endDate).length;
  if (hasDurations === workExperience.length) {
    score += 15;
    feedback.push('✓ Durasi pekerjaan sudah tercatat');
  } else {
    suggestions.push('Lengkapi tanggal mulai dan berakhir untuk setiap pekerjaan');
  }

  // Check for achievement descriptions
  const hasDescriptions = workExperience.filter(e => e.description && e.description.trim().length > 50).length;
  if (hasDescriptions >= workExperience.length * 0.7) {
    score += 20;
    feedback.push('✓ Pencapaian dan tanggung jawab dijelaskan dengan baik');
  } else if (hasDescriptions > 0) {
    score += 10;
    feedback.push('~ Beberapa pencapaian tercatat');
    suggestions.push('Tambahkan deskripsi achievement/responsibility untuk setiap posisi (gunakan action verbs)');
  } else {
    suggestions.push('Jelaskan tanggung jawab dan pencapaian Anda di setiap posisi dengan detail');
  }

  // Check for current job
  const hasCurrentJob = workExperience.some(e => e.isCurrentJob);
  if (hasCurrentJob) {
    score += 5;
    feedback.push('✓ Pekerjaan saat ini sudah ditandai');
  }

  return {
    section: 'experience',
    score: Math.min(score, 100),
    status: score >= 70 ? 'excellent' : score >= 50 ? 'good' : score >= 30 ? 'fair' : 'needs-improvement',
    feedback,
    suggestions,
  };
}

/**
 * Analyze Skills
 */
function analyzeSkills(cvData: CVData): SectionFeedback {
  const { skills } = cvData;
  const feedback: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  if (skills.length === 0) {
    suggestions.push('Tambahkan minimal 5-10 skill yang Anda miliki');
    return {
      section: 'skills',
      score: 0,
      status: 'needs-improvement',
      feedback: ['⚠ Belum ada skill yang tercatat'],
      suggestions,
    };
  }

  feedback.push(`✓ ${skills.length} skill sudah tercatat`);
  score = 30;

  if (skills.length >= 5) {
    score += 20;
    feedback.push('✓ Jumlah skill cukup (5+)');
  } else if (skills.length >= 3) {
    score += 10;
    feedback.push('~ Tambahkan lebih banyak skill untuk lebih menarik');
  } else {
    suggestions.push('Tambahkan lebih banyak skill (target: minimal 5-10 skill)');
  }

  // Check for technical vs soft skills balance
  const technicalSkills = skills.filter(s => 
    /javascript|python|java|c\+\+|react|node|sql|aws|git|docker|kubernetes/i.test(s)
  );
  const softSkills = skills.filter(s =>
    /leadership|communication|teamwork|problem solving|time management|creative/i.test(s)
  );

  if (technicalSkills.length > 0 && softSkills.length > 0) {
    score += 25;
    feedback.push('✓ Seimbang antara hard skills dan soft skills');
  } else if (technicalSkills.length > 0 || softSkills.length > 0) {
    score += 15;
    suggestions.push('Tambahkan skill dari kategori yang belum ada untuk keseimbangan yang lebih baik');
  } else {
    score += 10;
  }

  // Check for skill relevance
  const meaningfulSkills = skills.filter(s => s.trim().length >= 3).length;
  if (meaningfulSkills === skills.length) {
    score += 15;
    feedback.push('✓ Semua skill tertulis dengan jelas');
  } else {
    suggestions.push('Pastikan setiap skill ditulis lengkap dan jelas');
  }

  return {
    section: 'skills',
    score: Math.min(score, 100),
    status: score >= 70 ? 'excellent' : score >= 50 ? 'good' : score >= 30 ? 'fair' : 'needs-improvement',
    feedback,
    suggestions,
  };
}

/**
 * Analyze Certifications
 */
function analyzeCertifications(cvData: CVData): SectionFeedback {
  const { certifications } = cvData;
  const feedback: string[] = [];
  const suggestions: string[] = [];
  let score = 50;

  if (certifications.length === 0) {
    feedback.push('ℹ Belum ada sertifikasi (opsional tapi bagus untuk ditambahkan)');
    suggestions.push('Jika memiliki sertifikasi profesional, tambahkan untuk meningkatkan CV Anda');
    return {
      section: 'certifications',
      score,
      status: 'fair',
      feedback,
      suggestions,
    };
  }

  feedback.push(`✓ ${certifications.length} sertifikasi tercatat`);
  score = 60;

  // Check for certification names
  const hasNames = certifications.filter(c => c.name && c.name.trim().length > 0).length;
  if (hasNames === certifications.length) {
    score += 15;
    feedback.push('✓ Nama sertifikasi lengkap');
  } else {
    suggestions.push('Pastikan nama sertifikasi sudah diisi dengan jelas');
  }

  // Check for issuer
  const hasIssuers = certifications.filter(c => c.issuer && c.issuer.trim().length > 0).length;
  if (hasIssuers === certifications.length) {
    score += 15;
    feedback.push('✓ Penerbit sertifikasi dicatat');
  } else {
    suggestions.push('Tambahkan penerbit/organisasi untuk setiap sertifikasi');
  }

  // Check for year
  const hasYears = certifications.filter(c => c.year && c.year.trim().length > 0).length;
  if (hasYears === certifications.length) {
    score += 10;
    feedback.push('✓ Tahun sertifikasi tercatat');
  }

  return {
    section: 'certifications',
    score: Math.min(score, 100),
    status: score >= 70 ? 'excellent' : score >= 50 ? 'good' : score >= 30 ? 'fair' : 'needs-improvement',
    feedback,
    suggestions,
  };
}

/**
 * Extract strengths from section feedbacks
 */
function extractStrengths(sections: SectionFeedback[]): string[] {
  const strengths: string[] = [];

  sections.forEach(section => {
    const positives = section.feedback
      .filter(f => f.startsWith('✓'))
      .map(f => f.replace('✓ ', ''));
    
    if (positives.length > 0) {
      // Take top positive feedback from each section
      strengths.push(...positives.slice(0, 2));
    }
  });

  return strengths.slice(0, 5);
}

/**
 * Extract improvements from section feedbacks
 */
function extractImprovements(sections: SectionFeedback[]): string[] {
  const improvements: string[] = [];

  sections.forEach(section => {
    if (section.suggestions.length > 0) {
      improvements.push(section.suggestions[0]);
    }
  });

  return improvements.slice(0, 4);
}

/**
 * Get grade from score
 */
function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

/**
 * Generate overall message based on score
 */
function generateOverallMessage(score: number, grade: string): string {
  if (score >= 85) {
    return 'Wow! CV Anda sangat profesional dan lengkap. Anda siap untuk apply ke posisi yang Anda inginkan! 🎉';
  }
  if (score >= 70) {
    return 'CV Anda sudah baik! Terapkan beberapa saran di bawah untuk membuat CV lebih menawan. 👍';
  }
  if (score >= 55) {
    return 'CV Anda cukup baik, tapi masih bisa ditingkatkan. Ikuti saran-saran di bawah untuk hasil optimal. 💪';
  }
  if (score >= 40) {
    return 'Ada beberapa bagian yang perlu diperbaiki. Lengkapi semua section dan ikuti saran-saran kami. 📝';
  }
  return 'CV Anda masih memerlukan banyak perbaikan. Mulai dengan mengisi section yang masih kosong. 🚀';
}

/**
 * Check if email is valid
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get score color
 */
export const getScoreColor = (score: number): string => {
  if (score >= 85) return '#22c55e'; // green-500
  if (score >= 70) return '#3b82f6'; // blue-500
  if (score >= 55) return '#f59e0b'; // amber-500
  if (score >= 40) return '#ef4444'; // red-500
  return '#dc2626'; // red-600
};

/**
 * Get score label
 */
export const getScoreLabel = (score: number): string => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  if (score >= 40) return 'Needs Improvement';
  return 'Poor';
};
