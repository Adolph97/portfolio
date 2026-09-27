import React, { Suspense, lazy, useCallback, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import AdirePattern from '../UI/AdirePattern';
import type { PointerState } from '../UI/AdireCloth';

// three.js is heavy; the static SVG pattern shows until the cloth is ready.
const AdireCloth = lazy(() => import('../UI/AdireCloth'));

const ease = [0.16, 1, 0.3, 1] as const;

const words = 'We build the software growing businesses run on.'.split(' ');

const Hero: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: 0 });
  const [clothReady, setClothReady] = useState(false);
  const handleReady = useCallback(() => setClothReady(true), []);

  // Scrolling away pushes the scene back: copy drifts up, the panel recedes, the portrait parallaxes
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);
  const panelScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Portrait tilts toward the pointer
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-1, 1], [-8, 8]), spring);
  const rotateX = useSpring(useTransform(py, [-1, 1], [6, -6]), spring);
  const shiftX = useSpring(useTransform(px, [-1, 1], [-10, 10]), spring);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    pointer.current = { x, y, active: 1 };
    if (e.pointerType === 'mouse') {
      px.set(x);
      py.set(y);
    }
  };

  const onPointerLeave = () => {
    pointer.current = { ...pointer.current, active: 0 };
    px.set(0);
    py.set(0);
  };

  return (
    <section id="top" ref={section} className="hero">
      <div className="wrap hero-grid">
        <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <h1 className="hero-title" aria-label={words.join(' ')}>
            {words.map((word, i) => (
              <span key={i} className="word-mask" aria-hidden="true">
                <motion.span
                  className="inline-block"
                  initial={{ y: '115%', rotate: 4 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1.1, delay: 0.45 + i * 0.06, ease }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <div className="hero-foot">
            <motion.p
              className="t-lead"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.05, ease }}
            >
              Kona Tech is a studio in Lagos. We design and build web apps, automations and AI tools for teams
              in Nigeria, the UK, the US and further afield.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.15, ease }}
            >
              <a href="#work" className="btn btn-primary">See our work</a>
              <a
                href="https://calendly.com/obinna-ihekona/zoom"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Book a discovery call
              </a>
            </motion.div>

            <motion.a
              href="#clients"
              className="scroll-cue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
            >
              <span className="scroll-cue-line" aria-hidden="true" />
              Scroll to explore
            </motion.a>
          </div>
        </motion.div>

        <motion.figure className="hero-figure" style={{ scale: panelScale }}>
          <motion.div
            className="hero-panel adire [perspective:900px]"
            initial={{ clipPath: 'inset(50% 0% 50% 0% round 28px)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
            transition={{ duration: 1.4, delay: 0.1, ease }}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <AdirePattern className="absolute inset-0" />
            {!reduceMotion && (
              <div
                className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: clothReady ? 1 : 0 }}
                aria-hidden="true"
              >
                <Suspense fallback={null}>
                  <AdireCloth pointer={pointer} onReady={handleReady} />
                </Suspense>
              </div>
            )}
            <motion.div className="hero-portrait" style={{ y: portraitY }}>
              <motion.img
                src="/images/hero-image.jpg"
                alt="Obinna Ihekona, founder of Kona Tech"
                className="w-full h-full object-cover rounded-[18px] shadow-[0_30px_70px_-20px_rgba(4,14,30,0.85)] will-change-transform"
                style={{ rotateX, rotateY, x: shiftX }}
                initial={{ opacity: 0, scale: 1.18, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.6, delay: 0.7, ease }}
              />
            </motion.div>
          </motion.div>
          <motion.figcaption
            className="mt-4 flex items-baseline justify-between gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <span className="font-bold">Obinna Ihekona</span>
            <span className="t-small">Founder, lead systems architect</span>
          </motion.figcaption>
        </motion.figure>
      </div>
    </section>
  );
};

export default Hero;
