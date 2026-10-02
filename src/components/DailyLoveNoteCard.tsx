import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, Heart, RefreshCw, HeartHandshake, Check, ChevronRight, Volume2, Bookmark, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getTodaysLoveNote, DAILY_LOVE_NOTES, DailyLoveNote } from '../data/dailyLoveNotes';
import { sound } from '../services/soundEffects';

interface DailyLoveNoteCardProps {
  onOpenOpenWhenModal?: () => void;
}

export const DailyLoveNoteCard: React.FC<DailyLoveNoteCardProps> = ({ onOpenOpenWhenModal }) => {
  const [todayData, setTodayData] = useState(() => getTodaysLoveNote());
  const [activeNote, setActiveNote] = useState<DailyLoveNote>(todayData.note);
  const [isBonus, setIsBonus] = useState(false);

  // Check if today's note has been unsealed today
  const [isUnsealed, setIsUnsealed] = useState<boolean>(() => {
    try {
      const todayKey = `sammm_opened_daily_note_${new Date().toISOString().slice(0, 10)}`;
      return localStorage.getItem(todayKey) === 'true';
    } catch {
      return false;
    }
  });

  const [hugSent, setHugSent] = useState(false);
  const [hugCount, setHugCount] = useState(0);

  const handleUnseal = () => {
    sound.playEnvelopeOpen();
    setTimeout(() => {
      sound.playChime();
    }, 250);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.4 },
      colors: ['#ff7597', '#e6be6d', '#85182a', '#ffffff'],
    });

    setIsUnsealed(true);
    try {
      const todayKey = `sammm_opened_daily_note_${new Date().toISOString().slice(0, 10)}`;
      localStorage.setItem(todayKey, 'true');
    } catch {}
  };

  const handleReSeal = () => {
    sound.playClick();
    setIsUnsealed(false);
    setIsBonus(false);
    setActiveNote(todayData.note);
    try {
      const todayKey = `sammm_opened_daily_note_${new Date().toISOString().slice(0, 10)}`;
      localStorage.removeItem(todayKey);
    } catch {}
  };

  const handleShuffleBonus = () => {
    sound.playClick();
    sound.playChime();
    const otherNotes = DAILY_LOVE_NOTES.filter((n) => n.id !== activeNote.id);
    const randomNote = otherNotes[Math.floor(Math.random() * otherNotes.length)];
    setActiveNote(randomNote);
    setIsBonus(true);
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.5 },
      colors: ['#ff8da8', '#e6be6d'],
    });
  };

  const handleSendHug = () => {
    sound.playTightHug();
    setHugSent(true);
    setHugCount((c) => c + 1);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#ff577d', '#ffffff'],
    });
    setTimeout(() => setHugSent(false), 3500);
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-3 sm:px-6 my-6 sm:my-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <AnimatePresence mode="wait">
          {!isUnsealed ? (
            /* SEALED ENVELOPE CARD */
            <motion.div
              key="sealed-envelope"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative overflow-hidden rounded-3xl border-2 border-[#85182a]/70 bg-gradient-to-b from-[#1c0816] via-[#140610] to-[#0c0309] shadow-2xl p-6 sm:p-8 text-center cursor-pointer group hover:border-[#e6be6d]/80 transition-all duration-300"
              onClick={handleUnseal}
            >
              {/* Subtle background glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#85182a]/20 rounded-full blur-3xl pointer-events-none" />

              {/* Envelope Flap Simulation Graphic */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Top Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-[#85182a]/50 text-[#e6be6d] border border-[#e6be6d]/30 font-bold">
                    Daily Love Note • {todayData.dateFormatted}
                  </span>
                </div>

                <h3 className="font-serif-romantic text-xl sm:text-2xl font-bold text-white mb-2">
                  A New Handwritten Note Awaits You, Sammm
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto mb-6">
                  Sealed with pure love for today. Tap the wax seal below to unfold your message.
                </p>

                {/* 3D Wax Seal Button */}
                <div className="relative my-2">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#a32238] via-[#85182a] to-[#450813] border-4 border-[#e6be6d]/60 shadow-xl flex flex-col items-center justify-center text-white relative cursor-pointer group-hover:shadow-[#e6be6d]/30"
                  >
                    {/* Concentric stamp rings */}
                    <div className="absolute inset-1 rounded-full border border-white/20 pointer-events-none" />
                    <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-[#ff8da8] fill-current animate-pulse mb-0.5" />
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-[#e6be6d]">
                      R ❤️ S
                    </span>
                  </motion.div>
                </div>

                {/* Call to Action */}
                <div className="mt-5 inline-flex items-center gap-2 text-xs font-mono font-bold text-[#e6be6d] group-hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-[#e6be6d]" />
                  <span>Tap Wax Seal to Open Today’s Note →</span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* UNSEALED PARCHMENT NOTE */
            <motion.div
              key="unsealed-note"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl border-2 border-[#d9c4aa] bg-[#fbf6ed] text-[#29131d] shadow-2xl p-6 sm:p-10 selection:bg-[#85182a] selection:text-white"
            >
              {/* Top Meta info */}
              <div className="flex items-center justify-between border-b border-[#e2d2bd] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#85182a] text-[#e6be6d] flex items-center justify-center text-xs font-bold shadow">
                    💌
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-stone-500 font-bold block">
                      {isBonus ? 'Bonus Love Note ✨' : "Today's Love Note"}
                    </span>
                    <span className="text-xs font-mono text-[#85182a] font-semibold">
                      {todayData.dateFormatted}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReSeal}
                    className="text-[11px] font-mono text-stone-500 hover:text-stone-800 transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-stone-200/60"
                    title="Seal envelope back"
                  >
                    Fold & Seal 💌
                  </button>
                </div>
              </div>

              {/* Salutation Greeting */}
              <div className="mb-4">
                <h3 className="font-handwriting text-3xl sm:text-4xl text-[#85182a] font-bold">
                  {activeNote.greeting}
                </h3>
              </div>

              {/* Note Content */}
              <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#2a131e] font-sans">
                <p>{activeNote.body}</p>
              </div>

              {/* Romantic Highlight Quote */}
              {activeNote.quote && (
                <div className="my-5 p-4 rounded-2xl bg-[#fae8ec] border border-[#f0bac4] text-center shadow-inner">
                  <p className="font-serif-romantic text-base sm:text-lg italic text-[#6e1526] font-medium">
                    “{activeNote.quote}”
                  </p>
                </div>
              )}

              {/* Punchline / Closing encouragement */}
              {activeNote.punchline && (
                <p className="text-sm sm:text-base font-semibold text-[#85182a] mt-2">
                  {activeNote.punchline}
                </p>
              )}

              {/* Signature */}
              <div className="pt-6 border-t border-[#e2d2bd] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-500 font-mono">
                <div>
                  <span>Always in your corner,</span>
                  <p className="font-handwriting text-2xl text-[#85182a] font-bold mt-0.5">
                    — Your Radhika ❤️
                  </p>
                </div>

                {/* Reaction Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleSendHug}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-full bg-[#85182a] hover:bg-[#a32238] text-white text-xs font-mono font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-300 fill-current" />
                    <span>{hugSent ? 'Hug Sent! ❤️' : `Send Hug (${hugCount})`}</span>
                  </button>

                  <button
                    onClick={handleShuffleBonus}
                    className="px-3 py-2 rounded-full bg-white hover:bg-stone-100 text-[#85182a] border border-[#d6c4a8] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Get an extra random love note right now"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Bonus Note</span>
                  </button>
                </div>
              </div>

              {/* Hug Feedback Banner */}
              {hugSent && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-800 text-center font-mono"
                >
                  ✓ Virtual tight hug delivered to Radhika! She smiled. ❤️
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
