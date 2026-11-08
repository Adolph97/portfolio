import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { RevealHeading, RevealText } from '../UI/Reveal';
import DotGrid from '../UI/DotGrid';
import { BRAND } from '../../lib/brand';
import { scrollTo } from '../../lib/smoothScroll';

const steps = [
  { title: 'Discover', desc: 'We learn how your business runs today and where time or money is leaking.' },
  { title: 'Design', desc: 'We map the screens, data and integrations, and agree on scope before any code.' },
  { title: 'Build', desc: 'We work in short cycles, so you see working software early and often.' },
  { title: 'Launch', desc: 'We deploy, move your existing data across and walk your team through it.' },
  { title: 'Improve', desc: 'We watch how it’s used in the real world and keep refining after launch.' },
];

// ------------------------------------------------------------------
// The scene: nine tiles that rearrange into a new formation per step.
// ------------------------------------------------------------------
const THREAD = BRAND.thread;
const OCHRE = BRAND.ochreOnDark;
const ease = [0.16, 1, 0.3, 1] as const;

type Tile = { x: number; y: number; w: number; h: number; rotate: number; fillOpacity: number; strokeOpacity: number; dash: string; accent?: boolean };

const T = 72;
const G = 88;
const O = 116; // grid origin inside the 480 × 480 viewBox
const grid = (i: number) => ({ x: O + (i % 3) * G, y: O + Math.floor(i / 3) * G });

const scatter = [
  [-40, -34, -14], [12, -48, 9], [50, -22, 18],
  [-56, 8, 11], [0, 0, 0], [44, 16, -12],
  [-32, 48, 7], [8, 42, -19], [56, 52, 13],
];

// Bar chart for "Improve": columns of 2, 3 and 4 tiles
const bars = [0, 0, 1, 1, 1, 2, 2, 2, 2];
const barIndex = [0, 1, 0, 1, 2, 0, 1, 2, 3];

const tileFor = (step: number, i: number): Tile => {
  const g = grid(i);
  switch (step) {
    case 0: {
      const [dx, dy, r] = scatter[i];
      return { x: g.x + dx, y: g.y + dy, w: T, h: T, rotate: r, fillOpacity: i === 4 ? 0.18 : 0, strokeOpacity: i === 4 ? 1 : 0.45, dash: '0', accent: i === 4 };
    }
    case 1:
      return { ...g, w: T, h: T, rotate: 0, fillOpacity: 0, strokeOpacity: 0.85, dash: '7 6' };
    case 2:
      return { ...g, w: T, h: T, rotate: 0, fillOpacity: 0.14, strokeOpacity: 1, dash: '0' };
    case 3: {
      const s = 64, gap = 4;
      return { x: 140 + (i % 3) * (s + gap), y: 84 + Math.floor(i / 3) * (s + gap), w: s, h: s, rotate: 0, fillOpacity: 0.92, strokeOpacity: 0, dash: '0' };
    }
    default: {
      const s = 60, gap = 6, base = 396;
      const col = bars[i], k = barIndex[i];
      const top = (col === 0 && k === 1) || (col === 1 && k === 2) || (col === 2 && k === 3);
      return { x: 122 + col * 88, y: base - (k + 1) * s - k * gap, w: s, h: s, rotate: 0, fillOpacity: top ? 0.9 : 0.22, strokeOpacity: 0.9, dash: '0', accent: top };
    }
  }
};

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (d = 0) => ({ pathLength: 1, opacity: 1, transition: { pathLength: { duration: 0.9, delay: d, ease }, opacity: { duration: 0.2, delay: d } } }),
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const fade = { hidden: { opacity: 0 }, shown: { opacity: 1 }, exit: { opacity: 0 } };

const Overlay: React.FC<{ step: number }> = ({ step }) => {
  const common = { initial: 'hidden', animate: 'shown', exit: 'exit' } as const;

  if (step === 0) {
    // A lens sweeps the scattered tiles and settles on the one that's leaking
    return (
      <motion.g {...common} variants={fade}>
        <motion.circle
          cx={240} cy={240} r={52} fill="none" stroke={OCHRE} strokeWidth={1.5}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.5], opacity: [0.9, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 1.6, ease: 'easeOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <motion.g
          initial={{ x: -120, y: -110 }}
          animate={{ x: [-120, 90, -60, 0], y: [-110, -60, 80, 0] }}
          transition={{ duration: 2.2, times: [0, 0.35, 0.7, 1], ease: 'easeInOut' }}
        >
          <circle cx={240} cy={240} r={58} fill="rgba(226,236,248,0.06)" stroke={THREAD} strokeWidth={3} />
          <path d="M281 281 L318 318" stroke={THREAD} strokeWidth={9} strokeLinecap="round" />
        </motion.g>
      </motion.g>
    );
  }

  if (step === 1) {
    // Layout guides and registration marks draw themselves around the grid
    const lines = ['M116 60 V420', 'M364 60 V420', 'M60 116 H420', 'M60 364 H420'];
    const marks = [[116, 116], [364, 116], [116, 364], [364, 364]];
    return (
      <motion.g {...common}>
        {lines.map((d, i) => (
          <motion.path key={d} d={d} stroke={THREAD} strokeOpacity={0.35} strokeWidth={1} strokeDasharray="2 5" fill="none" variants={draw} custom={0.1 + i * 0.08} />
        ))}
        {marks.map(([x, y], i) => (
          <motion.path key={i} d={`M${x - 9} ${y} H${x + 9} M${x} ${y - 9} V${y + 9}`} stroke={OCHRE} strokeWidth={2} fill="none" variants={draw} custom={0.45 + i * 0.08} />
        ))}
        <motion.path d="M116 88 H364" stroke={THREAD} strokeOpacity={0.6} strokeWidth={1} fill="none" variants={draw} custom={0.7} />
        <motion.path d="M116 82 V94 M364 82 V94" stroke={THREAD} strokeOpacity={0.6} strokeWidth={1} fill="none" variants={draw} custom={0.8} />
      </motion.g>
    );
  }

  if (step === 2) {
    // Lines of code type themselves into each tile, one after another
    return (
      <motion.g {...common}>
        {Array.from({ length: 9 }).map((_, i) => {
          const g = grid(i);
          const widths = [[34, 22, 40], [26, 42, 18], [40, 30, 24]][i % 3];
          return widths.map((w, k) => (
            <motion.path
              key={`${i}-${k}`}
              d={`M${g.x + 14 + (k === 1 ? 8 : 0)} ${g.y + 22 + k * 14} h${w}`}
              stroke={k === 0 && i % 4 === 0 ? OCHRE : THREAD}
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
              variants={draw}
              custom={0.35 + i * 0.07 + k * 0.05}
            />
          ));
        })}
      </motion.g>
    );
  }

  if (step === 3) {
    // The finished block lifts off, trailing exhaust lines, into orbit
    return (
      <motion.g {...common} variants={fade}>
        {[170, 208, 240, 272, 310].map((x, i) => (
          <motion.path
            key={x}
            d={`M${x} ${300 + (i % 2) * 14} V${420 - (i % 3) * 18}`}
            stroke={i === 2 ? OCHRE : THREAD}
            strokeOpacity={i === 2 ? 0.95 : 0.4}
            strokeWidth={i === 2 ? 4 : 2}
            strokeLinecap="round"
            strokeDasharray="10 14"
            animate={{ strokeDashoffset: [0, -48] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        <motion.ellipse
          cx={240} cy={186} rx={190} ry={52} fill="none" stroke={THREAD} strokeOpacity={0.35} strokeWidth={1.2}
          transform="rotate(-12 240 186)"
          variants={draw} custom={0.4}
        />
        <motion.g
          initial={{ x: 50, y: 226 }}
          animate={{ x: [50, 240, 430, 240, 50], y: [226, 238, 146, 134, 226] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <circle r={7} fill={OCHRE} />
        </motion.g>
      </motion.g>
    );
  }

  // Improve: a rising trend line and a feedback loop
  return (
    <motion.g {...common}>
      <motion.path d="M100 396 H400" stroke={THREAD} strokeOpacity={0.5} strokeWidth={1.5} fill="none" variants={draw} custom={0.2} />
      <motion.path d="M152 250 L240 184 L336 112" stroke={OCHRE} strokeWidth={3} strokeLinecap="round" fill="none" variants={draw} custom={0.55} />
      <motion.path d="M317.8 114.4 L336 112 L328.6 128.8" stroke={OCHRE} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" variants={draw} custom={1.2} />
      <motion.g style={{ transformBox: 'fill-box', transformOrigin: 'center' }} animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
        <motion.path d="M388 84 a26 26 0 1 1 -18 -24" stroke={THREAD} strokeWidth={2.5} strokeLinecap="round" fill="none" variants={draw} custom={0.8} />
        <motion.path d="M366 52 L372 62 L360 66" stroke={THREAD} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" variants={draw} custom={1.1} />
      </motion.g>
    </motion.g>
  );
};

const ProcessScene: React.FC<{ step: number }> = ({ step }) => (
  <svg viewBox="0 0 480 480" className="w-full h-full" role="img" aria-label={`${steps[step].title}: ${steps[step].desc}`}>
    {Array.from({ length: 9 }).map((_, i) => {
      const t = tileFor(step, i);
      return (
        <motion.rect
          key={i}
          rx={10}
          initial={false}
          animate={{
            x: t.x, y: t.y, width: t.w, height: t.h, rotate: t.rotate,
            fillOpacity: t.fillOpacity, strokeOpacity: t.strokeOpacity,
            fill: t.accent ? OCHRE : THREAD, stroke: t.accent ? OCHRE : THREAD,
          }}
          strokeWidth={2}
          strokeDasharray={t.dash}
          transition={{ type: 'spring', stiffness: 90, damping: 16, mass: 0.9, delay: i * 0.035 }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      );
    })}
    <AnimatePresence mode="wait">
      <Overlay step={step} key={step} />
    </AnimatePresence>
  </svg>
);

// ------------------------------------------------------------------
// Shared bits
// ------------------------------------------------------------------
const useIsDesktop = () => {
  const query = '(min-width: 960px)';
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return match;
};

const ScenePanel: React.FC<{ active: number }> = ({ active }) => (
  <div className="process-panel stage">
    <DotGrid className="absolute inset-0 opacity-[0.35]" pitch={24} radius={1.1} />
    <div className="relative h-full p-[6%]">
      <ProcessScene step={active} />
    </div>
    <div className="process-meter" aria-hidden="true">
      {steps.map((s, i) => (
        <span key={s.title}>
          <motion.i initial={false} animate={{ scaleX: i <= active ? 1 : 0 }} transition={{ duration: 0.6, ease }} />
        </span>
      ))}
    </div>
  </div>
);

/** A title whose letters fall away and rise back in as the word changes. */
const MorphTitle: React.FC<{ text: string }> = ({ text }) => (
  <span className="morph-title" aria-hidden="true">
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span key={text} className="morph-word">
        {text.split('').map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: '0.9em', opacity: 0, filter: 'blur(8px)', rotateX: -70 }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)', rotateX: 0, transition: { duration: 0.7, delay: 0.18 + i * 0.035, ease } }}
            exit={{ y: '-0.7em', opacity: 0, filter: 'blur(8px)', rotateX: 70, transition: { duration: 0.35, delay: i * 0.02, ease: 'easeIn' } }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  </span>
);

// ------------------------------------------------------------------
// Desktop: the section pins; scroll progress morphs one step into the next
// ------------------------------------------------------------------
const PinnedProcess: React.FC = () => {
  const pin = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useMotionValueEvent(scrollYProgress, 'change', (v: number) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length))));
  });

  const jumpTo = (i: number) => {
    const el = pin.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    scrollTo(top + (travel * (i + 0.5)) / steps.length);
  };

  return (
    <div ref={pin} className="process-pin" style={{ height: `${steps.length * 70 + 100}vh` }}>
      <div className="process-sticky">
        <div className="process-sticky-copy">
          <ol className="process-rail" aria-label="Project stages">
            {steps.map((s, i) => (
              <li key={s.title}>
                <button type="button" onClick={() => jumpTo(i)} data-active={i === active} aria-current={i === active ? 'step' : undefined}>
                  {i === active && <motion.span layoutId="process-rail-dot" className="process-rail-dot" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                  {s.title}
                </button>
              </li>
            ))}
          </ol>

          <div className="process-now" aria-live="polite">
            <div className="process-kicker">
              <span>Step</span>
              <span className="process-kicker-num">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={active}
                    className="inline-block"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.45, ease }}
                  >
                    {active + 1}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span>of {steps.length}</span>
            </div>

            <h3 className="process-now-title">
              <span className="sr-only">{steps[active].title}</span>
              <MorphTitle text={steps[active].title} />
            </h3>

            <div className="process-now-desc">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={active}
                  className="t-lead"
                  initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, delay: 0.3, ease } }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.3 } }}
                >
                  {steps[active].desc}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="process-track" aria-hidden="true">
            <motion.i style={{ scaleX: progress }} />
          </div>
        </div>

        <ScenePanel active={active} />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Mobile: a pinned scene with steps scrolling beneath it
// ------------------------------------------------------------------
const StackedProcess: React.FC = () => {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.index))),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="process-layout">
      <div className="process-stage">
        <ScenePanel active={active} />
      </div>
      <ol className="process-steps">
        {steps.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              items.current[i] = el;
            }}
            data-index={i}
            data-active={i === active}
            className="process-step"
          >
            <motion.div initial={false} animate={{ opacity: i === active ? 1 : 0.35 }} transition={{ duration: 0.5 }}>
              <span className="process-step-kicker">Step {i + 1} of {steps.length}</span>
              <h3 className="process-step-title">{s.title}</h3>
              <p className="t-body mt-3">{s.desc}</p>
            </motion.div>
          </li>
        ))}
      </ol>
    </div>
  );
};

const Process: React.FC = () => {
  const isDesktop = useIsDesktop();
  return (
    <section id="process" aria-labelledby="process-title" className="section">
      <div className="wrap">
        <div className="section-head">
          <RevealHeading id="process-title" className="t-h2">How a project runs</RevealHeading>
          <RevealText className="t-body">
            The same five stages whether it's a two-week automation or a six-month platform. The steps stay
            the same. How long each one takes depends on the project.
          </RevealText>
        </div>
        {isDesktop ? <PinnedProcess /> : <StackedProcess />}
      </div>
    </section>
  );
};

export default Process;
