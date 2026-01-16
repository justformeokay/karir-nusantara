import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Briefcase,
  MessageSquare,
  Gift,
  XCircle,
  Filter,
  Search,
  ChevronDown,
  RefreshCw,
  ArrowUpDown,
  AlertCircle,
} from 'lucide-react';
import { ApplicationCard } from '@/components/applications';
import { useApplications } from '@/contexts/ApplicationContext';
import { ApplicationStatus, APPLICATION_STATUS_CONFIG } from '@/data/applications';

// ============================================
// TYPES
// ============================================

type FilterType = 'all' | 'active' | 'interview' | 'offer' | 'rejected';
type SortType = 'newest' | 'oldest' | 'status';

// ============================================
// STATS CARD COMPONENT
// ============================================

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onClick?: () => void;
  isActive?: boolean;
}

function StatsCard({ title, value, icon, color, bgColor, onClick, isActive }: StatsCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        p-4 rounded-xl border text-left transition-all w-full
        ${isActive ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50' : 'bg-white border-gray-200 hover:border-gray-300'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${bgColor}`}>
          <div className={color}>{icon}</div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </motion.button>
  );
}

// ============================================
// FILTER CHIPS COMPONENT
// ============================================

interface FilterChipsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

function FilterChips({ activeFilter, onFilterChange }: FilterChipsProps) {
  const filters: { type: FilterType; label: string }[] = [
    { type: 'all', label: 'Semua' },
    { type: 'active', label: 'Aktif' },
    { type: 'interview', label: 'Interview' },
    { type: 'offer', label: 'Penawaran' },
    { type: 'rejected', label: 'Tidak Lolos' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <button
          key={filter.type}
          onClick={() => onFilterChange(filter.type)}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            ${activeFilter === filter.type
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================

function EmptyState({ filter }: { filter: FilterType }) {
  const messages: Record<FilterType, { title: string; description: string }> = {
    all: {
      title: 'Belum ada lamaran',
      description: 'Mulai lamar pekerjaan impianmu dan pantau progressnya di sini.',
    },
    active: {
      title: 'Tidak ada lamaran aktif',
      description: 'Semua lamaranmu sudah selesai diproses.',
    },
    interview: {
      title: 'Tidak ada jadwal interview',
      description: 'Kamu belum memiliki jadwal interview.',
    },
    offer: {
      title: 'Belum ada penawaran',
      description: 'Terus semangat! Penawaran akan segera datang.',
    },
    rejected: {
      title: 'Tidak ada lamaran yang ditolak',
      description: 'Semua lamaranmu masih dalam proses.',
    },
  };

  const { title, description } = messages[filter];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <FileText className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 mt-1">{description}</p>
      <a
        href="/lowongan"
        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Search className="w-4 h-4" />
        Cari Lowongan
      </a>
    </motion.div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function MyApplicationsPage() {
  const { applications, stats, isLoading, withdrawApplication, refreshApplications } = useApplications();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter applications
  const filteredApplications = applications.filter(app => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        app.job.title.toLowerCase().includes(query) ||
        app.job.company.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Status filter
    switch (filter) {
      case 'active':
        return app.isActive;
      case 'interview':
        return ['interview_scheduled', 'interview_completed'].includes(app.currentStatus);
      case 'offer':
        return ['offer_extended', 'hired'].includes(app.currentStatus);
      case 'rejected':
        return app.currentStatus === 'rejected';
      default:
        return true;
    }
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
      case 'status':
        return APPLICATION_STATUS_CONFIG[b.currentStatus].order - 
               APPLICATION_STATUS_CONFIG[a.currentStatus].order;
      case 'newest':
      default:
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
    }
  });

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleWithdraw = async (id: string) => {
    await withdrawApplication(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Lamaran Saya</h1>
            <p className="text-blue-100">
              Pantau progress semua lamaran pekerjaanmu di satu tempat
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard
            title="Total Lamaran"
            value={stats.total}
            icon={<FileText className="w-5 h-5" />}
            color="text-blue-600"
            bgColor="bg-blue-100"
            onClick={() => setFilter('all')}
            isActive={filter === 'all'}
          />
          <StatsCard
            title="Sedang Proses"
            value={stats.active}
            icon={<Briefcase className="w-5 h-5" />}
            color="text-amber-600"
            bgColor="bg-amber-100"
            onClick={() => setFilter('active')}
            isActive={filter === 'active'}
          />
          <StatsCard
            title="Interview"
            value={stats.interviews}
            icon={<MessageSquare className="w-5 h-5" />}
            color="text-cyan-600"
            bgColor="bg-cyan-100"
            onClick={() => setFilter('interview')}
            isActive={filter === 'interview'}
          />
          <StatsCard
            title="Penawaran"
            value={stats.offers}
            icon={<Gift className="w-5 h-5" />}
            color="text-emerald-600"
            bgColor="bg-emerald-100"
            onClick={() => setFilter('offer')}
            isActive={filter === 'offer'}
          />
        </div>
      </div>

      {/* Response Rate Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Tingkat Respons: <span className="text-green-600">{stats.responseRate}%</span>
              </p>
              <p className="text-xs text-gray-500">
                Rata-rata respons dalam {stats.averageResponseDays} hari
              </p>
            </div>
          </div>
          <button
            onClick={refreshApplications}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari lowongan atau perusahaan..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Filter Chips */}
              <FilterChips activeFilter={filter} onFilterChange={setFilter} />

              {/* Sort */}
              <div className="relative ml-auto sm:ml-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="status">Status</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          // Loading Skeleton
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedApplications.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {sortedApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ApplicationCard
                  application={application}
                  isExpanded={expandedId === application.id}
                  onToggleExpand={() => handleToggleExpand(application.id)}
                  onWithdraw={handleWithdraw}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState filter={filter} />
        )}
      </div>
    </div>
  );
}
