export interface Job {
  id: string;
  hashId?: string;  // Optional field for hash-based IDs
  title: string;
  company: string;
  companyLogo: string;
  companyCity?: string;
  companyProvince?: string;
  location: string;
  province: string;
  city?: string;
  type: 'Full-time' | 'Part-time' | 'Freelance' | 'Magang' | 'Kontrak';
  category: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedDate: string;
  isUrgent?: boolean;
  isRemote?: boolean;
}

export const jobCategories = [
  'Teknologi',
  'Marketing',
  'Keuangan',
  'Desain',
  'Customer Service',
  'Human Resources',
  'Sales',
  'Operasional',
  'Pendidikan',
  'Kesehatan',
  'Konstruksi',
  'Manufaktur',
];

export const provinces = [
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'Banten',
  'Yogyakarta',
  'Sumatera Utara',
  'Sumatera Selatan',
  'Bali',
  'Kalimantan Timur',
  'Sulawesi Selatan',
];

export const jobTypes = ['Full-time', 'Part-time', 'Freelance', 'Magang', 'Kontrak'] as const;

export const salaryRanges = [
  { label: 'Semua Gaji', min: 0, max: Infinity },
  { label: 'Di bawah Rp 5 juta', min: 0, max: 5000000 },
  { label: 'Rp 5 - 10 juta', min: 5000000, max: 10000000 },
  { label: 'Rp 10 - 15 juta', min: 10000000, max: 15000000 },
  { label: 'Rp 15 - 25 juta', min: 15000000, max: 25000000 },
  { label: 'Di atas Rp 25 juta', min: 25000000, max: Infinity },
];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'Tech Indonesia',
    companyLogo: 'https://ui-avatars.com/api/?name=Tech+Indonesia&background=0d9488&color=fff&size=100',
    location: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    type: 'Full-time',
    category: 'Teknologi',
    salaryMin: 15000000,
    salaryMax: 25000000,
    description: 'Kami mencari Software Engineer berbakat untuk bergabung dengan tim development kami. Anda akan bertanggung jawab untuk mengembangkan aplikasi web dan mobile yang inovatif.',
    requirements: [
      'Minimal 3 tahun pengalaman sebagai Software Engineer',
      'Menguasai JavaScript, TypeScript, dan React',
      'Familiar dengan Node.js dan database SQL/NoSQL',
      'Pengalaman dengan metodologi Agile',
      'Kemampuan komunikasi yang baik',
    ],
    responsibilities: [
      'Mengembangkan dan memelihara aplikasi web',
      'Berkolaborasi dengan tim product dan design',
      'Menulis kode yang bersih dan terdokumentasi',
      'Melakukan code review untuk anggota tim lain',
      'Mengoptimalkan performa aplikasi',
    ],
    benefits: [
      'Gaji kompetitif',
      'BPJS Kesehatan & Ketenagakerjaan',
      'Asuransi kesehatan tambahan',
      'Remote working 2x seminggu',
      'Bonus tahunan',
    ],
    postedDate: '2024-01-15',
    isUrgent: true,
    isRemote: true,
  },
  {
    id: '2',
    title: 'Digital Marketing Specialist',
    company: 'Startup Kreatif',
    companyLogo: 'https://ui-avatars.com/api/?name=Startup+Kreatif&background=f97316&color=fff&size=100',
    location: 'Bandung',
    province: 'Jawa Barat',
    type: 'Full-time',
    category: 'Marketing',
    salaryMin: 8000000,
    salaryMax: 12000000,
    description: 'Bergabunglah sebagai Digital Marketing Specialist untuk mengelola kampanye digital dan meningkatkan brand awareness perusahaan.',
    requirements: [
      'Minimal 2 tahun pengalaman di digital marketing',
      'Menguasai Google Ads dan Facebook Ads',
      'Familiar dengan SEO dan content marketing',
      'Kemampuan analisis data yang kuat',
      'Kreatif dan up-to-date dengan tren digital',
    ],
    responsibilities: [
      'Mengelola kampanye iklan digital',
      'Mengoptimalkan SEO website',
      'Membuat konten marketing',
      'Menganalisis performa kampanye',
      'Berkoordinasi dengan tim creative',
    ],
    benefits: [
      'Gaji kompetitif',
      'BPJS Kesehatan',
      'Tunjangan transportasi',
      'Jam kerja fleksibel',
    ],
    postedDate: '2024-01-14',
    isRemote: false,
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Design Studio ID',
    companyLogo: 'https://ui-avatars.com/api/?name=Design+Studio&background=8b5cf6&color=fff&size=100',
    location: 'Yogyakarta',
    province: 'Yogyakarta',
    type: 'Full-time',
    category: 'Desain',
    salaryMin: 10000000,
    salaryMax: 18000000,
    description: 'Kami mencari UI/UX Designer berbakat untuk menciptakan pengalaman pengguna yang luar biasa untuk produk digital kami.',
    requirements: [
      'Minimal 2 tahun pengalaman sebagai UI/UX Designer',
      'Mahir menggunakan Figma dan Adobe XD',
      'Portofolio yang kuat',
      'Pemahaman tentang user research',
      'Kemampuan prototyping',
    ],
    responsibilities: [
      'Merancang UI untuk aplikasi web dan mobile',
      'Melakukan user research dan usability testing',
      'Membuat wireframe dan prototype',
      'Berkolaborasi dengan developer',
      'Menjaga konsistensi design system',
    ],
    benefits: [
      'Gaji kompetitif',
      'Asuransi kesehatan',
      'Work from anywhere',
      'Equipment allowance',
      'Learning budget',
    ],
    postedDate: '2024-01-13',
    isRemote: true,
  },
  {
    id: '4',
    title: 'Customer Service Representative',
    company: 'E-Commerce Nusantara',
    companyLogo: 'https://ui-avatars.com/api/?name=Ecommerce+Nusantara&background=059669&color=fff&size=100',
    location: 'Surabaya',
    province: 'Jawa Timur',
    type: 'Full-time',
    category: 'Customer Service',
    salaryMin: 4500000,
    salaryMax: 6000000,
    description: 'Jadilah bagian dari tim customer service kami untuk memberikan pelayanan terbaik kepada pelanggan.',
    requirements: [
      'Minimal SMA/SMK sederajat',
      'Kemampuan komunikasi yang baik',
      'Ramah dan sabar',
      'Bersedia bekerja shift',
      'Pengalaman CS diutamakan',
    ],
    responsibilities: [
      'Melayani pertanyaan pelanggan',
      'Menangani keluhan dan komplain',
      'Memproses pesanan pelanggan',
      'Update data pelanggan',
      'Laporan harian',
    ],
    benefits: [
      'Gaji UMR+',
      'BPJS',
      'Tunjangan shift',
      'Makan siang',
    ],
    postedDate: '2024-01-12',
    isUrgent: true,
    isRemote: false,
  },
  {
    id: '5',
    title: 'Data Analyst',
    company: 'Fintech Maju',
    companyLogo: 'https://ui-avatars.com/api/?name=Fintech+Maju&background=3b82f6&color=fff&size=100',
    location: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    type: 'Full-time',
    category: 'Teknologi',
    salaryMin: 12000000,
    salaryMax: 20000000,
    description: 'Analisis data untuk memberikan insight bisnis yang actionable dan mendukung pengambilan keputusan strategis.',
    requirements: [
      'Minimal S1 Statistik/Matematika/IT',
      'Menguasai SQL dan Python',
      'Pengalaman dengan tools visualisasi (Tableau/Power BI)',
      'Kemampuan analitis yang kuat',
      'Familiar dengan machine learning dasar',
    ],
    responsibilities: [
      'Menganalisis data bisnis',
      'Membuat dashboard dan laporan',
      'Mengidentifikasi tren dan pola',
      'Berkolaborasi dengan stakeholder',
      'Mengembangkan model prediktif',
    ],
    benefits: [
      'Gaji kompetitif',
      'Asuransi kesehatan premium',
      'Stock options',
      'WFH policy',
      'Gym membership',
    ],
    postedDate: '2024-01-11',
    isRemote: true,
  },
  {
    id: '6',
    title: 'Human Resources Manager',
    company: 'Perusahaan Retail',
    companyLogo: 'https://ui-avatars.com/api/?name=Retail+Company&background=ec4899&color=fff&size=100',
    location: 'Tangerang',
    province: 'Banten',
    type: 'Full-time',
    category: 'Human Resources',
    salaryMin: 15000000,
    salaryMax: 22000000,
    description: 'Memimpin fungsi HR untuk memastikan strategi talent management yang efektif.',
    requirements: [
      'Minimal S1 Psikologi/Manajemen',
      'Minimal 5 tahun pengalaman di HR',
      'Pengalaman manajerial',
      'Sertifikasi HR diutamakan',
      'Leadership skill yang kuat',
    ],
    responsibilities: [
      'Mengelola tim HR',
      'Mengembangkan kebijakan HR',
      'Mengawasi proses rekrutmen',
      'Mengelola employee engagement',
      'Menangani hubungan industrial',
    ],
    benefits: [
      'Gaji kompetitif',
      'Tunjangan jabatan',
      'Mobil dinas',
      'Asuransi keluarga',
      'Bonus performance',
    ],
    postedDate: '2024-01-10',
    isRemote: false,
  },
  {
    id: '7',
    title: 'Content Writer',
    company: 'Media Digital',
    companyLogo: 'https://ui-avatars.com/api/?name=Media+Digital&background=6366f1&color=fff&size=100',
    location: 'Semarang',
    province: 'Jawa Tengah',
    type: 'Freelance',
    category: 'Marketing',
    salaryMin: 3000000,
    salaryMax: 6000000,
    description: 'Mencari content writer kreatif untuk menulis artikel, blog, dan konten media sosial.',
    requirements: [
      'Minimal D3 segala jurusan',
      'Kemampuan menulis yang baik',
      'Familiar dengan SEO writing',
      'Kreatif dan up-to-date',
      'Portofolio tulisan',
    ],
    responsibilities: [
      'Menulis artikel blog',
      'Membuat konten sosial media',
      'Research topik trending',
      'Editing dan proofreading',
      'Koordinasi dengan tim marketing',
    ],
    benefits: [
      'Per artikel/project',
      'Jam kerja fleksibel',
      'Work from home',
      'Peluang kontrak tetap',
    ],
    postedDate: '2024-01-09',
    isRemote: true,
  },
  {
    id: '8',
    title: 'Accounting Staff',
    company: 'Konsultan Keuangan',
    companyLogo: 'https://ui-avatars.com/api/?name=Konsultan+Keuangan&background=84cc16&color=fff&size=100',
    location: 'Denpasar',
    province: 'Bali',
    type: 'Full-time',
    category: 'Keuangan',
    salaryMin: 6000000,
    salaryMax: 9000000,
    description: 'Bergabung sebagai Accounting Staff untuk mengelola pembukuan dan laporan keuangan perusahaan.',
    requirements: [
      'S1 Akuntansi',
      'Fresh graduate welcome',
      'Menguasai software akuntansi',
      'Detail oriented',
      'Familiar dengan pajak',
    ],
    responsibilities: [
      'Membuat jurnal transaksi',
      'Rekonsiliasi bank',
      'Laporan keuangan bulanan',
      'Perhitungan pajak',
      'Filing dokumen',
    ],
    benefits: [
      'Gaji UMR Bali+',
      'BPJS',
      'THR',
      'Cuti tahunan',
      'Training',
    ],
    postedDate: '2024-01-08',
    isRemote: false,
  },
];

export const formatSalary = (amount: number): string => {
  if (amount >= 1000000) {
    // Show 1 decimal place for millions (2.4jt instead of 2jt)
    const millions = amount / 1000000;
    const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
    return `Rp ${formatted} jt`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const formatSalaryRange = (min?: number, max?: number): string => {
  if (!min && !max) return 'Gaji dirahasiakan';
  if (min && max) return `${formatSalary(min)} - ${formatSalary(max)}`;
  if (min) return `Mulai dari ${formatSalary(min)}`;
  if (max) return `Hingga ${formatSalary(max)}`;
  return 'Gaji dirahasiakan';
};

export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
  return `${Math.floor(diffDays / 365)} tahun lalu`;
};
