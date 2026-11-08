import React, { useEffect, useState } from 'react';
import { KonaLogo } from './Brand/KonaLogo';

interface NavigationProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const navItems = [
  { label: 'About', href: '#values' },
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Team', href: '#team' },
  { label: 'Process', href: '#process' },
];

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

const Navigation: React.FC<NavigationProps> = ({ toggleTheme, isDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Tuck the bar away while reading down; bring it back on any scroll up
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 320);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const themeLabel = isDarkMode ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <header className="nav" data-scrolled={scrolled || isMenuOpen} data-hidden={hidden && !isMenuOpen} onFocusCapture={() => setHidden(false)}>
      <div className="wrap nav-inner">
        <a href="#top" className="flex items-center no-underline" onClick={() => setIsMenuOpen(false)}>
          <KonaLogo size={30} animate />
        </a>

        <nav aria-label="Main" className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button type="button" onClick={toggleTheme} className="icon-btn" aria-label={themeLabel} title={themeLabel}>
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href="#contact" className="btn btn-primary hidden md:inline-flex !min-h-[42px] !px-5 text-[0.9375rem]">
            Start a project
          </a>
          <button
            type="button"
            className="icon-btn md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {isMenuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="md:hidden wrap pb-6">
          <ul className="flex flex-col border-t border-[var(--line)]">
            {[...navItems, { label: 'Contact', href: '#contact' }].map((item) => (
              <li key={item.href} className="border-b border-[var(--line)]">
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-4 text-[1.375rem] font-bold no-underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navigation;
