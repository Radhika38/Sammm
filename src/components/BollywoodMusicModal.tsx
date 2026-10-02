import React, { useState } from 'react';
import { X, Play, Pause, SkipForward, SkipBack, Music2, Heart, Disc3, Volume2, VolumeX, Sparkles, Youtube, AlignLeft, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BollywoodSong, BOLLYWOOD_LOVE_SONGS } from '../data/bollywoodSongs';
import { sound } from '../services/soundEffects';

interface BollywoodMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: BollywoodSong;
  isPlaying: boolean;
  onSelectSong: (song: BollywoodSong) => void;
  onTogglePlay: () => void;
}

export const BollywoodMusicModal: React.FC<BollywoodMusicModalProps> = ({
  isOpen,
  onClose,
  currentSong,
  isPlaying,
  onSelectSong,
  onTogglePlay,
}) => {
  const [activeTab, setActiveTab] = useState<'playlist' | 'lyrics' | 'video'>('playlist');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [customMsg, setCustomMsg] = useState('');

  if (!isOpen) return null;

  const currentIndex = BOLLYWOOD_LOVE_SONGS.findIndex((s) => s.id === currentSong.id);

  const handleNext = () => {
    sound.playClick();
    const nextIdx = (currentIndex + 1) % BOLLYWOOD_LOVE_SONGS.length;
    onSelectSong(BOLLYWOOD_LOVE_SONGS[nextIdx]);
  };

  const handlePrev = () => {
    sound.playClick();
    const prevIdx = (currentIndex - 1 + BOLLYWOOD_LOVE_SONGS.length) % BOLLYWOOD_LOVE_SONGS.length;
    onSelectSong(BOLLYWOOD_LOVE_SONGS[prevIdx]);
  };

  const handleApplyCustomSong = () => {
    if (!customUrlInput.trim()) return;
    sound.setCustomMusic(customUrlInput.trim());
    sound.toggleMusic(true);
    setCustomMsg('Custom track set & playing!');
    setTimeout(() => setCustomMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-[#120813] border-2 border-[#85182a]/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#85182a] via-[#ab223c] to-[#4a0e1c] p-4 sm:p-5 flex items-center justify-between text-white border-b border-[#e6be6d]/30">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full bg-black/30 border border-white/20 text-[#e6be6d] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
              <Disc3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#e6be6d] font-bold">
                  Bollywood Love Jukebox
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/20 text-white font-bold">
                  FOR SAMMM ❤️
                </span>
              </div>
              <h2 className="font-serif-romantic text-lg sm:text-xl font-bold tracking-tight">
                Our Bollywood Love Playlist
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Now Playing Banner */}
        <div className="bg-[#1c0c1b] border-b border-[#401224] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shrink-0 ${
                isPlaying ? 'ring-2 ring-[#e6be6d] animate-pulse' : ''
              }`}
              style={{ backgroundColor: currentSong.themeColor, color: '#1a0610' }}
            >
              🎵
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#e6be6d] block truncate">
                Now Playing: {currentSong.movie} ({currentSong.year})
              </span>
              <h3 className="font-serif-romantic text-base sm:text-lg font-bold text-white truncate">
                {currentSong.title}
              </h3>
              <p className="text-xs text-stone-400 truncate">
                {currentSong.singers}
              </p>
            </div>
          </div>

          {/* Mini Playback Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-[#2a1024] hover:bg-[#3d1633] text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-800"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onTogglePlay();
              }}
              className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#85182a] to-[#d4af37] text-white font-bold text-sm shadow-md hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer border border-[#e6be6d]/60"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-[#2a1024] hover:bg-[#3d1633] text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-800"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#301222] bg-[#140813] text-xs font-mono">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('playlist');
            }}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 font-bold transition-colors cursor-pointer ${
              activeTab === 'playlist'
                ? 'text-[#e6be6d] border-b-2 border-[#e6be6d] bg-[#220c1d]'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>Playlist ({BOLLYWOOD_LOVE_SONGS.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('lyrics');
            }}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 font-bold transition-colors cursor-pointer ${
              activeTab === 'lyrics'
                ? 'text-[#e6be6d] border-b-2 border-[#e6be6d] bg-[#220c1d]'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Lyrics & Dedication</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('video');
            }}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 font-bold transition-colors cursor-pointer ${
              activeTab === 'video'
                ? 'text-[#e6be6d] border-b-2 border-[#e6be6d] bg-[#220c1d]'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-rose-500" />
            <span>Official Video</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'playlist' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono px-1">
                <span>Select a Bollywood song to set the romantic vibe:</span>
                <span className="text-[#e6be6d]">Click to play</span>
              </div>

              {BOLLYWOOD_LOVE_SONGS.map((song) => {
                const isSelected = song.id === currentSong.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectSong(song);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#381024] to-[#1f0b18] border-[#e6be6d] shadow-lg'
                        : 'bg-[#180a18] border-stone-800/80 hover:border-stone-600 hover:bg-[#200d1e]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isSelected && isPlaying ? 'animate-bounce' : ''
                        }`}
                        style={{
                          backgroundColor: `${song.themeColor}22`,
                          color: song.themeColor,
                          border: `1px solid ${song.themeColor}66`,
                        }}
                      >
                        {isSelected && isPlaying ? '▶' : '♫'}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif-romantic text-base font-bold text-white truncate">
                            {song.title}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-stone-300">
                            {song.movie}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 truncate">
                          {song.singers}
                        </p>
                        <p className="text-[11px] font-serif-romantic italic text-[#e6be6d] truncate pt-0.5">
                          “{song.lyricsSnippet}”
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#ff8da8] bg-[#85182a]/40 px-2.5 py-1 rounded-full border border-[#ff577d]/40">
                          {isPlaying ? 'Playing ❤️' : 'Selected'}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playClick();
                          if (isSelected) {
                            onTogglePlay();
                          } else {
                            onSelectSong(song);
                          }
                        }}
                        className={`p-2.5 rounded-full transition-all cursor-pointer ${
                          isSelected && isPlaying
                            ? 'bg-[#85182a] text-white shadow-md'
                            : 'bg-white/5 hover:bg-white/10 text-stone-300'
                        }`}
                      >
                        {isSelected && isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Custom Song Link option */}
              <div className="mt-6 pt-5 border-t border-stone-800 space-y-2">
                <span className="text-xs font-mono text-stone-400 block uppercase tracking-wider">
                  Have a specific Bollywood song MP3 URL?
                </span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/your-favourite-song.mp3"
                    className="flex-1 bg-black/50 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#e6be6d]"
                  />
                  <button
                    onClick={handleApplyCustomSong}
                    className="px-4 py-2 bg-[#85182a] hover:bg-[#a8223a] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Play
                  </button>
                </div>
                {customMsg && (
                  <span className="text-xs text-emerald-400 font-mono block">
                    ✓ {customMsg}
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'lyrics' && (
            <div className="space-y-6">
              {/* Highlight current song lyrics */}
              <div className="bg-[#1b0b18] border border-[#6b1b2d] rounded-2xl p-6 text-center space-y-4">
                <div className="inline-flex p-3 rounded-full bg-[#85182a]/30 text-[#e6be6d]">
                  <Heart className="w-6 h-6 fill-current text-[#ff577d]" />
                </div>
                <h3 className="font-serif-romantic text-2xl font-bold text-white">
                  {currentSong.title}
                </h3>
                <span className="text-xs font-mono uppercase tracking-widest text-[#e6be6d] block">
                  {currentSong.movie} • {currentSong.singers}
                </span>

                <div className="py-4 space-y-2 font-serif-romantic text-lg sm:text-xl text-[#fbebd5] italic leading-relaxed">
                  {currentSong.fullLyricsSnippet.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff8da8] block font-bold">
                    Radhika’s Dedication For Sammm:
                  </span>
                  <p className="font-handwriting text-xl text-[#e6be6d] font-bold">
                    “{currentSong.dedicationNote}”
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-serif-romantic text-lg font-bold text-white">
                  Watch & Listen: {currentSong.title}
                </h3>
                <p className="text-xs text-stone-400">
                  Official music video from {currentSong.movie}
                </p>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-stone-800 bg-black shadow-xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${currentSong.youtubeId}?autoplay=0&rel=0`}
                  title={currentSong.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <div className="flex justify-center">
                <a
                  href={`https://www.youtube.com/watch?v=${currentSong.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#e6be6d] hover:underline"
                >
                  <span>Open on YouTube in new tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#170916] border-t border-[#351225] p-4 flex items-center justify-between text-xs text-stone-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#e6be6d]" />
            Bollywood Romance Mode
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-full bg-[#85182a] hover:bg-[#a8223a] text-white font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
