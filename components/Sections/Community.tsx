import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RevealHeading, RevealText } from '../UI/Reveal';
import CommunityScene from '../UI/CommunityScene';
import { lockScroll, unlockScroll } from '../../lib/smoothScroll';

const ease = [0.16, 1, 0.3, 1] as const;
const SITE = 'https://10xdev.site';
const TELEGRAM = 'https://t.me/+IUo9Sji61KswOGU8';

const facts = [
  { value: '20+', label: 'structured courses' },
  { value: '700+', label: 'interactive lessons' },
  { value: '3', label: 'free lessons in every course' },
];

const pillars = [
  { title: 'Learn by building', desc: 'Every course is hands-on. You build real systems, not toy examples.' },
  { title: 'Priced for here', desc: 'Courses cost about as much as a shawarma, so good training doesn’t break the bank.' },
  { title: 'Try before you pay', desc: 'The first three lessons of every course are free, and buying gets you lifetime access.' },
  { title: 'Learn together', desc: 'The Telegram community is where members swap code tips and get answers between lessons.' },
];

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <span className={`tenx-logo ${className ?? ''}`}>
    <img src="/Logos/10xdev-logo.png" alt="10xdev" width={280} height={145} />
  </span>
);

const Story: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lockScroll();
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [onClose]);

  return (
    <motion.div className="story-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-title"
        className="story-panel"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98, transition: { duration: 0.25 } }}
        transition={{ duration: 0.6, ease }}
      >
        <button ref={closeBtn} type="button" className="icon-btn story-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="story-art">
          <CommunityScene className="w-full h-auto" />
        </div>

        <div className="story-body">
          <Logo />
          <h2 id="story-title" className="sr-only">10xdev</h2>
          <p className="t-lead mt-5">
            A fullstack engineering school and community, built by Kona Tech for developers in Nigeria and across Africa.
          </p>

          <p className="t-body mt-6">
            Nigeria has no shortage of talented developers. What’s harder to find is affordable, structured training
            that goes past tutorials, and people to learn with. 10xdev is Obinna’s answer to both.
          </p>
          <p className="t-body mt-4">
            The courses run from Git basics to distributed architecture: web development, Python, databases, React,
            Next.js, NestJS and backend engineering, all taught by building real systems. It’s for complete beginners,
            people switching into tech from roles like product, design or QA, and developers who want to go deeper.
          </p>

          <ul className="story-pillars">
            {pillars.map((p, i) => (
              <motion.li
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 + i * 0.08, ease }}
              >
                <h3 className="font-bold">{p.title}</h3>
                <p className="t-small mt-1">{p.desc}</p>
              </motion.li>
            ))}
          </ul>

          <p className="t-body">
            It’s one of the projects we’re putting real time into, and the library keeps growing.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={SITE} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Visit 10xdev.site
            </a>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Join the Telegram
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Community: React.FC = () => {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  const close = React.useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  return (
    <section id="community" aria-labelledby="community-title" className="section">
      <div className="wrap community-grid">
        <div className="community-copy">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.9, ease }}
          >
            <Logo className="mb-6" />
          </motion.div>
          <RevealHeading id="community-title" className="t-h2">Learn to build like a 10x developer</RevealHeading>
          <RevealText className="t-lead mt-5">
            10xdev is our fullstack engineering school and community for developers in Nigeria and across Africa:
            structured courses from Git basics to distributed systems, priced like a lunch snack.
          </RevealText>

          <motion.dl
            className="tenx-facts"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          >
            {facts.map((f, i) => (
              <motion.div
                key={f.label}
                variants={{ hidden: { opacity: 0, y: 12 }, shown: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 + i * 0.1, ease } } }}
              >
                <dt className="sr-only">{f.label}</dt>
                <dd className="m-0">
                  <span className="tenx-fact-value">{f.value}</span>
                  <span className="t-small block mt-1">{f.label}</span>
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          <RevealText className="mt-8 flex flex-wrap gap-3" delay={0.25}>
            <button ref={trigger} type="button" className="btn btn-ghost story-trigger" onClick={() => setOpen(true)} aria-haspopup="dialog">
              Read the story
              <span className="story-trigger-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M7 2v10M2 7h10" />
                </svg>
              </span>
            </button>
          </RevealText>
        </div>

        <button type="button" className="community-art" onClick={() => setOpen(true)} aria-label="Read the 10xdev story">
          <CommunityScene className="w-full h-auto" />
        </button>
      </div>

      {createPortal(<AnimatePresence>{open && <Story onClose={close} />}</AnimatePresence>, document.body)}
    </section>
  );
};

export default Community;
