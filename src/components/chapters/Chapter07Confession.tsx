import React, { useState } from 'react';
import { ArrowRight, Heart, Moon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { sound } from '../../services/soundEffects';
import { ChapterContentBlocksSection } from '../ChapterContentBlocksSection';
import { ContentBlockData } from '../../data/contentBlocks';

interface Chapter07ConfessionProps {
  onNext: () => void;
  onTriggerEasterEgg: (eggId: string) => void;
}

const DEFAULT_CH07_BLOCKS: ContentBlockData[] = [
  {
    id: 'ch07-confession-text',
    type: 'text',
    title: '27 July 2026 • The Confession ❤️',
    subtitle: 'OFFICIAL DATE',
    body: 'When you finally took a deep breath, gave up pretending, and confessed what I had secretly known for months. The best plot twist ever.',
    mediaKey: 'ADD_CONFESSION_MEDIA_1',
  },
  {
    id: 'ch07-confession-photo',
    type: 'photo',
    title: 'The Night My Heart Found Its Home',
    subtitle: 'FOREVER BEGAN HERE',
    body: 'From quiet glances across the pickleball net to whispering "I love you". Upload our photo or video from this era here!',
    mediaKey: 'ADD_CONFESSION_PHOTO_HERE',
  },
];

export const Chapter07Confession: React.FC<Chapter07ConfessionProps> = ({
  onNext,
  onTriggerEasterEgg,
}) => {
  const [confessionRevealed, setConfessionRevealed] = useState(false);

  const handleRevealConfession = () => {
    sound.playHeartbeat();
    setConfessionRevealed(true);
    onTriggerEasterEgg('egg-confession');
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
          Chapter 07
        </span>
        <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
          <Moon className="w-3.5 h-3.5 text-[#e6be6d]" />
          The Turning Point
        </span>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center space-y-3 mb-8"
      >
        <h2 className="font-serif-romantic text-3xl sm:text-5xl font-black text-[#faf2ea]">
          “That One Night…”
        </h2>
        <p className="text-xs font-mono uppercase tracking-widest text-[#e6be6d]">
          When secrets surrendered to love
        </p>
      </motion.div>

      {/* Confession Heartbeat Button */}
      {!confessionRevealed ? (
        <div className="my-6 flex justify-center">
          <button
            type="button"
            onClick={handleRevealConfession}
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-[#85182a] via-[#ba1e3d] to-[#85182a] text-white font-serif-romantic font-bold text-base shadow-[0_0_30px_rgba(186,30,61,0.5)] hover:scale-105 transition-all cursor-pointer border border-[#e6be6d]/60 flex items-center gap-3 animate-pulse"
          >
            <Heart className="w-5 h-5 text-[#ffd700] fill-current" />
            <span>TAP TO REVEAL CONFESSION ❤️</span>
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-6 p-6 rounded-3xl bg-[#260917]/90 border border-[#e6be6d]/50 text-center space-y-2 shadow-2xl"
        >
          <span className="text-xs font-mono text-[#ffd700] uppercase tracking-widest font-bold">
            27 JULY 2026 • 02:47 AM
          </span>
          <h3 className="font-serif-romantic text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffd6e0] to-[#ffd700]">
            “I LOVE YOU, RADHIKA.”
          </h3>
          <p className="text-sm text-stone-300 font-serif-romantic italic">
            And right there, the whole universe finally made sense.
          </p>
        </motion.div>
      )}

      {/* EDITABLE CONTENT BLOCKS (Photos, Videos, Text) */}
      <ChapterContentBlocksSection
        chapterId="ch07"
        defaultBlocks={DEFAULT_CH07_BLOCKS}
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
          <span>CONTINUE TO CHAPTER 8</span>
          <ArrowRight className="w-4 h-4 text-[#ffd700] group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
