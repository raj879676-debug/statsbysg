import { memo } from 'react';
import { Video, ArrowRight, Play, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { useAssets } from '../lib/assetContext';
import GlobalAnnouncements from './GlobalAnnouncements';

const Hero = memo(() => {
  const { t } = useLanguage();
  const { overrides } = useAssets();
  const bgOverride = overrides['hero_background'];

  return (
    <section className="relative pt-[12px] md:pt-[24px] pb-[12px] md:pb-[20px] px-4 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        {bgOverride?.isActive ? (
          <img 
            src={bgOverride.url} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20" 
            fetchpriority="high"
            loading="eager"
            width="1920"
            height="1080"
          />
        ) : (
          <>
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                x: [0, 30, 0],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, -30, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-red-100 rounded-full blur-[100px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                y: [0, 40, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[10%] left-[10%] w-[35%] h-[35%] bg-violet-100 rounded-full blur-[100px]" 
            />
          </>
        )}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-6">
          <GlobalAnnouncements />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full border border-blue-100 w-fit mx-auto">
            {t('hero_badge')}
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-brand-dark tracking-tight leading-[1.1] mb-8">
            {t('hero_title').split(' ').slice(0, 2).join(' ')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600">
              {t('hero_title').split(' ').slice(2).join(' ')}
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 font-bold mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-[15px] sm:px-0">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#offline-center"
              className="w-full sm:w-auto bg-violet-50 text-violet-700 border border-violet-100 px-8 pt-[10px] pb-[10px] rounded-2xl font-bold text-base sm:text-lg hover:bg-violet-100 transition-all duration-500 flex items-center justify-center gap-3 shadow-lg shadow-violet-500/10 group order-2 sm:order-1"
            >
              <MapPin className="w-5 h-5 text-violet-500" />
              <span>{t('nav_offline')}</span>
            </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://meet.google.com/hzv-egmc-wrd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-blue-600 text-white px-8 pt-[10px] pb-[10px] rounded-2xl font-bold text-base sm:text-lg hover:bg-blue-700 transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 group order-1 sm:order-2"
              >
              <Video className="w-5 h-5" />
              <span>{t('cta_live_batch')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-500" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#youtube"
              className="w-full sm:w-auto bg-red-50 text-red-700 border border-red-100 px-8 pt-[8px] pb-[8px] rounded-2xl font-bold text-base sm:text-lg hover:bg-red-100 transition-all duration-500 flex items-center justify-center gap-3 shadow-lg shadow-red-500/10 group order-3"
            >
              <Play className="w-5 h-5 fill-current text-red-600" />
              <span>{t('cta_youtube')}</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
