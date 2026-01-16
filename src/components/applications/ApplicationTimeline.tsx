import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Eye,
  Star,
  Calendar,
  CheckCircle,
  Gift,
  Trophy,
  XCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Video,
  ExternalLink,
} from 'lucide-react';
import {
  TimelineEvent,
  ApplicationStatus,
  APPLICATION_STATUS_CONFIG,
  formatTimelineDate,
  formatTimelineTime,
  formatRelativeTime,
} from '@/data/applications';

// ============================================
// TYPES
// ============================================

interface ApplicationTimelineProps {
  timeline: TimelineEvent[];
  currentStatus: ApplicationStatus;
  isCompact?: boolean;
}

// ============================================
// ICON MAP
// ============================================

const StatusIcon: Record<ApplicationStatus, React.ElementType> = {
  submitted: Send,
  viewed: Eye,
  shortlisted: Star,
  interview_scheduled: Calendar,
  interview_completed: CheckCircle,
  offer_extended: Gift,
  hired: Trophy,
  rejected: XCircle,
  withdrawn: LogOut,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getStatusColors(status: ApplicationStatus, isCompleted: boolean, isCurrent: boolean) {
  const config = APPLICATION_STATUS_CONFIG[status];
  
  if (status === 'rejected') {
    return {
      dotBg: 'bg-red-500',
      dotBorder: 'border-red-500',
      lineBg: 'bg-red-200',
      iconColor: 'text-white',
      textColor: 'text-red-600',
    };
  }
  
  if (status === 'hired') {
    return {
      dotBg: 'bg-green-500',
      dotBorder: 'border-green-500',
      lineBg: 'bg-green-200',
      iconColor: 'text-white',
      textColor: 'text-green-600',
    };
  }
  
  if (isCurrent) {
    return {
      dotBg: 'bg-blue-500',
      dotBorder: 'border-blue-500',
      lineBg: 'bg-blue-200',
      iconColor: 'text-white',
      textColor: 'text-blue-600',
    };
  }
  
  if (isCompleted) {
    return {
      dotBg: 'bg-emerald-500',
      dotBorder: 'border-emerald-500',
      lineBg: 'bg-emerald-300',
      iconColor: 'text-white',
      textColor: 'text-emerald-600',
    };
  }
  
  return {
    dotBg: 'bg-gray-200',
    dotBorder: 'border-gray-300',
    lineBg: 'bg-gray-200',
    iconColor: 'text-gray-400',
    textColor: 'text-gray-400',
  };
}

// ============================================
// TIMELINE EVENT COMPONENT
// ============================================

interface TimelineEventItemProps {
  event: TimelineEvent;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
  index: number;
}

function TimelineEventItem({
  event,
  isFirst,
  isLast,
  isCurrent,
  index,
}: TimelineEventItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(isCurrent);
  const config = APPLICATION_STATUS_CONFIG[event.status];
  const colors = getStatusColors(event.status, !isCurrent, isCurrent);
  const Icon = StatusIcon[event.status];
  
  const hasDetails = event.note || event.metadata;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex gap-4"
    >
      {/* Timeline Line & Dot */}
      <div className="flex flex-col items-center">
        {/* Dot with Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
          className={`
            relative z-10 flex items-center justify-center
            w-10 h-10 rounded-full
            ${colors.dotBg} ${colors.dotBorder}
            border-2 shadow-sm
          `}
        >
          <Icon className={`w-5 h-5 ${colors.iconColor}`} />
        </motion.div>
        
        {/* Connecting Line */}
        {!isLast && (
          <div className={`w-0.5 flex-1 min-h-[40px] ${colors.lineBg}`} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
        {/* Header */}
        <div
          className={`
            flex items-start justify-between
            ${hasDetails ? 'cursor-pointer' : ''}
          `}
          onClick={() => hasDetails && setIsExpanded(!isExpanded)}
        >
          <div>
            <h4 className={`font-semibold ${colors.textColor}`}>
              {config.label}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatRelativeTime(event.timestamp)}</span>
              <span className="text-gray-300">•</span>
              <span>{formatTimelineTime(event.timestamp)}</span>
            </div>
          </div>
          
          {hasDetails && (
            <button className="p-1 text-gray-400 hover:text-gray-600">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {isExpanded && hasDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3">
                {/* Note */}
                {event.note && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-700">{event.note}</p>
                  </div>
                )}

                {/* Interview Metadata */}
                {event.metadata?.interviewDate && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">
                        {formatTimelineDate(event.metadata.interviewDate)} • {formatTimelineTime(event.metadata.interviewDate)}
                      </span>
                    </div>
                    
                    {event.metadata.interviewType === 'online' && event.metadata.interviewLink && (
                      <a
                        href={event.metadata.interviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Meeting</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    
                    {event.metadata.interviewType === 'onsite' && event.metadata.interviewLocation && (
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <MapPin className="w-4 h-4" />
                        <span>{event.metadata.interviewLocation}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Rejection Reason */}
                {event.metadata?.rejectionReason && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm text-red-700 font-medium mb-1">Catatan:</p>
                    <p className="text-sm text-red-600">{event.metadata.rejectionReason}</p>
                  </div>
                )}

                {/* Offer Details */}
                {event.metadata?.offerDetails && (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <p className="text-sm text-emerald-700">{event.metadata.offerDetails}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ApplicationTimeline({
  timeline,
  currentStatus,
  isCompact = false,
}: ApplicationTimelineProps) {
  // Sort timeline by timestamp (oldest first for display)
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // For compact mode, show only first and last + current if different
  const displayTimeline = isCompact && sortedTimeline.length > 2
    ? [
        sortedTimeline[0],
        ...sortedTimeline.slice(1, -1).length > 0 ? [{
          id: 'collapsed',
          status: 'submitted' as ApplicationStatus,
          timestamp: '',
          updatedBy: 'system' as const,
          note: `+${sortedTimeline.length - 2} status lainnya`,
        }] : [],
        sortedTimeline[sortedTimeline.length - 1],
      ]
    : sortedTimeline;

  return (
    <div className="relative">
      {displayTimeline.map((event, index) => {
        const isLast = index === displayTimeline.length - 1;
        const isCurrent = event.status === currentStatus && isLast;
        
        // Handle collapsed indicator
        if (event.id === 'collapsed') {
          return (
            <div key="collapsed" className="relative flex gap-4 py-2">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-500 font-medium">...</span>
                </div>
                <div className="w-0.5 flex-1 min-h-[20px] bg-gray-200" />
              </div>
              <div className="flex-1 flex items-center">
                <span className="text-sm text-gray-500">{event.note}</span>
              </div>
            </div>
          );
        }

        return (
          <TimelineEventItem
            key={event.id}
            event={event}
            isFirst={index === 0}
            isLast={isLast}
            isCurrent={isCurrent}
            index={index}
          />
        );
      })}
    </div>
  );
}

export default ApplicationTimeline;
