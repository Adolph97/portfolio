import React from 'react';
import { RevealHeading, RevealText } from '../UI/Reveal';

type Member = {
  name: string;
  role: string;
  photo: string;
  linkedin?: string;
};

// Roles left blank are simply not shown — fill them in when confirmed.
const team: Member[] = [
  {
    name: 'Obinna Ihekona',
    role: 'Founder, lead systems architect',
    photo: '/images/hero-image.jpg',
    linkedin: 'https://www.linkedin.com/in/obinna-ihekona-230742110/',
  },
  { name: 'Adeoye Ibukun', role: '', photo: '/images/Adeoye Ibukun.jpeg' },
  { name: 'Glory Ogbuta', role: '', photo: '/images/Glory-Ogbuta.jpeg' },
];

const Team: React.FC = () => (
  <section id="team" aria-labelledby="team-title" className="section">
    <div className="wrap">
      <div className="section-head">
        <RevealHeading id="team-title" className="t-h2">The team</RevealHeading>
        <RevealText className="t-body">
          We're a small team on purpose. You talk directly to the people designing and building your product,
          not to an account manager relaying messages.
        </RevealText>
      </div>

      <ul className="team-grid list-none m-0 p-0">
        {team.map((member) => (
          <li key={member.name}>
            <div
              className="portrait"
              onPointerEnter={(e) => {
                // Colour wipes in from wherever the pointer enters
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--x', `${((e.clientX - r.left) / r.width) * 100}%`);
                e.currentTarget.style.setProperty('--y', `${((e.clientY - r.top) / r.height) * 100}%`);
              }}
            >
              <img src={encodeURI(member.photo)} alt="" loading="lazy" />
              <img src={encodeURI(member.photo)} alt="" loading="lazy" className="portrait-color" />
            </div>
            <div>
              <h3 className="t-h3">{member.name}</h3>
              {member.role && <p className="t-small mt-1">{member.role}</p>}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="link t-small inline-block mt-3">
                  LinkedIn
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Team;
