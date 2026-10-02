import React from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Heart, Sparkles } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface StoryNavigationBarProps {
  currentChapter: number;
  totalChapters: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectChapter: (chapterNum: number) => void;
  midnightMode?: boolean;
}

const CHAPTER_TITLES = [
  '01. The Beginning (Pickleball)',
  '02. The Shy Boy Era',
  '03. You Were Always There',
  '04. 31 May (RCB Won)',
  '05. The Chapter That Ended',
  '06. Our First Movie',
  '07. That One Night (Confession)',
  '08. Scrapbook & Boyfriend Test',
  '09. Things I Want You To Know',
  '10. Doctor Sammm',
  '11. Final Surprise & Letter',
];

export const StoryNavigationBar: React.FC<StoryNavigationBarProps> = ({
  currentChapter,
  totalChapters,
  onPrev,
  onNext,
  onSelectChapter,
  midnightMode = false,
}) => {
  const prevTitle = currentChapter > 1 ? CHAPTER_TITLES[currentChapter - 2] : null;
  const nextTitle = currentChapter < totalChapters ? CHAPTER_TITLES[currentChapter] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Decorative chapter divider with glowing heart */}
      <div className="flex items-center justify-center gap-3 my-6 opacity-80">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#85182a]/50 to-transparent" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-[#85182a]/40 text-xs font-mono text-[#ff8da8]">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" />
          <span>Chapter {String(currentChapter).padStart(2, '0')} of {String(totalChapters).padStart(2, '0')}</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#85182a]/50 to-transparent" />
      </div>

      {/* Main Navigation Card */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500 backdrop-blur-md ${
          midnightMode
            ? 'bg-[#091224]/85 border-[#1e293b] text-[#e2e8f0]'
            : 'bg-[#180a15]/85 border-[#6b1b2d]/60 text-[#f7f2ea]'
        }`}
      >
        {/* Previous Button */}
        {currentChapter > 1 ? (
          <button
            onClick={() => {
              sound.playPageTurn();
              onPrev();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-xs font-mono font-bold flex items-center justify-center sm:justify-start gap-2 transition-all hover:-translate-x-1 cursor-pointer group"
          >
            <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors" />
            <div className="text-left">
              <span className="text-[10px] text-stone-400 block font-normal">← Previous Chapter</span>
              <span className="text-stone-200 group-hover:text-white truncate max-w-[150px] block">
                {prevTitle}
              </span>
            </div>
          </button>
        ) : (
          <div className="hidden sm:block w-36" />
        )}

        {/* Center Chapter Dots */}
        <div className="flex items-center gap-1.5 px-2">
          {Array.from({ length: totalChapters }).map((_, i) => {
            const chNum = i + 1;
            const isCurrent = chNum === currentChapter;
            const isCompleted = chNum < currentChapter;

            return (
              <button
                key={chNum}
                onClick={() => {
                  sound.playPageTurn();
                  onSelectChapter(chNum);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isCurrent
                    ? midnightMode
                      ? 'w-7 h-2.5 bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]'
                      : 'w-7 h-2.5 bg-gradient-to-r from-[#ffd700] to-[#ff7597] shadow-[0_0_10px_#ff7597]'
                    : isCompleted
                    ? 'w-2.5 h-2.5 bg-rose-800/80 hover:bg-rose-600'
                    : 'w-2 h-2 bg-stone-700/60 hover:bg-stone-500'
                }`}
                title={`Go to Chapter ${chNum}: ${CHAPTER_TITLES[i]}`}
              />
            );
          })}
        </div>

        {/* Next Button */}
        {currentChapter < totalChapters ? (
          <button
            onClick={() => {
              sound.playPageTurn();
              onNext();
            }}
            className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-mono font-bold flex items-center justify-center sm:justify-end gap-2.5 transition-all shadow-lg hover:scale-105 hover:translate-x-1 cursor-pointer group ${
              midnightMode
                ? 'bg-gradient-to-r from-[#1e3a8a] to-[#0284c7] text-white shadow-sky-900/40 border border-sky-400/50'
                : 'bg-gradient-to-r from-[#85182a] via-[#a32238] to-[#ff577d] text-white shadow-[#85182a]/50 border border-[#ffd700]/50'
            }`}
          >
            <div className="text-right">
              <span className="text-[10px] text-amber-200 block font-normal flex items-center justify-end gap-1">
                <span>Continue Reading</span>
                <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-spin" />
              </span>
              <span className="text-white font-bold truncate max-w-[170px] block">
                Next Chapter →
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <button
            onClick={() => {
              sound.playPageTurn();
              onSelectChapter(1);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-105 transition-all"
          >
            <span>Restart Story from Chapter 1 💖</span>
          </button>
        )}
      </div>
    </div>
  );
};
