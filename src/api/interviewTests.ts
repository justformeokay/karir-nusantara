import { api } from './client';

// ============================================
// TYPES
// ============================================

export interface QuestionOption {
  id: number;
  option_text: string;
  order: number;
}

export interface InterviewQuestion {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'essay';
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
  options?: QuestionOption[];
}

export interface InterviewTestSummary {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_points: number;
  passing_score: number;
}

export interface TestSubmission {
  id: number;
  status: 'pending' | 'in_progress' | 'submitted' | 'completed';
  score: number | null;
  percentage: number | null;
  is_passed: boolean | null;
  started_at: string | null;
  submitted_at: string | null;
  application_id: number | null;
  test: InterviewTestSummary;
}

export interface TestForSubmission {
  submission_id: number;
  status: string;
  test: InterviewTestSummary & { questions?: InterviewQuestion[] };
}

export interface SubmitAnswerPayload {
  question_id: number;
  question_type: 'multiple_choice' | 'essay';
  selected_option_id?: number;
  answer_text?: string;
}

export interface SubmitAnswersPayload {
  answers: SubmitAnswerPayload[];
}

// ============================================
// API
// ============================================

export const interviewTestsApi = {
  // Get all test submissions assigned to logged-in job seeker
  getMySubmissions: () =>
    api.get<TestSubmission[]>('/jobseeker/interview-tests'),

  // Get a single test content (for taking the test)
  getTestForSubmission: (submissionId: number) =>
    api.get<TestForSubmission>(`/jobseeker/interview-tests/${submissionId}`),

  // Submit answers
  submitAnswers: (submissionId: number, payload: SubmitAnswersPayload) =>
    api.post<TestSubmission>(`/jobseeker/interview-tests/${submissionId}/submit`, payload),
};
