import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'motion/react';

interface Statistician {
  name: string;
  title: string;
  image: string;
}

const worldStatisticians: Statistician[] = [
  { name: "Sir Ronald A. Fisher", title: "Father of Modern Statistics", image: "https://lh3.googleusercontent.com/d/1crmFcBdEGLjIuqbvJxCnGW9Kz8FPul63" },
  { name: "Karl Pearson", title: "Founder of Mathematical Statistics", image: "https://lh3.googleusercontent.com/d/1Pktp2u5FAZwdzQSu3feltwk1fuRnLxVL" },
  { name: "Ada Lovelace", title: "First Computer Programmer", image: "https://lh3.googleusercontent.com/d/1tUvSLpEnS7gSzcEKwM0dogZeDEAyHpPA" },
  { name: "Thomas Bayes", title: "Bayesian Inference Pioneer", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9k6KQc-OCaTeWYZEQasjwxP1zEeRIRlCHmPMYEe5huqZzQUoIIwa2tsmicCAIwnBy8gvFsfdF4GxTXObTbQWWeFSjADzes8mDTwE5BGjm&s=10" },
  { name: "William Sealy Gosset", title: "Student's t-distribution Creator", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/William_Sealy_Gosset.jpg/500px-William_Sealy_Gosset.jpg" },
  { name: "John Tukey", title: "Exploratory Data Analysis Pioneer", image: "https://images.squarespace-cdn.com/content/v1/58cde3fcdb29d633eb688e9e/1608158178942-NAR1H7IISXHVDUUG6BIS/image-asset.jpeg?format=1000w" },
  { name: "David R. Cox", title: "Proportional Hazards Model Pioneer", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRupjH3uVyZ_di_tHqjKpB5NPqavkU3pDQCFqbxolQgZC1cfIVyofUhfYiMtbbYxz958cTTmlyCijKHfsIXDxrvWfh0rW52eelS-bDTy-Y&s=10" },
  { name: "Florence Nightingale", title: "Pioneer of Visualizing Data", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJqSc3voHXhK8_ubFaH-RWvx1Qv-_AYsuw4oNCIAoPO5rbaW566tpRw9he0ZZ17USj-R53Tq4w6W_8CN15PMwHTJiUtpN_y_wTAWJaj2Xm&s=10" },
  { name: "Gertrude Mary Cox", title: "Expert in Experimental Design", image: "https://upload.wikimedia.org/wikipedia/en/7/7f/Gertrude_Mary_Cox.jpg" },
];

const indianStatisticians: Statistician[] = [
  { name: "P. C. Mahalanobis", title: "Father of Indian Statistics", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4W69eE0Jaj4US2HSqhdTxTP82hDePmjsbLP6Rv8psbmm-p7SN5yptbFe5xSeFuuG3AWmSz7Osh0CaLU2q6UscS11qZvCc1iRixVOsGQmJaA&s=10" },
  { name: "R. C. Bose", title: "Coding Theory & Design Pioneer", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCcpLTDeGJDKoiYK656SpKzdJuiIi0_6rEyZ4cqJO_WyY6yKIkbjzjA-zdjqGPOkolcr7KayJnBpuKMHZxjP6NjoWIqDPZrvfe9iwt2ML9sg&s=10" },
  { name: "S. N. Roy", title: "Multivariate Analysis Pioneer", image: "https://lh3.googleusercontent.com/d/1rQik6jWupU4whRnp-skkjbjTZSnQWD9j" },
  { name: "C. R. Rao", title: "Cramer-Rao Bound Legend", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrXzcvLP-piDMNAUdN0BK18QVMmfCQVuRbL7w_s2j9rBKKQLVsZTDiZJtXpKjeVr15oFD2I75cmh3trrEHxr9B_Efa6-nzCx_spUgcQfVj&s=10" },
];

const allStatisticians = [...worldStatisticians, ...indianStatisticians];

const StatisticianCarousel: React.FC = () => {
  const x = useMotionValue(0);
  const [isPaused, setIsPaused] = useState(false);
  const isDragging = useRef(false);

  const displayStatisticians = useMemo(() => {
    return [...allStatisticians, ...allStatisticians, ...allStatisticians];
  }, []);

  const gap = 32;
  const itemWidth = 140;
  const fullItemWidth = itemWidth + gap;

  useEffect(() => {
    const totalWidth = allStatisticians.length * fullItemWidth;
    x.set(-totalWidth);
  }, [allStatisticians.length, fullItemWidth]);

  useAnimationFrame((_, delta) => {
    if (!isPaused && !isDragging.current) {
      const moveBy = (delta / 1000) * 60; // 60px per second - smooth video-like motion
      let currentX = x.get() - moveBy;
      
      const totalWidth = allStatisticians.length * fullItemWidth;
      
      if (currentX <= -totalWidth * 2) {
        currentX += totalWidth;
      }
      x.set(currentX);
    }
  });

  return (
    <div className="w-full bg-transparent py-8 overflow-hidden mb-4 border-none">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center mb-10">
          <h3 
            id="great-minds-heading"
            className="text-[14px] font-bold uppercase tracking-[0.4em] text-indigo-900 bg-[#bbc6f5] py-2.5 rounded-full px-12 shadow-[0_10px_30px_rgba(99,102,241,0.2)] border-2 border-[#020510] text-center hover:scale-105 hover:shadow-[0_10px_40px_rgba(99,102,241,0.3)] transition-all duration-500"
          >
            Great Minds of Statistics
          </h3>
        </div>
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex gap-10 whitespace-nowrap cursor-grab active:cursor-grabbing"
            style={{ x }}
            drag="x"
            onDragStart={() => {
              isDragging.current = true;
              setIsPaused(true);
            }}
            onDragEnd={() => {
              isDragging.current = false;
              setIsPaused(false);
              const currentX = x.get();
              const totalWidth = allStatisticians.length * fullItemWidth;
              
              if (currentX <= -totalWidth * 2) {
                x.set(currentX + totalWidth);
              } else if (currentX > -totalWidth) {
                x.set(currentX - totalWidth);
              }
            }}
          >
            {displayStatisticians.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[150px] group">
                <div className="w-24 h-24 rounded-full border-[3px] border-indigo-300 p-1 overflow-hidden mb-4 transition-all duration-500 group-hover:scale-110 group-hover:border-indigo-600 group-hover:shadow-2xl group-hover:shadow-indigo-500/40 bg-white ring-4 ring-indigo-50/50 group-hover:ring-indigo-100">
                  <img 
                    src={s.image} 
                    alt={s.name} 
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                  <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider mb-0.5">
                    {s.name}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter max-w-[140px] whitespace-normal leading-tight">
                    {s.title}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
          {/* Fade Edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-transparent via-transparent to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-transparent via-transparent to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default StatisticianCarousel;
