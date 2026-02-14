
import React from 'react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-16 md:py-24 px-5 md:px-24 bg-[var(--bg-color)] transition-colors duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
        <div className="space-y-10 md:space-y-12 relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-9xl font-black tracking-tighter mb-6 md:mb-8 text-[var(--text-primary)] leading-[0.85]">
              Initiate<br/>Uplink.
            </h2>
            <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed max-w-sm">
              Ready to architect the future? We are currently accepting high-impact mission briefs.
            </p>
          </motion.div>
          
          <div className="space-y-8 md:space-y-10">
             <div className="space-y-3">
               <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-[0.5em] opacity-50">Direct Connection</div>
               <a href="mailto:hello@konatech.limited" className="text-xl md:text-3xl font-black hover:opacity-50 transition-opacity text-[var(--text-primary)] tracking-tight break-all">hello@konatech.limited</a>
             </div>

             <div className="space-y-6">
                <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-[0.5em] opacity-50">Executive Interface</div>
                <motion.a
                  href="https://calendly.com/obinna-ihekona/zoom"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-4 md:gap-8 px-6 md:px-10 py-6 md:py-8 liquid-morph rounded-[24px] md:rounded-[32px] group hover:border-[var(--accent-color)] transition-all shadow-xl bg-[var(--glass-bg)]"
                >
                  <div className="space-y-1 text-left">
                    <span className="block text-sm md:text-base font-black uppercase tracking-[0.15em] md:tracking-widest text-[var(--text-primary)]">Book Discovery Call</span>
                    <span className="block text-[9px] md:text-[10px] font-mono opacity-50 uppercase tracking-[0.2em] md:tracking-widest">Calendly_Integration v2.0</span>
                  </div>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[var(--glass-border)] flex items-center justify-center group-hover:bg-[var(--accent-color)] group-hover:text-[var(--bg-color)] transition-all shadow-inner">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/></svg>
                  </div>
                </motion.a>
             </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="liquid-morph p-6 md:p-16 relative rounded-[28px] md:rounded-[48px] shadow-2xl overflow-hidden border border-[var(--glass-border)]"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent opacity-10" />
          
          <form className="space-y-8 md:space-y-12">
            <div className="relative group">
              <label className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.4em] text-[var(--text-secondary)] block mb-3 font-bold">Subject_ID / Name</label>
              <input 
                type="text" 
                placeholder="Ex. Chief Technology Officer"
                className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-2xl px-5 md:px-6 py-4 md:py-5 outline-none focus:border-[var(--accent-color)] transition-all font-bold placeholder:opacity-30 text-[var(--text-primary)] shadow-sm"
              />
            </div>
            
            <div className="relative group">
              <label className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.4em] text-[var(--text-secondary)] block mb-3 font-bold">Comms_Route / Email</label>
              <input 
                type="email" 
                placeholder="connection@domain.com"
                className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-2xl px-5 md:px-6 py-4 md:py-5 outline-none focus:border-[var(--accent-color)] transition-all font-bold placeholder:opacity-30 text-[var(--text-primary)] shadow-sm"
              />
            </div>

            <div className="relative group">
              <label className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.4em] text-[var(--text-secondary)] block mb-3 font-bold">Mission_Parameters</label>
              <textarea 
                rows={4}
                placeholder="Describe your architectural requirements..."
                className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-2xl px-5 md:px-6 py-4 md:py-5 outline-none focus:border-[var(--accent-color)] transition-all font-bold resize-none placeholder:opacity-30 text-[var(--text-primary)] shadow-sm"
              />
            </div>

            <button 
              type="button"
              className="w-full py-5 md:py-7 bg-[var(--accent-color)] text-[var(--bg-color)] font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.6em] font-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 md:gap-4 rounded-[24px] shadow-2xl"
            >
              Broadcast_Transmission
            </button>
          </form>

          <div className="mt-12 flex justify-between items-center opacity-30 font-mono text-[9px] uppercase tracking-[0.3em]">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Layer_Secure</span>
            <span>RSA-4096 Enabled</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
