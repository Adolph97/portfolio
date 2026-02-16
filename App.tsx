
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Hero from './components/Sections/Hero';
import Services from './components/Sections/Services';
import Portfolio from './components/Sections/Portfolio';
import Process from './components/Sections/Process';
import TechStack from './components/Sections/TechStack';
import Testimonials from './components/Sections/Testimonials';
import GlobalPresence from './components/Sections/GlobalPresence';
import Contact from './components/Sections/Contact';
import SystemStatus from './components/UI/SystemStatus';
import ScrollToTop from './components/UI/ScrollToTop';
import SocialLinks from './components/UI/SocialLinks';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Initial loading simulation
    const timer = setTimeout(() => setLoading(false), 2200);
    // Sync with local storage or system preference if needed
    document.documentElement.className = isDarkMode ? 'dark' : 'light';
    return () => clearTimeout(timer);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="relative w-full min-h-screen selection:bg-[var(--accent-color)] selection:text-[var(--bg-color)] bg-dots">
      <CustomCursor />
      <SystemStatus />
      <ScrollToTop isDarkMode={isDarkMode} />
      
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center font-mono"
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "240px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-[1px] bg-white mb-6"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[10px] uppercase tracking-[0.6em] text-white/40"
            >
              Establishing Secure Uplink...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      <main className="relative z-10 w-full">
        <Hero />
        <Services />
        <Portfolio />
        <Process />
        <TechStack />
        <Testimonials />
        <GlobalPresence isDarkMode={isDarkMode} />
        <Contact />
      </main>

      <footer className="relative z-10 py-12 md:py-16 px-5 md:px-24 border-t border-[var(--glass-border)] bg-[var(--bg-color)] bg-opacity-80 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-widest text-[var(--text-color)] transition-colors duration-500">
        <div className="flex flex-col gap-3">
          <div className="font-bold tracking-[0.2em]">Kona Tech Limited</div>
          <div className="opacity-40">Architecting Global Intelligence.</div>
        </div>
        <div className="text-center opacity-40">Built in Lagos, NG. Distributed Worldwide.</div>
        <div className="flex items-center gap-8">
          <SocialLinks className="hidden md:flex" />
        </div>
      </footer>
    </div>
  );
};

export default App;
