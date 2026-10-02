import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, BookOpen, Award, CheckCircle2, ChevronRight, Music } from 'lucide-react';
import { sound } from '../services/soundEffects';
import { AudioMessage } from './AudioMessage';
import confetti from 'canvas-confetti';

interface OpeningCinematicProps {
  onStartChapter1: () => void;
  voiceUrl?: string;
  onSaveVoiceUrl?: (url: string) => void;
}

export const OpeningCinematic: React.FC<OpeningCinematicProps> = ({
  onStartChapter1,
  voiceUrl,
  onSaveVoiceUrl,
}) => {
  const [isUnsealed, setIsUnsealed] = useState(false);

  const handleUnseal = () => {
    sound.playEnvelopeOpen();
    setIsUnsealed(true);
    try {
      confetti({
        particleCount: 45,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e6be6d', '#ff7597', '#ffffff', '#ffccd5'],
      });
    } catch {
      // ignore
    }
  };

  const handleBegin = () => {
    sound.playClick();
    sound.playPageTurn();
    onStartChapter1();
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-gradient-to-br from-[#120409] via-[#240715] to-[#0d0208] text-[#fbf6ef] px-4 py-12 overflow-hidden select-none">
      {/* Ambient Luxurious Background Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#85182a]/25 rounded-full blur-[110px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#e6be6d]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3a0614]/30 rounded-full blur-[140px]" />

        {/* Floating golden dust particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#fde047] animate-pulse pointer-events-none"
            style={{
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              top: `${(i * 17) % 100}%`,
              left: `${(i * 23) % 100}%`,
              opacity: (i % 4) * 0.15 + 0.25,
              animationDuration: `${(i % 4) + 2.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Top Header Monogram */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-2 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0d1e]/80 border border-[#e6be6d]/40 shadow-lg text-xs font-mono text-[#e6be6d] tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
            <span>SPECIAL BOYFRIEND DAY EDITION • 2026</span>
          </div>
          <h1 className="font-serif-romantic text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#ffd6e0] to-[#e6be6d] drop-shadow-md">
            Happy Boyfriend Day, Sammm ❤️
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-sans tracking-wide">
            A private storybook handcrafted with all my love, exclusively for you.
          </p>
        </motion.div>

        {/* Luxury Romantic Love Card / Royal Envelope */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#1b0612]/85 backdrop-blur-xl border-2 border-[#e6be6d]/40 rounded-3xl p-6 sm:p-9 shadow-[0_0_50px_rgba(133,24,42,0.35)] relative overflow-hidden"
        >
          {/* Subtle watermark monogram */}
          <div className="absolute right-4 bottom-4 text-7xl font-serif-romantic font-extrabold text-white/[0.03] pointer-events-none select-none">
            S & R
          </div>

          {!isUnsealed ? (
            /* Sealed Envelope Teaser */
            <div className="flex flex-col items-center text-center space-y-6 py-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#85182a] to-[#450817] border-2 border-[#e6be6d] flex items-center justify-center text-3xl shadow-[0_0_35px_rgba(230,190,109,0.5)] cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                onClick={handleUnseal}
              >
                💌
              </div>

              <div className="space-y-2 max-w-md">
                <span className="text-xs font-mono text-[#e6be6d] uppercase tracking-widest font-bold">
                  TAP THE WAX SEAL TO UNSEAL
                </span>
                <p className="font-serif-romantic text-xl sm:text-2xl text-white font-medium">
                  “I poured my whole heart into these chapters for you.”
                </p>
                <p className="text-xs sm:text-sm text-stone-400 font-sans leading-relaxed">
                  From our very first awkward smile on 03 May at the turf, to whispering secrets in elevator mirrors... every single memory is documented here.
                </p>
              </div>

              <button
                onClick={handleUnseal}
                className="px-7 py-3 rounded-full bg-gradient-to-r from-[#85182a] via-[#a8223b] to-[#85182a] text-white font-serif-romantic font-bold text-sm tracking-wide border border-[#e6be6d]/60 shadow-xl hover:shadow-[#85182a]/50 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-[#ff7597] fill-current" />
                <span>UNSEAL YOUR SURPRISE 🔓</span>
              </button>
            </div>
          ) : (
            /* Unsealed Full Letter & VIP Pass */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Personal Letter Excerpt */}
              <div className="space-y-3 border-b border-[#85182a]/40 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#e6be6d] tracking-wider font-bold">
                    DEAR SAMMM,
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    Always & Forever ❤️
                  </span>
                </div>
                <p className="font-serif-romantic text-lg sm:text-xl text-[#fdedee] leading-relaxed italic">
                  “You walked into my life on a quiet turf court on 03 May, and somehow... you became the safest, happiest place I have ever known.
                  Happy Boyfriend Day to my favourite person, my safe space, and my future Dr. Sahab!”
                </p>
                <p className="text-right text-sm font-serif-romantic text-[#e6be6d] font-bold">
                  — Forever Yours, Radhika 💕
                </p>
              </div>

              {/* 3 Cute VIP Badges for Sammm */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#2c0817]/70 border border-[#7a182d]/60 rounded-2xl p-3 text-center space-y-1">
                  <span className="text-xl">🏆</span>
                  <p className="text-xs font-bold text-white font-mono">Best Boyfriend</p>
                  <p className="text-[10px] text-stone-400">Certified 100/10 by Radhika</p>
                </div>
                <div className="bg-[#2c0817]/70 border border-[#7a182d]/60 rounded-2xl p-3 text-center space-y-1">
                  <span className="text-xl">🩺</span>
                  <p className="text-xs font-bold text-[#e6be6d] font-mono">Future Dr. Sammm</p>
                  <p className="text-[10px] text-stone-400">Always your #1 fan</p>
                </div>
                <div className="bg-[#2c0817]/70 border border-[#7a182d]/60 rounded-2xl p-3 text-center space-y-1">
                  <span className="text-xl">♾️</span>
                  <p className="text-xs font-bold text-[#ff7597] font-mono">Valid Lifetime</p>
                  <p className="text-[10px] text-stone-400">No return or exchange 😂</p>
                </div>
              </div>

              {/* Voice Message Box */}
              <div className="bg-[#12030c] border border-[#e6be6d]/30 rounded-2xl p-3.5">
                <AudioMessage
                  voiceUrl={voiceUrl}
                  onSaveVoiceUrl={onSaveVoiceUrl || (() => {})}
                />
              </div>

              {/* Enter Story CTA Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleBegin}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#85182a] via-[#b51e39] to-[#85182a] hover:from-[#9c1832] hover:to-[#c72240] text-white font-serif-romantic font-bold text-base sm:text-lg shadow-[0_0_30px_rgba(181,30,57,0.5)] hover:shadow-[0_0_40px_rgba(230,190,109,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#e6be6d]/60 flex items-center justify-center gap-3"
                >
                  <BookOpen className="w-5 h-5 text-[#ffd700]" />
                  <span>STEP INTO OUR STORYBOOK 📖✨</span>
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
