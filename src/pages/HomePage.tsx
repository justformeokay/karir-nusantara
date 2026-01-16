import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, FileText, Users, Building2, TrendingUp, CheckCircle, ArrowRight, Briefcase, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/jobs/SearchBar';
import JobCard from '@/components/jobs/JobCard';
import { mockJobs, jobCategories } from '@/data/jobs';
import heroImage from '@/assets/hero-image.jpg';

const HomePage: React.FC = () => {
  const featuredJobs = mockJobs.slice(0, 4);

  const stats = [
    { icon: Briefcase, value: '10,000+', label: 'Lowongan Aktif' },
    { icon: Building2, value: '5,000+', label: 'Perusahaan' },
    { icon: Users, value: '1 Juta+', label: 'Pencari Kerja' },
    { icon: TrendingUp, value: '50,000+', label: 'Penempatan' },
  ];

  const benefits = [
    'Cari lowongan tanpa perlu login',
    'Buat CV profesional gratis',
    'Lamar dengan satu klik',
    'Notifikasi lowongan baru',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Profesional Indonesia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary-foreground rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                Platform Kerja #1 di Indonesia
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6">
                Temukan Karir Impian Anda di{' '}
                <span className="text-primary">KerjaKita</span>
              </h1>
              <p className="text-lg md:text-xl text-background/80 mb-8 leading-relaxed">
                Ribuan lowongan dari perusahaan terbaik Indonesia. Cari kerja, buat CV profesional, dan lamar dengan mudah.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <SearchBar variant="hero" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6"
            >
              <p className="text-background/60 text-sm">Populer:</p>
              {['Software Engineer', 'Marketing', 'Data Analyst', 'Designer'].map(term => (
                <Link
                  key={term}
                  to={`/lowongan?q=${encodeURIComponent(term)}`}
                  className="text-sm text-background/80 hover:text-primary transition-colors"
                >
                  {term}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-primary-foreground/80 mx-auto mb-3" />
                <p className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Lowongan Terbaru
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Temukan peluang karir dari berbagai industri dan lokasi di Indonesia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {featuredJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/lowongan">
              <Button size="lg" variant="outline">
                Lihat Semua Lowongan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Jelajahi Kategori
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Temukan lowongan berdasarkan bidang keahlian Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {jobCategories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={`/lowongan?category=${encodeURIComponent(category)}`}
                  className="block p-6 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-card transition-all duration-300 text-center group"
                >
                  <Briefcase className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CV Builder CTA */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Buat CV Profesional dalam Hitungan Menit
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Gunakan CV Builder gratis kami untuk membuat CV yang menarik dan siap ATS. Download langsung dalam format PDF.
              </p>
              <ul className="space-y-3 mb-8">
                {benefits.map(benefit => (
                  <li key={benefit} className="flex items-center gap-3 text-primary-foreground/90">
                    <CheckCircle className="w-5 h-5 text-primary-foreground" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link to="/buat-cv">
                <Button size="lg" variant="secondary" className="font-semibold">
                  <FileText className="w-5 h-5 mr-2" />
                  Buat CV Sekarang
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full max-w-md"
            >
              <div className="bg-background rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">CV Builder</h3>
                    <p className="text-sm text-muted-foreground">Gratis & Mudah</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-3 bg-muted rounded-full w-full" />
                  <div className="h-3 bg-muted rounded-full w-3/4" />
                  <div className="h-3 bg-muted rounded-full w-5/6" />
                  <div className="h-3 bg-muted rounded-full w-2/3" />
                </div>
                <div className="mt-6 flex gap-3">
                  <div className="h-10 flex-1 bg-primary/10 rounded-lg" />
                  <div className="h-10 flex-1 bg-primary rounded-lg" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Cara Kerja KerjaKita
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tiga langkah mudah menuju karir impian Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Search,
                title: 'Cari Lowongan',
                description: 'Temukan ribuan lowongan dari berbagai industri dan lokasi',
              },
              {
                step: '02',
                icon: FileText,
                title: 'Buat CV',
                description: 'Buat CV profesional dengan template yang menarik dan siap ATS',
              },
              {
                step: '03',
                icon: CheckCircle,
                title: 'Lamar Pekerjaan',
                description: 'Kirim lamaran dengan satu klik dan tunggu panggilan interview',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-6">
                  <item.icon className="w-10 h-10" />
                </div>
                <span className="absolute top-0 right-1/4 text-6xl font-bold text-muted/50">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
