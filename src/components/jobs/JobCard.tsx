import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Briefcase, Zap, Wifi, CheckCircle2 } from 'lucide-react';
import { Job as ApiJob } from '@/api/jobs';
import { Badge } from '@/components/ui/badge';

interface JobCardProps {
  job: ApiJob;
  index?: number;
  isApplied?: boolean;
}

// Helper functions
const formatSalaryRange = (min?: number, max?: number): string => {
  if (!min && !max) return 'Gaji Dirahasiakan';
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)} jt`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)} rb`;
    return num.toString();
  };
  
  if (min && max) return `Rp ${formatNumber(min)} - Rp ${formatNumber(max)}`;
  if (min) return `Rp ${formatNumber(min)}+`;
  return `Hingga Rp ${formatNumber(max!)}`;
};

const getTimeAgo = (dateString?: string): string => {
  if (!dateString) return 'Baru saja';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Baru saja';
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
  return `${Math.floor(diffDays / 365)} tahun lalu`;
};

const formatJobType = (jobType: string): string => {
  const types: Record<string, string> = {
    'full_time': 'Full-time',
    'part_time': 'Part-time',
    'contract': 'Kontrak',
    'internship': 'Magang',
    'freelance': 'Freelance',
  };
  return types[jobType] || jobType;
};

const JobCard: React.FC<JobCardProps> = ({ job, index = 0, isApplied = false }) => {
  const companyName = job.company?.name || 'Unknown Company';
  const companyLogoUrl = job.company?.logo_url 
    ? `http://localhost:8081${job.company.logo_url}` 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=667eea&color=fff&size=128`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/lowongan/${job.hashId || job.id}`}>
        <div className={`group bg-card border rounded-xl p-5 hover:shadow-card-hover transition-all duration-300 hover:border-primary/30 ${isApplied ? 'border-green-300 bg-green-50/30' : 'border-border'}`}>
          {/* Applied Badge */}
          {isApplied && (
            <div className="flex items-center gap-1.5 text-green-600 mb-3 -mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Sudah Dilamar</span>
            </div>
          )}
          <div className="flex gap-4">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <img
                src={companyLogoUrl}
                alt={companyName}
                className="w-14 h-14 rounded-xl object-cover bg-muted"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=667eea&color=fff&size=128`;
                }}
              />
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{companyName}</p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-primary" />
                  {formatJobType(job.jobType)}
                </span>
                {job.isRemote && (
                  <span className="flex items-center gap-1.5 text-success">
                    <Wifi className="w-4 h-4" />
                    Remote
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <span className="font-semibold text-primary">
                  {job.isSalaryVisible ? formatSalaryRange(job.salaryMin, job.salaryMax) : 'Gaji Dirahasiakan'}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {getTimeAgo(job.publishedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default JobCard;
