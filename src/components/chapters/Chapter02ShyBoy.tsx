import React, { useState } from 'react';
import { ArrowRight, MapPin, Compass, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { sound } from '../../services/soundEffects';
import { ChapterContentBlocksSection } from '../ChapterContentBlocksSection';
import { ContentBlockData } from '../../data/contentBlocks';

interface Chapter02ShyBoyProps {
  mahudiUrl?: string;
  bhavnathUrl?: string;
  onReplaceMahudi: () => void;
  onReplaceBhavnath: () => void;
  onDirectUploadMahudi?: (dataUrl: string) => void;
  onDirectUploadBhavnath?: (dataUrl: string) => void;
  onNext: () => void;
  onTriggerEasterEgg: (eggId: string) => void;
}

const DEFAULT_CH02_BLOCKS: ContentBlockData[] = [
  {
    id: 'ch02-mahudi-card',
    type: 'photo',
    title: 'Mahudi Trip Postcard',
    subtitle: 'THE SILENT ERA',
    body: 'The road trip where you sat quietly and I kept waiting for you to say something!',
    mediaKey: 'ADD_MAHUDI_PHOTO_HERE',
  },
  {
    id: 'ch02-bhavnath-card',
    type: 'photo',
    title: 'Bhavnath Travel Memories',
    subtitle: 'TRYING TO MAKE HIM SPEAK',
    body: 'Exploring the hills and temples while wondering how one person could be so quiet and so cute at the same time.',
    mediaKey: 'ADD_BHAVNATH_PHOTO_HERE',
  },
];

export const Chapter02ShyBoy: React.FC<Chapter02ShyBoyProps> = ({
  mahudiUrl,
  bhavnathUrl,
  onDirectUploadMahudi,
  onDirectUploadBhavnath,
  onNext,
  onTriggerEasterEgg,
}) => {
  const [bubbleStep, setBubbleStep] = useState(0);
  const [busPosition, setBusPosition] = useState(45);

  const advanceDialogue = () => {
    sound.playClick();
    setBubbleStep((prev) => (prev + 1) % 4);
  };

  const handleShyClick = () => {
    sound.playNotification();
    onTriggerEasterEgg('egg-shy');
  };

  const mediaMap: Record<string, string> = {};
  if (mahudiUrl) mediaMap['ADD_MAHUDI_PHOTO_HERE'] = mahudiUrl;
  if (bhavnathUrl) mediaMap['ADD_BHAVNATH_PHOTO_HERE'] = bhavnathUrl;

  const handleMediaUpload = (key: string, dataUrl: string) => {
    if (key === 'ADD_MAHUDI_PHOTO_HERE' && onDirectUploadMahudi) {
      onDirectUploadMahudi(dataUrl);
    } else if (key === 'ADD_BHAVNATH_PHOTO_HERE' && onDirectUploadBhavnath) {
      onDirectUploadBhavnath(dataUrl);
    }
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
          Chapter 02
        </span>
        <span className="text-xs text-stone-400 font-mono">10 MAY 2026</span>
      </motion.div>

      {/* Date & Title */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center space-y-3 mb-8"
      >
        <div className="font-serif-romantic text-4xl sm:text-6xl font-extrabold tracking-tight text-[#faf4ee] glow-text-gold">
          10 MAY 2026
        </div>
        <h2 className="font-serif-romantic text-2xl sm:text-3xl text-[#d4af37] flex items-center justify-center gap-2">
          <span>THE SHY BOY ERA</span>
          <button
            onClick={handleShyClick}
            className="hover:scale-125 transition-transform cursor-pointer"
            title="Click shy emoji (Easter Egg)"
          >
            🤐
          </button>
        </h2>
      </motion.div>

      {/* Interactive Road Trip Route */}
      <div className="bg-[#150e18] border border-[#501324] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#e6be6d] uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#e6be6d]" />
            <span>Interactive Road Trip Route</span>
          </div>
          <span className="text-xs text-stone-400">Drag / tap to move bus</span>
        </div>

        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = Math.max(5, Math.min(95, (clickX / rect.width) * 100));
            setBusPosition(pct);
          }}
          className="relative h-14 bg-[#0a050c] rounded-xl border border-[#3b0f1d] flex items-center px-4 cursor-pointer select-none"
        >
          <div className="absolute left-6 right-6 h-1 bg-[#471220] rounded-full" />
          <div className="absolute left-6 w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
          <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-500 border border-amber-300" />
          <div className="absolute right-6 w-3 h-3 rounded-full bg-rose-500 border border-rose-300" />

          <div
            style={{ left: `${busPosition}%` }}
            className="absolute -translate-x-1/2 -top-1 transition-all duration-300 flex flex-col items-center"
          >
            <span className="text-2xl animate-bounce">🚌</span>
          </div>
        </div>

        <div className="flex justify-between text-[11px] font-mono text-stone-300">
          <span>Ahmedabad</span>
          <span className="text-[#e6be6d]">Mahudi</span>
          <span>Bhavnath</span>
        </div>

        {/* Dialogue Box */}
        <div
          onClick={advanceDialogue}
          className="bg-[#240a14] border border-[#6b162a] rounded-2xl p-4 cursor-pointer hover:border-[#ff577d]/60 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="font-mono text-[#e6be6d]">TAP TO ADVANCE DIALOGUE</span>
            <span>{bubbleStep + 1} / 4</span>
          </div>
          <p className="font-serif-romantic text-base sm:text-lg text-white font-medium">
            {bubbleStep === 0 && '“So… do you always talk this much, or is today special? 😏”'}
            {bubbleStep === 1 && '“Bhai kuch bol bhi de! Ek word toh bol! 😂”'}
            {bubbleStep === 2 && '“Sitting next to you and dying of awkward cuteness.”'}
            {bubbleStep === 3 && '“Little did you know, this quiet boy was about to become my favorite voice.” ❤️'}
          </p>
        </div>
      </div>

      {/* EDITABLE CONTENT BLOCKS (Photos, Videos, Text) */}
      <ChapterContentBlocksSection
        chapterId="ch02"
        defaultBlocks={DEFAULT_CH02_BLOCKS}
        onUploadMedia={handleMediaUpload}
        mediaConfig={mediaMap}
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
          <span>CONTINUE TO CHAPTER 3</span>
          <ArrowRight className="w-4 h-4 text-[#ffd700] group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
