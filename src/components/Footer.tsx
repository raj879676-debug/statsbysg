import React from 'react';
import { MapPin, Phone, Mail, Youtube, MessageCircle, Send, ChevronRight, ArrowLeft } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../lib/LanguageContext';

import { SubpageBanners } from './GlobalAnnouncements';

export default function Footer({ onNavigate, hideMaterials = false, isSecondary = false }: { onNavigate: (page: string) => void, hideMaterials?: boolean, isSecondary?: boolean }) {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (isSecondary && href.startsWith('#')) {
      e.preventDefault();
      onNavigate('/');
      // Give it a moment to render the home page then scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const navLinks = [
    { name: t('footer_link_batches'), href: '#courses' },
    { name: t('footer_link_youtube'), href: '#youtube' },
    { name: t('nav_about'), href: '#about' },
    { name: t('footer_link_reviews'), href: '#reviews' },
  ];

  return (
    <footer className="mt-auto">
      {/* Subpage Banners */}
      {isSecondary && <SubpageBanners />}

      <div className="bg-brand-dark/95 backdrop-blur-md pt-[18px] pb-[45px] px-4 border-t-4 border-blue-600">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-center md:text-left">
          
          <div className="lg:col-span-1 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-8">
              <Logo className="scale-110" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-[15px] max-w-xs">
              {t('footer_desc')}
            </p>
            
            <div className="flex items-center gap-4">
              {[
                { icon: <Youtube size={20} />, href: 'https://www.youtube.com/@statisticsbysg2247', color: 'hover:bg-red-600', label: 'YouTube' },
                { icon: <MessageCircle size={20} />, href: 'https://wa.me/919026914282?text=Hello%21%20I%20have%20a%20query%20regarding%20Statistics%20coaching.', color: 'hover:bg-[#25D366]', label: 'WhatsApp' },
                { icon: <Send size={20} />, href: 'https://t.me/statistics_by_sg', color: 'hover:bg-blue-500', label: 'Telegram' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 bg-white/5 rounded-full flex items-center justify-center transition-all text-white border border-white/10 ${social.color}`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="pt-0">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors group text-sm font-medium"
                    aria-label={`Navigate to ${link.name}`}
                  >
                    <ChevronRight size={14} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-extrabold mb-[11px] uppercase tracking-widest text-sm">{t('footer_policies_title')}</h3>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => onNavigate('terms')} 
                  className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors group text-sm font-medium cursor-pointer"
                  aria-label="View Terms of Service"
                >
                  <ChevronRight size={14} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('footer_tos')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('refund')} 
                  className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors group text-sm font-medium cursor-pointer"
                  aria-label="View Refund Policy"
                >
                  <ChevronRight size={14} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('footer_refund')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-extrabold mb-[13px] uppercase tracking-widest text-sm">{t('footer_presence_title')}</h3>
            <ul className="space-y-6 pb-0">
              <li>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=D,+59,+Nirala+Nagar,Lucknow,Uttar+Pradesh+226020" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-slate-400 group hover:text-white transition-colors"
                  aria-label="View location on Google Maps"
                >
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-blue-500 border border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <MapPin size={20} />
                  </div>
                  <p className="text-sm font-bold leading-tight">
                    {t('contact_address')}
                  </p>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+919026914282" 
                  className="flex items-center gap-4 text-slate-400 hover:text-white transition-colors group"
                  aria-label="Call SG Sir"
                >
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-blue-500 border border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Phone size={20} />
                  </div>
                  <p className="font-bold text-sm text-[#90b8b9]">+91 90269 14282</p>
                </a>
              </li>
              <li>
                <a 
                  href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=statisticsbysg@gmail.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-4 text-slate-400 hover:text-white transition-colors group"
                  aria-label="Send an email"
                >
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-blue-500 border border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <p className="font-bold text-sm">statisticsbysg@gmail.com</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-600 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            © {currentYear} Statistics By SG • {t('footer_crafted')}
          </p>
        </div>
      </div>
    </div>
  </footer>
  );
}
