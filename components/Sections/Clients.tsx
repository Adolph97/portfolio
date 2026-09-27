import React from 'react';
import { motion } from 'framer-motion';

type Client = {
  name: string;
  logo: string;
  /** 'light' for logos drawn in white, which need inverting on a pale background */
  tone?: 'light';
  /** Max height in px; square marks need more height to carry the same visual weight as wide wordmarks */
  height?: number;
};

const clients: Client[] = [
  { name: 'Alliance Business Lending', logo: '/clients/alliance-logo.png' },
  { name: 'Silver Group Advisory', logo: '/clients/silvergroup.png', height: 96 },
  { name: 'Urban Wash Café', logo: '/clients/URBAN WC MAIN LOGO MAIN.png' },
  { name: 'TDH', logo: '/clients/TDH_logo-removebg-preview-249x300.png', height: 84 },
  { name: 'Cuvatech', logo: '/clients/Cuvatech_log.jpeg' },
  { name: 'DITS Academy', logo: '/clients/DITS_Academy_Logo_white.png', tone: 'light' },
];

const Clients: React.FC = () => (
  <section id="clients" aria-labelledby="clients-title" className="pb-2">
    <div className="wrap">
      <h2 id="clients-title" className="t-small !text-[var(--ink-2)] font-medium mb-6">
        Companies we've worked with
      </h2>
      <ul className="logo-grid list-none m-0 p-0">
        {clients.map((client, i) => (
          <motion.li
            key={client.name}
            className="logo-cell"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex-1 w-full flex items-center justify-center">
              <img
                src={encodeURI(client.logo)}
                alt=""
                data-tone={client.tone}
                loading="lazy"
                style={{ maxHeight: client.height ?? 64 }}
                className="logo-img"
              />
            </div>
            <span className="t-small text-center leading-tight">{client.name}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  </section>
);

export default Clients;
