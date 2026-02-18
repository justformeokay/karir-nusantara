# 🏗️ Interview Test Feature - Implementation Examples & Boilerplate

**Purpose**: Code examples & boilerplate for developers to use as starting point  
**Language**: Go (Backend), TypeScript/React (Frontend)  

---

## Backend Go - Module Boilerplate

### 1. Entity Models (entity.go)

```go
// internal/modules/interview_tests/entity.go
package interview_tests

import (
	"database/sql"
	"time"
)

// Constants for test types
const (
	TestTypeMultipleChoice = "multiple_choice"
	TestTypeEssay          = "essay"
	TestTypeShortAnswer    = "short_answer"
	TestTypeVideo          = "video"
	TestTypePuzzle         = "puzzle"
)

// Constants for submission status
const (
	SubmissionStatusNotStarted = "not_started"
	SubmissionStatusInProgress = "in_progress"
	SubmissionStatusSubmitted  = "submitted"
	SubmissionStatusGraded     = "graded"
)

// InterviewTest represents job interview test configuration
type InterviewTest struct {
	ID                  uint64         `db:"id" json:"id"`
	JobID               uint64         `db:"job_id" json:"job_id"`
	CompanyID           uint64         `db:"company_id" json:"company_id"`
	TestType            string         `db:"test_type" json:"test_type"`
	Title               string         `db:"title" json:"title"`
	Description         sql.NullString `db:"description" json:"description,omitempty"`
	Instructions        sql.NullString `db:"instructions" json:"instructions,omitempty"`
	TimeLimitMinutes    int            `db:"time_limit_minutes" json:"time_limit_minutes"`
	PassingScore        int            `db:"passing_score" json:"passing_score"`
	MaxAttempts         int            `db:"max_attempts" json:"max_attempts"`
	ShowScoreImmediately bool           `db:"show_score_immediately" json:"show_score_immediately"`
	Enabled             bool           `db:"enabled" json:"enabled"`
	CreatedAt           time.Time      `db:"created_at" json:"created_at"`
	UpdatedAt           time.Time      `db:"updated_at" json:"updated_at"`
}

// InterviewQuestion represents a question in a test
type InterviewQuestion struct {
	ID              uint64         `db:"id" json:"id"`
	TestID          uint64         `db:"test_id" json:"test_id"`
	QuestionText    string         `db:"question_text" json:"question_text"`
	QuestionType    string         `db:"question_type" json:"question_type"`
	Options         sql.NullString `db:"options" json:"options,omitempty"` // JSON string
	CorrectAnswer   sql.NullString `db:"correct_answer" json:"correct_answer,omitempty"`
	SampleAnswer    sql.NullString `db:"sample_answer" json:"sample_answer,omitempty"`
	AnswerGuidelines sql.NullString `db:"answer_guidelines" json:"answer_guidelines,omitempty"`
	Points          int            `db:"points" json:"points"`
	OrderIndex      int            `db:"order_index" json:"order_index"`
	CreatedAt       time.Time      `db:"created_at" json:"created_at"`
	UpdatedAt       time.Time      `db:"updated_at" json:"updated_at"`
}

// TestSubmission represents an applicant's test submission
type TestSubmission struct {
	ID               uint64         `db:"id" json:"id"`
	ApplicationID    uint64         `db:"application_id" json:"application_id"`
	TestID           uint64         `db:"test_id" json:"test_id"`
	AttemptNumber    int            `db:"attempt_number" json:"attempt_number"`
	Status           string         `db:"status" json:"status"`
	StartedAt        *time.Time     `db:"started_at" json:"started_at,omitempty"`
	SubmittedAt      *time.Time     `db:"submitted_at" json:"submitted_at,omitempty"`
	GradedAt         *time.Time     `db:"graded_at" json:"graded_at,omitempty"`
	TimeSpentSeconds int            `db:"time_spent_seconds" json:"time_spent_seconds"`
	TotalScore       int            `db:"total_score" json:"total_score"`
	PassingScore     int            `db:"passing_score" json:"passing_score"`
	IsPassed         bool           `db:"is_passed" json:"is_passed"`
	CreatedAt        time.Time      `db:"created_at" json:"created_at"`
	UpdatedAt        time.Time      `db:"updated_at" json:"updated_at"`
}

// TestResponse represents individual question response
type TestResponse struct {
	ID           uint64         `db:"id" json:"id"`
	SubmissionID uint64         `db:"submission_id" json:"submission_id"`
	QuestionID   uint64         `db:"question_id" json:"question_id"`
	AnswerText   sql.NullString `db:"answer_text" json:"answer_text,omitempty"`
	AnswerVideoURL sql.NullString `db:"answer_video_url" json:"answer_video_url,omitempty"`
	IsAutoGraded bool           `db:"is_auto_graded" json:"is_auto_graded"`
	IsCorrect    sql.NullBool   `db:"is_correct" json:"is_correct,omitempty"`
	PointsEarned int            `db:"points_earned" json:"points_earned"`
	MaxPoints    int            `db:"max_points" json:"max_points"`
	GradingNotes sql.NullString `db:"grading_notes" json:"grading_notes,omitempty"`
	GradedByType sql.NullString `db:"graded_by_type" json:"graded_by_type,omitempty"`
	GradedByID   sql.NullInt64  `db:"graded_by_id" json:"graded_by_id,omitempty"`
	GradedAt     *time.Time     `db:"graded_at" json:"graded_at,omitempty"`
	CreatedAt    time.Time      `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time      `db:"updated_at" json:"updated_at"`
}

// DTO: Create Test Request
type CreateTestRequest struct {
	TestType             string `json:"test_type" validate:"required,oneof=multiple_choice essay short_answer video puzzle"`
	Title                string `json:"title" validate:"required,min=3,max=255"`
	Description          string `json:"description,omitempty"`
	Instructions         string `json:"instructions,omitempty"`
	TimeLimitMinutes     int    `json:"time_limit_minutes" validate:"required,min=5,max=480"`
	PassingScore         int    `json:"passing_score" validate:"required,min=0,max=100"`
	MaxAttempts          int    `json:"max_attempts" validate:"required,min=1,max=10"`
	ShowScoreImmediately bool   `json:"show_score_immediately"`
}

// DTO: Update Test Request
type UpdateTestRequest struct {
	Title                *string `json:"title,omitempty"`
	Description          *string `json:"description,omitempty"`
	Instructions         *string `json:"instructions,omitempty"`
	TimeLimitMinutes     *int    `json:"time_limit_minutes,omitempty"`
	PassingScore         *int    `json:"passing_score,omitempty"`
	MaxAttempts          *int    `json:"max_attempts,omitempty"`
	ShowScoreImmediately *bool   `json:"show_score_immediately,omitempty"`
	Enabled              *bool   `json:"enabled,omitempty"`
}

// DTO: Create Question Request
type CreateQuestionRequest struct {
	QuestionText     string      `json:"question_text" validate:"required,min=5"`
	QuestionType     string      `json:"question_type" validate:"required,oneof=multiple_choice essay short_answer video"`
	Options          []QuestionOption `json:"options,omitempty"`
	CorrectAnswer    string      `json:"correct_answer,omitempty"`
	SampleAnswer     string      `json:"sample_answer,omitempty"`
	AnswerGuidelines string      `json:"answer_guidelines,omitempty"`
	Points           int         `json:"points" validate:"min=1,max=100"`
	OrderIndex       int         `json:"order_index" validate:"required,min=0"`
}

// DTO: Question Option
type QuestionOption struct {
	ID   string `json:"id" validate:"required"`
	Text string `json:"text" validate:"required"`
}

// DTO: Save Answer Request
type SaveAnswerRequest struct {
	QuestionID  uint64 `json:"question_id" validate:"required"`
	AnswerText  string `json:"answer_text,omitempty"`
	AnswerVideo string `json:"answer_video_url,omitempty"`
}

// DTO: Submit Test Request
type SubmitTestRequest struct {
	Responses []SaveAnswerRequest `json:"responses"`
}
```

### 2. Repository Pattern (repository.go - simplified)

```go
// internal/modules/interview_tests/repository.go
package interview_tests

import (
	"context"
	"database/sql"
	"fmt"
)

type Repository interface {
	// Test operations
	CreateTest(ctx context.Context, test *InterviewTest) error
	GetTestByID(ctx context.Context, testID uint64) (*InterviewTest, error)
	GetTestByJobID(ctx context.Context, jobID uint64) (*InterviewTest, error)
	UpdateTest(ctx context.Context, testID uint64, updates *UpdateTestRequest) error
	DeleteTest(ctx context.Context, testID uint64) error
	ListJobTests(ctx context.Context, jobID uint64) ([]*InterviewTest, error)

	// Question operations
	CreateQuestion(ctx context.Context, q *InterviewQuestion) error
	GetQuestion(ctx context.Context, questionID uint64) (*InterviewQuestion, error)
	ListTestQuestions(ctx context.Context, testID uint64) ([]*InterviewQuestion, error)
	UpdateQuestion(ctx context.Context, questionID uint64, q *InterviewQuestion) error
	DeleteQuestion(ctx context.Context, questionID uint64) error
	ReorderQuestions(ctx context.Context, testID uint64, orders map[uint64]int) error

	// Submission operations
	CreateSubmission(ctx context.Context, sub *TestSubmission) error
	GetSubmission(ctx context.Context, submissionID uint64) (*TestSubmission, error)
	GetSubmissionByApplicationID(ctx context.Context, appID uint64) (*TestSubmission, error)
	UpdateSubmissionStatus(ctx context.Context, submissionID uint64, status string) error
	UpdateSubmissionScore(ctx context.Context, submissionID uint64, score int, isPassed bool) error

	// Response operations
	CreateResponse(ctx context.Context, resp *TestResponse) error
	GetResponse(ctx context.Context, responseID uint64) (*TestResponse, error)
	ListSubmissionResponses(ctx context.Context, submissionID uint64) ([]*TestResponse, error)
	UpdateResponse(ctx context.Context, responseID uint64, resp *TestResponse) error
}

// MySQL implementation
type mysqlRepository struct {
	db *sql.DB
}

func NewMySQLRepository(db *sql.DB) Repository {
	return &mysqlRepository{db: db}
}

// CreateTest implements Repository
func (r *mysqlRepository) CreateTest(ctx context.Context, test *InterviewTest) error {
	query := `
	INSERT INTO job_interview_tests (
		job_id, company_id, test_type, title, description,
		instructions, time_limit_minutes, passing_score,
		max_attempts, show_score_immediately, enabled
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := r.db.ExecContext(ctx, query,
		test.JobID, test.CompanyID, test.TestType, test.Title,
		test.Description, test.Instructions, test.TimeLimitMinutes,
		test.PassingScore, test.MaxAttempts,
		test.ShowScoreImmediately, test.Enabled,
	)

	if err != nil {
		return fmt.Errorf("failed to create test: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get insert id: %w", err)
	}

	test.ID = uint64(id)
	return nil
}

// CreateSubmission implements Repository
func (r *mysqlRepository) CreateSubmission(ctx context.Context, sub *TestSubmission) error {
	query := `
	INSERT INTO test_submissions (
		application_id, test_id, attempt_number, status, passing_score
	) VALUES (?, ?, ?, ?, ?)
	`

	result, err := r.db.ExecContext(ctx, query,
		sub.ApplicationID, sub.TestID, sub.AttemptNumber,
		sub.Status, sub.PassingScore,
	)

	if err != nil {
		return fmt.Errorf("failed to create submission: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get insert id: %w", err)
	}

	sub.ID = uint64(id)
	return nil
}

// Add other methods...
```

### 3. Service Layer (service.go - simplified)

```go
// internal/modules/interview_tests/service.go
package interview_tests

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"
)

type Service interface {
	// Test setup
	CreateTest(ctx context.Context, jobID, companyID uint64, req *CreateTestRequest) (*InterviewTest, error)
	UpdateTest(ctx context.Context, testID, companyID uint64, req *UpdateTestRequest) (*InterviewTest, error)
	DeleteTest(ctx context.Context, testID, companyID uint64) error
	GetTest(ctx context.Context, testID uint64) (*InterviewTest, error)

	// Question management
	CreateQuestion(ctx context.Context, testID, companyID uint64, req *CreateQuestionRequest) (*InterviewQuestion, error)
	GetTestQuestions(ctx context.Context, testID uint64) ([]*InterviewQuestion, error)
	UpdateQuestion(ctx context.Context, questionID, companyID uint64, req *CreateQuestionRequest) (*InterviewQuestion, error)
	DeleteQuestion(ctx context.Context, questionID, companyID uint64) error

	// Test submission
	StartTest(ctx context.Context, applicationID, userID uint64) (*TestSubmission, []*InterviewQuestion, error)
	SaveAnswer(ctx context.Context, submissionID uint64, req *SaveAnswerRequest) error
	SubmitTest(ctx context.Context, submissionID uint64, req *SubmitTestRequest) (*TestSubmission, error)

	// Results
	GetTestResults(ctx context.Context, submissionID uint64) (*TestSubmission, []*TestResponse, error)
}

type service struct {
	repo Repository
	// Inject other dependencies: logger, emailService, etc
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

// CreateTest implements Service
func (s *service) CreateTest(ctx context.Context, jobID, companyID uint64, req *CreateTestRequest) (*InterviewTest, error) {
	// 1. Verify company owns the job (check with job service)
	// 2. Check if test already exists for this job
	existingTest, _ := s.repo.GetTestByJobID(ctx, jobID)
	if existingTest != nil {
		return nil, errors.New("test already exists for this job")
	}

	// 3. Create test
	test := &InterviewTest{
		JobID:               jobID,
		CompanyID:           companyID,
		TestType:            req.TestType,
		Title:               req.Title,
		Description:         nullifyString(req.Description),
		Instructions:        nullifyString(req.Instructions),
		TimeLimitMinutes:    req.TimeLimitMinutes,
		PassingScore:        req.PassingScore,
		MaxAttempts:         req.MaxAttempts,
		ShowScoreImmediately: req.ShowScoreImmediately,
		Enabled:             true,
		CreatedAt:           time.Now(),
		UpdatedAt:           time.Now(),
	}

	if err := s.repo.CreateTest(ctx, test); err != nil {
		return nil, err
	}

	// 4. Create timeline event: "test_required"
	// s.createTimelineEvent(ctx, jobID, "test_required", ...)

	// 5. Send notification to applicants
	// s.emailService.NotifyApplicantsTestRequired(...)

	return test, nil
}

// StartTest implements Service
func (s *service) StartTest(ctx context.Context, applicationID, userID uint64) (*TestSubmission, []*InterviewQuestion, error) {
	// 1. Get application & check if user owns it
	// app, err := s.appService.GetApplication(ctx, applicationID, userID)
	// if err != nil { return nil, nil, err }

	// 2. Get test from job
	// test, err := s.repo.GetTestByJobID(ctx, app.JobID)
	// if err != nil { return nil, nil, err }

	// 3. Check if already submitted max attempts
	// existingSub, _ := s.repo.GetSubmissionByApplicationID(ctx, applicationID)
	// if existingSub && existingSub.AttemptNumber >= test.MaxAttempts {
	// 	return nil, nil, errors.New("max attempts reached")
	// }

	// 4. Create new submission
	submission := &TestSubmission{
		ApplicationID: applicationID,
		TestID:        0, // from test lookup
		AttemptNumber: 1, // or increment from existing
		Status:        SubmissionStatusInProgress,
		StartedAt:     ptrTime(time.Now()),
		PassingScore:  0, // from test
	}

	if err := s.repo.CreateSubmission(ctx, submission); err != nil {
		return nil, nil, err
	}

	// 5. Get questions
	questions, err := s.repo.ListTestQuestions(ctx, submission.TestID)
	if err != nil {
		return nil, nil, err
	}

	// 6. Create timeline event
	// s.createTimelineEvent(ctx, applicationID, "test_started", ...)

	return submission, questions, nil
}

// SubmitTest implements Service
func (s *service) SubmitTest(ctx context.Context, submissionID uint64, req *SubmitTestRequest) (*TestSubmission, error) {
	// 1. Get submission
	submission, err := s.repo.GetSubmission(ctx, submissionID)
	if err != nil {
		return nil, err
	}

	// 2. Process all responses
	totalScore := 0
	for _, resp := range req.Responses {
		// Auto-grade based on question type
		question, _ := s.repo.GetQuestion(ctx, resp.QuestionID)
		points := s.gradeQuestion(question, resp.AnswerText)
		totalScore += points

		// Save response
		testResp := &TestResponse{
			SubmissionID: submissionID,
			QuestionID:   resp.QuestionID,
			AnswerText:   nullifyString(resp.AnswerText),
			MaxPoints:    question.Points,
			PointsEarned: points,
		}

		if question.QuestionType == TestTypeMultipleChoice {
			testResp.IsAutoGraded = true
			testResp.IsCorrect = ptrBool(resp.AnswerText == question.CorrectAnswer.String)
		} else {
			testResp.IsAutoGraded = false // Manual review later
		}

		s.repo.CreateResponse(ctx, testResp)
	}

	// 3. Determine pass/fail
	test, _ := s.repo.GetTest(ctx, submission.TestID)
	isPassed := totalScore >= test.PassingScore

	// 4. Update submission with results
	submission.Status = SubmissionStatusGraded
	submission.SubmittedAt = ptrTime(time.Now())
	submission.GradedAt = ptrTime(time.Now())
	submission.TotalScore = totalScore
	submission.IsPassed = isPassed

	s.repo.UpdateSubmissionScore(ctx, submissionID, totalScore, isPassed)

	// 5. Create timeline events
	status := "test_passed"
	if !isPassed {
		status = "test_failed"
	}
	// s.createTimelineEvent(ctx, applicationID, status, ...)

	// 6. Send email notification
	// s.emailService.SendTestResults(...)

	return submission, nil
}

// gradeQuestion auto-grades a question based on type
func (s *service) gradeQuestion(q *InterviewQuestion, answer string) int {
	if q.QuestionType == TestTypeMultipleChoice {
		if answer == q.CorrectAnswer.String {
			return q.Points
		}
		return 0
	}
	// Essay/short answer: return 0 for manual review later
	return 0
}

// Helper functions
func nullifyString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{}
	}
	return sql.NullString{String: s, Valid: true}
}

func ptrTime(t time.Time) *time.Time { return &t }
func ptrBool(b bool) *bool { return &b }
```

### 4. HTTP Handler Example (handler.go - simplified)

```go
// internal/modules/interview_tests/handler.go
package interview_tests

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// CreateTest godoc
// @Summary Create interview test for a job
// @Tags interview-tests
// @Accept json
// @Produce json
// @Param jobId path int true "Job ID"
// @Param request body CreateTestRequest true "Test configuration"
// @Security BearerAuth
// @Router /api/jobs/{jobId}/interview-tests [post]
func (h *Handler) CreateTest(c echo.Context) error {
	jobID, err := strconv.ParseUint(c.Param("jobId"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid job id"})
	}

	var req CreateTestRequest
	if err := c.BindAndValidate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	// Get company ID from JWT
	companyID := c.Get("company_id").(uint64)

	test, err := h.service.CreateTest(c.Request().Context(), jobID, companyID, &req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"success": true,
		"data":    test,
	})
}

// GetTest godoc
// @Summary Get interview test by ID
// @Tags interview-tests
// @Produce json
// @Param testId path int true "Test ID"
// @Router /api/interview-tests/{testId} [get]
func (h *Handler) GetTest(c echo.Context) error {
	testID, err := strconv.ParseUint(c.Param("testId"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid test id"})
	}

	test, err := h.service.GetTest(c.Request().Context(), testID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "test not found"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    test,
	})
}

// StartTest godoc
// @Summary Begin test for applicant
// @Tags test-submissions
// @Produce json
// @Param appId path int true "Application ID"
// @Security BearerAuth
// @Router /api/applications/{appId}/test-submission/start [post]
func (h *Handler) StartTest(c echo.Context) error {
	appID, err := strconv.ParseUint(c.Param("appId"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid application id"})
	}

	userID := c.Get("user_id").(uint64)

	submission, questions, err := h.service.StartTest(c.Request().Context(), appID, userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"submission_id": submission.ID,
			"test_id":       submission.TestID,
			"questions":     questions,
		},
	})
}

// SubmitTest godoc
// @Summary Submit completed test
// @Tags test-submissions
// @Accept json
// @Produce json
// @Param submissionId path int true "Submission ID"
// @Param request body SubmitTestRequest true "Test responses"
// @Security BearerAuth
// @Router /api/test-submissions/{submissionId}/submit [post]
func (h *Handler) SubmitTest(c echo.Context) error {
	submissionID, err := strconv.ParseUint(c.Param("submissionId"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid submission id"})
	}

	var req SubmitTestRequest
	if err := c.BindAndValidate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	submission, err := h.service.SubmitTest(c.Request().Context(), submissionID, &req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"submission_id": submission.ID,
			"total_score":   submission.TotalScore,
			"is_passed":     submission.IsPassed,
		},
	})
}
```

---

## Frontend React/TypeScript - Component Examples

### 1. Test Setup Form Component

```typescript
// src/components/interview-test/TestSetupForm.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Validation schema
const testSetupSchema = z.object({
  test_type: z.enum(['multiple_choice', 'essay', 'short_answer', 'video']),
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  instructions: z.string().optional(),
  time_limit_minutes: z.number().min(5).max(480),
  passing_score: z.number().min(0).max(100),
  max_attempts: z.number().min(1).max(10),
  show_score_immediately: z.boolean(),
})

type TestSetupFormData = z.infer<typeof testSetupSchema>

interface TestSetupFormProps {
  jobId: number
  jobTitle: string
  onSaved?: (test: any) => void
  onCancel?: () => void
}

export function TestSetupForm({
  jobId,
  jobTitle,
  onSaved,
  onCancel,
}: TestSetupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TestSetupFormData>({
    resolver: zodResolver(testSetupSchema),
    defaultValues: {
      test_type: 'multiple_choice',
      time_limit_minutes: 30,
      passing_score: 70,
      max_attempts: 1,
      show_score_immediately: true,
    },
  })

  const onSubmit = async (data: TestSetupFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/jobs/${jobId}/interview-tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create test')
      }

      const result = await response.json()
      onSaved?.(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Setup Interview Test</h2>
        <p className="text-gray-600">Job: {jobTitle}</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>}

      {/* Test Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Test Title</label>
        <Input {...register('title')} placeholder="e.g., Technical Assessment" />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      {/* Test Type */}
      <div>
        <label className="block text-sm font-medium mb-2">Test Type</label>
        <Select
          value={watch('test_type')}
          onValueChange={(value) => setValue('test_type', value as any)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
            <SelectItem value="essay">Essay</SelectItem>
            <SelectItem value="short_answer">Short Answer</SelectItem>
            <SelectItem value="video">Video (Future)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea {...register('description')} placeholder="What is this test for?" rows={3} />
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium mb-2">Instructions</label>
        <Textarea
          {...register('instructions')}
          placeholder="Instructions for test takers"
          rows={3}
        />
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Time Limit */}
        <div>
          <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
          <Input
            type="number"
            {...register('time_limit_minutes', { valueAsNumber: true })}
            min={5}
            max={480}
          />
          {errors.time_limit_minutes && (
            <p className="text-red-500 text-sm mt-1">{errors.time_limit_minutes.message}</p>
          )}
        </div>

        {/* Passing Score */}
        <div>
          <label className="block text-sm font-medium mb-2">Passing Score (%)</label>
          <Input
            type="number"
            {...register('passing_score', { valueAsNumber: true })}
            min={0}
            max={100}
          />
          {errors.passing_score && (
            <p className="text-red-500 text-sm mt-1">{errors.passing_score.message}</p>
          )}
        </div>

        {/* Max Attempts */}
        <div>
          <label className="block text-sm font-medium mb-2">Max Attempts</label>
          <Input
            type="number"
            {...register('max_attempts', { valueAsNumber: true })}
            min={1}
            max={10}
          />
        </div>

        {/* Show Score Immediately */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('show_score_immediately')}
            className="w-4 h-4"
          />
          <label className="ml-2 text-sm font-medium">Show Score Immediately</label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Test'}
        </Button>
      </div>
    </form>
  )
}
```

### 2. Test Player Component (simplified)

```typescript
// src/components/interview-test/TestContainer.tsx
import { useState, useEffect } from 'react'
import { TestTimer } from './TestTimer'
import { QuestionRenderer } from './QuestionRenderer'
import { ProgressBar } from './ProgressBar'

interface Question {
  id: number
  question_text: string
  question_type: string
  options?: Array<{ id: string; text: string }>
  points: number
}

interface TestContainerProps {
  submissionId: number
  applicationId: number
  questions: Question[]
  timeLimitMinutes: number
}

export function TestContainer({
  submissionId,
  applicationId,
  questions,
  timeLimitMinutes,
}: TestContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeUp, setTimeUp] = useState(false)

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))

    //Auto-save answer
    saveAnswer(questionId, answer)
  }

  const saveAnswer = async (questionId: number, answer: string) => {
    try {
      await fetch(`/api/applications/${applicationId}/test-submission/save-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionId,
          answer_text: answer,
        }),
      })
    } catch (err) {
      console.error('Failed to save answer:', err)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const responses = questions.map((q) => ({
        question_id: q.id,
        answer_text: answers[q.id] || '',
      }))

      const response = await fetch(`/api/applications/${applicationId}/test-submission/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      })

      if (!response.ok) throw new Error('Failed to submit test')

      // Redirect to results
      window.location.href = `/applications/${applicationId}/test-results`
    } catch (err) {
      console.error('Submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (timeUp) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Time's Up!</h2>
        <p className="mb-4">Your test has been automatically submitted.</p>
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
          View Results
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Question Navigator */}
      <div className="w-48 bg-gray-100 p-4 border-r overflow-y-auto">
        <h3 className="font-bold mb-4">Questions</h3>
        <div className="space-y-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-full p-2 text-sm rounded ${
                idx === currentIndex
                  ? 'bg-blue-600 text-white'
                  : answers[q.id]
                    ? 'bg-green-100'
                    : 'bg-white hover:bg-gray-200'
              }`}
            >
              Q{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - Timer & Progress */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <ProgressBar value={progress} />
          </div>
          <TestTimer durationMinutes={timeLimitMinutes} onTimeUp={() => setTimeUp(true)} />
        </div>

        {/* Question Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <QuestionRenderer
            question={currentQuestion}
            answer={answers[currentQuestion.id] || ''}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white border-t p-4 flex justify-between">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## Notes for Implementation

### Backend Priority
1. Start with entity definitions
2. Create database migrations
3. Build repository layer
4. Implement service logic (especially grading)
5. Add HTTP handlers
6. Write tests

### Frontend Priority
1. Create test setup form first (company side)
2. Build test player interface
3. Add question renderers
4. Implement results display
5. Polish UX

### Common Gotchas
- **Auto-grading**: Only MC questions can be auto-graded; mark essays for manual review
- **Timeline**: Remember to create timeline events for each status change
- **Validation**: Validate company ownership of job before allowing test creation
- **Score Calculation**: Total score = sum of points_earned from all responses
- **Email Templates**: Create reusable email templates for notifications

---

**Last Updated**: February 18, 2026
