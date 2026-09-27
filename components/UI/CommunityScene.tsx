import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

const SKIN = ['#7a4a2e', '#5a3522', '#8d5a3b'];
const HAIR = '#16110e';
const PANTS = '#22324a';

const rise = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease } },
});

const pop = (delay: number) => ({
  hidden: { opacity: 0, scale: 0.4 },
  shown: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 18, delay } },
});

const drawLine = (delay: number) => ({
  hidden: { pathLength: 0, opacity: 0 },
  shown: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 1.2, delay, ease }, opacity: { duration: 0.2, delay } } },
});

const box = { transformBox: 'fill-box' as const };

/**
 * Three developers, linked: one typing, one waving, one pointing at shared code.
 * Flat, Humaaans-style figures in the site palette; they assemble when scrolled into view.
 */
const CommunityScene: React.FC<{ className?: string; live?: boolean }> = ({ className, live = true }) => {
  const reduce = useReducedMotion();
  const animateLoops = live && !reduce;
  const link1 = 'M110 146 C 160 70, 230 70, 270 122';
  const link2 = 'M290 118 C 320 96, 330 96, 338 104';

  return (
    <motion.svg
      viewBox="0 0 520 360"
      className={className}
      role="img"
      aria-label="Illustration of three developers working together: one typing on a laptop, one waving, one pointing at shared code."
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
    >
      {/* Ground */}
      <motion.path d="M24 322 H496" stroke="var(--line)" strokeWidth={2} strokeLinecap="round" fill="none" variants={drawLine(0)} />

      {/* Connections between people */}
      <motion.path d={link1} stroke="var(--indigo)" strokeWidth={1.8} strokeDasharray="3 6" strokeLinecap="round" fill="none" variants={drawLine(0.9)} />
      <motion.path d={link2} stroke="var(--indigo)" strokeWidth={1.8} strokeDasharray="3 6" strokeLinecap="round" fill="none" variants={drawLine(1.1)} />
      {animateLoops && (
        <motion.circle r={4.5} style={{ fill: 'var(--ochre)' }} variants={pop(1.6)}>
          <animateMotion dur="3.2s" repeatCount="indefinite" path={link1} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
        </motion.circle>
      )}

      {/* Person A: sitting, typing */}
      <motion.g variants={rise(0.15)}>
        <rect x={78} y={262} width={68} height={9} rx={4.5} fill="var(--ink-3)" opacity={0.5} />
        <path d="M86 271 V320 M138 271 V320" stroke="var(--ink-3)" strokeOpacity={0.5} strokeWidth={4} strokeLinecap="round" />
        <path d="M98 256 L140 256 L140 312" stroke={PANTS} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx={148} cy={316} rx={13} ry={5.5} fill="var(--ink)" />
        <rect x={82} y={194} width={42} height={70} rx={19} style={{ fill: 'var(--indigo)' }} />
        <rect x={97} y={182} width={12} height={16} rx={4} fill={SKIN[0]} />
        <circle cx={103} cy={160} r={22} fill={HAIR} />
        <circle cx={103} cy={170} r={17} fill={SKIN[0]} />
        {/* Laptop */}
        <path d="M134 212 L174 204 L179 246 L139 252 Z" fill="#c9d2de" />
        <motion.path
          d="M143 222 l16 -3 M145 230 l22 -4 M147 238 l12 -2"
          stroke="var(--indigo)"
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
          animate={animateLoops ? { opacity: [0.35, 1, 0.35] } : undefined}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <path d="M128 256 L181 249" stroke="#9aa6b6" strokeWidth={5} strokeLinecap="round" />
        <motion.g
          style={{ ...box, transformOrigin: '0% 0%' }}
          animate={animateLoops ? { rotate: [0, -4, 0, -3, 0] } : undefined}
          transition={{ duration: 0.9, repeat: Infinity }}
        >
          <path d="M116 208 L141 244" stroke="var(--indigo)" strokeWidth={12} strokeLinecap="round" fill="none" style={{ stroke: 'var(--indigo)' }} />
          <circle cx={143} cy={247} r={5.5} fill={SKIN[0]} />
        </motion.g>
      </motion.g>

      {/* Chat bubble above A: typing dots */}
      <motion.g variants={pop(0.9)} style={{ ...box, transformOrigin: '20% 100%' }}>
        <path d="M38 92 h82 a14 14 0 0 1 14 14 v16 a14 14 0 0 1 -14 14 h-56 l-12 12 v-12 h-14 a14 14 0 0 1 -14 -14 v-16 a14 14 0 0 1 14 -14 z" style={{ fill: 'var(--indigo)' }} />
        {[62, 78, 94].map((cx, i) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy={114}
            r={4}
            fill="var(--paper)"
            animate={animateLoops ? { y: [0, -4, 0] } : undefined}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </motion.g>

      {/* Person B: standing, waving */}
      <motion.g variants={rise(0.3)}>
        <path d="M262 252 L257 314 M280 252 L286 314" stroke={PANTS} strokeWidth={16} strokeLinecap="round" fill="none" />
        <ellipse cx={252} cy={317} rx={12} ry={5} fill="var(--ink)" />
        <ellipse cx={292} cy={317} rx={12} ry={5} fill="var(--ink)" />
        <path d="M250 188 L238 238" stroke="var(--ochre)" strokeWidth={13} strokeLinecap="round" style={{ stroke: 'var(--ochre)' }} />
        <circle cx={237} cy={242} r={6} fill={SKIN[1]} />
        <rect x={246} y={168} width={48} height={88} rx={22} style={{ fill: 'var(--ochre)' }} />
        <rect x={264} y={156} width={12} height={16} rx={4} fill={SKIN[1]} />
        <circle cx={270} cy={142} r={18} fill={SKIN[1]} />
        <path d="M252 140 a18 18 0 0 1 36 0 c-6 -4 -14 -6 -18 -6 s-12 2 -18 6 z" fill={HAIR} />
        <motion.g
          style={{ transformBox: 'view-box', transformOrigin: '290px 184px' }}
          animate={animateLoops ? { rotate: [-6, 14, -6] } : undefined}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M290 184 L318 148" stroke="var(--ochre)" strokeWidth={13} strokeLinecap="round" style={{ stroke: 'var(--ochre)' }} />
          <circle cx={321} cy={143} r={6.5} fill={SKIN[1]} />
        </motion.g>
      </motion.g>

      {/* Person C: pointing at shared code */}
      <motion.g variants={rise(0.45)}>
        <path d="M414 256 L410 314 M430 256 L436 314" stroke={PANTS} strokeWidth={16} strokeLinecap="round" fill="none" />
        <ellipse cx={405} cy={317} rx={12} ry={5} fill="var(--ink)" />
        <ellipse cx={442} cy={317} rx={12} ry={5} fill="var(--ink)" />
        <path d="M440 194 L452 244" stroke="var(--ink)" strokeWidth={12} strokeLinecap="round" style={{ stroke: 'var(--ink)' }} />
        <circle cx={453} cy={248} r={6} fill={SKIN[2]} />
        <rect x={398} y={176} width={46} height={82} rx={20} style={{ fill: 'var(--ink)' }} />
        <rect x={415} y={164} width={12} height={16} rx={4} fill={SKIN[2]} />
        <circle cx={421} cy={150} r={17} fill={SKIN[2]} />
        {/* Gele (head wrap) in adire blue */}
        <path d="M398 144 C 398 118, 444 118, 444 144 C 436 136, 406 136, 398 144 Z" style={{ fill: 'var(--indigo)' }} />
        <circle cx={440} cy={128} r={7} style={{ fill: 'var(--indigo)' }} />
        <path d="M402 192 L380 150" stroke="var(--ink)" strokeWidth={12} strokeLinecap="round" style={{ stroke: 'var(--ink)' }} />
        <circle cx={377} cy={144} r={6} fill={SKIN[2]} />
      </motion.g>

      {/* Shared code card */}
      <motion.g variants={pop(0.75)} style={{ ...box, transformOrigin: '30% 100%' }}>
        <motion.g animate={animateLoops ? { y: [0, -6, 0] } : undefined} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          <rect x={330} y={40} width={132} height={84} rx={12} style={{ fill: 'var(--surface)', stroke: 'var(--line)' }} strokeWidth={1.5} />
          {[346, 356, 366].map((cx) => (
            <circle key={cx} cx={cx} cy={54} r={3} style={{ fill: 'var(--line)' }} />
          ))}
          {[
            [346, 74, 44, 'var(--indigo)'],
            [356, 88, 62, 'var(--ink-3)'],
            [356, 102, 38, 'var(--ochre)'],
          ].map(([x, y, w, c], i) => (
            <motion.path
              key={i}
              d={`M${x} ${y} h${w}`}
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
              style={{ stroke: c as string }}
              variants={drawLine(1.1 + i * 0.2)}
            />
          ))}
        </motion.g>
      </motion.g>

      {/* A small spark above B: the "10x" moment */}
      <motion.g variants={pop(1.3)} style={{ ...box, transformOrigin: 'center' }}>
        <motion.g
          style={{ ...box, transformOrigin: 'center' }}
          animate={animateLoops ? { rotate: [0, 90, 180] } : undefined}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M226 84 v18 M217 93 h18" stroke="var(--ochre)" strokeWidth={3} strokeLinecap="round" style={{ stroke: 'var(--ochre)' }} />
        </motion.g>
      </motion.g>
    </motion.svg>
  );
};

export default CommunityScene;
