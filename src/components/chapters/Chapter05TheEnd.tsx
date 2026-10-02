import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { sound } from '../../services/soundEffects';
import { ChapterContentBlocksSection } from '../ChapterContentBlocksSection';
import { ContentBlockData } from '../../data/contentBlocks';

interface Chapter05TheEndProps {
  onNext: () => void;
}

const DEFAULT_CH05_BLOCKS: ContentBlockData[] = [
  {
    id: 'ch05-truth-block',
    type: 'text',
    title: 'When The Fog Cleared & Old Chapters Ended',
    subtitle: 'THE TURNING POINT',
    body: 'When old chapters closed, there was one person who had not suddenly appeared out of nowhere... you were already right there by my side.',
    mediaKey: 'ADD_CH05_MEDIA_1',
  },
  {
    id: 'ch05-already-there',
    type: 'text',
    title: '“You Were Already There.”',
    subtitle: 'MY STEADY LIGHT',
    body: 'Quietly checking in on me, waiting patiently, and being my safe harbor before I even realized it.',
    mediaKey: 'ADD_CH05_MEDIA_2',
  },
];

export const Chapter05TheEnd: React.FC<Chapter05TheEndProps> = ({ onNext }) => {
  const [revealedLight, setRevealedLight] = useState(false);

  return (
    <section className="min-h-screen py-16 px-4 sm:px-8 max-w-3xl mx-auto flex flex-col justify-center relative select-none">
      {/* Chapter Tag */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-4"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-[#e6be6d] bg-[#3d0f1b]/60 px-3 py-1 rounded-full border border-[#85182a]/50">
          Chapter 05
        </span>
        <span className="text-xs text-stone-500 font-mono">Turning Point</span>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center space-y-3 mb-8"
      >
        <h2 className="font-serif-romantic text-3xl sm:text-5xl font-extrabold text-[#ede6dc]">
          “The Turning of the Tide”
        </h2>
        <p className="text-xs font-mono text-[#e6be6d] uppercase tracking-widest">
          When the fog cleared and truth appeared
        </p>
      </motion.div>

      {/* Interactive Candle Light Reveal */}
      <div className="mb-6 flex flex-col items-center">
        <button
          type="button"
          onClick={() => {
            sound.playHeartbeat();
            setRevealedLight(!revealedLight);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1e0a12] border border-[#85182a] text-[#ffd700] text-xs font-mono uppercase tracking-wider hover:bg-[#300f1d] transition-all cursor-pointer shadow-lg hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
          <span>{revealedLight ? 'Glow Active ✨' : 'Tap to reveal the single light 🕯️'}</span>
        </button>

        {revealedLight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-center space-y-2"
          >
            <div className="w-16 h-16 rounded-full bg-[#e6be6d]/20 border border-[#e6be6d] mx-auto flex items-center justify-center text-3xl shadow-[0_0_50px_#e6be6d] animate-pulse">
              🕯️
            </div>
            <p className="font-serif-romantic text-2xl text-white font-semibold">
              “You were already there.”
            </p>
          </motion.div>
        )}
      </div>

      {/* EDITABLE CONTENT BLOCKS (Photos, Videos, Text) */}
      <ChapterContentBlocksSection
        chapterId="ch05"
        defaultBlocks={DEFAULT_CH05_BLOCKS}
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
          <span>CONTINUE TO CHAPTER 6</span>
          <ArrowRight className="w-4 h-4 text-[#ffd700] group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
