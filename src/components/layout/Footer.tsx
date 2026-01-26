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
                <Link to="/faq" className="text-background/70 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/laporkan-bug" className="text-background/70 hover:text-white transition-colors text-sm">
                  Laporkan Bug
                </Link>
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

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Dukungan</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/dukungan" className="text-background/70 hover:text-white transition-colors text-sm">
                  Ticketing Support
                </Link>
              </li>
              <li>
                <Link to="/laporkan-bug" className="text-background/70 hover:text-white transition-colors text-sm">
                  Laporkan Bug
                </Link>
              </li>
              <li>
                <a href="mailto:halo@karirnusantara.id" className="text-background/70 hover:text-white transition-colors text-sm">
                  Email Kami
                </a>
              </li>
              <li>
                <a href="https://wa.me/6221123456" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-white transition-colors text-sm">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            © 2024 Karir Nusantara. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/kebijakan-privasi" className="text-background/50 hover:text-white text-sm transition-colors">
              Kebijakan Privasi
            </Link>
            <Link to="/syarat-ketentuan" className="text-background/50 hover:text-white text-sm transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
