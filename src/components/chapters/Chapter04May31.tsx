import React, { useState } from 'react';
import { ArrowRight, Trophy, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sound } from '../../services/soundEffects';
import { ChapterContentBlocksSection } from '../ChapterContentBlocksSection';
import { ContentBlockData } from '../../data/contentBlocks';

interface Chapter04May31Props {
  may31Url?: string;
  onReplaceMay31: () => void;
  onDirectUploadMay31?: (videoDataUrl: string) => void;
  onNext: () => void;
  onTriggerEasterEgg: (eggId: string) => void;
}

const DEFAULT_CH04_BLOCKS: ContentBlockData[] = [
  {
    id: 'ch04-main-video',
    type: 'video',
    title: '31 May 2026 • Our First Time Out Alone',
    subtitle: 'HISTORIC NIGHT',
    body: 'The day we went out just the two of us. Upload our video or photo from that celebration here!',
    mediaKey: 'ADD_31_MAY_PHOTO_HERE',
    aspectRatio: 'auto',
    objectFit: 'contain',
  },
  {
    id: 'ch04-cricket-text',
    type: 'text',
    title: 'RCB Won & I Won You 🏆❤️',
    subtitle: 'UNFORGETTABLE MEMORY',
    body: 'Celebrating like crazy, screaming at every boundary, and realizing I never wanted this evening to end.',
    mediaKey: 'ADD_CH04_EXTRA_MEDIA',
  },
];

export const Chapter04May31: React.FC<Chapter04May31Props> = ({
  may31Url,
  onDirectUploadMay31,
  onNext,
  onTriggerEasterEgg,
}) => {
  const [celebratedCricket, setCelebratedCricket] = useState(false);

  const handleCricketCelebrate = () => {
    sound.playChime();
    setCelebratedCricket(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e6be6d', '#ff3366', '#d4af37', '#ffffff'],
    });
    onTriggerEasterEgg('egg-rcb');
  };

  return (
    <section className="min-h-screen py-16 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col justify-center relative select-none">
      {/* Chapter Tag */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-4"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-[#e6be6d] bg-[#3d0f1b]/60 px-3 py-1 rounded-full border border-[#85182a]/50">
          Chapter 04
        </span>
        <span className="text-xs text-stone-400 font-mono">31 MAY 2026</span>
      </motion.div>

      {/* Date Title */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center space-y-3 mb-8"
      >
        <div className="font-serif-romantic text-4xl sm:text-7xl font-extrabold tracking-tight text-[#faf4ee] glow-text-gold">
          31 MAY 2026
        </div>
        <h2 className="font-serif-romantic text-2xl sm:text-3xl text-[#d4af37]">
          THE TURNING POINT
        </h2>
      </motion.div>

      {/* Cricket Match Celebration Button */}
      <div className="mb-6 flex justify-center">
        <button
          type="button"
          onClick={handleCricketCelebrate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-950 via-[#85182a] to-red-950 border border-[#e6be6d] text-white font-mono text-xs uppercase tracking-wider font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-[#ffd700]" />
          <span>{celebratedCricket ? '🎉 RCB CELEBRATION UNLOCKED!' : 'TAP TO CELEBRATE 31 MAY 🏆'}</span>
        </button>
      </div>

      {/* EDITABLE CONTENT BLOCKS (Photos, Videos, Text) */}
      <ChapterContentBlocksSection
        chapterId="ch04"
        defaultBlocks={DEFAULT_CH04_BLOCKS}
        onUploadMedia={onDirectUploadMay31 ? (k, data) => onDirectUploadMay31(data) : undefined}
        mediaConfig={may31Url ? { ADD_31_MAY_PHOTO_HERE: may31Url } : {}}
      />

      {/* Next Button */}
      <div className="flex justify-end pt-6">
        <button
          onClick={() => {
            sound.playPageTurn();
            onNext();
          }}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#85182a] via-[#a8223b] to-[#85182a] hover:from-[#9c1a32] hover:to-[#be2744] text-white font-serif-romantic font-bold text-base rounded-full shadow-[0_0_25px_rgba(133,24,42,0.45)] hover:shadow-[0_0_35px_rgba(230,190,109,0.5)] transition-all hover:scale-105 cursor-pointer border border-[#e6be6d]/50"
        >
          <span>CONTINUE TO CHAPTER 5</span>
          <ArrowRight className="w-4 h-4 text-[#ffd700] group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
