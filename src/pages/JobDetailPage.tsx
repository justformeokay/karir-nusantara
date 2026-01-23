import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  Wifi,
  Zap,
  Building2,
  CheckCircle,
  Share2,
  Heart,
  Send,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatSalaryRange, getTimeAgo } from '@/data/jobs';
import { useAuth } from '@/contexts/AuthContext.new';
import { useApplications } from '@/contexts/ApplicationContext.new';
import AuthModal from '@/components/auth/AuthModal';
import { toast } from 'sonner';
import { useJob } from '@/hooks/useJobs';
import { getJobTypeLabel, type Job } from '@/api/jobs';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { applyToJob, hasAppliedToJob } = useApplications();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Fetch from API using id (supports hash_id)
  const { data: apiJob, isLoading, isError } = useJob(id);

  // Use API job directly
  const job = apiJob;

  const hasAlreadyApplied = id ? hasAppliedToJob(id) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Memuat detail lowongan...</p>
        </motion.div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Lowongan tidak ditemukan</h2>
          <Link to="/lowongan">
            <Button>Kembali ke Lowongan</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleApply = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (hasAlreadyApplied) {
      toast.info('Anda sudah melamar untuk posisi ini');
      return;
    }

    if (!job) return;

    setIsApplying(true);
    try {
      await applyToJob(String(job.id), {
        id: String(job.id),
        title: job.title,
        company: job.company.name,
        companyLogo: job.company.logo_url || '',
        location: job.location,
        type: getJobTypeLabel(job.jobType) as any,
      });
      toast.success('Lamaran berhasil dikirim!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mengirim lamaran';
      toast.error(message);
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Lowongan dihapus dari simpanan' : 'Lowongan disimpan!');
  };

  const handleShare = async () => {
    // Copy link ke clipboard
    const jobUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(jobUrl);
      toast.success('Link lowongan berhasil disalin ke clipboard!');
    } catch {
      toast.error('Gagal menyalin link');
    }

    // Jika browser support native share, tunjukkan dialog
    if (navigator.share) {
      await navigator.share({
        title: job.title,
        text: `Lowongan ${job.title} di ${job.company}`,
        url: jobUrl,
      });
    }
  };

  return (
    <>
      <div className="min-h-screen pt-20 pb-16 bg-muted">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mt-5"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Header Card */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={job.company.logo_url ? `http://localhost:8081${job.company.logo_url}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company.name)}&background=667eea&color=fff&size=128`}
                    alt={job.company.name}
                    className="w-20 h-20 rounded-xl object-cover bg-muted"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company.name)}&background=667eea&color=fff&size=128`;
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                          {job.title}
                        </h1>
                        <p className="text-lg text-muted-foreground">{job.company.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.status === 'active' && job.applicationsCount === 0 && (
                          <Badge variant="destructive" className="gap-1">
                            <Zap className="w-3 h-3" />
                            Urgent
                          </Badge>
                        )}
                        {job.isRemote && (
                          <Badge variant="secondary" className="gap-1">
                            <Wifi className="w-3 h-3" />
                            Remote
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        {getJobTypeLabel(job.jobType)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        {getTimeAgo(job.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  {job.isSalaryVisible ? (
                    <p className="text-2xl font-bold text-primary">
                      {formatSalaryRange(job.salaryMin, job.salaryMax)}
                      <span className="text-sm font-normal text-muted-foreground ml-2">per bulan</span>
                    </p>
                  ) : (
                    <p className="text-muted-foreground">Gaji tidak ditampilkan oleh perusahaan</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Deskripsi Pekerjaan</h2>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">Persyaratan</h2>
                  <ul className="space-y-3">
                    {job.requirements.split('\n').filter(Boolean).map((req, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">Tanggung Jawab</h2>
                  <ul className="space-y-3">
                    {job.responsibilities.split('\n').filter(Boolean).map((resp, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">Benefit</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.split('\n').filter(Boolean).map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Apply Card - Sticky */}
              <div className="sticky top-24 space-y-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <Button onClick={handleApply} className="w-full mb-4" size="lg">
                    <Send className="w-5 h-5 mr-2" />
                    Lamar Pekerjaan
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      className={`flex-1 ${isSaved ? 'text-destructive border-destructive' : ''}`}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                      Simpan
                    </Button>
                    <Button variant="outline" onClick={handleShare} className="flex-1">
                      <Share2 className="w-5 h-5 mr-2" />
                      Bagikan
                    </Button>
                  </div>
                </div>

                {/* Company Card */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Tentang Perusahaan
                  </h3>
                  <Link to={`/perusahaan/${job.company.hash_id}`} className="block">
                    <div className="flex items-center gap-4 mb-4 cursor-pointer group">
                      <img
                        src={job.company.logo_url ? `http://localhost:8081${job.company.logo_url}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company.name)}&background=667eea&color=fff&size=128`}
                        alt={job.company.name}
                        className="w-14 h-14 rounded-xl object-cover bg-muted"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company.name)}&background=667eea&color=fff&size=128`;
                        }}
                      />
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{job.company.name}</p>
                        <p className="text-sm text-muted-foreground">Klik untuk lihat detail</p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* CTA CV */}
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Belum punya CV?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Buat CV profesional gratis dengan CV Builder kami
                  </p>
                  <Link to="/buat-cv">
                    <Button variant="default" className="w-full">
                      Buat CV Sekarang
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default JobDetailPage;
