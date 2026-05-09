import { useState, useEffect, useRef, memo, useMemo } from 'react';
import { ArrowUpRight, GraduationCap, Trophy, BookOpen, Calculator, LineChart, Cpu, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useMotionValue, animate, useAnimationFrame } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import Logo from './Logo';

const Courses = memo(() => {
  const { t } = useLanguage();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const isDragging = useRef(false);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const courses = useMemo(() => [
    {
      id: 1,
      title: 'UPSSSC ASO/ARO Batch',
      description: t('description_aso'),
      price: t('free'),
      link: 'https://gdifh.courses.store/826104',
      badge: '100% Free',
      icon: <LineChart className="text-blue-600" />,
      featured: true,
      offline: true,
    },
    {
      id: 2,
      title: t('title_gate'),
      description: t('description_gate'),
      price: 'Premium',
      link: 'https://play.google.com/store/apps/details?id=co.khal.gdifh',
      icon: <Cpu className="text-blue-600" />,
      offline: true,
    },
    {
      id: 3,
      title: t('title_iss'),
      description: t('description_iss'),
      price: 'Premium',
      link: 'https://play.google.com/store/apps/details?id=co.khal.gdifh',
      badge: 'Coming Soon',
      icon: <Trophy className="text-blue-600" />,
      offline: true,
    },
    {
      id: 4,
      title: t('title_jam'),
      description: t('description_jam'),
      price: 'Premium',
      link: 'https://play.google.com/store/apps/details?id=co.khal.gdifh',
      icon: <GraduationCap className="text-blue-600" />,
      offline: true,
    },
    {
      id: 5,
      title: t('title_net'),
      description: t('description_net'),
      price: 'Premium',
      link: 'https://play.google.com/store/apps/details?id=co.khal.gdifh',
      icon: <BookOpen className="text-blue-600" />,
      offline: true,
    },
    {
      id: 6,
      title: t('title_grad'),
      description: t('description_grad'),
      price: 'Premium',
      link: 'https://play.google.com/store/apps/details?id=co.khal.gdifh',
      icon: <Calculator className="text-blue-600" />,
      offline: true,
    },
  ], [t]);

  // Infinite items for seamless scrolling
  const displayCourses = useMemo(() => [...courses, ...courses, ...courses], [courses]);
  const itemsPerView = windowWidth >= 1024 ? 3 : windowWidth >= 768 ? 2 : 1;
  const gap = windowWidth >= 768 ? 32 : 24;

  const getCardWidth = () => {
    const containerWidth = containerRef.current?.offsetWidth || windowWidth;
    return (containerWidth - (itemsPerView - 1) * gap) / itemsPerView;
  };

  const getTranslateX = (index: number) => {
    const itemWidth = getCardWidth();
    return -(index * (itemWidth + gap));
  };

  // Auto-scroll logic (pixel-based for smoothness)
  useAnimationFrame((_, delta) => {
    if (!isPaused && !isDragging.current) {
      const moveBy = (delta / 1000) * 100; // 100px per second for "2sec" feel (approx)
      let currentX = x.get() - moveBy;
      
      const itemWidth = getCardWidth();
      const totalWidth = courses.length * (itemWidth + gap);
      
      if (currentX <= -totalWidth * 2) {
        currentX += totalWidth;
      }
      x.set(currentX);
    }
  });

  const slideToIndex = (index: number) => {
    const targetX = getTranslateX(index);
    const itemWidth = getCardWidth();
    const totalWidth = courses.length * (itemWidth + gap);

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

  useEffect(() => {
    const itemWidth = getCardWidth();
    const initialX = -(courses.length * (itemWidth + gap));
    x.set(initialX);
  }, [windowWidth, courses.length]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    const currentX = x.get();
    const itemWidth = getCardWidth();
    const fullWidth = itemWidth + gap;
    
    // Calculate nearest index
    const currentIndex = Math.round(-currentX / fullWidth);
    const targetIdx = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    slideToIndex(targetIdx);
  };

  const nextSlide = () => handleManualScroll('right');
  const prevSlide = () => handleManualScroll('left');

  return (
    <section id="courses" className="pt-4 md:pt-[10px] pb-8 md:pb-10 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <span className="px-5 py-2 bg-blue-600 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-blue-200">
            {t('latest_batch_heading')}
          </span>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-1 md:mb-6 gap-3 md:gap-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-brand-dark mb-2 md:mb-[12px] tracking-tight leading-[1.1]">
              {t('courses_title')} <br />
              <span className="text-blue-600">{t('courses_subtitle')}</span>
            </h2>
            <p className="text-slate-600 text-sm md:text-lg font-medium leading-relaxed mb-4 md:mb-[24px]">
              {t('courses_description')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 md:mb-[-35px]">
            <a 
              href="https://play.google.com/store/apps/details?id=co.khal.gdifh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 px-6 py-3 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all border border-blue-100 group shadow-sm"
            >

              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center p-1 shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                <Logo hideText={true} size="w-full h-full" />
              </div>
              {t('explore_app')} 
              <ArrowUpRight size={18} className="translate-y-[1px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>

        <div 
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          ref={containerRef}
        >
          {/* Navigation Arrows (All Devices) */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-lg group"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="sm:hidden" />
            <ChevronLeft size={24} className="hidden sm:block group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button 
            onClick={nextSlide}
            className="absolute right-0 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-lg group"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="sm:hidden" />
            <ChevronRight size={24} className="hidden sm:block group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="overflow-hidden rounded-[2rem] py-8">
            <motion.div 
              className="flex cursor-grab active:cursor-grabbing"
              style={{ x, gap: `${gap}px` }}
              drag="x"
              onDragStart={() => isDragging.current = true}
              onDragEnd={() => {
                isDragging.current = false;
                const containerWidth = containerRef.current?.offsetWidth || windowWidth;
                const itemWidth = (containerWidth - (itemsPerView - 1) * gap) / itemsPerView;
                const fullWidth = itemWidth + gap;
                const currentX = x.get();
                const targetIndex = Math.round(-currentX / fullWidth);
                slideToIndex(targetIndex);
              }}
            >
              {displayCourses.map((course, idx) => (
                <div
                  key={`${course.id}-${idx}`}
                  style={{ width: `calc((100% - ${(itemsPerView - 1) * gap}px) / ${itemsPerView})` }}
                  className="flex-shrink-0"
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="h-full bg-white p-5 sm:p-6 rounded-[1.5rem] border-2 border-transparent transition-all duration-300 hover:border-blue-500 hover:shadow-xl flex flex-col scale-100 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        {course.icon}
                      </div>
                      {course.badge && (
                        <span className={`${
                          course.badge === 'Coming Soon' || course.badge === t('coming_soon')
                            ? 'bg-amber-100 text-amber-700 border-amber-200' 
                            : 'bg-green-100 text-green-700 border-green-200 animate-pulse'
                        } text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border`}>
                          {course.badge}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-extrabold text-brand-dark mb-2 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow line-clamp-3">
                      {course.description}
                    </p>
                    
                    <div className="flex flex-col gap-3 pt-4 border-t border-slate-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('starts_at')}</p>
                          <p className={`text-xl font-black ${course.price === t('free') ? 'text-green-600' : 'text-brand-dark'}`}>
                            {course.price}
                          </p>
                        </div>
                        <a
                          href={course.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg font-bold text-xs transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25"
                        >
                          {t('view_details')}
                        </a>
                      </div>
                      
                      {course.offline && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-violet-600 uppercase tracking-wider">
                          <div className="w-3.5 h-3.5 bg-violet-50 rounded-full flex items-center justify-center text-violet-600">
                            <MapPin size={9} />
                          </div>
                          {t('offline_available')}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Indicators / Small Circles */}
          <div className="flex justify-center gap-2 mt-8">
            {courses.map((_, idx) => {
              const itemWidth = getCardWidth();
              const fullWidth = itemWidth + gap;
              const currentX = x.get();
              // Calculate index relative to the middle set
              const totalWidth = courses.length * fullWidth;
              let relativeX = -currentX % totalWidth;
              if (relativeX < 0) relativeX += totalWidth;
              const activeIdx = Math.round(relativeX / fullWidth) % courses.length;

              return (
                <button
                  key={idx}
                  onClick={() => slideToIndex(idx + courses.length)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIdx === idx ? 'bg-blue-600 w-8' : 'bg-slate-300 w-1.5 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

Courses.displayName = 'Courses';

export default Courses;

