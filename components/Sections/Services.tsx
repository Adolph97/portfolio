import React from 'react';
import { motion } from 'framer-motion';
import { RevealHeading, RevealText } from '../UI/Reveal';

type Motif = 'rings' | 'dots' | 'stripes' | 'zigzag';

const EASE = [0.16, 1, 0.3, 1] as const;

const drawIn = (delay: number) => ({
  hidden: { pathLength: 0, opacity: 0 },
  shown: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 1, delay, ease: EASE }, opacity: { duration: 0.2, delay } } },
});

/** One adire motif per service, drawn in when it scrolls into view. */
const MotifGlyph: React.FC<{ motif: Motif }> = ({ motif }) => (
  <motion.svg
    viewBox="0 0 48 48"
    className="service-glyph"
    aria-hidden="true"
    initial="hidden"
    whileInView="shown"
    viewport={{ once: true, margin: '0px 0px -15% 0px' }}
  >
    <motion.rect x="1" y="1" width="46" height="46" rx="10" fill="none" stroke="currentColor" strokeOpacity={0.35} variants={drawIn(0)} />
    {motif === 'rings' &&
      [16, 10, 4].map((r, i) => <motion.circle key={r} cx="24" cy="24" r={r} fill="none" stroke="currentColor" strokeWidth={2} variants={drawIn(0.15 + i * 0.12)} />)}
    {motif === 'dots' &&
      [0, 1, 2, 3].flatMap((row) =>
        [0, 1, 2, 3].map((col) => (
          <motion.circle
            key={`${row}-${col}`}
            cx={12 + col * 8}
            cy={12 + row * 8}
            r={1.9}
            fill="currentColor"
            variants={{ hidden: { scale: 0 }, shown: { scale: 1, transition: { delay: 0.15 + (row + col) * 0.05 } } }}
          />
        ))
      )}
    {motif === 'stripes' &&
      [0, 1, 2, 3].map((i) => (
        <motion.path key={i} d={`M${10 + i * 8} 38 L${18 + i * 8} 10`} stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none" variants={drawIn(0.15 + i * 0.08)} />
      ))}
    {motif === 'zigzag' &&
      [16, 24, 32].map((y, i) => (
        <motion.path key={y} d={`M9 ${y} l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4`} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" variants={drawIn(0.15 + i * 0.1)} />
      ))}
  </motion.svg>
);

const services = [
  {
    motif: 'rings' as Motif,
    title: 'AI and automation',
    desc: 'Assistants, classifiers and data pipelines that take repetitive work off your team, built around how you already operate.',
  },
  {
    motif: 'dots' as Motif,
    title: 'Internal tools',
    desc: 'Dashboards, attendance, payroll and approval systems that connect to the software you already pay for.',
  },
  {
    motif: 'stripes' as Motif,
    title: 'Product engineering',
    desc: 'Web and mobile products, from a first clickable prototype to a platform that holds up under real traffic.',
  },
  {
    motif: 'zigzag' as Motif,
    title: 'Chatbots and messaging',
    desc: 'WhatsApp and Telegram bots for customer support, sales follow-ups and notifications.',
  },
];

const stack = ['Python', 'FastAPI', 'Node.js', 'React', 'Next.js', 'PostgreSQL', 'Redis', 'Vercel', 'WhatsApp and Telegram APIs'];

const Services: React.FC = () => (
  <section id="services" aria-labelledby="services-title" className="section">
    <div className="wrap">
      <div className="section-head">
        <RevealHeading id="services-title" className="t-h2">What we do</RevealHeading>
        <RevealText className="t-body">
          Four kinds of work, often mixed on one project. We start from the business problem and pick the
          technology after.
        </RevealText>
      </div>

      <div className="service-grid">
        {services.map((s) => (
          <div key={s.title} className="service">
            <MotifGlyph motif={s.motif} />
            <h3 className="t-h3 mt-6">{s.title}</h3>
            <p className="t-body mt-3">{s.desc}</p>
          </div>
        ))}
      </div>

      <p className="t-small mt-10 max-w-[48em]">
        <span className="font-semibold text-[var(--ink-2)]">Tools we use most: </span>
        {stack.join(', ')}.
      </p>
    </div>
  </section>
);

export default Services;
