import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  ChevronDown,
  Sparkles,
  Sliders,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ambientSoundtrack, AMBIENT_TRACKS, AmbientTrack } from '../services/ambientSoundtrack';
import { sound } from '../services/soundEffects';

interface AmbientSoundtrackControlProps {
  midnightMode?: boolean;
}

export const AmbientSoundtrackControl: React.FC<AmbientSoundtrackControlProps> = ({
  midnightMode = false,
}) => {
  const [state, setState] = useState(ambientSoundtrack.getState());
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = ambientSoundtrack.subscribe(() => {
      setState(ambientSoundtrack.getState());
    });
    return () => unsubscribe();
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    ambientSoundtrack.toggle();
  };

  const handleSelectTrack = (track: AmbientTrack) => {
    sound.playClick();
    ambientSoundtrack.setTrack(track);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    ambientSoundtrack.setVolume(val);
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* Main Ambient Music Button */}
      <div
        className={`inline-flex items-center rounded-full border transition-all shadow-md ${
          state.isEnabled && state.isPlaying
            ? midnightMode
              ? 'bg-[#0f1f38] border-sky-400/60 text-sky-200 shadow-sky-950/40'
              : 'bg-gradient-to-r from-[#2c121e] to-[#3f1627] border-[#e6be6d]/70 text-[#f7e8ce] shadow-[#85182a]/30'
            : 'bg-black/50 border-white/10 text-stone-400 hover:text-stone-200'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold cursor-pointer hover:opacity-90 transition-opacity"
          title={
            state.isEnabled
              ? `Ambient Soundtrack: ON (${state.currentTrack.title}) • Click to Turn Off`
              : 'Ambient Soundtrack: OFF • Click to Turn On'
          }
        >
          {state.isEnabled && state.isPlaying ? (
            <div className="flex items-center gap-1">
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-[#ffd700] rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                <span className="w-0.5 h-2 bg-[#ff7597] rounded-full animate-[pulse_1.1s_ease-in-out_infinite]" />
                <span className="w-0.5 h-3.5 bg-[#ffd700] rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              </span>
              <span className="text-[11px] text-[#ffd700] font-sans font-semibold">
                Ambient {state.isDucked ? '(Ducked)' : 'ON'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <VolumeX className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-[11px] font-sans">Ambient OFF</span>
            </div>
          )}
        </button>

        {/* Mini Dropdown Chevron Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            setMenuOpen((prev) => !prev);
          }}
          className="px-1.5 py-1.5 border-l border-white/10 hover:bg-white/10 rounded-r-full text-stone-300 transition-colors cursor-pointer"
          title="Ambient Music Options & Volume"
        >
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${
              menuOpen ? 'rotate-180 text-[#ffd700]' : ''
            }`}
          />
        </button>
      </div>

      {/* Floating Popover Options Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className={`absolute right-0 top-full mt-2 w-72 rounded-2xl p-4 shadow-2xl z-50 border-2 ${
              midnightMode
                ? 'bg-[#091322] border-sky-400/50 text-stone-100 shadow-sky-950/70'
                : 'bg-[#1e0a16] border-[#e6be6d] text-stone-100 shadow-[#85182a]/50'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ffd700]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ambient Soundtrack</span>
              </div>
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                Continuous Loop
              </span>
            </div>

            {/* Ambient Toggle Switch */}
            <div className="flex items-center justify-between mb-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
              <div>
                <span className="text-xs font-mono block">Looping Ambient Audio</span>
                <span className="text-[10px] text-stone-400">Plays gently across all chapters</span>
              </div>
              <button
                onClick={handleToggle}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  state.isEnabled ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-stone-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    state.isEnabled ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Volume Control Slider */}
            <div className="mb-4 bg-black/20 p-2.5 rounded-xl border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-stone-300">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-[#ffd700]" />
                  <span>Ambient Volume</span>
                </span>
                <span className="text-stone-400">{Math.round(state.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={state.volume}
                onChange={handleVolumeChange}
                disabled={!state.isEnabled}
                className="w-full accent-[#ffd700] cursor-pointer h-1.5 bg-stone-700 rounded-lg"
              />
            </div>

            {/* Soundtrack Themes */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                Select Soundtrack Mood
              </span>
              {AMBIENT_TRACKS.map((track) => {
                const isSelected = track.id === state.currentTrack.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleSelectTrack(track)}
                    className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-[#85182a]/40 border-[#ff7597] text-white shadow-xs'
                        : 'bg-white/5 border-transparent text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        <span>{track.title}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#ffd700]" />}
                      </div>
                      <span className="text-[10px] text-stone-400 block">{track.mood}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono text-[#ffd700] bg-black/40 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Note distinction from Bollywood songs */}
            <div className="mt-3 pt-2.5 border-t border-white/10 text-[10px] text-stone-400 font-mono leading-tight">
              🎵 Separate from Bollywood Jukebox. When you play a Bollywood song or video, ambient audio automatically softens.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
