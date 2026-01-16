import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Building2,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Timer,
} from 'lucide-react';
import {
  Application,
  APPLICATION_STATUS_CONFIG,
  formatRelativeTime,
} from '@/data/applications';
import { ApplicationTimeline } from './ApplicationTimeline';

// ============================================
// TYPES
// ============================================

interface ApplicationCardProps {
  application: Application;
  onWithdraw?: (id: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

// ============================================
// STATUS BADGE COMPONENT
// ============================================

function StatusBadge({ status }: { status: Application['currentStatus'] }) {
  const config = APPLICATION_STATUS_CONFIG[status];
  
  const getStatusIcon = () => {
    switch (status) {
      case 'hired':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'rejected':
        return <XCircle className="w-3.5 h-3.5" />;
      case 'interview_scheduled':
        return <Timer className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${config.bgColor} ${config.color}
      `}
    >
      {getStatusIcon()}
      {config.label}
    </span>
  );
}

// ============================================
// PROGRESS INDICATOR
// ============================================

function ProgressIndicator({ application }: { application: Application }) {
  const { timeline, currentStatus } = application;
  const currentConfig = APPLICATION_STATUS_CONFIG[currentStatus];
  
  // Calculate progress based on status order
  const maxOrder = Math.max(
    ...Object.values(APPLICATION_STATUS_CONFIG)
      .filter(c => !c.isTerminal || currentStatus === 'hired')
      .map(c => c.order)
  );
  const currentOrder = currentConfig.order;
  const progress = (currentOrder / (currentStatus === 'hired' ? 7 : 6)) * 100;

  return (
    <div className="w-full">
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`
            h-full rounded-full
            ${currentStatus === 'rejected' ? 'bg-red-400' : 
              currentStatus === 'hired' ? 'bg-green-500' : 'bg-blue-500'}
          `}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">
          {timeline.length} tahap selesai
        </span>
        <span className="text-xs text-gray-500">
          {currentConfig.isTerminal ? 'Selesai' : 'Dalam proses'}
        </span>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ApplicationCard({
  application,
  onWithdraw,
  isExpanded = false,
  onToggleExpand,
}: ApplicationCardProps) {
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const { job, currentStatus, appliedAt, timeline, isActive, daysInCurrentStatus } = application;
  const config = APPLICATION_STATUS_CONFIG[currentStatus];

  const handleWithdraw = () => {
    if (onWithdraw) {
      onWithdraw(application.id);
      setShowWithdrawConfirm(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white rounded-xl border shadow-sm overflow-hidden
        transition-shadow duration-200
        ${isExpanded ? 'shadow-lg border-blue-200' : 'hover:shadow-md border-gray-200'}
      `}
    >
      {/* Card Header */}
      <div className="p-4 sm:p-5">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <Building2 className="w-7 h-7 text-gray-400" />
              )}
            </div>
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  to={`/lowongan/${job.id}`}
                  className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                >
                  {job.title}
                </Link>
                <p className="text-sm text-gray-600 mt-0.5">{job.company}</p>
              </div>
              <StatusBadge status={currentStatus} />
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {job.type}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Dilamar {formatRelativeTime(appliedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4">
          <ProgressIndicator application={application} />
        </div>

        {/* Days in Current Status Warning */}
        {isActive && daysInCurrentStatus > 7 && (
          <div className="mt-3 flex items-start gap-2 p-2.5 bg-amber-50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Status ini sudah {daysInCurrentStatus} hari. Perusahaan mungkin masih memproses lamaran Anda.
            </p>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={onToggleExpand}
          className="w-full mt-4 flex items-center justify-center gap-1 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span>{isExpanded ? 'Tutup Timeline' : 'Lihat Timeline'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expanded Content - Timeline */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 border-t border-gray-100 bg-gray-50">
              <div className="py-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Riwayat Lamaran
                </h3>
                <ApplicationTimeline
                  timeline={timeline}
                  currentStatus={currentStatus}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
                <Link
                  to={`/lowongan/${job.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Lihat Detail Lowongan
                </Link>

                {isActive && onWithdraw && (
                  <>
                    <div className="w-px h-4 bg-gray-300" />
                    {showWithdrawConfirm ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Yakin batalkan?</span>
                        <button
                          onClick={handleWithdraw}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Ya, Batalkan
                        </button>
                        <button
                          onClick={() => setShowWithdrawConfirm(false)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Tidak
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowWithdrawConfirm(true)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Batalkan Lamaran
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ApplicationCard;
