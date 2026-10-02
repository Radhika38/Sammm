import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Star,
  RotateCcw,
  BookOpen,
  X,
  Share2,
  Bookmark,
  Check,
  Search,
  Filter,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ORIGAMI_REASONS, OrigamiReason } from '../data/origamiLoveJarData';
import { sound } from '../services/soundEffects';

interface OrigamiLoveJarProps {
  onOpenTimeline?: () => void;
}

const STORAGE_KEY = 'sammm_radhika_origami_jar_v2';
const FAVORITES_KEY = 'sammm_radhika_origami_favorites_v2';

export const OrigamiLoveJar: React.FC<OrigamiLoveJarProps> = () => {
  // Discovered reason IDs
  const [discoveredIds, setDiscoveredIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    // Default initial discovered reasons so Sammm doesn't start at 0
    return [1, 2, 5, 8, 15, 23, 48];
  });

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [23, 48];
    } catch {
      return [23, 48];
    }
  });

  const [activeReason, setActiveReason] = useState<OrigamiReason | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalCategory, setJournalCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copyNotice, setCopyNotice] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(discoveredIds));
    } catch {}
  }, [discoveredIds]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Draw a random reason (prioritizes undiscovered ones first)
  const drawReason = () => {
    sound.playClick();
    setIsShaking(true);

    setTimeout(() => {
      sound.playPageTurn();
      sound.playChime();

      // Find undiscovered reasons
      const undiscovered = ORIGAMI_REASONS.filter((r) => !discoveredIds.includes(r.id));
      let chosen: OrigamiReason;

      if (undiscovered.length > 0) {
        chosen = undiscovered[Math.floor(Math.random() * undiscovered.length)];
        setDiscoveredIds((prev) => [...prev, chosen.id]);
      } else {
        // If all 100 discovered, pick from all
        chosen = ORIGAMI_REASONS[Math.floor(Math.random() * ORIGAMI_REASONS.length)];
      }

      setIsShaking(false);
      setActiveReason(chosen);

      // Light confetti flutter
      confetti({
        particleCount: 30,
        spread: 55,
        origin: { y: 0.6 },
        colors: [chosen.starColor, '#ffd700', '#ffffff', '#ff7597'],
      });
    }, 650);
  };

  const toggleFavorite = (id: number) => {
    sound.playClick();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const unlockAllReasons = () => {
    sound.playChime();
    const allIds = ORIGAMI_REASONS.map((r) => r.id);
    setDiscoveredIds(allIds);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#e6be6d', '#ff577d', '#ffffff'],
    });
  };

  // Filtered list for the journal modal
  const discoveredReasonsList = ORIGAMI_REASONS.filter((r) => discoveredIds.includes(r.id));
  const filteredReasons = discoveredReasonsList.filter((r) => {
    const matchesCategory =
      journalCategory === 'all'
        ? true
        : journalCategory === 'favorites'
        ? favorites.includes(r.id)
        : r.category === journalCategory;

    const matchesSearch =
      r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toString().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="origami-love-jar-section"
      className="my-10 px-4 max-w-4xl mx-auto"
    >
      <div className="relative rounded-3xl overflow-hidden border border-[#85182a]/50 bg-gradient-to-br from-[#1a0814]/95 via-[#120610]/95 to-[#1c0916]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Glow ambient background circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#e6be6d]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#85182a]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* LEFT: The Glowing Glass Jar Visual */}
          <div className="flex flex-col items-center shrink-0">
            <motion.div
              animate={
                isShaking
                  ? {
                      x: [-6, 6, -5, 5, -3, 3, 0],
                      rotate: [-3, 3, -2, 2, -1, 1, 0],
                      scale: [1, 1.04, 0.98, 1.02, 1],
                    }
                  : { y: [0, -4, 0] }
              }
              transition={
                isShaking
                  ? { duration: 0.6 }
                  : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
              }
              onClick={drawReason}
              className="relative w-44 h-56 cursor-pointer group select-none"
              title="Click or shake to draw a reason!"
            >
              {/* Wooden Cork Lid */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 rounded-t-lg bg-gradient-to-r from-[#8c593b] via-[#b37a50] to-[#8c593b] border-t border-x border-[#c98e61] shadow-md z-20 flex items-center justify-center">
                <div className="w-16 h-1 bg-[#5e381f]/40 rounded-full" />
              </div>

              {/* Twine String & Gold Ribbon Bow */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-2.5 bg-[#d4af37]/80 rounded-full z-20 shadow-sm flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fde047] shadow-sm animate-ping" />
              </div>

              {/* Glass Neck */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 rounded-t-md border-2 border-white/20 bg-white/5 backdrop-blur-sm z-10" />

              {/* Glass Body */}
              <div className="absolute top-5 inset-x-0 bottom-0 rounded-b-[40px] rounded-t-xl border-2 border-white/25 bg-gradient-to-b from-white/10 via-white/5 to-white/15 backdrop-blur-md shadow-[0_12px_32px_rgba(230,190,109,0.15)] overflow-hidden flex flex-col justify-end p-3">
                {/* Glass Glare Highlights */}
                <div className="absolute top-2 left-3 w-3 h-40 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-full opacity-60 pointer-events-none" />
                <div className="absolute top-4 right-3 w-1.5 h-36 bg-gradient-to-b from-white/30 to-transparent rounded-full opacity-40 pointer-events-none" />

                {/* Glowing Fairy Lights inside */}
                <div className="absolute inset-0 bg-radial from-[#e6be6d]/20 via-transparent to-transparent animate-pulse pointer-events-none" />

                {/* Swirling Golden Starburst Aura during shake */}
                {isShaking && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
                    animate={{ opacity: 1, scale: [0.8, 1.2, 1], rotate: 360 }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-tr from-[#ffd700]/25 via-[#ff7597]/20 to-transparent rounded-full blur-md pointer-events-none"
                  />
                )}

                {/* Floating Pastel Origami Stars inside the jar */}
                <div className="relative w-full h-36 flex flex-wrap items-end justify-center gap-1.5 pb-2 overflow-hidden">
                  {[
                    { color: '#fbcfe8', deg: 12, size: 20 },
                    { color: '#ffd700', deg: -18, size: 22 },
                    { color: '#ff7597', deg: 35, size: 18 },
                    { color: '#38bdf8', deg: -8, size: 21 },
                    { color: '#c084fc', deg: 24, size: 19 },
                    { color: '#34d399', deg: -30, size: 22 },
                    { color: '#fb7185', deg: 15, size: 20 },
                    { color: '#ffd700', deg: 40, size: 23 },
                    { color: '#fbcfe8', deg: -22, size: 18 },
                    { color: '#a78bfa', deg: 5, size: 20 },
                  ].map((s, idx) => (
                    <motion.div
                      key={idx}
                      animate={
                        isShaking
                          ? {
                              y: [0, -35, 10, -20, 0],
                              x: [0, (idx % 2 === 0 ? 10 : -10), 0],
                              rotate: [s.deg, s.deg + 45, s.deg - 45, s.deg],
                            }
                          : {
                              y: [0, (idx % 3 === 0 ? -4 : -2), 0],
                              rotate: [s.deg, s.deg + 4, s.deg],
                            }
                      }
                      transition={
                        isShaking
                          ? { duration: 0.6 }
                          : { repeat: Infinity, duration: 3 + (idx % 3), ease: 'easeInOut' }
                      }
                      style={{
                        transform: `rotate(${s.deg}deg)`,
                        filter: `drop-shadow(0 2px 4px ${s.color}66)`,
                      }}
                      className="cursor-pointer"
                    >
                      <Star
                        size={s.size}
                        fill={s.color}
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth={1}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Heart Tag on Jar */}
                <div className="mx-auto mt-auto py-1 px-3 rounded-full bg-[#85182a]/90 border border-[#e6be6d]/60 text-[10px] font-mono text-[#e6be6d] font-bold shadow-md tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#ffd700]" />
                  <span>100 REASONS</span>
                </div>
              </div>
            </motion.div>

            {/* Shake / Tap Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={drawReason}
              disabled={isShaking}
              className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#85182a] via-[#a32238] to-[#85182a] hover:from-[#a32238] hover:to-[#85182a] text-white text-xs font-mono font-bold tracking-wider shadow-lg hover:shadow-[#85182a]/50 border border-[#e6be6d]/60 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700] animate-spin" />
              <span>{isShaking ? 'Shaking Jar...' : '✨ SHAKE OR DRAW A STAR'}</span>
            </motion.button>
          </div>

          {/* RIGHT: Story Details & Progress Tracker */}
          <div className="flex-1 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#e6be6d] font-semibold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-[#e6be6d]" />
                  The Origami Love Jar
                </span>
                <h3 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
                  100 Things I Adore About You
                </h3>
              </div>

              {/* Journal Drawer Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setShowJournalModal(true);
                }}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#e6be6d]" />
                <span>View Discovered Journal ({discoveredIds.length})</span>
              </button>
            </div>

            <p className="text-sm font-sans text-stone-300 leading-relaxed">
              Whenever the medical books feel heavy, hospital rotations drain your energy, or you just miss me at 3:00 AM, tap or shake this jar. Each origami star is a folded reason why my heart belongs to you.
            </p>

            {/* Progress Bar */}
            <div className="bg-black/30 rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-300">
                  Discovered: <strong className="text-[#e6be6d]">{discoveredIds.length}</strong> / 100 Reasons
                </span>
                <span className="text-[#ffd700] font-bold">
                  {Math.round((discoveredIds.length / 100) * 100)}% Collected
                </span>
              </div>

              <div className="w-full h-2.5 bg-[#2c1020] rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(discoveredIds.length / 100) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#85182a] via-[#e6be6d] to-[#ffd700] shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-stone-400">
                <span>⭐ Favorites saved: {favorites.length}</span>
                <span className="text-[#ff7597]">“Tu doctor bani ne j raissss!” 🩺</span>
              </div>
            </div>

            {/* Quick Teaser / Last Drawn Reason Banner */}
            {discoveredReasonsList.length > 0 && (
              <div
                onClick={() => {
                  const lastReason = ORIGAMI_REASONS.find(
                    (r) => r.id === discoveredIds[discoveredIds.length - 1]
                  );
                  if (lastReason) setActiveReason(lastReason);
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-[#2a0e20]/80 to-[#190815]/80 border border-[#85182a]/40 hover:border-[#e6be6d]/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono uppercase text-[#e6be6d] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Latest Unfolded Note
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 group-hover:text-white transition-colors">
                    Tap to view →
                  </span>
                </div>
                <p className="font-serif-romantic text-stone-200 text-sm italic line-clamp-2">
                  “{ORIGAMI_REASONS.find((r) => r.id === discoveredIds[discoveredIds.length - 1])?.text}”
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL 1: UNFOLDED ORIGAMI REASON CARD --- */}
      <AnimatePresence>
        {activeReason && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ scale: 0.7, rotateY: 90, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 180 }}
              className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-[#1e0a19] border-2 border-[#e6be6d]/70 shadow-2xl text-white text-left overflow-hidden"
              style={{
                boxShadow: `0 0 50px ${activeReason.starColor}33`,
              }}
            >
              {/* Decorative paper texture glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#e6be6d]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveReason(null);
                }}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Origami Star Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/20"
                  style={{ backgroundColor: activeReason.starColor }}
                >
                  <Star className="w-6 h-6 fill-white text-white drop-shadow" />
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#e6be6d] font-bold block">
                    Origami Star #{activeReason.id} of 100
                  </span>
                  <span className="text-xs font-mono text-stone-400 capitalize">
                    Category: {activeReason.category === 'doctor' ? '🩺 Doctor Sammm' : activeReason.category}
                  </span>
                </div>
              </div>

              {/* The Unfolded Paper Content */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#faf5ee] to-[#f4ebe1] text-[#2b1810] shadow-inner border border-[#d6c7b2] my-4 relative">
                {/* Wax seal watermark in corner */}
                <div className="absolute bottom-3 right-3 opacity-15 pointer-events-none">
                  <Heart className="w-16 h-16 fill-[#85182a] text-[#85182a]" />
                </div>

                <p className="font-serif-romantic text-lg sm:text-xl font-medium leading-relaxed italic text-[#3a1a24]">
                  “{activeReason.text}”
                </p>

                <div className="mt-4 pt-3 border-t border-[#d8c8b4] flex items-center justify-between text-xs font-handwriting text-[#7a4658]">
                  <span>— Folded with love by Radhika 💌</span>
                  <span className="font-mono text-[10px] text-[#9c6a7a]">03 Oct 2026</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => toggleFavorite(activeReason.id)}
                  className={`px-4 py-2 rounded-full border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    favorites.includes(activeReason.id)
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                      : 'bg-white/5 border-white/10 text-stone-300 hover:text-white'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      favorites.includes(activeReason.id)
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-stone-400'
                    }`}
                  />
                  <span>
                    {favorites.includes(activeReason.id) ? 'Favorited ❤️' : 'Save to Favorites'}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      drawReason();
                    }}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#85182a] to-[#d4af37] text-white text-xs font-mono font-bold tracking-wider hover:scale-105 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Draw Another Star</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: ALL DISCOVERED REASONS JOURNAL --- */}
      <AnimatePresence>
        {showJournalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl max-h-[85vh] bg-[#140813] border-2 border-[#85182a] rounded-3xl shadow-2xl p-6 text-white text-left flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#85182a] flex items-center justify-center text-[#e6be6d]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-romantic text-xl font-bold text-white">
                      Radhika’s Origami Journal
                    </h3>
                    <p className="text-xs font-mono text-stone-400">
                      Discovered {discoveredIds.length} of 100 folded origami reasons
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {discoveredIds.length < 100 && (
                    <button
                      onClick={unlockAllReasons}
                      className="px-3 py-1 rounded-full bg-[#e6be6d]/10 hover:bg-[#e6be6d]/20 text-[#e6be6d] border border-[#e6be6d]/40 text-[11px] font-mono transition-colors cursor-pointer"
                      title="Reveal all 100 reasons in the journal"
                    >
                      Unlock All 100 ✨
                    </button>
                  )}

                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowJournalModal(false);
                    }}
                    className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search & Filter pills */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search discovered reasons (e.g. 'doctor', 'cricket', '31 May', '23')..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-sans text-white focus:outline-none focus:border-[#e6be6d]"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: `All (${discoveredIds.length})` },
                    { id: 'favorites', label: `❤️ Favorites (${favorites.length})` },
                    { id: 'doctor', label: '🩺 Doctor Sammm' },
                    { id: 'memories', label: '📸 Core Memories' },
                    { id: 'cute', label: '💖 Cute Moments' },
                    { id: 'habits', label: '✨ Habits' },
                    { id: 'future', label: '🌟 Future' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        sound.playClick();
                        setJournalCategory(tab.id);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                        journalCategory === tab.id
                          ? 'bg-[#85182a] text-white border border-[#e6be6d]'
                          : 'bg-white/5 text-stone-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Reasons List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {filteredReasons.length === 0 ? (
                  <div className="py-12 text-center text-stone-400 text-xs font-mono">
                    No origami reasons found matching this filter.
                  </div>
                ) : (
                  filteredReasons.map((reason) => (
                    <div
                      key={reason.id}
                      onClick={() => {
                        sound.playClick();
                        setActiveReason(reason);
                      }}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e6be6d]/50 transition-all cursor-pointer flex items-start gap-3.5 group"
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ backgroundColor: reason.starColor }}
                      >
                        <Star className="w-4 h-4 fill-white text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-mono text-[#e6be6d] font-bold">
                            Reason #{reason.id}
                          </span>
                          <span className="text-[10px] font-mono text-stone-500 uppercase">
                            {reason.category}
                          </span>
                        </div>
                        <p className="font-serif-romantic text-sm text-stone-200 group-hover:text-white leading-relaxed">
                          “{reason.text}”
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(reason.id);
                        }}
                        className="p-1 text-stone-400 hover:text-rose-400"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.includes(reason.id)
                              ? 'fill-rose-500 text-rose-500'
                              : 'text-stone-500'
                          }`}
                        />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
