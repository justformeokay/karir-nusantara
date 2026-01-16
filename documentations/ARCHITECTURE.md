# 🏗️ Karir Nusantara - Architecture & Technical Design

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         KARIR NUSANTARA                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐         ┌─────────────────────┐   │
│  │   FRONTEND (SPA)    │         │   BACKEND (API)     │   │
│  ├─────────────────────┤         ├─────────────────────┤   │
│  │ React + TypeScript  │◄───────►│ Node.js / Express   │   │
│  │ Vite Build Tool     │  REST   │ PostgreSQL / MySQL  │   │
│  │ Tailwind CSS        │  JSON   │ JWT Auth            │   │
│  │ Shadcn/ui Components│         │ PDF Service         │   │
│  │                     │         │                     │   │
│  │ Modules:           │         │ Modules:            │   │
│  │ - Job Listing      │         │ - Auth Service      │   │
│  │ - Job Detail       │         │ - User Service      │   │
│  │ - Auth Flow        │         │ - Job Service       │   │
│  │ - CV Builder       │         │ - CV Service        │   │
│  │ - Application Flow │         │ - Application SVC   │   │
│  │ - PDF Export       │         │ - Location Service  │   │
│  │                     │         │ - PDF Generator     │   │
│  └─────────────────────┘         └─────────────────────┘   │
│           │                               │                 │
│           └───────────────┬───────────────┘                 │
│                           │                                 │
│           ┌───────────────┴────────────────┐               │
│           │                                │                │
│  ┌────────▼──────────┐        ┌──────────▼────────┐      │
│  │   Database (DB)   │        │  External Services │      │
│  ├───────────────────┤        ├───────────────────┤      │
│  │ - Users           │        │ - Geo/Map API     │      │
│  │ - Jobs            │        │ - Email Service   │      │
│  │ - CVs             │        │ - PDF Library     │      │
│  │ - Applications    │        │ - Cloud Storage   │      │
│  │ - Companies       │        │   (for CVs)       │      │
│  └───────────────────┘        └───────────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 Frontend Architecture

### Tech Stack
```
Framework:      React 18+ with TypeScript
Build Tool:     Vite (fast dev server, optimized build)
Styling:        Tailwind CSS + Shadcn/ui
State Management: React Context / Zustand (optional)
HTTP Client:    Fetch API / Axios
PDF Generation: React-PDF / jsPDF
Routing:        React Router v6
Testing:        Vitest + React Testing Library
```

### Folder Structure

```
src/
├── pages/                    # Page components
│   ├── HomePage.tsx         # Landing / job list
│   ├── JobDetailPage.tsx    # Job detail view
│   ├── CVBuilderPage.tsx    # CV creation/edit
│   ├── NotFound.tsx         # 404 page
│   └── Index.tsx            # Router setup
│
├── components/              # Reusable components
│   ├── layout/
│   │   ├── Navbar.tsx       # Top navigation
│   │   ├── Footer.tsx       # Footer
│   │   └── Layout.tsx       # Layout wrapper
│   │
│   ├── jobs/
│   │   ├── JobCard.tsx      # Job card component
│   │   ├── JobFilters.tsx   # Filter controls
│   │   └── SearchBar.tsx    # Search input
│   │
│   ├── auth/
│   │   └── AuthModal.tsx    # Login/register modal
│   │
│   ├── cv/
│   │   └── CVPreview.tsx    # CV display + PDF export
│   │
│   ├── NavLink.tsx          # Custom nav link
│   └── ui/                  # Shadcn UI components
│
├── contexts/                # Context providers
│   ├── AuthContext.tsx      # Auth state
│   └── CVContext.tsx        # CV state
│
├── hooks/                   # Custom hooks
│   ├── use-toast.ts        # Toast notifications
│   ├── use-mobile.tsx      # Mobile detection
│   └── (custom hooks)
│
├── lib/
│   └── utils.ts            # Utility functions
│
├── types/                   # TypeScript types
│   └── (type definitions)
│
├── data/
│   └── jobs.ts             # Mock data (dev only)
│
├── App.tsx                  # Root component
├── main.tsx                 # Entry point
└── index.css                # Global styles
```

---

## ⚙️ Backend Architecture

### Tech Stack (Recommended)
```
Runtime:        Node.js 18+
Framework:      Express.js / NestJS
Database:       PostgreSQL (recommended) / MySQL
ORM:            Prisma / Sequelize / TypeORM
Authentication: JWT + bcrypt
Validation:     Zod / Joi
Logging:        Winston / Pino
Testing:        Jest + Supertest
API:            REST (or GraphQL later)
```

### Backend Folder Structure (Suggested)

```
backend/
├── src/
│   ├── controllers/         # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── job.controller.ts
│   │   ├── cv.controller.ts
│   │   └── application.controller.ts
│   │
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── job.service.ts
│   │   ├── cv.service.ts
│   │   ├── application.service.ts
│   │   ├── pdf.service.ts
│   │   └── location.service.ts
│   │
│   ├── models/              # Data models (Prisma)
│   │   └── schema.prisma
│   │
│   ├── middlewares/         # Custom middlewares
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   │
│   ├── routes/              # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── job.routes.ts
│   │   ├── cv.routes.ts
│   │   └── application.routes.ts
│   │
│   ├── utils/               # Utilities
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   └── validators.ts
│   │
│   └── app.ts               # Express app setup
│
├── prisma/
│   └── schema.prisma        # Database schema
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .env                     # Environment variables
├── server.ts                # Entry point
└── package.json
```

---

## 🔐 Authentication Flow

### JWT-Based Authentication

```
┌──────────────┐
│  User Input  │
│ Email/Pass   │
└───────┬──────┘
        │
        ▼
┌─────────────────────────┐
│ Hash Password Check     │
│ bcrypt.compare()        │
└────────┬────────────────┘
         │
    ✅YES│  NO ❌
    │    │
    │    └──► Return 401 Unauthorized
    │
    ▼
┌──────────────────────────┐
│ Generate JWT Token       │
│ - user_id in payload     │
│ - exp: 7 days (default)  │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Return Token to Client   │
│ Store in localStorage    │
└──────────────────────────┘

SUBSEQUENT REQUESTS:
┌──────────────────────────┐
│ Include JWT in Header    │
│ Authorization: Bearer XX │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Verify Token             │
│ jwt.verify()             │
└────────┬─────────────────┘
         │
    ✅VALID│  INVALID ❌
    │      │
    │      └──► Return 401 Unauthorized
    │
    ▼
┌──────────────────────────┐
│ Extract user_id          │
│ Proceed with request     │
└──────────────────────────┘
```

---

## 📡 API Endpoints (Planned)

### Auth Endpoints
```
POST   /api/auth/register         # Register new user
POST   /api/auth/login            # Login
POST   /api/auth/logout           # Logout
POST   /api/auth/refresh-token    # Refresh JWT
GET    /api/auth/me               # Get current user
```

### Job Endpoints
```
GET    /api/jobs                  # List jobs (public)
GET    /api/jobs/:id              # Job detail (public)
GET    /api/jobs/search           # Search/filter jobs
POST   /api/jobs                  # Create job (company only)
PUT    /api/jobs/:id              # Update job
DELETE /api/jobs/:id              # Delete job
```

### User Endpoints
```
GET    /api/users/:id             # Get user profile
PUT    /api/users/:id             # Update profile
POST   /api/users/:id/avatar      # Upload avatar
GET    /api/users/me              # Get current user
```

### CV Endpoints
```
POST   /api/cv                    # Create CV
GET    /api/cv/:id                # Get CV
PUT    /api/cv/:id                # Update CV
DELETE /api/cv/:id                # Delete CV
GET    /api/cv/:id/export-pdf     # Export as PDF
GET    /api/cv/user/:user_id      # Get user's CVs
```

### Application Endpoints
```
POST   /api/applications          # Apply for job
GET    /api/applications          # List user applications
GET    /api/applications/:id      # Get application detail
PUT    /api/applications/:id      # Update application status
DELETE /api/applications/:id      # Withdraw application
```

---

## 🗄️ Database Schema (Prisma)

```prisma
// User Model
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String    // hashed
  name      String
  phone     String?
  location  String?
  bio       String?
  
  cv        CV?
  applications JobApplication[]
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// CV Model
model CV {
  id        String    @id @default(cuid())
  userId    String    @unique
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  title     String
  data      Json      // Structured CV data
  
  applications JobApplication[]
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// Job Model
model Job {
  id        String    @id @default(cuid())
  companyId String
  
  title     String
  description String
  location  String
  type      String    // full-time, part-time, freelance
  salary_min Int?
  salary_max Int?
  
  skills_required String[]
  
  applications JobApplication[]
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// JobApplication Model
model JobApplication {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  jobId     String
  job       Job       @relation(fields: [jobId], references: [id], onDelete: Cascade)
  
  cvId      String
  cv        CV        @relation(fields: [cvId], references: [id])
  
  status    String    @default("submitted") // submitted, reviewed, accepted, rejected
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// Company Model (for future)
model Company {
  id        String    @id @default(cuid())
  name      String    @unique
  description String?
  logo      String?
  website   String?
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

---

## 🔄 State Management

### Frontend State Architecture

#### Context Providers
```
App
├── AuthContext
│   ├── user (User | null)
│   ├── isAuthenticated (boolean)
│   ├── login(email, password)
│   ├── register(email, password, name)
│   ├── logout()
│   └── refreshToken()
│
└── CVContext
    ├── currentCV (CV | null)
    ├── cvList (CV[])
    ├── loadCV(cvId)
    ├── saveCV(cvData)
    ├── deleteCV(cvId)
    └── exportPDF(cvId)
```

---

## 📦 Component State Flow

### Job List Component
```
JobListPage
├── State:
│   ├── jobs (Job[])
│   ├── filters (Filter)
│   ├── isLoading (boolean)
│   └── error (Error | null)
│
├── Effects:
│   └── Fetch jobs on mount & filter change
│
└── Props:
    └── Pass to JobCard, JobFilters
```

### CV Builder Component
```
CVBuilderPage
├── State:
│   ├── cvData (CVData)
│   ├── currentStep (number)
│   ├── isSaving (boolean)
│   └── error (Error | null)
│
├── Effects:
│   ├── Load existing CV on mount
│   └── Auto-save on change (debounced)
│
└── Actions:
    ├── updateField()
    ├── saveCv()
    ├── exportPDF()
    └── nextStep() / prevStep()
```

---

## 🚀 Deployment Architecture

### Frontend Deployment
```
Local Dev
    │
    ├─► npm run dev (Vite dev server)
    │
Build
    │
    └─► npm run build (dist/ folder)
         │
         ├─► Vercel (recommended)
         ├─► Netlify
         ├─► AWS S3 + CloudFront
         └─► Docker container
```

### Backend Deployment
```
Local Dev
    │
    ├─► npm run dev (Express server)
    │
Build & Test
    │
    └─► npm run build
         │
         ├─► Heroku
         ├─► AWS EC2 / Elastic Beanstalk
         ├─► DigitalOcean
         ├─► Railway
         └─► Docker container
```

### Database Deployment
```
Development
    ├─► Local PostgreSQL
    └─► SQLite
        
Production
    ├─► AWS RDS
    ├─► Google Cloud SQL
    ├─► DigitalOcean Managed Database
    └─► Heroku PostgreSQL
```

---

## 🔒 Security Considerations

### Authentication & Authorization
- ✅ Password hashing (bcrypt)
- ✅ JWT token with expiration
- ✅ Refresh token rotation
- ✅ CORS configuration
- ✅ Rate limiting on auth endpoints

### Data Protection
- ✅ HTTPS/TLS encryption
- ✅ Environment variables for secrets
- ✅ Input validation & sanitization
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection

### API Security
- ✅ Authentication middleware
- ✅ Authorization checks per endpoint
- ✅ Rate limiting
- ✅ Request size limits
- ✅ CORS whitelist

---

## 📊 Performance Optimization

### Frontend
- Lazy loading pages
- Image optimization
- Code splitting
- Caching strategies
- Service workers (PWA future)

### Backend
- Database indexing
- Query optimization
- Pagination for large datasets
- Caching layer (Redis future)
- CDN for static assets

---

## 🧪 Testing Strategy

### Frontend Testing
```
Unit Tests
├── Components
├── Hooks
├── Utilities
└── Context

Integration Tests
├── User flows
├── API calls
└── State management

E2E Tests
├── Job search flow
├── Login flow
├── CV builder flow
└── Apply job flow
```

### Backend Testing
```
Unit Tests
├── Services
├── Utilities
└── Validators

Integration Tests
├── Database operations
├── API endpoints
└── Authentication

E2E Tests
├── Full workflows
├── Error scenarios
└── Edge cases
```

---

## 📚 Related Documentation

- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Project overview
- [FEATURES.md](./FEATURES.md) - Feature specifications
- [API_ROADMAP.md](./API_ROADMAP.md) - API endpoints detail
- [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) - Known bugs & risks

---

**Last Updated**: January 16, 2026  
**Version**: 1.0  
**Status**: ✅ Architecture Finalized
