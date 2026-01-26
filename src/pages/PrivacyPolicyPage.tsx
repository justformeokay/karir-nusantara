import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
            <Shield className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Kebijakan Privasi</h1>
          </div>
          <p className="text-white/80 mt-3">Kami menghormati privasi Anda. Pelajari bagaimana kami mengelola data Anda.</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              <strong>Terakhir diperbarui:</strong> 26 Januari 2026
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Daftar Isi</h2>
            <ul className="space-y-2">
              <li>
                <a href="#intro" className="text-primary hover:underline">
                  1. Pengantar
                </a>
              </li>
              <li>
                <a href="#data-collected" className="text-primary hover:underline">
                  2. Data yang Kami Kumpulkan
                </a>
              </li>
              <li>
                <a href="#how-we-use" className="text-primary hover:underline">
                  3. Bagaimana Kami Menggunakan Data
                </a>
              </li>
              <li>
                <a href="#data-sharing" className="text-primary hover:underline">
                  4. Berbagi Data
                </a>
              </li>
              <li>
                <a href="#data-security" className="text-primary hover:underline">
                  5. Keamanan Data
                </a>
              </li>
              <li>
                <a href="#your-rights" className="text-primary hover:underline">
                  6. Hak-Hak Anda
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-primary hover:underline">
                  7. Cookies dan Teknologi Pelacakan
                </a>
              </li>
              <li>
                <a href="#retention" className="text-primary hover:underline">
                  8. Retensi Data
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary hover:underline">
                  9. Hubungi Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section id="intro">
              <h2 className="text-2xl font-bold mb-4">1. Pengantar</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Selamat datang di Karir Nusantara ("Kami", "Platform", atau "Layanan"). Kami berkomitmen untuk melindungi privasi Anda 
                dan memastikan Anda memahami praktik pengumpulan dan penggunaan data kami. Kebijakan Privasi ini menjelaskan bagaimana 
                kami mengumpulkan, menggunakan, membagikan, dan melindungi informasi pribadi Anda ketika Anda menggunakan platform kami.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Dengan mengakses dan menggunakan Karir Nusantara, Anda menerima praktik yang dijelaskan dalam Kebijakan Privasi ini. 
                Jika Anda tidak setuju dengan kebijakan kami, silakan jangan gunakan platform kami.
              </p>
            </section>

            {/* Section 2 */}
            <section id="data-collected">
              <h2 className="text-2xl font-bold mb-4">2. Data yang Kami Kumpulkan</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">2.1 Informasi yang Anda Berikan Secara Langsung</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                    <li><strong>Data Akun:</strong> Nama lengkap, email, nomor telepon, foto profil, dan kata sandi</li>
                    <li><strong>Informasi CV/Resume:</strong> Pengalaman kerja, pendidikan, keterampilan, sertifikasi, dan referensi</li>
                    <li><strong>Informasi Pribadi:</strong> Alamat, tanggal lahir, jenis kelamin, status pernikahan, dan informasi identitas lainnya</li>
                    <li><strong>Data Lamaran:</strong> Pekerjaan yang Anda lamar, status lamaran, dan pesan yang Anda kirimkan kepada perusahaan</li>
                    <li><strong>Informasi Kontak:</strong> LinkedIn, GitHub, website personal, dan tautan profil profesional lainnya</li>
                    <li><strong>Preferensi Pekerjaan:</strong> Lokasi yang diinginkan, jenis industri, gaji yang diharapkan, dan tipe pekerjaan</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2.2 Informasi yang Dikumpulkan Secara Otomatis</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                    <li><strong>Data Perangkat:</strong> Jenis perangkat, sistem operasi, identitas perangkat unik, dan data pembuat perangkat lainnya</li>
                    <li><strong>Data Log:</strong> Alamat IP, jenis browser, halaman yang dikunjungi, waktu kunjungan, durasi kunjungan, dan riwayat klik</li>
                    <li><strong>Data Lokasi:</strong> Lokasi perkiraan berdasarkan IP address atau GPS (jika diizinkan)</li>
                    <li><strong>Informasi Penggunaan:</strong> Bagaimana Anda berinteraksi dengan platform, fitur yang Anda gunakan, dan konten yang Anda lihat</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2.3 Informasi dari Pihak Ketiga</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                    <li>Penyedia Media Sosial (jika Anda login menggunakan akun media sosial)</li>
                    <li>Perusahaan yang Anda lamar (informasi hasil wawancara atau penawaran pekerjaan)</li>
                    <li>Partner dan vendor kami untuk meningkatkan layanan</li>
                    <li>Penyedia analitik pihak ketiga</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="how-we-use">
              <h2 className="text-2xl font-bold mb-4">3. Bagaimana Kami Menggunakan Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kami menggunakan informasi yang kami kumpulkan untuk tujuan-tujuan berikut:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                <li><strong>Menyediakan Layanan:</strong> Membuat dan mengelola akun Anda, memproses lamaran kerja, dan memfasilitasi komunikasi dengan perusahaan</li>
                <li><strong>Personalisasi Pengalaman:</strong> Merekomendasikan pekerjaan yang sesuai dengan profil dan preferensi Anda</li>
                <li><strong>Komunikasi:</strong> Mengirimkan notifikasi tentang lowongan kerja baru, pembaruan lamaran, pesan dari perusahaan, dan informasi akun</li>
                <li><strong>Analitik dan Peningkatan:</strong> Menganalisis penggunaan platform untuk meningkatkan layanan, konten, dan pengalaman pengguna</li>
                <li><strong>Keamanan:</strong> Melindungi terhadap aktivitas penipuan, penyalahgunaan, dan pelanggaran keamanan</li>
                <li><strong>Kepatuhan Hukum:</strong> Memenuhi kewajiban hukum dan peraturan yang berlaku di Indonesia</li>
                <li><strong>Pemasaran dan Promosi:</strong> Mengirimkan penawaran khusus, pembaruan produk, dan materi pemasaran lainnya (dengan persetujuan Anda)</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="data-sharing">
              <h2 className="text-2xl font-bold mb-4">4. Berbagi Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kami dapat membagikan informasi Anda dalam situasi berikut:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                <li><strong>Dengan Perusahaan:</strong> Ketika Anda melamar pekerjaan, kami membagikan CV dan informasi kontak Anda dengan perusahaan yang menerima lamaran Anda</li>
                <li><strong>Dengan Partner Layanan:</strong> Kami bekerja dengan penyedia layanan pihak ketiga (hosting, email, analitik) yang membutuhkan data untuk memberikan layanan mereka</li>
                <li><strong>Agregat dan Anonim:</strong> Kami dapat membagikan data yang telah diagregasi dan dianonimkan yang tidak dapat mengidentifikasi Anda secara pribadi</li>
                <li><strong>Kepatuhan Hukum:</strong> Kami dapat membagikan informasi jika diwajibkan oleh hukum atau jika kami percaya dengan itikad baik bahwa pengungkapan diperlukan untuk melindungi hak-hak kami</li>
                <li><strong>Akuisisi Bisnis:</strong> Jika Karir Nusantara diakuisisi atau bergabung dengan entitas lain, informasi Anda dapat ditransfer sebagai bagian dari transaksi tersebut</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="data-security">
              <h2 className="text-2xl font-bold mb-4">5. Keamanan Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kami mengambil keamanan data Anda dengan serius dan menerapkan berbagai langkah teknis dan administratif untuk melindungi informasi pribadi Anda:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                <li>Enkripsi SSL/TLS untuk semua transmisi data</li>
                <li>Enkripsi data sensitif pada saat penyimpanan</li>
                <li>Kontrol akses yang ketat dan manajemen kunci</li>
                <li>Audit keamanan reguler dan penetration testing</li>
                <li>Monitoring dan deteksi ancaman real-time</li>
                <li>Protokol respons insiden untuk menangani pelanggaran data</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Namun, tidak ada metode transmisi atau penyimpanan data yang sepenuhnya aman. Meskipun kami berusaha keras untuk melindungi 
                informasi pribadi Anda, kami tidak dapat menjamin keamanan mutlak. Anda menggunakan layanan kami atas risiko Anda sendiri dalam 
                hal keamanan data.
              </p>
            </section>

            {/* Section 6 */}
            <section id="your-rights">
              <h2 className="text-2xl font-bold mb-4">6. Hak-Hak Anda</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Anda memiliki hak-hak berikut mengenai data pribadi Anda:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                <li><strong>Hak Akses:</strong> Anda dapat meminta salinan data pribadi yang kami miliki tentang Anda</li>
                <li><strong>Hak Koreksi:</strong> Anda dapat meminta kami untuk memperbaiki data yang tidak akurat atau tidak lengkap</li>
                <li><strong>Hak Penghapusan:</strong> Dalam kondisi tertentu, Anda dapat meminta kami untuk menghapus data pribadi Anda</li>
                <li><strong>Hak Pembatasan:</strong> Anda dapat meminta kami untuk membatasi penggunaan data Anda</li>
                <li><strong>Hak Portabilitas:</strong> Anda dapat meminta data pribadi Anda dalam format yang dapat dicetak ulang</li>
                <li><strong>Hak Keberatan:</strong> Anda dapat keberatan dengan penggunaan atau pengolahan data Anda</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Untuk menggunakan hak-hak ini, silakan hubungi kami menggunakan informasi kontak di bagian "Hubungi Kami" di bawah.
              </p>
            </section>

            {/* Section 7 */}
            <section id="cookies">
              <h2 className="text-2xl font-bold mb-4">7. Cookies dan Teknologi Pelacakan</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kami menggunakan cookies dan teknologi pelacakan serupa untuk meningkatkan pengalaman Anda:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                <li><strong>Cookies Esensial:</strong> Diperlukan untuk fungsi dasar platform seperti keamanan login dan preferensi sesi</li>
                <li><strong>Cookies Analitik:</strong> Membantu kami memahami bagaimana pengguna berinteraksi dengan platform</li>
                <li><strong>Cookies Pemasaran:</strong> Digunakan untuk menyesuaikan iklan dan konten pemasaran</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Anda dapat mengendalikan pengaturan cookie melalui browser Anda. Namun, menonaktifkan cookies tertentu mungkin mempengaruhi 
                fungsi platform kami.
              </p>
            </section>

            {/* Section 8 */}
            <section id="retention">
              <h2 className="text-2xl font-bold mb-4">8. Retensi Data</h2>
              <p className="text-gray-700 leading-relaxed">
                Kami menyimpan data pribadi Anda selama diperlukan untuk memberikan layanan, memenuhi kewajiban hukum, dan menyelesaikan 
                transaksi bisnis. Setelah akun Anda dihapus, kami akan menghapus data pribadi Anda dalam jangka waktu yang wajar, kecuali 
                kami diharuskan menyimpannya berdasarkan hukum yang berlaku. Beberapa data mungkin disimpan dalam backup untuk tujuan pemulihan 
                bencana dan mungkin tetap dapat dipulihkan untuk periode waktu tertentu.
              </p>
            </section>

            {/* Section 9 */}
            <section id="contact">
              <h2 className="text-2xl font-bold mb-4">9. Hubungi Kami</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait kebijakan privasi ini atau praktik privasi kami, 
                silakan hubungi kami melalui:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-2"><strong>Karir Nusantara</strong></p>
                <p className="text-gray-700 mb-2">📧 Email: <a href="mailto:privacy@karirnusantara.id" className="text-primary hover:underline">privacy@karirnusantara.id</a></p>
                <p className="text-gray-700 mb-2">📞 Telepon: <a href="tel:+62881036480285" className="text-primary hover:underline">+62 881 03648 0285</a></p>
                <p className="text-gray-700">📍 Alamat: Sukodono, Sidoarjo, Indonesia</p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Perubahan pada Kebijakan Privasi Ini</h2>
              <p className="text-gray-700 leading-relaxed">
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk mencerminkan perubahan dalam praktik, teknologi, 
                persyaratan hukum, atau alasan lainnya. Kami akan memberi tahu Anda tentang perubahan material dengan memposting Kebijakan 
                Privasi yang diperbarui di platform kami dan memperbarui tanggal "Terakhir diperbarui" di bagian atas halaman ini. 
                Penggunaan platform Anda yang berkelanjutan setelah perubahan tersebut akan dianggap sebagai penerimaan Kebijakan Privasi 
                yang diperbarui.
              </p>
            </section>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
            <Link to="/lowongan" className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Kembali ke Lowongan
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

export default PrivacyPolicyPage;
