import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { Languages, MessageCircle } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-24 right-4 md:right-8 z-[100] flex flex-col items-end gap-2.5 floating-control">
      <div className="flex items-center gap-2 pt-[14px]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1 bg-white/80 backdrop-blur-md border border-slate-200 p-1 rounded-2xl shadow-2xl overflow-hidden"
        >
          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              language === 'en' 
                ? 'bg-brand-dark text-white' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              language === 'hi' 
                ? 'bg-brand-dark text-white' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            HI
          </button>
        </motion.div>
      </div>

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/919026914282?text=Hello%21%20I%20have%20a%20query%20regarding%20Statistics%20coaching."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-[#25D366] text-white p-4 rounded-2xl shadow-2xl shadow-[#25D366]/40 flex items-center justify-center group relative"
      >
        <MessageCircle size={24} className="fill-current" />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-white text-[#25D366] text-[10px] font-black rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-green-50 pointer-events-none">
          CHAT WITH SG SIR
        </span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </motion.a>
    </div>
  );
}
