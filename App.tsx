import React, { useState, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import Navigation, { KonaMark } from './components/Navigation';
import Hero from './components/Sections/Hero';
import Clients from './components/Sections/Clients';
import Portfolio from './components/Sections/Portfolio';
import Services from './components/Sections/Services';
import Process from './components/Sections/Process';
import Team from './components/Sections/Team';
import GlobalPresence from './components/Sections/GlobalPresence';
import Contact from './components/Sections/Contact';
import ScrollToTop from './components/UI/ScrollToTop';
import SocialLinks from './components/UI/SocialLinks';
import { startSmoothScroll } from './lib/smoothScroll';

const App: React.FC = () => {
  // index.html sets the initial class before paint; read it back so state matches.
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => startSmoothScroll(), []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    root.classList.toggle('light', !isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((dark) => {
      const next = !dark;
      try {
        localStorage.setItem('kona-theme', next ? 'dark' : 'light');
      } catch {
        // Storage may be unavailable (private mode); the toggle still works for this visit.
      }
      return next;
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] btn btn-primary"
      >
        Skip to content
      </a>

      <Navigation toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <ScrollToTop />

      <main id="main">
        <Hero />
        <Clients />
        <Portfolio />
        <Services />
        <Process />
        <Team />
        <GlobalPresence isDarkMode={isDarkMode} />
        <Contact />
      </main>

      <footer className="border-t border-[var(--line)]">
        <div className="wrap py-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <KonaMark size={24} />
            <div>
              <div className="font-bold">Kona Tech Limited</div>
              <div className="t-small">© {new Date().getFullYear()}, Lagos, Nigeria</div>
            </div>
          </div>
          <SocialLinks />
        </div>
      </footer>
    </MotionConfig>
  );
};

export default App;
