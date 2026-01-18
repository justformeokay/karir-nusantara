import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  Mail,
  Phone,
  Briefcase,
  Heart,
  FileText,
  LogOut,
  Edit2,
  Calendar,
  ArrowRight,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Save,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext.new';
import { useApplications } from '@/contexts/ApplicationContext.new';
import { useWishlist, useRemoveFromWishlist, useWishlistStats } from '@/hooks/useWishlist';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { applications, isLoading: applicationsLoading } = useApplications();
  const { data: wishlistData, isLoading: wishlistLoading } = useWishlist();
  const { data: wishlistStats } = useWishlistStats();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  
  const [activeTab, setActiveTab] = useState<'applications' | 'saved' | 'cv'>('applications');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Get saved jobs from API
  const savedJobs = wishlistData?.items || [];

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Silakan login terlebih dahulu
          </h2>
          <Button onClick={() => navigate('/')}>Kembali ke Beranda</Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    logout();
    toast.success('Berhasil logout');
    setIsLogoutDialogOpen(false);
    navigate('/');
  };

  const handleSaveProfile = () => {
    toast.success('Profil berhasil diperbarui!');
    setIsEditModalOpen(false);
  };

  const handleRemoveApplication = (appId: string) => {
    // For now just show toast - would need withdraw API
    toast.success('Lamaran berhasil dihapus');
  };

  const handleRemoveSavedJob = (jobId: number) => {
    removeFromWishlistMutation.mutate(jobId);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Menunggu', variant: 'secondary' as const, icon: Clock },
      reviewed: { label: 'Sedang Ditinjau', variant: 'default' as const, icon: CheckCircle },
      accepted: { label: 'Diterima', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Ditolak', variant: 'destructive' as const, icon: AlertCircle },
    };
    const info = statusMap[status as keyof typeof statusMap];
    const Icon = info.icon;
    return (
      <Badge variant={info.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {info.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        {/* Profile Header with Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl p-8 md:p-10 border border-primary/10 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-start gap-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg"
                  >
                    <UserIcon className="w-12 h-12 text-primary-foreground" />
                  </motion.div>
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {user.name}
                    </h1>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    variant="outline"
                    className="flex-1 md:flex-none gap-2 border-primary/30 hover:bg-primary/10"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  <Link to="/rekomendasi">
                    <Button
                      variant="default"
                      className="flex-1 md:flex-none gap-2"
                    >
                      <Briefcase className="w-4 h-4" />
                      Rekomendasi
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="flex-1 md:flex-none gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              label: 'Lamaran Dikirim',
              value: applications.length,
              icon: Briefcase,
              color: 'from-blue-500/20 to-blue-500/5',
            },
            {
              label: 'Lowongan Disimpan',
              value: wishlistStats?.total_saved || savedJobs.length,
              icon: Heart,
              color: 'from-red-500/20 to-red-500/5',
            },
            {
              label: 'Lamaran Diterima',
              value: applications.filter(app => app.currentStatus === 'hired' || app.currentStatus === 'offer_extended').length,
              icon: CheckCircle,
              color: 'from-green-500/20 to-green-500/5',
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:border-white/40 transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
        >
          <Tabs defaultValue="applications" className="w-full" onValueChange={(value) => setActiveTab(value as 'applications' | 'saved' | 'cv')}>
            <div className="border-b border-border bg-muted/30">
              <TabsList className="grid w-full grid-cols-3 gap-0 rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="applications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 px-6 py-4"
                >
                  <Briefcase className={`w-4 h-4 ${activeTab === 'applications' ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">Lamaran Saya</span>
                  <span className="sm:hidden">Lamaran</span>
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 px-6 py-4"
                >
                  <Heart className={`w-4 h-4 ${activeTab === 'saved' ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">Wishlist</span>
                  <span className="sm:hidden">Simpan</span>
                </TabsTrigger>
                <TabsTrigger
                  value="cv"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 px-6 py-4"
                >
                  <FileText className={`w-4 h-4 ${activeTab === 'cv' ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">CV Saya</span>
                  <span className="sm:hidden">CV</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Applications Tab */}
            <TabsContent value="applications" className="p-6 md:p-8 space-y-4 m-0">
              {applicationsLoading ? (
                <div className="py-20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : applications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-20 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
                    className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-blue-500/5 flex items-center justify-center mx-auto mb-6"
                  >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/30 to-transparent opacity-50" />
                    <Briefcase className="w-12 h-12 text-blue-600 relative z-10" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Belum Ada Lamaran
                  </h3>
                  <p className="text-muted-foreground mb-2 text-base">
                    Anda belum memiliki pekerjaan yang dilamar
                  </p>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
                    Mulai jelajahi ribuan lowongan menarik dari perusahaan terbaik di Indonesia. Semakin cepat Anda melamar, semakin besar peluang untuk mendapatkan pekerjaan impian.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/rekomendasi">
                      <Button size="lg" className="gap-2 w-full sm:w-auto">
                        <Briefcase className="w-5 h-5" />
                        Lihat Rekomendasi
                      </Button>
                    </Link>
                    <Link to="/lowongan">
                      <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                        <ArrowRight className="w-5 h-5" />
                        Lihat Tips Melamar
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                applications.map((app, index) => {
                  const job = app.job;

                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col md:flex-row gap-4 md:items-center justify-between p-5 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all group"
                    >
                      <div className="flex gap-4 flex-1">
                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {job.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2 truncate">
                            {job.company} • {job.location}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(app.appliedAt).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {getStatusBadge(app.currentStatus)}
                        <div className="flex gap-2">
                          <Link to={`/lowongan/${job.id}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <ArrowRight className="w-3 h-3" />
                              <span className="hidden sm:inline">Detail</span>
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveApplication(app.id)}
                            className="hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </TabsContent>

            {/* Saved Jobs Tab */}
            <TabsContent value="saved" className="p-6 md:p-8 space-y-4 m-0">
              {wishlistLoading ? (
                <div className="py-20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : savedJobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-20 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
                    className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-red-500/20 via-red-500/10 to-red-500/5 flex items-center justify-center mx-auto mb-6"
                  >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/30 to-transparent opacity-50" />
                    <Heart className="w-12 h-12 text-red-600 relative z-10" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Wishlist Kosong
                  </h3>
                  <p className="text-muted-foreground mb-2 text-base">
                    Anda belum menyimpan pekerjaan apapun
                  </p>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
                    Simpan lowongan favorit Anda untuk kemudian. Dengan menyimpan lowongan, Anda dapat dengan mudah kembali ke pekerjaan yang tertarik tanpa perlu mencarinya lagi.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/lowongan">
                      <Button size="lg" className="gap-2 w-full sm:w-auto">
                        <Heart className="w-5 h-5" />
                        Jelajahi Lowongan
                      </Button>
                    </Link>
                    <Link to="/tips-melamar">
                      <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                        <ArrowRight className="w-5 h-5" />
                        Rekomendasi Untuk Anda
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                savedJobs.map((saved, index) => {
                  const job = saved.job;

                  return (
                    <motion.div
                      key={saved.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col md:flex-row gap-4 md:items-center justify-between p-5 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all group"
                    >
                      <div className="flex gap-4 flex-1">
                        <div className="w-14 h-14 rounded-lg bg-red-500/10 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {job.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2 truncate">
                            {job.company.name} • {job.location}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Heart className="w-3 h-3" />
                            Disimpan{' '}
                            {new Date(saved.savedAt).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Badge variant="secondary">{job.jobType}</Badge>
                        <div className="flex gap-2">
                          <Link to={`/lowongan/${job.id}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <ArrowRight className="w-3 h-3" />
                              <span className="hidden sm:inline">Detail</span>
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSavedJob(job.id)}
                            disabled={removeFromWishlistMutation.isPending}
                            className="hover:bg-destructive/10"
                          >
                            {removeFromWishlistMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 text-destructive" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </TabsContent>

            {/* CV Tab */}
            <TabsContent value="cv" className="p-6 md:p-8 m-0">
              <div className="py-16 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mx-auto mb-6"
                >
                  <FileText className="w-10 h-10 text-purple-500" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Kelola CV Anda
                </h3>
                <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                  Buat atau upload CV profesional Anda untuk meningkatkan peluang diterima oleh perusahaan impian.
                </p>
                <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                  CV yang lengkap dan menarik adalah kunci untuk membuat kesan pertama yang baik kepada recruiter.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/buat-cv">
                    <Button size="lg" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Buat CV Baru
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Upload CV
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <h2 className="text-xl font-bold text-foreground">Edit Profile</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Nama Lengkap</label>
                  <Input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={editFormData.name}
                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    value={editFormData.email}
                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Nomor HP</label>
                  <Input
                    type="tel"
                    placeholder="08xx xxxx xxxx"
                    value={editFormData.phone}
                    onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-border bg-muted/30">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Batal
                </Button>
                <Button className="flex-1 gap-2" onClick={handleSaveProfile}>
                  <Save className="w-4 h-4" />
                  Simpan
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar? Anda perlu login kembali untuk mengakses profil Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} className="bg-destructive hover:bg-destructive/90">
              Keluar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfilePage;
