import React from 'react';
import { RevealHeading, RevealText } from '../UI/Reveal';

const services = [
  {
    title: 'AI and automation',
    desc: 'Assistants, classifiers and data pipelines that take repetitive work off your team, built around how you already operate.',
  },
  {
    title: 'Internal tools',
    desc: 'Dashboards, attendance, payroll and approval systems that connect to the software you already pay for.',
  },
  {
    title: 'Product engineering',
    desc: 'Web and mobile products, from a first clickable prototype to a platform that holds up under real traffic.',
  },
  {
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
            <h3 className="t-h3">{s.title}</h3>
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
