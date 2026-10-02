import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LuminousParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  type: 'sparkle' | 'heart' | 'mote' | 'petal';
  color: string;
  glowColor: string;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  maxLife: number;
}

const WARM_PALETTE = [
  { color: '#fef08a', glow: 'rgba(254, 240, 138, 0.65)' }, // Warm Champagne
  { color: '#ffd700', glow: 'rgba(255, 215, 0, 0.6)' },    // Pure Gold
  { color: '#fbcfe8', glow: 'rgba(251, 207, 232, 0.55)' }, // Soft Blush
  { color: '#fda4af', glow: 'rgba(253, 164, 175, 0.6)' },  // Rose Petal
  { color: '#fed7aa', glow: 'rgba(254, 215, 170, 0.55)' }, // Warm Amber Candlelight
];

export const InteractiveSparklesOverlay: React.FC = () => {
  const [particles, setParticles] = useState<LuminousParticle[]>([]);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTime = useRef<number>(0);
  const idGen = useRef<number>(0);

  const spawnParticles = useCallback((
    clientX: number,
    clientY: number,
    count = 1,
    burst = false,
    speedX = 0,
    speedY = 0
  ) => {
    const newItems: LuminousParticle[] = [];
    const types: ('sparkle' | 'heart' | 'mote' | 'petal')[] = ['sparkle', 'mote', 'sparkle', 'heart', 'petal'];

    for (let i = 0; i < count; i++) {
      idGen.current += 1;
      const palette = WARM_PALETTE[Math.floor(Math.random() * WARM_PALETTE.length)];
      const type = types[Math.floor(Math.random() * types.length)];

      let vx: number;
      let vy: number;
      let size: number;

      if (burst) {
        // Radial burst on click with natural velocity spread
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = 25 + Math.random() * 45;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed - 15; // slightly upward bias
        size = type === 'heart' ? 10 + Math.random() * 5 : 6 + Math.random() * 6;
      } else {
        // Natural trailing wake from mouse movement
        const jitter = (Math.random() - 0.5) * 12;
        vx = speedX * 0.15 + jitter;
        vy = -12 - Math.random() * 18 + speedY * 0.1; // gentle thermal rise
        size = type === 'heart' ? 9 + Math.random() * 4 : 5 + Math.random() * 5;
      }

      newItems.push({
        id: `p_${idGen.current}_${Date.now()}`,
        x: clientX + (Math.random() - 0.5) * 6,
        y: clientY + (Math.random() - 0.5) * 6,
        size,
        type,
        color: palette.color,
        glowColor: palette.glow,
        vx,
        vy,
        rotation: (Math.random() - 0.5) * 45,
        vr: (Math.random() - 0.5) * 35,
        maxLife: burst ? 0.95 + Math.random() * 0.35 : 0.75 + Math.random() * 0.3,
      });
    }

    setParticles((prev) => {
      // Keep at most 20 particles for silky 60fps and clutter-free natural beauty
      const combined = [...prev, ...newItems];
      return combined.slice(-20);
    });
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - lastTime.current;

      // Throttle movement spawn to once every 85ms for smooth cadence
      if (dt > 85) {
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Only spawn if mouse is actually moving smoothly
        if (dist > 6) {
          spawnParticles(e.clientX, e.clientY, 1, false, dx / dt, dy / dt);
          lastPos.current = { x: e.clientX, y: e.clientY };
          lastTime.current = now;
        }
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      // Gentle warm burst of 5 delicate particles on tap/click
      spawnParticles(e.clientX, e.clientY, 5, true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const now = performance.now();
      if (e.touches.length > 0 && now - lastTime.current > 100) {
        const touch = e.touches[0];
        spawnParticles(touch.clientX, touch.clientY, 1, false);
        lastTime.current = now;
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [spawnParticles]);

  const removeParticle = (id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 0,
              scale: 0.3,
              x: p.x,
              y: p.y,
              rotate: 0,
            }}
            animate={{
              opacity: [0, 0.95, 0.8, 0],
              scale: [0.4, 1.15, 0.9, 0.3],
              x: p.x + p.vx,
              y: p.y + p.vy,
              rotate: p.rotation + p.vr,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.maxLife,
              ease: [0.22, 1, 0.36, 1], // Natural smooth deceleration curve
            }}
            onAnimationComplete={() => removeParticle(p.id)}
            style={{
              position: 'absolute',
              width: `${p.size * 2}px`,
              height: `${p.size * 2}px`,
              marginLeft: `-${p.size}px`,
              marginTop: `-${p.size}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: `drop-shadow(0 0 ${p.size * 1.2}px ${p.glowColor})`,
            }}
          >
            {p.type === 'sparkle' && (
              // 4-Point Diamond Sparkle Star (Crisp, elegant, zero-slop)
              <svg
                viewBox="0 0 24 24"
                width={p.size * 1.8}
                height={p.size * 1.8}
                className="overflow-visible"
              >
                <path
                  d="M12 0 C12 7 17 12 24 12 C17 12 12 17 12 24 C12 17 7 12 0 12 C7 12 12 7 12 0 Z"
                  fill={p.color}
                />
              </svg>
            )}

            {p.type === 'heart' && (
              // Delicate miniature soft silhouette heart
              <svg
                viewBox="0 0 24 24"
                width={p.size * 1.5}
                height={p.size * 1.5}
                className="overflow-visible"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill={p.color}
                  fillOpacity={0.9}
                />
              </svg>
            )}

            {p.type === 'mote' && (
              // Glowing circular stardust mote
              <div
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  borderRadius: '50%',
                  backgroundColor: p.color,
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                }}
              />
            )}

            {p.type === 'petal' && (
              // Soft drifting floral petal mote
              <div
                style={{
                  width: `${p.size * 1.2}px`,
                  height: `${p.size * 0.7}px`,
                  borderRadius: '100% 0 100% 0',
                  backgroundColor: p.color,
                  transform: 'rotate(45deg)',
                  boxShadow: `0 0 ${p.size}px ${p.glowColor}`,
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
