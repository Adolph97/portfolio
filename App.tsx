import React, { useState, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import Navigation from './components/Navigation';
import { KonaLogo } from './components/Brand/KonaLogo';
import Hero from './components/Sections/Hero';
import Clients from './components/Sections/Clients';
import Portfolio from './components/Sections/Portfolio';
import Community from './components/Sections/Community';
import Values from './components/Sections/Values';
import Services from './components/Sections/Services';
import Process from './components/Sections/Process';
import Team from './components/Sections/Team';
import GlobalPresence from './components/Sections/GlobalPresence';
import Contact from './components/Sections/Contact';
import ScrollToTop from './components/UI/ScrollToTop';
import SocialLinks from './components/UI/SocialLinks';
import { startSmoothScroll } from './lib/smoothScroll';

const footerLinks = [
  { label: 'About', href: '#values' },
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Team', href: '#team' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

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
        <Community />
        <Values />
        <Services />
        <Process />
        <Team />
        <GlobalPresence isDarkMode={isDarkMode} />
        <Contact />
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="site-footer-grid">
            <div>
              <KonaLogo size={56} layout="stacked" />
              <p className="t-body mt-6 max-w-[30em]">
                We make good technology easier to reach, so businesses and people across Nigeria and Africa can solve
                real problems.
              </p>
              <p className="site-footer-values">
                <span>Integrity</span>
                <span>Innovation</span>
                <span>Initiative</span>
              </p>
            </div>

            <nav aria-label="Footer" className="site-footer-links">
              <ul>
                {footerLinks.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
              <ul>
                <li>
                  <a href="mailto:hello@konatechlimited.org">hello@konatechlimited.org</a>
                </li>
                <li>
                  <a href="https://calendly.com/obinna-ihekona/zoom" target="_blank" rel="noopener noreferrer">
                    Book a discovery call
                  </a>
                </li>
                <li>
                  <a href="https://10xdev.site" target="_blank" rel="noopener noreferrer">
                    10xdev
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="site-footer-base">
            <span className="t-small">© {new Date().getFullYear()} Kona Tech Limited, Lagos, Nigeria</span>
            <SocialLinks />
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
};

export default App;
