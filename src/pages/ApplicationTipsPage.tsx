import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Lightbulb,
  FileText,
  MessageSquare,
  Target,
  Calendar,
  User,
  Briefcase,
  Heart,
  Send,
  AlertCircle,
  TrendingUp,
  Award,
  Clock,
  Zap,
  Eye,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ApplicationTipsPage: React.FC = () => {
  const [expandedTip, setExpandedTip] = useState<number | null>(0);

  const tips = [
    {
      icon: FileText,
      title: 'Siapkan CV yang Menarik',
      description: 'CV adalah kesan pertama Anda kepada recruiter',
      details: [
        'Gunakan format yang rapi dan profesional',
        'Cantumkan pengalaman kerja yang relevan dengan posisi yang dilamar',
        'Highlight pencapaian dan skill utama Anda',
        'Gunakan bahasa yang jelas dan mudah dipahami',
        'Pastikan tidak ada typo atau kesalahan grammar',
        'Update CV secara berkala dengan pengalaman terbaru',
      ],
      color: 'from-blue-500/20 to-blue-500/5',
      borderColor: 'border-blue-500/30',
    },
    {
      icon: Target,
      title: 'Pilih Lowongan yang Sesuai',
      description: 'Cari posisi yang match dengan skill Anda',
      details: [
        'Baca job description dengan teliti',
        'Pastikan skill dan pengalaman Anda sesuai dengan requirements',
        'Perhatikan gaji yang ditawarkan',
        'Cek benefit dan work environment perusahaan',
        'Prioritaskan perusahaan yang sejalan dengan nilai Anda',
        'Jangan hanya asal melamar semua posisi',
      ],
      color: 'from-green-500/20 to-green-500/5',
      borderColor: 'border-green-500/30',
    },
    {
      icon: MessageSquare,
      title: 'Tulis Cover Letter yang Kuat',
      description: 'Jelaskan mengapa Anda cocok untuk posisi ini',
      details: [
        'Buat cover letter yang personal dan relevan untuk setiap posisi',
        'Mulai dengan perkenalan diri yang singkat namun menarik',
        'Jelaskan mengapa Anda tertarik dengan perusahaan tersebut',
        'Highlight pengalaman yang relevan dengan posisi',
        'Tunjukkan bagaimana Anda bisa memberikan value',
        'Tutup dengan ajakan untuk diskusi lebih lanjut',
      ],
      color: 'from-purple-500/20 to-purple-500/5',
      borderColor: 'border-purple-500/30',
    },
    {
      icon: Eye,
      title: 'Optimalkan Profil Online Anda',
      description: 'Recruiter akan mencari informasi tentang Anda',
      details: [
        'Lengkapi profil LinkedIn dengan foto profesional',
        'Pastikan bio dan headline mencerminkan profesionalisme Anda',
        'Tunjukkan portfolio atau project yang telah Anda buat',
        'Update status pekerjaan dan availability',
        'Aktif di community atau forum yang relevan',
        'Hindari konten pribadi yang tidak profesional',
      ],
      color: 'from-orange-500/20 to-orange-500/5',
      borderColor: 'border-orange-500/30',
    },
    {
      icon: Clock,
      title: 'Waktu Melamar yang Tepat',
      description: 'Jangan menunggu terlalu lama untuk melamar',
      details: [
        'Melamar segera setelah lowongan dipublikasikan',
        'Umumnya response rate terbaik di awal pembukaan lowongan',
        'Melamar pada jam kerja (pukul 08:00-17:00)',
        'Hindari melamar saat weekend atau hari libur',
        'Follow up jika belum mendapat respons setelah 1 minggu',
        'Jangan melamar berulang kali di waktu yang berdekatan',
      ],
      color: 'from-red-500/20 to-red-500/5',
      borderColor: 'border-red-500/30',
    },
    {
      icon: Zap,
      title: 'Persiapkan Diri untuk Interview',
      description: 'Siap memberikan kesan terbaik saat interview',
      details: [
        'Research tentang perusahaan: visi, misi, produk/layanan',
        'Pelajari job description dan siapkan contoh pengalaman yang relevan',
        'Berlatih menjawab pertanyaan umum interview',
        'Siapkan pertanyaan untuk pewawancara tentang posisi dan perusahaan',
        'Cek koneksi internet dan peralatan jika interview online',
        'Tampil dengan pakaian yang sesuai (business casual atau formal)',
      ],
      color: 'from-yellow-500/20 to-yellow-500/5',
      borderColor: 'border-yellow-500/30',
    },
  ];

  const tutorialSteps = [
    {
      step: 1,
      title: 'Buat Akun dan Lengkapi Profil',
      description: 'Mulai dengan mendaftar akun baru atau login ke akun existing',
      actions: [
        'Klik tombol Login/Register di halaman utama',
        'Isi data diri: nama, email, nomor HP, dan password',
        'Pergi ke halaman Profile untuk melengkapi informasi',
        'Pastikan semua data terisi dengan benar',
      ],
      icon: User,
    },
    {
      step: 2,
      title: 'Jelajahi Lowongan Kerja',
      description: 'Cari lowongan yang sesuai dengan skill dan minat Anda',
      actions: [
        'Klik menu "Lowongan Kerja" di navigation bar',
        'Gunakan filter kategori untuk mempersempit pencarian',
        'Baca job description dengan teliti',
        'Simpan lowongan favorit dengan klik tombol hati',
      ],
      icon: Briefcase,
    },
    {
      step: 3,
      title: 'Siapkan CV Anda',
      description: 'Buat atau upload CV profesional Anda',
      actions: [
        'Klik menu "Buat CV" di navigation bar',
        'Pilih: buat CV baru atau upload file CV yang sudah ada',
        'Jika membuat baru, isi section: personal info, experience, education, skills',
        'Preview CV Anda sebelum menyimpan',
      ],
      icon: FileText,
    },
    {
      step: 4,
      title: 'Daftar Lowongan',
      description: 'Kirimkan aplikasi Anda untuk lowongan pilihan',
      actions: [
        'Buka detail lowongan yang ingin Anda lamar',
        'Klik tombol "Lamar Sekarang"',
        'Review CV yang akan dikirim',
        'Tambahkan cover letter jika diperlukan',
        'Klik "Konfirmasi Lamaran"',
      ],
      icon: Send,
    },
    {
      step: 5,
      title: 'Pantau Status Lamaran',
      description: 'Cek perkembangan aplikasi Anda secara real-time',
      actions: [
        'Pergi ke halaman Profile > Tab "Lamaran Saya"',
        'Lihat status setiap lamaran: Menunggu, Sedang Ditinjau, Diterima, atau Ditolak',
        'Klik detail untuk melihat informasi lengkap lowongan',
        'Siap untuk dipanggil interview jika status berubah',
      ],
      icon: Heart,
    },
    {
      step: 6,
      title: 'Follow Up dan Persiapan Interview',
      description: 'Aktif follow up dan persiapkan diri untuk interview',
      actions: [
        'Jika belum ada respons setelah 1 minggu, silakan follow up',
        'Persiapkan diri untuk kemungkinan interview',
        'Research tentang perusahaan dan posisi yang dilamar',
        'Siapkan portfolio atau contoh karya Anda',
      ],
      icon: TrendingUp,
    },
  ];

  const mistakes = [
    {
      mistake: 'Mengirim CV yang tidak sesuai',
      solution: 'Customize CV untuk setiap posisi, highlight skill yang relevan',
      icon: AlertCircle,
    },
    {
      mistake: 'Asal melamar tanpa membaca job description',
      solution: 'Baca dengan teliti dan pastikan kualifikasi Anda sesuai',
      icon: Eye,
    },
    {
      mistake: 'CV penuh dengan typo atau grammar error',
      solution: 'Proofread berkali-kali sebelum mengirim',
      icon: FileText,
    },
    {
      mistake: 'Tidak ada cover letter atau motivasi yang jelas',
      solution: 'Tulis cover letter yang personal dan menunjukkan motivasi Anda',
      icon: MessageSquare,
    },
    {
      mistake: 'Tidak mempersiapkan diri untuk interview',
      solution: 'Research perusahaan dan latihan jawab pertanyaan interview',
      icon: Award,
    },
    {
      mistake: 'Contact info yang tidak jelas atau tidak aktif',
      solution: 'Pastikan nomor HP dan email selalu aktif dan mudah dihubungi',
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <Badge className="gap-2 px-4 py-2 bg-primary/10 text-primary border-primary/30">
              <Lightbulb className="w-4 h-4" />
              Panduan Melamar
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Panduan Lengkap Melamar Kerja
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pelajari tips dan trik untuk meningkatkan peluang Anda diterima oleh perusahaan impian
          </p>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-primary" />
            Tips & Trik Melamar
          </h2>

          <div className="space-y-4">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              const isExpanded = expandedTip === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-gradient-to-br ${tip.color} border ${tip.borderColor} rounded-xl overflow-hidden transition-all`}
                >
                  <button
                    onClick={() => setExpandedTip(isExpanded ? null : index)}
                    className="w-full p-6 flex items-start justify-between hover:bg-black/5 transition-colors"
                  >
                    <div className="flex items-start gap-4 text-left flex-1">
                      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-lg mb-1">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 ml-4"
                    >
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/10 bg-black/5"
                    >
                      <div className="p-6 space-y-3">
                        {tip.details.map((detail, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-foreground">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tutorial Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Tutorial Melamar di Platform Karir Nusantara
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorialSteps.map((item, index) => {
              const IconStep = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary text-lg">
                          {item.step}
                        </span>
                      </div>
                      <IconStep className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>

                  <ul className="space-y-2">
                    {item.actions.map((action, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Common Mistakes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-destructive" />
            Kesalahan Umum yang Harus Dihindari
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mistakes.map((item, index) => {
              const IconMistake = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-destructive/5 border border-destructive/20 rounded-lg p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <IconMistake className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {item.mistake}
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    ✓ {item.solution}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Siap untuk Memulai?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Mulai jelajahi ribuan lowongan kerja dan kirimkan aplikasi Anda hari ini. Setiap aplikasi adalah kesempatan untuk mencapai karir impian Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/lowongan">
              <Button size="lg" className="gap-2">
                <Briefcase className="w-5 h-5" />
                Jelajahi Lowongan
              </Button>
            </a>
            <a href="/buat-cv">
              <Button size="lg" variant="outline" className="gap-2">
                <FileText className="w-5 h-5" />
                Buat CV
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationTipsPage;
