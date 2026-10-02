import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Heart,
  MapPin,
  Quote,
  ChevronRight,
  Filter,
  Layers,
  ArrowRight,
  Award,
  BookOpen,
  X,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RELATIONSHIP_MILESTONES, RelationshipMilestone } from '../data/relationshipMilestones';
import { sound } from '../services/soundEffects';

interface RelationshipMilestonesProps {
  onNavigateToChapter?: (chapterNum: number) => void;
  onOpenOpenWhenModal?: () => void;
}

export const RelationshipMilestones: React.FC<RelationshipMilestonesProps> = ({
  onNavigateToChapter,
  onOpenOpenWhenModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMilestone, setActiveMilestone] = useState<RelationshipMilestone | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  // Interactive milestone reaction likes stored in localStorage
  const [reactions, setReactions] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('sammm_milestone_reactions_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const filteredMilestones =
    selectedCategory === 'all'
      ? RELATIONSHIP_MILESTONES
      : RELATIONSHIP_MILESTONES.filter((m) => m.category === selectedCategory);

  const handleReactToMilestone = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sound.playTightHug();
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#ff7597', '#e6be6d', '#ffffff'],
    });

    setReactions((prev) => {
      const nextCount = (prev[id] || 0) + 1;
      const updated = { ...prev, [id]: nextCount };
      try {
        localStorage.setItem('sammm_milestone_reactions_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleCardClick = (m: RelationshipMilestone) => {
    sound.playClick();
    setActiveMilestone(m);
  };

  return (
    <section className="max-w-5xl mx-auto w-full px-3 sm:px-6 my-12 relative text-left">
      {/* Background Decorative Ambient Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#85182a]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#e6be6d]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative bg-gradient-to-b from-[#180916] via-[#120512] to-[#0c030c] border-2 border-[#85182a]/60 rounded-3xl p-5 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-sm">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#3b1222] pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-[#85182a]/50 text-[#e6be6d] border border-[#e6be6d]/30 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#e6be6d]" />
                Our Story Timeline
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-white/10 text-stone-300 font-bold">
                10 CORE CHAPTERS
              </span>
            </div>

            <h2 className="font-serif-romantic text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Relationship Milestones
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl font-sans">
              From the quiet, mysterious boy on the pickleball court to our infinite future together. Every date that rewrote our lives.
            </p>
          </div>

          {/* Controls: Filter & View Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Switcher */}
            <div className="bg-[#240b1e] border border-[#85182a]/60 rounded-full p-1 flex items-center gap-1 shadow-inner">
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('timeline');
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-[#85182a] text-white font-bold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Spine View
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('grid');
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#85182a] text-white font-bold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Cards Grid
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Milestones (10)', icon: '✨' },
            { id: 'core', label: 'Core Memories', icon: '💖' },
            { id: 'dates', label: 'Dates & Trips', icon: '🍿' },
            { id: 'doctor', label: 'Doctor Sammm 🩺', icon: '🩺' },
            { id: 'future', label: 'Future Promises', icon: '🌟' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-[#85182a] border-[#e6be6d] text-white font-bold shadow-md shadow-[#85182a]/40 scale-105'
                    : 'bg-[#1e0a19] border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* TIMELINE SPINE VIEW */}
        {viewMode === 'timeline' ? (
          <div className="relative py-4">
            {/* The Central Animated Timeline Spine */}
            <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-[#85182a] via-[#e6be6d] to-[#38bdf8] -translate-x-1/2 rounded-full opacity-60 pointer-events-none" />

            <div className="space-y-8 sm:space-y-12">
              {filteredMilestones.map((m, index) => {
                const isEven = index % 2 === 0;
                const isHovered = hoveredId === m.id;
                const reactionCount = reactions[m.id] || 0;

                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.5, delay: index * 0.04 }}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                      isEven ? 'sm:flex-row-reverse' : ''
                    } gap-4 sm:gap-10 pl-10 sm:pl-0`}
                    onMouseEnter={() => setHoveredId(m.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Spine Node Marker Icon */}
                    <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-20">
                      <motion.button
                        whileHover={{ scale: 1.25, rotate: 6 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCardClick(m)}
                        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-base sm:text-lg shadow-xl cursor-pointer transition-all border-2"
                        style={{
                          backgroundColor: isHovered ? m.themeColor : '#180a14',
                          borderColor: m.themeColor,
                          boxShadow: isHovered
                            ? `0 0 20px ${m.themeColor}88`
                            : '0 4px 10px rgba(0,0,0,0.5)',
                        }}
                        title="Click to inspect milestone"
                      >
                        <span className="transform transition-transform">
                          {m.icon}
                        </span>
                      </motion.button>
                    </div>

                    {/* Timeline Content Card */}
                    <div className="w-full sm:w-[calc(50%-2rem)]">
                      <motion.div
                        whileHover={{ y: -5, scale: 1.015 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleCardClick(m)}
                        className="group relative p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden bg-gradient-to-br from-[#1d0b1a] via-[#140612] to-[#0d030c] hover:shadow-2xl"
                        style={{
                          borderColor: isHovered ? m.themeColor : '#3d1424',
                          boxShadow: isHovered
                            ? `0 10px 30px -10px ${m.themeColor}40`
                            : '0 4px 12px rgba(0,0,0,0.4)',
                        }}
                      >
                        {/* Top Meta: Date and Accent Tag */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-mono font-bold text-[#e6be6d] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#e6be6d]" />
                            {m.displayDate}
                          </span>

                          <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white border"
                            style={{
                              backgroundColor: `${m.themeColor}22`,
                              borderColor: `${m.themeColor}60`,
                              color: m.themeColor,
                            }}
                          >
                            {m.accentBadge}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="font-serif-romantic text-lg sm:text-xl font-bold text-white group-hover:text-[#fbebd5] transition-colors leading-snug">
                          {m.title}
                        </h3>
                        <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                          {m.subtitle}
                        </p>

                        {/* Location Pill if present */}
                        {m.location && (
                          <div className="mt-2 text-[11px] font-mono text-stone-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#ff7597]" />
                            <span>{m.location}</span>
                          </div>
                        )}

                        {/* Romantic Highlight Quote */}
                        <div className="mt-3 p-3 rounded-xl bg-[#260e20] border border-[#4a182c] text-xs font-serif-romantic italic text-[#f8c9d4] group-hover:border-[#ff577d]/40 transition-colors">
                          {m.quote}
                        </div>

                        {/* Card Footer: Interactive Love React & Inspect Button */}
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <button
                            onClick={(e) => handleReactToMilestone(e, m.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-[#85182a]/50 text-xs font-mono text-stone-300 hover:text-white transition-all cursor-pointer border border-white/10"
                            title="Love this milestone"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                reactionCount > 0
                                  ? 'text-rose-500 fill-current'
                                  : 'text-stone-400'
                              }`}
                            />
                            <span>{reactionCount > 0 ? reactionCount : 'Love'}</span>
                          </button>

                          <span className="text-xs font-mono font-bold text-[#e6be6d] group-hover:underline flex items-center gap-1">
                            Read Memory →
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Empty spacer for the opposite side on desktop */}
                    <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* CARDS GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMilestones.map((m, idx) => {
              const reactionCount = reactions[m.id] || 0;
              const isHovered = hoveredId === m.id;

              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => handleCardClick(m)}
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between bg-gradient-to-br from-[#1d0b1a] via-[#140612] to-[#0d030c]"
                  style={{
                    borderColor: isHovered ? m.themeColor : '#3d1424',
                    boxShadow: isHovered
                      ? `0 10px 30px -10px ${m.themeColor}50`
                      : '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  <div>
                    {/* Top Row: Icon & Tag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border shadow"
                        style={{
                          backgroundColor: `${m.themeColor}22`,
                          borderColor: `${m.themeColor}60`,
                        }}
                      >
                        {m.icon}
                      </div>

                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                        style={{
                          backgroundColor: `${m.themeColor}22`,
                          borderColor: `${m.themeColor}50`,
                          color: m.themeColor,
                        }}
                      >
                        {m.accentBadge}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-[#e6be6d] block mb-1">
                      {m.displayDate}
                    </span>

                    <h3 className="font-serif-romantic text-lg font-bold text-white group-hover:text-[#fbebd5] transition-colors leading-snug">
                      {m.title}
                    </h3>

                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                      {m.subtitle}
                    </p>

                    <div className="mt-3 p-3 rounded-xl bg-[#260e20] border border-[#4a182c] text-xs font-serif-romantic italic text-[#f8c9d4]">
                      {m.quote}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={(e) => handleReactToMilestone(e, m.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-[#85182a]/50 text-xs font-mono text-stone-300 hover:text-white transition-all cursor-pointer border border-white/10"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          reactionCount > 0
                            ? 'text-rose-500 fill-current'
                            : 'text-stone-400'
                        }`}
                      />
                      <span>{reactionCount > 0 ? reactionCount : 'Love'}</span>
                    </button>

                    <span className="text-xs font-mono font-bold text-[#e6be6d] group-hover:underline flex items-center gap-1">
                      Inspect →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner Note */}
        <div className="mt-8 p-4 rounded-2xl bg-[#1e0a17] border border-[#4d1628] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-stone-400">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#ff577d] fill-current shrink-0" />
            <span>Every single date holds a piece of my heart, Sammm.</span>
          </div>
          {onOpenOpenWhenModal && (
            <button
              onClick={() => {
                sound.playClick();
                sound.playEnvelopeOpen();
                onOpenOpenWhenModal();
              }}
              className="text-[#e6be6d] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Open “Open When…” Envelopes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* DETAILED MILESTONE SPOTLIGHT MODAL */}
      <AnimatePresence>
        {activeMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#140a14] border-2 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              style={{ borderColor: `${activeMilestone.themeColor}88` }}
            >
              {/* Modal Top Header */}
              <div
                className="p-5 text-white flex items-center justify-between border-b"
                style={{
                  background: `linear-gradient(135deg, ${activeMilestone.themeColor}33, #85182a 80%)`,
                  borderColor: `${activeMilestone.themeColor}40`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-lg"
                    style={{
                      backgroundColor: '#160815',
                      borderColor: activeMilestone.themeColor,
                    }}
                  >
                    {activeMilestone.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#e6be6d] font-bold">
                        {activeMilestone.displayDate}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/20 text-white font-bold">
                        {activeMilestone.categoryLabel}
                      </span>
                    </div>
                    <h3 className="font-serif-romantic text-lg sm:text-2xl font-bold">
                      {activeMilestone.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveMilestone(null)}
                  className="p-2 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Quote Block */}
                <div className="p-4 rounded-2xl bg-[#240e1f] border border-[#521b33] text-center shadow-inner">
                  <Quote className="w-5 h-5 text-[#e6be6d] mx-auto mb-1 opacity-80" />
                  <p className="font-serif-romantic text-base sm:text-lg italic text-[#ffccd7]">
                    {activeMilestone.quote}
                  </p>
                </div>

                {/* Narrative Detail */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold block">
                    What Happened on this Milestone
                  </span>
                  <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-sans">
                    {activeMilestone.detail}
                  </p>
                </div>

                {/* Radhika's Handwritten Sticky Note */}
                <div className="p-5 rounded-2xl bg-[#fbf6ed] text-[#29131d] border-2 border-[#dfcfb9] shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#e2d2bd] pb-2 mb-3">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#85182a] font-bold">
                      Radhika's Memory Note 💌
                    </span>
                    <span className="text-xs font-mono text-stone-500">
                      Unfiltered & True
                    </span>
                  </div>

                  <p className="font-serif-romantic text-base sm:text-lg italic text-[#3d1222] leading-relaxed">
                    “{activeMilestone.radhikaNote}”
                  </p>

                  <div className="mt-3 text-right">
                    <span className="font-handwriting text-2xl text-[#85182a] font-bold">
                      — Radhika ❤️
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-[#180a18] border-t border-[#3b1222] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={(e) => handleReactToMilestone(e, activeMilestone.id)}
                  className="px-4 py-2 rounded-full bg-[#85182a] hover:bg-[#a32238] text-white text-xs font-mono font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-105"
                >
                  <Heart className="w-4 h-4 text-rose-300 fill-current" />
                  <span>
                    Love This Memory ({reactions[activeMilestone.id] || 0})
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  {activeMilestone.chapterNumber && onNavigateToChapter && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onNavigateToChapter(activeMilestone.chapterNumber!);
                        setActiveMilestone(null);
                      }}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-[#e6be6d] border border-[#e6be6d]/40 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Jump to Chapter {activeMilestone.chapterNumber} →</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveMilestone(null)}
                    className="px-4 py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
