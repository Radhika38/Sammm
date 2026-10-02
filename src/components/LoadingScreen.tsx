import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, ArrowRight, Heart } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface LoadingScreenProps {
  onStartStory: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onStartStory }) => {
  const [progress, setProgress] = useState(12);
  const [stage, setStage] = useState<'counting' | 'error' | 'revelation'>('counting');

  useEffect(() => {
    // 12% -> 37% -> 68% -> 99%
    const t1 = setTimeout(() => {
      setProgress(37);
      sound.playClick();
    }, 700);

    const t2 = setTimeout(() => {
      setProgress(68);
      sound.playClick();
    }, 1400);

    const t3 = setTimeout(() => {
      setProgress(99);
      sound.playClick();
    }, 2100);

    const t4 = setTimeout(() => {
      setStage('error');
      sound.playNotification();
    }, 2800);

    const t5 = setTimeout(() => {
      setStage('revelation');
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090508] text-[#f7f2ea] px-6 select-none overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-radial from-[#660f24]/30 via-[#2e0510]/15 to-transparent blur-3xl pointer-events-none" />

      {/* Floating stars */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center">
        {stage === 'counting' && (
          <div className="space-y-6 w-full animate-fade-in">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-[#521323] border-t-[#e6be6d] animate-spin" />
              <Heart className="w-8 h-8 text-[#e6be6d] absolute fill-current/30 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif-romantic text-2xl sm:text-3xl text-[#faf2eb] tracking-wide">
                Loading our story…
              </h2>
              <p className="text-xs font-mono text-[#d8af65] tracking-widest uppercase">
                Synchronizing dates & memories
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#1e0a13] h-2.5 rounded-full overflow-hidden border border-[#521323] p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#85182a] via-[#c73855] to-[#e6be6d] rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-xl font-bold text-[#faf2eb] tracking-wider block">
              {progress}%
            </span>
          </div>
        )}

        {stage === 'error' && (
          <div className="space-y-5 animate-scale-up">
            <div className="inline-flex p-4 rounded-full bg-[#3d0914] border border-[#a11f35] text-[#ff7597] shadow-xl">
              <AlertTriangle className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#ff577d] tracking-widest uppercase bg-[#2e0510] px-3 py-1 rounded-full border border-[#ff577d]/30">
                SYSTEM EXCEPTION 404
              </span>
              <h2 className="font-serif-romantic text-3xl sm:text-4xl text-[#faf4ee] pt-2">
                “Just Friends Not Found.” 😂
              </h2>
            </div>
            <p className="text-xs text-stone-400 font-mono">
              Attempting failover to undeniable romantic chemistry...
            </p>
          </div>
        )}

        {stage === 'revelation' && (
          <div className="space-y-7 animate-fade-in w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3d1320] border border-[#e6be6d]/40 text-[#e6be6d] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Incident Report</span>
            </div>

            <div className="space-y-3">
              <p className="font-serif-romantic text-2xl sm:text-3xl text-[#faf2eb] leading-snug">
                “Actually… something went seriously wrong on{' '}
                <span className="text-[#e6be6d] font-bold underline decoration-[#85182a] decoration-2 underline-offset-4">
                  3 May 2026
                </span>
                .”
              </p>
              <p className="text-sm text-[#d4b9c1] font-sans">
                (And by wrong, I mean the best mistake ever.)
              </p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onStartStory();
              }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#85182a] via-[#a8223a] to-[#731323] hover:from-[#9c1f34] hover:to-[#85182a] text-[#fffdfa] font-semibold text-sm sm:text-base shadow-xl hover:shadow-[#85182a]/40 transition-all duration-300 hover:scale-105 border border-[#e6be6d]/40 cursor-pointer"
            >
              <span>FIND OUT WHAT HAPPENED</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#e6be6d]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
