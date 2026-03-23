import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ShareWish = () => {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/wish/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="max-w-md w-full glass p-8 md:p-10 rounded-[2.5rem] text-center border border-white/10 shadow-2xl relative z-10"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-[0_0_30px_rgba(52,211,153,0.3)]"
        >
          ✨
        </motion.div>

        <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
          Surprise Ready! 🥳
        </h2>
        <p className="text-slate-400 mb-10 leading-relaxed">
          The magic is locked and loaded. Share this unique link with the birthday star!
        </p>

        <div className="group relative bg-white/5 p-5 rounded-2xl mb-8 border border-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden" onClick={handleCopy}>
          <div className="text-sm md:text-base text-indigo-200 font-mono break-all line-clamp-2">
            {shareUrl}
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold group-hover:text-pink-400 transition-colors">
            {copied ? 'Copied!' : 'Click to copy URL'}
          </div>
          
          {/* Subtle glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </div>

        <div className="flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl ${
              copied 
              ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
              : 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-pink-500/20'
            }`}
          >
            {copied ? 'Link Copied! ✓' : 'Copy Magic Link 📋'}
          </motion.button>
          
          <Link
            to={`/wish/${slug}`}
            className="w-full py-5 rounded-2xl font-bold bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-all backdrop-blur-sm"
          >
            Preview Surprise 👀
          </Link>
          
          <Link
            to="/"
            className="w-full py-4 text-slate-500 font-bold hover:text-white transition-colors mt-2 text-sm uppercase tracking-widest"
          >
            + Create Another One
          </Link>
        </div>
      </motion.div>

      {/* Footer Text */}
      <p className="mt-12 text-slate-600 text-xs font-medium uppercase tracking-[0.2em]">
        Made with magic by BdayBash
      </p>
    </div>
  );
};

export default ShareWish;
