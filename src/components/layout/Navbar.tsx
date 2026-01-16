import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText, Briefcase, User, LogOut, UserCircle, Sparkles, Zap, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import logo from '@/assets/karir-nusantara.png';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/lowongan', label: 'Lowongan Kerja', icon: Briefcase },
    { to: '/buat-cv', label: 'Buat CV', icon: FileText },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Karir Nusantara" className="h-10 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive(link.to) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  
                  <Link to="/lamaran-saya">
                    <Button variant="outline" size="sm" className="gap-2 border-blue-500/30 bg-blue-50 hover:bg-blue-100 text-blue-700">
                      <ClipboardList className="w-4 h-4" />
                      Lamaran Saya
                    </Button>
                  </Link>
                  <Link to="/rekomendasi">
                    <Button variant="outline" size="sm" className="gap-2 border-primary/30 hover:bg-primary/10">
                      <Sparkles className="w-4 h-4" />
                      Rekomendasi
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" size="sm" className="gap-2">
                      <UserCircle className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => setIsLogoutDialogOpen(true)}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)}>
                  <User className="w-4 h-4 mr-2" />
                  Masuk
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t border-border"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive(link.to) ? 'bg-primary-light text-primary' : 'hover:bg-accent'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Masuk sebagai <span className="font-semibold text-foreground">{user?.name}</span>
                      </p>
                      <Link to="/lamaran-saya" className="block mb-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full gap-2 border-blue-500/30 bg-blue-50 hover:bg-blue-100 text-blue-700">
                          <ClipboardList className="w-4 h-4" />
                          Lamaran Saya
                        </Button>
                      </Link>
                      <Link to="/rekomendasi" className="block mb-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full gap-2">
                          <Sparkles className="w-4 h-4" />
                          Rekomendasi
                        </Button>
                      </Link>
                      <Link to="/profile" className="block mb-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full gap-2">
                          <UserCircle className="w-4 h-4" />
                          Profile Saya
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full" onClick={() => setIsLogoutDialogOpen(true)}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Keluar
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => setIsAuthModalOpen(true)}>
                      <User className="w-4 h-4 mr-2" />
                      Masuk / Daftar
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar? Anda perlu login kembali untuk mengakses akun Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogout} className="bg-destructive hover:bg-destructive/90">
              Keluar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Navbar;
