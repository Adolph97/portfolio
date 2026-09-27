import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { RevealHeading, RevealText } from '../UI/Reveal';

const steps = [
  { title: 'Discover', desc: 'We learn how your business runs today and where time or money is leaking.' },
  { title: 'Design', desc: 'We map the screens, data and integrations, and agree on scope before any code.' },
  { title: 'Build', desc: 'We work in short cycles, so you see working software early and often.' },
  { title: 'Launch', desc: 'We deploy, move your existing data across and walk your team through it.' },
  { title: 'Improve', desc: 'We watch how it’s used in the real world and keep refining after launch.' },
];

/** One stage; its connector fills and its number inverts as scroll progress reaches it. */
const Step: React.FC<{ step: (typeof steps)[number]; index: number; progress: MotionValue<number> }> = ({ step, index, progress }) => {
  const n = steps.length;
  const fill = useTransform(progress, [index / n, (index + 1) / n], [0, 1], { clamp: true });
  const [reached, setReached] = useState(false);
  useMotionValueEvent(progress, 'change', (v: number) => setReached(v >= index / n + 0.02));

  return (
    <li className="step" data-reached={reached}>
      {index < n - 1 && <motion.span aria-hidden="true" className="step-fill" style={{ '--p': fill } as React.CSSProperties} />}
      <span className="step-num" aria-hidden="true">{index + 1}</span>
      <h3 className="t-h3">{step.title}</h3>
      <p className="t-body mt-2 text-[0.9375rem]">{step.desc}</p>
    </li>
  );
};

const Process: React.FC = () => {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 75%', 'end 55%'] });

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

        <ol ref={list} className="steps">
          {steps.map((s, i) => (
            <Step key={s.title} step={s} index={i} progress={scrollYProgress} />
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Process;
