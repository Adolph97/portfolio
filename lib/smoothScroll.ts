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

/** Scrolls to a position or element, eased when smooth scrolling is running. Pass `center` to land an element mid-viewport. */
export const scrollTo = (target: number | string | HTMLElement, { center = false } = {}) => {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : typeof target === 'number' ? null : target;
  const offset = el && center ? -(window.innerHeight - el.offsetHeight) / 2 : el ? -72 : 0;

  if (lenis) {
    lenis.scrollTo(el ?? (target as number), { offset });
    return;
  }
  const top = el ? el.getBoundingClientRect().top + window.scrollY + offset : (target as number);
  window.scrollTo({ top, behavior: 'smooth' });
};

/** Freezes page scrolling (e.g. while a dialog is open). */
export const lockScroll = () => {
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
};

export const unlockScroll = () => {
  lenis?.start();
  document.documentElement.style.overflow = '';
};
