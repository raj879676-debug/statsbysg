import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface ScrollControlsProps {
  currentPage?: string;
  onBack?: () => void;
}

const ScrollControls = ({ currentPage, onBack }: ScrollControlsProps) => {
  const { t } = useLanguage();

  const slowScroll = (targetY: number) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 600; // Faster scroll duration
    let startTime: number | null = null;

    const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startY, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  };

  const scrollToTop = () => slowScroll(0);
  const scrollToBottom = () => slowScroll(document.documentElement.scrollHeight);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="fixed right-3 md:right-8 bottom-6 md:bottom-10 z-[9999] flex flex-col items-center gap-3">
      {/* Back Button - Restored to separate circle */}
      <AnimatePresence mode="wait">
        {currentPage !== 'home' && (
          <motion.button
            initial={{ opacity: 0, scale: 0, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="w-10 h-10 md:w-14 md:h-14 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 shadow-2xl hover:bg-slate-800 hover:text-blue-300 transition-all"
            title="Go Back"
          >
            <ArrowLeft size={22} className="md:w-6 md:h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll Controls Group - Restored to separate pill */}
      <div className="flex flex-col bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-2xl p-1 md:p-1.5 overflow-hidden">
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-all"
          title="Scroll to Top"
        >
          <ChevronUp size={22} className="md:w-6 md:h-6" />
        </motion.button>
        
        <div className="w-full h-px bg-slate-100 mx-auto" />

        <motion.button
          whileHover={{ scale: 1.1, y: 2 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToBottom}
          className="w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-all"
          title="Scroll to Bottom"
        >
          <ChevronDown size={22} className="md:w-6 md:h-6" />
        </motion.button>
      </div>
    </div>
  );
};

export default ScrollControls;
