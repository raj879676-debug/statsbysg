import React from 'react';
import { memo, useMemo } from 'react';
import { ArrowRight, Play, AppWindow } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { useAssets } from '../lib/assetContext';

interface MovingBannerProps {
  items: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    bgColor: string;
    shadowColor: string;
  }[];
  reverse?: boolean;
  duration?: number;
}

const MovingBanner = memo(({ items, reverse = false, duration = 40 }: MovingBannerProps) => {
  if (items.length === 0) return null;
  
  return (
    <div className="relative w-full overflow-hidden py-1.5 flex items-center">
      <motion.div
        className="flex whitespace-nowrap gap-8 w-fit"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ 
          duration: duration,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-8">
            {items.map((item, idx) => (
              <motion.a
                key={`${i}-${idx}`}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-lg ${item.bgColor} text-white shadow-md ${item.shadowColor} hover:scale-105 transition-all group`}
              >
                {item.icon}
                <span className="flex items-center gap-1.5">
                  {item.label}
                </span>
                <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </motion.a>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
});

MovingBanner.displayName = 'MovingBanner';

const GlobalAnnouncements = memo(() => {
  const { t } = useLanguage();
  const { announcements } = useAssets();

  const globalItems = useMemo(() => {
    const fromFirestore = announcements
      .filter(a => a.type === 'global' && a.isActive)
      .map(a => ({
        label: a.label,
        href: a.href,
        icon: <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />,
        bgColor: "bg-indigo-600",
        shadowColor: "shadow-indigo-500/20"
      }));

    if (fromFirestore.length > 0) return fromFirestore;

    // Fallback/Default
    return [{
      label: t('library_announcement'),
      href: "https://sampoornalibrary.com",
      icon: <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />,
      bgColor: "bg-indigo-600",
      shadowColor: "shadow-indigo-500/20"
    }];
  }, [announcements, t]);

  return (
    <div className="relative w-full border-b border-indigo-100/50 bg-slate-50/50 backdrop-blur-sm z-[100]">
      <MovingBanner 
        items={globalItems}
        duration={45}
      />
      {/* Fade Edges */}
      <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />
    </div>
  );
});

GlobalAnnouncements.displayName = 'GlobalAnnouncements';

export const SubpageBanners = () => {
  const { announcements } = useAssets();

  const appItems = useMemo(() => {
    const fromFirestore = announcements
      .filter(a => a.type === 'subpage_app' && a.isActive)
      .map(a => ({
        label: a.label,
        href: a.href,
        icon: <AppWindow size={12} />,
        bgColor: "bg-blue-600",
        shadowColor: "shadow-blue-500/20"
      }));

    if (fromFirestore.length > 0) return fromFirestore;

    return [{
      label: "Download Statistics By SG Official App",
      href: "https://play.google.com/store/apps/details?id=co.khal.gdifh",
      icon: <AppWindow size={12} />,
      bgColor: "bg-blue-600",
      shadowColor: "shadow-blue-500/20"
    }];
  }, [announcements]);

  const youtubeItems = useMemo(() => {
    const fromFirestore = announcements
      .filter(a => a.type === 'subpage_youtube' && a.isActive)
      .map(a => ({
        label: a.label,
        href: a.href,
        icon: <Play size={12} className="fill-current" />,
        bgColor: "bg-red-600",
        shadowColor: "shadow-red-500/20"
      }));

    if (fromFirestore.length > 0) return fromFirestore;

    return [{
      label: "Subscribe for Free Classes on YouTube",
      href: "https://www.youtube.com/@statisticsbysg2247",
      icon: <Play size={12} className="fill-current" />,
      bgColor: "bg-red-600",
      shadowColor: "shadow-red-500/20"
    }];
  }, [announcements]);

  return (
    <div className="w-full space-y-0.5">
      <div className="relative w-full bg-slate-900 border-t border-white/5 overflow-hidden">
        <MovingBanner 
          reverse
          duration={35}
          items={appItems}
        />
        <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />
      </div>
      <div className="relative w-full bg-slate-900 overflow-hidden">
        <MovingBanner 
          duration={30}
          items={youtubeItems}
        />
        <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default GlobalAnnouncements;
