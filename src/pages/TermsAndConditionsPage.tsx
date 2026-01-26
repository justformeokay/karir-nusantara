import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsAndConditionsPage: React.FC = () => {
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
            <FileText className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Syarat & Ketentuan</h1>
          </div>
          <p className="text-white/80 mt-3">Ketentuan penggunaan layanan Karir Nusantara yang harus Anda pahami</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-amber-800">
              <strong>Terakhir diperbarui:</strong> 26 Januari 2026
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Daftar Isi</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="#agreement" className="text-primary hover:underline">1. Perjanjian Penggunaan</a></li>
              <li><a href="#eligibility" className="text-primary hover:underline">2. Kelayakan & Registrasi</a></li>
              <li><a href="#user-responsibilities" className="text-primary hover:underline">3. Tanggung Jawab Pengguna</a></li>
              <li><a href="#platform-rights" className="text-primary hover:underline">4. Hak dan Kewajiban Platform</a></li>
              <li><a href="#content" className="text-primary hover:underline">5. Konten & Intellectual Property</a></li>
              <li><a href="#prohibited" className="text-primary hover:underline">6. Aktivitas yang Dilarang</a></li>
              <li><a href="#disclaimers" className="text-primary hover:underline">7. Pembatasan Tanggung Jawab</a></li>
              <li><a href="#termination" className="text-primary hover:underline">8. Penghentian Layanan</a></li>
              <li><a href="#changes" className="text-primary hover:underline">9. Perubahan Syarat</a></li>
              <li><a href="#governing" className="text-primary hover:underline">10. Hukum yang Berlaku</a></li>
            </ul>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section id="agreement">
              <h2 className="text-2xl font-bold mb-4">1. Perjanjian Penggunaan</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Syarat dan Ketentuan ini ("Perjanjian") adalah perjanjian yang mengikat antara Anda ("Pengguna", "Anda") dan 
                Karir Nusantara ("Kami", "Platform", "Perusahaan"). Dengan mengakses, membuat akun, atau menggunakan layanan 
                Karir Nusantara dalam bentuk apapun, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini sepenuhnya.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Jika Anda tidak setuju dengan Syarat dan Ketentuan ini atau bagian manapun darinya, Anda tidak boleh menggunakan 
                Platform. Penggunaan Platform Anda yang berkelanjutan merupakan bukti penerimaan Anda atas Syarat dan Ketentuan ini.
              </p>
            </section>

            {/* Section 2 */}
            <section id="eligibility">
              <h2 className="text-2xl font-bold mb-4">2. Kelayakan & Registrasi</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">2.1 Persyaratan Kelayakan</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                    <li>Anda harus berusia minimal 18 tahun atau usia dewasa sesuai hukum yang berlaku di Indonesia</li>
                    <li>Anda harus memiliki kapasitas hukum untuk mengikat perjanjian ini</li>
                    <li>Anda tidak boleh menggunakan Platform jika dilarang berdasarkan hukum yang berlaku</li>
                    <li>Anda tidak boleh mewakili pihak lain tanpa otorisasi yang sah</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2.2 Registrasi Akun</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Untuk menggunakan fitur tertentu Platform, Anda harus membuat akun dengan memberikan informasi yang akurat, 
                    lengkap, dan terkini. Anda bertanggung jawab untuk:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                    <li>Menjaga kerahasiaan password dan informasi akun Anda</li>
                    <li>Segera memberi tahu kami jika ada akses tidak sah ke akun Anda</li>
                    <li>Menerima tanggung jawab penuh untuk semua aktivitas yang terjadi di akun Anda</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2.3 Akurasi Informasi</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Anda menjamin bahwa semua informasi yang Anda berikan saat registrasi dan penggunaan Platform adalah akurat, 
                    lengkap, dan tidak menyesatkan. Anda setuju untuk mengupdate informasi Anda agar tetap akurat dan terkini.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="user-responsibilities">
              <h2 className="text-2xl font-bold mb-4">3. Tanggung Jawab Pengguna</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Dengan menggunakan Platform, Anda setuju untuk:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                <li>Menggunakan Platform hanya untuk tujuan yang sah dan sesuai dengan Syarat dan Ketentuan ini</li>
                <li>Tidak menggunakan Platform untuk tujuan yang melanggar hukum atau merugikan pihak lain</li>
                <li>Memberikan data pribadi dan informasi CV yang jujur, akurat, dan tidak menyesatkan</li>
                <li>Tidak menciptakan akun ganda atau menyamar sebagai pengguna lain</li>
                <li>Tidak mengganggu atau menghambat fungsi Platform</li>
                <li>Mematuhi semua hukum dan regulasi yang berlaku di Indonesia</li>
                <li>Menghormati hak dan privasi pengguna lain dan perusahaan yang menggunakan Platform</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="platform-rights">
              <h2 className="text-2xl font-bold mb-4">4. Hak dan Kewajiban Platform</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">4.1 Layanan Kami</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Kami menyediakan Platform sebagai sarana penghubung antara pencari kerja dan perusahaan. Kami tidak menjamin 
                    bahwa Anda akan mendapat pekerjaan atau penawaran melalui Platform kami. Perusahaan memiliki kebebasan penuh 
                    dalam memilih kandidat.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">4.2 Hak Platform</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                    <li>Kami berhak mengubah, memodifikasi, atau menghentikan layanan kapan saja dengan atau tanpa pemberitahuan</li>
                    <li>Kami berhak mengaudit penggunaan Platform untuk memastikan kepatuhan terhadap Syarat dan Ketentuan</li>
                    <li>Kami berhak menolak, membatasi, atau menghapus akun yang melanggar Syarat dan Ketentuan</li>
                    <li>Kami berhak menghapus konten yang melanggar kebijakan kami tanpa pemberitahuan sebelumnya</li>
                    <li>Kami berhak menggunakan data agregat dan anonim untuk keperluan analitik dan perbaikan layanan</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">4.3 Upaya Terbaik Kami</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Kami berkomitmen untuk memelihara Platform dengan upaya terbaik kami, namun kami tidak menjamin bahwa:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                    <li>Platform akan selalu tersedia atau bebas dari gangguan</li>
                    <li>Platform akan bebas dari error atau bug</li>
                    <li>Semua fungsi akan bekerja sempurna setiap saat</li>
                    <li>Perbaikan atau pembaruan akan selalu tersedia</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="content">
              <h2 className="text-2xl font-bold mb-4">5. Konten & Intellectual Property</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">5.1 Kepemilikan Konten</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Semua konten yang Anda unggah ke Platform, termasuk CV, foto, dan deskripsi pribadi, tetap menjadi milik Anda. 
                    Namun, dengan mengunggah konten tersebut, Anda memberikan Platform lisensi untuk menggunakan, menyimpan, 
                    menampilkan, dan membagikan konten kepada perusahaan yang relevan.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">5.2 Hak Intellectual Property Platform</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Semua fitur, fungsi, desain, layout, dan aset Platform (termasuk tetapi tidak terbatas pada teks, grafis, 
                    logo, ikon, dan kode) adalah milik Kami atau pemberi lisensi kami dan dilindungi oleh hukum hak cipta dan 
                    intellectual property. Anda tidak boleh mereproduksi, mendistribusikan, atau menggunakan kembali konten Platform 
                    tanpa izin tertulis dari Kami.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">5.3 Penggunaan Konten Anda</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Anda menjamin bahwa semua konten yang Anda berikan tidak melanggar hak intellectual property pihak lain, 
                    bukan conten yang diminta/dilarang untuk dibagikan, dan tidak berisi informasi yang tidak akurat atau menyesatkan.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="prohibited">
              <h2 className="text-2xl font-bold mb-4">6. Aktivitas yang Dilarang</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Anda melarang untuk:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                <li>Menggunakan Platform untuk tujuan yang melanggar hukum atau memusuhi</li>
                <li>Mengirim spam, malware, virus, atau konten berbahaya lainnya</li>
                <li>Mencoba mengakses bagian Platform yang tidak diizinkan</li>
                <li>Mengganggu atau membahayakan server atau jaringan Platform</li>
                <li>Melakukan aktivitas scraping, crawling, atau automated access tanpa izin</li>
                <li>Membuat konten yang merendahkan, membully, atau melecehkan pengguna atau perusahaan lain</li>
                <li>Mempublikasikan konten yang mengandung pornografi, kekerasan, atau kebencian</li>
                <li>Melakukan penipuan, phishing, atau social engineering</li>
                <li>Menjual akun atau data pengguna kepada pihak ketiga</li>
                <li>Menggunakan Platform untuk tujuan yang bertentangan dengan kebijakan kami</li>
                <li>Membagikan informasi pribadi pengguna lain tanpa izin</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="disclaimers">
              <h2 className="text-2xl font-bold mb-4">7. Pembatasan Tanggung Jawab</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">7.1 Layanan "Sebagaimana Adanya"</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Platform disediakan "sebagaimana adanya" tanpa jaminan apapun, baik tersurat maupun tersirat. Kami tidak 
                    menjamin bahwa Platform akan memenuhi kebutuhan Anda, aman, akurat, atau bebas dari gangguan.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">7.2 Batasan Liabilitas</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Sejauh yang diizinkan oleh hukum, Karir Nusantara, karyawan, dan mitra kami tidak akan bertanggung jawab untuk:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                    <li>Kerugian langsung atau tidak langsung dari penggunaan atau ketidakmampuan menggunakan Platform</li>
                    <li>Kerugian data, kehilangan profit, atau gangguan bisnis</li>
                    <li>Akses tidak sah ke atau modifikasi dari konten Anda</li>
                    <li>Konten atau tindakan pihak ketiga di Platform</li>
                    <li>Keputusan perusahaan untuk menerima atau menolak aplikasi Anda</li>
                    <li>Kualitas atau kebenaran lowongan pekerjaan yang ditampilkan</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">7.3 Tanggung Jawab Pengguna</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Anda bertanggung jawab penuh untuk penggunaan Platform Anda dan risiko yang timbul darinya. Anda setuju untuk 
                    mengindemnifikasi dan mempertahankan Karir Nusantara dari semua klaim, kerugian, dan biaya yang timbul dari 
                    pelanggaran Syarat dan Ketentuan ini atau penggunaan Platform Anda.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="termination">
              <h2 className="text-2xl font-bold mb-4">8. Penghentian Layanan</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">8.1 Penghentian oleh Pengguna</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Anda dapat menghentikan penggunaan Platform dan menghapus akun Anda kapan saja melalui pengaturan akun. 
                    Setelah penghapusan, data Anda akan dihapus sesuai dengan kebijakan retensi data kami.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">8.2 Penghentian oleh Platform</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Kami berhak untuk menghentikan atau menangguhkan akun Anda jika:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                    <li>Anda melanggar Syarat dan Ketentuan ini</li>
                    <li>Akun Anda terlibat dalam aktivitas yang mencurigakan atau berbahaya</li>
                    <li>Anda gagal membayar biaya apapun yang mungkin berlaku</li>
                    <li>Anda terlibat dalam aktivitas fraud atau penipuan</li>
                    <li>Kami percaya bahwa penghentian diperlukan untuk melindungi Platform atau pengguna lain</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">8.3 Efek dari Penghentian</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Setelah penghentian, Anda tidak akan bisa mengakses Platform menggunakan akun tersebut. Kami tidak bertanggung 
                    jawab atas kerugian data atau informasi yang terjadi akibat penghentian.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="changes">
              <h2 className="text-2xl font-bold mb-4">9. Perubahan Syarat</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kami dapat mengubah Syarat dan Ketentuan ini kapan saja dengan memposting versi yang diperbarui di Platform. 
                Kami akan memberi tahu Anda tentang perubahan material melalui email atau banner di Platform. Penggunaan Platform 
                yang berkelanjutan setelah notifikasi perubahan berarti Anda menerima Syarat dan Ketentuan yang diperbarui.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Sangat penting bagi Anda untuk secara berkala memeriksa halaman ini untuk mengetahui perubahan apapun. 
                Jika Anda tidak menyetujui Syarat dan Ketentuan yang diperbarui, Anda harus berhenti menggunakan Platform.
              </p>
            </section>

            {/* Section 10 */}
            <section id="governing">
              <h2 className="text-2xl font-bold mb-4">10. Hukum yang Berlaku & Penyelesaian Sengketa</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">10.1 Hukum yang Berlaku</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Syarat dan Ketentuan ini dan penggunaan Platform Anda diatur oleh dan ditafsirkan sesuai dengan hukum 
                    Republik Indonesia, tanpa memperhatikan konflik ketentuan hukum.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">10.2 Penyelesaian Sengketa</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Jika terjadi sengketa, Anda setuju untuk terlebih dahulu mencoba menyelesaikan melalui negosiasi dengan 
                    mengirimkan pemberitahuan tertulis kepada kami. Jika sengketa tidak dapat diselesaikan dalam 30 hari, 
                    kedua belah pihak setuju untuk menundukkan sengketa kepada yurisdiksi pengadilan di Indonesia.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">10.3 Arbitrasi</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Sebagai alternatif dari litigasi, baik Anda maupun kami dapat memilih untuk menyelesaikan sengketa melalui 
                    arbitrasi yang mengikat. Arbitrasi akan dilakukan sesuai dengan aturan yang berlaku di Indonesia.
                  </p>
                </div>
              </div>
            </section>

            {/* Additional Sections */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold mb-4">11. Ketentuan Tambahan</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">11.1 Keseluruhan Perjanjian</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Syarat dan Ketentuan ini, bersama dengan Kebijakan Privasi dan kebijakan lainnya yang kami terbitkan, 
                    merupakan keseluruhan perjanjian antara Anda dan Kami mengenai penggunaan Platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">11.2 Pembatalan</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Jika ada bagian dari Syarat dan Ketentuan yang dianggap tidak sah atau tidak dapat diberlakukan, bagian 
                    tersebut akan dihapus namun sisa Syarat dan Ketentuan akan tetap berlaku sepenuhnya.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">11.3 Tidak Ada Waiver</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Kegagalan kami untuk menuntut pemenuhan Syarat dan Ketentuan tidak merupakan pengabaian dari hak kami. 
                    Kami tetap berhak untuk menuntut pemenuhan kapan saja.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">11.4 Hubungan Para Pihak</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Tidak ada hubungan karyawan, partnership, atau joint venture antara Anda dan Kami. Anda tidak diizinkan 
                    untuk mewakili diri Anda sebagai agen Kami tanpa persetujuan tertulis.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="mt-12 pt-8 border-t border-gray-200 bg-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-900">Hubungi Kami</h2>
              <p className="text-blue-800 mb-4">
                Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami:
              </p>
              <div className="space-y-2 text-blue-800">
                <p><strong>Karir Nusantara</strong></p>
                <p>📧 Email: <a href="mailto:legal@karirnusantara.id" className="text-primary hover:underline">legal@karirnusantara.id</a></p>
                <p>📞 Telepon: <a href="tel:+62881036480285" className="text-primary hover:underline">+62 8810 3648 0285</a></p>
                <p>📍 Alamat: Sukodono, Sidoarjo, Indonesia</p>
              </div>
            </section>
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

export default TermsAndConditionsPage;
