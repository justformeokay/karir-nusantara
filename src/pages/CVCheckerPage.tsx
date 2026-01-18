import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Zap,
  Award,
  BookOpen,
  Lightbulb,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCV } from '@/contexts/CVContext.new';
import { analyzeCVQuality, getScoreColor, getScoreLabel, CVFeedback } from '@/lib/cvChecker';
import { toast } from 'sonner';

const CVCheckerPage: React.FC = () => {
  const { cvData } = useCV();
  const [feedback, setFeedback] = useState<CVFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'tips'>('overview');

  useEffect(() => {
    // Simulate analysis delay
    setTimeout(() => {
      const result = analyzeCVQuality(cvData);
      setFeedback(result);
      setLoading(false);
    }, 800);
  }, [cvData]);

  const handleReanalyze = () => {
    setLoading(true);
    setActiveTab('overview');
    setTimeout(() => {
      const result = analyzeCVQuality(cvData);
      setFeedback(result);
      setLoading(false);
      toast.success('CV dianalisis ulang!');
    }, 800);
  };

  if (loading || !feedback) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gradient-to-b from-muted/50 to-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-center"
        >
          <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Menganalisis CV Anda...</p>
        </motion.div>
      </div>
    );
  }

  const scoreColor = getScoreColor(feedback.score);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <Badge className="gap-2 px-4 py-2 bg-primary/10 text-primary border-primary/30">
              <Zap className="w-4 h-4" />
              AI-Powered Analysis
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            CV Quality Checker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dapatkan feedback otomatis tentang kualitas CV Anda dan saran perbaikan untuk meningkatkan peluang diterima
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-card to-card/80 border border-border rounded-2xl p-8 md:p-12 mb-8 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Score Circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="flex justify-center"
            >
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/30"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="8"
                    initial={{ strokeDasharray: '0 439.6' }}
                    animate={{
                      strokeDasharray: `${(feedback.score / 100) * 439.6} 439.6`,
                    }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-5xl font-bold text-foreground">{feedback.score}</p>
                  <p className="text-sm font-semibold text-muted-foreground">/100</p>
                </div>
              </div>
            </motion.div>

            {/* Stats & Message */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-3xl font-bold text-foreground">Grade: {feedback.grade}</h2>
                  <motion.div
                    initial={{ rotate: -20, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Award
                      className="w-8 h-8"
                      style={{ color: scoreColor }}
                    />
                  </motion.div>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  {getScoreLabel(feedback.score)} • {feedback.overallMessage}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Kekuatan
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {feedback.strengths.length} hal bagus dalam CV Anda
                  </p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Perbaikan
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {feedback.improvements.length} saran untuk dikerjakan
                  </p>
                </div>
              </div>

              <Button
                onClick={handleReanalyze}
                variant="outline"
                className="mt-6 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Analisis Ulang
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-border">
            {(['overview', 'sections', 'tips'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'overview' && 'Ringkasan'}
                {tab === 'sections' && 'Detail Section'}
                {tab === 'tips' && 'Tips & Trik'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Strengths */}
              {feedback.strengths.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    Kekuatan CV Anda
                  </h3>
                  <div className="space-y-3">
                    {feedback.strengths.map((strength, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50"
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        <p className="text-foreground">{strength}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {feedback.improvements.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-amber-500" />
                    Saran Perbaikan
                  </h3>
                  <div className="space-y-3">
                    {feedback.improvements.map((improvement, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/50"
                      >
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        <p className="text-foreground">{improvement}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sections Tab */}
          {activeTab === 'sections' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedback.sections.map((section, idx) => {
                const sectionIcons: Record<string, React.ElementType> = {
                  personal: FileText,
                  education: BookOpen,
                  experience: TrendingUp,
                  skills: Lightbulb,
                  certifications: Award,
                };

                const sectionLabels: Record<string, string> = {
                  personal: 'Informasi Pribadi',
                  education: 'Pendidikan',
                  experience: 'Pengalaman Kerja',
                  skills: 'Keahlian',
                  certifications: 'Sertifikasi',
                };

                const Icon = sectionIcons[section.section];
                const bgColor =
                  section.status === 'excellent'
                    ? 'from-green-500/10 to-green-500/5'
                    : section.status === 'good'
                    ? 'from-blue-500/10 to-blue-500/5'
                    : section.status === 'fair'
                    ? 'from-amber-500/10 to-amber-500/5'
                    : 'from-red-500/10 to-red-500/5';

                return (
                  <motion.div
                    key={section.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-gradient-to-br ${bgColor} border border-white/20 rounded-xl p-6`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <Icon className="w-6 h-6 text-primary mt-1" />
                        <div>
                          <h4 className="font-bold text-foreground">
                            {sectionLabels[section.section]}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {section.status === 'excellent' && 'Sangat Baik'}
                            {section.status === 'good' && 'Baik'}
                            {section.status === 'fair' && 'Cukup'}
                            {section.status === 'needs-improvement' && 'Perlu Diperbaiki'}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-primary/20 text-primary">
                        {section.score}/100
                      </Badge>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="mb-4 h-2 bg-black/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${section.score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-primary to-blue-500"
                      />
                    </div>

                    {/* Feedback */}
                    {section.feedback.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">
                          Positif:
                        </p>
                        <div className="space-y-1">
                          {section.feedback.slice(0, 2).map((f, i) => (
                            <p key={i} className="text-sm text-foreground">
                              {f}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions */}
                    {section.suggestions.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">
                          Saran:
                        </p>
                        <div className="space-y-1">
                          {section.suggestions.slice(0, 2).map((s, i) => (
                            <p key={i} className="text-sm text-muted-foreground">
                              • {s}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === 'tips' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: FileText,
                  title: 'Format & Layout',
                  tips: [
                    'Gunakan font profesional (Arial, Calibri, dll)',
                    'Margin cukup (0.5-1 inch)',
                    'Maksimal 1-2 halaman untuk entry level',
                    'Gunakan bullets untuk readability',
                  ],
                },
                {
                  icon: BookOpen,
                  title: 'Konten CV',
                  tips: [
                    'Mulai dengan summary/objective yang kuat',
                    'Urutkan experience dari terbaru',
                    'Gunakan action verbs (managed, led, created)',
                    'Include metrics/hasil (increased by 30%)',
                  ],
                },
                {
                  icon: TrendingUp,
                  title: 'Experience Section',
                  tips: [
                    'Fokus pada achievement, bukan hanya duties',
                    'Tambahkan tanggung jawab yang measurable',
                    'Gunakan bahasa yang powerful & confident',
                    'Relevant dengan posisi yang dituju',
                  ],
                },
                {
                  icon: Lightbulb,
                  title: 'Skills & Keywords',
                  tips: [
                    'Include technical + soft skills',
                    'Gunakan keywords dari job description',
                    'Pisahkan by category (programming languages, tools)',
                    'Update regularly sesuai perkembangan',
                  ],
                },
              ].map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card border border-border rounded-xl p-6"
                  >
                    <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      {tip.title}
                    </h4>
                    <ul className="space-y-3">
                      {tip.tips.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                          <span className="text-primary font-bold">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Siap untuk Mulai Melamar?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Dengan CV Anda yang sudah dioptimalkan, saatnya untuk mulai melamar ke posisi yang Anda inginkan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rekomendasi">
              <Button size="lg" className="gap-2">
                <TrendingUp className="w-5 h-5" />
                Lihat Rekomendasi Lowongan
              </Button>
            </Link>
            <Link to="/buat-cv">
              <Button size="lg" variant="outline" className="gap-2">
                <FileText className="w-5 h-5" />
                Edit CV
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CVCheckerPage;
