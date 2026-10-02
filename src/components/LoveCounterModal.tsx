import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Clock, Activity, Sparkles, Flame } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface LoveCounterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoveCounterModal: React.FC<LoveCounterModalProps> = ({ isOpen, onClose }) => {
  // Start date: 03 May 2026 20:30 (Pickleball Court)
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const startDate = new Date('2026-05-03T20:30:00');
  const diffMs = Math.max(0, now.getTime() - startDate.getTime());

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  // Approximately 75 heartbeats per minute
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHeartbeats = (totalMinutes * 75).toLocaleString();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-gradient-to-br from-[#1b0612] via-[#260817] to-[#0f0209] border-2 border-[#e6be6d]/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(230,190,109,0.35)] text-stone-100 space-y-6 relative overflow-hidden select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#85182a]/50 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#ffd700]" />
            <h3 className="font-serif-romantic text-xl font-bold text-white">
              Love Counter & Live Heartbeats ❤️
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Start Date Banner */}
        <div className="text-center space-y-1">
          <span className="text-[11px] font-mono text-[#e6be6d] uppercase tracking-widest bg-[#3d0d1e] px-3 py-1 rounded-full border border-[#85182a]/60">
            SINCE 03 MAY 2026 • COURT NO. 1
          </span>
          <p className="text-xs text-stone-400 font-sans pt-1">
            Every second since the universe brought Sammm & Radhika together
          </p>
        </div>

        {/* Live Ticking Time Counter Cards */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
          <div className="bg-[#12030a] p-3 rounded-2xl border border-[#521323] shadow-inner">
            <span className="font-serif-romantic text-2xl sm:text-3xl font-extrabold text-[#ffd700]">
              {days}
            </span>
            <span className="block text-[10px] font-mono text-stone-400 uppercase mt-1">Days</span>
          </div>

          <div className="bg-[#12030a] p-3 rounded-2xl border border-[#521323] shadow-inner">
            <span className="font-serif-romantic text-2xl sm:text-3xl font-extrabold text-[#ffffff]">
              {hours}
            </span>
            <span className="block text-[10px] font-mono text-stone-400 uppercase mt-1">Hours</span>
          </div>

          <div className="bg-[#12030a] p-3 rounded-2xl border border-[#521323] shadow-inner">
            <span className="font-serif-romantic text-2xl sm:text-3xl font-extrabold text-[#ff7597]">
              {minutes}
            </span>
            <span className="block text-[10px] font-mono text-stone-400 uppercase mt-1">Mins</span>
          </div>

          <div className="bg-[#12030a] p-3 rounded-2xl border border-[#521323] shadow-inner">
            <span className="font-serif-romantic text-2xl sm:text-3xl font-extrabold text-[#e6be6d] animate-pulse">
              {seconds}
            </span>
            <span className="block text-[10px] font-mono text-stone-400 uppercase mt-1">Secs</span>
          </div>
        </div>

        {/* Live Heartbeat Stat */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2c0817] via-[#3a0a1f] to-[#2c0817] border border-[#e6be6d]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rose-600/30 border border-rose-400 flex items-center justify-center text-rose-400 animate-pulse">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 block">
                Estimated Shared Heartbeats
              </span>
              <p className="font-serif-romantic text-2xl font-bold text-white">
                ~{totalHeartbeats} Beats
              </p>
            </div>
          </div>
          <Activity className="w-6 h-6 text-[#ffd700] animate-bounce" />
        </div>

        {/* Sweet quote */}
        <p className="text-center font-serif-romantic text-sm text-[#fedee6] italic">
          “And I would count every single heartbeat with you all over again.” ❤️
        </p>
      </motion.div>
    </div>
  );
};
