import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, SearchX, Loader2 } from 'lucide-react';
import SearchBar from '@/components/jobs/SearchBar';
import JobFilters from '@/components/jobs/JobFilters';
import JobCard from '@/components/jobs/JobCard';
import { mockJobs, salaryRanges, type Job as MockJob } from '@/data/jobs';
import { useJobs } from '@/hooks/useJobs';
import { type Job as ApiJob, getJobTypeLabel } from '@/api/jobs';

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

  // Fetch jobs from API with proper params
  const { data: apiResponse, isLoading, isError } = useJobs({
    search: debouncedKeyword || undefined,
    province: filters.province !== 'all' ? filters.province : undefined,
    job_type: filters.type !== 'all' ? filters.type : undefined,
    per_page: 50,
  });

  // Transform API jobs to frontend format or use mock data as fallback
  const jobs = useMemo(() => {
    if (apiResponse?.jobs && apiResponse.jobs.length > 0) {
      // Transform API format to frontend format (JobCard expects MockJob format)
      return apiResponse.jobs.map((apiJob: ApiJob): MockJob => ({
        id: String(apiJob.id),
        title: apiJob.title,
        company: apiJob.company?.name || 'Unknown Company',
        companyLogo: apiJob.company?.logo_url || '',
        location: apiJob.location || `${apiJob.city}, ${apiJob.province}`,
        province: apiJob.province || '',
        type: getJobTypeLabel(apiJob.jobType) as MockJob['type'],
        category: 'Teknologi', // Default category
        salaryMin: apiJob.salaryMin,
        salaryMax: apiJob.salaryMax,
        salaryCurrency: apiJob.salaryCurrency || 'IDR',
        description: apiJob.description || '',
        requirements: apiJob.requirements?.split('\n').filter(Boolean) || [],
        benefits: apiJob.benefits?.split('\n').filter(Boolean) || [],
        postedAt: apiJob.createdAt || new Date().toISOString(),
        deadline: undefined,
        isRemote: apiJob.isRemote || false,
        experienceLevel: apiJob.experienceLevel as MockJob['experienceLevel'] || 'entry',
        tags: apiJob.skills || [],
      }));
    }
    // Fallback to mock data if API returns empty or error
    return mockJobs;
  }, [apiResponse]);

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

  // Client-side filtering for additional filters not supported by API
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Category filter (client-side since API might not support it yet)
      if (filters.category !== 'all' && job.category !== filters.category) {
        return false;
      }

      // Salary filter
      const salaryIndex = parseInt(filters.salaryRange);
      if (salaryIndex > 0) {
        const range = salaryRanges[salaryIndex];
        const jobSalary = job.salaryMax || job.salaryMin || 0;
        if (jobSalary < range.min || jobSalary > range.max) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, filters]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Lowongan Kerja
          </h1>
          <p className="text-muted-foreground">
            Temukan pekerjaan impian Anda dari ribuan lowongan terbaru
          </p>
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
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
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
