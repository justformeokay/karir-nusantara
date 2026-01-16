# ⚠️ Karir Nusantara - Known Issues & Risk Assessment

## 🚨 Critical Issues

### 1. ❌ Apply Job Without CV

**Severity**: 🔴 CRITICAL  
**Status**: ⚠️ NOT IMPLEMENTED YET

**Problem**: 
User can click "Lamar Pekerjaan" button but doesn't have a CV yet.

**Impact**:
- Application fails if CV doesn't exist
- Poor user experience
- Data consistency issues

**Solution**:
```
User clicks "Lamar Pekerjaan"
    ↓
Check: Does user have CV?
    ↓
    YES → Proceed to apply
    NO  → Show modal: "Complete your CV first"
        → Redirect to CV Builder
        → Auto-return to job detail after CV saved
```

**Implementation Location**: `components/auth/AuthModal.tsx`, `pages/JobDetailPage.tsx`

---

### 2. ❌ CV Update Not Synced to Old Applications

**Severity**: 🔴 CRITICAL  
**Status**: ⚠️ NEEDS DESIGN DECISION

**Problem**:
User updates CV, but old job applications still reference old CV snapshot.

**Scenarios**:
- User applies with CV v1
- User updates CV v1 → CV v2
- Company sees old CV (v1) for that application
- CV mismatch with what user intended

**Solutions** (Choose one):

#### Option A: Immutable CV Snapshots (RECOMMENDED)
```
When user applies:
├── Take snapshot of current CV
├── Save as cv_snapshot in JobApplication
├── Store reference: cv_id + snapshot_id
└── Company always sees snapshot, not live CV

Advantage: Historical accuracy, legal compliance
Disadvantage: More storage
```

#### Option B: Always Latest CV
```
When company views application:
├── Fetch latest user CV
└── Display current version (not historical)

Advantage: Simplicity
Disadvantage: CV might differ from when applied
```

#### Option C: Versioning System
```
CV has versions:
├── cv_version_1
├── cv_version_2 (current)
└── JobApplication references cv_version_1

User can view differences
Advantage: Transparency
Disadvantage: Complex implementation
```

**Recommendation**: Use **Option A (Immutable Snapshots)**

**Database Schema Change**:
```prisma
model JobApplication {
  id        String
  userId    String
  jobId     String
  
  // Current approach
  cvId      String      // Links to current CV
  
  // IMPROVED approach
  cvSnapshot Json      // Store CV data at time of application
  cvVersion  Int       // Which version was used (v1, v2, etc)
  
  status    String
}
```

---

### 3. ❌ Race Condition in PDF Generation

**Severity**: 🟠 HIGH  
**Status**: ⚠️ POTENTIAL BUG

**Problem**:
Multiple users generating PDF simultaneously → Server overload

**Scenario**:
```
User A: PDF export started → 2 seconds
User B: PDF export started → 2 seconds
User C: PDF export started → 2 seconds

Total: 3 concurrent processes
If 1000 concurrent users: Server crash
```

**Solution**:

#### Option 1: Queue System (RECOMMENDED)
```javascript
// Use Bull Queue or RabbitMQ
import Queue from 'bull';

const pdfQueue = new Queue('pdf-generation', {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true
  }
});

// Add job to queue
app.post('/api/cv/:id/export-pdf', async (req, res) => {
  const job = await pdfQueue.add({ cvId: req.params.id });
  res.json({ jobId: job.id, status: 'queued' });
});

// Process queue
pdfQueue.process(async (job) => {
  const cv = await CV.findById(job.data.cvId);
  const pdf = await generatePDF(cv);
  return { url: pdf.url };
});
```

#### Option 2: Debounce + Caching
```javascript
const pdfCache = new Map();

app.get('/api/cv/:id/export-pdf', async (req, res) => {
  const cacheKey = `pdf_${req.params.id}`;
  
  // Return cached if exists
  if (pdfCache.has(cacheKey)) {
    return res.download(pdfCache.get(cacheKey));
  }
  
  // Generate and cache
  const pdf = await generatePDF(cv);
  pdfCache.set(cacheKey, pdf.path);
  
  // Cache expiry: 1 hour
  setTimeout(() => pdfCache.delete(cacheKey), 3600000);
  
  res.download(pdf.path);
});
```

#### Option 3: Background Job
```javascript
app.post('/api/cv/:id/export-pdf', async (req, res) => {
  const job = await PDFJob.create({
    cvId: req.params.id,
    userId: req.user.id,
    status: 'pending'
  });
  
  // Return immediately with job ID
  res.json({ jobId: job.id, status: 'processing' });
  
  // Process in background
  generatePDFAsync(job.id);
});

// Check job status
app.get('/api/pdf-jobs/:jobId', async (req, res) => {
  const job = await PDFJob.findById(req.params.jobId);
  res.json({
    status: job.status, // pending, processing, completed, failed
    url: job.status === 'completed' ? job.fileUrl : null
  });
});
```

**Recommendation**: Use **Option 1 (Queue System)**

---

### 4. ❌ Location Filter Accuracy

**Severity**: 🟠 HIGH  
**Status**: ⚠️ NEEDS IMPLEMENTATION

**Problem**:
Location filtering might not be accurate:
- Geolocation API issues
- Job location not standardized
- Distance calculation inaccurate

**Issues**:
```
User says: "Jakarta"
Job says: "Jakarta Timur"
Job says: "Jakarta, Indonesia"
Job says: "Jkt"
Job says: "13210" (postal code)

Fuzzy matching needed
```

**Solution**:

#### Database Normalization
```prisma
model Location {
  id            String @id
  province      String  // e.g., "DKI Jakarta"
  city          String  // e.g., "Jakarta Selatan"
  district      String  // e.g., "Senayan"
  postalCode    String
  latitude      Float
  longitude     Float
  
  jobs Job[]
}

model Job {
  id            String
  locationId    String  // Foreign key
  location      Location @relation(fields: [locationId], references: [id])
}
```

#### Geo-Query with PostGIS
```sql
-- Find jobs within 10km of user location
SELECT * FROM jobs
WHERE ST_Distance_Sphere(location_point, user_point) < 10000;
```

#### Frontend Implementation
```typescript
// Geolocation API
const getLocationService = {
  getCurrentLocation: async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => reject(error)
      );
    });
  }
};

// Search by distance
const jobAPI = {
  findNearbyJobs: async (lat: number, lng: number, radiusKm: number = 10) => {
    const response = await fetch(
      `/api/jobs/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`
    );
    return response.json();
  }
};
```

---

### 5. ❌ Authorization Leak (Access CV of Other Users)

**Severity**: 🔴 CRITICAL  
**Status**: ⚠️ SECURITY RISK

**Problem**:
Any authenticated user could access CV data of other users.

**Vulnerable Code** (DON'T DO THIS):
```javascript
// VULNERABLE: No authorization check
app.get('/api/cv/:id', async (req, res) => {
  const cv = await CV.findById(req.params.id);
  res.json(cv); // Anyone can see ANY cv
});
```

**Solution**: Add Authorization Check

```javascript
// SECURE: Check ownership
app.get('/api/cv/:id', authenticateJWT, async (req, res) => {
  const cv = await CV.findById(req.params.id);
  
  // Verify that CV belongs to current user
  if (cv.userId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  res.json(cv);
});
```

**Best Practice**: Create Authorization Middleware

```typescript
// middleware/authorize.ts
export const authorizeCV = async (req, res, next) => {
  const cvId = req.params.id;
  const userId = req.user.id;
  
  const cv = await CV.findById(cvId);
  
  if (!cv || cv.userId !== userId) {
    return res.status(403).json({
      error: 'You do not have permission to access this CV'
    });
  }
  
  req.cv = cv; // Attach to request
  next();
};

// Usage
app.get('/api/cv/:id', authenticateJWT, authorizeCV, (req, res) => {
  res.json(req.cv);
});

app.put('/api/cv/:id', authenticateJWT, authorizeCV, (req, res) => {
  // Update CV
});

app.delete('/api/cv/:id', authenticateJWT, authorizeCV, (req, res) => {
  // Delete CV
});
```

---

## ⚠️ High Priority Issues

### 6. Redirect After Login

**Severity**: 🟠 HIGH  
**Status**: ⚠️ NEEDS IMPLEMENTATION

**Problem**:
After login, user redirects to home page instead of returning to previous page.

**User Expectation**:
```
User on Job Detail Page
    ↓
Clicks "Lamar Pekerjaan"
    ↓
Redirected to login
    ↓
User logs in
    ↓
EXPECTED: Back to Job Detail + Apply
ACTUAL: Back to Home page (WRONG!)
```

**Solution**:

```typescript
// Store redirect URL in auth context
export const useAuth = () => {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  
  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      // Navigate to redirect URL or home
      window.location.href = redirectUrl || '/';
    }
  };
  
  return { login, setRedirectUrl };
};

// In AuthModal component
const AuthModal = ({ isOpen, onClose, redirectTo }) => {
  const { setRedirectUrl } = useAuth();
  
  useEffect(() => {
    if (redirectTo) {
      setRedirectUrl(redirectTo);
    }
  }, [redirectTo]);
  
  // ...
};

// In JobDetailPage
const navigate = useNavigate();
const handleApplyClick = () => {
  showAuthModal({
    redirectTo: `/job/${jobId}`
  });
};
```

---

### 7. State Management (Login vs Guest)

**Severity**: 🟠 HIGH  
**Status**: ⚠️ NEEDS CAREFUL HANDLING

**Problem**:
User state might be inconsistent between:
- Local storage
- React context
- Backend session

**Scenario**:
```
User logged in
    ↓
Close browser / Session expires
    ↓
User returns to site
    ↓
Local storage has token
    ↓
But token invalid on backend
    ↓
UI shows logged in, but API calls fail (INCONSISTENT!)
```

**Solution**: Validate Token on App Load

```typescript
// App.tsx
useEffect(() => {
  const validateToken = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      return;
    }
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const user = await response.json();
        setUser(user);
      } else {
        // Token invalid
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Token validation failed');
      setUser(null);
    }
  };
  
  validateToken();
}, []);
```

---

### 8. Broken Mobile UI

**Severity**: 🟠 HIGH  
**Status**: ⚠️ TESTING NEEDED

**Potential Issues on Mobile**:
- Job card layout breaks
- Filter panel unresponsive
- CV builder forms not touch-friendly
- Buttons too small
- Text not readable

**Testing Checklist**:
- [ ] Job list on iPhone (375px)
- [ ] Job list on tablet (768px)
- [ ] Landscape orientation
- [ ] Touch interactions
- [ ] Form input on mobile
- [ ] Modal/dialog responsiveness
- [ ] PDF preview on mobile

**Prevention**:
```typescript
// Always test with mobile-first
// Use Tailwind responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Single column on mobile */}
</div>

// Test with actual device or:
// - Chrome DevTools device emulation
// - BrowserStack
// - Physical devices
```

---

### 9. Inconsistent CTA State

**Severity**: 🟠 HIGH  
**Status**: ⚠️ NEEDS TESTING

**Problem**:
"Lamar Pekerjaan" button state might be inconsistent:
- Not disabled when user has applied
- Not loading while applying
- No error feedback
- No success animation

**Solution**:

```typescript
const LamarButton = ({ jobId, isApplied, onApply }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(isApplied);
  
  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onApply();
      setHasApplied(true);
      // Show success toast
    } catch (error) {
      // Show error toast
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={hasApplied || isLoading}
      className={`
        px-6 py-2 rounded font-semibold transition-all
        ${hasApplied 
          ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
        }
        ${isLoading ? 'opacity-75' : ''}
      `}
    >
      {isLoading && <Loader className="inline mr-2 h-4 w-4 animate-spin" />}
      {hasApplied ? '✓ Sudah Dilamar' : 'Lamar Pekerjaan'}
    </button>
  );
};
```

---

### 10. Loading & Empty State Handling

**Severity**: 🟡 MEDIUM  
**Status**: ⚠️ INCOMPLETE

**Problem**:
- No loading skeleton while fetching jobs
- No error message when API fails
- No empty state message when no jobs found

**Solution**:

```typescript
const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/jobs');
        if (!response.ok) throw new Error('Failed to fetch');
        setJobs(await response.json());
        setError(null);
      } catch (err) {
        setError(err.message);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // LOADING STATE
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }
  
  // ERROR STATE
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  // EMPTY STATE
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <BriefcaseIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Tidak ada lowongan pekerjaan</p>
      </div>
    );
  }
  
  // SUCCESS STATE
  return (
    <div className="space-y-4">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};
```

---

## 📋 Issue Tracking Matrix

| Issue | Severity | Status | Priority | Owner |
|-------|----------|--------|----------|-------|
| Apply without CV | 🔴 CRITICAL | TODO | P0 | Backend |
| CV sync to applications | 🔴 CRITICAL | TODO | P0 | Backend |
| PDF race condition | 🟠 HIGH | TODO | P1 | Backend |
| Location accuracy | 🟠 HIGH | TODO | P1 | Backend |
| CV authorization leak | 🔴 CRITICAL | TODO | P0 | Backend |
| Redirect after login | 🟠 HIGH | TODO | P1 | Frontend |
| State management | 🟠 HIGH | TODO | P1 | Frontend |
| Mobile broken UI | 🟠 HIGH | TODO | P1 | Frontend |
| CTA state inconsistent | 🟠 HIGH | TODO | P1 | Frontend |
| Loading/empty states | 🟡 MEDIUM | TODO | P2 | Frontend |

---

## 🔍 Testing Checklist

- [ ] Apply flow without CV
- [ ] Apply flow with CV
- [ ] CV update after applying
- [ ] PDF export (single & multiple concurrent)
- [ ] Location filter accuracy
- [ ] CV access by other users (should fail)
- [ ] Login redirect flow
- [ ] State persistence on refresh
- [ ] Mobile responsive design
- [ ] Button states (loading, disabled, error)
- [ ] Empty states
- [ ] Error handling

---

## 📚 Related Documentation

- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [FEATURES.md](./FEATURES.md) - Feature specifications

---

**Last Updated**: January 16, 2026  
**Version**: 1.0  
**Status**: ✅ Risk Assessment Complete
