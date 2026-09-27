import React, { Suspense, lazy, useState } from 'react';
import type { GlobeLocation } from '../UI/RotatingGlobe';

// three.js is heavy; load it only when this section renders.
const RotatingGlobe = lazy(() => import('../UI/RotatingGlobe'));

const GLOBAL_LOCATIONS: GlobeLocation[] = [
  { name: 'Nigeria', lat: 9.082, lon: 8.6753 },
  { name: 'United Kingdom', lat: 55.3781, lon: -3.436 },
  { name: 'United States', lat: 37.0902, lon: -95.7129 },
  { name: 'UAE', lat: 23.4241, lon: 53.8478 },
  { name: 'India', lat: 20.5937, lon: 78.9629 },
  { name: 'Australia', lat: -31.9535, lon: 115.857 },
];

interface GlobalPresenceProps {
  isDarkMode: boolean;
}

const GlobalPresence: React.FC<GlobalPresenceProps> = ({ isDarkMode }) => {
  const [activeLocation, setActiveLocation] = useState(GLOBAL_LOCATIONS[0].name);

  return (
    <section id="reach" aria-labelledby="reach-title" className="section">
      <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        <div>
          <h2 id="reach-title" className="t-h2">Based in Lagos, working across six countries</h2>
          <p className="t-body mt-5">
            Most of our work happens remotely, across time zones. We keep hours that overlap with yours and
            hold calls when it suits you.
          </p>
          <ul className="list-none m-0 p-0 mt-10 border-t border-[var(--line)]">
            {GLOBAL_LOCATIONS.map((location) => {
              const active = location.name === activeLocation;
              return (
                <li
                  key={location.name}
                  className="flex items-center justify-between py-3 border-b border-[var(--line)] transition-colors duration-300"
                  style={{ color: active ? 'var(--ink)' : 'var(--ink-3)' }}
                >
                  <span className={active ? 'font-semibold' : ''}>{location.name}</span>
                  <span
                    aria-hidden="true"
                    className="w-2 h-2 rounded-full transition-opacity duration-300"
                    style={{ background: 'var(--ochre)', opacity: active ? 1 : 0 }}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        <div className="aspect-square w-full max-w-[520px] mx-auto" aria-hidden="true">
          <Suspense fallback={null}>
            <RotatingGlobe
              isDarkMode={isDarkMode}
              locations={GLOBAL_LOCATIONS}
              onActiveLocationChange={setActiveLocation}
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default GlobalPresence;
