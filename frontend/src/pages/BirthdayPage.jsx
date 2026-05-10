import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from '../components/Confetti';
import TypingText from '../components/TypingText';
import MemoryGallery from '../components/MemoryGallery';
import GiftBox from '../components/GiftBox';
import ReactionSystem from '../components/ReactionSystem';



const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

const themes = {
  emotional: {
    bg: '#0a0510',
    orbs: ['rgba(236, 72, 153, 0.15)', 'rgba(139, 92, 246, 0.15)'],
    accent: 'from-pink-400 via-purple-400 to-indigo-400',
    textAccent: 'text-pink-400',
    glass: 'rgba(255, 255, 255, 0.03)',
    confettiType: 'emotional',
    emoji: '🌸'
  },
  funny: {
    bg: '#05100a',
    orbs: ['rgba(34, 197, 94, 0.15)', 'rgba(234, 179, 8, 0.15)'],
    accent: 'from-green-400 via-yellow-400 to-emerald-400',
    textAccent: 'text-yellow-400',
    glass: 'rgba(255, 255, 255, 0.05)',
    confettiType: 'funny',
    emoji: '😂'
  },
  savage: {
    bg: '#100505',
    orbs: ['rgba(239, 68, 68, 0.2)', 'rgba(0, 0, 0, 0.4)'],
    accent: 'from-red-600 via-orange-600 to-yellow-600',
    textAccent: 'text-red-500',
    glass: 'rgba(255, 0, 0, 0.05)',
    confettiType: 'savage',
    emoji: '🔥'
  }
};

const BirthdayPage = () => {
  const { slug } = useParams();
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  const currentTheme = wish ? (themes[wish.tone] || themes.emotional) : themes.emotional;

  useEffect(() => {
    const fetchWish = async () => {
      try {
        const { data } = await api.get(`wish/${slug}`);
        setWish(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchWish();
  }, [slug]);

  const handleOpen = () => {
    setOpened(true);
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

  if (error || !wish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14] text-white text-xl font-bold flex-col gap-4 p-6 text-center">
        <span className="text-6xl">😿</span>
        <h2 className="text-2xl font-bold text-pink-400">Oops! Something went wrong</h2>
        <p className="text-slate-400 max-w-md">{error || 'Wish not found.'}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-pink-500 rounded-full text-sm font-bold">Try Again</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-hidden relative font-sans transition-colors duration-1000" style={{ backgroundColor: currentTheme.bg }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ x: [0, 100, -50], y: [0, -50, 50], scale: [1, 1.2, 0.9] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] blur-[130px] rounded-full"
          style={{ backgroundColor: currentTheme.orbs[0] }}
        />
        <motion.div 
          animate={{ x: [0, -100, 50], y: [0, 50, -50], scale: [1, 0.9, 1.1] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] blur-[130px] rounded-full"
          style={{ backgroundColor: currentTheme.orbs[1] }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      {wish.musicUrl && <audio ref={audioRef} src={wish.musicUrl} loop preload="auto" />}

      {opened && wish.musicUrl && (
        <motion.button
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          onClick={toggleMute}
          className="fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-2xl w-14 h-14 flex items-center justify-center text-2xl shadow-2xl"
        >
          {muted ? '🔇' : '🔊'}
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(30px)' }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50 p-6 text-center"
          >
            <GiftBox onOpen={handleOpen} theme={currentTheme} />
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-3xl md:text-5xl font-black mt-12 mb-4 tracking-tight"
            >
              Surprise incoming for <br/>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.accent}`}>{wish.receiverName}</span>
            </motion.h1>
            <p className="text-slate-400 text-sm md:text-base">Make sure your volume is up 🔊</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}
            className="min-h-screen pt-24 pb-24 px-6 relative flex flex-col items-center"
          >
            <ReactionSystem slug={slug} theme={currentTheme} />
            <Confetti type={currentTheme.confettiType} />

            <div className="max-w-5xl w-full mx-auto relative z-10 space-y-24">
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-center space-y-4">
                <div className="text-6xl mb-2">{currentTheme.emoji}</div>
                <h1 className="text-5xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-white">Happy Birthday, {wish.receiverName}!</h1>
                <p className={`text-xl md:text-2xl ${currentTheme.textAccent} font-bold uppercase tracking-[0.3em]`}>Sent with love by {wish.senderName}</p>
              </motion.div>

              {wish.images?.length > 0 && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 }} className="relative group">
                  <MemoryGallery images={wish.images} />
                </motion.div>
              )}


              <motion.div 
                className="max-w-3xl mx-auto glass-dark p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
                style={{ backgroundColor: currentTheme.glass }}
                initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: wish.images?.length ? 1.8 : 1 }}
              >
                <span className="absolute top-8 left-8 text-8xl text-white/5 font-serif">"</span>
                <TypingText text={wish.message} delay={wish.images?.length ? 2.5 : 1.5} speed={0.035} className="text-2xl md:text-3xl leading-[1.6] text-slate-100 text-center italic relative z-10" />
                <span className="absolute bottom-8 right-8 text-8xl text-white/5 font-serif translate-y-12">"</span>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5 }} className="text-center">
                <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm">Enjoy your day to the fullest! 🎂</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .glass-dark {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default BirthdayPage;
