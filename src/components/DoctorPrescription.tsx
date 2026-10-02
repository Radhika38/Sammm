import React, { useState } from 'react';
import {
  Stethoscope,
  Heart,
  Sparkles,
  Pill,
  Coffee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Volume2,
  Award,
  AlertCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sound } from '../services/soundEffects';

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  indication: string;
  color: string;
  accentBg: string;
  borderColor: string;
  textColor: string;
  badgeColor: string;
  icon: 'pill' | 'coffee' | 'heart' | 'stethoscope' | 'sparkles';
  prescriptionNote: string;
  sideEffects: string;
}

export const PRESCRIPTION_MEDICINES: MedicineItem[] = [
  {
    id: 'huggocillin',
    name: 'Huggocillin 500mg',
    genericName: 'Oxytocin Prolonged-Release',
    dosage: '1 tight dose to be taken when exam stress hits peak levels.',
    indication: 'Acute pre-exam anxiety, syllabus overload, tense neck & shoulders.',
    color: '#ff577d',
    accentBg: 'from-rose-950/80 to-[#2e0e18]',
    borderColor: 'border-rose-500/60',
    textColor: 'text-rose-300',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: 'heart',
    prescriptionNote:
      'Breathe deeply, my doctor. You have put in the hours, you have the sharpest mind, and no exam question is bigger than your dedication. Close your eyes for 30 seconds and imagine my arms wrapped tightly around your neck. You’re going to ace this. I am right beside you, always.',
    sideEffects: 'Warm fuzzy feeling in the chest, sudden reduction in blood cortisol, irresistible urge to smile.',
  },
  {
    id: 'chaispirin',
    name: 'Chai-spirin 200mg',
    genericName: 'Caffeine & Ginger Infused Comfort',
    dosage: '1 warm dose for 3:00 AM hospital ward rotations and anatomy revisions.',
    indication: 'Heavy eyelids, fatigue during late-night shift revisions, brain fog.',
    color: '#e6be6d',
    accentBg: 'from-amber-950/80 to-[#2e1c0d]',
    borderColor: 'border-amber-500/60',
    textColor: 'text-amber-300',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: 'coffee',
    prescriptionNote:
      'For the 3:00 AM revisions, the long memorization charts, and heavy eyelids. Take a sip of hot ginger chai, wash your face, and remember that every single late night right now is shaping the steady hands of a doctor who will heal thousands of lives tomorrow. I believe in you so much!',
    sideEffects: 'Sudden burst of mental clarity, craving for Parle-G or Sukhdi, renewed determination to conquer the chapter.',
  },
  {
    id: 'radhikapam',
    name: 'Radhika-pam PRN',
    genericName: 'Affectionate Reassurance Sublingual',
    dosage: 'Unlimited PRN (as needed) dosage whenever you miss me.',
    indication: 'Long-distance yearning, missing cuddles, quiet moments between hospital cases.',
    color: '#c084fc',
    accentBg: 'from-purple-950/80 to-[#220d2e]',
    borderColor: 'border-purple-500/60',
    textColor: 'text-purple-300',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: 'pill',
    prescriptionNote:
      'Completely non-addictive, zero adverse side effects except spontaneous blushing. Whenever you miss my voice, my hugs, or my random late-night rants, know that I am thinking of you right at this exact second. You are never alone in this medical journey, my handsome doctor. My heart is permanently in your pocket.',
    sideEffects: 'Instant feeling of emotional safety, heartbeat synchronization, craving for 2:00 AM phone calls.',
  },
  {
    id: 'stethosmile',
    name: 'Stetho-SMILE 100mg',
    genericName: 'Confidence Booster & White Coat Elixir',
    dosage: '1 dose daily before morning hospital rounds or viva exams.',
    indication: 'Imposter syndrome, tough professors, challenging clinical viva questions.',
    color: '#38bdf8',
    accentBg: 'from-cyan-950/80 to-[#0e212b]',
    borderColor: 'border-cyan-500/60',
    textColor: 'text-cyan-300',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: 'stethoscope',
    prescriptionNote:
      'Remember the first day you decided to study medicine? Look how far you have already walked! Walk into the hospital ward with your head held high, shoulders back, and that gorgeous confident smile. You have the intellect, the empathy, and the heart of a world-class physician. Future Dr. Sammm, you own this.',
    sideEffects: 'Unstoppable clinical confidence, sharper memory recall during rounds, undeniable doctor charm.',
  },
  {
    id: 'sukhdimol',
    name: 'Sukhdi-mol Fortified',
    genericName: 'Mahudi & Bhavnath Holy Serenity Extract',
    dosage: 'As required whenever life feels overwhelming.',
    indication: 'Spiritual exhaustion, burnout, nostalgia for our sacred road trips.',
    color: '#ffd700',
    accentBg: 'from-yellow-950/80 to-[#2b200b]',
    borderColor: 'border-yellow-500/60',
    textColor: 'text-yellow-300',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    icon: 'sparkles',
    prescriptionNote:
      'A warm dose of Mahudi blessing, sweet Sukhdi warmth, and Bhavnath tranquility. When clinical cases feel overwhelming, take 60 seconds to reset your mind. Remember our road trip, the music playing in the car, and how peaceful the world felt. Tu doctor bani ne j raissss! ❤️',
    sideEffects: 'Sweet taste on the tongue, sudden calm, profound faith that everything will turn out beautifully.',
  },
];

export const DoctorPrescription: React.FC = () => {
  const [activeMedicine, setActiveMedicine] = useState<MedicineItem | null>(null);
  const [takenDoses, setTakenDoses] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('sammm_radhika_rx_doses_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [doseJustTaken, setDoseJustTaken] = useState<string | null>(null);

  const handleOpenBottle = (med: MedicineItem) => {
    sound.playPillBottlePop();
    setActiveMedicine(med);
  };

  const handleTakeDose = (med: MedicineItem) => {
    sound.playTightHug();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: [med.color, '#ffffff', '#ffd700', '#e6be6d'],
    });

    const newCount = (takenDoses[med.id] || 0) + 1;
    const updated = { ...takenDoses, [med.id]: newCount };
    setTakenDoses(updated);
    try {
      localStorage.setItem('sammm_radhika_rx_doses_v1', JSON.stringify(updated));
    } catch {}

    setDoseJustTaken(med.id);
    setTimeout(() => {
      setDoseJustTaken(null);
    }, 3500);
  };

  const totalDosesTaken = Object.values(takenDoses).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full my-8">
      {/* Rx Pad Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#faf5ee] via-[#fffbf6] to-[#f5efe4] text-[#24131b] border-4 border-[#e6be6d]/80 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
      >
        {/* Top Rx Header Bar */}
        <div className="bg-gradient-to-r from-[#0d2229] via-[#13323c] to-[#0d2229] text-white p-5 sm:p-6 border-b-4 border-[#e6be6d]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0891b2] to-[#38bdf8] flex items-center justify-center text-white shadow-lg border border-cyan-300/40 shrink-0">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    Official Medical Rx
                  </span>
                  <span className="text-[10px] font-mono text-[#e6be6d]">
                    License: 19-07-2026-FOREVER
                  </span>
                </div>
                <h3 className="font-serif-romantic text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                  Department of Eternal Affection & Cardiology
                </h3>
                <p className="text-xs font-mono text-cyan-200">
                  Prescribing Physician: <strong className="text-white">Dr. Radhika Barot, MD (Chief of Cardiology & Cuddles)</strong>
                </p>
              </div>
            </div>

            {/* Hospital Ward Badge */}
            <div className="sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-cyan-800/80 pt-2 sm:pt-0 sm:pl-4">
              <span className="text-[10px] font-mono text-cyan-400 block uppercase">
                Clinic Location
              </span>
              <span className="text-xs font-mono text-white font-bold block">
                Ward 7 • Heart Care Unit
              </span>
              <span className="text-[10px] font-mono text-[#ffd700] block mt-0.5">
                Refills: ∞ UNLIMITED
              </span>
            </div>
          </div>
        </div>

        {/* Patient Details Strip */}
        <div className="bg-[#f0e6d6] px-5 sm:px-6 py-3 border-b border-[#ddcdb8] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#3a2216]">
          <div>
            <span className="text-[#8c593b] font-bold">PATIENT: </span>
            <strong className="text-[#1a0a14] font-serif-romantic text-sm">Dr. Sammm</strong>
          </div>
          <div>
            <span className="text-[#8c593b] font-bold">AGE: </span>
            <span>Forever Handsome</span>
          </div>
          <div>
            <span className="text-[#8c593b] font-bold">DATE: </span>
            <span>03 Oct 2026 & Always</span>
          </div>
          <div>
            <span className="text-[#8c593b] font-bold">DIAGNOSIS: </span>
            <span className="text-rose-800 font-bold">Acute Lovestruck & Medical Brilliance</span>
          </div>
        </div>

        {/* Classical Rx Symbol Watermark & Content */}
        <div className="p-5 sm:p-8 relative">
          {/* Giant Rx Latin Watermark in background */}
          <div className="absolute right-6 top-6 text-[140px] font-serif font-black text-[#85182a]/5 select-none pointer-events-none leading-none">
            ℞
          </div>

          {/* Subheading Prompt */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-2xl text-[#85182a]">℞</span>
              <span className="text-xs font-mono uppercase tracking-wider text-[#75442e] font-bold">
                Prescribed Medicines (Tap any bottle to unscrew cap & take dose):
              </span>
            </div>

            {totalDosesTaken > 0 && (
              <span className="text-xs font-mono text-[#85182a] font-bold bg-[#85182a]/10 px-2.5 py-1 rounded-full border border-[#85182a]/20">
                ✨ {totalDosesTaken} Total Doses Taken
              </span>
            )}
          </div>

          {/* Interactive Medicine Bottles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 my-3 relative z-10">
            {PRESCRIPTION_MEDICINES.map((med) => {
              const count = takenDoses[med.id] || 0;
              return (
                <motion.div
                  key={med.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenBottle(med)}
                  className="p-4 rounded-2xl border-2 cursor-pointer transition-all bg-white/95 hover:bg-white text-stone-900 shadow-sm hover:shadow-md relative overflow-hidden group"
                  style={{ borderColor: `${med.color}88` }}
                >
                  {/* Subtle pastel corner wash */}
                  <div
                    className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-15 blur-xl pointer-events-none group-hover:opacity-25 transition-opacity"
                    style={{ backgroundColor: med.color }}
                  />

                  {/* Bottle Cap & Header Visual */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:rotate-6 transition-transform"
                        style={{ backgroundColor: med.color }}
                      >
                        {med.icon === 'heart' && <Heart className="w-4 h-4 fill-white" />}
                        {med.icon === 'coffee' && <Coffee className="w-4 h-4" />}
                        {med.icon === 'pill' && <Pill className="w-4 h-4" />}
                        {med.icon === 'stethoscope' && <Stethoscope className="w-4 h-4" />}
                        {med.icon === 'sparkles' && <Sparkles className="w-4 h-4" />}
                      </div>

                      <div>
                        <h4 className="font-serif-romantic font-bold text-sm text-stone-900 group-hover:text-[#85182a] transition-colors leading-tight">
                          {med.name}
                        </h4>
                        <span className="text-[10px] font-mono text-stone-500 block">
                          {med.genericName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-sans text-stone-600 line-clamp-2 my-2 italic leading-relaxed">
                    “{med.dosage}”
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-stone-200/80 text-[10px] font-mono">
                    <span className="text-[#85182a] group-hover:underline flex items-center gap-1 font-bold">
                      <RotateCcw className="w-3 h-3 group-hover:rotate-45 transition-transform" />
                      Unscrew Cap →
                    </span>

                    {count > 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {count} {count === 1 ? 'dose taken' : 'doses taken'}
                      </span>
                    ) : (
                      <span className="text-stone-400">Ready to take</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Rx Footer: Instructions, Warning, and Doctor Signature */}
          <div className="mt-6 pt-5 border-t-2 border-dashed border-[#ddcdb8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#4a2e21]">
            <div className="space-y-1 max-w-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#85182a] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Special Medical Instructions:
              </span>
              <p className="text-[11px] text-[#5c3e30] leading-relaxed">
                Take with plenty of warm hugs, hot chai, and unconditional belief in your brilliance. Overdose of love is strongly recommended.
              </p>
            </div>

            {/* Doctor's Signature & Gold Seal */}
            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="font-handwriting text-2xl text-[#85182a] leading-none">
                  Dr. Radhika Barot
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#7a4833] block mt-0.5">
                  Chief of Cardiology & Cuddles, MD
                </span>
              </div>

              {/* Gold Embossed Seal */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#b8860b] via-[#ffd700] to-[#daa520] p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full border-2 border-dashed border-[#573d09] flex flex-col items-center justify-center text-[#4a3205]">
                  <Award className="w-4 h-4 fill-[#7c560e]" />
                  <span className="text-[6px] font-black tracking-tighter">OFFICIAL RX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- MODAL: OPEN MEDICINE BOTTLE & ENCOURAGEMENT NOTE --- */}
      <AnimatePresence>
        {activeMedicine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 200 }}
              className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-[#180914] border-2 shadow-2xl text-white text-left overflow-hidden"
              style={{ borderColor: activeMedicine.color }}
            >
              {/* Bottle Cap Unscrew Pop Graphic */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg border border-white/20"
                    style={{ backgroundColor: activeMedicine.color }}
                  >
                    {activeMedicine.icon === 'heart' && <Heart className="w-6 h-6 fill-current" />}
                    {activeMedicine.icon === 'coffee' && <Coffee className="w-6 h-6" />}
                    {activeMedicine.icon === 'pill' && <Pill className="w-6 h-6" />}
                    {activeMedicine.icon === 'stethoscope' && <Stethoscope className="w-6 h-6" />}
                    {activeMedicine.icon === 'sparkles' && <Sparkles className="w-6 h-6" />}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffd700] font-bold block">
                      Bottle Cap Unscrewed 💊
                    </span>
                    <h3 className="font-serif-romantic text-xl font-bold text-white leading-tight">
                      {activeMedicine.name}
                    </h3>
                    <span className="text-xs font-mono text-stone-400 block">
                      {activeMedicine.genericName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveMedicine(null);
                  }}
                  className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Indication & Dosage Pill Badge */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-4 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-400">Prescribed For:</span>
                  <span className="text-[#ffd700] font-bold">{activeMedicine.indication}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-400">Dosage Regimen:</span>
                  <span className="text-stone-200">{activeMedicine.dosage}</span>
                </div>
              </div>

              {/* The Personalized Doctor Note from Radhika */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#faf5ee] to-[#f3ebe1] text-[#2b1810] shadow-inner border border-[#d6c7b2] my-4 relative">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#85182a] font-bold mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#85182a]" />
                  Personal Encouragement Note from Radhika:
                </div>

                <p className="font-serif-romantic text-base sm:text-lg font-medium leading-relaxed italic text-[#381a24]">
                  “{activeMedicine.prescriptionNote}”
                </p>

                <div className="mt-3 pt-2 border-t border-[#d8c8b4] flex items-center justify-between text-[11px] font-handwriting text-[#7a4658]">
                  <span>— Your Biggest Cheerleader & Future Wife ❤️</span>
                  <span className="font-mono text-[9px] text-[#9c6a7a]">Dept of Cardiology</span>
                </div>
              </div>

              {/* Side Effects Notice */}
              <div className="p-2.5 rounded-xl bg-[#2b1222] border border-[#5c2443] mb-4 text-[11px] font-mono text-stone-300">
                <strong className="text-rose-300">Expected Clinical Side Effects: </strong>
                {activeMedicine.sideEffects}
              </div>

              {/* Take Dose Action */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs font-mono text-stone-400">
                  Doses Taken: <strong className="text-[#ffd700]">{takenDoses[activeMedicine.id] || 0}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTakeDose(activeMedicine)}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#85182a] to-[#d4af37] text-white text-xs font-mono font-bold tracking-wider hover:shadow-lg hover:shadow-[#85182a]/50 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Take Dose Now 💊</span>
                  </motion.button>
                </div>
              </div>

              {/* Dose Just Taken Animation Notice with Animated Splitting Capsule */}
              <AnimatePresence>
                {doseJustTaken === activeMedicine.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-[#0a271e]/90 to-emerald-950/90 border border-emerald-400/80 shadow-2xl text-center relative overflow-hidden"
                  >
                    {/* Glowing pulse aura behind */}
                    <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />

                    {/* Animated Capsule Dissolve / Split */}
                    <div className="flex items-center justify-center gap-2 mb-2 relative h-10">
                      {/* Left Capsule Shell */}
                      <motion.div
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: -28, rotate: -25, opacity: [1, 0.8, 0] }}
                        transition={{ duration: 1.6, ease: 'easeOut' }}
                        className="w-7 h-4 rounded-l-full bg-gradient-to-r from-rose-500 to-rose-400 border border-white/60 shadow-md"
                      />

                      {/* Bursting Center Hearts & Sparkles */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.4, 1.1], opacity: [0, 1, 0.9] }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="absolute flex items-center justify-center gap-1 z-10"
                      >
                        <Heart className="w-6 h-6 text-rose-400 fill-rose-500 animate-bounce" />
                        <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                      </motion.div>

                      {/* Right Capsule Shell */}
                      <motion.div
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: 28, rotate: 25, opacity: [1, 0.8, 0] }}
                        transition={{ duration: 1.6, ease: 'easeOut' }}
                        className="w-7 h-4 rounded-r-full bg-gradient-to-r from-amber-300 to-amber-400 border border-white/60 shadow-md"
                      />
                    </div>

                    {/* Animated ECG Vital Wave Track */}
                    <div className="relative h-6 bg-black/40 rounded-lg border border-emerald-800/60 overflow-hidden flex items-center px-3 mb-2">
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                        className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
                      />
                      <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-widest z-10 flex items-center gap-1.5 mx-auto">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        PATIENT SAMMM: LOVE STABILIZED • VITALS AT 100%
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-bold">Dose administered! Radhika's love has reached your heart. ❤️</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
