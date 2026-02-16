import React from 'react';
import { motion } from 'framer-motion';

const SocialLinks: React.FC<{ className?: string }> = ({ className = "" }) => {
  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/adolph97',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/obinna-ihekona-230742110/',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    },
    {
      name: 'X',
      href: 'https://x.com/jakelyf',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      )
    },
    {
      name: 'Medium',
      href: 'https://medium.com/@obinna.ihekona',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75c.66 0 1.19 2.58 1.19 5.75z" />
        </svg>
      )
    }
  ];

  return (
    <div className={`flex gap-4 ${className}`}>
      {socialLinks.map((social) => (
        <motion.a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-primary)] bg-[var(--glass-bg)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] transition-all duration-300"
          aria-label={social.name}
        >
          {social.icon}
        </motion.a>
      ))}
    </div>
  );
};

export default SocialLinks;
