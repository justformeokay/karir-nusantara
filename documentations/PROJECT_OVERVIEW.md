# 📌 Karir Nusantara - Project Overview

## 🎯 Tujuan Utama Proyek

Karir Nusantara adalah sebuah **platform job portal berbasis web** yang ditujukan untuk memudahkan pencari kerja di Indonesia dalam menemukan lowongan pekerjaan yang relevan, terdekat secara lokasi, dan mudah dilamar tanpa hambatan teknis.

### Fokus Utama
- ✅ Akses cepat tanpa login
- ✅ UX sederhana & profesional
- ✅ Proses melamar kerja yang efisien
- ✅ CV Builder terintegrasi (PDF-ready)

## 🧠 Filosofi Desain & Arsitektur

| Aspek | Deskripsi |
|-------|-----------|
| **Mobile-first** | Didesain untuk mobile, tidak mobile-compatible |
| **Flat Design** | Clean, minimal, modern aesthetic |
| **Minimal Friction** | Reduce friction untuk melamar kerja |
| **Scalable** | Siap dikembangkan ke enterprise |
| **Company Dashboard** | Future: Company posting system |
| **Admin Panel** | Future: Admin dashboard |

## 📊 Inspiration & Positioning

Platform ini mengadopsi konsep dari:
- 🎯 **KitaLulus** - Simple, fast, Indonesia-focused
- 🎯 **Indeed** - Comprehensive features, search-focused
- 🎯 **JobStreet** - Professional, location-based

**Unique Selling Point**: Alur lebih ringkas, modern, dan Indonesia-native.

---

## 🧱 SCOPE APLIKASI (High Level)

### 1️⃣ Public Job Portal (Tanpa Login)

Pengguna dapat **tanpa login** untuk:
- Melihat daftar lowongan kerja
- Melihat detail lowongan
- Mencari dan memfilter pekerjaan

**Login Requirement**: Hanya saat user menekan tombol **"Lamar Pekerjaan"**

### 2️⃣ Authentication System (Conditional)

Login/Register hanya muncul saat:
- User ingin melamar pekerjaan
- User ingin menyimpan CV

**Karakteristik Autentikasi**:
- Email & password
- Simple, cepat, tanpa proses berbelit
- JWT atau session-based
- Optional social login (future)

### 3️⃣ CV Builder Terintegrasi

Sistem menyediakan form pembuatan CV yang:
- Disimpan sebagai data terstruktur (JSON / DB)
- Bisa dipakai ulang untuk banyak lamaran
- Bisa di-export ke PDF (ATS-friendly)
- Support multiple CV per user

---

## 🔄 CORE USER FLOWS

### FLOW 1: User Baru (Belum Login)

```
User → Open Website
  ↓
Melihat Job Listing + Search + Filter
  ↓
Klik Lowongan
  ↓
Baca Detail Pekerjaan
  ↓
Klik "Lamar Pekerjaan"
  ↓
Sistem → Cek Status Login
  ↓
Redirect ke Halaman Login/Register
```

### FLOW 2: Login / Register

```
User → Email & Password Input
  ↓
Validasi & Create Account
  ↓
Set Authentication Token
  ↓
Redirect ke Job Detail
  ↓
User Status = Authenticated
```

### FLOW 3: CV Builder

```
User → Authenticated
  ↓
Check: CV sudah ada?
  ↓
JIKA TIDAK:
  Redirect ke Halaman Buat CV
  ↓
  Fill Form:
  - Data Pribadi
  - Pendidikan
  - Pengalaman Kerja
  - Skill
  - Sertifikasi (opsional)
  ↓
  Preview CV
  ↓
  Download PDF / Save
  ↓
  CV Stored in DB for Reuse
```

### FLOW 4: Apply Job

```
User → Authenticated + CV Ready
  ↓
Klik "Lamar Pekerjaan"
  ↓
Ambil Data CV User
  ↓
Asosiasikan CV ke job_id
  ↓
Set Status = "Submitted"
  ↓
Show Success Notification
  ↓
Track di User Dashboard (future)
```

---

## 🔍 PENCARIAN & FILTER JOB

### Filter Wajib Ada

#### 1. **Lokasi**
- Auto-detect lokasi terdekat (jika izin diberikan)
- Manual pilih kota/provinsi
- Radius distance (opsional)

#### 2. **Kata Kunci**
- Job title search
- Skill search
- Company name search

#### 3. **Jenis Pekerjaan**
- Full-time
- Part-time
- Freelance

#### 4. **Rentang Gaji (Opsional)**
- Min/Max filter
- Flexible hours

### Behavior

- Filter tidak membutuhkan login
- Realtime update job list
- Pagination / infinite scroll
- Persistent filter state

---

## 🧩 STRUKTUR FITUR (MODULE-BASED)

### 🧑‍💻 Frontend Modules

| Module | Purpose |
|--------|---------|
| **Home / Job List Page** | Browse job listings, search, filter |
| **Job Detail Page** | Show job details, apply button |
| **Login / Register Modal** | Auth UI (modal or full page) |
| **CV Builder Page** | Create/edit CV |
| **Apply Job Flow** | Apply workflow |
| **PDF Preview & Download** | CV export functionality |
| **Empty States & Error Handling** | UX for edge cases |

### ⚙️ Backend Modules

| Module | Responsibility |
|--------|-----------------|
| **Authentication & Authorization** | JWT/Session, role-based access |
| **User Management** | Profile, preferences |
| **Job Management** | CRUD jobs, search, filter |
| **CV Management** | CRUD CV, versioning |
| **Job Application Management** | Track applications |
| **Location & Geo-filter** | Distance calculation |
| **PDF Generation Service** | Convert CV to PDF |

---

## 🗄️ DATA RELATIONSHIP

### Entity Relationship Diagram (Simplified)

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email       │
│ password    │
│ name        │
│ location    │
│ created_at  │
└──────┬──────┘
       │
       ├─── hasOne ──→ CV (1:1)
       │
       └─── hasMany ──→ JobApplication (1:N)


┌─────────────────┐
│      CV         │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ title           │
│ data (JSON)     │ ← Structured CV data
│ created_at      │
│ updated_at      │
└─────────────────┘


┌──────────────┐
│     Job      │
├──────────────┤
│ id (PK)      │
│ company_id   │
│ title        │
│ description  │
│ location     │
│ type         │
│ salary_min   │
│ salary_max   │
│ created_at   │
└────┬─────────┘
     │
     └─── hasMany ──→ JobApplication (1:N)


┌──────────────────────┐
│  JobApplication      │
├──────────────────────┤
│ id (PK)              │
│ user_id (FK)         │
│ job_id (FK)          │
│ cv_id (FK)           │ ← Snapshot CV
│ status               │ ← submitted, reviewed, accepted
│ created_at           │
│ updated_at           │
└──────────────────────┘


┌──────────────┐
│   Company    │
├──────────────┤
│ id (PK)      │
│ name         │
│ description  │
│ logo         │
│ website      │
└──────────────┘
```

---

## 📋 Key Data Models

### User Model
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "password": "hashed_password",
  "name": "John Doe",
  "phone": "0812xxx",
  "location": "Jakarta",
  "bio": "...",
  "created_at": "2026-01-16T10:00:00Z",
  "updated_at": "2026-01-16T10:00:00Z"
}
```

### CV Model
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "CV Profesional",
  "data": {
    "personal_info": {
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "0812xxx",
      "location": "Jakarta",
      "summary": "..."
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
        "duration": "2020 - Present",
        "description": "..."
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
  },
  "created_at": "2026-01-16T10:00:00Z",
  "updated_at": "2026-01-16T10:00:00Z"
}
```

### Job Model
```json
{
  "id": "uuid",
  "company_id": "uuid",
  "title": "Senior Backend Developer",
  "description": "We're looking for...",
  "location": "Jakarta, Indonesia",
  "type": "Full-time",
  "salary_min": 15000000,
  "salary_max": 25000000,
  "skills_required": ["Node.js", "PostgreSQL", "Docker"],
  "posted_at": "2026-01-16T10:00:00Z",
  "expires_at": "2026-02-16T10:00:00Z"
}
```

---

## ✅ Current Status

- ✅ Frontend structure (React + TypeScript)
- ✅ UI components with Shadcn/ui
- ✅ Flat design color system (#2563EB, #10B981)
- ✅ Responsive layout
- ⏳ Backend API (to be implemented)
- ⏳ Authentication service
- ⏳ Database schema
- ⏳ PDF generation service

---

## 📚 Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture
- [FEATURES.md](./FEATURES.md) - Feature checklist
- [API_ROADMAP.md](./API_ROADMAP.md) - Backend endpoints
- [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) - Bugs & risks
- [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) - Design system colors

---

**Last Updated**: January 16, 2026  
**Version**: 1.0  
**Status**: ✅ Active Development
