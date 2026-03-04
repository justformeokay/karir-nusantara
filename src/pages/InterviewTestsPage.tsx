import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { interviewTestsApi } from '@/api/interviewTests';
import type { TestSubmission } from '@/api/interviewTests';
import type { ApiResponse } from '@/api/client';

type MySubmissionsResponse = ApiResponse<TestSubmission[]>;

// ============================================
// STATUS CONFIG
// ============================================

const statusConfig: Record<TestSubmission['status'], { label: string; color: string; bg: string }> = {
  pending: { label: 'Belum Dikerjakan', color: 'text-gray-600', bg: 'bg-gray-100' },
  in_progress: { label: 'Sedang Dikerjakan', color: 'text-amber-700', bg: 'bg-amber-100' },
  submitted: { label: 'Terkirim', color: 'text-blue-700', bg: 'bg-blue-100' },
  completed: { label: 'Selesai', color: 'text-green-700', bg: 'bg-green-100' },
};

// ============================================
// CARD COMPONENT
// ============================================

function SubmissionCard({ submission }: { submission: TestSubmission }) {
  const cfg = statusConfig[submission.status];
  const canTake = submission.status === 'pending' || submission.status === 'in_progress';
  const isCompleted = submission.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 truncate">
              {submission.test?.title ?? `Tes #${submission.id}`}
            </h3>
          </div>

          {submission.test?.description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {submission.test.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* Duration */}
            {submission.test?.duration_minutes && (
              <span className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {submission.test.duration_minutes} menit
              </span>
            )}

            {/* Status badge */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
              {cfg.label}
            </span>

            {/* Score (if completed) */}
            {isCompleted && submission.score !== null && (
              <span className={`flex items-center gap-1 font-semibold ${submission.is_passed ? 'text-green-600' : 'text-red-600'}`}>
                {submission.is_passed
                  ? <CheckCircle className="w-3.5 h-3.5" />
                  : <XCircle className="w-3.5 h-3.5" />}
                {submission.score} / {submission.test?.total_points ?? '-'}
                {submission.percentage !== null && ` (${Math.round(submission.percentage)}%)`}
                {' '}
                {submission.is_passed ? '— Lulus' : '— Tidak Lulus'}
              </span>
            )}
          </div>
        </div>

        {/* Right action */}
        <div className="flex-shrink-0">
          {canTake ? (
            <Link
              to={`/tes-wawancara/${submission.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {submission.status === 'in_progress' ? 'Lanjutkan' : 'Mulai Tes'}
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-500 text-sm font-medium cursor-default">
              {submission.status === 'submitted' ? 'Menunggu Penilaian' : 'Sudah Selesai'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// PAGE
// ============================================

export default function InterviewTestsPage() {
  const { data, isLoading, error, refetch } = useQuery<MySubmissionsResponse>({
    queryKey: ['myInterviewTests'],
    queryFn: () => interviewTestsApi.getMySubmissions() as Promise<MySubmissionsResponse>,
  });

  const submissions: TestSubmission[] = data?.data ?? [];

  const pending = submissions.filter(s => s.status === 'pending' || s.status === 'in_progress');
  const done = submissions.filter(s => s.status === 'submitted' || s.status === 'completed');

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col items-center gap-4 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Memuat tes wawancara...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-gray-700 font-medium">Gagal memuat tes wawancara</p>
          <button
            onClick={() => void refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-20 md:pt-24 pb-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tes Wawancara</h1>
        <p className="text-gray-500 mt-1">
          Tes yang diberikan oleh perusahaan sebagai bagian dari proses seleksi.
        </p>
      </div>

      {/* Empty state */}
      {submissions.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <ClipboardList className="w-14 h-14 text-gray-200" />
          <p className="font-semibold text-gray-700">Belum Ada Tes</p>
          <p className="text-sm text-gray-500">
            Tes wawancara akan muncul di sini setelah perusahaan mengirimkannya kepada kamu.
          </p>
        </div>
      )}

      {/* Pending tests */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-700 border-b pb-2">
            Perlu Dikerjakan ({pending.length})
          </h2>
          {pending.map(s => <SubmissionCard key={s.id} submission={s} />)}
        </div>
      )}

      {/* Completed tests */}
      {done.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-700 border-b pb-2">
            Sudah Dikerjakan ({done.length})
          </h2>
          {done.map(s => <SubmissionCard key={s.id} submission={s} />)}
        </div>
      )}
    </div>
  );
}
