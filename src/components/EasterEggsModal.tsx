import React from 'react';
import { X, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { EASTER_EGGS_LIST } from '../data/mediaConfig';
import { sound } from '../services/soundEffects';

interface EasterEggsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedEggIds: string[];
}

export const EasterEggsModal: React.FC<EasterEggsModalProps> = ({
  isOpen,
  onClose,
  unlockedEggIds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#140b15] border border-[#6b1b2d] rounded-2xl shadow-2xl p-6 text-[#f7f2ea] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3b111e] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e6be6d]" />
            <h3 className="font-serif-romantic text-xl font-bold text-white">
              Secret Easter Eggs Tracker 🥚
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed font-sans">
          There are 5 hidden easter eggs placed throughout the story. Tap the hidden clues to unlock secret notes!
        </p>

        {/* Eggs list */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {EASTER_EGGS_LIST.map((egg) => {
            const isUnlocked = unlockedEggIds.includes(egg.id);

            return (
              <div
                key={egg.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-[#29101d] border-[#e6be6d]/80 text-white shadow-md'
                    : 'bg-[#10070e] border-[#380e1a] text-stone-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-[#e6be6d]" />
                    ) : (
                      <Lock className="w-4 h-4 text-stone-600" />
                    )}
                    <h4 className="text-sm font-semibold">{egg.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-stone-400">
                    Chapter {egg.chapter}
                  </span>
                </div>

                {isUnlocked ? (
                  <p className="text-xs text-[#ff99b3] font-handwriting text-base mt-1.5 pl-6">
                    "{egg.message}"
                  </p>
                ) : (
                  <p className="text-[11px] text-stone-400 italic mt-1 pl-6">
                    Hint: {egg.triggerHint}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-[#3b111e] text-xs font-mono text-stone-400">
          <span>Total Discovered:</span>
          <span className="text-[#e6be6d] font-bold">
            {unlockedEggIds.length} of {EASTER_EGGS_LIST.length}
          </span>
        </div>
      </div>
    </div>
  );
};
