import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Bell, BellOff, Camera, Sparkles, Menu, X, Heart, Moon, Sun } from 'lucide-react';
import { sound } from '../services/soundEffects';
import { MilestoneCountdown } from './MilestoneCountdown';
import { AmbientSoundtrackControl } from './AmbientSoundtrackControl';
import { ambientSoundtrack } from '../services/ambientSoundtrack';

interface TopBarProps {
  currentChapter: number;
  totalChapters: number;
  musicPlaying: boolean;
  sfxEnabled: boolean;
  unlockedEggsCount: number;
  totalEggsCount: number;
  currentSongTitle?: string;
  midnightMode?: boolean;
  onToggleMidnightMode?: () => void;
  onOpenBollywoodModal: () => void;
  onOpenOpenWhenModal: (envelopeId?: string) => void;
  onOpenDailyNote?: () => void;
  onOpenTimeline?: () => void;
  onOpenLoveJar?: () => void;
  onOpenPrescription?: () => void;
  onOpenTransitionNotes?: () => void;
  onOpenCoupons?: () => void;
  onOpenBucketList?: () => void;
  onOpenLoveCounter?: () => void;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onOpenMediaModal: () => void;
  onOpenEggsModal: () => void;
  onSelectChapter: (ch: number) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentChapter,
  totalChapters,
  musicPlaying,
  sfxEnabled,
  unlockedEggsCount,
  totalEggsCount,
  currentSongTitle,
  midnightMode = false,
  onToggleMidnightMode,
  onOpenBollywoodModal,
  onOpenOpenWhenModal,
  onOpenDailyNote,
  onOpenTimeline,
  onOpenLoveJar,
  onOpenPrescription,
  onOpenTransitionNotes,
  onOpenCoupons,
  onOpenBucketList,
  onOpenLoveCounter,
  onToggleMusic,
  onToggleSfx,
  onOpenMediaModal,
  onOpenEggsModal,
  onSelectChapter,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const chapterList = [
    { num: 1, title: '01. The Beginning (Pickleball)' },
    { num: 2, title: '02. The Shy Boy Era' },
    { num: 3, title: '03. You Were Always There' },
    { num: 4, title: '04. 31 May (RCB Won)' },
    { num: 5, title: '05. The Chapter That Ended' },
    { num: 6, title: '06. Our First Movie' },
    { num: 7, title: '07. That One Night (Confession)' },
    { num: 8, title: '08. Scrapbook & Boyfriend Test' },
    { num: 9, title: '09. Things I Want You To Know' },
    { num: 10, title: '10. Doctor Sammm' },
    { num: 11, title: '11. Final Surprise & Letter' },
  ];

  const progressPercent = Math.min(100, Math.max(5, (currentChapter / totalChapters) * 100));

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md transition-colors duration-500 ${
      midnightMode ? 'bg-[#050b14]/90 border-b border-[#1e293b]/80' : 'bg-[#090509]/85 border-b border-[#3b1220]/60'
    }`}>
      {/* Thin Animated Progress Bar at Very Top */}
      <div className={`w-full h-1 ${midnightMode ? 'bg-[#0b1426]' : 'bg-[#1a0812]'}`}>
        <div
          className={`h-full transition-all duration-500 ease-out ${
            midnightMode
              ? 'bg-gradient-to-r from-[#1e3a8a] via-[#38bdf8] to-[#e2e8f0]'
              : 'bg-gradient-to-r from-[#85182a] via-[#ff577d] to-[#e6be6d]'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Left: Chapter Indicator & Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setMenuOpen(!menuOpen);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer ${
                midnightMode
                  ? 'bg-[#0b1426] hover:bg-[#13223f] border-[#1e293b] text-[#e2e8f0]'
                  : 'bg-[#1e0a15] hover:bg-[#301022] border-[#6b1b2d] text-[#faf4ee]'
              }`}
            >
              <span className={midnightMode ? 'text-[#38bdf8]' : 'text-[#e6be6d]'}>
                {String(currentChapter).padStart(2, '0')} / {String(totalChapters).padStart(2, '0')}
              </span>
              <Menu className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {/* Dropdown Menu for Quick Chapter Navigation */}
            {menuOpen && (
              <div className={`absolute top-10 left-0 w-64 border rounded-2xl shadow-2xl p-2 space-y-1 z-50 animate-scale-up ${
                midnightMode ? 'bg-[#091122] border-[#1e293b]' : 'bg-[#140a13] border-[#6b1b2d]'
              }`}>
                <div className="px-3 py-1.5 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#e6be6d] uppercase tracking-wider">
                    Story Chapters
                  </span>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-1 text-stone-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {chapterList.map((ch) => (
                    <button
                      key={ch.num}
                      onClick={() => {
                        sound.playClick();
                        onSelectChapter(ch.num);
                        setMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between ${
                        currentChapter === ch.num
                          ? 'bg-[#85182a] text-white font-bold'
                          : 'text-stone-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">{ch.title}</span>
                      {currentChapter === ch.num && (
                        <Heart className="w-3 h-3 text-[#ff8da8] fill-current" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="pt-2 mt-1 border-t border-white/10 space-y-1">
                  <div className="px-3 py-1 text-[10px] font-mono text-[#ff8da8] uppercase tracking-wider">
                    Special Sections
                  </div>
                  {onOpenDailyNote && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onOpenDailyNote();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#ff8da8] hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                    >
                      <span>💌</span>
                      <span>Today's Daily Love Note</span>
                    </button>
                  )}
                  {onOpenTimeline && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onOpenTimeline();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#ff8da8] hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                    >
                      <span>⏳</span>
                      <span>Relationship Milestones Timeline</span>
                    </button>
                  )}
                  {onOpenLoveJar && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onOpenLoveJar();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#ffd700] hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                    >
                      <span>⭐</span>
                      <span>The Origami Love Jar (100 Reasons)</span>
                    </button>
                  )}
                  {onOpenPrescription && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onOpenPrescription();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-cyan-300 hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                    >
                      <span>🩺</span>
                      <span>The Prescription of Love (Dr. Sammm Rx)</span>
                    </button>
                  )}
                  {onOpenCoupons && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onOpenCoupons();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#ffd700] hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                    >
                      <span>🎟️</span>
                      <span>Love Coupons for Sammm</span>
                    </button>
                  )}
                  {onOpenBucketList && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onOpenBucketList();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-300 hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                    >
                      <span>🌟</span>
                      <span>Our Couple Bucket List</span>
                    </button>
                  )}
                  {onOpenLoveCounter && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onOpenLoveCounter();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#ff7597] hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                    >
                      <span>⏰</span>
                      <span>Love Counter & Live Heartbeats</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      sound.playClick();
                      sound.playEnvelopeOpen();
                      onOpenOpenWhenModal();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#e6be6d] hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span>💌</span>
                    <span>“Open When…” Sealed Envelopes</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenMediaModal();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-300 hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span>📸</span>
                    <span>Our Photo & Video Vault (Add Media)</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenBollywoodModal();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-amber-200 hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span>🎵</span>
                    <span>Bollywood Music Jukebox</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      ambientSoundtrack.toggle();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#ffd700] hover:bg-white/10 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>✨</span>
                      <span>Looping Ambient Soundtrack</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10">
                      Toggle ON/OFF
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenEggsModal();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-pink-300 hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span>🥚</span>
                    <span>Secret Easter Eggs ({unlockedEggsCount}/{totalEggsCount})</span>
                  </button>

                  {onOpenTransitionNotes && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onOpenTransitionNotes();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#ffd700] hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                    >
                      <span>✉️</span>
                      <span>Chapter Transition Notes (Pop-ups)</span>
                    </button>
                  )}

                  {/* Midnight Mode Toggle in Menu */}
                  {onToggleMidnightMode && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onToggleMidnightMode();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-sky-200 hover:bg-white/10 flex items-center justify-between cursor-pointer border-t border-white/5 pt-2 mt-1"
                    >
                      <div className="flex items-center gap-2">
                        {midnightMode ? (
                          <Sun className="w-4 h-4 text-amber-300" />
                        ) : (
                          <Moon className="w-4 h-4 text-sky-300" />
                        )}
                        <span>{midnightMode ? 'Midnight Theme (Active)' : 'Midnight Theme (Navy & Silver)'}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
                        midnightMode
                          ? 'bg-sky-950/80 border-sky-400 text-sky-200'
                          : 'bg-stone-800 border-stone-700 text-stone-400'
                      }`}>
                        {midnightMode ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <span className="hidden lg:inline-block text-xs font-serif-romantic text-stone-300 italic">
            Sammm & Radhika
          </span>

          {/* Next Milestone Countdown */}
          <MilestoneCountdown />
        </div>

        {/* Right Controls: Easter Eggs, Photos, Music, SFX */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Daily Love Note Button */}
          {onOpenDailyNote && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenDailyNote();
              }}
              className="hidden lg:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#240a1c] hover:bg-[#3d1030] border border-[#ff7597]/50 text-xs font-mono font-bold text-[#ff8da8] hover:text-white transition-all shadow-md cursor-pointer"
              title="Today's Daily Love Note for Sammm"
            >
              <span>💌</span>
              <span>Daily Note</span>
            </button>
          )}

          {/* Timeline Button */}
          {onOpenTimeline && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenTimeline();
              }}
              className="hidden md:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1e0a18] hover:bg-[#341126] border border-[#ff577d]/40 text-xs font-mono font-bold text-stone-200 hover:text-white transition-all shadow-md cursor-pointer"
              title="Relationship Milestones Timeline"
            >
              <span>⏳</span>
              <span>Timeline</span>
            </button>
          )}

          {/* Origami Love Jar Button */}
          {onOpenLoveJar && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenLoveJar();
              }}
              className="hidden lg:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1f0d1a] hover:bg-[#38142e] border border-[#e6be6d]/50 text-xs font-mono font-bold text-[#e6be6d] hover:text-white transition-all shadow-md cursor-pointer"
              title="Origami Love Jar: 100 Things I Adore About You"
            >
              <span>⭐</span>
              <span>Love Jar</span>
            </button>
          )}

          {/* Doctor Prescription Rx Button */}
          {onOpenPrescription && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenPrescription();
              }}
              className="hidden xl:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#0d2229] hover:bg-[#15343d] border border-cyan-500/50 text-xs font-mono font-bold text-cyan-300 hover:text-white transition-all shadow-md cursor-pointer"
              title="The Prescription of Love (Doctor Sammm Rx)"
            >
              <span>🩺</span>
              <span>Rx Pad</span>
            </button>
          )}

          {/* Chapter Transition Notes (Whispers) */}
          {onOpenTransitionNotes && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenTransitionNotes();
              }}
              className="hidden 2xl:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#270f20] hover:bg-[#3d1631] border border-[#ff7597]/40 text-xs font-mono font-bold text-[#ff8da8] hover:text-white transition-all shadow-md cursor-pointer"
              title="Customize Chapter Transition Pop-up Notes"
            >
              <span>✉️</span>
              <span>Whispers</span>
            </button>
          )}

          {/* Love Coupons */}
          {onOpenCoupons && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenCoupons();
              }}
              className="hidden lg:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#260a16] hover:bg-[#3d1024] border border-[#e6be6d]/60 text-xs font-mono font-bold text-[#ffd700] hover:text-white transition-all shadow-md cursor-pointer hover:scale-105"
              title="Sammm’s Boyfriend Day Love Coupons"
            >
              <span>🎟️</span>
              <span>Coupons</span>
            </button>
          )}

          {/* Couple Bucket List */}
          {onOpenBucketList && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenBucketList();
              }}
              className="hidden xl:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1b0918] hover:bg-[#30102b] border border-rose-500/40 text-xs font-mono font-bold text-rose-300 hover:text-white transition-all shadow-md cursor-pointer hover:scale-105"
              title="Our Couple Bucket List"
            >
              <span>🌟</span>
              <span>Bucket List</span>
            </button>
          )}

          {/* Open When Letters */}
          <button
            onClick={() => {
              sound.playClick();
              sound.playEnvelopeOpen();
              onOpenOpenWhenModal();
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-[#85182a] to-[#a32238] hover:from-[#a32238] hover:to-[#85182a] border border-[#e6be6d]/60 text-xs font-mono font-bold text-white transition-all shadow-md hover:scale-105 cursor-pointer"
            title="Open When… Sealed Letters for Sammm"
          >
            <span>💌</span>
            <span className="hidden sm:inline">Open When…</span>
          </button>

          {/* Easter Egg Counter */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenEggsModal();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#1a0a14] hover:bg-[#2b1022] border border-[#ff577d]/40 text-xs font-mono text-[#ff8da8] transition-colors cursor-pointer"
            title="Hidden Easter Eggs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e6be6d]" />
            <span className="text-[11px]">
              🥚 {unlockedEggsCount}/{totalEggsCount}
            </span>
          </button>

          {/* Photo & Video Vault */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenMediaModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2a0e1b] hover:bg-[#401529] border border-[#85182a] text-xs font-semibold text-stone-200 transition-colors cursor-pointer"
            title="Photo & Video Vault (Add many photos & videos!)"
          >
            <Camera className="w-3.5 h-3.5 text-[#e6be6d]" />
            <span className="hidden md:inline">Vault</span>
          </button>

          {/* SFX Toggle */}
          <button
            onClick={onToggleSfx}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              sfxEnabled
                ? midnightMode
                  ? 'bg-[#0f172a] border-[#38bdf8]/50 text-stone-200 hover:text-white'
                  : 'bg-[#1e0a15] border-[#6b1b2d] text-stone-200 hover:text-white'
                : 'bg-black/60 border-stone-800 text-stone-500'
            }`}
            title={sfxEnabled ? 'Sound Effects ON' : 'Sound Effects Muted'}
          >
            {sfxEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
          </button>

          {/* Midnight Theme Toggle */}
          {onToggleMidnightMode && (
            <button
              onClick={() => {
                sound.playClick();
                onToggleMidnightMode();
              }}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                midnightMode
                  ? 'bg-[#0f1d33] border-[#38bdf8] text-[#38bdf8] shadow-[0_0_14px_rgba(56,189,248,0.4)] hover:bg-[#152745]'
                  : 'bg-[#1e0a15] border-[#6b1b2d] text-stone-300 hover:text-white hover:border-[#85182a]'
              }`}
              title={
                midnightMode
                  ? 'Midnight Theme Active (Deep Navy & Silver) • Click for Classic Burgundy'
                  : 'Turn on Midnight Theme (Deep Navy & Silver for Late-Night Viewing)'
              }
              aria-label="Toggle Midnight Theme"
            >
              {midnightMode ? (
                <Moon className="w-3.5 h-3.5 fill-[#38bdf8]/30 text-[#38bdf8]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-stone-300" />
              )}
            </button>
          )}

          {/* Continuous Ambient Background Soundtrack (Distinct from Bollywood Songs) */}
          <AmbientSoundtrackControl midnightMode={midnightMode} />

          {/* Bollywood Music Jukebox & Toggle */}
          <div className="flex items-center">
            <button
              onClick={() => {
                sound.playClick();
                onOpenBollywoodModal();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-l-full border-y border-l transition-all cursor-pointer ${
                musicPlaying
                  ? 'bg-gradient-to-r from-[#85182a] to-[#a32238] border-[#e6be6d] text-white shadow-md shadow-[#85182a]/40'
                  : 'bg-[#150a12] border-stone-800 text-stone-300 hover:text-white hover:bg-[#251020]'
              }`}
              title="Click to open Bollywood Love Songs Playlist"
            >
              <Music className={`w-3.5 h-3.5 ${musicPlaying ? 'animate-bounce text-[#e6be6d]' : 'text-stone-400'}`} />
              <span className="text-xs font-mono max-w-[110px] sm:max-w-[160px] truncate font-medium">
                {currentSongTitle ? `🎵 ${currentSongTitle}` : 'Bollywood Songs'}
              </span>
            </button>
            <button
              onClick={onToggleMusic}
              className={`px-2.5 py-1.5 rounded-r-full border transition-all cursor-pointer text-xs font-mono font-bold ${
                musicPlaying
                  ? 'bg-[#6b1422] border-[#e6be6d] border-l-0 text-[#e6be6d]'
                  : 'bg-[#10070e] border-stone-800 border-l-0 text-stone-400 hover:text-white'
              }`}
              title={musicPlaying ? 'Pause Bollywood Song' : 'Play Bollywood Song'}
            >
              {musicPlaying ? 'PAUSE' : 'PLAY'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
