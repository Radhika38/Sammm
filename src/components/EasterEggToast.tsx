import React from 'react';
import { Sparkles, X, Heart } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface EasterEggToastProps {
  egg: { id: string; title: string; message: string } | null;
  onClose: () => void;
}

export const EasterEggToast: React.FC<EasterEggToastProps> = ({ egg, onClose }) => {
  if (!egg) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full mx-4 sm:mx-0 animate-bounce-subtle pointer-events-auto">
      <div className="relative p-4 rounded-2xl bg-gradient-to-r from-[#3d0f1b] via-[#521323] to-[#260a12] border-2 border-[#e6be6d]/80 text-[#faf4ee] shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Glow accent */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#e6be6d]/20 rounded-full blur-xl" />

        <div className="flex items-start gap-3 relative z-10">
          <div className="p-2.5 rounded-xl bg-[#85182a] border border-[#e6be6d]/40 text-[#e6be6d] shrink-0 shadow-md">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>

          <div className="flex-1 pr-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#e6be6d] uppercase">
              <Heart className="w-3 h-3 fill-current text-[#ff7597]" />
              <span>Secret Easter Egg Unlocked!</span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-0.5">{egg.title}</h4>
            <p className="text-xs text-[#f5d7de] mt-1 leading-snug font-handwriting text-base">
              "{egg.message}"
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
