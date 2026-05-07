import { useState, useRef, useEffect, memo, useMemo } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquarePlus } from 'lucide-react';
import { motion, useAnimationFrame, useMotionValue, animate } from 'motion/react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from '../lib/firebase';
import { useLanguage } from '../lib/LanguageContext';
import ReviewModal from './ReviewModal';

const staticTestimonials = [
  {
    name: 'Sudhanshu',
    role: 'ISS Selected Candidate',
    text: "SG Sir's depth in Statistical Inference and Probability is unparalleled. His structured approach helped me crack the Indian Statistical Service. Truly the best mentor for ISS.",
    image: 'https://ui-avatars.com/api/?name=Sudhanshu&background=0D8ABC&color=fff',
    color: 'bg-blue-600',
  },
  {
    name: 'Gyanendra',
    role: 'IIT-JAM Statistics (AIR Top 50)',
    text: "The way SG Sir simplifies complex mathematical concepts is amazing. The problem-solving techniques for JAM were a game-changer for me. Highly recommended!",
    image: 'https://ui-avatars.com/api/?name=Gyanendra&background=F59E0B&color=fff',
    color: 'bg-amber-500',
  },
  {
    name: 'Achintiya',
    role: 'ASO Selected candidate',
    text: "Clear concepts and exam-oriented notes! Sir's guidance for the UPSSSC ASO exam was spot on. The bilingual explanation made every technical term easy to grasp.",
    image: 'https://ui-avatars.com/api/?name=Achintiya&background=10B981&color=fff',
    color: 'bg-emerald-500',
  },
  {
    name: 'Naveen',
    role: 'GATE (ST) Qualified',
    text: "If you want to master Statistics for GATE or NET, this is the place. Sir's clarity on Multivariate Analysis and Estimation is exceptional.",
    image: 'https://ui-avatars.com/api/?name=Naveen&background=8B5CF6&color=fff',
    color: 'bg-violet-500',
  },
  {
    name: 'Arunima',
    role: 'CSIR NET/JRF statistics',
    text: "The conceptual foundation I built here helped me clear JRF in my first attempt. The motivation and constant support from SG Sir are invaluable.",
    image: 'https://ui-avatars.com/api/?name=Arunima&background=EC4899&color=fff',
    color: 'bg-pink-500',
  },
  {
    name: 'Amitesh',
    role: 'University Topper & MSc Scholar',
    text: "Sir's classes were the key to my academic success. He doesn't just teach for exams, he makes you fall in love with the subject of Statistics.",
    image: 'https://ui-avatars.com/api/?name=Amitesh&background=3B82F6&color=fff',
    color: 'bg-blue-500',
  }
];

const Testimonials = memo(() => {
  const { t } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dynamicTestimonials, setDynamicTestimonials] = useState<any[]>([]);
  const isDragging = useRef(false);
  const x = useMotionValue(0);

  const testimonials = useMemo(() => 
    [...staticTestimonials, ...dynamicTestimonials].slice(0, 50),
    [dynamicTestimonials]
  );

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const path = 'reviews';
    try {
      const q = query(
        collection(db, path),
        where('approved', '==', true),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reviews = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          role: `Student (Batch ${doc.data().year})`,
          text: doc.data().review,
          image: doc.data().imageUrl,
          color: 'bg-blue-500'
        }));
        setDynamicTestimonials(reviews);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });

      return () => unsubscribe();
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  }, []);

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
    <section id="reviews" className="pt-4 pb-4 md:pt-6 md:pb-6 bg-brand-dark overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6 md:mb-10 relative z-10 py-0">
        <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-6 md:mb-8 leading-[1.1] tracking-tight">
          {t('testimonials_title')}
        </h2>
        <p className="text-slate-300 text-base md:text-xl font-medium max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed">
          {t('testimonials_subtitle')}
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-3 px-6 py-3 bg-white text-slate-900 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-blue-50 transition-all border-2 border-blue-500/10"
        >
          <MessageSquarePlus size={18} className="text-blue-500" />
          {t('share_review')}
        </motion.button>
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
              className="bg-white p-6 rounded-2xl w-[280px] md:w-[320px] flex-shrink-0 whitespace-normal shadow-xl relative flex flex-col group"
            >
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
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

      <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;
