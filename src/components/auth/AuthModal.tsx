import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, Phone, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let success = false;
      if (mode === 'login') {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.name, formData.email, formData.password, formData.phone);
      }

      if (success) {
        toast.success(mode === 'login' ? 'Berhasil masuk!' : 'Pendaftaran berhasil!');
        onClose();
        setFormData({ name: '', email: '', phone: '', password: '' });
      } else {
        toast.error('Terjadi kesalahan. Periksa kembali data Anda.');
      }
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Placeholder untuk Google authentication
      // Implementasi sebenarnya akan menggunakan Google OAuth library
      toast.info('Fitur Google Sign-In akan segera tersedia');
    } catch {
      toast.error('Terjadi kesalahan saat login dengan Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-8 pb-0">
              <h2 className="text-2xl font-bold text-foreground">
                {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {mode === 'login'
                  ? 'Masuk untuk melamar pekerjaan impian Anda'
                  : 'Daftar gratis dan mulai cari kerja'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="pl-11 h-12"
                    required
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nomor HP</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="08xx xxxx xxxx"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-11 h-12"
                      required={mode === 'register'}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 pr-11 h-12"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Memproses...
                  </>
                ) : mode === 'login' ? (
                  'Masuk'
                ) : (
                  'Daftar Sekarang'
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">atau</span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12" 
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <Chrome className="w-5 h-5 mr-2" />
                {mode === 'login' ? 'Masuk dengan Google' : 'Daftar dengan Google'}
              </Button>

              <div className="text-center text-sm">
                {mode === 'login' ? (
                  <p className="text-muted-foreground">
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-primary font-semibold hover:underline"
                    >
                      Daftar Gratis
                    </button>
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Sudah punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-primary font-semibold hover:underline"
                    >
                      Masuk
                    </button>
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
