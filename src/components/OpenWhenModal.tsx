import React, { useState, useEffect } from 'react';
import { X, Mail, Heart, Sparkles, Moon, Stethoscope, HeartHandshake, RefreshCw, PhoneCall, Check, ArrowLeft, Volume2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { OPEN_WHEN_ENVELOPES, OpenWhenEnvelope, MISS_YOU_REASONS, STUDY_PEPTALKS } from '../data/openWhenData';
import { sound } from '../services/soundEffects';

interface OpenWhenModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEnvelopeId?: string | null;
}

export const OpenWhenModal: React.FC<OpenWhenModalProps> = ({
  isOpen,
  onClose,
  initialEnvelopeId,
}) => {
  const [selectedEnvelope, setSelectedEnvelope] = useState<OpenWhenEnvelope | null>(null);
  const [isLetterUnsealed, setIsLetterUnsealed] = useState<boolean>(false);

  // Feature 1: Breathing Exercise State
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathingSeconds, setBreathingSeconds] = useState<number>(4);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);

  // Feature 2: Doctor Study Booster
  const [currentPeptalkIdx, setCurrentPeptalkIdx] = useState<number>(0);
  const [hasHeartbeatPlayed, setHasHeartbeatPlayed] = useState<boolean>(false);

  // Feature 3: Miss You Reasons
  const [currentMissIdx, setCurrentMissIdx] = useState<number>(0);
  const [hugCount, setHugCount] = useState<number>(0);

  // Feature 4: Fight Make Up
  const [hugSent, setHugSent] = useState<boolean>(false);

  // Set initial envelope if provided
  useEffect(() => {
    if (initialEnvelopeId) {
      const match = OPEN_WHEN_ENVELOPES.find((e) => e.id === initialEnvelopeId);
      if (match) {
        setSelectedEnvelope(match);
        setIsLetterUnsealed(true);
      }
    } else {
      setSelectedEnvelope(null);
      setIsLetterUnsealed(false);
    }
  }, [initialEnvelopeId, isOpen]);

  // Breathing loop timer
  useEffect(() => {
    let timer: any;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathingSeconds((prev) => {
          if (prev <= 1) {
            setBreathingPhase((phase) => {
              if (phase === 'Inhale') {
                sound.playCalmBell();
                setBreathingSeconds(7);
                return 'Hold';
              } else if (phase === 'Hold') {
                setBreathingSeconds(8);
                return 'Exhale';
              } else {
                setBreathingSeconds(4);
                return 'Inhale';
              }
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive]);

  if (!isOpen) return null;

  const handleOpenEnvelope = (env: OpenWhenEnvelope) => {
    sound.playClick();
    sound.playEnvelopeOpen();
    setSelectedEnvelope(env);
    setIsLetterUnsealed(true);

    if (env.interactiveFeature === 'breathing') {
      setIsBreathingActive(true);
      sound.playCalmBell();
    }
  };

  const handleBackToEnvelopes = () => {
    sound.playClick();
    setIsBreathingActive(false);
    setIsLetterUnsealed(false);
    setSelectedEnvelope(null);
  };

  const handleSendFightHug = () => {
    sound.playTightHug();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff7597', '#85182a', '#e6be6d'],
    });
    setHugSent(true);
    setTimeout(() => setHugSent(false), 4500);
  };

  const handleSendMissHug = () => {
    sound.playTightHug();
    setHugCount((c) => c + 1);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#ff7597', '#ffffff'],
    });
  };

  const handleNextMissReason = () => {
    sound.playClick();
    setCurrentMissIdx((prev) => (prev + 1) % MISS_YOU_REASONS.length);
  };

  const handleNextPeptalk = () => {
    sound.playClick();
    sound.playChime();
    setCurrentPeptalkIdx((prev) => (prev + 1) % STUDY_PEPTALKS.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-3xl bg-[#140a14] border-2 border-[#85182a]/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#85182a] via-[#ab223c] to-[#591021] p-4 sm:p-5 flex items-center justify-between text-white border-b border-[#e6be6d]/30">
          <div className="flex items-center gap-3">
            {selectedEnvelope ? (
              <button
                onClick={handleBackToEnvelopes}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-[#e6be6d] transition-colors cursor-pointer border border-white/10"
                title="Back to All Envelopes"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="p-2.5 rounded-full bg-black/30 text-[#e6be6d] border border-white/20">
                <Mail className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#e6be6d] font-bold">
                  Personal Care Bundle
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/20 text-white font-bold">
                  FOR SAMMM ONLY 💌
                </span>
              </div>
              <h2 className="font-serif-romantic text-lg sm:text-xl font-bold tracking-tight">
                {selectedEnvelope ? selectedEnvelope.envelopeNumber : '“Open When…” Sealed Letters'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsBreathingActive(false);
              onClose();
            }}
            className="p-2 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <AnimatePresence mode="wait">
            {!selectedEnvelope ? (
              /* Envelopes Grid View */
              <motion.div
                key="envelopes-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h3 className="font-serif-romantic text-xl sm:text-2xl font-bold text-white">
                    Whenever you need me, pick an envelope.
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-lg mx-auto">
                    Four sealed digital envelopes crafted with all my love for your late nights, tough study days, moments of longing, or little disagreements.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {OPEN_WHEN_ENVELOPES.map((env) => {
                    return (
                      <div
                        key={env.id}
                        onClick={() => handleOpenEnvelope(env)}
                        className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between bg-gradient-to-br ${env.theme.bgGradient} ${env.theme.border} hover:scale-[1.02] hover:shadow-2xl`}
                      >
                        {/* Background subtle watermark icon */}
                        <div className="absolute right-3 bottom-3 opacity-10 pointer-events-none transform group-hover:scale-110 transition-transform">
                          {env.id === 'overthinking-2am' && <Moon className="w-24 h-24" />}
                          {env.id === 'medical-exams' && <Stethoscope className="w-24 h-24" />}
                          {env.id === 'miss-me' && <Heart className="w-24 h-24" />}
                          {env.id === 'had-a-fight' && <HeartHandshake className="w-24 h-24" />}
                        </div>

                        {/* Top Tag & Number */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#e6be6d] font-bold">
                            {env.envelopeNumber}
                          </span>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white/90 border border-white/10"
                            style={{ backgroundColor: `${env.theme.accentColor}33` }}
                          >
                            {env.tag}
                          </span>
                        </div>

                        {/* Envelope Title */}
                        <div className="py-4 space-y-1.5 relative z-10">
                          <h4 className="font-serif-romantic text-lg sm:text-xl font-bold text-white group-hover:text-[#fbebd5] transition-colors">
                            {env.title}
                          </h4>
                          <p className="text-xs text-stone-400 line-clamp-2">
                            {env.subtitle}
                          </p>
                        </div>

                        {/* Bottom Wax Seal Simulation */}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md border border-white/20"
                              style={{ backgroundColor: env.theme.sealColor }}
                            >
                              {env.theme.sealText.split(' ')[0]}
                            </div>
                            <span className="text-xs font-mono text-stone-300">
                              Sealed with love
                            </span>
                          </div>

                          <span className="text-xs font-mono font-bold text-[#e6be6d] group-hover:underline flex items-center gap-1">
                            Break Seal & Read →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* Single Envelope Unfolded Letter View */
              <motion.div
                key={selectedEnvelope.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="space-y-6"
              >
                {/* Envelope Top Banner */}
                <div
                  className={`p-5 rounded-2xl border bg-gradient-to-r ${selectedEnvelope.theme.bgGradient} ${selectedEnvelope.theme.border} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg`}
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#e6be6d] font-bold">
                      {selectedEnvelope.tag}
                    </span>
                    <h3 className="font-serif-romantic text-xl sm:text-2xl font-bold text-white">
                      {selectedEnvelope.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBackToEnvelopes}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-stone-200 transition-colors cursor-pointer border border-white/10"
                    >
                      Browse Other Envelopes
                    </button>
                  </div>
                </div>

                {/* Parchment Styled Letter Paper */}
                <div className="bg-[#fbf6ed] text-[#29131d] border-2 border-[#dfcfb9] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 selection:bg-[#85182a] selection:text-white">
                  {/* Salutation */}
                  <div>
                    <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 font-bold block mb-1">
                      {selectedEnvelope.envelopeNumber}
                    </span>
                    <h2 className="font-handwriting text-3xl sm:text-4xl text-[#85182a] font-bold">
                      {selectedEnvelope.salutation}
                    </h2>
                  </div>

                  {/* Guiding Warm Advice */}
                  <div className="p-4 rounded-xl bg-[#f2e6d2] border border-[#d6c4a8] text-sm sm:text-base font-serif-romantic italic text-[#4a2130]">
                    💡 {selectedEnvelope.guidingNote}
                  </div>

                  {/* Letter Paragraphs */}
                  <div className="space-y-3.5 text-base sm:text-lg leading-relaxed text-[#2a131e]">
                    {selectedEnvelope.coreLetter.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {/* Iconic Gujarati Punchline */}
                  {selectedEnvelope.gujaratiPunchline && (
                    <div className="p-4 rounded-2xl bg-[#fae5e9] border border-[#f0bac4] text-center shadow-inner">
                      <p className="font-handwriting text-2xl sm:text-3xl text-[#85182a] font-bold">
                        {selectedEnvelope.gujaratiPunchline}
                      </p>
                    </div>
                  )}

                  {/* INTERACTIVE FEATURE BLOCK SPECIFIC TO EACH ENVELOPE */}

                  {/* 1. Breathing Exercise for 2 AM Anxiety */}
                  {selectedEnvelope.interactiveFeature === 'breathing' && (
                    <div className="pt-4 border-t border-[#dfcfb9] space-y-4">
                      <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#85182a] font-bold">
                          Interactive 4-7-8 Breathing Anchor
                        </span>
                        <p className="text-xs text-stone-600">
                          Sync your breath with the circle to lower your heart rate right now.
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-center py-6">
                        <motion.div
                          animate={{
                            scale:
                              breathingPhase === 'Inhale'
                                ? [1, 1.45]
                                : breathingPhase === 'Hold'
                                ? 1.45
                                : [1.45, 1],
                          }}
                          transition={{
                            duration:
                              breathingPhase === 'Inhale'
                                ? 4
                                : breathingPhase === 'Hold'
                                ? 7
                                : 8,
                            ease: 'easeInOut',
                          }}
                          className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#85182a] to-[#c084fc] flex flex-col items-center justify-center text-white shadow-2xl relative"
                        >
                          <span className="text-sm font-mono uppercase tracking-widest font-bold">
                            {breathingPhase}
                          </span>
                          <span className="text-3xl font-serif-romantic font-extrabold">
                            {breathingSeconds}s
                          </span>
                        </motion.div>

                        <div className="flex gap-3 pt-6">
                          <button
                            onClick={() => {
                              sound.playCalmBell();
                            }}
                            className="px-4 py-2 rounded-full bg-[#ebd5df] hover:bg-[#dfc2ce] text-[#85182a] font-mono text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-[#85182a]/30"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Play Peace Bell 🎐</span>
                          </button>

                          <button
                            onClick={() => {
                              sound.playClick();
                              setIsBreathingActive(!isBreathingActive);
                            }}
                            className="px-4 py-2 rounded-full bg-[#85182a] text-white font-mono text-xs font-bold hover:bg-[#a32238] transition-colors cursor-pointer"
                          >
                            {isBreathingActive ? 'Pause Exercise' : 'Start Guided Breath'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Doctor Sammm Prescription & Heartbeat for Medical Exams */}
                  {selectedEnvelope.interactiveFeature === 'prescription' && (
                    <div className="pt-4 border-t border-[#dfcfb9] space-y-4">
                      {/* Clinical Prescription Badge */}
                      <div className="bg-[#f0f9f8] border-2 border-[#14b8a6]/50 rounded-2xl p-5 text-stone-800 space-y-3 font-mono shadow-sm">
                        <div className="flex items-center justify-between border-b border-[#14b8a6]/30 pb-2">
                          <div className="flex items-center gap-2 text-[#0f766e] font-bold">
                            <Stethoscope className="w-5 h-5" />
                            <span>Dr. Sammm's Heart Clinic</span>
                          </div>
                          <span className="text-xs text-stone-500">Rx No. 31-MAY-LOVE</span>
                        </div>

                        <div className="text-xs space-y-1">
                          <p><strong>Patient:</strong> Sammm (The Best Future Doctor)</p>
                          <p><strong>Prescribed By:</strong> Radhika (Your #1 Fan & Cheerleader)</p>
                          <p><strong>Diagnosis:</strong> Temporary Study Fatigue / Exam Pressure</p>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-[#99f6e4] text-xs space-y-1 text-[#0f766e]">
                          <p className="font-bold">Rx Treatment Plan:</p>
                          <p>1. Unshakeable faith in your intelligence (100% dosage).</p>
                          <p>2. Mandatory glass of water + 10-minute stretch right now.</p>
                          <p>3. Unlimited hugs & pride waiting for you on graduation day.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <button
                            onClick={() => {
                              sound.playHeartbeat();
                              setHasHeartbeatPlayed(true);
                              setTimeout(() => setHasHeartbeatPlayed(false), 3000);
                            }}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Stethoscope className="w-4 h-4" />
                            <span>
                              {hasHeartbeatPlayed ? 'Thump... Thump... Cheering!' : 'Listen to My Heart Cheering'}
                            </span>
                          </button>

                          <button
                            onClick={handleNextPeptalk}
                            className="py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-[#0f766e] border border-[#14b8a6] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Next Boost Quote</span>
                          </button>
                        </div>

                        <div className="p-3 rounded-lg bg-[#e6fffa] border border-[#b2f5ea] text-xs text-center font-serif-romantic italic text-[#0d9488]">
                          {STUDY_PEPTALKS[currentPeptalkIdx]}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Memory Randomizer for Missing Me */}
                  {selectedEnvelope.interactiveFeature === 'memory-randomizer' && (
                    <div className="pt-4 border-t border-[#dfcfb9] space-y-4">
                      <div className="bg-[#fcf0f3] border border-[#f5b8c6] rounded-2xl p-5 text-center space-y-3">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#85182a] font-bold block">
                          Reason #{currentMissIdx + 1} Why I Miss You Too
                        </span>

                        <p className="font-serif-romantic text-lg sm:text-xl text-[#3b1523] italic font-medium px-2 py-2">
                          “{MISS_YOU_REASONS[currentMissIdx]}”
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <button
                            onClick={handleNextMissReason}
                            className="px-4 py-2 rounded-full bg-[#85182a] hover:bg-[#a32238] text-white text-xs font-mono font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Shuffle Another Reason</span>
                          </button>

                          <button
                            onClick={handleSendMissHug}
                            className="px-4 py-2 rounded-full bg-white hover:bg-rose-50 text-[#85182a] border border-[#f0bac4] text-xs font-mono font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                            <span>Send Instant Hug ({hugCount})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Fight Resolution & Direct Call for Open When We Had A Fight */}
                  {selectedEnvelope.interactiveFeature === 'make-up-hug' && (
                    <div className="pt-4 border-t border-[#dfcfb9] space-y-4">
                      <div className="bg-[#fef3ec] border border-[#fed7aa] rounded-2xl p-5 space-y-3">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#9a3412] font-bold block">
                          Peace Treaty for Sammm & Radhika
                        </span>
                        <p className="text-sm text-stone-700 leading-relaxed font-sans">
                          Fights are temporary, but you and I are permanent. Let’s not let five minutes of anger ruin hours of love.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={handleSendFightHug}
                            className="py-3 px-4 rounded-xl bg-[#9a3412] hover:bg-[#b43e17] text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <HeartHandshake className="w-4 h-4" />
                            <span>{hugSent ? 'Hug Delivered! ❤️' : 'Send Virtual Tight Hug 🫂'}</span>
                          </button>

                          <a
                            href="https://wa.me/?text=Chal%20na%20Sammm%2C%20fight%20bandh%20karie.%20Let%27s%20talk%20%E2%9D%A4%EF%B8%8F"
                            target="_blank"
                            rel="noreferrer"
                            className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 text-center"
                          >
                            <PhoneCall className="w-4 h-4" />
                            <span>Call Me / WhatsApp Now 💬</span>
                          </a>
                        </div>

                        {hugSent && (
                          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 text-center font-mono animate-bounce">
                            ✓ Virtual tight hug received by Radhika. Anger melting away… ❤️
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Signature */}
                  <div className="pt-6 border-t border-[#dfcfb9] flex items-center justify-between text-xs text-stone-500 font-mono">
                    <span>Forever on your side</span>
                    <span className="font-handwriting text-2xl text-[#85182a] font-bold">
                      — Your Radhika ❤️
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#170916] border-t border-[#351225] p-4 flex items-center justify-between text-xs text-stone-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#e6be6d]" />
            Love Safe Haven for Sammm
          </span>
          <button
            onClick={() => {
              sound.playClick();
              setIsBreathingActive(false);
              onClose();
            }}
            className="px-5 py-2 rounded-full bg-[#85182a] hover:bg-[#a8223a] text-white font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
