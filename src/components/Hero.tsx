import { memo } from 'react';
import { Video, ArrowRight, Play, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { useAssets } from '../lib/assetContext';
import StatisticianCarousel from './StatisticianCarousel';

const Hero = memo(() => {
  const { t } = useLanguage();
  const { overrides } = useAssets();
  const bgOverride = overrides['hero_background'];

  return (
    <section className="relative pt-0 pb-[12px] md:pb-[20px] px-4 overflow-hidden">
      <div className="mb-8">
        <StatisticianCarousel />
      </div>
      {/* Background Accents - Removed for plain screen */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        {bgOverride?.isActive && (
          <img 
            src={bgOverride.url} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20" 
            fetchpriority="high"
            loading="eager"
            width="1920"
            height="1080"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto text-center relative">
        <div className="relative pt-4 pb-8">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-700 uppercase bg-blue-100 rounded-full border border-blue-200 w-fit mx-auto">
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
              className="w-full sm:w-auto bg-violet-100 text-violet-800 border border-violet-200 px-8 pt-[10px] pb-[10px] rounded-2xl font-bold text-base sm:text-lg hover:bg-violet-200 transition-all duration-500 flex items-center justify-center gap-3 shadow-lg shadow-violet-500/10 group order-2 sm:order-1"
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
              className="w-full sm:w-auto bg-red-100 text-red-800 border border-red-200 px-8 pt-[8px] pb-[8px] rounded-2xl font-bold text-base sm:text-lg hover:bg-red-200 transition-all duration-500 flex items-center justify-center gap-3 shadow-lg shadow-red-500/10 group order-3"
            >
              <Play className="w-5 h-5 fill-current text-red-600" />
              <span>{t('cta_youtube')}</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
