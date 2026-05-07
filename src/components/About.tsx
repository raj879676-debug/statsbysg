import { memo } from 'react';
import { GraduationCap, Trophy, Users, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { useAssets } from '../lib/assetContext';

const About = memo(() => {
  const { t } = useLanguage();
  const { overrides } = useAssets();
  const stats = [
    { icon: <GraduationCap className="text-blue-600" />, count: '500+', label: t('stat_selections') },
    { icon: <Trophy className="text-blue-600" />, count: '14+', label: t('stat_exp') },
    { icon: <Users className="text-blue-600" />, count: '10K+', label: t('stat_learners') },
    { icon: <Star className="text-blue-600" />, count: '98%', label: t('stat_satisfaction') },
  ];

  return (
    <section id="about" className="pt-2 pb-8 md:pt-0 md:pb-[20px] bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-500/10 rounded-[3rem] blur-3xl -z-10" />
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-50">
              <img 
                src={overrides['about_image']?.url || "https://lh3.googleusercontent.com/d/1qWmTdNXHKjykMQw6fTY4eCUkGzvohNYa"}
                alt="SG Sir - Statistics Learning Hub"
                className="w-full h-auto block"
                loading="lazy"
                width="600"
                height="800"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (!overrides['about_image']?.url) {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop";
                  }
                }}
              />
            </div>
            {/* Statistics Badge Overlay */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl z-20 border border-slate-100 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Star size={20} className="fill-current" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Growth & Results</div>
                  <div className="text-sm font-bold text-brand-dark">100% Focused Learning</div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:pl-8">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-dark mb-6 md:mb-8 tracking-tight leading-[1.1]">
              {t('about_title')}
            </h2>
            <p className="text-slate-600 text-base md:text-lg font-medium mb-6 md:mb-8 leading-relaxed">
              {t('about_description')}
            </p>
            <p className="text-slate-600 text-xs md:text-sm mb-8 md:mb-12 leading-relaxed italic border-l-4 border-blue-200 pl-4 bg-blue-50/10 py-3 rounded-r-2xl">
              {t('about_extra_desc')}
            </p>

            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col gap-3 group">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-black text-brand-dark leading-none">{stat.count}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;
