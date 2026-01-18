# API Integration - Karir Nusantara Frontend

## Overview

This document describes the frontend-backend API integration for Karir Nusantara job portal.

## Architecture

```
src/
├── api/                    # API Layer
│   ├── config.ts          # API configuration, endpoints
│   ├── client.ts          # HTTP client with token management
│   ├── auth.ts            # Auth API functions
│   ├── jobs.ts            # Jobs API functions
│   ├── cv.ts              # CV API functions
│   ├── applications.ts    # Applications API functions
│   └── index.ts           # Clean exports
│
├── contexts/              # State Management
│   ├── AuthContext.new.tsx       # API-integrated auth context
│   ├── CVContext.new.tsx         # API-integrated CV context
│   └── ApplicationContext.new.tsx # API-integrated application context
│
└── hooks/                 # Custom Hooks (TanStack Query)
    ├── useAuth.ts         # Auth mutations
    ├── useJobs.ts         # Jobs queries
    ├── useCV.ts           # CV queries/mutations
    ├── useApplications.ts # Application queries/mutations
    └── index.ts           # Clean exports
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

### API Endpoints

All endpoints are defined in `src/api/config.ts`:

| Module | Endpoint | Description |
|--------|----------|-------------|
| Auth | `/auth/register` | User registration |
| Auth | `/auth/login` | User login |
| Auth | `/auth/logout` | User logout |
| Auth | `/auth/refresh` | Refresh token |
| Auth | `/auth/me` | Get current user |
| Jobs | `/jobs` | List jobs (with filters) |
| Jobs | `/jobs/:id` | Get job by ID |
| CV | `/cv` | Get/Create/Update CV |
| Applications | `/applications` | Apply to job |
| Applications | `/applications/me` | My applications |
| Applications | `/applications/:id/timeline` | Application timeline |
| Applications | `/applications/:id/withdraw` | Withdraw application |

## Token Management

JWT tokens are managed automatically:

1. **Storage**: Tokens stored in `localStorage` with key `karir_access_token`
2. **Auto-attach**: All authenticated requests include `Authorization: Bearer <token>`
3. **Auto-refresh**: 401 responses trigger automatic token refresh
4. **Logout cleanup**: Token removed on logout

## Error Handling

All API errors are handled with Indonesian messages:

```typescript
try {
  await apiFunction();
} catch (error) {
  // error.message contains Indonesian error message
  toast.error(error.message);
}
```

## Usage Examples

### Using TanStack Query Hooks

```tsx
// List jobs with filters
const { data, isLoading, error } = useJobs({
  search: 'developer',
  location: 'Jakarta',
  type: 'full_time',
});

// Get job by ID
const { data: job } = useJob(123);

// Apply to job
const applyMutation = useApplyToJob();
await applyMutation.mutateAsync({
  job_id: 123,
  cover_letter: 'My cover letter...',
});
```

### Using Contexts

```tsx
// Auth
const { user, isAuthenticated, login, logout } = useAuth();
await login('email@example.com', 'password');

// CV
const { cvData, updatePersonalInfo, syncToServer } = useCV();
updatePersonalInfo({ fullName: 'John Doe' });

// Applications
const { applications, applyToJob, withdrawApplication } = useApplications();
```

## Fallback Behavior

When the API is unavailable, the app falls back to:

1. **Mock data**: Jobs use `mockJobs` from `src/data/jobs.ts`
2. **localStorage**: CV and applications persist locally
3. **Cached data**: TanStack Query serves stale data while refetching

## Data Transformation

API responses use `snake_case`, frontend uses `camelCase`:

```typescript
// API Response
{ full_name: 'John', salary_min: 5000000 }

// Frontend
{ fullName: 'John', salaryMin: 5000000 }
```

Transformers are provided in each API module:
- `transformToFrontendFormat()` - API → Frontend
- `transformToApiFormat()` - Frontend → API

## Testing

To test the API integration:

1. Start the backend: `cd karir-nusantara-api && make run`
2. Start the frontend: `cd karir-nusantara && bun dev`
3. The app will connect to `http://localhost:8080/api/v1`

## Files Changed

### New Files
- `src/api/config.ts`
- `src/api/client.ts`
- `src/api/auth.ts`
- `src/api/jobs.ts`
- `src/api/cv.ts`
- `src/api/applications.ts`
- `src/api/index.ts`
- `src/contexts/AuthContext.new.tsx`
- `src/contexts/CVContext.new.tsx`
- `src/contexts/ApplicationContext.new.tsx`
- `src/hooks/useAuth.ts`
- `src/hooks/useJobs.ts`
- `src/hooks/useCV.ts`
- `src/hooks/useApplications.ts`
- `src/hooks/index.ts`
- `.env.example`
- `.env`

### Modified Files
- `src/App.tsx` - Updated to use new contexts
- `src/pages/JobsPage.tsx` - Uses API with mock fallback
- `src/pages/JobDetailPage.tsx` - Uses API with mock fallback
- `src/pages/MyApplicationsPage.tsx` - Uses new context
- `src/pages/ProfilePage.tsx` - Uses new context
- `src/pages/RecommendedJobsPage.tsx` - Uses new context
- `src/pages/CVBuilderPage.tsx` - Uses new context
- `src/pages/CVCheckerPage.tsx` - Uses new context
- `src/components/auth/AuthModal.tsx` - Uses new context
- `src/components/layout/Navbar.tsx` - Uses new context
- `src/components/cv/CVPreview.tsx` - Uses new types
- `src/components/cv/CVMiniPreview.tsx` - Uses new types

## Migration Notes

The original context files are preserved:
- `AuthContext.tsx` → `AuthContext.new.tsx`
- `CVContext.tsx` → `CVContext.new.tsx`
- `ApplicationContext.tsx` → `ApplicationContext.new.tsx`

To roll back, simply update imports in `App.tsx` and affected pages.
