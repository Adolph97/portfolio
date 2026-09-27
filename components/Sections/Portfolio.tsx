import React, { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { RevealHeading, RevealText } from '../UI/Reveal';

type Project = {
  title: string;
  summary: string;
  desc: string;
  category: string;
  image?: string;
  status: 'live' | 'soon';
  url?: string;
};

const projects: Project[] = [
  {
    title: 'Customer Pro',
    summary: 'Customer feedback analysis',
    desc: 'Collects customer feedback and turns it into sentiment trends and heatmaps, so teams see what’s working and what isn’t.',
    category: 'AI and analytics',
    image: '/Logos/customerpro.jpeg',
    status: 'live',
    url: 'https://customerpro-one.vercel.app',
  },
  {
    title: 'Clock-It',
    summary: 'Attendance and payroll',
    desc: 'Tracks staff attendance and keeps payroll in sync automatically, replacing spreadsheets and manual sign-in sheets.',
    category: 'Business software',
    image: '/Logos/clock-it.png',
    status: 'live',
    url: 'https://clock-it.org',
  },
  {
    title: 'Loveet',
    summary: 'Compatibility quiz',
    desc: 'A question flow that adapts as people answer and produces a compatibility score at the end.',
    category: 'Consumer app',
    image: '/Logos/heart.png',
    status: 'live',
    url: 'https://bit.ly/lovequiz26',
  },
  {
    title: 'Top Minds',
    summary: 'Interview preparation',
    desc: 'Practice interviews for tech roles with instant feedback and coaching tailored to each candidate.',
    category: 'Education',
    image: '/Logos/robot.png',
    status: 'soon',
    url: 'https://topmind.vercel.app',
  },
  {
    title: 'Nexoaura',
    summary: 'WhatsApp support assistant',
    desc: 'Answers customer questions on WhatsApp around the clock and hands off to a person when it should.',
    category: 'Chatbot',
    image: '/Logos/Nexoaura.png',
    status: 'soon',
  },
  {
    title: 'Signal Pro',
    summary: 'Trading signal bot',
    desc: 'Generates market signals for retail traders and delivers them straight to their phones.',
    category: 'Fintech automation',
    image: '/Logos/signalpro.jpeg',
    status: 'soon',
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

type Filter = 'all' | 'live' | 'soon';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'soon', label: 'In development' },
];

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 11L11 5M6 5h5v5" />
  </svg>
);

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [hovered, setHovered] = useState<string | null>(null);
  const visible = projects.filter((p) => filter === 'all' || p.status === filter);

  return (
    <section id="work" aria-labelledby="work-title" className="section">
      <div className="wrap">
        <div className="section-head">
          <RevealHeading id="work-title" className="t-h2">Selected work</RevealHeading>
          <RevealText className="t-body">
            Products we've designed, built and shipped, plus a few still in development. Most started as a
            conversation about one process that was eating someone's week.
          </RevealText>
        </div>

        <LayoutGroup>
          <div className="work-filters" role="tablist" aria-label="Filter projects">
            {filters.map((f) => {
              const count = projects.filter((p) => f.id === 'all' || p.status === f.id).length;
              const selected = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className="work-filter"
                  data-selected={selected}
                  onClick={() => setFilter(f.id)}
                >
                  {selected && <motion.span layoutId="work-filter-pill" className="work-filter-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <span className="relative">{f.label}</span>
                  <span className="relative work-filter-count">{count}</span>
                </button>
              );
            })}
          </div>

          <motion.ul layout className="list-none m-0 p-0" onPointerLeave={() => setHovered(null)}>
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((p, i) => (
                <motion.li
                  key={p.title}
                  layout
                  className="work-row"
                  data-hovered={hovered === p.title}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(p.title)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.6, ease, layout: { type: 'spring', stiffness: 260, damping: 30 } }}
                >
                  {/* One soft highlight glides between rows instead of popping in on each */}
                  {hovered === p.title && (
                    <motion.span
                      layoutId="work-hover"
                      aria-hidden="true"
                      className="work-hover"
                      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                    />
                  )}
                  <motion.span
                    aria-hidden="true"
                    className="work-rule"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: i * 0.05, ease }}
                  />

                  <div className="work-thumb">
                    {p.image ? <img src={p.image} alt="" loading="lazy" /> : null}
                  </div>

                  <div className="work-title">
                    <h3 className="t-h3 !text-[1.5rem] md:!text-[1.75rem]">{p.title}</h3>
                    <p className="t-small mt-1">{p.summary}</p>
                  </div>

                  <div className="col-start-2 min-[900px]:col-start-auto relative">
                    <p className="t-body">{p.desc}</p>
                    <p className="t-small mt-2">{p.category}</p>
                  </div>

                  <div className="col-start-2 min-[900px]:col-start-auto relative flex flex-row min-[900px]:flex-col items-center min-[900px]:items-end gap-4 min-[900px]:gap-3 flex-wrap">
                    <span className="status" data-state={p.status}>
                      {p.status === 'live' ? 'Live' : 'In development'}
                    </span>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="work-link">
                        {p.status === 'live' ? 'Visit site' : 'Preview'}
                        <span className="work-link-icon">
                          <ArrowIcon />
                        </span>
                        <span className="sr-only"> for {p.title} (opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </div>
    </section>
  );
};

export default Portfolio;
