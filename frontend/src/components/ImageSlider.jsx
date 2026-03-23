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
    <div className="relative w-full max-w-lg aspect-square mx-auto overflow-hidden rounded-xl shadow-2xl bg-black/10 backdrop-blur-sm border border-white/20">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex].url}
          alt="Memory"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute top-4 left-0 w-full flex justify-center gap-2 px-4 z-10">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full bg-white/50 overflow-hidden transition-all duration-300 ${
              idx === currentIndex ? 'bg-white' : ''
            }`}
          >
            {idx === currentIndex && (
              <motion.div
                layoutId="progress"
                className="h-full bg-primary-500 w-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
