import React, { useState } from 'react';
import { MapPin, Users, GraduationCap, ArrowRight, X, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';

const classroomImages = [
  {
    url: 'https://lh3.googleusercontent.com/d/1agEXJYXGqcvpF2fkGrLN4RdRA0F2oT8L',
    title: 'Class View',
    span: 'col-span-2 row-span-2'
  },
  {
    url: 'https://lh3.googleusercontent.com/d/13Xj0vevNbFv0WUAPYh13K-XlZEzeEJgl',
    title: 'Focused Environment',
    span: 'col-span-1 row-span-1'
  },
  {
    url: 'https://lh3.googleusercontent.com/d/1l2OEKZzrF0oSDjloHlQhjpAn3ib74dCs',
    title: 'Regular Batches',
    span: 'col-span-1 row-span-1'
  },
  {
    url: 'https://lh3.googleusercontent.com/d/1zFQbIGbsRcbMLm1uMalHCMhgHn1nRhUe',
    title: 'Modern Facilities',
    span: 'col-span-1 row-span-1'
  },
  {
    url: 'https://lh3.googleusercontent.com/d/13mDOrsnIIS__8p6GJ6SZS17hpI7pXU1R',
    title: 'Library Facility',
    span: 'col-span-2 row-span-1'
  },
  {
    url: 'https://lh3.googleusercontent.com/d/1ZNnVxWnWnXYw9ckJi_peryanOGBBRg6U',
    title: 'Study Area',
    span: 'col-span-1 row-span-1'
  },
  {
    url: 'https://lh3.googleusercontent.com/d/1qWmTdNXHKjykMQw6fTY4eCUkGzvohNYa',
    title: 'Innovation Lab',
    span: 'col-span-1 row-span-1'
  },
  {
    url: 'https://lh3.googleusercontent.com/d/1BvFfsiiqPWXHcAbxXsXLr5pWqItsWWr-',
    title: 'Resource Center',
    span: 'col-span-1 row-span-1'
  }
];

interface OfflineClassesProps {
  onNavigate: (page: string) => void;
}

export default function OfflineClasses({ onNavigate }: OfflineClassesProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex + 1) % classroomImages.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex - 1 + classroomImages.length) % classroomImages.length);
    }
  };

  return (
    <section id="offline-center" className="pt-8 md:pt-0 pb-[10px] bg-transparent relative overflow-hidden">
      {/* Interactive Modal */}
      <AnimatePresence>
        {currentIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCurrentIndex(null)}
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full aspect-video md:aspect-auto md:h-[70vh] rounded-3xl overflow-hidden shadow-2xl bg-black/20">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentIndex}
                    src={classroomImages[currentIndex].url} 
                    alt="Classroom" 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full h-full object-contain" 
                    loading="lazy" 
                  />
                </AnimatePresence>

                {/* Arrows */}
                <button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/20 z-10"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/20 z-10"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="absolute top-6 right-6 flex gap-4">
                <button 
                  onClick={() => {
                    setCurrentIndex(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all shadow-xl font-bold cursor-pointer"
                >
                  <Home size={18} />
                  <span className="hidden sm:inline">{t('back_to_home')}</span>
                </button>
                <button 
                  onClick={() => setCurrentIndex(null)}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center transition-all cursor-pointer border border-white/20"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mt-8 flex gap-2">
                {classroomImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? 'bg-violet-500 w-8' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-violet-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-violet-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="pt-[15px]"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.a 
                href="https://www.google.com/maps/search/?api=1&query=D,+59,+Nirala+Nagar,Lucknow,Uttar+Pradesh+226020"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-xs font-black uppercase tracking-widest border border-violet-200 cursor-pointer shadow-sm hover:bg-violet-200 transition-colors"
              >
                <MapPin size={14} className="animate-bounce text-violet-600" />
                {t('offline_location_badge')}
              </motion.a>

              <motion.a
                href="https://www.google.com/maps/place/SAMPOORNA+LIBRARY+AND+CLASSES/@26.8718153,80.9394352,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgICd7OCLMA!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHT8HrIOctVCrWmOr1XeTqfPKgou_ICtxo000hAJQTQYyol9tAiK397Firo9AE-yr0fU5bwgVu0GXR-qsg7-Mnlmr6vnGL-s8P1uKR8-Jum46pq529_1eONqzHvNnl-lk9mfFfU%3Dw203-h270-k-no!7i768!8i1024!4m16!1m8!3m7!1s0x399bfd2c34096d99:0x138ee07fb9051a9f!2sSAMPOORNA+LIBRARY+AND+CLASSES!8m2!3d26.8718048!4d80.9394916!10e5!16s%2Fg%2F11vqj90wvh!3m6!1s0x399bfd2c34096d99:0x138ee07fb9051a9f!8m2!3d26.8718048!4d80.9394916!10e5!16s%2Fg%2F11vqj90wvh?entry=ttu&g_ep=EgoyMDI2MDQyOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors shrink-0 group relative"
                aria-label="View 3D map"
              >
                <div className="flex flex-col items-center justify-center leading-none">
                  <span className="text-[10px] font-black">3D</span>
                  <span className="text-[7px] font-bold uppercase tracking-tighter">Map</span>
                </div>
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
              </motion.a>
            </div>
            
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-slate-900 mb-6 md:mb-[31px] leading-[1.1] tracking-tight">
              {t('offline_title')}
            </h2>
            
            <p className="text-slate-600 text-base sm:text-xl font-medium mb-6 md:mb-[31px] leading-relaxed">
              {t('offline_subtitle')}
            </p>
            
            <p className="text-slate-500 text-sm sm:text-lg mb-8 md:mb-[35px] leading-relaxed max-w-xl">
              {t('offline_desc')}
            </p>

            {/* Decorative Image for Blank Space */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 sm:mb-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border-2 sm:border-4 border-slate-50 aspect-[4/3] sm:aspect-video relative group"
            >
              <img 
                src="https://lh3.googleusercontent.com/d/1Sr8m-x6gKs8C3P5x8wIEAZickjviYqSx" 
                alt="Mathematics Detail" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                loading="lazy"
                width="600"
                height="400"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-violet-600/10 mix-blend-multiply" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-violet-600 shadow-xl shadow-violet-500/5 border border-slate-200 shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Small Batch Size</h4>
                  <p className="text-xs text-slate-500 font-medium">Focus on individual growth and personal mentoring.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-violet-600 shadow-xl shadow-violet-500/5 border border-slate-200 shrink-0">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Live Problem Solving</h4>
                  <p className="text-xs text-slate-500 font-medium">Solve complex statistics problems in real-time with SG Sir.</p>
                </div>
              </div>

            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('classroom')}
              className="inline-flex items-center gap-4 px-10 pt-[13px] pb-[15px] mt-[19px] bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-brand-500/20 hover:from-brand-600 hover:to-brand-500 transition-all group cursor-pointer border border-white/5"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors -mt-[3px] mb-[1px]">
                <Home size={16} />
              </div>
              {t('offline_visit')}
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right Side: Image Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-3 grid-flow-dense gap-3 sm:gap-4 h-auto min-h-0 sm:min-h-[500px]"
          >
            {classroomImages.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setCurrentIndex(idx)}
                className={`relative rounded-xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-2xl group ${img.span} cursor-pointer`}
              >
                <img 
                  src={img.url} 
                  alt={img.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end pt-[6px] pb-[6px] px-6">
                  <p className="text-white font-bold text-sm">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
