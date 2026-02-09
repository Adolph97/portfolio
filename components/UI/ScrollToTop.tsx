
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollToTopProps {
  isDarkMode: boolean;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ isDarkMode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          data-cursor="GO_TOP"
          className="fixed bottom-10 right-10 z-[120] w-16 h-16 liquid-morph rounded-[24px] flex items-center justify-center text-[var(--text-primary)] group hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[var(--glass-border)]"
        >
          <svg className="w-6 h-6 group-hover:-translate-y-1.5 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
