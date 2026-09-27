import React from 'react';

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
        <h2 id="team-title" className="t-h2">The team</h2>
        <p className="t-body">
          We're a small team on purpose. You talk directly to the people designing and building your product,
          not to an account manager relaying messages.
        </p>
      </div>

      <ul className="team-grid list-none m-0 p-0">
        {team.map((member) => (
          <li key={member.name}>
            <div className="portrait">
              <img src={encodeURI(member.photo)} alt="" loading="lazy" />
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
