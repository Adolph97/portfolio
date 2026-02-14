import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Ada Lovelace",
    title: "CTO, FutureAI",
    quote: "The team delivered beyond expectations. Their speed and technical depth are unmatched.",
    avatar: "/images/Logos/ada.png"
  },
  {
    name: "Alan Turing",
    title: "Lead Architect, CipherTech",
    quote: "Aesthetics and performance, perfectly balanced. Our product launch was a breeze.",
    avatar: "/images/Logos/turing.png"
  },
  {
    name: "Grace Hopper",
    title: "VP Engineering, CodeFleet",
    quote: "Functionality and reliability at scale. Highly recommended for mission-critical builds.",
    avatar: "/images/Logos/hopper.png"
  },
  {
    name: "Tim Berners-Lee",
    title: "Founder, WebCore",
    quote: "Lightning-fast delivery and beautiful UI. The best experience we've had with a dev team.",
    avatar: "/images/Logos/tim.png"
  }
];

const TestimonialCard = ({ t }: { t: typeof testimonials[0] }) => (
  <motion.div
    className="bg-[var(--glass-bg)] rounded-3xl shadow-xl p-8 md:p-12 flex flex-col items-center text-center max-w-lg mx-auto"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    <img
      src={t.avatar}
      alt={t.name}
      className="w-16 h-16 md:w-20 md:h-20 rounded-full mb-4 object-cover border-2 border-[var(--accent-color)] shadow"
    />
    <blockquote className="text-lg md:text-xl font-medium mb-6 text-[var(--text-primary)]">“{t.quote}”</blockquote>
    <div className="font-black text-base md:text-lg text-[var(--accent-color)]">{t.name}</div>
    <div className="text-xs md:text-sm font-mono uppercase tracking-widest opacity-50 mt-1">{t.title}</div>
  </motion.div>
);

const Testimonials: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => autoRef.current && clearInterval(autoRef.current);
  }, []);

  return (
    <section id="testimonials" className="pt-0 pb-12 md:pb-16 px-5 md:px-24 bg-transparent">
      <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-[var(--text-primary)]">Testimonials</h2>
        <p className="text-[var(--text-secondary)] text-sm font-mono uppercase tracking-[0.4em]">Speed. Functionality. Aesthetics.</p>
      </div>
      <div className="relative flex items-center justify-center">
        <TestimonialCard t={testimonials[current]} />
        <button
          onClick={() => setCurrent((current - 1 + testimonials.length) % testimonials.length)}
          className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full border border-[var(--glass-border)] flex items-center justify-center hover:bg-[var(--accent-color)] hover:border-[var(--accent-color)] transition-all duration-500 group"
          aria-label="Previous testimonial"
        >
          <span className="text-[var(--text-color)] group-hover:text-[var(--bg-color)] text-xl md:text-2xl">←</span>
        </button>
        <button
          onClick={() => setCurrent((current + 1) % testimonials.length)}
          className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full border border-[var(--glass-border)] flex items-center justify-center hover:bg-[var(--accent-color)] hover:border-[var(--accent-color)] transition-all duration-500 group"
          aria-label="Next testimonial"
        >
          <span className="text-[var(--text-color)] group-hover:text-[var(--bg-color)] text-xl md:text-2xl">→</span>
        </button>
      </div>
      <div className="flex justify-center gap-3 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === current
                ? 'bg-[var(--accent-color)] w-8'
                : 'bg-[var(--glass-border)] w-2 hover:bg-[var(--text-color)] opacity-50'
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
