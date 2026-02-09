
import React, { useState, useEffect } from 'react';

const SystemStatus: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour12: false }));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-[60] hidden md:flex flex-col gap-2 font-mono text-[9px] uppercase tracking-[0.2em] pointer-events-none transition-colors duration-500">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[var(--text-primary)] opacity-60">SYS_OPERATIONAL</span>
      </div>
      <div className="text-[var(--text-secondary)]">LOC: LAGOS / NG - 6.5244° N</div>
      <div className="text-[var(--text-secondary)]">TS: {time}</div>
    </div>
  );
};

export default SystemStatus;
