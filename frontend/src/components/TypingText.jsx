import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypingText = ({ text, delay = 0, speed = 0.05, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout;
    if (text) {
      timeout = setTimeout(() => {
        setIsTyping(true);
      }, delay * 1000);
    }
    return () => clearTimeout(timeout);
  }, [text, delay]);

  useEffect(() => {
    if (!isTyping) return;

    let i = 0;
    setDisplayedText(''); // Reset when started

    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed * 1000);

    return () => clearInterval(timer);
  }, [isTyping, text, speed]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-[3px] h-[1em] bg-current ml-1 align-middle"
      />
    </motion.div>
  );
};

export default TypingText;
