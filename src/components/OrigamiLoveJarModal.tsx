import React from 'react';
import { X, Sparkles, Star } from 'lucide-react';
import { OrigamiLoveJar } from './OrigamiLoveJar';
import { sound } from '../services/soundEffects';

interface OrigamiLoveJarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTimeline?: () => void;
}

export const OrigamiLoveJarModal: React.FC<OrigamiLoveJarModalProps> = ({
  isOpen,
  onClose,
  onOpenTimeline,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#140a13] border border-[#ffd700]/40 rounded-3xl shadow-2xl overflow-hidden text-[#f7f2ea] flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#3d1320] flex items-center justify-between bg-gradient-to-r from-[#200a18] via-[#2a130e] to-[#200a18]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-serif-romantic text-lg sm:text-xl font-bold tracking-wide text-[#faf2eb] flex items-center gap-2">
                The Origami Love Jar
                <Sparkles className="w-4 h-4 text-[#ffd700] animate-spin" />
              </h3>
              <p className="text-[11px] font-mono text-amber-300/80">
                100 Folded Stars • 100 Real Reasons Why I Adore You, Sammm
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Love Jar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <OrigamiLoveJar onOpenTimeline={onOpenTimeline} />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#3d1320] bg-[#10070e] flex items-center justify-between">
          <span className="text-xs text-stone-400 font-mono italic">
            Shake the jar anytime to draw a new origami love note.
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-gradient-to-r from-[#85182a] to-[#a32238] hover:from-[#a32238] hover:to-[#85182a] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Close & Read Story
          </button>
        </div>
      </div>
    </div>
  );
};
