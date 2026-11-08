/**
 * Kona Tech brand tokens for code that can't read CSS variables
 * (SVG fills set in JS, canvas, three.js). CSS keeps its own tokens in index.css;
 * keep the two in step.
 */
export const BRAND = {
  /** Primary navy: the logo tile, the hero stage, the contact band. */
  navy: '#1D4A8C',
  /** Deep navy for dark stages. */
  navyDeep: '#0E2244',
  /** Paper: light surfaces, and the strokes of the mark. */
  paper: '#F1F2F5',
  /** Pale line colour used on navy. */
  thread: '#E2ECF8',
  /** Ochre: the "live" accent. Use sparingly, one per view. */
  ochre: '#E0A526',
  /** Ochre lifted slightly for use on dark navy stages. */
  ochreOnDark: '#E8B33A',
  /** Ink: body text on paper. */
  ink: '#111B29',
} as const;

/** The site-wide easing curve, an expo-out. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.4,
  base: 0.7,
  slow: 0.9,
} as const;
