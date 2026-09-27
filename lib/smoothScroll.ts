import Lenis from 'lenis';

let lenis: Lenis | null = null;

/** Starts eased page scrolling unless the visitor prefers reduced motion. Returns a cleanup function. */
export const startSmoothScroll = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
  let frame = requestAnimationFrame(function raf(time) {
    lenis?.raf(time);
    frame = requestAnimationFrame(raf);
  });

  return () => {
    cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = null;
  };
};

/** Scrolls to a position or element, eased when smooth scrolling is running. */
export const scrollTo = (target: number | string | HTMLElement) => {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : -72 });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior: 'smooth' });
};
