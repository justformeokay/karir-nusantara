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
  CheckCircle2,
  Clock,
  BookOpen,
  UserCircle,
  FileText,
  Users,
  Calendar,
  Award,
  TimerIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext.new';
import { useAppliedJobIds } from '@/hooks/useApplications';
import { getRecommendations, RecommendationScore, RecommendationsResponse } from '@/api/recommendations';

// Helper functions for score display
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#22c55e'; // green
  if (score >= 60) return '#eab308'; // yellow
  if (score >= 40) return '#f97316'; // orange
  return '#ef4444'; // red
};

const getScoreLabel = (score: number): string => {
  if (score >= 85) return 'Sangat Cocok';
  if (score >= 70) return 'Cocok';
  if (score >= 50) return 'Cukup Cocok';
  if (score >= 30) return 'Mungkin Cocok';
  return 'Tidak Cocok';
};

// Map job type from API to display
const formatJobType = (jobType: string): string => {
  const map: Record<string, string> = {
    'full_time': 'Full-time',
    'part_time': 'Part-time',
    'contract': 'Kontrak',
    'internship': 'Magang',
    'freelance': 'Freelance',
  };
  return map[jobType] || jobType;
};

// Format salary
const formatSalary = (min?: number, max?: number): string => {
  if (!min && !max) return 'Gaji Dirahasiakan';
  const formatNum = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(0)} jt`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)} rb`;
    return n.toString();
  };
  if (min && max) return `Rp ${formatNum(min)} - ${formatNum(max)}`;
  if (min) return `Rp ${formatNum(min)}+`;
  if (max) return `< Rp ${formatNum(max)}`;
  return 'Gaji Dirahasiakan';
};

// Parse requirements from string to array
const parseRequirements = (requirements?: string): string[] => {
  if (!requirements) return [];
  // Try to parse as JSON array first
  try {
    const parsed = JSON.parse(requirements);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not JSON, split by newline or bullet points
  }
  // Split by common delimiters
  return requirements
    .split(/[\n•\-\*]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
};

// Format experience level
const formatExperienceLevel = (level: string): string => {
  const map: Record<string, string> = {
    'entry': 'Entry Level',
    'junior': 'Junior',
    'mid': 'Mid Level',
    'senior': 'Senior',
    'lead': 'Lead',
    'executive': 'Executive',
  };
  return map[level] || level;
};

// Format relative time
const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
    return `${Math.floor(diffDays / 365)} tahun lalu`;
  } catch {
    return dateString;
  }
};

// Format deadline
const formatDeadline = (deadline?: string): { text: string; urgent: boolean } | null => {
  if (!deadline) return null;
  
  try {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return null; // Expired
    if (diffDays === 0) return { text: 'Deadline hari ini!', urgent: true };
    if (diffDays === 1) return { text: 'Deadline besok!', urgent: true };
    if (diffDays <= 3) return { text: `${diffDays} hari lagi`, urgent: true };
    if (diffDays <= 7) return { text: `${diffDays} hari lagi`, urgent: false };
    if (diffDays <= 30) return { text: `${Math.ceil(diffDays / 7)} minggu lagi`, urgent: false };
    return { text: `${Math.ceil(diffDays / 30)} bulan lagi`, urgent: false };
  } catch {
    return null;
  }
};

const RecommendedJobsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [stats, setStats] = useState<Omit<RecommendationsResponse, 'recommendations'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  // Fetch applied job IDs for logged-in users
  const { hasApplied } = useAppliedJobIds();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRecommendations(20);
      setRecommendations(response.recommendations || []);
      setStats({
        total_jobs: response.total_jobs,
        matched_jobs: response.matched_jobs,
        average_score: response.average_score,
        profile_complete: response.profile_complete,
      });
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Gagal memuat rekomendasi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

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
              Personalized AI
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Lowongan Direkomendasikan untuk Anda
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Berdasarkan <strong>skills</strong>, <strong>pengalaman kerja</strong>, dan <strong>preferensi</strong> Anda,
            kami merekomendasikan lowongan yang paling cocok.
          </p>
        </motion.div>

        {/* Profile Incomplete Warning */}
        {stats && !stats.profile_complete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-4"
          >
            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Lengkapi Profil Anda</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Untuk hasil rekomendasi yang lebih akurat, lengkapi CV dan profil Anda dengan skills, pengalaman kerja, dan preferensi pekerjaan.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link to="/cv">
                  <Button size="sm" variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Lengkapi CV
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button size="sm" variant="outline" className="gap-2">
                    <UserCircle className="w-4 h-4" />
                    Update Preferensi
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

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
                value: stats?.matched_jobs || recommendations.length,
                icon: CheckCircle,
                color: 'from-green-500/20 to-green-500/5',
              },
              {
                label: 'Rata-rata Match',
                value: stats?.average_score ? `${stats.average_score}%` : '0%',
                icon: TrendingUp,
                color: 'from-blue-500/20 to-blue-500/5',
              },
              {
                label: 'Total Lowongan Aktif',
                value: stats?.total_jobs || 0,
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
                const deadline = formatDeadline(rec.job.applicationDeadline);
                const publishedTime = rec.job.publishedAt ? formatRelativeTime(rec.job.publishedAt) : null;

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
                    <div
                      className="w-full p-6 text-left"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
                        {/* Left: Job Info */}
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex gap-4">
                            {rec.job.company?.logo_url ? (
                              <img
                                src={rec.job.company.logo_url}
                                alt={rec.job.company?.name || 'Company'}
                                className="w-14 h-14 rounded-lg object-cover bg-muted flex-shrink-0 border border-border"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 ${rec.job.company?.logo_url ? 'hidden' : ''}`}>
                              <span className="text-2xl font-bold text-primary">
                                {(rec.job.company?.name || 'C').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 mb-1">
                                <h3 className="text-xl font-bold text-foreground flex-1">
                                  {rec.job.title}
                                </h3>
                                {hasApplied(rec.job.id) && (
                                  <Badge className="gap-1 whitespace-nowrap bg-green-100 text-green-700 border-green-300">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Applied
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">
                                {rec.job.company?.name || 'Unknown Company'}
                              </p>
                              
                              {/* Meta Info Grid */}
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-primary" />
                                  <span>{rec.job.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                                  <span>{formatJobType(rec.job.jobType)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Award className="w-3.5 h-3.5 text-primary" />
                                  <span>{formatExperienceLevel(rec.job.experienceLevel)}</span>
                                </div>
                                {rec.job.applicationsCount > 0 && (
                                  <div className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-primary" />
                                    <span>{rec.job.applicationsCount} pelamar</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Salary & Additional Info */}
                          <div className="flex flex-wrap gap-2">
                            {(rec.job.salaryMin || rec.job.salaryMax) && (
                              <Badge variant="secondary" className="gap-1.5 bg-green-50 text-green-700 border-green-200">
                                <DollarSign className="w-3.5 h-3.5" />
                                {formatSalary(rec.job.salaryMin, rec.job.salaryMax)}
                              </Badge>
                            )}
                            {publishedTime && (
                              <Badge variant="outline" className="gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {publishedTime}
                              </Badge>
                            )}
                            {deadline && (
                              <Badge 
                                variant={deadline.urgent ? "destructive" : "outline"} 
                                className={`gap-1.5 ${deadline.urgent ? 'bg-orange-50 text-orange-700 border-orange-300' : ''}`}
                              >
                                <TimerIcon className="w-3.5 h-3.5" />
                                {deadline.text}
                              </Badge>
                            )}
                          </div>

                          {/* Skills */}
                          {rec.job.skills && rec.job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {rec.job.skills.slice(0, 5).map((skill, idx) => (
                                <Badge 
                                  key={idx} 
                                  variant="outline" 
                                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {rec.job.skills.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{rec.job.skills.length - 5} lainnya
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Right: Score & Actions */}
                        <div className="flex flex-col items-center gap-4">
                          {/* Score Circle */}
                          <div className="relative w-28 h-28">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="56"
                                cy="56"
                                r="50"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-muted/20"
                              />
                              <motion.circle
                                cx="56"
                                cy="56"
                                r="50"
                                fill="none"
                                stroke={scoreColor}
                                strokeWidth="4"
                                strokeLinecap="round"
                                initial={{ strokeDasharray: '0 314' }}
                                animate={{
                                  strokeDasharray: `${(rec.score / 100) * 314} 314`,
                                }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <p className="text-2xl font-bold text-foreground leading-none">
                                {rec.score}%
                              </p>
                              <p className="text-[10px] font-medium text-muted-foreground mt-1">
                                {scoreLabel}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 w-full max-w-[140px]">
                            <Link to={`/lowongan/${rec.job.hashId || rec.job.id}`} className="w-full">
                              <Button size="sm" className="w-full gap-2">
                                <FileText className="w-3.5 h-3.5" />
                                Lihat Detail
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
                              {isExpanded ? 'Tutup Info' : 'Info Match'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

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
                        {rec.match_reasons && rec.match_reasons.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Alasan Match
                            </h4>
                            <ul className="space-y-1">
                              {rec.match_reasons.map((reason, idx) => (
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
                        {rec.mismatch_reasons && rec.mismatch_reasons.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                              Hal untuk Dipertimbangkan
                            </h4>
                            <ul className="space-y-1">
                              {rec.mismatch_reasons.map((reason, idx) => (
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
                            {(() => {
                              const reqs = parseRequirements(rec.job.requirements);
                              return (
                                <>
                                  {reqs.slice(0, 5).map((req, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {req}
                                    </Badge>
                                  ))}
                                  {reqs.length > 5 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{reqs.length - 5} lagi
                                    </Badge>
                                  )}
                                  {reqs.length === 0 && (
                                    <span className="text-sm text-muted-foreground">
                                      Tidak ada persyaratan spesifik
                                    </span>
                                  )}
                                </>
                              );
                            })()}
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
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-semibold">35%</span>
              <span>Kecocokan skills</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">25%</span>
              <span>Pengalaman kerja yang relevan</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">20%</span>
              <span>Kecocokan lokasi</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">10%</span>
              <span>Kesesuaian gaji</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">10%</span>
              <span>Jenis pekerjaan</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default RecommendedJobsPage;
