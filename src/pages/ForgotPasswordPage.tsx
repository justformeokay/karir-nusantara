import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPassword } from '@/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email harus diisi');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim email reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Email Terkirim!
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Kami telah mengirimkan link reset password ke email Anda. 
                Silakan cek inbox atau folder spam Anda.
              </p>

              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Link reset password dikirim ke:
                </p>
                <p className="text-sm font-medium text-foreground">
                  {email}
                </p>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground text-left bg-muted/30 rounded-lg p-4 mb-6">
                <p className="font-medium text-foreground">⏱️ Catatan Penting:</p>
                <ul className="space-y-2 ml-4 list-disc">
                  <li>Link hanya berlaku selama <strong>5 menit</strong></li>
                  <li>Periksa folder spam jika email tidak masuk</li>
                  <li>Jangan bagikan link ke siapapun</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Kirim Ulang Email
                </Button>
                
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-foreground/5 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Lupa Password?
            </h1>
            
            <p className="text-muted-foreground">
              Masukkan email Anda untuk menerima link reset password
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
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Gunakan email yang terdaftar pada akun Anda
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Mengirim Email...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Kirim Link Reset Password
                </>
              )}
            </Button>

            <div className="text-center">
              <Link 
                to="/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Login
              </Link>
            </div>
          </form>

          {/* Security Note */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-xs text-center text-muted-foreground">
              🔒 Email reset password akan dikirim dengan enkripsi yang aman
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
