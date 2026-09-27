import React, { Suspense, lazy, useCallback, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import AdirePattern from '../UI/AdirePattern';
import type { PointerState } from '../UI/AdireCloth';

// three.js is heavy; the static SVG pattern shows until the cloth is ready.
const AdireCloth = lazy(() => import('../UI/AdireCloth'));

const ease = [0.16, 1, 0.3, 1] as const;

const headline = ['We build the software', 'growing businesses run on.'];

const Hero: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: 0 });
  const [clothReady, setClothReady] = useState(false);
  const handleReady = useCallback(() => setClothReady(true), []);

  // Photo tilts toward the pointer
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-1, 1], [-9, 9]), spring);
  const rotateX = useSpring(useTransform(py, [-1, 1], [7, -7]), spring);
  const shiftX = useSpring(useTransform(px, [-1, 1], [-10, 10]), spring);
  const shiftY = useSpring(useTransform(py, [-1, 1], [8, -8]), spring);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    pointer.current = { x, y, active: 1 };
    if (e.pointerType === 'mouse') {
      px.set(x);
      py.set(y);
    }
  };

  const onPointerLeave = () => {
    pointer.current = { ...pointer.current, active: 0 };
    px.set(0);
    py.set(0);
  };

  return (
    <section id="top" className="relative pt-10 pb-20 md:pt-16 md:pb-28 lg:pt-20 lg:pb-32">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-16">
        <h1 className="t-display lg:col-span-12 max-w-[14ch] lg:max-w-none">
          {headline.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="lg:col-span-6 lg:self-center">
          <motion.p
            className="t-lead"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            Kona Tech is a studio in Lagos. We design and build web apps, automations and AI tools for teams
            in Nigeria, the UK, the US and further afield.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            <a href="#work" className="btn btn-primary">See our work</a>
            <a
              href="https://calendly.com/obinna-ihekona/zoom"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Book a discovery call
            </a>
          </motion.div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <figure className="m-0 relative mx-auto max-w-[460px] lg:max-w-none">
            <motion.div
              className="adire relative aspect-[5/6] rounded-[28px] overflow-hidden [perspective:900px]"
              initial={{ clipPath: 'inset(0 0 100% 0 round 28px)' }}
              animate={{ clipPath: 'inset(0 0 0% 0 round 28px)' }}
              transition={{ duration: 1.1, delay: 0.2, ease }}
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
            >
              <AdirePattern className="absolute inset-0" />
              {!reduceMotion && (
                <div
                  className="absolute inset-0 transition-opacity duration-1000"
                  style={{ opacity: clothReady ? 1 : 0 }}
                  aria-hidden="true"
                >
                  <Suspense fallback={null}>
                    <AdireCloth pointer={pointer} onReady={handleReady} />
                  </Suspense>
                </div>
              )}
              <motion.img
                src="/images/hero-image.jpg"
                alt="Obinna Ihekona, founder of Kona Tech"
                className="absolute left-[14%] top-[12%] w-[62%] aspect-[3/4] object-cover rounded-[18px] shadow-[0_30px_70px_-20px_rgba(4,14,30,0.85)] will-change-transform"
                style={{ rotateX, rotateY, x: shiftX, y: shiftY }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.75, ease }}
              />
            </motion.div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4">
              <span className="font-bold">Obinna Ihekona</span>
              <span className="t-small">Founder, lead systems architect</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Hero;
