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
  Calendar,
  Video,
  Phone,
  User,
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
                  to={`/lowongan/${job.hashId || job.id}`}
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
                {job.jobType}
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

        {/* Interview Information - Show when status is interview_scheduled */}
        {currentStatus === 'interview_scheduled' && timeline.length > 0 && (() => {
          // Find the interview_scheduled event with metadata
          const interviewEvent = timeline.find(
            evt => evt.status === 'interview_scheduled' && evt.metadata
          );
          
          // Also try to find interview event without metadata but with any info
          const fallbackEvent = !interviewEvent ? timeline.find(
            evt => evt.status === 'interview_scheduled'
          ) : null;
          
          const eventToUse = interviewEvent || fallbackEvent;
          if (!eventToUse) return null;
          
          const metadata = eventToUse.metadata;
          const hasInterviewDate = metadata?.interviewDate;
          const interviewDate = hasInterviewDate ? new Date(metadata.interviewDate!) : null;
          const now = new Date();
          const daysUntilInterview = interviewDate ? Math.ceil((interviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
          
          // Check if there's any useful information to show
          const hasUsefulInfo = hasInterviewDate || 
            metadata?.interviewType || 
            metadata?.interviewLocation || 
            metadata?.interviewLink || 
            metadata?.contactPerson || 
            metadata?.contactPhone ||
            metadata?.scheduledNotes ||
            metadata?.notificationMethod;
          
          // If notification method is WhatsApp but no date, show pending notification message
          const isWhatsAppNotification = metadata?.notificationMethod === 'whatsapp';
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 space-y-3"
            >
              <h4 className="font-semibold text-blue-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {hasInterviewDate ? 'Jadwal Interview Anda' : 'Informasi Interview'}
              </h4>
              
              {/* Interview Date & Time - only show if available */}
              {interviewDate && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-900">
                      {interviewDate.toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} pukul {interviewDate.toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  {daysUntilInterview !== null && daysUntilInterview > 0 && (
                    <p className="text-xs text-blue-600 ml-6">
                      ({daysUntilInterview} hari lagi)
                    </p>
                  )}
                  {daysUntilInterview !== null && daysUntilInterview === 0 && (
                    <p className="text-xs text-orange-600 ml-6 font-semibold">
                      🔔 Hari ini!
                    </p>
                  )}
                  {daysUntilInterview !== null && daysUntilInterview < 0 && (
                    <p className="text-xs text-gray-500 ml-6">
                      (Interview sudah berlalu)
                    </p>
                  )}
                </div>
              )}
              
              {/* Pending notification message for WhatsApp notification */}
              {isWhatsAppNotification && !hasInterviewDate && (
                <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                  <Phone className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-800 font-medium">Notifikasi via WhatsApp</p>
                    <p className="text-xs text-green-600 mt-0.5">
                      Detail jadwal interview akan dikirimkan melalui WhatsApp. Pastikan nomor telepon Anda aktif.
                    </p>
                  </div>
                </div>
              )}
              
              {/* No date yet message */}
              {!hasInterviewDate && !isWhatsAppNotification && !hasUsefulInfo && (
                <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800">Menunggu Konfirmasi Jadwal</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      Perusahaan akan segera menghubungi Anda untuk konfirmasi jadwal interview.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Interview Type & Link/Location */}
              {metadata?.interviewType === 'online' && metadata?.interviewLink ? (
                <div className="flex items-start gap-2">
                  <Video className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 font-medium">Interview Online via {metadata.interviewLink.includes('zoom') ? 'Zoom' : metadata.interviewLink.includes('meet.google') ? 'Google Meet' : metadata?.meetingPlatform || 'Video Conference'}</p>
                    <a
                      href={metadata.interviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium mt-1"
                    >
                      <span>Buka Tautan</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : metadata?.interviewType === 'onsite' && metadata?.interviewLocation ? (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 font-medium">Lokasi Interview Offline</p>
                    <p className="text-sm text-blue-900 mt-1">{metadata.interviewLocation}</p>
                  </div>
                </div>
              ) : null}
              
              {/* Contact Information */}
              {(metadata?.contactPerson || metadata?.contactPhone) && (
                <div className="pt-2 border-t border-blue-200 space-y-2">
                  {metadata?.contactPerson && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-900">
                        <span className="font-medium">Kontak: </span>{metadata.contactPerson}
                      </span>
                    </div>
                  )}
                  {metadata?.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <a
                        href={`tel:${metadata.contactPhone}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {metadata.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              {/* Additional Notes */}
              {metadata?.scheduledNotes && (
                <div className="pt-2 border-t border-blue-200 text-sm text-blue-800">
                  <p className="text-xs text-blue-600 font-medium mb-1">📝 Catatan:</p>
                  <p>{metadata.scheduledNotes}</p>
                </div>
              )}
            </motion.div>
          );
        })()}

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
                  to={`/lowongan/${job.hashId || job.id}`}
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
