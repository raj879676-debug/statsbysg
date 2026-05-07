import React from 'react';
import { CheckCircle2, Zap, MessageSquare, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';
import { useLanguage } from '../lib/LanguageContext';

export default function AppShowcase() {
  const { t } = useLanguage();

  const features = [
    { icon: <Zap className="text-blue-600" />, text: t('app_feature_1') },
    { icon: <MessageSquare className="text-blue-600" />, text: t('app_feature_2') },
    { icon: <CheckCircle2 className="text-blue-600" />, text: t('app_feature_3') },
    { icon: <MessageCircle className="text-blue-600" />, text: t('app_feature_4') },
  ];

  return (
    <section id="app" className="pt-8 pb-8 md:pt-12 md:pb-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 rounded-[2.5rem] p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden border border-blue-100 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 blur-[120px] -z-0" />
          
          <div className="flex-[3] relative z-10 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-brand-dark mb-4 md:mb-6 leading-tight tracking-tight">
              {t('app_title_main')} <br />
              <span className="text-blue-600">{t('app_subtitle_main')}</span>
            </h2>
            <p className="text-slate-600 text-base md:text-lg mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0">
              {t('app_desc')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 md:gap-4 bg-white/50 p-3 md:p-4 rounded-2xl border border-white">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white shadow-sm rounded-xl flex items-center justify-center shrink-0">
                    {React.cloneElement(feature.icon as React.ReactElement, { size: 18 } as any)}
                  </div>
                  <span className="text-xs md:text-sm font-bold text-brand-dark">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=co.khal.gdifh"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105 active:scale-95"
              >
                <img
                  alt="Get it on Google Play"
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  className="h-14 w-auto shadow-xl shadow-brand-500/10 rounded-xl"
                  loading="lazy"
                  width="180"
                  height="60"
                />
              </a>
              <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl shadow-sm border border-blue-100 h-[60px]">
                <Logo className="scale-[0.6] -ml-4" />
                <div>
                  <p className="font-black text-brand-dark leading-none text-sm">4.9 Stars</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{t('app_rating')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-[2] relative flex justify-center lg:justify-end items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 w-full max-w-[260px] bg-slate-900 aspect-[9/18.5] rounded-[3rem] p-3 shadow-2xl border-[8px] border-slate-800"
            >
              <div className="w-full h-full bg-white rounded-[2.2rem] flex flex-col items-center justify-center p-8 text-center gap-3">
                 <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center p-4 shadow-inner">
                   <Logo hideText={true} className="scale-110" />
                 </div>
                 <h3 className="text-xl font-black text-black leading-tight">Statistics <br/> By SG</h3>
                 <div className="w-full h-1 bg-blue-100 rounded-full mt-4" />
                 <div className="w-3/4 h-1 bg-blue-100 rounded-full" />
                 <div className="w-1/2 h-1 bg-blue-100 rounded-full" />
                 <div className="mt-6 flex gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg" />
                    <div className="w-8 h-8 bg-blue-600 rounded-lg" />
                    <div className="w-8 h-8 bg-blue-700 rounded-lg" />
                 </div>
              </div>
            </motion.div>
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-400/20 blur-[120px] -z-10 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
