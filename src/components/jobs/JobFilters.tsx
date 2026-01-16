import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Wallet, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { provinces, jobCategories, jobTypes, salaryRanges } from '@/data/jobs';
import { Badge } from '@/components/ui/badge';

interface FiltersState {
  province: string;
  category: string;
  type: string;
  salaryRange: string;
}

interface JobFiltersProps {
  filters: FiltersState;
  onFilterChange: (key: keyof FiltersState, value: string) => void;
  onClearFilters: () => void;
  resultCount: number;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount,
}) => {
  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 md:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filter Lowongan</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount} aktif
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Lokasi
          </label>
          <Select value={filters.province} onValueChange={v => onFilterChange('province', v)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Semua Lokasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Lokasi</SelectItem>
              {provinces.map(province => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Kategori
          </label>
          <Select value={filters.category} onValueChange={v => onFilterChange('category', v)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {jobCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Tipe Pekerjaan
          </label>
          <Select value={filters.type} onValueChange={v => onFilterChange('type', v)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {jobTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Salary Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Gaji
          </label>
          <Select value={filters.salaryRange} onValueChange={v => onFilterChange('salaryRange', v)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Semua Gaji" />
            </SelectTrigger>
            <SelectContent>
              {salaryRanges.map((range, index) => (
                <SelectItem key={range.label} value={index.toString()}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{resultCount}</span> lowongan
        </p>
      </div>
    </motion.div>
  );
};

export default JobFilters;
