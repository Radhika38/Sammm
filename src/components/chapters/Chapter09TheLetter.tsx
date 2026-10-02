import React, { useState } from 'react';
import { ArrowRight, Mail, Heart, Check, X, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { sound } from '../../services/soundEffects';
import { ChapterContentBlocksSection } from '../ChapterContentBlocksSection';
import { ContentBlockData } from '../../data/contentBlocks';

interface Chapter09TheLetterProps {
  onNext: () => void;
}

const DEFAULT_CH09_BLOCKS: ContentBlockData[] = [
  {
    id: 'ch09-promise-text',
    type: 'text',
    title: 'A Promise From My Heart ❤️',
    subtitle: 'ALWAYS BY YOUR SIDE',
    body: 'No matter how tough medical preparation gets, or how chaotic the world feels, you will never have to face anything alone. I am in your corner forever.',
    mediaKey: 'ADD_CH09_MEDIA_1',
  },
  {
    id: 'ch09-special-memory',
    type: 'photo',
    title: 'Us Through Every Lifetime',
    subtitle: 'FOREVER & ALWAYS',
    body: 'Upload our favorite picture, video, or a handwritten note scan here to make this letter even more personal.',
    mediaKey: 'ADD_LETTER_SPECIAL_PHOTO',
  },
];

export const Chapter09TheLetter: React.FC<Chapter09TheLetterProps> = ({ onNext }) => {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  const handleOpenEnvelope = () => {
    sound.playEnvelopeOpen();
    sound.playChime();
    setEnvelopeOpened(true);
  };

  const doRules = [
    'Be yourself around me',
    'Talk to me whenever you feel overwhelmed',
    'Don’t overthink every little thing',
    'Believe in yourself as much as I believe in you',
    'Let me support you through every exam and step',
  ];

  const dontRules = [
    'Play mind games 🚫',
    'Hide things or keep tension bottled up',
    'Doubt your capability to become a doctor',
    'Take unnecessary stress on your own',
    'Leave me alone when things get tough 😤',
  ];

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
        <span className="text-xs font-mono uppercase tracking-widest text-[#e6be6d] bg-[#3a0a19]/80 px-3 py-1 rounded-full border border-[#85182a]/70">
          Chapter 09
        </span>
        <span className="text-xs text-stone-400 font-mono">From Radhika’s Heart</span>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center space-y-3 mb-8"
      >
        <h2 className="font-serif-romantic text-3xl sm:text-5xl font-black text-[#fdfaf5]">
          “Things I Want You To Know”
        </h2>
        <p className="text-xs font-mono text-[#e6be6d] uppercase tracking-widest">
          No filters. No pretenses. Just the honest truth.
        </p>
      </motion.div>

      {!envelopeOpened ? (
        <div className="my-8 max-w-md mx-auto w-full text-center space-y-6">
          <div
            onClick={handleOpenEnvelope}
            className="group relative bg-[#fdfaf5] border-2 border-[#d9c4aa] rounded-3xl p-8 sm:p-12 shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-[#85182a] border-2 border-[#e6be6d] mx-auto flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
              <span className="font-serif-romantic font-bold text-xs tracking-widest text-[#fdfaf5]">
                S ❤️ R
              </span>
            </div>

            <div className="mt-6 space-y-2">
              <span className="text-xs font-mono text-stone-500 uppercase tracking-widest block">
                Private & Handwritten
              </span>
              <h3 className="font-serif-romantic text-2xl font-bold text-[#2d141e]">
                A Letter For Sammm
              </h3>
              <p className="text-xs text-stone-600 font-serif-romantic italic">
                Tap the wax seal to unfold...
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenEnvelope}
            className="px-6 py-2.5 rounded-full bg-[#85182a] hover:bg-[#a8223a] text-white text-xs font-mono uppercase tracking-wider font-bold border border-[#e6be6d] shadow-lg cursor-pointer"
          >
            ✉️ Open Letter
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in my-6">
          {/* Rules / Things to remember */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#122415]/70 border border-emerald-500/40 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Always Remember To:
              </span>
              <ul className="space-y-1.5 text-xs text-stone-300">
                {doRules.map((rule, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#2e0e15]/70 border border-rose-500/40 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <X className="w-4 h-4" /> Never Do This:
              </span>
              <ul className="space-y-1.5 text-xs text-stone-300">
                {dontRules.map((rule, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-rose-400">✕</span> {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* EDITABLE CONTENT BLOCKS (Photos, Videos, Text) */}
          <ChapterContentBlocksSection
            chapterId="ch09"
            defaultBlocks={DEFAULT_CH09_BLOCKS}
          />
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end pt-6">
        <button
          onClick={() => {
            sound.playPageTurn();
            onNext();
          }}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#85182a] via-[#a8223b] to-[#85182a] hover:from-[#9c1a32] hover:to-[#be2744] text-white font-serif-romantic font-bold text-base rounded-full shadow-[0_0_25px_rgba(133,24,42,0.45)] hover:shadow-[0_0_35px_rgba(230,190,109,0.5)] transition-all hover:scale-105 cursor-pointer border border-[#e6be6d]/50"
        >
          <span>CONTINUE TO CHAPTER 10</span>
          <ArrowRight className="w-4 h-4 text-[#ffd700] group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
