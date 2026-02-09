
import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { 
    id: "01", 
    title: "Discover", 
    desc: "Neural mapping of existing business logic and bottlenecks.",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
      </svg>
    )
  },
  { 
    id: "02", 
    title: "Design", 
    desc: "Structural blueprints focused on UX and modular engine design.",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    )
  },
  { 
    id: "03", 
    title: "Engineer", 
    desc: "Hardcode optimization and high-frequency stress testing.",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 8l-4 4 4 4M17 8l4 4-4 4M14 4l-4 16" />
      </svg>
    )
  },
  { 
    id: "04", 
    title: "Deploy", 
    desc: "Seamless rollout using modern cloud-native orchestration.",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 13V3M5 10l7 7 7-7M20 21H4" />
      </svg>
    )
  },
  { 
    id: "05", 
    title: "Optimize", 
    desc: "Continuous refinement loop via real-time data telemetry.",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707" />
      </svg>
    )
  }
];

const Process: React.FC = () => {
  return (
    <section id="process" className="py-40 px-8 md:px-24">
      <div className="mb-32">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-8xl font-black mb-8 tracking-tighter"
        >
          The Protocol.
        </motion.h2>
        <p className="text-[var(--text-color)] opacity-30 text-xs font-mono uppercase tracking-[0.5em]">Standard Operating Procedure [SOP-01]</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-[var(--glass-border)] rounded-3xl overflow-hidden border border-[var(--glass-border)]">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[var(--bg-color)] p-12 flex flex-col gap-12 group hover:bg-[var(--glass-bg)] transition-all duration-700 cursor-default"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-[var(--text-color)] opacity-20 group-hover:opacity-100 transition-opacity">/{s.id}</span>
              <div className="text-[var(--text-color)] opacity-10 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 ease-out">
                {s.icon}
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tight leading-none">{s.title}</h3>
              <p className="text-sm opacity-40 leading-relaxed group-hover:opacity-80 transition-opacity">{s.desc}</p>
            </div>
            
            <div className="mt-auto h-1 w-0 bg-[var(--accent-color)] group-hover:w-full transition-all duration-700 origin-left" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Process;
