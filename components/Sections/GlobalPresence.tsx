import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { GlobeLocation } from '../UI/RotatingGlobe';
import { RevealHeading, RevealText } from '../UI/Reveal';
import { EASE } from '../../lib/brand';

// three.js is heavy; load it only when this section renders.
const RotatingGlobe = lazy(() => import('../UI/RotatingGlobe'));

const HOME_ZONE = 'Africa/Lagos';
const STEP_MS = 3200;

/** Each place we work, with the time zone used for its live local clock. */
const LOCATIONS: (GlobeLocation & { city: string; zone: string })[] = [
  { name: 'Nigeria', city: 'Lagos', zone: 'Africa/Lagos', lat: 6.5244, lon: 3.3792 },
  { name: 'United Kingdom', city: 'London', zone: 'Europe/London', lat: 51.5072, lon: -0.1276 },
  { name: 'United States', city: 'Chicago', zone: 'America/Chicago', lat: 41.8781, lon: -87.6298 },
  { name: 'UAE', city: 'Dubai', zone: 'Asia/Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'India', city: 'Bengaluru', zone: 'Asia/Kolkata', lat: 12.9716, lon: 77.5946 },
  { name: 'Australia', city: 'Perth', zone: 'Australia/Perth', lat: -31.9505, lon: 115.8605 },
];

const GLOBE_LOCATIONS: GlobeLocation[] = LOCATIONS.map(({ name, lat, lon }) => ({ name, lat, lon }));

/** UTC offset of a zone at a moment, in minutes. */
const offsetMinutes = (zone: string, at: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(at);
  const v = (t: string) => +(parts.find((p) => p.type === t)?.value ?? 0);
  const asUTC = Date.UTC(v('year'), v('month') - 1, v('day'), v('hour'), v('minute'), v('second'));
  return Math.round((asUTC - at.getTime()) / 60000);
};

/** "+1 h", "−5 h", or "Same time" relative to Lagos. */
const hoursFromHome = (zone: string, at: Date) => {
  const diff = (offsetMinutes(zone, at) - offsetMinutes(HOME_ZONE, at)) / 60;
  if (diff === 0) return 'Same time';
  const sign = diff > 0 ? '+' : '−';
  const abs = Math.abs(diff);
  return `${sign}${Number.isInteger(abs) ? abs : abs.toFixed(1)} h from Lagos`;
};

/** Live clock for one place. Isolated so the rest of the section doesn't re-render each second. */
const LocalClock: React.FC<{ zone: string }> = ({ zone }) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  return (
    <span className="reach-clock">
      <span className="reach-time" aria-hidden="true">{time}</span>
      <span className="reach-offset">{hoursFromHome(zone, now)}</span>
    </span>
  );
};

interface GlobalPresenceProps {
  isDarkMode: boolean;
}

const GlobalPresence: React.FC<GlobalPresenceProps> = () => {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const onActive = useCallback((name: string) => setActive(GLOBE_LOCATIONS.findIndex((l) => l.name === name)), []);

  return (
    <section id="reach" aria-labelledby="reach-title" className="section">
      <div className="wrap">
        <div className="reach-stage stage">
          <div className="reach-copy">
            <RevealHeading id="reach-title" className="t-h2 text-white">
              Based in Lagos, working across six countries
            </RevealHeading>
            <RevealText className="reach-lead">
              Most of our work happens remotely, across time zones. We keep hours that overlap with yours and hold
              calls when it suits you.
            </RevealText>

            <ol className="reach-list">
              {LOCATIONS.map((loc, i) => {
                const on = i === active;
                return (
                  <motion.li
                    key={loc.name}
                    className="reach-row"
                    data-active={on}
                    initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
                  >
                    <div className="reach-row-main">
                      <span className="reach-dot" aria-hidden="true" />
                      <div>
                        <div className="reach-name">{loc.name}</div>
                        <div className="reach-city">{loc.city}</div>
                      </div>
                    </div>
                    <LocalClock zone={loc.zone} />
                    {on && !reduceMotion && (
                      <motion.span
                        key={`bar-${i}`}
                        className="reach-bar"
                        aria-hidden="true"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
                      />
                    )}
                  </motion.li>
                );
              })}
            </ol>
          </div>

          <div className="reach-globe" aria-hidden="true">
            <Suspense fallback={null}>
              <RotatingGlobe isDarkMode interval={STEP_MS} locations={GLOBE_LOCATIONS} onActiveLocationChange={onActive} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalPresence;
