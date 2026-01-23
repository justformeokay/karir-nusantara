import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Globe,
  Briefcase,
  Users,
  Calendar,
  Loader2,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCompanyByHashId, type Company } from '@/api/companies';

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) {
        setError('ID perusahaan tidak valid');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching company with hashId:', id);
        const data = await getCompanyByHashId(id);
        console.log('Company data received:', data);
        if (data) {
          setCompany(data);
        } else {
          setError('Perusahaan tidak ditemukan');
        }
      } catch (err: any) {
        console.error('Error fetching company:', err);
        setError(err?.message || 'Gagal memuat data perusahaan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Memuat informasi perusahaan...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {error || 'Perusahaan tidak ditemukan'}
          </h2>
          <Link to="/lowongan">
            <Button>Kembali ke Lowongan</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="w-32 h-32 rounded-xl object-cover bg-muted"
                      onError={(e) => {
                        console.warn('Logo failed to load:', company.logoUrl);
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=667eea&color=fff&size=128`;
                      }}
                      onLoad={() => {
                        console.log('Logo loaded successfully:', company.logoUrl);
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-primary/60" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                      {company.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground">
                      {(company.city || company.province) && (
                        <span className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          {[company.city, company.province].filter(Boolean).join(', ')}
                        </span>
                      )}
                      {company.industry && (
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-primary" />
                          {company.industry}
                        </span>
                      )}
                      {company.size && (
                        <span className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          {company.size}
                        </span>
                      )}
                      {company.establishedYear && (
                        <span className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          Berdiri {company.establishedYear}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* About Company */}
              {company.description && (
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Tentang Perusahaan</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {company.description}
                  </p>
                </div>
              )}

              {/* Find Jobs CTA */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Lowongan Tersedia</h2>
                <p className="text-muted-foreground mb-4">
                  Lihat semua lowongan yang tersedia dari {company.name} dan ajukan lamaran Anda sekarang.
                </p>
                <Link to={`/lowongan?company=${company.hashId}`}>
                  <Button className="w-full">
                    Lihat Semua Lowongan
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Info Card */}
              <div className="sticky top-24 space-y-6">
                {company.website && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">Informasi Kontak</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Website</p>
                          <a
                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all"
                          >
                            {company.website}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Company Info Card */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Informasi Perusahaan</h3>
                  <div className="space-y-4">
                    {company.industry && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Industri</p>
                        <p className="font-semibold text-foreground">{company.industry}</p>
                      </div>
                    )}
                    {company.size && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-1">Ukuran Perusahaan</p>
                        <p className="font-semibold text-foreground">{company.size}</p>
                      </div>
                    )}
                    {company.establishedYear && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-1">Tahun Berdiri</p>
                        <p className="font-semibold text-foreground">{company.establishedYear}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Tertarik Bergabung?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Kirimkan lamaran Anda ke salah satu posisi yang tersedia
                  </p>
                  <Link to={`/lowongan?company=${company.hashId}`}>
                    <Button variant="default" className="w-full">
                      Lihat Lowongan
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetailPage;
