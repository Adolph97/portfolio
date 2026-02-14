
import React from 'react';
import { motion } from 'framer-motion';



const projects = [
  {
    title: "Customer Pro",
    tagline: "Feedback Intelligence",
    desc: "Real-time sentiment flow analysis and heatmaps for global commerce tracking.",
    category: "AI/ML SYSTEM",
    image: "/Logos/customerpro.jpeg",
    status: "live"
  },
  {
    title: "Loveet",
    tagline: "Emotional Algorithms",
    desc: "Data-driven compatibility scores via dynamic question flows and real-time response mapping.",
    category: "CONSUMER PLATFORM",
    image: "/Logos/heart.png",
    status: "live"
  },
  {
    title: "Clock-It",
    tagline: "Operational Harmony",
    desc: "Automated attendance and payroll synchronization for modern enterprise workforces.",
    category: "SAAS INFRASTRUCTURE",
    image: "/Logos/clock-it.png",
    status: "live"
  },
  {
    title: "Signal pro Bot",
    tagline: "Fintech Signal Engine",
    desc: "Institutional-grade retail signal generation for high-frequency algorithmic trading.",
    category: "TRADING AUTOMATION",
    image: "/Logos/signalpro.jpeg",
    status: "soon"
  },
  {
    title: "Nexoaura",
    tagline: "Whatsapp chatbot for customer support",
    desc: "AI-powered WhatsApp chatbot for instant customer support, providing real-time assistance and personalized interactions.",
    category: "AI CHATBOT",
    image: "/Logos/Nexoaura.png",
    status: "soon"
  }
];

const Portfolio: React.FC = () => {
  return (
    <section id="work" className="py-24 md:py-40">
      <div className="px-5 md:px-24 mb-16 md:mb-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end gap-12"
        >
          <div>
            <h2 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.8]">Selected<br/>Builds.</h2>
            <p className="text-[var(--text-color)] opacity-40 mt-6 md:mt-10 max-w-sm font-medium text-base md:text-lg leading-relaxed">Engineered with extreme precision for modern business demands.</p>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.5em] opacity-20 text-right">
            DATABASE_v04.01
          </div>
        </motion.div>
      </div>

      <div className="px-5 md:px-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-32">
        {projects.map((p, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i % 2 * 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group relative"
          >
            <div className="overflow-hidden bg-[var(--glass-bg)] aspect-[4/5] md:aspect-[3/4] relative liquid-morph rounded-[28px] md:rounded-[40px] shadow-xl">
              <img 
                src={p.image} 
                alt={p.title} 
                className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105 opacity-60 group-hover:opacity-100"
              />
              
              <div className="absolute top-5 left-5 md:top-8 md:left-8 z-30">
                {p.status === 'live' ? (
                  <div className="badge-live px-4 py-1.5 rounded-full text-[9px] font-mono uppercase tracking-[0.3em] font-bold flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
                    System_Live
                  </div>
                ) : (
                  <div className="badge-soon px-4 py-1.5 rounded-full text-[9px] font-mono uppercase tracking-[0.3em] font-bold flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffcc00]" />
                    Dev_Phase
                  </div>
                )}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end translate-y-0 md:translate-y-8 md:group-hover:translate-y-0 transition-all duration-700 ease-out">
                <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.35em] md:tracking-[0.5em] mb-3 md:mb-4 opacity-60 md:opacity-40">{p.category}</div>
                <h3 className="text-3xl md:text-4xl font-black mb-2 md:mb-3 tracking-tighter leading-none">{p.title}</h3>
                <p className="text-sm md:text-base opacity-75 md:opacity-60 leading-relaxed mb-6 md:mb-10 max-w-xs">{p.desc}</p>
                
                <button className="flex items-center gap-4 md:gap-6 group/btn w-fit">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-[var(--glass-border)] flex items-center justify-center group-hover/btn:bg-[var(--accent-color)] group-hover/btn:border-[var(--accent-color)] transition-all duration-500 shadow-lg">
                    <span className="text-[var(--text-color)] group-hover/btn:text-[var(--bg-color)] text-xl">→</span>
                  </div>
                  <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.2em] md:tracking-widest font-black">View_Architecture</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
