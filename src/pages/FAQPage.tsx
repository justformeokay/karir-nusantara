import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  questions: {
    id: string;
    question: string;
    answer: string;
  }[];
}

const FAQPage: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>('general');

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories: FAQCategory[] = [
    {
      title: 'Tentang Platform',
      icon: '🌐',
      questions: [
        {
          id: 'general-1',
          question: 'Apa itu Karir Nusantara?',
          answer:
            'Karir Nusantara adalah platform pencarian kerja online terpercaya di Indonesia yang menghubungkan pencari kerja dengan perusahaan-perusahaan terkemuka. Platform kami menyediakan ribuan lowongan pekerjaan di berbagai industri dan lokasi di Indonesia.',
        },
        {
          id: 'general-2',
          question: 'Apakah layanan Karir Nusantara gratis?',
          answer:
            'Ya, layanan dasar Karir Nusantara sepenuhnya gratis untuk semua pencari kerja. Anda dapat membuat profil, membangun CV, dan melamar pekerjaan tanpa biaya. Kami juga menyediakan beberapa fitur premium yang bersifat opsional dengan harga terjangkau.',
        },
        {
          id: 'general-3',
          question: 'Siapa saja yang bisa menggunakan Karir Nusantara?',
          answer:
            'Siapa pun yang mencari pekerjaan di Indonesia dapat menggunakan Karir Nusantara. Anda hanya perlu berusia minimal 18 tahun dan memiliki email yang valid untuk membuat akun. Tidak ada batasan pendidikan atau pengalaman kerja - kami membuka lowongan untuk semua tingkat karir.',
        },
        {
          id: 'general-4',
          question: 'Apakah data saya aman di Karir Nusantara?',
          answer:
            'Keamanan data Anda adalah prioritas utama kami. Kami menggunakan enkripsi SSL/TLS, backup reguler, dan sistem keamanan berlapis untuk melindungi informasi pribadi Anda. Untuk detail lebih lanjut, silakan baca Kebijakan Privasi kami.',
        },
      ],
    },
    {
      title: 'Akun & Registrasi',
      icon: '👤',
      questions: [
        {
          id: 'account-1',
          question: 'Bagaimana cara membuat akun di Karir Nusantara?',
          answer:
            'Untuk membuat akun, klik tombol "Daftar" di halaman utama. Isi email, nama lengkap, dan buat password yang kuat. Anda juga bisa mendaftar menggunakan akun Google, Facebook, atau LinkedIn. Verifikasi email Anda dan akun siap digunakan.',
        },
        {
          id: 'account-2',
          question: 'Apakah saya bisa menggunakan satu email untuk multiple akun?',
          answer:
            'Tidak, setiap email hanya bisa digunakan untuk satu akun. Jika Anda ingin membuat akun baru, gunakan email yang berbeda. Anda dapat mengganti email di pengaturan akun kapan saja.',
        },
        {
          id: 'account-3',
          question: 'Bagaimana jika saya lupa password?',
          answer:
            'Klik "Lupa Password" di halaman login. Masukkan email akun Anda dan kami akan mengirimkan link reset password. Cek inbox atau folder spam Anda, lalu ikuti instruksi untuk membuat password baru.',
        },
        {
          id: 'account-4',
          question: 'Bagaimana cara menghapus akun saya?',
          answer:
            'Anda dapat menghapus akun melalui pengaturan akun. Klik menu profil → Pengaturan → Hapus Akun. Perlu diingat bahwa menghapus akun akan menghapus semua data Anda secara permanen dan tidak dapat dipulihkan.',
        },
      ],
    },
    {
      title: 'CV & Profil',
      icon: '📄',
      questions: [
        {
          id: 'cv-1',
          question: 'Bagaimana cara membuat CV di Karir Nusantara?',
          answer:
            'Klik menu "Buat CV" untuk memulai. Ikuti panduan step-by-step untuk mengisi informasi pribadi, pengalaman kerja, pendidikan, keterampilan, dan sertifikasi. Anda bisa memilih dari berbagai template profesional yang tersedia.',
        },
        {
          id: 'cv-2',
          question: 'Bisakah saya membuat lebih dari satu CV?',
          answer:
            'Ya, Anda bisa membuat multiple CV dengan fokus yang berbeda untuk posisi yang berbeda. Setiap CV dapat dikustomisasi sesuai kebutuhan. Saat melamar, pilih CV mana yang ingin Anda gunakan.',
        },
        {
          id: 'cv-3',
          question: 'Bagaimana cara mengupload CV dari file?',
          answer:
            'Di halaman CV, ada opsi untuk mengupload file PDF atau Word. File Anda akan dikonversi dan di-parse oleh sistem kami. Anda bisa mengedit informasi yang terekstrak untuk memastikan akurasi.',
        },
        {
          id: 'cv-4',
          question: 'Apakah saya bisa mengunduh CV saya sebagai PDF?',
          answer:
            'Ya, setiap CV yang Anda buat bisa diunduh sebagai PDF siap cetak. Klik tombol "Unduh PDF" di halaman CV Anda. Tersedia berbagai pilihan format dan template yang bisa disesuaikan.',
        },
        {
          id: 'cv-5',
          question: 'Apa itu CV Checker dan bagaimana cara menggunakannya?',
          answer:
            'CV Checker adalah alat yang menganalisis kualitas CV Anda dan memberikan saran perbaikan. Klik menu "Cek CV" untuk menganalisis CV Anda. Sistem akan memberikan skor dan rekomendasi spesifik untuk meningkatkan peluang Anda diterima.',
        },
      ],
    },
    {
      title: 'Melamar Pekerjaan',
      icon: '💼',
      questions: [
        {
          id: 'apply-1',
          question: 'Bagaimana cara melamar pekerjaan di Karir Nusantara?',
          answer:
            'Temukan lowongan yang Anda minati, klik detail lowongan, dan tekan tombol "Lamar". Pilih CV yang ingin digunakan, tambahkan pesan khusus jika diperlukan (opsional), lalu konfirmasi lamaran. Lamaran Anda akan langsung dikirim ke perusahaan.',
        },
        {
          id: 'apply-2',
          question: 'Apakah saya bisa melamar pekerjaan yang sama lebih dari satu kali?',
          answer:
            'Tidak, sistem kami akan mencegah Anda melamar pekerjaan yang sama lebih dari sekali. Jika Anda sudah melamar, status lamaran akan ditampilkan. Anda bisa melihat riwayat lamaran di menu "Lamaran Saya".',
        },
        {
          id: 'apply-3',
          question: 'Bagaimana saya bisa melacak status lamaran saya?',
          answer:
            'Semua lamaran Anda dapat dilihat di menu "Lamaran Saya". Di sana Anda bisa melihat status setiap lamaran (terkirim, dilihat, interview, ditolak, dll) dan komunukasi dengan perusahaan. Anda juga akan menerima notifikasi email untuk update penting.',
        },
        {
          id: 'apply-4',
          question: 'Bisakah saya membatalkan lamaran saya?',
          answer:
            'Ya, Anda bisa membatalkan lamaran dari menu "Lamaran Saya" selama lamaran masih berstatus "Terkirim" dan belum dilihat oleh perusahaan. Setelah perusahaan melihat lamaran, Anda tidak bisa membatalkan tetapi bisa menghubungi langsung melalui platform.',
        },
        {
          id: 'apply-5',
          question: 'Berapa banyak pekerjaan yang bisa saya lamar dalam sehari?',
          answer:
            'Tidak ada batasan jumlah lamaran per hari di Karir Nusantara. Anda bebas melamar sebanyak mungkin pekerjaan yang sesuai dengan profil Anda. Namun, kami merekomendasikan melamar dengan selektif dan memastikan setiap lamaran relevan dengan profil Anda.',
        },
      ],
    },
    {
      title: 'Pencarian & Filter Lowongan',
      icon: '🔍',
      questions: [
        {
          id: 'search-1',
          question: 'Bagaimana cara mencari lowongan pekerjaan spesifik?',
          answer:
            'Di halaman "Cari Lowongan", gunakan kolom pencarian untuk memasukkan job title atau kata kunci. Anda juga bisa menggunakan filter untuk lokasi, industri, tipe pekerjaan, gaji, dan pengalaman yang diinginkan untuk mempersempit hasil pencarian.',
        },
        {
          id: 'search-2',
          question: 'Apa itu fitur Rekomendasi Pekerjaan?',
          answer:
            'Fitur Rekomendasi menggunakan AI untuk menampilkan lowongan yang paling sesuai dengan profil, skill, dan preferensi Anda. Semakin lengkap profil Anda, semakin akurat rekomendasi yang diberikan. Akses melalui menu "Rekomendasi".',
        },
        {
          id: 'search-3',
          question: 'Bagaimana cara menyimpan lowongan yang saya sukai?',
          answer:
            'Klik ikon hati/star pada lowongan untuk menyimpannya ke Wishlist Anda. Anda bisa melihat semua lowongan yang disimpan dari halaman Wishlist. Ini berguna ketika Anda ingin membandingkan beberapa lowongan atau melamar kemudian.',
        },
        {
          id: 'search-4',
          question: 'Bagaimana cara mendapatkan notifikasi lowongan baru?',
          answer:
            'Aktifkan notifikasi di pengaturan akun Anda. Anda bisa mengatur preferensi notifikasi berdasarkan kategori pekerjaan, lokasi, dan level pengalaman. Notifikasi akan dikirim via email dan push notification di browser.',
        },
      ],
    },
    {
      title: 'Profil & Preferensi',
      icon: '⚙️',
      questions: [
        {
          id: 'profile-1',
          question: 'Mengapa penting melengkapi profil?',
          answer:
            'Profil lengkap meningkatkan peluang Anda untuk ditemukan oleh perusahaan. Perusahaan mencari kandidat dengan profil yang komplet dan relevan. Semakin lengkap profil Anda, semakin tinggi kemungkinan Anda mendapat interview.',
        },
        {
          id: 'profile-2',
          question: 'Apa informasi minimal yang harus saya isi di profil?',
          answer:
            'Informasi minimal meliputi: nama lengkap, email, nomor telepon, lokasi, dan minimal satu pengalaman kerja atau pendidikan. Namun, kami merekomendasikan melengkapi semua field termasuk summary, keterampilan, dan sertifikasi untuk hasil maksimal.',
        },
        {
          id: 'profile-3',
          question: 'Bagaimana cara mengubah preferensi pekerjaan saya?',
          answer:
            'Di menu "Profil", cari bagian "Preferensi Pekerjaan". Anda bisa mengubah lokasi yang diinginkan, kategori industri, tipe pekerjaan, gaji yang diharapkan, dan level pengalaman. Perubahan ini akan mempengaruhi rekomendasi yang diberikan.',
        },
        {
          id: 'profile-4',
          question: 'Bisakah saya membuat profil dengan nama samaran?',
          answer:
            'Kami tidak merekomendasikan menggunakan nama samaran karena profil Anda adalah representasi profesional Anda. Nama asli membangun kredibilitas dan kepercayaan dengan perusahaan. Namun, Anda bisa menggunakan nama depan dan belakang saja jika Anda tidak nyaman berbagi nama lengkap.',
        },
      ],
    },
    {
      title: 'Keamanan & Privasi',
      icon: '🔒',
      questions: [
        {
          id: 'security-1',
          question: 'Bagaimana saya bisa mengamankan akun saya?',
          answer:
            'Gunakan password yang kuat (kombinasi huruf, angka, dan simbol). Aktifkan two-factor authentication (2FA) di pengaturan keamanan. Jangan bagikan password Anda kepada siapapun dan selalu logout setelah menggunakan di perangkat publik.',
        },
        {
          id: 'security-2',
          question: 'Apa yang harus saya lakukan jika akun saya diretas?',
          answer:
            'Segera ubah password Anda melalui "Lupa Password". Hubungi tim support kami dengan detail tentang aktivitas mencurigakan. Kami akan membantu mengamankan akun Anda dan melakukan investigasi jika diperlukan.',
        },
        {
          id: 'security-3',
          question: 'Apakah data saya akan dibagikan ke pihak ketiga?',
          answer:
            'Kami hanya membagikan CV dan informasi kontak Anda ke perusahaan yang menerima lamaran Anda. Data Anda tidak akan dijual ke pihak ketiga atau digunakan untuk tujuan lain tanpa persetujuan Anda. Baca Kebijakan Privasi kami untuk detail lengkap.',
        },
        {
          id: 'security-4',
          question: 'Bisakah saya mengontrol siapa yang bisa melihat profil saya?',
          answer:
            'Ya, Anda bisa mengatur visibility profil di pengaturan privasi. Anda bisa memilih apakah profil Anda terlihat oleh semua perusahaan, perusahaan tertentu saja, atau tidak terlihat sama sekali. Anda juga bisa membuat CV menjadi private jika tidak ingin dibagikan.',
        },
      ],
    },
    {
      title: 'Tips & Best Practices',
      icon: '💡',
      questions: [
        {
          id: 'tips-1',
          question: 'Berapa lama waktu yang biasanya dibutuhkan perusahaan untuk merespon lamaran?',
          answer:
            'Waktu respons bervariasi tergantung perusahaan. Biasanya berkisar dari 2-7 hari untuk review awal. Perusahaan besar mungkin membutuhkan waktu lebih lama. Anda bisa melacak status di "Lamaran Saya" dan akan mendapat notifikasi saat ada update.',
        },
        {
          id: 'tips-2',
          question: 'Apa saja tips untuk membuat CV yang menarik?',
          answer:
            'Gunakan CV Checker kami untuk mendapat analisis detail. Tips umum: gunakan format yang rapi dan mudah dibaca, fokus pada achievement bukan hanya job description, sesuaikan untuk setiap lamaran, gunakan kata kunci yang relevan dengan posisi, dan minimal 70 untuk skor completeness.',
        },
        {
          id: 'tips-3',
          question: 'Bagaimana cara meningkatkan peluang diterima interview?',
          answer:
            'Lengkapi profil Anda secara detail, gunakan foto profil profesional, tambahkan summary yang menarik, upload CV berkualitas tinggi, aktifkan status "Siap Bekerja", dan secara rutin update profil dengan skill dan pengalaman terbaru Anda.',
        },
        {
          id: 'tips-4',
          question: 'Apakah saya harus menambahkan pesan saat melamar?',
          answer:
            'Menambahkan pesan personal dapat meningkatkan peluang Anda. Tunjukkan bahwa Anda telah meneliti perusahaan dan posisi, jelaskan mengapa Anda tertarik, dan highlight skill yang relevan. Namun, pesan tidak wajib - CV berkualitas sudah cukup.',
        },
      ],
    },
    {
      title: 'Troubleshooting',
      icon: '🆘',
      questions: [
        {
          id: 'trouble-1',
          question: 'Email verifikasi tidak sampai, apa yang harus saya lakukan?',
          answer:
            'Cek folder spam atau promotions. Jika tetap tidak ditemukan, klik "Kirim Ulang Email Verifikasi" di halaman login. Pastikan email yang Anda gunakan sudah benar. Jika masih bermasalah, hubungi tim support kami.',
        },
        {
          id: 'trouble-2',
          question: 'Saya tidak bisa login, padahal password saya benar.',
          answer:
            'Pastikan email yang Anda masukkan benar dan account sudah diverifikasi. Clear browser cache dan cookies, lalu coba lagi. Jika masih tidak bisa, gunakan "Lupa Password" untuk reset. Jika tetap bermasalah, hubungi support.',
        },
        {
          id: 'trouble-3',
          question: 'CV saya tidak terupload dengan baik, apa solusinya?',
          answer:
            'Pastikan file PDF atau Word berukuran kurang dari 5MB dan tidak terlalu banyak gambar. Coba browser lain atau perangkat lain. Jika gagal terus, buat CV langsung di platform kami daripada upload file. Tim support siap membantu jika ada masalah.',
        },
        {
          id: 'trouble-4',
          question: 'Saya tidak mendapat notifikasi update lamaran, bagaimana?',
          answer:
            'Cek pengaturan notifikasi di akun Anda dan pastikan sudah diaktifkan. Whitelist email kami agar tidak masuk ke spam. Jika menggunakan 2FA, pastikan nomor telepon Anda sudah benar untuk SMS notifikasi. Check "Lamaran Saya" secara berkala untuk update manual.',
        },
      ],
    },
  ];

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
            <HelpCircle className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Pertanyaan yang Sering Diajukan</h1>
          </div>
          <p className="text-white/80 mt-3">Temukan jawaban untuk pertanyaan umum tentang Karir Nusantara</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="mb-12">
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
              <input
                type="text"
                placeholder="Cari jawaban..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
              />
              <p className="text-sm text-gray-600 mt-3">
                💡 Tip: Gunakan kata kunci seperti "CV", "lamaran", "profile" untuk mencari lebih cepat
              </p>
            </div>
          </div>

          {/* Categories Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 md:gap-3">
              {categories.map((category) => (
                <button
                  key={category.title}
                  onClick={() => setOpenCategory(category.title)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                    openCategory === category.title
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category.title}>
                <div className="mb-6 pb-4 border-b-2 border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="mr-3">{category.icon}</span>
                    {category.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2">{category.questions.length} pertanyaan</p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-3">
                  {category.questions.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="border border-gray-200 rounded-lg px-4 hover:border-primary/50 transition-colors"
                    >
                      <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-primary py-4">
                        <div className="flex items-start gap-3 w-full">
                          <span className="text-primary mt-1">Q.</span>
                          <span>{item.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 text-gray-700 border-t border-gray-100">
                        <div className="flex gap-3">
                          <span className="text-primary font-bold flex-shrink-0">A.</span>
                          <p className="leading-relaxed">{item.answer}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-16 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-8">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Masih ada pertanyaan?</h3>
            <p className="text-blue-800 mb-4">
              Jika Anda tidak menemukan jawaban yang Anda cari, jangan ragu untuk menghubungi tim support kami. Kami siap membantu!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:support@karirnusantara.id"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
              >
                📧 Email Support
              </a>
              <a
                href="https://wa.me/62881036480285"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
            <Link to="/lowongan" className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Cari Lowongan
            </Link>
            <Link to="/kebijakan-privasi" className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Kebijakan Privasi
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

export default FAQPage;
