import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full max-w-lg aspect-[4/5] md:aspect-square mx-auto overflow-hidden rounded-[2.5rem] shadow-2xl bg-black/20 backdrop-blur-md border border-white/10 group">
      {/* Progress Bars (Instagram Style) */}
      <div className="absolute top-4 left-0 w-full flex justify-center gap-1.5 px-4 z-30">
        {images.map((_, idx) => (
          <div
            key={idx}
            className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden relative"
          >
            {/* Background for completed/future bars */}
            <div className={`absolute inset-0 transition-colors duration-300 ${idx < currentIndex ? 'bg-white' : ''}`} />
            
            {/* Active bar progress */}
            {idx === currentIndex && (
              <motion.div
                layoutId="progress"
                className="h-full bg-white relative z-10"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main Image Container */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex].url}
            alt="Memory"
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Instagram-style Tap Zones */}
      <div className="absolute inset-0 z-20 flex">
        <div 
          className="flex-1 cursor-pointer" 
          onClick={() => setCurrentIndex(prev => (prev - 1 + images.length) % images.length)}
        />
        <div 
          className="flex-1 cursor-pointer" 
          onClick={() => setCurrentIndex(prev => (prev + 1) % images.length)}
        />
      </div>

      {/* Counter Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-[10px] uppercase tracking-widest font-black text-white/70">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageSlider;
