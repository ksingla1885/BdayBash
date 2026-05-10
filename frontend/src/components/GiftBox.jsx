import { motion } from 'framer-motion';
import { useState } from 'react';

const GiftBox = ({ onOpen, theme }) => {
  const [clicks, setClicks] = useState(0);
  const maxClicks = 3;

  const handleClick = () => {
    if (clicks < maxClicks - 1) {
      setClicks(clicks + 1);
    } else {
      onOpen();
    }
  };

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    rotate: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.5 }
  };

  return (
    <div className="relative flex flex-col items-center justify-center cursor-pointer select-none" onClick={handleClick}>
      <motion.div
        animate={clicks > 0 ? shakeAnimation : { y: [0, -20, 0] }}
        transition={clicks > 0 ? {} : { repeat: Infinity, duration: 3 }}
        className="relative w-64 h-64 md:w-80 md:h-80"
      >
        {/* Gift Box Body */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.accent} rounded-2xl shadow-2xl overflow-hidden`}>
          {/* Ribbons */}
          <div className="absolute top-0 bottom-0 left-1/2 w-8 bg-white/30 -translate-x-1/2"></div>
          <div className="absolute left-0 right-0 top-1/2 h-8 bg-white/30 -translate-y-1/2"></div>
        </div>

        {/* Gift Box Lid */}
        <motion.div 
          className={`absolute -top-4 -left-4 -right-4 h-16 bg-gradient-to-r ${theme.accent} rounded-xl shadow-xl z-10 brightness-110`}
          animate={{ y: clicks * -5 }}
        >
          {/* Lid Ribbon */}
          <div className="absolute top-0 bottom-0 left-1/2 w-10 bg-white/40 -translate-x-1/2"></div>
          
          {/* Bow */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1">
             <div className="w-12 h-12 bg-white/40 rounded-full border-4 border-white/20"></div>
             <div className="w-12 h-12 bg-white/40 rounded-full border-4 border-white/20"></div>
          </div>
        </motion.div>

        {/* Floating Sparks */}
        {clicks > 0 && Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: -100, x: (i - 2) * 50 }}
            className="absolute top-0 left-1/2 text-2xl"
          >
            ✨
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-12 text-white/60 font-bold uppercase tracking-[0.3em] text-sm"
      >
        Tap {maxClicks - clicks} times to unbox {theme.emoji}
      </motion.div>

      {/* Progress Bar */}
      <div className="mt-4 w-32 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full bg-gradient-to-r ${theme.accent}`}
          animate={{ width: `${(clicks / maxClicks) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default GiftBox;
