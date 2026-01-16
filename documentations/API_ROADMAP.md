# 🔌 Karir Nusantara - API Roadmap & Specifications

## 📋 API Overview

Base URL: `https://api.karir-nusantara.com` (production)  
Version: `v1`  
Authentication: JWT Bearer Token  
Response Format: JSON  

---

## 🔐 Authentication Endpoints

### 1. Register New Account

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "phone": "0812xxxxxxxx"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "id": "uuid-user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "0812xxxxxxxx",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors**:
- `400`: Invalid email format
- `409`: Email already exists
- `422`: Validation failed

---

### 2. Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "uuid-user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

**Errors**:
- `401`: Invalid email or password
- `404`: User not found

---

### 3. Refresh Token

```http
POST /api/v1/auth/refresh-token
Content-Type: application/json
Authorization: Bearer {refreshToken}

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

---

### 4. Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Get Current User

```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "0812xxxxxxxx",
    "location": "Jakarta",
    "bio": "...",
    "createdAt": "2026-01-16T10:00:00Z"
  }
}
```

**Errors**:
- `401`: Unauthorized
- `403`: Token expired

---

## 👤 User Endpoints

### 1. Get User Profile

```http
GET /api/v1/users/:userId
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "0812xxxxxxxx",
    "location": "Jakarta",
    "bio": "Passionate about technology",
    "createdAt": "2026-01-16T10:00:00Z"
  }
}
```

---

### 2. Update User Profile

```http
PUT /api/v1/users/:userId
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phone": "0812xxxxxxxx",
  "location": "Jakarta Selatan",
  "bio": "Updated bio"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile updated",
  "data": { /* updated user object */ }
}
```

---

### 3. Upload Avatar

```http
POST /api/v1/users/:userId/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

[file: image.jpg]
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://cdn.karir-nusantara.com/avatars/uuid-123.jpg"
  }
}
```

---

## 💼 Job Endpoints

### 1. List Jobs (Public)

```http
GET /api/v1/jobs?page=1&limit=20&search=developer&location=jakarta&type=full-time
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| page | int | Page number (default: 1) |
| limit | int | Items per page (default: 20, max: 100) |
| search | string | Search by title/keyword |
| location | string | Filter by location/city |
| type | string | full-time, part-time, freelance |
| salary_min | int | Minimum salary |
| salary_max | int | Maximum salary |
| sort | string | latest, salary_asc, salary_desc |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid-job-123",
        "title": "Senior Backend Developer",
        "company": {
          "id": "uuid-company-1",
          "name": "Tech Company Inc",
          "logo": "https://..."
        },
        "location": "Jakarta, Indonesia",
        "type": "full-time",
        "salary_min": 15000000,
        "salary_max": 25000000,
        "description_preview": "We are looking for...",
        "skills": ["Node.js", "PostgreSQL", "Docker"],
        "posted_at": "2026-01-16T10:00:00Z",
        "expires_at": "2026-02-16T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

### 2. Get Job Detail (Public)

```http
GET /api/v1/jobs/:jobId
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-job-123",
    "title": "Senior Backend Developer",
    "company": {
      "id": "uuid-company-1",
      "name": "Tech Company Inc",
      "logo": "https://...",
      "website": "https://techcompany.com",
      "description": "We are a..."
    },
    "location": "Jakarta, Indonesia",
    "type": "full-time",
    "salary_min": 15000000,
    "salary_max": 25000000,
    "description": "Full job description in HTML",
    "requirements": [
      "5+ years experience",
      "Expert in Node.js",
      "PostgreSQL knowledge"
    ],
    "skills": ["Node.js", "PostgreSQL", "Docker", "TypeScript"],
    "posted_at": "2026-01-16T10:00:00Z",
    "expires_at": "2026-02-16T10:00:00Z",
    "applicationCount": 45
  }
}
```

---

### 3. Create Job (Company Only)

```http
POST /api/v1/jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Senior Backend Developer",
  "description": "Full job description",
  "location": "Jakarta, Indonesia",
  "type": "full-time",
  "salary_min": 15000000,
  "salary_max": 25000000,
  "skills": ["Node.js", "PostgreSQL"],
  "requirements": ["5+ experience"]
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-job-123",
    "title": "Senior Backend Developer",
    "...": "..."
  }
}
```

---

### 4. Update Job

```http
PUT /api/v1/jobs/:jobId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "salary_max": 30000000
}
```

---

### 5. Delete Job

```http
DELETE /api/v1/jobs/:jobId
Authorization: Bearer {token}
```

---

## 📄 CV Endpoints

### 1. Create CV

```http
POST /api/v1/cv
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "CV Profesional",
  "data": {
    "personal_info": {
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "0812xxxxxxxx",
      "location": "Jakarta",
      "summary": "Passionate developer"
    },
    "education": [
      {
        "institution": "University XYZ",
        "degree": "Bachelor",
        "field": "Computer Science",
        "start_date": "2015",
        "end_date": "2019"
      }
    ],
    "experience": [
      {
        "company": "Company A",
        "position": "Senior Developer",
        "duration": "2020-Present",
        "description": "Led development team"
      }
    ],
    "skills": ["React", "TypeScript", "Node.js"],
    "certifications": [
      {
        "name": "AWS Solutions Architect",
        "issuer": "Amazon",
        "date": "2023"
      }
    ]
  }
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-cv-123",
    "title": "CV Profesional",
    "data": { /* cv data */ },
    "createdAt": "2026-01-16T10:00:00Z"
  }
}
```

---

### 2. Get CV

```http
GET /api/v1/cv/:cvId
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-cv-123",
    "userId": "uuid-user-123",
    "title": "CV Profesional",
    "data": { /* full cv data */ },
    "createdAt": "2026-01-16T10:00:00Z",
    "updatedAt": "2026-01-16T10:00:00Z"
  }
}
```

---

### 3. Update CV

```http
PUT /api/v1/cv/:cvId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated CV Title",
  "data": { /* updated data */ }
}
```

---

### 4. Delete CV

```http
DELETE /api/v1/cv/:cvId
Authorization: Bearer {token}
```

---

### 5. List User CVs

```http
GET /api/v1/cv
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "cvs": [
      {
        "id": "uuid-cv-123",
        "title": "CV Profesional",
        "createdAt": "2026-01-16T10:00:00Z"
      }
    ],
    "total": 1
  }
}
```

---

### 6. Export CV as PDF

```http
GET /api/v1/cv/:cvId/export-pdf
Authorization: Bearer {token}
```

**Response (200 OK)**: Binary PDF file

**Alternative (Async)**:
```http
POST /api/v1/cv/:cvId/export-pdf
Authorization: Bearer {token}
```

**Response (202 Accepted)**:
```json
{
  "success": true,
  "data": {
    "jobId": "uuid-job-456",
    "status": "processing",
    "estimatedTime": 5
  }
}
```

Check status:
```http
GET /api/v1/pdf-jobs/:jobId
Authorization: Bearer {token}
```

---

## 💬 Job Application Endpoints

### 1. Apply for Job

```http
POST /api/v1/applications
Authorization: Bearer {token}
Content-Type: application/json

{
  "jobId": "uuid-job-123",
  "cvId": "uuid-cv-123",
  "coverLetter": "Optional cover letter text"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": "uuid-app-123",
    "jobId": "uuid-job-123",
    "cvId": "uuid-cv-123",
    "status": "submitted",
    "submittedAt": "2026-01-16T10:00:00Z"
  }
}
```

**Errors**:
- `401`: Unauthorized (not logged in)
- `404`: CV not found
- `409`: Already applied to this job
- `422`: Missing required fields

---

### 2. Get Application Detail

```http
GET /api/v1/applications/:appId
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-app-123",
    "job": {
      "id": "uuid-job-123",
      "title": "Senior Developer",
      "company": "Tech Company"
    },
    "cv": { /* cv snapshot */ },
    "status": "submitted",
    "submittedAt": "2026-01-16T10:00:00Z",
    "statusHistory": [
      {
        "status": "submitted",
        "timestamp": "2026-01-16T10:00:00Z"
      }
    ]
  }
}
```

---

### 3. List User Applications

```http
GET /api/v1/applications?status=submitted&sort=-submittedAt
Authorization: Bearer {token}
```

**Query Parameters**:
- `status`: submitted, reviewed, accepted, rejected
- `sort`: -submittedAt, jobTitle

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid-app-123",
        "job": { /* job info */ },
        "status": "submitted",
        "submittedAt": "2026-01-16T10:00:00Z"
      }
    ],
    "total": 5
  }
}
```

---

### 4. Update Application Status (Company/Admin Only)

```http
PUT /api/v1/applications/:appId/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "accepted",
  "notes": "We are interested in your profile"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-app-123",
    "status": "accepted",
    "updatedAt": "2026-01-16T10:00:00Z"
  }
}
```

---

### 5. Withdraw Application

```http
DELETE /api/v1/applications/:appId
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Application withdrawn"
}
```

---

## 🗺️ Location Endpoints

### 1. Get Provinces

```http
GET /api/v1/locations/provinces
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "provinces": [
      {
        "id": "id-jkt",
        "name": "DKI Jakarta"
      },
      {
        "id": "id-jw",
        "name": "Jawa Barat"
      }
    ]
  }
}
```

---

### 2. Get Cities by Province

```http
GET /api/v1/locations/provinces/:provinceId/cities
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "cities": [
      {
        "id": "id-jkt-utara",
        "name": "Jakarta Utara",
        "latitude": -6.124,
        "longitude": 106.899
      }
    ]
  }
}
```

---

### 3. Search Location

```http
GET /api/v1/locations/search?q=jakarta
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "id-jkt",
        "name": "DKI Jakarta",
        "type": "province"
      }
    ]
  }
}
```

---

### 4. Find Nearby Jobs

```http
GET /api/v1/jobs/nearby?latitude=-6.2088&longitude=106.8456&radius=10
```

**Query Parameters**:
- `latitude`: float (required)
- `longitude`: float (required)
- `radius`: int (default: 10 km)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid-job-123",
        "title": "Senior Developer",
        "distance": 2.5,
        "...": "..."
      }
    ]
  }
}
```

---

## 🔄 Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Human readable error message",
    "details": {
      "field": "Specific field error details"
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_REQUEST | 400 | Invalid request format |
| VALIDATION_ERROR | 422 | Input validation failed |
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | User lacks permission |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict (e.g., duplicate) |
| RATE_LIMITED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |

---

## 📊 Rate Limiting

Rate limits per hour:
- Authentication endpoints: 10 requests
- Job search: 100 requests
- Other endpoints: 50 requests

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642378800
```

---

## 🔑 Authentication Header

Include JWT token in all protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📚 Webhook Events (Future)

```
job.created
job.updated
job.deleted
application.submitted
application.accepted
application.rejected
user.registered
```

---

## 📖 API Documentation Tools

- **Swagger UI**: `/api/docs`
- **Postman Collection**: Available in repo
- **OpenAPI Spec**: `/api/openapi.json`

---

## 🧪 Testing API

### Local Development
```bash
Base URL: http://localhost:3000/api/v1
```

### Staging
```bash
Base URL: https://staging-api.karir-nusantara.com/api/v1
```

### Production
```bash
Base URL: https://api.karir-nusantara.com/api/v1
```

---

## 📝 Example cURL Requests

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

### List Jobs
```bash
curl -X GET "http://localhost:3000/api/v1/jobs?page=1&limit=20" \
  -H "Accept: application/json"
```

### Apply for Job
```bash
curl -X POST http://localhost:3000/api/v1/applications \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "uuid-job-123",
    "cvId": "uuid-cv-123"
  }'
```

---

## 📚 Related Documentation

- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [FEATURES.md](./FEATURES.md) - Feature specifications

---

**Last Updated**: January 16, 2026  
**Version**: 1.0  
**Status**: ✅ API Spec Complete
