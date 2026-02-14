
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ toggleTheme, isDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] px-4 py-4 md:p-8 flex justify-between items-center pointer-events-none">
      <div className="pointer-events-auto">
        <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="flex items-center gap-3 group">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-[var(--accent-color)] flex items-center justify-center overflow-hidden transition-all duration-500 rounded-lg group-hover:rounded-2xl shadow-xl">
            <motion.div 
              whileHover={{ rotate: 90, scale: 1.2 }}
              className="w-4 h-4 md:w-5 md:h-5 border-2 border-[var(--bg-color)] bg-[var(--accent-color)]" 
            />
          </div>
          <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-black text-[var(--text-primary)] transition-colors duration-500">Kona Tech</span>
        </a>
      </div>

      <div className="hidden md:flex items-center gap-8 lg:gap-10 pointer-events-auto liquid-morph px-8 lg:px-10 py-4 lg:py-5 rounded-full shadow-2xl transition-all duration-500 bg-[var(--nav-bg)]">
        {navItems.map((item) => (
          <a 
            key={item.label}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            className="text-[9px] lg:text-[10px] uppercase tracking-[0.4em] font-bold text-[var(--text-primary)] opacity-50 hover:opacity-100 transition-all duration-300"
          >
            {item.label}
          </a>
        ))}
        <div className="w-px h-4 lg:h-5 bg-[var(--glass-border)] mx-1 lg:mx-2" />
        <button 
          onClick={toggleTheme}
          data-cursor={isDarkMode ? "SWITCH_LIGHT" : "SWITCH_DARK"}
          className="relative w-10 h-5 rounded-full bg-[var(--glass-border)] flex items-center px-1 transition-all group overflow-hidden border border-[var(--glass-border)]"
        >
          <motion.div
            animate={{ x: isDarkMode ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-3.5 h-3.5 rounded-full bg-[var(--accent-color)] shadow-lg"
          />
        </button>
      </div>

      <div className="md:hidden pointer-events-auto flex items-center gap-4">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          className="h-9 w-9 flex items-center justify-center border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] bg-[var(--nav-bg)] backdrop-blur-md shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
        <button 
          onClick={toggleTheme} 
          className="text-[9px] font-mono font-bold border border-[var(--glass-border)] px-3 py-1.5 rounded-full text-[var(--text-primary)] bg-[var(--nav-bg)] backdrop-blur-md shadow-lg"
        >
          {isDarkMode ? "DARK" : "LIGHT"}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden pointer-events-auto absolute left-4 right-4 top-16 liquid-morph rounded-2xl p-4 border border-[var(--glass-border)] shadow-2xl bg-[var(--nav-bg)]">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-3 py-3 text-[10px] uppercase tracking-[0.35em] font-bold text-[var(--text-primary)] opacity-70 hover:opacity-100 transition-all rounded-xl hover:bg-[var(--glass-bg)]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
