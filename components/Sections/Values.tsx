import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { KonaMark, MARK_DOTS } from '../Brand/KonaLogo';
import { RevealHeading, RevealText } from '../UI/Reveal';

const values = [
  {
    title: 'Integrity',
    desc: 'We say what something will cost and how long it will take, and we tell you early when that changes. Your code, data and accounts stay yours.',
  },
  {
    title: 'Innovation',
    desc: 'We reach for new tools like AI where they genuinely help and keep things simple where they don’t. The goal is software that solves the problem, not software that shows off.',
  },
  {
    title: 'Initiative',
    desc: 'We don’t wait to be asked. We flag problems before they cost you, train the next developers through 10xdev, and keep pushing what tech built in Africa can do.',
  },
];

/** One value. Reports back the first time it reaches the middle of the screen. */
const ValueRow: React.FC<{ index: number; title: string; desc: string; lit: boolean; onLit: (i: number) => void }> = ({
  index,
  title,
  desc,
  lit,
  onLit,
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '-35% 0px -35% 0px' });
  useEffect(() => {
    if (inView) onLit(index);
  }, [inView, index, onLit]);

  return (
    <li ref={ref} className="value-row" data-lit={lit} data-accent={index === 2}>
      <span className="value-dot" aria-hidden="true" />
      <div>
        <h3 className="t-h3">{title}</h3>
        <p className="t-body mt-2">{desc}</p>
      </div>
    </li>
  );
};

const Values: React.FC = () => {
  const [lit, setLit] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const figure = useRef<HTMLDivElement>(null);
  const figureInView = useInView(figure, { once: true, margin: '0px 0px -20% 0px' });

  const onLit = React.useCallback((i: number) => {
    setLit((prev) => {
      if (prev[i]) return prev;
      const next = [...prev] as [boolean, boolean, boolean];
      next[i] = true;
      return next;
    });
  }, []);

  return (
    <section id="values" aria-labelledby="values-title" className="section">
      <div className="wrap values-grid">
        <div ref={figure} className="values-figure">
          {/* The mark draws itself when the section arrives; each dot fills as its value is read */}
          {figureInView ? (
            <KonaMark size={340} animate dots={lit} className="values-mark" />
          ) : (
            <div className="values-mark" aria-hidden="true" />
          )}
          <p className="t-small mt-5 max-w-[22em]">
            The three dots in our mark stand for {MARK_DOTS.map((d) => d.value).join(', ').replace(/, ([^,]*)$/, ' and $1')}.
          </p>
        </div>

        <div>
          <RevealHeading id="values-title" className="t-h2">What we stand for</RevealHeading>
          <RevealText className="t-lead mt-5">
            We want good technology to be within reach of every business and person who needs it, starting in Nigeria
            and growing across Africa. Three ideas guide how we work.
          </RevealText>
          <ol className="values-list">
            {values.map((v, i) => (
              <ValueRow key={v.title} index={i} title={v.title} desc={v.desc} lit={lit[i]} onLit={onLit} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Values;
