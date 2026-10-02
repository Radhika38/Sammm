import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingHeart {
  id: string;
  left: number; // percentage (0 - 100)
  size: number; // in pixels
  color: string;
  duration: number; // seconds
  delay: number; // seconds
  sway: number; // horizontal drift amount in px
  rotation: number; // degrees
  scale: number;
}

interface FloatingHeartsTransitionProps {
  currentChapter: number;
}

const HEART_PALETTE = [
  '#ff7597', // Romantic Rose
  '#ff8da8', // Soft Petal Pink
  '#e6be6d', // Warm Champagne Gold
  '#f43f5e', // Deep Passion Ruby
  '#fb7185', // Coral Blush
  '#fda4af', // Delicate Whisper Pink
  '#fbcfe8', // Pastel Cotton Pink
];

export const FloatingHeartsTransition: React.FC<FloatingHeartsTransitionProps> = ({ currentChapter }) => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const isInitialMount = useRef(true);
  const prevChapter = useRef(currentChapter);

  useEffect(() => {
    // If it's the very first render, don't trigger unless desired, or trigger a lighter intro
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevChapter.current = currentChapter;
      return;
    }

    // Only trigger when chapter actually changes
    if (prevChapter.current === currentChapter) {
      return;
    }
    prevChapter.current = currentChapter;

    // Generate 14 - 18 random floating hearts
    const heartCount = 15 + Math.floor(Math.random() * 5);
    const now = Date.now();

    const newHearts: FloatingHeart[] = Array.from({ length: heartCount }).map((_, i) => {
      const size = 14 + Math.floor(Math.random() * 16); // 14px to 30px
      const color = HEART_PALETTE[Math.floor(Math.random() * HEART_PALETTE.length)];
      const left = 5 + Math.random() * 90; // 5% to 95%
      const duration = 4.0 + Math.random() * 2.8; // 4.0s - 6.8s
      const delay = Math.random() * 0.9; // staggered up to 0.9s
      const sway = (Math.random() - 0.5) * 60; // -30px to +30px drift
      const rotation = (Math.random() - 0.5) * 50; // -25deg to +25deg
      const scale = 0.8 + Math.random() * 0.4;

      return {
        id: `heart-${now}-${i}`,
        left,
        size,
        color,
        duration,
        delay,
        sway,
        rotation,
        scale,
      };
    });

    setHearts((prev) => [...prev, ...newHearts]);

    // Clean up hearts after they have finished floating off screen
    const cleanupTimer = setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 7800);

    return () => clearTimeout(cleanupTimer);
  }, [currentChapter]);

  if (hearts.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{
              opacity: 0,
              y: 0,
              x: 0,
              rotate: 0,
              scale: h.scale * 0.6,
            }}
            animate={{
              opacity: [0, 0.75, 0.85, 0.5, 0],
              y: -window.innerHeight - 80,
              x: [0, h.sway * 0.5, -h.sway, h.sway * 0.8, 0],
              rotate: [0, h.rotation * 0.5, -h.rotation, h.rotation],
              scale: [h.scale * 0.6, h.scale, h.scale * 1.1, h.scale],
            }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              ease: [0.25, 0.1, 0.25, 1], // smooth romantic drift
            }}
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: `${h.left}%`,
              filter: `drop-shadow(0 2px 8px ${h.color}66)`,
            }}
          >
            <svg
              width={h.size}
              height={h.size}
              viewBox="0 0 24 24"
              fill={h.color}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="0.8"
              className="transform -translate-x-1/2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
