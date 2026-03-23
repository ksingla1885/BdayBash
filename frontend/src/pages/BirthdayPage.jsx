import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from '../components/Confetti';
import TypingText from '../components/TypingText';
import ImageSlider from '../components/ImageSlider';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

const BirthdayPage = () => {
  const { slug } = useParams();
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchWish = async () => {
      try {
        const { data } = await api.get(`/wish/${slug}`);
        setWish(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWish();
  }, [slug]);

  const handleOpen = () => {
    setOpened(true);
    // User interaction enables audio play
    if (audioRef.current && wish?.musicUrl) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch((e) => console.warn('Audio play failed:', e));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14]">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-16 h-16 rounded-full border-4 border-t-pink-500 border-indigo-500/20 shadow-[0_0_20px_rgba(236,72,153,0.3)] animate-spin"
        />
      </div>
    );
  }

  if (!wish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14] text-white text-xl font-bold flex-col gap-4">
        <span className="text-6xl">😿</span>
        Oops! Wish not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white overflow-hidden relative font-sans selection:bg-pink-500/30">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ 
            x: [0, 100, -50], 
            y: [0, -50, 50],
            scale: [1, 1.2, 0.9]
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-pink-600/10 blur-[130px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 50], 
            y: [0, 50, -50],
            scale: [1, 0.9, 1.1]
          }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-violet-600/10 blur-[130px] rounded-full"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      {/* Audio Element */}
      {wish.musicUrl && (
        <audio ref={audioRef} src={wish.musicUrl} loop preload="auto" />
      )}

      {/* Persistence Controls */}
      {opened && wish.musicUrl && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={toggleMute}
          className="fixed top-6 right-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white rounded-2xl w-14 h-14 flex items-center justify-center text-2xl shadow-2xl transition-all"
        >
          {muted ? '🔇' : '🔊'}
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50, filter: 'blur(20px)' }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50 p-6 text-center"
          >
            <motion.div
              animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-9xl mb-12 drop-shadow-[0_0_25px_rgba(236,72,153,0.5)] cursor-pointer"
              onClick={handleOpen}
            >
              🎁
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight max-w-2xl leading-tight"
            >
              Surprise incoming for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                {wish.receiverName}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-slate-400 text-lg md:text-xl font-medium mb-12 tracking-wide"
            >
              Make sure your volume is up 🔊
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="px-12 py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 rounded-[2rem] font-black text-2xl shadow-[0_20px_60px_-15px_rgba(236,72,153,0.5)] hover:shadow-[0_30px_80px_-15px_rgba(236,72,153,0.6)] transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">OPEN MAGIC ✨</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="min-h-screen pt-24 pb-24 px-6 relative flex flex-col items-center"
          >
            <Confetti />
            
            <div className="max-w-5xl w-full mx-auto relative z-10 space-y-24">
              
              {/* Header */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-center space-y-4"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="text-6xl inline-block mb-2"
                >
                  🎉
                </motion.div>
                <h1 className="text-5xl md:text-8xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white via-pink-200 to-purple-400 tracking-tighter leading-tight p-2">
                  Happy Birthday, {wish.receiverName}!
                </h1>
                <p className="text-xl md:text-2xl text-pink-400 font-bold tracking-[0.3em] uppercase">
                  Sent with love by {wish.senderName}
                </p>
              </motion.div>

              {/* Media Section */}
              {wish.images && wish.images.length > 0 && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 1 }}
                  className="relative group lg:px-20"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 to-indigo-500/20 rounded-[3rem] blur-2xl group-hover:opacity-40 transition-opacity opacity-0"></div>
                  <ImageSlider images={wish.images} />
                </motion.div>
              )}

              {/* Message Section */}
              <motion.div 
                className="max-w-3xl mx-auto glass-dark p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: wish.images?.length ? 1.8 : 1 }}
              >
                {/* Decorative Quote */}
                <span className="absolute top-8 left-8 text-8xl text-white/5 font-serif pointer-events-none">"</span>
                
                <TypingText
                  text={wish.message}
                  delay={wish.images?.length ? 2.5 : 1.5}
                  speed={0.035}
                  className="text-2xl md:text-3xl leading-[1.6] text-slate-100 font-medium text-center italic relative z-10"
                />

                <span className="absolute bottom-8 right-8 text-8xl text-white/5 font-serif pointer-events-none translate-y-12">"</span>
              </motion.div>

              {/* Final Toast */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5 }}
                className="text-center"
              >
                <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm md:text-base">
                  Enjoy your day to the fullest! 🎂
                </p>
              </motion.div>
            </div>
            
            {/* Scroll Indicator (Custom) */}
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-20 opacity-30 select-none pb-10"
            >
               ✨✨✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .glass-dark {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default BirthdayPage;
