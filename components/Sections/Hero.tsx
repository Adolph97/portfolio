
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HumaanSVG = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    animate={{ 
      y: [0, -40, 0], 
      rotate: [0, 8, -4, 0],
      opacity: [0.1, 0.25, 0.1]
    }}
    transition={{ 
      duration: 12, 
      repeat: Infinity, 
      ease: "easeInOut", 
      delay 
    }}
    className={`absolute pointer-events-none select-none z-0 text-[var(--text-primary)] ${className}`}
  >
    <svg width="200" height="200" viewBox="0 0 240 240" fill="none">
      <circle cx="120" cy="70" r="35" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" />
      <path d="M90 150C90 125.147 110.147 105 135 105H105C129.853 105 150 125.147 150 150V220H90V150Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="120" cy="70" r="12" fill="currentColor" fillOpacity="0.1" />
    </svg>
  </motion.div>
);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const sentence = "Engineering intelligence for a global tomorrow.";
  const fragments = sentence.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  };

  const wordVariants = {
    visible: {
      opacity: 1,
      y: 0,
      // Fix: Cast 'spring' to 'const' to satisfy framer-motion's strict AnimationGeneratorType
      transition: { type: "spring" as const, damping: 25, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 60,
    },
  };

  return (
    <section 
      ref={containerRef} 
      id="hero" 
      className="relative min-h-screen md:min-h-[800px] flex items-center justify-center overflow-hidden px-5 md:px-24 pt-24 md:pt-20 pb-16 md:pb-0"
    >
      {/* Humaan Background Animations */}
      <HumaanSVG className="top-[15%] right-[20%]" delay={0} />
      <HumaanSVG className="bottom-[10%] left-[10%]" delay={4} />
      <HumaanSVG className="top-[30%] left-[5%]" delay={7} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 w-full max-w-7xl items-center relative z-20">
        {/* Title and Description Column */}
        <motion.div 
          style={{ y: yText, opacity }} 
          className="lg:col-span-8 flex flex-col justify-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap"
          >
            {fragments.map((word, index) => (
              <motion.span
                variants={wordVariants}
                key={index}
                className="hero-title font-black text-[var(--text-primary)] mr-2.5 md:mr-6 mb-1 md:mb-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-24 md:w-32 h-1 bg-[var(--accent-color)] my-8 md:my-12 origin-left"
          />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="text-base md:text-xl text-[var(--text-secondary)] max-w-lg leading-relaxed font-medium tracking-tight"
          >
            An elite Nigerian tech consultancy architecting autonomous systems, enterprise infrastructure, and scaling global digital economies.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="mt-10 md:mt-14 flex flex-wrap gap-3 md:gap-6"
          >
            <a 
              href="#work"
              data-cursor="PORTFOLIO"
              className="px-6 md:px-10 py-4 md:py-5 bg-[var(--accent-color)] text-[var(--bg-color)] font-mono text-[10px] uppercase tracking-[0.25em] md:tracking-[0.5em] font-black rounded-2xl hover:scale-105 transition-all shadow-2xl"
            >
              PROJECTS
            </a>
            <a 
              href="#contact"
              data-cursor="INIT_UPLINK"
              className="px-6 md:px-10 py-4 md:py-5 border border-[var(--glass-border)] text-[var(--text-primary)] font-mono text-[10px] uppercase tracking-[0.25em] md:tracking-[0.5em] font-black rounded-2xl hover:bg-[var(--glass-bg)] transition-all backdrop-blur-sm"
            >
              CONTACT_INIT
            </a>
          </motion.div>

          {/* Mobile Founder Portal */}
          <motion.div
            style={{ y: yImage }}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="mt-12 lg:hidden flex flex-col items-center"
          >
            <div className="relative w-full max-w-[320px] aspect-[4/5]">
              <div className="founder-portal w-full h-full bg-[var(--glass-bg)] border border-[var(--glass-border)] p-1.5 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.65)]">
                <img
                  src="/images/hero-image.jpg"
                  alt="Lead Architect - Obinna Ihekona"
                  className="w-full h-full object-cover grayscale-[20%] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)]/70 via-transparent to-transparent pointer-events-none" />
              </div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 border border-dashed border-[var(--glass-border)] rounded-full opacity-30 -z-10"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-12 border border-dashed border-[var(--glass-border)] rounded-full opacity-15 -z-10"
              />
            </div>

            <div className="mt-8 text-center">
              <h4 className="text-xs font-mono uppercase tracking-[0.45em] font-black text-[var(--text-primary)]">Obinna Ihekona</h4>
              <p className="text-[9px] font-mono uppercase opacity-50 mt-2 tracking-[0.3em]">Lead Systems Architect</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Founder Morphing Portal Column */}
        <motion.div 
          style={{ y: yImage }}
          className="lg:col-span-4 hidden lg:flex flex-col items-center justify-center relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 1.5, duration: 2, ease: "easeOut" }}
            className="relative w-full aspect-[4/5] max-w-[360px]"
          >
            <div className="founder-portal w-full h-full bg-[var(--glass-bg)] border border-[var(--glass-border)] p-1.5 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.6)]">
              <img
                src="/images/hero-image.jpg"
                alt="Lead Architect - Obinna Ihekona"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>

            {/* Orbiting Elements */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-10 border border-dashed border-[var(--glass-border)] rounded-full opacity-30 -z-10"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-20 border border-dashed border-[var(--glass-border)] rounded-full opacity-10 -z-10"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 2.2 }}
            className="mt-12 text-center"
          >
            <h4 className="text-sm font-mono uppercase tracking-[0.6em] font-black text-[var(--text-primary)]">Obinna Ihekona</h4>
            <p className="text-[10px] font-mono uppercase opacity-50 mt-2 tracking-[0.4em]">Lead Systems Architect</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Hero Footnote */}
      <div className="absolute bottom-12 left-8 md:left-24 hidden md:flex items-center gap-4 text-[9px] font-mono text-[var(--text-secondary)] tracking-[0.4em] opacity-30">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        ESTABLISHING_STABLE_HANDSHAKE_v2.5
      </div>
    </section>
  );
};

export default Hero;
