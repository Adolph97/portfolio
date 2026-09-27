import React, { useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion';
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

/** Floating product card that trails the cursor over the list (mouse devices only). */
const CursorPreview: React.FC<{ project: Project | null; x: MotionValue<number>; y: MotionValue<number> }> = ({ project, x, y }) => {
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.5 });
  const rotate = useSpring(useTransform(useVelocity(x), [-1500, 1500], [-10, 10], { clamp: true }), { stiffness: 150, damping: 20 });

  return (
    <motion.div
      aria-hidden="true"
      className="cursor-preview"
      style={{ x: sx, y: sy, rotate }}
    >
      <AnimatePresence>
        {project?.image && (
          <motion.div
            key={project.title}
            className="work-preview"
            initial={{ opacity: 0, scale: 0.6, clipPath: 'inset(50% 50% 50% 50% round 24px)' }}
            animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.45, ease }}
          >
            <img src={project.image} alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Portfolio: React.FC = () => {
  const [hovered, setHovered] = useState<Project | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

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

        <ul
          className="list-none m-0 p-0"
          onPointerMove={(e) => {
            x.set(e.clientX + 28);
            y.set(e.clientY - 90);
          }}
          onPointerLeave={() => setHovered(null)}
        >
          {projects.map((p, i) => (
            <motion.li
              key={p.title}
              className="work-row"
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(p)}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            >
              <motion.span
                aria-hidden="true"
                className="work-rule"
                variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                transition={{ duration: 1.1, delay: i * 0.05, ease }}
              />
              <motion.div
                className="work-thumb"
                variants={{ hidden: { opacity: 0, scale: 0.85 }, shown: { opacity: 1, scale: 1 } }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.05, ease }}
              >
                {p.image ? <img src={p.image} alt="" loading="lazy" /> : null}
              </motion.div>

              <motion.div
                className="work-title"
                variants={{ hidden: { opacity: 0, y: 18 }, shown: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.05, ease }}
              >
                <h3 className="t-h3 !text-[1.5rem] md:!text-[1.75rem]">{p.title}</h3>
                <p className="t-small mt-1">{p.summary}</p>
              </motion.div>

              <motion.div
                className="col-start-2 min-[900px]:col-start-auto"
                variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.05 }}
              >
                <p className="t-body">{p.desc}</p>
                <p className="t-small mt-2">{p.category}</p>
              </motion.div>

              <motion.div
                className="col-start-2 min-[900px]:col-start-auto flex flex-row min-[900px]:flex-col items-center min-[900px]:items-end gap-4 min-[900px]:gap-3 flex-wrap"
                variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
              >
                <span className="status" data-state={p.status}>
                  {p.status === 'live' ? 'Live' : 'In development'}
                </span>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="link font-semibold">
                    {p.status === 'live' ? 'Visit site' : 'Preview'}
                    <span className="sr-only"> for {p.title} (opens in a new tab)</span>
                  </a>
                )}
              </motion.div>
            </motion.li>
          ))}
        </ul>
      </div>
      <CursorPreview project={hovered} x={x} y={y} />
    </section>
  );
};

export default Portfolio;
