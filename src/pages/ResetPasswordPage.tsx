import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyResetToken, resetPassword } from '@/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Token tidak valid');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await verifyResetToken(token);
        if (response.valid) {
          setIsValidToken(true);
          setEmail(response.email || '');
        } else {
          setError('Link reset password tidak valid atau sudah kadaluarsa');
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memverifikasi token');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password minimal 8 karakter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password harus mengandung minimal 1 huruf kapital');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password harus mengandung minimal 1 huruf kecil');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password harus mengandung minimal 1 angka');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!newPassword) {
      setError('Password baru harus diisi');
      return;
    }

    const validationErrors = validatePassword(newPassword);
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, newPassword);
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal mereset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-foreground/5">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memverifikasi link reset password...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-foreground/5 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-lg p-8 border">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Password Berhasil Diubah!
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Password Anda telah berhasil diperbarui. Anda akan diarahkan ke halaman login...
              </p>

              <div className="animate-pulse">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-[slideRight_3s_ease-in-out]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-foreground/5 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-lg p-8 border">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Link Tidak Valid
              </h2>
              
              <p className="text-muted-foreground mb-6">
                {error || 'Link reset password tidak valid atau sudah kadaluarsa.'}
              </p>

              <div className="space-y-3">
                <Link to="/forgot-password">
                  <Button className="w-full">
                    Minta Link Baru
                  </Button>
                </Link>
                
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Kembali ke Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-foreground/5 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Reset Password
            </h1>
            
            <p className="text-sm text-muted-foreground">
              Akun: <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={isSubmitting}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">Syarat Password:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className={newPassword.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}>
                  • Minimal 8 karakter
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}>
                  • Minimal 1 huruf kapital
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}>
                  • Minimal 1 huruf kecil
                </li>
                <li className={/[0-9]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}>
                  • Minimal 1 angka
                </li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan Password...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Reset Password
                </>
              )}
            </Button>

            <div className="text-center">
              <Link 
                to="/login"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Kembali ke Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
