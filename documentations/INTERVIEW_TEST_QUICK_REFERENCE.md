# 🎯 Interview Test Feature - Quick Reference

**Last Updated**: February 18, 2026

---

## ⚡ Quick Summary

**Feature**: Optional interview test untuk job seeker sebelum tahap interview  
**Triggered by**: Company (wajib setup ketika create job atau edit job)  
**Benefit**: Company filter kandidat, Seeker show skill  

**Implementation Order**:
1. Backend API (2-3 weeks)
2. Company Dashboard (2 weeks)
3. Job Seeker Dashboard (2 weeks)
4. Admin Hub (1-2 weeks) - optional

---

## 📊 Data Models Summary

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `job_interview_tests` | Test config per job | test_type, time_limit_minutes, passing_score |
| `interview_questions` | Question bank | question_text, question_type, options, points |
| `test_submissions` | Applicant submission | application_id, test_id, status, total_score |
| `interview_test_responses` | Individual answers | submission_id, question_id, answer, points_earned |

---

## 🔌 Key API Endpoints

### Company Setup
```
POST   /api/jobs/:jobId/interview-tests           Create test
PUT    /api/interview-tests/:testId               Update test
DELETE /api/interview-tests/:testId               Delete test
POST   /api/interview-tests/:testId/questions     Add question
GET    /api/interview-tests/:testId/questions     List questions
GET    /api/applications/:appId/test-results      View results
GET    /api/jobs/:jobId/test-statistics           Test stats
```

### Applicant Take Test
```
GET    /api/applications/:appId/test-status       Check test required
POST   /api/applications/:appId/test-submission/start    Begin test
POST   /api/applications/:appId/test-submission/save-answer  Auto-save
POST   /api/applications/:appId/test-submission/submit   Complete test
GET    /api/applications/:appId/test-results      View results
```

---

## 🏗️ Module Structure (Backend)

```
internal/modules/
├── interview_tests/        (CRUD test config)
├── interview_questions/    (CRUD questions)
├── test_submissions/       (Track applicant attempts)
└── test_responses/         (Record individual answers)
```

---

## 🎨 UI Components (Frontend)

### Company Dashboard
- `TestSetupForm` - Configure test
- `QuestionBuilder` - Create/edit questions
- `TestResultsTable` - View results
- `EssayGradingPanel` - Manual grading

### Job Seeker Dashboard
- `TestStatusBadge` - Show test status
- `TestStartModal` - Show test info
- `TestContainer` - Main test interface
- `QuestionRenderer` - Display questions
- `TestTimer` - Countdown timer
- `TestResultsDisplay` - Show score

---

## 💾 Database Tables Summary

```sql
job_interview_tests
├── id, job_id, company_id
├── test_type, title, description
├── time_limit_minutes, passing_score, max_attempts
├── show_score_immediately, enabled
└── created_at, updated_at

interview_questions
├── id, test_id
├── question_text, question_type
├── options (JSON), correct_answer
├── points, order_index
└── created_at, updated_at

test_submissions
├── id, application_id, test_id
├── attempt_number, status
├── started_at, submitted_at, graded_at
├── total_score, passing_score, is_passed
└── created_at, updated_at

interview_test_responses
├── id, submission_id, question_id
├── answer_text, answer_video_url
├── is_correct, points_earned, max_points
├── grading_notes, graded_by_type, graded_by_id
└── created_at, updated_at
```

---

## 🎯 Timeline Events

When test status changes, add to application timeline:

```
test_required       → Company enabled test for job
test_started        → Applicant began test
test_submitted      → Applicant submitted test
test_passed         → Test passed (score >= passing_score)
test_failed         → Test failed (score < passing_score)
test_retake_allowed → (if max_attempts > 1)
```

---

## 📋 Phase Implementation Checklist

### Phase 1: Backend (2-3 weeks)
- [ ] Database migrations
- [ ] All 4 modules (tests, questions, submissions, responses)
- [ ] Auto-grading logic (multiple choice)
- [ ] Score calculation
- [ ] Permission checks
- [ ] Timeline events
- [ ] Email notifications
- [ ] API endpoints & documentation
- [ ] Unit tests

### Phase 2: Company Dashboard (2 weeks)
- [ ] Test setup page
- [ ] Question builder
- [ ] Test results dashboard
- [ ] Essay grading interface
- [ ] Test statistics widget
- [ ] Integration with job detail
- [ ] Form validation & error handling

### Phase 3: Job Seeker Dashboard (2 weeks)
- [ ] Test status badge
- [ ] Test start modal
- [ ] Test player interface
- [ ] Question renderers (MC, essay, short answer)
- [ ] Auto-save answers
- [ ] Timer component
- [ ] Results display
- [ ] Timeline integration

### Phase 4: Admin Hub (1-2 weeks) - Optional
- [ ] Usage statistics
- [ ] Performance analytics
- [ ] Completion rates
- [ ] Audit log

---

## 🔐 Permission Rules

| Action | Company | Admin | Applicant |
|--------|---------|-------|-----------|
| Create test | ✅ (own jobs) | ✅ | ❌ |
| Edit test | ✅ (own) | ✅ | ❌ |
| Delete test | ✅ (own) | ✅ | ❌ |
| View results | ✅ (own job) | ✅ | ✅ (own) |
| Take test | ❌ | ❌ | ✅ (required) |
| Grade test | ✅ (own job) | ✅ | ❌ |

---

## 🏪 Question Types Supported

| Type | Company | Applicant | Grading |
|------|---------|-----------|---------|
| Multiple Choice | ✅ | Radio buttons | Auto |
| Short Answer | ✅ | Text input | Auto (pattern) |
| Essay | ✅ | Textarea | Manual |
| Video | 🔄 Future | Video recorder | Manual/AI |
| Puzzle | 🔄 Future | Interactive | Auto/Manual |

---

## 📧 Email Notifications

**Send to Applicant:**
- Test required (after company setup)
- Test reminder (if approaching deadline)
- Test results (after grading)

**Send to Company:**
- Test submitted (when applicant submits)
- Essays pending review (notification for company)

---

## 🚀 Future Enhancements

- Question bank (reusable across jobs)
- AI-powered essay grading
- Video interview (async)
- Plagiarism detection
- Test analytics & insights
- A/B testing questions
- Leaderboard (optional)

---

## 📞 Questions?

Refer to: `/documentations/INTERVIEW_TEST_FEATURE.md` (full detail)  
For prompting: Include this quick reference + full feature doc 

**Created**: February 18, 2026
