import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll, useSpring } from 'framer-motion';

const SwipeCard = ({ image, index, onSwipe, total }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) onSwipe(200);
    else if (info.offset.x < -100) onSwipe(-200);
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate }}
      initial={{ scale: 0.9, opacity: 0, rotate: index === 0 ? [0, -5, 5, 0] : 0 }}
      animate={{ 
        scale: 1 - index * 0.05, 
        y: index * -15, 
        opacity: 1, 
        zIndex: total - index,
        rotate: 0 
      }}
      exit={{ x: x.get() > 0 ? 1000 : -1000, opacity: 0, scale: 0.5, transition: { duration: 0.4 } }}
      whileDrag={{ scale: 1.05 }}
      className="absolute w-full max-w-[320px] aspect-[3/4] bg-white p-4 shadow-2xl rounded-[2.5rem] border border-white/20 cursor-grab active:cursor-grabbing"
    >
      {/* Visual Hint for first card */}
      {index === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0], x: [0, 40, -40, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center"
        >
          <span className="text-3xl">👈👆👉</span>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-2">Swipe Me</p>
        </motion.div>
      )}

      <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-100 relative">

        <img src={image.url} alt="Memory" className="w-full h-full object-cover pointer-events-none" />
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-6 left-6 border-4 border-emerald-500 text-emerald-500 font-black px-4 py-1 rounded-xl rotate-[-15deg] uppercase text-2xl pointer-events-none">Love</motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-6 right-6 border-4 border-rose-500 text-rose-500 font-black px-4 py-1 rounded-xl rotate-[15deg] uppercase text-2xl pointer-events-none">Next</motion.div>
      </div>
      <div className="pt-5 text-center">
         <p className="font-handwriting text-slate-400 text-xl italic font-bold">Memory #{total - index}</p>
      </div>
    </motion.div>
  );
};

const ParallaxStrip = ({ images }) => {
  const containerRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: containerRef });
  const springScroll = useSpring(scrollXProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="w-full relative py-10">
      <div className="flex justify-center mb-6">
         <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40 uppercase tracking-[0.4em] font-black">Scroll Sideways ↔</span>
      </div>
      
      <div 
        ref={containerRef}
        className="flex overflow-x-auto gap-8 px-[10%] py-10 scrollbar-hide no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            className="flex-shrink-0 w-[280px] md:w-[400px] aspect-[4/5] bg-white p-4 shadow-2xl rounded-[2rem] border border-white/10"
            style={{ scrollSnapAlign: 'center' }}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative group">
               <img src={img.url} alt="Memory" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                  <p className="text-white font-handwriting text-2xl">Memory #{idx + 1}</p>
               </div>
            </div>
          </motion.div>
        ))}
        {/* Spacer for better end-scroll */}
        <div className="flex-shrink-0 w-[10%]" />
      </div>

      {/* Parallax Progress Bar */}
      <div className="max-w-xs mx-auto mt-10 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-pink-500 to-indigo-500"
          style={{ scaleX: scrollXProgress, transformOrigin: 'left' }}
        />
      </div>
    </div>
  );
};

const MemoryGallery = ({ images = [] }) => {
  const [viewMode, setViewMode] = useState('swipe'); // 'swipe' or 'parallax'
  const [stack, setStack] = useState([...images].reverse());

  if (!images || images.length === 0) return null;

  const handleSwipe = () => {
    setStack((prev) => prev.slice(0, -1));
  };

  const switchToParallax = () => {
    setViewMode('parallax');
  };

  return (
    <div className="relative w-full min-h-[600px] flex items-center justify-center py-20 overflow-hidden">
      <AnimatePresence mode="wait">
        {viewMode === 'swipe' ? (
          <motion.div 
            key="swipe-container"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }}
            className="relative w-full flex items-center justify-center"
          >
            {stack.length > 0 ? (
              stack.map((img, idx) => (
                <SwipeCard key={img.url} image={img} index={stack.length - 1 - idx} total={images.length} onSwipe={handleSwipe} />
              ))
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                <div className="text-7xl">✨</div>
                <h3 className="text-3xl font-black text-white/40 tracking-tighter">All memories viewed!</h3>
                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={switchToParallax}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500/20 to-indigo-500/20 hover:from-pink-500/30 hover:to-indigo-500/30 rounded-2xl text-white font-black transition-all border border-white/10 shadow-xl backdrop-blur-md"
                >
                  Relive the Magic ↺
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="parallax-container"
            initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="text-center mb-10">
               <h3 className="text-4xl font-black text-white tracking-tighter mb-2">Memory Lane</h3>
               <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">A beautiful journey through time</p>
            </div>
            <ParallaxStrip images={images} />
            <div className="flex justify-center mt-12">
               <button onClick={() => { setStack([...images].reverse()); setViewMode('swipe'); }} className="text-white/30 hover:text-white/60 text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-1">← Switch Back to Swipe</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
        .font-handwriting { font-family: 'Caveat', cursive; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MemoryGallery;
