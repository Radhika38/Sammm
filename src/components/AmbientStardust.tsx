import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FireflyMote {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number; // px
  blur: number; // px
  driftX: number; // offset px
  driftY: number; // offset px
  duration: number; // seconds
  delay: number; // seconds
  peakOpacity: number;
  color: string;
}

const WARM_CANDLE_PALETTE = [
  '#fde047', // Warm Amber Gold
  '#fef08a', // Champagne Light
  '#fca5a5', // Soft Warm Rose
  '#fbcfe8', // Pastel Peony
  '#fef3c7', // Soft Ivory
];

const MIDNIGHT_SILVER_PALETTE = [
  '#cbd5e1', // Cool Silver
  '#e2e8f0', // Starlight White
  '#93c5fd', // Moonlit Sky Blue
  '#bae6fd', // Icy Silver
  '#ffffff', // Diamond Shimmer
];

interface AmbientStardustProps {
  midnightMode?: boolean;
}

export const AmbientStardust: React.FC<AmbientStardustProps> = ({ midnightMode = false }) => {
  // Precompute 24 peaceful organic light motes with multi-depth parallax
  const motes = useMemo<FireflyMote[]>(() => {
    const palette = midnightMode ? MIDNIGHT_SILVER_PALETTE : WARM_CANDLE_PALETTE;
    return Array.from({ length: 24 }, (_, i) => {
      const isForeground = i % 6 === 0;
      const isTiny = i % 3 === 0;

      const size = isForeground ? 5.5 + Math.random() * 3 : isTiny ? 2 + Math.random() * 1.5 : 3.5 + Math.random() * 2;
      const blur = isForeground ? 3 + Math.random() * 2 : isTiny ? 0 : 1;
      const peakOpacity = isForeground ? 0.25 + Math.random() * 0.15 : isTiny ? 0.35 + Math.random() * 0.25 : 0.45 + Math.random() * 0.3;

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        blur,
        driftX: (Math.random() - 0.5) * 60,
        driftY: -40 - Math.random() * 70, // gentle natural thermal drift upward
        duration: 14 + Math.random() * 16,
        delay: Math.random() * 10,
        peakOpacity,
        color: palette[i % palette.length],
      };
    });
  }, [midnightMode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {motes.map((m) => (
        <motion.div
          key={m.id}
          className="absolute rounded-full"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            backgroundColor: m.color,
            filter: m.blur > 0 ? `blur(${m.blur}px)` : undefined,
            boxShadow: `0 0 ${m.size * 2.5}px ${m.color}`,
          }}
          animate={{
            y: [0, m.driftY * 0.5, m.driftY, 0],
            x: [0, m.driftX, m.driftX * 0.5, 0],
            opacity: [0, m.peakOpacity, m.peakOpacity * 0.4, m.peakOpacity * 0.9, 0],
            scale: [0.8, 1.25, 0.9, 1.1, 0.8],
          }}
          transition={{
            duration: m.duration,
            repeat: Infinity,
            delay: m.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
