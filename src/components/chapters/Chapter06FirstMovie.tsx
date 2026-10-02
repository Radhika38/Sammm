import React, { useState } from 'react';
import { ArrowRight, Film, Scissors, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { sound } from '../../services/soundEffects';
import { ChapterContentBlocksSection } from '../ChapterContentBlocksSection';
import { ContentBlockData } from '../../data/contentBlocks';

interface Chapter06FirstMovieProps {
  moviePhotoUrl?: string;
  onReplaceMoviePhoto: () => void;
  onDirectUploadMoviePhoto?: (dataUrl: string) => void;
  onNext: () => void;
  onTriggerEasterEgg: (eggId: string) => void;
}

const DEFAULT_CH06_BLOCKS: ContentBlockData[] = [
  {
    id: 'ch06-movie-photo',
    type: 'photo',
    title: 'First Movie: Obsession 🎬',
    subtitle: 'JUST FRIENDS ERA',
    body: 'Sitting in the dark theater, sharing popcorn, and pretending we were just buddies when our hearts were racing the whole time.',
    mediaKey: 'ADD_FIRST_MOVIE_PHOTO_HERE',
  },
  {
    id: 'ch06-denial-text',
    type: 'text',
    title: 'The "Just Friends" Lie We Kept Telling',
    subtitle: 'PEAK DENIAL',
    body: 'Everybody else could clearly see what was happening between us, except the two of us who were too stubborn and shy to admit it.',
    mediaKey: 'ADD_CH06_EXTRA_MEDIA',
  },
];

export const Chapter06FirstMovie: React.FC<Chapter06FirstMovieProps> = ({
  moviePhotoUrl,
  onDirectUploadMoviePhoto,
  onNext,
  onTriggerEasterEgg,
}) => {
  const [ticketTorn, setTicketTorn] = useState(false);

  const handleTearTicket = () => {
    sound.playTicketTear();
    setTicketTorn(true);
    setTimeout(() => {
      sound.playNotification();
      onTriggerEasterEgg('egg-movie');
    }, 600);
  };

  return (
    <section className="min-h-screen py-16 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col justify-center relative select-none">
      {/* Chapter Tag */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-4"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-[#e6be6d] bg-[#3d0f1b]/60 px-3 py-1 rounded-full border border-[#85182a]/50">
          Chapter 06
        </span>
        <span className="text-xs text-stone-400 font-mono">02 JUNE 2026</span>
      </motion.div>

      {/* Date & Title */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center space-y-3 mb-8"
      >
        <div className="font-serif-romantic text-4xl sm:text-6xl font-extrabold tracking-tight text-[#faf4ee] glow-text-gold">
          02 JUNE 2026
        </div>
        <h2 className="font-serif-romantic text-2xl sm:text-4xl text-[#d4af37] flex items-center justify-center gap-2">
          <span>OUR FIRST MOVIE</span>
          <span>🎬</span>
        </h2>
      </motion.div>

      {/* Cinema Ticket Tear Interaction */}
      <div className="my-6 max-w-lg mx-auto w-full">
        <div
          onClick={!ticketTorn ? handleTearTicket : undefined}
          className={`relative bg-[#fcf5e8] text-[#1c1214] rounded-2xl shadow-2xl overflow-hidden border-2 border-[#dfc599] transition-all cursor-pointer ${
            ticketTorn ? 'shadow-[#85182a]/40' : 'hover:scale-[1.02]'
          }`}
        >
          <div className="bg-[#85182a] text-[#fffdfa] p-4 flex items-center justify-between border-b border-[#a12339]">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-[#e6be6d]" />
              <span className="font-mono text-xs uppercase tracking-widest font-bold">
                Cineworld Premiere Admit Two
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#e6be6d]">02.06.2026</span>
          </div>

          <div className="p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block">
                  MOVIE TITLE
                </span>
                <h3 className="font-serif-romantic text-2xl font-black text-[#85182a]">
                  OBSESSION
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block">
                  RELATIONSHIP STATUS
                </span>
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                  “JUST FRIENDS” 😂
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-stone-300 flex items-center justify-between text-xs font-mono text-stone-600">
              <span>{ticketTorn ? '✅ TICKET TORN' : '✂️ TAP TICKET TO TEAR'}</span>
              <span>SEATS: BACK ROW ❤️</span>
            </div>
          </div>
        </div>
      </div>

      {/* EDITABLE CONTENT BLOCKS (Photos, Videos, Text) */}
      <ChapterContentBlocksSection
        chapterId="ch06"
        defaultBlocks={DEFAULT_CH06_BLOCKS}
        onUploadMedia={onDirectUploadMoviePhoto ? (k, data) => onDirectUploadMoviePhoto(data) : undefined}
        mediaConfig={moviePhotoUrl ? { ADD_FIRST_MOVIE_PHOTO_HERE: moviePhotoUrl } : {}}
      />

      {/* Next Button */}
      <div className="flex justify-end pt-6">
        <button
          onClick={() => {
            sound.playPageTurn();
            onNext();
          }}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#85182a] via-[#a8223b] to-[#85182a] hover:from-[#9c1a32] hover:to-[#be2744] text-white font-serif-romantic font-bold text-base rounded-full shadow-[0_0_25px_rgba(133,24,42,0.45)] hover:shadow-[0_0_35px_rgba(230,190,109,0.5)] transition-all hover:scale-105 cursor-pointer border border-[#e6be6d]/50"
        >
          <span>CONTINUE TO CHAPTER 7</span>
          <ArrowRight className="w-4 h-4 text-[#ffd700] group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
