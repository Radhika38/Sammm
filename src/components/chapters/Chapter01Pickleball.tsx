import React, { useState } from 'react';
import { ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { sound } from '../../services/soundEffects';
import { ChapterContentBlocksSection } from '../ChapterContentBlocksSection';
import { ContentBlockData } from '../../data/contentBlocks';

interface Chapter01PickleballProps {
  photoUrl?: string;
  onReplacePhoto: () => void;
  onDirectUploadPhoto?: (dataUrl: string) => void;
  onNext: () => void;
  onTriggerEasterEgg: (eggId: string) => void;
}

const DEFAULT_CH01_BLOCKS: ContentBlockData[] = [
  {
    id: 'ch01-court-photo',
    type: 'photo',
    title: 'Pickleball Court No. 1 • 03 May 2026',
    subtitle: 'THE FIRST SIGHT',
    body: 'The night two strangers met on a quiet turf court. Radhika on the left with her paddle, Sammm on the right with that unforgettable shy smile.',
    mediaKey: 'ADD_FIRST_PHOTO_HERE',
  },
  {
    id: 'ch01-story-note',
    type: 'text',
    title: 'When A Random Game Changed Everything',
    subtitle: 'UNPLANNED & PERFECT',
    body: 'We met through a mutual friend. Nothing planned. You could barely look me in the eye without blushing... and now look at where we are.',
    mediaKey: 'ADD_CH01_EXTRA_MEDIA',
  },
];

export const Chapter01Pickleball: React.FC<Chapter01PickleballProps> = ({
  photoUrl,
  onDirectUploadPhoto,
  onNext,
  onTriggerEasterEgg,
}) => {
  const [shynessLevel, setShynessLevel] = useState(100);
  const [talkingLevel, setTalkingLevel] = useState(0);
  const [measuring, setMeasuring] = useState(false);

  const handleTestShyness = () => {
    sound.playClick();
    setMeasuring(true);
    setTimeout(() => {
      setShynessLevel(100);
      setTalkingLevel(0);
      sound.playNotification();
      setMeasuring(false);
      onTriggerEasterEgg('egg-pickleball');
    }, 900);
  };

  return (
    <section className="min-h-screen py-16 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col justify-center relative select-none">
      {/* Chapter Tag Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-4"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-[#e6be6d] bg-[#3a0a19]/80 px-3.5 py-1.5 rounded-full border border-[#85182a]/70 shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#ffd700]" />
          <span>Chapter 01 • The Beginning</span>
        </span>
        <span className="text-xs text-[#e6be6d]/80 font-mono tracking-wider">
          03 • 05 • 2026
        </span>
      </motion.div>

      {/* Date Title Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center space-y-3 mb-6"
      >
        <div className="font-serif-romantic text-4xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffe1ea] to-[#e6be6d] drop-shadow-lg">
          03 • 05 • 2026
        </div>
        <h2 className="font-serif-romantic text-lg sm:text-2xl text-[#f3ca7e] uppercase tracking-widest font-medium">
          The Day It All Started
        </h2>
      </motion.div>

      {/* EDITABLE CONTENT BLOCKS (Photos, Videos, Custom Text) */}
      <ChapterContentBlocksSection
        chapterId="ch01"
        defaultBlocks={DEFAULT_CH01_BLOCKS}
        onUploadMedia={onDirectUploadPhoto ? (key, data) => onDirectUploadPhoto(data) : undefined}
        mediaConfig={photoUrl ? { ADD_FIRST_PHOTO_HERE: photoUrl } : {}}
      />

      {/* FUNNY MINI INTERACTION: Sammm Shyness Level */}
      <div className="bg-[#1b0612]/80 border border-[#85182a]/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 my-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#e6be6d]" />
          <h3 className="font-serif-romantic text-lg sm:text-xl font-bold text-white">
            SAMMM’S SHYNESS METER ON 03 MAY 🙈
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#11030a] p-4 rounded-2xl border border-[#4a0d1b]">
            <div className="flex justify-between text-xs font-mono text-stone-300 mb-2">
              <span>Awkward Shyness</span>
              <span className="text-[#ff7597] font-bold">{shynessLevel}% EXTREME 🤐</span>
            </div>
            <div className="w-full bg-black/60 h-3.5 rounded-full overflow-hidden border border-stone-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-[#ff4d79] transition-all duration-700 rounded-full"
                style={{ width: `${shynessLevel}%` }}
              />
            </div>
          </div>

          <div className="bg-[#11030a] p-4 rounded-2xl border border-[#4a0d1b]">
            <div className="flex justify-between text-xs font-mono text-stone-300 mb-2">
              <span>Words Spoken To Radhika</span>
              <span className="text-[#e6be6d] font-bold">{talkingLevel}% TALKING 😂</span>
            </div>
            <div className="w-full bg-black/60 h-3.5 rounded-full overflow-hidden border border-stone-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-[#e6be6d] transition-all duration-700 rounded-full"
                style={{ width: `${talkingLevel}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs sm:text-sm text-stone-300 italic font-serif-romantic">
            “Standing there quietly pretending to be calm... when you were dying of shyness inside!” 😂
          </p>

          <button
            onClick={handleTestShyness}
            disabled={measuring}
            className="px-5 py-2.5 bg-gradient-to-r from-[#4d1021] to-[#310714] hover:from-[#66162d] hover:to-[#45091c] text-xs font-bold uppercase tracking-wider text-[#ffd700] rounded-xl border border-[#e6be6d]/40 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            {measuring ? 'Testing awkwardness...' : 'Re-check Shy Level 🤐'}
          </button>
        </div>
      </div>

      {/* Next Chapter Button */}
      <div className="flex justify-end pt-6">
        <button
          onClick={() => {
            sound.playPageTurn();
            onNext();
          }}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#85182a] via-[#a8223b] to-[#85182a] hover:from-[#9c1a32] hover:to-[#be2744] text-white font-serif-romantic font-bold text-base rounded-full shadow-[0_0_25px_rgba(133,24,42,0.45)] hover:shadow-[0_0_35px_rgba(230,190,109,0.5)] transition-all hover:scale-105 cursor-pointer border border-[#e6be6d]/50"
        >
          <span>CONTINUE TO CHAPTER 2</span>
          <ArrowRight className="w-4 h-4 text-[#ffd700] group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
