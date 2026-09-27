import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

/** Heading that rises out of a mask the first time it scrolls into view. */
export const RevealHeading: React.FC<{
  as?: 'h2' | 'h3';
  id?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ as = 'h2', id, className, children }) => {
  const Tag = as;
  return (
    <Tag id={id} className={className}>
      {/* Observe the mask, not the clipped text inside it, or it never counts as visible */}
      <motion.span
        className="block overflow-hidden pb-[0.08em] -mb-[0.08em]"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      >
        <motion.span
          className="block"
          variants={{ hidden: { y: '110%' }, shown: { y: 0 } }}
          transition={{ duration: 1, ease }}
        >
          {children}
        </motion.span>
      </motion.span>
    </Tag>
  );
};

/** Supporting copy that fades in just after its heading. */
export const RevealText: React.FC<{ className?: string; delay?: number; children: React.ReactNode }> = ({
  className,
  delay = 0.15,
  children,
}) => (
  <motion.p
    className={className}
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    transition={{ duration: 0.9, delay, ease }}
  >
    {children}
  </motion.p>
);
