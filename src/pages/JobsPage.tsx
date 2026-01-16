import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, SearchX } from 'lucide-react';
import SearchBar from '@/components/jobs/SearchBar';
import JobFilters from '@/components/jobs/JobFilters';
import JobCard from '@/components/jobs/JobCard';
import { mockJobs, salaryRanges } from '@/data/jobs';

const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [keyword, setKeyword] = useState(initialKeyword);
  const [filters, setFilters] = useState({
    province: 'all',
    category: initialCategory || 'all',
    type: 'all',
    salaryRange: '0',
  });

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

  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      // Keyword filter
      if (keyword) {
        const searchLower = keyword.toLowerCase();
        const matchesKeyword =
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower);
        if (!matchesKeyword) return false;
      }

      // Province filter
      if (filters.province !== 'all' && job.province !== filters.province) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && job.category !== filters.category) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && job.type !== filters.type) {
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
  }, [keyword, filters]);

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
        {filteredJobs.length > 0 ? (
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
