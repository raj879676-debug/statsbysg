import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Video, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Announcement() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const targetDate = new Date('2026-05-03T09:00:00');
    const expiryDate = new Date('2026-05-03T10:00:00'); // 1 hour after start
    
    // Initial check
    if (Date.now() >= expiryDate.getTime()) {
      setIsExpired(true);
      return;
    }
    
    const timer = setInterval(() => {
      const now = Date.now();
      const difference = targetDate.getTime() - now;
      
      // Check if one hour past the session start has reached
      if (now >= expiryDate.getTime()) {
        setIsExpired(true);
        clearInterval(timer);
        return;
      }
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isLive = Date.now() >= new Date('2026-05-03T09:00:00').getTime();

  return (
    <AnimatePresence>
      {!isExpired && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="relative overflow-hidden border-b border-white/10"
        >
        {/* Animated Gradient Background */}
        <motion.div 
          animate={{ 
            background: [
              'rgba(30, 27, 75, 0.9)',
              'rgba(67, 56, 202, 0.9)',
              'rgba(30, 27, 75, 0.9)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0 backdrop-blur-sm"
        />

        {/* Mesh Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} 
        />

        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 relative z-10 text-white leading-none">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
            <div className="flex items-center gap-4">
              <motion.div 
                animate={{ 
                  scale: isLive ? [1, 1.1, 1] : [1, 1.15, 1],
                  rotate: isLive ? 0 : [-1, 1, -1]
                }} 
                transition={{ duration: isLive ? 1 : 2.5, repeat: Infinity }}
                className="flex-shrink-0"
              >
                <div className={`${isLive ? 'bg-green-500 border-green-400' : 'bg-[#ef4444] border-red-400'} text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl uppercase flex items-center gap-2 border`}>
                  <div className={`w-2 h-2 bg-white rounded-full ${isLive ? 'animate-ping' : 'animate-pulse shadow-[0_0_5px_white]'}`} />
                  {isLive ? 'Live Now' : 'Upcoming Session'}
                </div>
              </motion.div>
              
              <div className="flex flex-col">
                <p className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-300 fill-current" />
                  <span>Confused about ASO/ARO-2026 Department Order?</span>
                </p>
                <p className="text-[10px] sm:text-xs text-white/80 font-bold mt-1 tracking-wide">
                  {isLive ? 'SESSION IS LIVE NOW • CLICK BUTTON TO JOIN' : 'JOIN SG SIR LIVE GUIDANCE • SUNDAY, 9:00 AM IST'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center lg:justify-end gap-6 bg-white/10 sm:bg-transparent px-4 py-3 sm:p-0 rounded-2xl w-full lg:w-auto">
              {!isLive && (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-black">{timeLeft.days}</span>
                    <span className="text-[7px] font-bold uppercase opacity-60">Days</span>
                  </div>
                  <span className="opacity-30 font-bold">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[7px] font-bold uppercase opacity-60">Hrs</span>
                  </div>
                  <span className="opacity-30 font-bold">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[7px] font-bold uppercase opacity-60">Min</span>
                  </div>
                  <span className="opacity-30 font-bold">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-black text-yellow-300">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[7px] font-bold uppercase opacity-60">Sec</span>
                  </div>
                </div>
              )}
              
              <motion.a
                href="https://meet.google.com/hzv-egmc-wrd"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563eb] text-white text-xs font-black rounded-xl overflow-hidden shadow-[0_10px_20px_-5px_rgba(37,99,235,0.5)] transition-all"
              >
                  <Video size={16} />
                <span>JOIN ON GOOGLE MEET</span>
                
                {/* Internal Shine Effect */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '250%' }}
                  transition={{ duration: 1.35, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-y-0 w-12 bg-white/30 skew-x-[30deg] pointer-events-none"
                />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
