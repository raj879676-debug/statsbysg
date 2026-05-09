import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Youtube, BookOpen, Loader2, X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, animate, useAnimationFrame } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';

const CHANNEL_ID = 'UCclW-5T05M0H8L1F3841Y64Q';
const FALLBACK_VIDEOS = [
  { id: 'O3a_-7KkcyM', title: 'Statistics Masterclass 1' },
  { id: 'BIXEd6upzFk', title: 'Statistics Masterclass 2' },
  { id: 'tIUTZLAyS-M', title: 'Statistics Masterclass 3' },
  { id: 'oDe6sqAvaMA', title: 'Statistics Masterclass 4' },
];

interface YouTubeVideo {
  id: string;
  title: string;
}

const YouTubeGallery = memo(() => {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const fetchVideos = async () => {
      // Check cache first in localStorage with 12h expiration
      const cachedData = localStorage.getItem('youtube_cache');
      const now = new Date().getTime();
      const CACHE_TIME = 12 * 60 * 60 * 1000;

      if (cachedData) {
        try {
          const { videos: cachedVideos, timestamp } = JSON.parse(cachedData);
          if (now - timestamp < CACHE_TIME) {
            setVideos(cachedVideos);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error("Cache error", e);
        }
      }

      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
      
      const tryFetchWithRss2Json = async () => {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        if (!response.ok) throw new Error('Rss2Json fetch failed');
        const data = await response.json();
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          return data.items.slice(0, 10).map((item: any) => ({
            id: item.guid.split(':')[2] || item.link.split('v=')[1], 
            title: item.title,
          }));
        }
        throw new Error('Invalid data from Rss2Json');
      };

      const tryFetchWithAllOrigins = async () => {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
        if (!response.ok) throw new Error('AllOrigins fetch failed');
        const data = await response.json();
        const xmlString = data.contents;
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const entries = xmlDoc.getElementsByTagName("entry");
        
        if (entries.length > 0) {
          return Array.from(entries).slice(0, 10).map((entry: any) => {
            const videoId = entry.getElementsByTagName("yt:videoId")[0]?.textContent || 
                            entry.getElementsByTagName("id")[0]?.textContent?.split(':').pop();
            const title = entry.getElementsByTagName("title")[0]?.textContent;
            return { id: videoId, title };
          }).filter(v => v.id);
        }
        throw new Error('No entries found in RSS');
      };

      try {
        let fetchedVideos;
        try {
          fetchedVideos = await tryFetchWithRss2Json();
        } catch (rssError) {
          console.warn('Primary YouTube fetch failed, trying fallback...');
          fetchedVideos = await tryFetchWithAllOrigins();
        }

        if (fetchedVideos && fetchedVideos.length > 0) {
          setVideos(fetchedVideos);
          localStorage.setItem('youtube_cache', JSON.stringify({
            videos: fetchedVideos,
            timestamp: now
          }));
        }
      } catch (error) {
        console.warn('YouTube fetch failure, using Fallback Videos:', error);
        // Fallback videos are already in the state by default
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Responsive settings
  const itemsPerView = windowWidth < 640 ? 1.2 : windowWidth < 1024 ? 2.5 : 3.5;
  const gap = 24;

  const getCardWidth = () => {
    const containerWidth = containerRef.current?.offsetWidth || windowWidth;
    return (containerWidth - (itemsPerView - 1) * gap) / itemsPerView;
  };

  const getTranslateX = (index: number) => {
    const itemWidth = getCardWidth();
    return -(index * (itemWidth + gap));
  };

  const displayVideos = useMemo(() => {
    if (videos.length === 0) return [];
    // Triple the items for smooth infinite wrap
    return [...videos, ...videos, ...videos];
  }, [videos]);

  // Auto-scroll logic (pixel-based for smoothness)
  useAnimationFrame((_, delta) => {
    if (!isPaused && !isDragging.current && videos.length > 0) {
      const moveBy = (delta / 1000) * 80; // 80px per second
      let currentX = x.get() - moveBy;
      
      const itemWidth = getCardWidth();
      const totalWidth = videos.length * (itemWidth + gap);
      
      if (currentX <= -totalWidth * 2) {
        currentX += totalWidth;
      }
      x.set(currentX);
    }
  });

  const slideToIndex = (index: number) => {
    const targetX = getTranslateX(index);
    const itemWidth = getCardWidth();
    const totalWidth = videos.length * (itemWidth + gap);

    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      onUpdate: (latest) => {
        if (latest <= -totalWidth * 2) {
          x.set(latest + totalWidth);
        } else if (latest > -totalWidth) {
          // Keep it in the middle set
        }
      }
    });
  };

  const handleManualScroll = (direction: 'left' | 'right') => {
    const currentX = x.get();
    const itemWidth = getCardWidth();
    const fullWidth = itemWidth + gap;
    
    // Calculate nearest index
    const currentIndex = Math.round(-currentX / fullWidth);
    const targetIdx = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    slideToIndex(targetIdx);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      const itemWidth = getCardWidth();
      const initialX = -(videos.length * (itemWidth + gap));
      x.set(initialX);
    }
  }, [videos.length, itemsPerView, windowWidth]);

  useEffect(() => {
    // Handle hardware back button
    const handlePopState = (e: PopStateEvent) => {
      if (activeVideoId) {
        e.preventDefault();
        setActiveVideoId(null);
      }
    };

    if (activeVideoId) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('video-playing');
      // Add a state to history so back button closes modal
      window.history.pushState({ modal: 'video' }, '');
      window.addEventListener('popstate', handlePopState);
    } else {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('video-playing');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeVideoId]);

  const closeModal = () => {
    if (activeVideoId) {
      // If we are in the modal state, going back in history will trigger the popstate handler
      window.history.back();
    }
    setActiveVideoId(null);
  };

  return (
    <section id="youtube" className="pt-6 pb-6 md:pt-[30px] md:pb-[30px] bg-transparent border-y border-slate-400/20 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 blur-[120px] -z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-8 items-start">
          <div className="max-w-3xl text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-50 text-red-600 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-widest mb-4 md:mb-6 border border-red-100 shadow-sm">
              <Youtube size={14} />
              Featured Content
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight leading-[1.1]">
              {t('youtube_title')}
            </h2>
            <p className="text-slate-600 text-base md:text-xl leading-relaxed max-w-2xl mb-6 md:mb-8 font-medium">
              {t('youtube_subtitle')}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 text-red-700 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-red-50 italic shadow-sm">
              ✨ {t('youtube_quality_msg')}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://www.youtube.com/@statisticsbysg2247"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-10 pt-[8px] pb-[8px] rounded-2xl font-bold transition-all shadow-2xl shadow-red-500/20 w-full sm:w-auto"
            >
              <Youtube className="text-white" size={20} />
              {t('youtube_visit')}
            </motion.a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            <p className="text-slate-500 font-medium">{t('youtube_fetching')}</p>
          </div>
        ) : (
          <div 
            className="relative group mb-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            ref={containerRef}
          >
            <div className="overflow-hidden py-4">
              <motion.div 
                className="flex cursor-grab active:cursor-grabbing"
                style={{ x }}
                drag="x"
                onDragStart={() => isDragging.current = true}
                onDragEnd={() => {
                  isDragging.current = false;
                  const itemWidth = getCardWidth();
                  const fullWidth = itemWidth + gap;
                  const currentX = x.get();
                  const targetIndex = Math.round(-currentX / fullWidth);
                  slideToIndex(targetIndex);
                }}
              >
                {displayVideos.map((video, index) => {
                  const itemWidth = getCardWidth();
                  
                  return (
                    <div 
                      key={`${video.id}-${index}`} 
                      style={{ width: `${itemWidth}px` }}
                      className="flex-shrink-0"
                    >
                      <motion.button
                        onClick={() => setActiveVideoId(video.id)}
                        whileHover={{ y: -5 }}
                        className="w-full group relative aspect-video rounded-[1.5rem] overflow-hidden border-2 border-transparent transition-all duration-700 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20 text-left"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                          alt={`Thumbnail for ${video.title}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          width="480"
                          height="270"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="relative flex items-center justify-center w-10 h-7 bg-[#FF0000] rounded-lg shadow-xl shadow-red-600/40 border border-white/10">
                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-white border-b-[5px] border-b-transparent ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white text-xs font-bold line-clamp-1">{video.title}</p>
                        </div>
                      </motion.button>
                    </div>
                  );
                })}
              </motion.div>
            </div>
            
            {/* Quick Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => handleManualScroll('left')}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg"
                aria-label="Previous YouTube video"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => handleManualScroll('right')}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg"
                aria-label="Next YouTube video"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Video Modal */}
        <AnimatePresence>
          {activeVideoId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-sm"
              onClick={() => setActiveVideoId(null)}
            >
              <div className="w-full max-w-5xl flex justify-center items-center mb-6">
                <a 
                  href="https://www.youtube.com/@statisticsbysg2247"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-all group px-4 py-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-1.5 bg-red-600 rounded-lg group-hover:scale-110 transition-transform">
                    <Youtube size={16} className="text-white" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{t('youtube_visit')}</span>
                </a>
              </div>
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: [0.32, 1, 0.2, 1] }}
                className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5"
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&playsinline=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </motion.div>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-6" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={closeModal}
                  className="flex items-center justify-center w-10 h-10 bg-slate-50 text-slate-900 rounded-full hover:bg-slate-100 transition-all shadow-xl shadow-black/40 border border-white/20 group"
                  aria-label={t('back')}
                >
                  <X size={20} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300 text-red-600" />
                </button>
                <div className="hidden sm:block h-8 w-px bg-white/20" />
                <p className="text-white/80 text-sm font-bold italic tracking-wide text-center">
                  ✨ {t('youtube_quality_msg')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

YouTubeGallery.displayName = 'YouTubeGallery';

export default YouTubeGallery;
