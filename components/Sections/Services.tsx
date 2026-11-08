import React from 'react';
import { motion } from 'framer-motion';
import { RevealHeading, RevealText } from '../UI/Reveal';
import { EASE } from '../../lib/brand';

type Motif = 'flow' | 'tiles' | 'rise' | 'chat';

const drawIn = (delay: number) => ({
  hidden: { pathLength: 0, opacity: 0 },
  shown: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 0.8, delay, ease: EASE }, opacity: { duration: 0.2, delay } } },
});

const popIn = (delay: number) => ({
  hidden: { scale: 0 },
  shown: { scale: 1, transition: { type: 'spring' as const, stiffness: 420, damping: 16, delay } },
});

const line = { stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };

/** One glyph per service in the brand's language (arrows, dots, tiles), drawn in when it scrolls into view. */
const MotifGlyph: React.FC<{ motif: Motif }> = ({ motif }) => (
  <motion.svg
    viewBox="0 0 48 48"
    className="service-glyph"
    aria-hidden="true"
    initial="hidden"
    whileInView="shown"
    viewport={{ once: true, margin: '0px 0px -15% 0px' }}
  >
    <motion.rect className="glyph-frame" x="1" y="1" width="46" height="46" rx="10" fill="none" stroke="currentColor" strokeOpacity={0.35} variants={drawIn(0)} />

    {/* AI and automation: inputs flow in, a result comes out */}
    {motif === 'flow' && (
      <>
        {[11, 17, 23].map((cx, i) => (
          <motion.circle key={cx} cx={cx} cy={24} r={2.2} fill="currentColor" variants={popIn(0.15 + i * 0.08)} />
        ))}
        <motion.path d="M28 24H38" {...line} variants={drawIn(0.4)} />
        <motion.path d="M33 19L38 24L33 29" {...line} variants={drawIn(0.6)} />
      </>
    )}

    {/* Internal tools: modules that fit together, one live */}
    {motif === 'tiles' &&
      [
        [11, 11],
        [25, 11],
        [11, 25],
        [25, 25],
      ].map(([x, y], i) => (
        <motion.rect
          key={i}
          className="glyph-tile"
          x={x}
          y={y}
          width={12}
          height={12}
          rx={3}
          fill={i === 1 ? 'var(--ochre)' : 'none'}
          stroke={i === 1 ? 'var(--ochre)' : 'currentColor'}
          strokeWidth={2.2}
          variants={popIn(0.15 + i * 0.08)}
        />
      ))}

    {/* Product engineering: the rising arrow over a baseline */}
    {motif === 'rise' && (
      <>
        <motion.path d="M10 37H38" {...line} strokeOpacity={0.45} variants={drawIn(0.15)} />
        <g className="glyph-arrow">
          <motion.path d="M12 31L33 12" {...line} strokeWidth={2.8} variants={drawIn(0.3)} />
          <motion.path d="M25 12H33V20" {...line} strokeWidth={2.8} variants={drawIn(0.6)} />
        </g>
      </>
    )}

    {/* Chatbots and messaging: a reply on its way */}
    {motif === 'chat' && (
      <>
        <motion.path d="M15 11H33A5 5 0 0 1 38 16V27A5 5 0 0 1 33 32H22L15 38V32A5 5 0 0 1 10 27V16A5 5 0 0 1 15 11Z" {...line} strokeWidth={2.4} variants={drawIn(0.15)} />
        {[18, 24, 30].map((cx, i) => (
          <motion.circle key={cx} className="glyph-typing" cx={cx} cy={21.5} r={2.1} fill="currentColor" variants={popIn(0.5 + i * 0.08)} />
        ))}
      </>
    )}
  </motion.svg>
);

const services = [
  {
    motif: 'flow' as Motif,
    title: 'AI and automation',
    desc: 'Assistants, classifiers and data pipelines that take repetitive work off your team, built around how you already operate.',
    examples: 'Reading invoices, scoring leads, answering routine questions, forecasting stock.',
  },
  {
    motif: 'tiles' as Motif,
    title: 'Internal tools',
    desc: 'Dashboards, attendance, payroll and approval systems that connect to the software you already pay for.',
    examples: 'Staff check-in, expense approvals, sales dashboards, inventory tracking.',
  },
  {
    motif: 'rise' as Motif,
    title: 'Product engineering',
    desc: 'Web and mobile products, from a first clickable prototype to a platform that holds up under real traffic.',
    examples: 'Customer portals, marketplaces, booking apps, internal platforms.',
  },
  {
    motif: 'chat' as Motif,
    title: 'Chatbots and messaging',
    desc: 'WhatsApp and Telegram bots for customer support, sales follow-ups and notifications.',
    examples: 'Order updates, support triage, appointment reminders, payment alerts.',
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
          <div key={s.title} className="service" data-motif={s.motif} tabIndex={0}>
            <MotifGlyph motif={s.motif} />
            <h3 className="t-h3 mt-6">{s.title}</h3>
            <p className="t-body mt-3">{s.desc}</p>
            <div className="service-examples">
              <p className="t-small">
                <span className="font-semibold text-[var(--indigo)]">For example: </span>
                {s.examples}
              </p>
            </div>
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
