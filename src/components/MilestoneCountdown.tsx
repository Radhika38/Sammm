import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Heart, ChevronDown, Edit3, X, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sound } from '../services/soundEffects';

export interface Milestone {
  id: string;
  title: string;
  targetDate: string; // ISO string or YYYY-MM-DD
  subtitle: string;
  themeColor: string;
  icon: string;
}

// Calculate next upcoming occurrence for annual dates
function getNextAnnualDate(monthIndex: number, day: number): Date {
  const now = new Date();
  let year = now.getFullYear();
  let candidate = new Date(year, monthIndex, day, 0, 0, 0);
  if (candidate.getTime() <= now.getTime()) {
    candidate = new Date(year + 1, monthIndex, day, 0, 0, 0);
  }
  return candidate;
}

const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'anniversary-may31',
    title: 'Our 31 May Anniversary',
    targetDate: getNextAnnualDate(4, 31).toISOString(), // May 31
    subtitle: 'The day RCB won and the day that became forever ours ❤️',
    themeColor: '#e6be6d',
    icon: '🏆',
  },
  {
    id: 'boyfriend-day',
    title: 'National Boyfriend Day',
    targetDate: getNextAnnualDate(9, 3).toISOString(), // Oct 3
    subtitle: 'Celebrating the sweetest, most handsome doctor-in-the-making 👑',
    themeColor: '#ff577d',
    icon: '👑',
  },
  {
    id: 'doctor-sammm',
    title: 'Dr. Sammm Graduation Day',
    targetDate: '2027-06-15T10:00:00',
    subtitle: 'When the stethoscope hangs proud and we celebrate Dr. Sammm 🩺',
    themeColor: '#2dd4bf',
    icon: '🩺',
  },
  {
    id: 'next-date',
    title: 'Our Next Date Night',
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    subtitle: 'Popcorn, laughter, and zero overthinking allowed 🍿',
    themeColor: '#f472b6',
    icon: '✨',
  },
];

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  totalMs: number;
}

function calculateTimeRemaining(targetIso: string): TimeRemaining {
  const target = new Date(targetIso).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, totalMs: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isPast: false, totalMs: diff };
}

export const MilestoneCountdown: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem('sammm_radhika_milestones_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MILESTONES;
  });

  const [selectedId, setSelectedId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem('sammm_radhika_selected_milestone');
      if (savedId && milestones.some((m) => m.id === savedId)) return savedId;
    } catch {}
    return milestones[0]?.id || 'anniversary-may31';
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');

  const activeMilestone = milestones.find((m) => m.id === selectedId) || milestones[0];

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(activeMilestone.targetDate)
  );

  // Live timer tick every second
  useEffect(() => {
    const update = () => {
      setTimeLeft(calculateTimeRemaining(activeMilestone.targetDate));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeMilestone.targetDate]);

  // Persist selections
  const handleSelectMilestone = (m: Milestone) => {
    sound.playClick();
    setSelectedId(m.id);
    try {
      localStorage.setItem('sammm_radhika_selected_milestone', m.id);
    } catch {}
  };

  const handleAddCustomMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customDate) return;

    sound.playClick();
    sound.playChime();

    const newMilestone: Milestone = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      targetDate: new Date(customDate).toISOString(),
      subtitle: customSubtitle.trim() || 'A special milestone waiting for us ❤️',
      themeColor: '#e6be6d',
      icon: '💖',
    };

    const updated = [newMilestone, ...milestones];
    setMilestones(updated);
    setSelectedId(newMilestone.id);
    setIsEditing(false);
    setCustomTitle('');
    setCustomDate('');
    setCustomSubtitle('');

    try {
      localStorage.setItem('sammm_radhika_milestones_v1', JSON.stringify(updated));
      localStorage.setItem('sammm_radhika_selected_milestone', newMilestone.id);
    } catch {}
  };

  const triggerCelebration = () => {
    sound.playChime();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.3 },
      colors: ['#e6be6d', '#ff577d', '#85182a', '#ffffff'],
    });
  };

  return (
    <div className="relative">
      {/* TopBar Pill Button */}
      <button
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen);
        }}
        className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#180a14]/90 hover:bg-[#280e22] border border-[#e6be6d]/40 hover:border-[#e6be6d] transition-all shadow-md hover:shadow-[#e6be6d]/20 text-stone-200 cursor-pointer"
        title="Click to view our Next Milestone countdown"
      >
        <span className="text-xs sm:text-sm animate-pulse">
          {activeMilestone.icon}
        </span>

        {/* Compact presentation for mobile, full for desktop */}
        <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[11px] sm:text-xs">
          <span className="hidden md:inline font-serif-romantic font-semibold text-stone-300 truncate max-w-[120px]">
            {activeMilestone.title}:
          </span>
          <span className="text-[#e6be6d] font-bold tracking-tight">
            {timeLeft.isPast ? (
              'Today! 🎉'
            ) : (
              <>
                <span>{timeLeft.days}d</span>
                <span className="text-stone-400 font-light mx-0.5">:</span>
                <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span className="hidden lg:inline text-stone-400 font-light mx-0.5">:</span>
                <span className="hidden lg:inline text-[#ff8da8]">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
              </>
            )}
          </span>
        </div>

        <ChevronDown
          className={`w-3 h-3 text-[#e6be6d]/80 transition-transform ${
            isOpen ? 'rotate-180 text-white' : 'group-hover:translate-y-0.5'
          }`}
        />
      </button>

      {/* Popover Countdown Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile closing */}
            <div
              className="fixed inset-0 z-40 bg-black/50 sm:bg-transparent"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="fixed sm:absolute top-14 left-3 right-3 sm:left-auto sm:right-0 sm:w-[410px] z-50 bg-[#140813] border-2 border-[#85182a]/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#85182a] via-[#a32238] to-[#4a0d1b] p-4 text-white flex items-center justify-between border-b border-[#e6be6d]/30">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-black/30 border border-white/20 text-[#e6be6d]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#e6be6d] font-bold block">
                      Special Moment Countdown
                    </span>
                    <h3 className="font-serif-romantic text-base font-bold truncate max-w-[240px]">
                      {activeMilestone.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setIsOpen(false);
                  }}
                  className="p-1.5 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Countdown Digits Display */}
              <div className="p-5 bg-gradient-to-b from-[#1c0a1a] to-[#120511] text-center border-b border-[#351022]">
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {/* Days */}
                  <div className="bg-[#260e22] border border-[#e6be6d]/40 rounded-2xl p-2.5 shadow-inner">
                    <span className="font-serif-romantic text-2xl sm:text-3xl font-extrabold text-[#e6be6d] block">
                      {timeLeft.days}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                      Days
                    </span>
                  </div>

                  {/* Hours */}
                  <div className="bg-[#260e22] border border-[#85182a]/60 rounded-2xl p-2.5 shadow-inner">
                    <span className="font-serif-romantic text-2xl sm:text-3xl font-extrabold text-white block">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                      Hours
                    </span>
                  </div>

                  {/* Minutes */}
                  <div className="bg-[#260e22] border border-[#85182a]/60 rounded-2xl p-2.5 shadow-inner">
                    <span className="font-serif-romantic text-2xl sm:text-3xl font-extrabold text-[#ff8da8] block">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                      Mins
                    </span>
                  </div>

                  {/* Seconds */}
                  <div className="bg-[#260e22] border border-[#e6be6d]/40 rounded-2xl p-2.5 shadow-inner">
                    <span className="font-serif-romantic text-2xl sm:text-3xl font-extrabold text-[#e6be6d] block animate-pulse">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                      Secs
                    </span>
                  </div>
                </div>

                <p className="text-xs font-serif-romantic italic text-stone-300">
                  “{activeMilestone.subtitle}”
                </p>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    onClick={triggerCelebration}
                    className="px-3.5 py-1.5 rounded-full bg-[#85182a]/50 hover:bg-[#85182a] border border-[#ff7597]/40 text-xs font-mono text-[#ff8da8] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#e6be6d]" />
                    <span>Celebrate Moment</span>
                  </button>
                </div>
              </div>

              {/* Milestone Switcher List */}
              <div className="p-4 space-y-3 max-h-56 overflow-y-auto">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 px-1">
                  <span>Switch Milestone:</span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsEditing(!isEditing);
                    }}
                    className="text-[#e6be6d] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditing ? 'Cancel' : '+ Add Custom Date'}</span>
                  </button>
                </div>

                {/* Form to add custom milestone */}
                {isEditing && (
                  <form
                    onSubmit={handleAddCustomMilestone}
                    className="p-3 bg-[#240d21] border border-[#e6be6d]/40 rounded-2xl space-y-2.5 text-xs font-mono"
                  >
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                        Milestone Title:
                      </label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="e.g. Our Trip to Udaipur, Next Meet"
                        className="w-full bg-black/60 border border-stone-700 rounded-xl px-2.5 py-1.5 text-white placeholder-stone-500 focus:outline-none focus:border-[#e6be6d]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                        Date:
                      </label>
                      <input
                        type="date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full bg-black/60 border border-stone-700 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#e6be6d]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                        Cute Note / Subtitle:
                      </label>
                      <input
                        type="text"
                        value={customSubtitle}
                        onChange={(e) => setCustomSubtitle(e.target.value)}
                        placeholder="e.g. Packing bags and counting every hour!"
                        className="w-full bg-black/60 border border-stone-700 rounded-xl px-2.5 py-1.5 text-white placeholder-stone-500 focus:outline-none focus:border-[#e6be6d]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-[#85182a] to-[#d4af37] text-white font-bold rounded-xl transition-all shadow-md cursor-pointer hover:scale-[1.01]"
                    >
                      Save & Set Countdown ❤️
                    </button>
                  </form>
                )}

                {/* Predefined / Saved List */}
                <div className="space-y-1.5">
                  {milestones.map((m) => {
                    const isSelected = m.id === selectedId;
                    const daysRemaining = calculateTimeRemaining(m.targetDate).days;

                    return (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMilestone(m)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-[#2a0e24] border-[#e6be6d] shadow-md'
                            : 'bg-[#180a18] border-stone-800/80 hover:bg-[#200c1e] hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{m.icon}</span>
                          <div className="min-w-0">
                            <h4 className="font-serif-romantic text-xs sm:text-sm font-bold text-white truncate">
                              {m.title}
                            </h4>
                            <p className="text-[10px] font-mono text-stone-400 truncate">
                              {new Date(m.targetDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                              isSelected
                                ? 'bg-[#85182a] text-[#e6be6d]'
                                : 'bg-black/40 text-stone-400'
                            }`}
                          >
                            {daysRemaining}d
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#e6be6d]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 bg-[#11050f] border-t border-[#301021] text-center text-[10px] font-mono text-stone-500">
                Every second brings us closer to another celebration ❤️
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
