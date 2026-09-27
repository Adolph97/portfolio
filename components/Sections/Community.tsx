import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RevealHeading, RevealText } from '../UI/Reveal';
import CommunityScene from '../UI/CommunityScene';
import { lockScroll, unlockScroll } from '../../lib/smoothScroll';

const ease = [0.16, 1, 0.3, 1] as const;
const EMAIL = 'hello@konatechlimited.org';

const pillars = [
  { title: 'Learn in public', desc: 'Share what you’re figuring out, and learn from people a few steps ahead.' },
  { title: 'Honest code review', desc: 'Real feedback on real work, from developers who want you to get better.' },
  { title: 'Build together', desc: 'Team up on projects that go further than anyone would get alone.' },
  { title: 'Open doors', desc: 'Pass on opportunities, introductions and advice to the people coming up next.' },
];

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
          <h2 id="story-title" className="t-h2">10x Dev</h2>
          <p className="t-lead mt-3">
            A community for developers in Nigeria and across Africa, started by Kona Tech’s founder, Obinna Ihekona.
          </p>

          <p className="t-body mt-6">
            Nigeria has no shortage of talented developers. What’s harder to find is what turns talent into craft:
            people a few steps ahead who’ll review your code, share what they’ve learned and build alongside you.
          </p>
          <p className="t-body mt-4">
            10x Dev is our way of growing that on purpose. It’s a place to learn in public, get honest feedback and
            team up on real projects, so developers here can hold their own with the best teams anywhere.
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
            It’s early, and it’s one of the projects we’re putting real time into. If you’d like to join, help run it
            or support it, we’d love to hear from you.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={`mailto:${EMAIL}?subject=10x%20Dev`} className="btn btn-primary">
              Email us about 10x Dev
            </a>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
          <p className="t-small mt-4">Or write to {EMAIL} with “10x Dev” in the subject.</p>
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
          <RevealHeading id="community-title" className="t-h2">10x Dev</RevealHeading>
          <RevealText className="t-lead mt-5">
            One of the projects we’re building: a community for developers in Nigeria and across Africa to learn,
            review each other’s work and build together.
          </RevealText>
          <RevealText className="mt-8" delay={0.25}>
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

        <button type="button" className="community-art" onClick={() => setOpen(true)} aria-label="Read the 10x Dev story">
          <CommunityScene className="w-full h-auto" />
        </button>
      </div>

      {createPortal(<AnimatePresence>{open && <Story onClose={close} />}</AnimatePresence>, document.body)}
    </section>
  );
};

export default Community;
