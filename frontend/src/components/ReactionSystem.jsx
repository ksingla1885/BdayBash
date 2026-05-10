import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

const ReactionSystem = ({ slug, theme }) => {
  const emojis = ['❤️', '🔥', '😂', '🥳', '🥺', '🎉'];
  const [activeReactions, setActiveReactions] = useState([]);

  useEffect(() => {
    socket.emit('join-wish', slug);

    socket.on('new-reaction', (emoji) => {
      const id = Date.now() + Math.random();
      setActiveReactions((prev) => [...prev, { id, emoji, x: Math.random() * 80 + 10 }]);
      
      setTimeout(() => {
        setActiveReactions((prev) => prev.filter((r) => r.id !== id));
      }, 3000);
    });

    return () => {
      socket.off('new-reaction');
    };
  }, [slug]);

  const sendReaction = (emoji) => {
    socket.emit('send-reaction', { slug, emoji });
  };

  return (
    <>
      {/* Floating Reactions Display */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        <AnimatePresence>
          {activeReactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ y: '100vh', opacity: 0, scale: 0.5 }}
              animate={{ y: '-10vh', opacity: [0, 1, 1, 0], scale: [0.5, 1.5, 1, 0.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: 'linear' }}
              className="absolute text-4xl"
              style={{ left: `${r.x}%` }}
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reaction Buttons Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3 p-3 bg-white/10 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl"
      >
        {emojis.map((emoji) => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.2, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => sendReaction(emoji)}
            className="text-2xl hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all"
          >
            {emoji}
          </motion.button>
        ))}
      </motion.div>
    </>
  );
};

export default ReactionSystem;
