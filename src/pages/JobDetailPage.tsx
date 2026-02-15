import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Share2,
  Heart,
  Send,
  Loader2,
  CheckCircle2,
  Upload,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatSalaryRange, getTimeAgo } from '@/data/jobs';
import { useAuth } from '@/contexts/AuthContext.new';
import { useApplications } from '@/contexts/ApplicationContext.new';
import { useToggleWishlist } from '@/hooks/useWishlist';
import AuthModal from '@/components/auth/AuthModal';
import { toast } from 'sonner';
import { useJob } from '@/hooks/useJobs';
import { useCV } from '@/hooks/useCV';
import { useDocuments } from '@/hooks/useProfile';
import { getJobTypeLabel, trackJobView, trackJobShare, type Job } from '@/api/jobs';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { applyToJob, hasAppliedToJob } = useApplications();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const hasTrackedView = useRef(false);

  // Fetch from API using id (supports hash_id)
  const { data: apiJob, isLoading, isError } = useJob(id);

  // Wishlist toggle hook
  const { isSaved, isLoading: isWishlistLoading, toggle: toggleWishlist } = useToggleWishlist(id || '');

  // CV hooks - only fetch when user is authenticated
  const { data: userCV, isLoading: isCVLoading } = useCV(isAuthenticated);
  const { data: documents, isLoading: isDocsLoading } = useDocuments(isAuthenticated);
  
  // Check for uploaded CV
  const uploadedCV = useMemo(() => {
    if (!documents) return null;
    return documents.find(doc => doc.document_type === 'cv_uploaded');
  }, [documents]);
  
  // Check if CV is valid (has at least personal info filled OR has uploaded CV)
  // Only check if user is authenticated
  const hasBuiltCV = isAuthenticated && userCV && 
    userCV.personalInfo?.fullName && 
    userCV.personalInfo?.email && 
    (userCV.personalInfo?.phone || userCV.education?.length > 0 || userCV.workExperience?.length > 0);
  
  const hasUploadedCV = isAuthenticated && !!uploadedCV;
  const hasCVReady = hasBuiltCV || hasUploadedCV;
  const isCVCheckLoading = isCVLoading || isDocsLoading;

  // Use API job directly
  const job = apiJob;

  const hasAlreadyApplied = id ? hasAppliedToJob(id) : false;

  // Track job view when user is authenticated and job is loaded
  useEffect(() => {
    if (isAuthenticated && job && id && !hasTrackedView.current) {
      hasTrackedView.current = true;
      trackJobView(id);
    }
  }, [isAuthenticated, job, id]);

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
    if (job && job.status !== 'active') {
      toast.error('Lowongan ini sudah ditutup, tidak bisa membuat lamaran baru');
      return;
    }

    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (hasAlreadyApplied) {
      toast.info('Anda sudah melamar untuk posisi ini');
      return;
    }

    if (!job) return;

    // Show confirmation dialog instead of immediately applying
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmApply = async () => {
    if (!job) return;

    // Validate CV before applying
    if (!hasCVReady) {
      toast.error('Anda harus melengkapi CV terlebih dahulu sebelum melamar');
      return;
    }

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
      setIsConfirmDialogOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mengirim lamaran';
      toast.error(message);
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    
    try {
      await toggleWishlist();
    } catch (error) {
      // Error already handled by hook
    }
  };

  const handleShare = async () => {
    // Copy link ke clipboard
    const jobUrl = window.location.href;
    let platform = 'copy_link';
    
    try {
      await navigator.clipboard.writeText(jobUrl);
      toast.success('Link lowongan berhasil disalin ke clipboard!');
    } catch {
      toast.error('Gagal menyalin link');
    }

    // Jika browser support native share, tunjukkan dialog
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Lowongan ${job.title} di ${job.company.name}`,
          url: jobUrl,
        });
        platform = 'native_share';
      } catch {
        // User cancelled share or share failed
      }
    }

    // Track the share action if authenticated
    if (isAuthenticated && id) {
      trackJobShare(id, platform);
    }
  };

  // Check if job is closed or inactive
  const isJobInactive = job && job.status !== 'active';

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
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">Persyaratan</h2>
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">Tanggung Jawab</h2>
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2"
                    dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                  />
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">Benefit</h2>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      // Try to extract from HTML list items first
                      const listMatches = job.benefits.match(/<li[^>]*>([^<]+)<\/li>/gi);
                      if (listMatches && listMatches.length > 0) {
                        return listMatches
                          .map(item => item.replace(/<\/?li[^>]*>/gi, '').trim())
                          .filter(Boolean)
                          .map((benefit, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                              <span className="font-bold">{index + 1}</span>
                              <span>{benefit}</span>
                            </div>
                          ));
                      }
                      // Fallback: split by newline for plain text
                      return job.benefits
                        .replace(/<[^>]*>/g, '')
                        .split('\n')
                        .filter(Boolean)
                        .filter(text => text.toLowerCase() !== 'benefit yang akan anda peroleh:' && text.toLowerCase() !== 'benefits yang akan anda peroleh:')
                        .map((benefit, index) => {
                          const cleanText = benefit.trim();
                          return cleanText ? (
                            <div
                              key={index}
                              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                              <span className="font-bold">{index + 1}</span>
                              <span>{cleanText}</span>
                            </div>
                          ) : null;
                        });
                    })()}
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
                <div className={`bg-card border rounded-xl p-6 ${
                  isJobInactive ? 'border-gray-200 opacity-60' : 'border-border'
                }`}>
                  <Button 
                    onClick={handleApply} 
                    disabled={isJobInactive || isApplying || hasAlreadyApplied || (isAuthenticated && isCVCheckLoading)}
                    className={`w-full mb-4 ${
                      hasAlreadyApplied ? 'bg-green-600 hover:bg-green-600 cursor-not-allowed' : ''
                    }`}
                    size="lg"
                    title={
                      isJobInactive 
                        ? 'Lowongan ini sudah ditutup' 
                        : hasAlreadyApplied 
                        ? 'Anda sudah melamar lowongan ini' 
                        : ''
                    }
                  >
                    {hasAlreadyApplied ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Sudah Dilamar
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Lamar Pekerjaan
                      </>
                    )}
                  </Button>
                  {isJobInactive && (
                    <p className="text-xs text-red-600 font-medium mb-3 text-center">
                      Lowongan ini sudah {job?.status === 'closed' ? 'ditutup' : 'tidak aktif'}
                    </p>
                  )}
                  {hasAlreadyApplied && !isJobInactive && (
                    <p className="text-xs text-green-600 font-medium mb-3 text-center">
                      Lamaran Anda sudah terkirim
                    </p>
                  )}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      disabled={isWishlistLoading || isJobInactive || hasAlreadyApplied}
                      className={`flex-1 ${
                        isJobInactive || hasAlreadyApplied ? 'opacity-50 cursor-not-allowed' : ''
                      } ${isSaved ? 'text-destructive border-destructive' : ''}`}
                      title={
                        isJobInactive 
                          ? 'Tidak bisa menyimpan lowongan yang ditutup' 
                          : hasAlreadyApplied
                          ? 'Tidak perlu menyimpan, Anda sudah melamar'
                          : ''
                      }
                    >
                      {isWishlistLoading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                      )}
                      {isSaved ? 'Tersimpan' : 'Simpan'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleShare}
                      disabled={isJobInactive}
                      className={`flex-1 ${
                        isJobInactive ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title={isJobInactive ? 'Tidak bisa berbagi lowongan yang ditutup' : ''}
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Bagikan
                    </Button>
                  </div>
                </div>

                {/* Company Card */}
                <div className={`bg-card border rounded-xl p-6 ${
                  isJobInactive ? 'border-gray-200' : 'border-border'
                }`}>
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
                    Upload CV atau buat CV profesional gratis dengan sistem kami
                  </p>
                  <Link to="/cv">
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

      {/* Confirmation Dialog */}
      {isConfirmDialogOpen && job && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !isApplying && setIsConfirmDialogOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Konfirmasi Lamaran</h2>
              <p className="text-muted-foreground">Pastikan informasi di bawah sudah benar sebelum mengirim lamaran</p>
            </div>

            {/* Job Details */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Posisi</p>
                <p className="font-bold text-foreground">{job.title}</p>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Perusahaan</p>
                <p className="font-semibold text-foreground flex items-center gap-2">
                  {job.company.logo_url && (
                    <img 
                      src={`http://localhost:8081${job.company.logo_url}`}
                      alt={job.company.name}
                      className="w-5 h-5 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company.name)}&size=20`;
                      }}
                    />
                  )}
                  {job.company.name}
                </p>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Lokasi & Tipe</p>
                <p className="text-sm text-foreground">
                  {job.location} • {getJobTypeLabel(job.jobType)}
                  {job.isRemote && ' • Remote'}
                </p>
              </div>
              {job.isSalaryVisible && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Gaji</p>
                  <p className="font-semibold text-primary">{formatSalaryRange(job.salaryMin, job.salaryMax)}</p>
                </div>
              )}
            </div>

            {/* CV Status Check */}
            {isCVCheckLoading ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <p className="text-sm text-blue-800">Memeriksa kelengkapan CV Anda...</p>
              </div>
            ) : !hasCVReady ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 text-red-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-red-800">CV Anda belum lengkap</p>
                    <p className="text-xs mt-1 text-red-700">Anda harus mengupload atau membuat CV terlebih dahulu sebelum bisa melamar pekerjaan ini.</p>
                  </div>
                </div>
                <Link to="/cv" className="block mt-3" onClick={() => setIsConfirmDialogOpen(false)}>
                  <Button variant="destructive" size="sm" className="w-full gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Buat CV Sekarang
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-800">CV Anda siap digunakan</p>
                    <div className="text-xs mt-2 space-y-1.5 text-green-700">
                      {hasUploadedCV && (
                        <div className="flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5" />
                          <span>CV Upload: {uploadedCV?.document_name || 'Tersedia'}</span>
                        </div>
                      )}
                      {hasBuiltCV && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5" />
                          <span>CV dari Sistem Karir Nusantara</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsConfirmDialogOpen(false)}
                disabled={isApplying}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={handleConfirmApply}
                disabled={isApplying || isCVCheckLoading || !hasCVReady}
                className="flex-1 gap-2"
                title={!hasCVReady ? 'Lengkapi CV terlebih dahulu' : ''}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Lamaran
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default JobDetailPage;
