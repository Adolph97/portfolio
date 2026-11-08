import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView as useMotionInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import DotGrid from '../UI/DotGrid';
import { useInView } from '../UI/useInView';
import HeroVisual from '../Hero/HeroVisual';
import Typewriter from '../Hero/Typewriter';
import { useShapeCycle } from '../Hero/useShapeCycle';
import { EASE } from '../../lib/brand';

const lines = ['We build the', 'software growing', 'businesses run on'];

const stats = [
  { value: 30, suffix: '+', label: 'clients served' },
  { value: 6, label: 'countries reached' },
  { value: 4, label: 'products live', note: '+2 in the pipeline' },
  { value: 4, label: 'partner companies' },
];

/** Counts up the first time it comes into view. */
const CountUp: React.FC<{ to: number; delay: number; suffix?: string }> = ({ to, delay, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useMotionInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const [n, setN] = useState(reduceMotion ? to : 0);
  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, to, { duration: 1.2, delay, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to, delay, reduceMotion]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
};

/** True while the tab is visible, so the field and the words pause together. */
const usePageVisible = () => {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible');
  useEffect(() => {
    const on = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);
  return visible;
};

const Hero: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scatter = useRef(0);

  const onScreen = useInView(section, '0px');
  const pageVisible = usePageVisible();
  const active = onScreen && pageVisible;
  const scene = useShapeCycle(active, !reduceMotion);

  // Scrolling away: the stage recedes, the copy lifts, the field disperses
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scatter.current = Math.min(1, Math.max(0, (v - 0.1) / 0.6));
  });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 };
  };

  const rise = (delay: number) =>
    reduceMotion ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: EASE } };

  return (
    <section id="top" ref={section} className="hero">
      <div className="wrap">
        <motion.div
          className="hero-stage stage"
          style={{ scale: stageScale }}
          onPointerMove={onPointerMove}
          onPointerLeave={() => (pointer.current = { x: 0, y: 0 })}
          initial={reduceMotion ? false : { clipPath: 'inset(6% 3% 6% 3% round 28px)', opacity: 0 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)', opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <motion.div
            className="hero-grid-bg"
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.15 }}
          >
            <DotGrid pitch={32} radius={1.2} />
          </motion.div>
          <div className="hero-glow" aria-hidden="true" />

          <HeroVisual shape={scene.shape} active={active} pointer={pointer} scatter={scatter} />

          <motion.div className="hero-main" style={{ y: copyY }}>
            <h1 className="hero-title">
              <span className="sr-only">
                We build the software growing businesses run on: AI and automation, internal tools, web and mobile
                products, and chatbots.
              </span>
              <span aria-hidden="true">
                {lines.map((line, i) => (
                  <span key={line} className="hero-line">
                    <motion.span
                      className="block"
                      initial={reduceMotion ? false : { y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.09, ease: EASE }}
                    >
                      {i < lines.length - 1 ? (
                        line
                      ) : (
                        <>
                          {line.slice(0, line.lastIndexOf(' ') + 1)}
                          {/* Keep the last word and the ochre full stop together */}
                          <span className="whitespace-nowrap">
                            {line.slice(line.lastIndexOf(' ') + 1)}
                            <motion.span
                              className="hero-dot"
                              initial={reduceMotion ? false : { scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 420, damping: 14, delay: 0.75 }}
                            />
                          </span>
                        </>
                      )}
                    </motion.span>
                  </span>
                ))}
              </span>
            </h1>

            <motion.p className="hero-type" aria-hidden="true" {...rise(0.55)}>
              <svg className="hero-type-arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 19L18 6M10 6h8v8" />
              </svg>
              <Typewriter text={scene.phrase} animate={!reduceMotion} />
            </motion.p>

            <motion.div className="hero-ctas" {...rise(0.7)}>
              <a href="#work" className="btn btn-on-indigo">See our work</a>
              <a href="https://calendly.com/obinna-ihekona/zoom" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                Book a discovery call
              </a>
            </motion.div>
          </motion.div>

          <motion.figure className="hero-founder" {...rise(1)}>
            <img src="/images/hero-image.jpg" alt="Obinna Ihekona, founder of Kona Tech" className="hero-founder-img" />
            <figcaption>
              <span className="hero-founder-name">Obinna Ihekona</span>
              <span className="hero-founder-role">Founder, lead systems architect</span>
              <a href="#community" className="hero-founder-chip">
                <img src="/Logos/10xdev-logo.png" alt="" />
                Founder of 10xdev
              </a>
            </figcaption>
          </motion.figure>

          <motion.dl className="hero-stats" {...rise(0.85)}>
            {stats.map((s, i) => (
              <div key={s.label} className="hero-stat">
                <dt className="sr-only">
                  {s.label}
                  {s.note ? `, ${s.note}` : ''}
                </dt>
                <dd className="m-0">
                  <span className="hero-stat-value">
                    <CountUp to={s.value} suffix={s.suffix} delay={0.95 + i * 0.1} />
                  </span>
                  <span className="hero-stat-label" aria-hidden="true">
                    {s.label}
                    {s.note && <span className="hero-stat-note">{s.note}</span>}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
