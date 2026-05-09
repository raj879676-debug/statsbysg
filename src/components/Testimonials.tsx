import { useState, useRef, useEffect, memo, useMemo } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useAnimationFrame, useMotionValue, animate } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';

const staticTestimonials = [
  {
    name: 'Naveen',
    role: 'ASO Selected',
    text: "SG Sir’s expertise in statistical theory and his simplified teaching approach were key to my ASO selection. His focus on core concepts and exam-oriented strategy made even the most complex topics easy to master.",
    image: 'https://ui-avatars.com/api/?name=Naveen&background=eff6ff&color=111827',
    color: 'bg-blue-600',
  },
  {
    name: 'Aditi',
    role: 'ASO Selected',
    text: "The structured guidance and high-quality content on the Statistics By SG platform helped me clear the ASO exam with confidence. I highly recommend his mentorship to anyone aiming for a professional career in statistics.",
    image: 'https://ui-avatars.com/api/?name=Aditi&background=eff6ff&color=111827',
    color: 'bg-amber-500',
  },
  {
    name: 'Aditya',
    role: 'B.Sc. Statistics Student',
    text: "SG Sir makes advanced statistics feel like a breeze. His explanation of complex derivations helped me top my B.Sc. exams and built a solid foundation for my future goals.",
    image: 'https://ui-avatars.com/api/?name=Aditya&background=eff6ff&color=111827',
    color: 'bg-emerald-500',
  },
  {
    name: 'Anuj',
    role: 'B.Sc. Statistics Student',
    text: "The best resource for any B.Sc. student! The way he connects theoretical concepts to practical applications is incredible and has completely changed how I approach the subject.",
    image: 'https://ui-avatars.com/api/?name=Anuj&background=eff6ff&color=111827',
    color: 'bg-violet-500',
  },
  {
    name: 'Sudhanshu',
    role: 'B.Sc. Statistics Student',
    text: "I was struggling with time series and stationarity until I found SG Sir. His teaching is precise, easy to follow, and perfectly aligned with our university syllabus.",
    image: 'https://ui-avatars.com/api/?name=Sudhanshu&background=eff6ff&color=111827',
    color: 'bg-pink-500',
  },
  {
    name: 'Asif',
    role: 'B.A. Statistics Student',
    text: "As a B.A. student, I was initially intimidated by the math, but SG Sir breaks everything down into logical steps. His sessions are a must-watch for anyone wanting to master the subject.",
    image: 'https://ui-avatars.com/api/?name=Asif&background=eff6ff&color=111827',
    color: 'bg-blue-500',
  },
  {
    name: 'Krishna Kant',
    role: 'B.A. Statistics Student',
    text: "The clarity SG Sir provides is unmatched. He simplifies even the toughest statistical theories, making them accessible and interesting for students from all backgrounds.",
    image: 'https://ui-avatars.com/api/?name=Krishna+Kant&background=eff6ff&color=111827',
    color: 'bg-slate-600',
  },
  {
    name: 'Aniket',
    role: 'B.Sc. & IIT-JAM',
    text: "SG Sir’s approach to IIT-JAM preparation is a total game-changer. He simplifies high-level derivations and statistical inference so well that even the most daunting B.Sc. topics become easy to score in.",
    image: 'https://ui-avatars.com/api/?name=Aniket&background=eff6ff&color=111827',
    color: 'bg-indigo-500',
  },
  {
    name: 'Arunima',
    role: 'B.Sc. & IIT-JAM',
    text: "I cleared my concepts and gained immense confidence for the IIT-JAM thanks to this mentorship. The way SG Sir links our B.Sc. syllabus to competitive exam patterns is exactly what every aspirant needs.",
    image: 'https://ui-avatars.com/api/?name=Arunima&background=eff6ff&color=111827',
    color: 'bg-rose-500',
  },
  {
    name: 'Amitesh',
    role: 'B.Sc. & IIT-JAM',
    text: "From basic B.Sc. theory to cracking tough IIT-JAM problems, SG Sir’s guidance is flawless. His focus on logic rather than just formulas helped me master the subject and improve my rank significantly.",
    image: 'https://ui-avatars.com/api/?name=Amitesh&background=eff6ff&color=111827',
    color: 'bg-cyan-500',
  }
];

const Testimonials = memo(() => {
  const { t } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const isDragging = useRef(false);
  const x = useMotionValue(0);

  const testimonials = useMemo(() => staticTestimonials, []);

  // Auto-scroll logic
  useAnimationFrame((_, delta) => {
    if (!isPaused && !isDragging.current && testimonials.length > 0) {
      const moveBy = (delta / 1000) * 40; // 40px per second
      let currentX = x.get() - moveBy;
      
      const cardWidth = window.innerWidth >= 768 ? 360 : 320; // 320/280 + 40px gap
      const totalWidth = testimonials.length * cardWidth;
      
      if (currentX <= -totalWidth) {
        currentX += totalWidth;
      }
      x.set(currentX);
    }
  });

  // Manual scroll handlers
  const handleManualScroll = (direction: 'left' | 'right') => {
    const cardWidth = window.innerWidth >= 768 ? 360 : 320;
    const totalWidth = testimonials.length * cardWidth;
    const currentX = x.get();
    const targetX = direction === 'left' ? currentX + cardWidth : currentX - cardWidth;
    
    animate(x, targetX, {
      type: "spring",
      stiffness: 400,
      damping: 40,
      onUpdate: (latest) => {
        if (latest <= -totalWidth) {
          x.set(latest + totalWidth);
        } else if (latest > 0) {
          x.set(latest - totalWidth);
        }
      }
    });
  };

  return (
    <section id="reviews" className="pt-4 pb-4 md:pt-6 md:pb-6 bg-transparent overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6 md:mb-10 relative z-10 py-12 bg-slate-950/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl">
        <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-6 md:mb-8 leading-[1.1] tracking-tight">
          {t('testimonials_title')}
        </h2>
        <p className="text-slate-300 text-base md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
          {t('testimonials_subtitle')}
        </p>
      </div>

      <div className="px-4">
        <motion.div
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -(testimonials.length * 2 * (window.innerWidth >= 768 ? 360 : 320)), right: 0 }}
          onDragStart={() => isDragging.current = true}
          onDragEnd={() => {
            isDragging.current = false;
            const cardWidth = window.innerWidth >= 768 ? 360 : 320;
            const totalWidth = testimonials.length * cardWidth;
            // Ensure x stays within loop boundaries or resumes correctly
            if (x.get() <= -totalWidth) {
              x.set(x.get() + totalWidth);
            } else if (x.get() > 0) {
               x.set(x.get() - totalWidth);
            }
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-10 py-10 w-fit cursor-grab active:cursor-grabbing"
        >
          {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.01 }}
              className="bg-white p-6 rounded-2xl w-[280px] md:w-[320px] flex-shrink-0 whitespace-normal shadow-xl border border-blue-100 flex flex-col group relative"
            >
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                <Quote size={18} fill="currentColor" />
              </div>


              <div className="flex text-yellow-400 mb-6 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              
              <div className="relative flex-grow">
                <p className="text-slate-600 leading-relaxed text-xs font-medium mb-6">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img 
                  src={t.image} 
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-50 shadow-md"
                  width="48"
                  height="48"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
              
              <div className="absolute bottom-6 right-6 text-slate-100 font-black text-5xl -z-10 select-none group-hover:text-blue-50 transition-colors">
                {(idx % testimonials.length) + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          onClick={() => handleManualScroll('left')}
          className="w-10 h-10 rounded-full border-2 border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all active:scale-95 group shadow-lg"
          aria-label="Previous review"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => handleManualScroll('right')}
          className="w-10 h-10 rounded-full border-2 border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all active:scale-95 group shadow-lg"
          aria-label="Next review"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;
