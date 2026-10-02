import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, X, Edit3, Pause, Play } from 'lucide-react';
import { TransitionNote } from '../data/transitionNotes';
import { sound } from '../services/soundEffects';

interface ChapterTransitionNotePopupProps {
  note: TransitionNote | null;
  targetChapter: number;
  onProceed: () => void;
  onClose: () => void;
  onEditNote: (note: TransitionNote) => void;
  midnightMode?: boolean;
}

export const ChapterTransitionNotePopup: React.FC<ChapterTransitionNotePopupProps> = ({
  note,
  targetChapter,
  onProceed,
  onClose,
  onEditNote,
  midnightMode = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const duration = 6000; // 6 seconds auto-advance

  useEffect(() => {
    if (!note) {
      setProgress(0);
      return;
    }

    sound.playEnvelopeOpen();
    setProgress(0);
    const intervalTime = 50;
    const increment = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            onProceed();
            return 100;
          }
          return prev + increment;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [note, isPaused, onProceed]);

  if (!note) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Floating background ambient hearts */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '100%', opacity: 0, x: `${15 + i * 14}%` }}
              animate={{
                y: '-20%',
                opacity: [0, 0.4, 0],
                scale: [0.8, 1.2, 0.9],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
              className="absolute text-rose-400/30 text-2xl select-none"
            >
              ❤️
            </motion.div>
          ))}
        </div>

        {/* Parchment Love Note Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 30, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7)] border-2 ${
            midnightMode
              ? 'bg-gradient-to-b from-[#0b172a] via-[#091120] to-[#040814] text-[#e2e8f0] border-sky-400/40 shadow-sky-950/50'
              : 'bg-gradient-to-b from-[#fffbf4] via-[#faf2e6] to-[#f5e7d5] text-[#2c151c] border-[#e6be6d] shadow-[#85182a]/30'
          }`}
        >
          {/* Top Washi Tape Decoration */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#eedec8]/90 backdrop-blur-xs border-dashed border border-amber-800/20 rotate-1 shadow-xs rounded-xs pointer-events-none flex items-center justify-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#78350f]">
              Whisper Note
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
            title="Skip Note"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Meta info */}
          <div className="flex items-center justify-between mt-1 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#85182a]/15 text-[#85182a] dark:text-[#ff7597] border border-[#85182a]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {note.fromChapter > 0 ? `Chapter ${note.fromChapter}` : 'Transition'} → Chapter {targetChapter}
              </span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onEditNote(note);
              }}
              className="inline-flex items-center gap-1 text-xs font-mono text-stone-500 hover:text-[#85182a] dark:hover:text-[#ffd700] hover:underline cursor-pointer transition-colors"
              title="Edit this note's message"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Note</span>
            </button>
          </div>

          {/* Note Header & Emoji */}
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#85182a] to-[#d4af37] flex items-center justify-center text-2xl shadow-md border border-white/20 shrink-0">
              {note.emoji || '💌'}
            </div>
            <div>
              <h3 className="font-serif-romantic text-2xl sm:text-3xl font-bold leading-tight">
                {note.title}
              </h3>
              <p className="text-xs font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                A personal whisper before you turn the page...
              </p>
            </div>
          </div>

          {/* Note Body: Romantic Parchment Text */}
          <div
            className={`p-5 rounded-2xl border mb-6 relative overflow-hidden ${
              midnightMode
                ? 'bg-[#121f36]/70 border-sky-500/20 text-stone-100'
                : 'bg-white/80 border-[#eedec8] text-[#33141f] shadow-inner'
            }`}
          >
            <div className="absolute top-2 right-2 text-stone-300 dark:text-stone-700 pointer-events-none text-4xl font-serif select-none">
              “
            </div>
            <p className="font-serif-romantic text-lg sm:text-xl leading-relaxed italic relative z-10">
              {note.note}
            </p>
            <div className="mt-3 text-right">
              <span className="font-handwriting text-2xl sm:text-3xl font-bold text-[#85182a] dark:text-[#ff8da8]">
                — {note.sender}
              </span>
            </div>
          </div>

          {/* Auto-advance progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 dark:text-stone-500 mb-1">
              <span className="flex items-center gap-1">
                {isPaused ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-[#e6be6d]" />}
                {isPaused ? 'Paused (hovering)' : 'Auto-advancing in a few seconds...'}
              </span>
              <span>{Math.round((100 - progress) / 100 * 6)}s</span>
            </div>
            <div className="w-full bg-stone-300/40 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#85182a] via-[#e6be6d] to-[#ff4d79] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-full text-xs font-mono text-stone-500 hover:text-stone-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel / Stay here
            </button>

            <button
              onClick={() => {
                sound.playPageTurn();
                onProceed();
              }}
              className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#85182a] via-[#a32238] to-[#85182a] hover:from-[#a32238] hover:to-[#85182a] text-white font-mono font-bold text-xs shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer border border-[#e6be6d]/60"
            >
              <span>Continue to Chapter {targetChapter}</span>
              <ArrowRight className="w-4 h-4 text-[#ffd700] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
