import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import RotatingGlobe, { type GlobeLocation } from '../UI/RotatingGlobe';

const GLOBAL_LOCATIONS: GlobeLocation[] = [
  { name: 'Nigeria', lat: 9.082, lon: 8.6753 },
  { name: 'United Kingdom', lat: 55.3781, lon: -3.436 },
  { name: 'United States', lat: 37.0902, lon: -95.7129 },
  { name: 'UAE', lat: 23.4241, lon: 53.8478 },
  { name: 'India', lat: 20.5937, lon: 78.9629 },
  { name: 'Perth', lat: -31.9535, lon: 115.8570 },
];

interface GlobalPresenceProps {
  isDarkMode: boolean;
}

const GlobalPresence: React.FC<GlobalPresenceProps> = ({ isDarkMode }) => {
  const [activeLocation, setActiveLocation] = useState(GLOBAL_LOCATIONS[0].name);

  return (
    <section id="global-presence" className="py-20 md:py-28 px-5 md:px-24">
      <div className="max-w-4xl mx-auto text-center mb-10 md:mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black tracking-tighter text-[var(--text-primary)]"
        >
          Global Presence
        </motion.h2>
        <p className="text-[var(--text-secondary)] mt-4 text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] md:tracking-[0.5em]">
          Live Regions • Rotating Intelligence Map
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`max-w-3xl mx-auto rounded-[34px] border border-[var(--glass-border)] p-4 md:p-6 shadow-[0_50px_120px_-45px_rgba(0,0,0,0.6)] ${
          isDarkMode ? 'bg-[#0f1117]/80' : 'bg-white/90'
        }`}
      >
        <div
          className={`relative rounded-[28px] border border-[var(--glass-border)] p-4 md:p-6 ${
            isDarkMode
              ? 'bg-gradient-to-b from-white/5 to-transparent'
              : 'bg-gradient-to-b from-black/[0.03] to-transparent'
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLocation}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`absolute right-4 top-4 md:right-6 md:top-6 z-30 rounded-full border px-3 py-1.5 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.22em] ${
                isDarkMode
                  ? 'border-white/30 bg-black/60 text-white'
                  : 'border-black/20 bg-white/95 text-black'
              }`}
            >
              Active: {activeLocation}
            </motion.div>
          </AnimatePresence>

          <motion.img
            src="/images/Imageholder-clean.png"
            alt="Image holder"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 -top-16 md:-top-20 w-44 md:w-56 object-contain ${
              isDarkMode
                ? 'invert brightness-[1.8] contrast-125 opacity-95 drop-shadow-[0_30px_45px_rgba(255,255,255,0.15)]'
                : 'opacity-95 drop-shadow-[0_24px_30px_rgba(0,0,0,0.2)]'
            }`}
          />

          <div
            className={`aspect-square w-full max-w-[580px] mx-auto rounded-[24px] overflow-hidden ${
              isDarkMode ? 'bg-black/45' : 'bg-white'
            }`}
          >
            <RotatingGlobe
              isDarkMode={isDarkMode}
              locations={GLOBAL_LOCATIONS}
              onActiveLocationChange={setActiveLocation}
            />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 md:gap-3">
            {GLOBAL_LOCATIONS.map((location) => (
              <div
                key={location.name}
                className={`px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-mono uppercase tracking-[0.18em] border ${
                  activeLocation === location.name
                    ? isDarkMode
                      ? 'border-white/40 bg-white/15 text-white'
                      : 'border-black/30 bg-black/10 text-black'
                    : isDarkMode
                      ? 'border-white/15 text-white/55'
                      : 'border-black/15 text-black/50'
                }`}
              >
                {location.name}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default GlobalPresence;
