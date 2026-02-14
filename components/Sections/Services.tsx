
import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: "AI & Intelligence",
    desc: "Deploying high-performance neural networks designed for specialized business automation.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: "Process Optimization",
    desc: "End-to-end workflow intelligence using custom agents and enterprise-grade integrations.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    )
  },
  {
    title: "Product Scale",
    desc: "Architecting zero-latency product ecosystems capable of supporting millions of concurrent users.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: "Bot Infrastructure",
    desc: "Specialized real-time bridges for WhatsApp, Telegram, and proprietary communication protocols.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 md:py-32 px-5 md:px-24">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-baseline mb-12 md:mb-32">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-7xl font-black tracking-tighter"
        >
          Intelligence<br/>Modules.
        </motion.h2>
        <div className="text-[var(--text-color)] opacity-20 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.6em]">System Capabilities [v4.2]</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--glass-border)] border border-[var(--glass-border)] rounded-3xl overflow-hidden shadow-2xl">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--bg-color)] p-7 md:p-12 flex flex-col gap-8 md:gap-12 group hover:bg-[var(--glass-bg)] transition-all duration-500"
          >
            <div className="text-[var(--text-color)] opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
              {s.icon}
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 tracking-tight">{s.title}</h3>
              <p className="text-sm text-[var(--text-color)] opacity-40 leading-relaxed group-hover:opacity-80 transition-opacity">
                {s.desc}
              </p>
            </div>
            <div className="mt-auto pt-8 border-t border-[var(--glass-border)] flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Module_{i+1}</span>
              <span className="text-lg">→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
