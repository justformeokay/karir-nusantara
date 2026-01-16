import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import logo from '@/assets/karir-nusantara.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Karir Nusantara" className="h-10 w-auto" />
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Platform pencarian kerja terpercaya di Indonesia. Temukan peluang karir terbaik untuk masa depan Anda.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/lowongan" className="text-background/70 hover:text-white transition-colors text-sm">
                  Cari Lowongan
                </Link>
              </li>
              <li>
                <Link to="/buat-cv" className="text-background/70 hover:text-white transition-colors text-sm">
                  Buat CV
                </Link>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-white transition-colors text-sm">
                  Tips Karir
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-white transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kategori Populer</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/lowongan?category=Teknologi" className="text-background/70 hover:text-white transition-colors text-sm">
                  Teknologi
                </Link>
              </li>
              <li>
                <Link to="/lowongan?category=Marketing" className="text-background/70 hover:text-white transition-colors text-sm">
                  Marketing
                </Link>
              </li>
              <li>
                <Link to="/lowongan?category=Desain" className="text-background/70 hover:text-white transition-colors text-sm">
                  Desain
                </Link>
              </li>
              <li>
                <Link to="/lowongan?category=Keuangan" className="text-background/70 hover:text-white transition-colors text-sm">
                  Keuangan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Hubungi Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-background/70 text-sm">
                <MapPin className="w-4 h-4 text-white" />
                Sidoarjo, Indonesia
              </li>
              <li className="flex items-center gap-3 text-background/70 text-sm">
                <Mail className="w-4 h-4 text-white" />
                halo@karirnusantara.id
              </li>
              <li className="flex items-center gap-3 text-background/70 text-sm">
                <Phone className="w-4 h-4 text-white" />
                +62 21 1234 5678
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            © 2024 Karir Nusantara. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-background/50 hover:text-white text-sm transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="text-background/50 hover:text-white text-sm transition-colors">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
