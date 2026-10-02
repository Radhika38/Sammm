import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Trophy, RotateCcw, Volume2, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sound } from '../services/soundEffects';
import { FinalLetter } from './FinalLetter';
import { OpenWhenSection } from './OpenWhenSection';

interface FinalSurpriseProps {
  onRestart: () => void;
  onTriggerEasterEgg: (eggId: string) => void;
  onOpenOpenWhen?: (envelopeId?: string) => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({ onRestart, onTriggerEasterEgg, onOpenOpenWhen }) => {
  const [readyAnswer, setReadyAnswer] = useState<'prompt' | 'revealed'>('prompt');
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Confetti burst automatically on reaching Chapter 12 (Final Surprise)
  useEffect(() => {
    sound.playChime();

    // Wave 1: Cannons from both bottom corners
    confetti({
      particleCount: 55,
      angle: 60,
      spread: 65,
      origin: { x: 0.05, y: 0.7 },
      colors: ['#e6be6d', '#ff577d', '#ff8da8', '#ffffff', '#85182a'],
    });
    confetti({
      particleCount: 55,
      angle: 120,
      spread: 65,
      origin: { x: 0.95, y: 0.7 },
      colors: ['#e6be6d', '#ff577d', '#ff8da8', '#ffffff', '#85182a'],
    });

    // Wave 2: Cascading golden shower from above
    const timer = setTimeout(() => {
      confetti({
        particleCount: 85,
        spread: 95,
        origin: { x: 0.5, y: 0.25 },
        colors: ['#ffd700', '#ff7597', '#ffffff', '#e6be6d'],
      });
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleNoHoverOrClick = () => {
    sound.playClick();
    setNoCount((c) => c + 1);
    const randomX = (Math.random() - 0.5) * 160;
    const randomY = (Math.random() - 0.5) * 120;
    setNoPosition({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    sound.playChime();
    sound.playHeartbeat();
    setReadyAnswer('revealed');

    // Trigger high-end gold and rose heart confetti
    const end = Date.now() + 4 * 1000;
    const colors = ['#e6be6d', '#ff577d', '#d4af37', '#ffffff', '#85182a'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleEasterEggHeart = () => {
    sound.playChime();
    onTriggerEasterEgg('egg-heart');
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ff3366', '#ff8da8', '#e6be6d'],
    });
  };

  const timelineDates = [
    { date: '03 MAY', label: 'We met. (Pickleball)' },
    { date: '10 MAY', label: 'Mahudi + Bhavnath. (Shy boy era)' },
    { date: '31 MAY', label: 'You stayed. (RCB Won ❤️)' },
    { date: '02 JUNE', label: 'Our first movie. (Obsession)' },
    { date: '27 JULY', label: '“I love you.”' },
    { date: 'TODAY & FOREVER', label: 'US ❤️' },
  ];

  return (
    <section className="min-h-screen py-16 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col justify-center relative select-none">
      {readyAnswer === 'prompt' ? (
        /* ARE YOU REALLY READY? */
        <div className="bg-[#090508] border border-stone-800 rounded-3xl p-8 sm:p-14 text-center space-y-8 max-w-xl mx-auto w-full shadow-2xl animate-fade-in relative">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
              One Last Thing...
            </span>
            <p className="font-serif-romantic text-2xl sm:text-3xl text-stone-300">
              “Wait…”
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-serif-romantic text-3xl sm:text-5xl font-black text-white glow-text-gold"
            >
              ARE YOU REALLY READY?
            </motion.h2>
          </motion.div>

          <div className="flex items-center justify-center gap-6 pt-6 relative min-h-[100px]">
            <button
              onClick={handleYesClick}
              className="px-9 py-4 rounded-full bg-gradient-to-r from-[#85182a] to-[#ab223c] text-white font-bold text-lg shadow-xl hover:shadow-[#85182a]/50 transition-all hover:scale-110 cursor-pointer border border-[#e6be6d]"
            >
              YES ❤️
            </button>

            <button
              onMouseEnter={handleNoHoverOrClick}
              onClick={handleNoHoverOrClick}
              style={{
                transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                transition: 'transform 0.15s ease-out',
              }}
              className="px-7 py-3 rounded-full bg-stone-900 border border-stone-700 text-stone-400 font-medium text-sm hover:border-stone-500 cursor-pointer"
            >
              {noCount > 0 ? (noCount % 2 === 0 ? 'Not an option! 😂' : 'Nice try 😂') : 'NO'}
            </button>
          </div>
        </div>
      ) : (
        /* FINAL GRAND CINEMATIC REVEAL */
        <div className="space-y-16 animate-fade-in text-center my-auto py-8">
          {/* Quick Dates Timeline Montage */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <span className="text-xs font-mono text-[#e6be6d] uppercase tracking-widest block font-bold">
              OUR COMPLETE STORY IN RETROSPECT
            </span>

            <div className="max-w-md mx-auto space-y-3">
              {timelineDates.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full bg-[#1e0e17] border border-[#6b1b2d] rounded-2xl p-4 flex items-center justify-between shadow-lg">
                    <span className="font-mono text-sm sm:text-base font-bold text-[#e6be6d]">
                      {item.date}
                    </span>
                    <span className="text-xs sm:text-sm text-stone-200 font-serif-romantic font-semibold">
                      {item.label}
                    </span>
                  </div>
                  {idx < timelineDates.length - 1 && (
                    <ArrowDown className="w-4 h-4 text-[#ff577d]/60 my-1 animate-bounce" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Deep Dark Emotional Climax */}
          <div className="space-y-8 max-w-2xl mx-auto bg-[#070407] border-2 border-[#85182a] rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
            {/* Hidden Easter Egg Clickable Heart */}
            <button
              onClick={handleEasterEggHeart}
              className="absolute top-4 right-4 p-2 text-rose-500/40 hover:text-rose-500 transition-colors cursor-pointer group"
              title="A secret heart for you"
            >
              <Heart className="w-6 h-6 fill-current group-hover:scale-125 transition-transform" />
            </button>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <p className="font-serif-romantic text-2xl sm:text-3xl text-stone-300 italic leading-relaxed">
                “I don’t know exactly when you became my person…”
              </p>

              <p className="font-serif-romantic text-3xl sm:text-4xl text-[#faf2ea] font-semibold">
                “But I’m really glad you did.”
              </p>

              <div className="py-6 space-y-3">
                <h1 className="font-serif-romantic text-4xl sm:text-7xl font-black text-[#e6be6d] tracking-wide glow-text-gold uppercase">
                  I LOVE YOU, SAMMM. ❤️
                </h1>

                <span className="font-mono text-sm sm:text-lg uppercase tracking-widest text-[#ff8da8] block font-bold">
                  HAPPY BOYFRIEND DAY
                </span>
              </div>
            </motion.div>

            {/* Closing Punchline */}
            <div className="pt-8 border-t border-[#4d1323] space-y-2">
              <p className="font-handwriting text-2xl sm:text-3xl text-stone-300">
                “From the girl who kept trying to make the shy boy talk…”
              </p>
              <p className="font-handwriting text-2xl sm:text-3xl text-[#ff8da8] font-bold">
                “…to the girl who now can’t stop talking to him. 😂❤️”
              </p>
            </div>
          </div>

          {/* Heartfelt Final Letter from Radhika to Sammm */}
          <FinalLetter />

          {/* "Open When..." Digital Envelope Bundle for Sammm */}
          {onOpenOpenWhen && (
            <OpenWhenSection onOpenEnvelope={(id) => onOpenOpenWhen(id)} />
          )}

          {/* Replay action */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                sound.playClick();
                onRestart();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#200e18] hover:bg-[#381426] text-xs font-mono uppercase tracking-wider text-stone-300 border border-[#85182a] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#e6be6d]" />
              <span>Replay Our Story From The Start</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
