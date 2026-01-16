import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  initialKeyword?: string;
  initialLocation?: string;
  onSearch?: (keyword: string, location: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  variant = 'compact',
  initialKeyword = '',
  initialLocation = '',
  onSearch,
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [isDetecting, setIsDetecting] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(keyword, location);
    } else {
      const params = new URLSearchParams();
      if (keyword) params.set('q', keyword);
      if (location) params.set('location', location);
      navigate(`/lowongan?${params.toString()}`);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        // In a real app, you'd reverse geocode the coordinates
        setLocation('Jakarta');
        setIsDetecting(false);
      },
      () => {
        setIsDetecting(false);
      }
    );
  };

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex flex-col md:flex-row gap-3 p-3 md:p-2 bg-background rounded-2xl shadow-xl">
          {/* Keyword Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Posisi, skill, atau perusahaan..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="pl-12 h-14 border-0 bg-muted/50 text-base rounded-xl focus-visible:ring-primary"
            />
          </div>

          {/* Location Input */}
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Kota atau provinsi..."
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="pl-12 pr-28 h-14 border-0 bg-muted/50 text-base rounded-xl focus-visible:ring-primary"
            />
            <button
              type="button"
              onClick={detectLocation}
              disabled={isDetecting}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary hover:underline disabled:opacity-50"
            >
              {isDetecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Deteksi Lokasi'
              )}
            </button>
          </div>

          {/* Search Button */}
          <Button type="submit" size="lg" className="h-14 px-8 rounded-xl text-base font-semibold">
            <Search className="w-5 h-5 mr-2" />
            Cari Lowongan
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari posisi atau perusahaan..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="pl-11 h-11"
        />
      </div>
      <Button type="submit" className="h-11">
        <Search className="w-4 h-4 md:mr-2" />
        <span className="hidden md:inline">Cari</span>
      </Button>
    </form>
  );
};

export default SearchBar;
