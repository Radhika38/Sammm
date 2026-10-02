import React, { useState } from 'react';
import { ArrowRight, Activity, Stethoscope, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { sound } from '../../services/soundEffects';
import { ChapterContentBlocksSection } from '../ChapterContentBlocksSection';
import { ContentBlockData } from '../../data/contentBlocks';

interface Chapter10DoctorSammmProps {
  doctorPhotoUrl?: string;
  onReplaceDoctorPhoto: () => void;
  onDirectUploadDoctorPhoto?: (dataUrl: string) => void;
  onNext: () => void;
}

const DEFAULT_CH10_BLOCKS: ContentBlockData[] = [
  {
    id: 'ch10-doctor-photo',
    type: 'photo',
    title: 'Dr. Sammm • White Coat Dream 🩺✨',
    subtitle: 'STETHOSCOPE & PASSION',
    body: 'Harrison’s, Pathology, white coat, and that stethoscope. You’re going to be the most wonderful, caring doctor in the whole world!',
    mediaKey: 'ADD_HIS_DREAM_PHOTO_HERE',
  },
  {
    id: 'ch10-support-text',
    type: 'text',
    title: 'Your Proudest Cheerleader For Life',
    subtitle: 'ALWAYS BY YOUR SIDE',
    body: 'Through every sleepless night, through every grueling exam and round, I will be right here cheering for you and celebrating your every milestone.',
    mediaKey: 'ADD_CH10_EXTRA_MEDIA',
  },
];

export const Chapter10DoctorSammm: React.FC<Chapter10DoctorSammmProps> = ({
  doctorPhotoUrl,
  onDirectUploadDoctorPhoto,
  onNext,
}) => {
  const [activeStep, setActiveStep] = useState(4);

  const careerSteps = [
    { title: 'Today', subtitle: 'Late nights & quiet dedication', icon: '📖' },
    { title: 'Hard Work', subtitle: 'Every sacrifice and revision', icon: '🧠' },
    { title: 'Exams', subtitle: 'Pushing through the tough days', icon: '✍️' },
    { title: 'Success', subtitle: 'The day your dreams come alive', icon: '🌟' },
    { title: 'Doctor Sammm', subtitle: 'White coat & stethoscope ❤️', icon: '🩺' },
  ];

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
          Chapter 10
        </span>
        <span className="text-xs text-stone-400 font-mono flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          Pulse & Passion
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
        <div className="inline-flex p-3 rounded-full bg-[#182329] border border-cyan-800 text-cyan-300 shadow-xl">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h2 className="font-serif-romantic text-3xl sm:text-6xl font-black text-white glow-text-gold">
          Doctor Sammm 🩺
        </h2>
        <p className="font-serif-romantic text-xl sm:text-2xl text-[#f5ece0] italic">
          “I know you will become an incredible doctor.”
        </p>
      </motion.div>

      {/* Roadmap Timeline */}
      <div className="bg-[#0f171b] border-2 border-cyan-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-6">
        <span className="text-xs font-mono text-stone-400 uppercase tracking-widest block text-center">
          ROADMAP TO THE WHITE COAT:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {careerSteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => {
                sound.playClick();
                setActiveStep(idx);
              }}
              className={`p-3 rounded-xl border text-center space-y-1 transition-all cursor-pointer ${
                activeStep >= idx
                  ? 'bg-[#14232c] border-cyan-500/80 text-white shadow-md'
                  : 'bg-[#0a0f12] border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-2xl block">{step.icon}</span>
              <p className="font-bold text-xs">{step.title}</p>
              <p className="text-[10px] text-stone-400 leading-tight">{step.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* EDITABLE CONTENT BLOCKS (Photos, Videos, Text) */}
      <ChapterContentBlocksSection
        chapterId="ch10"
        defaultBlocks={DEFAULT_CH10_BLOCKS}
        onUploadMedia={onDirectUploadDoctorPhoto ? (k, data) => onDirectUploadDoctorPhoto(data) : undefined}
        mediaConfig={doctorPhotoUrl ? { ADD_HIS_DREAM_PHOTO_HERE: doctorPhotoUrl } : {}}
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
          <span>OPEN FINAL SURPRISE 🎁</span>
          <ArrowRight className="w-4 h-4 text-[#ffd700] group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
