import React from 'react';
import { X, Sparkles, Calendar, Clock } from 'lucide-react';
import { RelationshipMilestones } from './RelationshipMilestones';
import { sound } from '../services/soundEffects';

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToChapter?: (chapterNum: number) => void;
  onOpenOpenWhenModal?: () => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({
  isOpen,
  onClose,
  onNavigateToChapter,
  onOpenOpenWhenModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#140a13] border border-[#ff7597]/40 rounded-3xl shadow-2xl overflow-hidden text-[#f7f2ea] flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#3d1320] flex items-center justify-between bg-gradient-to-r from-[#200a18] via-[#2a0e20] to-[#200a18]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <Clock className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-serif-romantic text-lg sm:text-xl font-bold tracking-wide text-[#faf2eb] flex items-center gap-2">
                Relationship Milestones Timeline
                <Sparkles className="w-4 h-4 text-[#ffd700] animate-spin" />
              </h3>
              <p className="text-[11px] font-mono text-[#ff8da8]">
                10 Major Dates & Turning Points from 03 May 2026 to Forever
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Milestones"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <RelationshipMilestones
            onNavigateToChapter={(ch) => {
              if (onNavigateToChapter) {
                onNavigateToChapter(ch);
                onClose();
              }
            }}
            onOpenOpenWhenModal={onOpenOpenWhenModal}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#3d1320] bg-[#10070e] flex items-center justify-between">
          <span className="text-xs text-stone-400 font-mono italic">
            Click any milestone card to view its story chapter or react with hearts.
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
