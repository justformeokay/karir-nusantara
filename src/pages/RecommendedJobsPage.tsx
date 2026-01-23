import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Briefcase,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext.new';
import { mockJobs } from '@/data/jobs';
import {
  getJobRecommendations,
  buildUserProfile,
  getScoreColor,
  getScoreLabel,
  RecommendationScore,
} from '@/lib/recommendations';

const RecommendedJobsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Simulate CV data for now
      const mockCVData = {
        skills: ['JavaScript', 'React', 'TypeScript', 'SQL'],
        preferredCategory: 'Teknologi',
        location: 'DKI Jakarta',
        totalExperience: 3,
      };

      const userProfile = buildUserProfile(user, mockCVData);
      const recs = getJobRecommendations(userProfile, mockJobs, 12);
      
      // Simulate loading delay
      setTimeout(() => {
        setRecommendations(recs);
        setLoading(false);
      }, 600);
    }
  }, [user, isAuthenticated]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Silakan login terlebih dahulu
          </h2>
          <p className="text-muted-foreground mb-6">
            Anda perlu login untuk melihat lowongan yang direkomendasikan
          </p>
          <Link to="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    );
  }

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
              <Sparkles className="w-4 h-4" />
              Personalized
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Lowongan Direkomendasikan untuk Anda
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Berdasarkan profil, skills, dan preferensi lokasi Anda, kami merekomendasikan lowongan yang paling cocok.
            Semakin tinggi persentase, semakin cocok lowongan untuk Anda.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: 'Lowongan Cocok',
                value: recommendations.length,
                icon: CheckCircle,
                color: 'from-green-500/20 to-green-500/5',
              },
              {
                label: 'Rata-rata Match',
                value: recommendations.length > 0 
                  ? Math.round(recommendations.reduce((sum, r) => sum + r.score, 0) / recommendations.length) + '%'
                  : '0%',
                icon: TrendingUp,
                color: 'from-blue-500/20 to-blue-500/5',
              },
              {
                label: 'Total Lowongan',
                value: mockJobs.length,
                icon: Briefcase,
                color: 'from-purple-500/20 to-purple-500/5',
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className={`bg-gradient-to-br ${stat.color} border border-white/20 rounded-xl p-6`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recommendations List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              <span className="ml-3 text-muted-foreground">Menganalisis profil Anda...</span>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, index) => {
                const isExpanded = selectedJob === rec.job.id;
                const scoreColor = getScoreColor(rec.score);
                const scoreLabel = getScoreLabel(rec.score);

                return (
                  <motion.div
                    key={rec.job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-card border border-border rounded-xl overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg ${
                      isExpanded ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    {/* Main Content */}
                    <button
                      onClick={() => setSelectedJob(isExpanded ? null : rec.job.id)}
                      className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
                        {/* Job Info */}
                        <div className="flex gap-4">
                          <img
                            src={rec.job.companyLogo}
                            alt={rec.job.company}
                            className="w-16 h-16 rounded-lg object-cover bg-muted"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-foreground mb-2 truncate">
                              {rec.job.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3 truncate">
                              {rec.job.company} • {rec.job.location}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="gap-1">
                                <MapPin className="w-3 h-3" />
                                {rec.job.province}
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                <Briefcase className="w-3 h-3" />
                                {rec.job.jobType}
                              </Badge>
                              {rec.job.salaryMin && (
                                <Badge variant="outline" className="gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {rec.job.salaryMin.toLocaleString('id-ID')}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Score Section */}
                        <div className="text-right">
                          <div className="mb-4">
                            {/* Score Circle */}
                            <div className="relative w-32 h-32 mx-auto mb-3">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="56"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  className="text-muted/30"
                                />
                                <motion.circle
                                  cx="64"
                                  cy="64"
                                  r="56"
                                  fill="none"
                                  stroke={scoreColor}
                                  strokeWidth="4"
                                  initial={{ strokeDasharray: '0 352' }}
                                  animate={{
                                    strokeDasharray: `${(rec.score / 100) * 352} 352`,
                                  }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-3xl font-bold text-foreground leading-none">
                                  {rec.score}%
                                </p>
                                <p className="text-xs font-medium text-muted-foreground mt-0.5 whitespace-nowrap">
                                  {scoreLabel}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* CTA Buttons */}
                          <div className="space-y-2">
                            <Link to={`/lowongan/${rec.job.hashId || rec.job.id}`}>
                              <Button size="sm" className="w-full gap-2">
                                Lihat Detail
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedJob(isExpanded ? null : rec.job.id);
                              }}
                            >
                              {isExpanded ? 'Tutup' : 'Info Match'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border bg-muted/30 px-6 py-4 space-y-4"
                      >
                        {/* Match Reasons */}
                        {rec.matchReasons.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Alasan Match
                            </h4>
                            <ul className="space-y-1">
                              {rec.matchReasons.map((reason, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <span className="text-green-500 mt-1">✓</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Mismatch Reasons */}
                        {rec.mismatchReasons.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                              Hal untuk Dipertimbangkan
                            </h4>
                            <ul className="space-y-1">
                              {rec.mismatchReasons.map((reason, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <span className="text-orange-500 mt-1">!</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Description Snippet */}
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            Deskripsi Singkat
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {rec.job.description}
                          </p>
                        </div>

                        {/* Key Requirements */}
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">
                            Persyaratan Utama
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {rec.job.requirements.slice(0, 5).map((req, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                            {rec.job.requirements.length > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{rec.job.requirements.length - 5} lagi
                              </Badge>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-12 text-center"
            >
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Tidak Ada Lowongan yang Cocok
              </h3>
              <p className="text-muted-foreground mb-6">
                Kami tidak menemukan lowongan yang cocok berdasarkan profil Anda saat ini.
                Coba update profil atau jelajahi semua lowongan yang tersedia.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/lowongan">
                  <Button className="gap-2">
                    <Briefcase className="w-4 h-4" />
                    Lihat Semua Lowongan
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" className="gap-2">
                    Update Profil
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-8"
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Bagaimana Kami Menghitung Rekomendasi?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sistem rekomendasi kami menganalisis beberapa faktor untuk menemukan lowongan terbaik untuk Anda:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-semibold">30%</span>
              <span>Kesesuaian kategori pekerjaan</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">25%</span>
              <span>Kecocokan lokasi atau work from home</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">25%</span>
              <span>Pengalaman kerja yang relevan</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">20%</span>
              <span>Skill yang dibutuhkan</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default RecommendedJobsPage;
