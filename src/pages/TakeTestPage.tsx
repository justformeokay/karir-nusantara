import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Send,
  Lock,
} from 'lucide-react';
import { interviewTestsApi } from '@/api/interviewTests';
import { TestSessionGuard } from '@/components/test/TestSessionGuard';
import type { TestForSubmission, SubmitAnswerPayload, InterviewQuestion, TestSubmission } from '@/api/interviewTests';
import type { ApiResponse } from '@/api/client';

type TestForSubmissionResponse = ApiResponse<TestForSubmission>;

// ============================================
// LOCALSTORAGE HELPERS
// ============================================

const getTestProgressKey = (submissionId: number) => `test_progress_${submissionId}`;

function saveTestProgress(submissionId: number, data: {
  currentIndex: number;
  answers: Array<[number, SubmitAnswerPayload]>;
}) {
  try {
    localStorage.setItem(getTestProgressKey(submissionId), JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save test progress:', e);
  }
}

function loadTestProgress(submissionId: number) {
  try {
    const data = localStorage.getItem(getTestProgressKey(submissionId));
    if (data) {
      const parsed = JSON.parse(data);
      return {
        currentIndex: parsed.currentIndex ?? 0,
        answers: new Map(parsed.answers ?? []),
      };
    }
  } catch (e) {
    console.warn('Failed to load test progress:', e);
  }
  return null;
}

function clearTestProgress(submissionId: number) {
  try {
    localStorage.removeItem(getTestProgressKey(submissionId));
  } catch (e) {
    console.warn('Failed to clear test progress:', e);
  }
}

// ============================================
// TIMER HOOK
// ============================================

function useCountdown(totalSeconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (totalSeconds <= 0) return;
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isLow = remaining <= 60;

  return { minutes, seconds, isLow };
}

// ============================================
// RESULT MODAL
// ============================================

interface ResultModalProps {
  score: number | null;
  percentage: number | null;
  isPassed: boolean | null;
  totalPoints: number;
  onClose: () => void;
}

function ResultModal({ score, percentage, isPassed, totalPoints, onClose }: ResultModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center"
      >
        {isPassed !== null ? (
          isPassed ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )
        ) : (
          <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {isPassed === null ? 'Tes Terkirim!' :
           isPassed ? 'Selamat, Kamu Lulus!' :
           'Belum Lulus'}
        </h2>

        {score !== null ? (
          <>
            <p className="text-5xl font-bold my-4 text-gray-800">
              {score}
              <span className="text-2xl text-gray-400"> / {totalPoints}</span>
            </p>
            {percentage !== null && (
              <p className="text-lg text-gray-500 mb-2">{Math.round(percentage)}%</p>
            )}
          </>
        ) : (
          <p className="text-gray-600 my-4">
            Jawabanmu telah dikirim. Perusahaan akan menilai jawabanmu segera.
          </p>
        )}

        {isPassed !== null && (
          <p className="text-sm text-gray-500 mb-6">
            {isPassed
              ? 'Hasil tesmu sudah direkam. Perusahaan akan menghubungimu untuk tahap selanjutnya.'
              : 'Jangan menyerah! Tetap semangat dalam proses seleksimu.'}
          </p>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Kembali ke Daftar Tes
        </button>
      </motion.div>
    </div>
  );
}

// ============================================
// QUESTION CARD
// ============================================

interface QuestionCardProps {
  question: InterviewQuestion;
  index: number;
  total: number;
  selectedOptionId?: number;
  essayText?: string;
  onSelectOption: (optionId: number) => void;
  onEssayChange: (text: string) => void;
}

function QuestionCard({
  question, index, total,
  selectedOptionId, essayText,
  onSelectOption, onEssayChange,
}: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-5"
    >
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
        <span>Soal {index + 1} dari {total}</span>
        <span className="font-medium">{question.points} poin</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question text */}
      <p className="text-base font-medium text-gray-900 leading-relaxed">
        {question.question_text}
      </p>

      {/* Multiple choice */}
      {question.question_type === 'multiple_choice' && question.options && (
        <div className="space-y-2.5">
          {question.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => onSelectOption(opt.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                selectedOptionId === opt.id
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
              }`}
            >
              {opt.option_text}
            </button>
          ))}
        </div>
      )}

      {/* Essay */}
      {question.question_type === 'essay' && (
        <textarea
          value={essayText ?? ''}
          onChange={e => onEssayChange(e.target.value)}
          placeholder="Tulis jawabanmu di sini..."
          rows={5}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
        />
      )}
    </motion.div>
  );
}

// ============================================
// PAGE
// ============================================

export default function TakeTestPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  // Restore from localStorage or initialize
  const savedProgress = useMemo(() => 
    loadTestProgress(Number(submissionId)), 
    [submissionId]
  );

  const [currentIndex, setCurrentIndex] = useState(savedProgress?.currentIndex ?? 0);
  const [answers, setAnswers] = useState<Map<number, SubmitAnswerPayload>>(
    savedProgress?.answers ?? new Map()
  );
  const [showResult, setShowResult] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    score: number | null;
    percentage: number | null;
    isPassed: boolean | null;
    totalPoints: number;
  } | null>(null);
  const [testActive, setTestActive] = useState(true);

  // Fetch test content
  const { data, isLoading, error } = useQuery<TestForSubmissionResponse>({
    queryKey: ['testForSubmission', submissionId],
    queryFn: () => interviewTestsApi.getTestForSubmission(Number(submissionId)) as Promise<TestForSubmissionResponse>,
    enabled: !!submissionId,
    staleTime: Infinity, // Don't refetch mid-test
  });

  const testData = data?.data;
  const test = testData?.test;
  const questions: InterviewQuestion[] = test?.questions ?? [];
  const currentQuestion = questions[currentIndex];

  // Update mutation
  const submitMutation = useMutation({
    mutationFn: (payload: SubmitAnswerPayload[]) =>
      interviewTestsApi.submitAnswers(Number(submissionId), { answers: payload }),
    onSuccess: (res: ApiResponse<TestSubmission>) => {
      const sub = res.data;
      setSubmitResult({
        score: sub?.score ?? null,
        percentage: sub?.percentage ?? null,
        isPassed: sub?.is_passed ?? null,
        totalPoints: test?.total_points ?? 0,
      });
      setShowResult(true);
      setTestActive(false);
      clearTestProgress(Number(submissionId));
    },
    onError: () => {
      alert('Gagal mengirim jawaban. Silakan coba lagi.');
    },
  });

  // Auto-save progress every time answers change
  useEffect(() => {
    if (submissionId && answers.size > 0) {
      saveTestProgress(Number(submissionId), {
        currentIndex,
        answers: Array.from(answers.entries()),
      });
    }
  }, [answers, currentIndex, submissionId]);

  const handleSubmit = useCallback(() => {
    if (!testActive) return;
    const payload = Array.from(answers.values());
    submitMutation.mutate(payload);
  }, [answers, submitMutation, testActive]);

  // Timer expiry → auto-submit
  const handleTimerExpire = useCallback(() => {
    if (!submitMutation.isPending && !showResult && testActive) {
      handleSubmit();
      setTestActive(false);
    }
  }, [handleSubmit, submitMutation.isPending, showResult, testActive]);

  const { minutes, seconds, isLow } = useCountdown(
    (test?.duration_minutes ?? 0) * 60,
    handleTimerExpire,
  );

  // Answer setters
  const setOptionAnswer = (questionId: number, optionId: number) => {
    setAnswers(prev => new Map(prev).set(questionId, {
      question_id: questionId,
      question_type: 'multiple_choice',
      selected_option_id: optionId,
    }));
  };

  const setEssayAnswer = (questionId: number, text: string) => {
    setAnswers(prev => new Map(prev).set(questionId, {
      question_id: questionId,
      question_type: 'essay',
      answer_text: text,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Memuat soal tes...</p>
      </div>
    );
  }

  if (error || !testData || questions.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 flex flex-col items-center gap-3 text-center">
        <AlertTriangle className="w-10 h-10 text-red-500" />
        <p className="font-medium text-gray-800">Tes tidak dapat dimuat</p>
        <p className="text-sm text-gray-500">
          {testData?.status === 'completed' || testData?.status === 'submitted'
            ? 'Kamu sudah mengerjakan tes ini.'
            : 'Tidak dapat mengakses tes saat ini.'}
        </p>
        <button
          onClick={() => navigate('/tes-wawancara')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Kembali ke Daftar Tes
        </button>
      </div>
    );
  }

  const answeredCount = answers.size;

  return (
    <TestSessionGuard isActive={testActive}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header bar - Improved with lock indicator */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-amber-600" />
              <h1 className="font-bold text-xl text-gray-900 line-clamp-1">{test?.title}</h1>
            </div>
            <p className="text-sm text-gray-500">{answeredCount} dari {questions.length} soal dijawab</p>
          </div>
          {test && test.duration_minutes > 0 && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-semibold text-sm ${
              isLow ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-50 text-blue-700'
            }`}>
              <Clock className="w-4 h-4" />
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          )}
        </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 min-h-[360px]">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              index={currentIndex}
              total={questions.length}
              selectedOptionId={answers.get(currentQuestion.id)?.selected_option_id}
              essayText={answers.get(currentQuestion.id)?.answer_text}
              onSelectOption={optId => setOptionAnswer(currentQuestion.id, optId)}
              onEssayChange={text => setEssayAnswer(currentQuestion.id, text)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-medium hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </button>

        {/* Question dots */}
        <div className="flex gap-1.5 flex-wrap justify-center">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-7 h-7 rounded-full text-xs font-medium transition-colors ${
                i === currentIndex
                  ? 'bg-blue-600 text-white'
                  : answers.has(q.id)
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-60"
          >
            {submitMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Kirim Jawaban
          </button>
        )}
      </div>

      {/* Unanswered warning */}
      {answeredCount < questions.length && (
        <p className="text-xs text-amber-600 text-center mt-3 flex items-center justify-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          {questions.length - answeredCount} soal belum dijawab
        </p>
      )}

      {/* Result modal */}
      {showResult && submitResult && (
        <ResultModal
          {...submitResult}
          onClose={() => navigate('/tes-wawancara')}
        />
      )}
      </div>
    </TestSessionGuard>
  );
}
