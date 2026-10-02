import React from 'react';
import { X, Sparkles, Heart } from 'lucide-react';
import { DailyLoveNoteCard } from './DailyLoveNoteCard';
import { sound } from '../services/soundEffects';

interface DailyLoveNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOpenWhenModal?: () => void;
}

export const DailyLoveNoteModal: React.FC<DailyLoveNoteModalProps> = ({
  isOpen,
  onClose,
  onOpenOpenWhenModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#140a13] border border-[#ff7597]/40 rounded-3xl shadow-2xl overflow-hidden text-[#f7f2ea] flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#3d1320] flex items-center justify-between bg-gradient-to-r from-[#200a18] via-[#2a0e20] to-[#200a18]">
          <div className="flex items-center gap-2">
            <span className="text-xl">💌</span>
            <div>
              <h3 className="font-serif-romantic text-lg sm:text-xl font-bold tracking-wide text-[#faf2eb] flex items-center gap-2">
                Today's Love Note for Sammm
                <Sparkles className="w-4 h-4 text-[#ffd700] animate-spin" />
              </h3>
              <p className="text-[11px] font-mono text-[#ff8da8]">
                From Radhika with all my heart • A new romantic affirmation every day
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Daily Note"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <DailyLoveNoteCard onOpenOpenWhenModal={onOpenOpenWhenModal} />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#3d1320] bg-[#10070e] flex items-center justify-between">
          <span className="text-xs text-stone-400 font-mono italic flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            Always written for you, my doctor.
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-gradient-to-r from-[#85182a] to-[#a32238] hover:from-[#a32238] hover:to-[#85182a] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Back to Story
          </button>
        </div>
      </div>
    </div>
  );
};
