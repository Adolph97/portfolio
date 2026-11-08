import React, { useId } from 'react';

/**
 * A fine grid of dots, drawn in currentColor so the parent sets the tint.
 * It's the site's background texture: a quiet coordinate plane for the rising arrow.
 */
const DotGrid: React.FC<{ className?: string; pitch?: number; radius?: number; style?: React.CSSProperties }> = ({
  className = '',
  pitch = 32,
  radius = 1.2,
  style,
}) => {
  const id = useId().replace(/:/g, '');
  const c = pitch / 2;
  return (
    <svg className={className} style={style} width="100%" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`dots-${id}`} width={pitch} height={pitch} patternUnits="userSpaceOnUse">
          <circle cx={c} cy={c} r={radius} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#dots-${id})`} />
    </svg>
  );
};

export default DotGrid;
