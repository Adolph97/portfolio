import React from 'react';

const steps = [
  { title: 'Discover', desc: 'We learn how your business runs today and where time or money is leaking.' },
  { title: 'Design', desc: 'We map the screens, data and integrations, and agree on scope before any code.' },
  { title: 'Build', desc: 'We work in short cycles, so you see working software early and often.' },
  { title: 'Launch', desc: 'We deploy, move your existing data across and walk your team through it.' },
  { title: 'Improve', desc: 'We watch how it’s used in the real world and keep refining after launch.' },
];

const Process: React.FC = () => (
  <section id="process" aria-labelledby="process-title" className="section">
    <div className="wrap">
      <div className="section-head">
        <h2 id="process-title" className="t-h2">How a project runs</h2>
        <p className="t-body">
          The same five stages whether it's a two-week automation or a six-month platform. The steps stay
          the same. How long each one takes depends on the project.
        </p>
      </div>

      <ol className="steps">
        {steps.map((s, i) => (
          <li key={s.title} className="step">
            <span className="step-num" aria-hidden="true">{i + 1}</span>
            <h3 className="t-h3">{s.title}</h3>
            <p className="t-body mt-2 text-[0.9375rem]">{s.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Process;
