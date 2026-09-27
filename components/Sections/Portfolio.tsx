import React from 'react';

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

const Portfolio: React.FC = () => (
  <section id="work" aria-labelledby="work-title" className="section">
    <div className="wrap">
      <div className="section-head">
        <h2 id="work-title" className="t-h2">Selected work</h2>
        <p className="t-body">
          Products we've designed, built and shipped, plus a few still in development. Most started as a
          conversation about one process that was eating someone's week.
        </p>
      </div>

      <ul className="list-none m-0 p-0">
        {projects.map((p) => (
          <li key={p.title} className="work-row">
            <div className="work-thumb">
              {p.image ? <img src={p.image} alt="" loading="lazy" /> : null}
            </div>

            <div>
              <h3 className="t-h3 !text-[1.5rem] md:!text-[1.75rem]">{p.title}</h3>
              <p className="t-small mt-1">{p.summary}</p>
            </div>

            <div className="col-start-2 min-[900px]:col-start-auto">
              <p className="t-body">{p.desc}</p>
              <p className="t-small mt-2">{p.category}</p>
            </div>

            <div className="col-start-2 min-[900px]:col-start-auto flex flex-row min-[900px]:flex-col items-center min-[900px]:items-end gap-4 min-[900px]:gap-3 flex-wrap">
              <span className="status" data-state={p.status}>
                {p.status === 'live' ? 'Live' : 'In development'}
              </span>
              {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="link font-semibold">
                  {p.status === 'live' ? 'Visit site' : 'Preview'}
                  <span className="sr-only"> for {p.title} (opens in a new tab)</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Portfolio;
