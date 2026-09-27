import React, { useId } from 'react';

/**
 * A repeating tile inspired by adire eleko cloth: a grid of squares,
 * each resist-painted with a different motif (rings, dots, stripes, zigzags).
 * Strokes use currentColor so the parent sets the tint.
 */
const AdirePattern: React.FC<{ className?: string; tile?: number }> = ({ className = '', tile = 120 }) => {
  const id = useId().replace(/:/g, '');
  const half = tile / 2;

  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`adire-${id}`} width={tile} height={tile} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            {/* Cell borders */}
            <path d={`M0 0H${tile}M0 ${half}H${tile}M0 0V${tile}M${half} 0V${tile}`} strokeWidth="1" />

            {/* Top-left: concentric rings */}
            <circle cx={half / 2} cy={half / 2} r={half * 0.36} />
            <circle cx={half / 2} cy={half / 2} r={half * 0.24} />
            <circle cx={half / 2} cy={half / 2} r={half * 0.1} fill="currentColor" />

            {/* Top-right: dot grid */}
            <g fill="currentColor" stroke="none">
              {[0, 1, 2, 3].flatMap((r) =>
                [0, 1, 2, 3].map((c) => (
                  <circle key={`${r}-${c}`} cx={half + half * (0.2 + c * 0.2)} cy={half * (0.2 + r * 0.2)} r={1.9} />
                ))
              )}
            </g>

            {/* Bottom-left: diagonal stripes */}
            {[0.15, 0.35, 0.55, 0.75].map((t) => (
              <path key={t} d={`M${half * t} ${tile - half * 0.1}L${half * (t + 0.2)} ${half + half * 0.1}`} />
            ))}

            {/* Bottom-right: stacked zigzags */}
            {[0.3, 0.5, 0.7].map((t) => {
              const y = half + half * t;
              const x0 = half + half * 0.12;
              const step = (half * 0.76) / 6;
              let d = `M${x0} ${y}`;
              for (let i = 1; i <= 6; i++) d += `L${x0 + step * i} ${y + (i % 2 ? -5 : 5) * 0.9}`;
              return <path key={t} d={d} />;
            })}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#adire-${id})`} />
    </svg>
  );
};

export default AdirePattern;
