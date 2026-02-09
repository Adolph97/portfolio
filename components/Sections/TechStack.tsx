
import React from 'react';
import { motion } from 'framer-motion';

const stack = [
  { name: "Python", type: "AI/Engine" },
  { name: "FastAPI", type: "Backend" },
  { name: "Node.js", type: "Runtime" },
  { name: "React/Next", type: "UI Framework" },
  { name: "Redis", type: "Caching" },
  { name: "PostgreSQL", type: "Persistence" },
  { name: "Telegram API", type: "Comms" },
  { name: "Vercel", type: "Infra" },
];

const TechStack: React.FC = () => {
  return (
    <section id="stack" className="py-24 px-8 md:px-24">
      <div className="max-w-4xl mx-auto text-center mb-24">
        <h2 className="text-4xl font-black mb-4 tracking-tighter text-[var(--text-primary)]">Core Stack.</h2>
        <p className="text-[var(--text-secondary)] text-sm font-mono uppercase tracking-[0.4em]">Integrated Intelligence</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
        {stack.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, borderColor: "var(--accent-color)" }}
            className="px-8 py-5 border border-[var(--glass-border)] rounded-2xl flex flex-col items-center gap-1 group transition-all liquid-morph hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)]"
          >
            <span className="text-sm font-bold tracking-tight">{item.name}</span>
            <span className="text-[8px] font-mono uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-colors">
              {item.type}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--glass-border)] border border-[var(--glass-border)] opacity-30 rounded-3xl overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-[var(--bg-color)] flex items-center justify-center">
            <div className="w-1 h-1 bg-[var(--text-secondary)]" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
