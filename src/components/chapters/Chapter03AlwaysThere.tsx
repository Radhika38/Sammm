import React, { useState } from 'react';
import { ArrowRight, Phone, PhoneOff, Moon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { sound } from '../../services/soundEffects';
import { ChapterContentBlocksSection } from '../ChapterContentBlocksSection';
import { ContentBlockData } from '../../data/contentBlocks';

interface Chapter03AlwaysThereProps {
  chatPhotoUrl?: string;
  onReplaceChatPhoto: () => void;
  onNext: () => void;
  onTriggerEasterEgg: (eggId: string) => void;
}

const DEFAULT_CH03_BLOCKS: ContentBlockData[] = [
  {
    id: 'ch03-chat-card',
    type: 'photo',
    title: 'Our 2 AM Late-Night Calls & Chats',
    subtitle: 'ALWAYS AVAILABLE',
    body: 'Replying within seconds no matter what you were doing. Staying on call until 3 AM just so I felt heard.',
    mediaKey: 'ADD_CHAT_SCREENSHOTS_HERE',
  },
  {
    id: 'ch03-safe-space',
    type: 'text',
    title: 'My Safe Space When I Cried',
    subtitle: 'UNCONDITIONAL CARE',
    body: 'Main roti hui bhi tari pase aavi jati hati. Without saying many words, you made me feel completely safe and deeply cared for.',
    mediaKey: 'ADD_CH03_EXTRA_MEDIA',
  },
];

export const Chapter03AlwaysThere: React.FC<Chapter03AlwaysThereProps> = ({
  chatPhotoUrl,
  onNext,
  onTriggerEasterEgg,
}) => {
  const [callAnswered, setCallAnswered] = useState(false);

  const handleAnswerCall = () => {
    sound.playNotification();
    setCallAnswered(true);
    onTriggerEasterEgg('egg-call');
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
          Chapter 03
        </span>
        <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
          <Moon className="w-3.5 h-3.5 text-[#e6be6d]" />
          Somewhere In Between
        </span>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center space-y-4 mb-8"
      >
        <div className="inline-flex p-3 rounded-full bg-[#1e0d16] border border-[#6b1b2d] text-[#e6be6d] shadow-lg">
          <Moon className="w-7 h-7" />
        </div>
        <h2 className="font-serif-romantic text-3xl sm:text-5xl font-bold tracking-tight text-[#faf2ea]">
          “You were always there.”
        </h2>
        <p className="text-stone-300 font-serif-romantic italic text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
          There was a time when I didn’t even realize how important you were becoming to me.
        </p>
      </motion.div>

      {/* Interactive Phone Simulation */}
      <div className="max-w-md mx-auto w-full bg-[#100812] border-4 border-[#2d1420] rounded-[40px] p-5 shadow-2xl relative mb-10">
        <div className="w-24 h-4 bg-[#1a0a14] rounded-full mx-auto mb-4 border border-white/5" />

        {!callAnswered ? (
          <div className="py-8 text-center space-y-8 animate-fade-in">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#ff8da8] tracking-widest uppercase">
                Incoming Call…
              </span>
              <h3 className="font-serif-romantic text-3xl font-bold text-white flex items-center justify-center gap-2">
                <span>Sammm</span>
                <span className="text-rose-500 animate-pulse">❤️</span>
              </h3>
              <p className="text-xs text-stone-400">Mobile • Calling you late at night...</p>
            </div>

            <div className="w-24 h-24 rounded-full bg-[#3d1320] border-2 border-[#e6be6d]/50 mx-auto flex items-center justify-center text-4xl shadow-lg animate-pulse">
              🩺
            </div>

            <div className="flex items-center justify-around pt-6 px-4">
              <button
                onClick={() => {
                  sound.playClick();
                  handleAnswerCall();
                }}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-rose-600/40 border border-rose-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <PhoneOff className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-stone-400">Can't Decline ❤️</span>
              </button>

              <button
                onClick={handleAnswerCall}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50 group-hover:scale-110 transition-transform animate-bounce">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-emerald-400 font-bold">Answer Call</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4 animate-scale-up">
            <span className="text-xs font-mono text-emerald-400 font-bold tracking-widest uppercase flex items-center justify-center gap-1">
              <span>●</span> Connected (02:47 AM)
            </span>
            <div className="w-20 h-20 rounded-full bg-emerald-900/30 border-2 border-emerald-400 mx-auto flex items-center justify-center text-3xl">
              🌙
            </div>
            <p className="font-serif-romantic text-xl text-white">
              “Hey... are you okay? I'm right here listening.”
            </p>
            <p className="text-xs font-mono text-[#e6be6d]">
              Call Duration: 3 hours, 42 minutes ❤️
            </p>
          </div>
        )}
      </div>

      {/* EDITABLE CONTENT BLOCKS (Photos, Videos, Text) */}
      <ChapterContentBlocksSection
        chapterId="ch03"
        defaultBlocks={DEFAULT_CH03_BLOCKS}
        mediaConfig={chatPhotoUrl ? { ADD_CHAT_SCREENSHOTS_HERE: chatPhotoUrl } : {}}
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
          <span>CONTINUE TO CHAPTER 4</span>
          <ArrowRight className="w-4 h-4 text-[#ffd700] group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
