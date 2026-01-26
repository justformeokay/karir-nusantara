import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface BugReport {
  title: string;
  description: string;
  category: string;
  severity: string;
  affectedFeature: string;
  stepsToReproduce: string;
  email: string;
  browserInfo: string;
}

const BugReportingPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BugReport>({
    title: '',
    description: '',
    category: '',
    severity: '',
    affectedFeature: '',
    stepsToReproduce: '',
    email: '',
    browserInfo: `${navigator.userAgent}`,
  });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { value: 'ui', label: 'UI/Design Issue' },
    { value: 'functionality', label: 'Feature Not Working' },
    { value: 'performance', label: 'Performance Issue' },
    { value: 'login', label: 'Login/Authentication' },
    { value: 'payment', label: 'Payment/Transaction' },
    { value: 'search', label: 'Search/Filter Issue' },
    { value: 'upload', label: 'File Upload Issue' },
    { value: 'notification', label: 'Notification Issue' },
    { value: 'mobile', label: 'Mobile App Issue' },
    { value: 'other', label: 'Other' },
  ];

  const severities = [
    { value: 'low', label: 'Low - Minor inconvenience', color: 'bg-blue-100 text-blue-800' },
    { value: 'medium', label: 'Medium - Feature partially broken', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High - Major functionality broken', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical - Complete feature failure', color: 'bg-red-100 text-red-800' },
  ];

  const features = [
    { value: 'job-search', label: 'Job Search & Filters' },
    { value: 'job-detail', label: 'Job Detail Page' },
    { value: 'cv-builder', label: 'CV Builder' },
    { value: 'cv-checker', label: 'CV Checker' },
    { value: 'applications', label: 'My Applications' },
    { value: 'profile', label: 'Profile Management' },
    { value: 'recommendations', label: 'Job Recommendations' },
    { value: 'wishlist', label: 'Wishlist' },
    { value: 'authentication', label: 'Login/Registration' },
    { value: 'navigation', label: 'Navigation/Menu' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'other-feature', label: 'Other Feature' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Judul bug harus diisi');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Deskripsi bug harus diisi');
      return false;
    }
    if (!formData.category) {
      toast.error('Kategori bug harus dipilih');
      return false;
    }
    if (!formData.severity) {
      toast.error('Tingkat keparahan harus dipilih');
      return false;
    }
    if (!formData.affectedFeature) {
      toast.error('Fitur yang terpengaruh harus dipilih');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email harus diisi');
      return false;
    }
    if (!formData.email.includes('@')) {
      toast.error('Format email tidak valid');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real implementation, this would send to backend
      console.log('Bug Report Submitted:', formData);

      toast.success('Laporan bug berhasil terkirim! Terima kasih atas laporannya.');
      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          category: '',
          severity: '',
          affectedFeature: '',
          stepsToReproduce: '',
          email: '',
          browserInfo: `${navigator.userAgent}`,
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      toast.error('Gagal mengirim laporan bug. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4 mt-16">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Laporkan Bug</h1>
          </div>
          <p className="text-white/80 mt-3">
            Temukan bug? Bantu kami memperbaiki pengalaman Anda dengan melaporkan masalah yang Anda temukan
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          {isSubmitted && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6 flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">Terima Kasih!</h3>
                <p className="text-green-800 mt-1">
                  Laporan bug Anda telah diterima. Tim kami akan segera mengeceknya dan menghubungi Anda melalui email jika diperlukan informasi tambahan.
                </p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-blue-900 mb-2">💡 Tips untuk Laporan Bug yang Baik</h2>
            <ul className="text-sm text-blue-800 space-y-2 ml-4">
              <li>• Berikan judul yang jelas dan spesifik</li>
              <li>• Jelaskan langkah-langkah untuk mereproduksi bug secara detail</li>
              <li>• Sertakan informasi tentang browser dan perangkat yang Anda gunakan</li>
              <li>• Sebutkan apa yang Anda harapkan vs apa yang sebenarnya terjadi</li>
              <li>• Semakin detail laporan Anda, semakin cepat kami bisa memperbaikinya</li>
            </ul>
          </div>

          {/* Bug Report Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg border border-gray-200 p-8">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-semibold">
                Judul Bug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Contoh: Login tidak berfungsi dengan akun Google"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitted}
              />
              <p className="text-xs text-gray-500">Jelaskan bug dengan singkat dan jelas</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold">
                Deskripsi Detail <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Jelaskan apa yang terjadi, kapan terjadi, dan bagaimana perasaan Anda tentang hal ini..."
                rows={5}
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitted}
              />
              <p className="text-xs text-gray-500">Semakin detail semakin baik</p>
            </div>

            {/* Category & Severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">
                  Kategori Bug <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                  disabled={isSubmitted}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">
                  Tingkat Keparahan <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => handleSelectChange('severity', value)}
                  disabled={isSubmitted}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat..." />
                  </SelectTrigger>
                  <SelectContent>
                    {severities.map((sev) => (
                      <SelectItem key={sev.value} value={sev.value}>
                        {sev.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Affected Feature */}
            <div className="space-y-2">
              <Label className="font-semibold">
                Fitur yang Terpengaruh <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.affectedFeature}
                onValueChange={(value) => handleSelectChange('affectedFeature', value)}
                disabled={isSubmitted}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih fitur..." />
                </SelectTrigger>
                <SelectContent>
                  {features.map((feat) => (
                    <SelectItem key={feat.value} value={feat.value}>
                      {feat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Steps to Reproduce */}
            <div className="space-y-2">
              <Label htmlFor="stepsToReproduce" className="font-semibold">
                Langkah-Langkah Mereproduksi
              </Label>
              <Textarea
                id="stepsToReproduce"
                name="stepsToReproduce"
                placeholder="Contoh:
1. Login dengan email demo@example.com
2. Klik tombol 'Cari Lowongan'
3. Filter berdasarkan lokasi 'Jakarta'
4. Bug terjadi ketika..."
                rows={4}
                value={formData.stepsToReproduce}
                onChange={handleChange}
                disabled={isSubmitted}
              />
              <p className="text-xs text-gray-500">Semakin detail, semakin mudah kami menemukan bug</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">
                Email Kontak <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitted}
              />
              <p className="text-xs text-gray-500">Kami akan menghubungi Anda jika diperlukan informasi lebih lanjut</p>
            </div>

            {/* Browser Info - Read Only */}
            <div className="space-y-2">
              <Label className="font-semibold">Informasi Browser</Label>
              <div className="bg-gray-100 p-3 rounded border border-gray-300 text-sm text-gray-700 max-h-20 overflow-y-auto">
                {formData.browserInfo}
              </div>
              <p className="text-xs text-gray-500">Informasi ini dikumpulkan otomatis untuk membantu debugging</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading || isSubmitted}
                className="flex-1"
              >
                {isLoading ? 'Mengirim...' : isSubmitted ? '✓ Terkirim' : 'Kirim Laporan Bug'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    category: '',
                    severity: '',
                    affectedFeature: '',
                    stepsToReproduce: '',
                    email: '',
                    browserInfo: `${navigator.userAgent}`,
                  });
                }}
                disabled={isSubmitted}
              >
                Reset
              </Button>
            </div>
          </form>

          {/* Known Issues */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">🔍 Bug yang Sudah Diketahui</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Filter tidak mengupdate hasil pencarian',
                  status: 'In Progress',
                  severity: 'medium',
                },
                {
                  title: 'Notifikasi email terkadang tertunda',
                  status: 'Under Review',
                  severity: 'low',
                },
                {
                  title: 'CV Checker error pada file besar',
                  status: 'Being Fixed',
                  severity: 'medium',
                },
                {
                  title: 'Mobile menu tidak tutup otomatis',
                  status: 'Scheduled',
                  severity: 'low',
                },
              ].map((bug, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{bug.title}</h3>
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded">
                      {bug.severity === 'low' ? '🟢 Low' : '🟡 Medium'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Status: {bug.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Support Contact */}
          <div className="mt-12 pt-8 border-t border-gray-200 bg-purple-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-900">Butuh Bantuan Lain?</h2>
            <p className="text-purple-800 mb-6">
              Jika bug Anda sangat urgent atau Anda ingin berbicara langsung dengan tim support kami, silakan hubungi:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="mailto:bug@karirnusantara.id"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
              >
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-semibold text-gray-900">Email Support</p>
                  <p className="text-sm text-gray-600">bug@karirnusantara.id</p>
                </div>
              </a>
              <a
                href="https://wa.me/62881036480285"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-600">Chat dengan kami</p>
                </div>
              </a>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
            <Link to="/lowongan" className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Cari Lowongan
            </Link>
            <Link to="/faq" className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              FAQ
            </Link>
            <Link to="/" className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugReportingPage;
