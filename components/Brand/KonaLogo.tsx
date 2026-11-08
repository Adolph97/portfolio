import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * The Kona Tech mark: an adire-blue tile holding a K whose upper arm is a
 * rising arrow, with three resist-dye dots climbing beside it (Integrity,
 * Innovation, Initiative). The last dot is ochre, the site's "live" accent.
 *
 * Geometry lives on a 48×48 grid; keep public/favicon.svg and public/brand/*
 * in step with these paths if they ever change.
 */

export const BRAND = {
  blue: '#1D4A8C',
  paper: '#F1F2F5',
  ochre: '#E0A526',
} as const;

export const MARK_PATHS = {
  stem: 'M12 12V36',
  arrow: 'M14.5 28.5L29.5 13.5',
  head: 'M22.5 12.5H30.5V20.5',
  leg: 'M19.5 23.5L30 35.5',
} as const;

export const MARK_DOTS = [
  { cx: 35, cy: 34.5, r: 1.7, value: 'Integrity' },
  { cx: 37, cy: 29, r: 2, value: 'Innovation' },
  { cx: 39, cy: 23, r: 2.4, value: 'Initiative' },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

type DotState = readonly [boolean, boolean, boolean];

export interface KonaMarkProps {
  size?: number;
  /** Draw the mark in once on mount. */
  animate?: boolean;
  /** Dashed stitch border inside the tile; meant for sizes of 64px and up. */
  detail?: boolean;
  /** 'tile' is the full-colour mark; 'glyph' drops the tile and uses currentColor. */
  variant?: 'tile' | 'glyph';
  /** Which dots are filled. Unfilled dots show as faint resist rings. */
  dots?: DotState;
  /** Accessible name. Omit when the mark sits beside the written name. */
  label?: string;
  className?: string;
}

export const KonaMark: React.FC<KonaMarkProps> = ({
  size = 28,
  animate = false,
  detail = false,
  variant = 'tile',
  dots = [true, true, true],
  label,
  className,
}) => {
  const reduceMotion = useReducedMotion();
  const play = animate && !reduceMotion;
  const glyph = variant === 'glyph';
  const ink = glyph ? 'currentColor' : BRAND.paper;

  // Each stroke of the K draws on in order; the dots follow
  const draw = (delay: number) =>
    play
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { pathLength: { duration: 0.55, delay, ease: EASE }, opacity: { duration: 0.1, delay } },
        }
      : {};

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {!glyph && (
        <motion.rect
          width="48"
          height="48"
          rx="11"
          fill={BRAND.blue}
          style={{ transformOrigin: '24px 24px' }}
          {...(play
            ? { initial: { scale: 0.6, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.6, ease: EASE } }
            : {})}
        />
      )}
      {!glyph && detail && (
        <rect
          x="3.6"
          y="3.6"
          width="40.8"
          height="40.8"
          rx="8"
          fill="none"
          stroke={BRAND.paper}
          strokeOpacity={0.32}
          strokeWidth={0.7}
          strokeDasharray="1.6 1.9"
          strokeLinecap="round"
        />
      )}

      <g fill="none" stroke={ink} strokeWidth={4.8} strokeLinecap="round" strokeLinejoin="round">
        <motion.path d={MARK_PATHS.stem} strokeWidth={5.5} {...draw(0.25)} />
        <motion.path d={MARK_PATHS.arrow} {...draw(0.45)} />
        <motion.path d={MARK_PATHS.head} {...draw(0.75)} />
        <motion.path d={MARK_PATHS.leg} {...draw(0.6)} />
      </g>

      {MARK_DOTS.map((d, i) => {
        const on = dots[i];
        const fill = i === 2 ? (glyph ? 'currentColor' : BRAND.ochre) : ink;
        return (
          <motion.circle
            key={d.value}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            style={{ transformOrigin: `${d.cx}px ${d.cy}px` }}
            initial={play ? { scale: 0 } : false}
            animate={{
              scale: 1,
              fill: on ? fill : 'rgba(0,0,0,0)',
              stroke: on ? 'rgba(0,0,0,0)' : ink,
            }}
            strokeWidth={0.8}
            strokeOpacity={on ? 1 : 0.55}
            transition={{
              scale: { type: 'spring', stiffness: 380, damping: 16, delay: play ? 1 + i * 0.12 : 0 },
              default: { duration: 0.5, ease: EASE },
            }}
          />
        );
      })}
    </svg>
  );
};

/** "Kona Tech" set in Schibsted Grotesk: heavy "Kona", lighter "Tech". */
export const KonaWordmark: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <span className={`kona-wordmark ${className}`} style={style}>
    <span className="kona-wordmark-kona">Kona</span> <span className="kona-wordmark-tech">Tech</span>
  </span>
);

export interface KonaLogoProps {
  size?: number;
  layout?: 'horizontal' | 'stacked';
  animate?: boolean;
  className?: string;
}

/** Mark + wordmark lockup. The text carries the name, so the mark stays decorative. */
export const KonaLogo: React.FC<KonaLogoProps> = ({ size = 30, layout = 'horizontal', animate = false, className = '' }) => {
  const reduceMotion = useReducedMotion();
  const stacked = layout === 'stacked';
  return (
    <span className={`kona-logo kona-logo-${layout} ${className}`} style={{ gap: stacked ? size * 0.25 : size * 0.35 }}>
      <KonaMark size={size} animate={animate} detail={size >= 64} />
      <motion.span
        initial={animate && !reduceMotion ? { opacity: 0, x: -6 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
      >
        <KonaWordmark style={{ fontSize: stacked ? size * 0.42 : size * 0.62 }} />
      </motion.span>
    </span>
  );
};

export default KonaLogo;
