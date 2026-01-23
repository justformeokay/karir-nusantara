import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, SearchX, Loader2, Plus } from 'lucide-react';
import SearchBar from '@/components/jobs/SearchBar';
import JobFilters from '@/components/jobs/JobFilters';
import JobCard from '@/components/jobs/JobCard';
import { salaryRanges } from '@/data/jobs';
import { useInfiniteJobs } from '@/hooks/useJobs';
import { type Job as ApiJob } from '@/api/jobs';

// Map frontend job types to backend API format
const JOB_TYPE_MAP: Record<string, string> = {
  'Full-time': 'full_time',
  'Part-time': 'part_time',
  'Freelance': 'freelance',
  'Magang': 'internship',
  'Kontrak': 'contract',
};

const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [keyword, setKeyword] = useState(initialKeyword);
  const [debouncedKeyword, setDebouncedKeyword] = useState(initialKeyword);
  const [filters, setFilters] = useState({
    province: 'all',
    category: initialCategory || 'all',
    type: 'all',
    salaryRange: '0',
  });

  // Debounce keyword for API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Get salary range for API call
  const getSalaryRange = () => {
    const salaryIndex = parseInt(filters.salaryRange);
    if (salaryIndex > 0 && salaryIndex < salaryRanges.length) {
      const range = salaryRanges[salaryIndex];
      return {
        min: range.min > 0 ? range.min : undefined,
        max: range.max !== Infinity ? range.max : undefined,
      };
    }
    return { min: undefined, max: undefined };
  };

  const salaryRange = getSalaryRange();

  // Ref for infinite scroll detection
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch jobs from API with infinite scroll
  const { 
    data, 
    isLoading, 
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage 
  } = useInfiniteJobs({
    search: debouncedKeyword || undefined,
    province: filters.province !== 'all' ? filters.province : undefined,
    job_type: filters.type !== 'all' ? JOB_TYPE_MAP[filters.type] || filters.type : undefined,
    salary_min: salaryRange.min,
    salary_max: salaryRange.max,
  });

  // Flatten all pages into a single array of jobs
  const jobs = useMemo(() => {
    if (!data?.pages) return [];
    const allJobs = data.pages.flatMap(page => page.jobs || []);
    return allJobs;
  }, [data?.pages]);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [handleObserver]);

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
    const params = new URLSearchParams(searchParams);
    if (newKeyword) {
      params.set('q', newKeyword);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      province: 'all',
      category: 'all',
      type: 'all',
      salaryRange: '0',
    });
    setKeyword('');
    setSearchParams({});
  };

  // Apply client-side category filter (backend doesn't support category filter)
  const filteredJobs = useMemo(() => {
    if (filters.category === 'all') {
      return jobs;
    }

    // Category keyword mapping for filtering
    const categoryKeywords: Record<string, string[]> = {
      'Teknologi': ['software', 'developer', 'programmer', 'engineer', 'backend', 'frontend', 'fullstack', 'full stack', 'devops', 'mobile', 'web', 'tech', 'it', 'data', 'ai', 'ml', 'qa', 'quality assurance'],
      'Marketing': ['marketing', 'digital marketing', 'content', 'seo', 'social media', 'brand', 'campaign'],
      'Keuangan': ['finance', 'accounting', 'akuntan', 'keuangan', 'akuntansi', 'tax', 'pajak', 'treasury'],
      'Desain': ['design', 'designer', 'ui', 'ux', 'graphic', 'grafis', 'creative'],
      'Customer Service': ['customer service', 'cs', 'support', 'help desk', 'customer support'],
      'Human Resources': ['hr', 'human resource', 'recruitment', 'recruiter', 'talent'],
      'Sales': ['sales', 'penjualan', 'account executive', 'business development'],
      'Operasional': ['operational', 'operations', 'operasional', 'admin', 'administrasi'],
      'Pendidikan': ['teacher', 'guru', 'pengajar', 'education', 'training', 'instructor'],
      'Kesehatan': ['health', 'medical', 'nurse', 'doctor', 'kesehatan', 'medis'],
      'Konstruksi': ['construction', 'civil', 'arsitek', 'architect', 'building'],
      'Manufaktur': ['manufacturing', 'production', 'produksi', 'factory'],
    };

    const keywords = categoryKeywords[filters.category] || [];
    if (keywords.length === 0) {
      return jobs;
    }

    return jobs.filter(job => {
      const searchText = `${job.title} ${job.description || ''}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
    });
  }, [jobs, filters.category]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Lowongan Kerja
            </h1>
            <p className="text-muted-foreground">
              Temukan pekerjaan impian Anda dari ribuan lowongan terbaru
            </p>
          </div>
          <Link
            to="/dashboard/jobs/create"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Buat Loker</span>
          </Link>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <SearchBar
            initialKeyword={keyword}
            onSearch={(kw) => handleSearch(kw)}
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredJobs.length}
          />
        </motion.div>

        {/* Job List */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Memuat lowongan...</p>
          </motion.div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
              <SearchX className="w-10 h-10 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Gagal memuat lowongan kerja. Silakan coba lagi.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary font-semibold hover:underline"
            >
              Muat Ulang
            </button>
          </motion.div>
        ) : filteredJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredJobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}
            </div>
            
            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memuat lebih banyak...</span>
                </div>
              ) : hasNextPage ? (
                <button
                  onClick={() => fetchNextPage()}
                  className="text-primary font-medium hover:underline"
                >
                  Muat lebih banyak lowongan
                </button>
              ) : jobs.length > 10 ? (
                <p className="text-muted-foreground text-sm">
                  Semua lowongan telah ditampilkan ({jobs.length} lowongan)
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted-foreground/10 mb-6">
              <SearchX className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Tidak ada lowongan ditemukan
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Coba ubah filter pencarian atau kata kunci untuk menemukan lebih banyak lowongan
            </p>
            <button
              onClick={handleClearFilters}
              className="text-primary font-semibold hover:underline"
            >
              Reset semua filter
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
