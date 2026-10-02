import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Check,
  X,
  FileAudio,
  Headphones,
  Edit3,
  MessageSquareHeart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sound } from '../services/soundEffects';

interface AudioMessageProps {
  voiceUrl?: string;
  onSaveVoiceUrl: (url: string) => void;
  autoPlayPrompt?: boolean;
}

export const AudioMessage: React.FC<AudioMessageProps> = ({
  voiceUrl: externalVoiceUrl,
  onSaveVoiceUrl,
  autoPlayPrompt = true,
}) => {
  // Check local storage or external prop for existing voice greeting
  const [currentVoiceUrl, setCurrentVoiceUrl] = useState<string>(() => {
    if (externalVoiceUrl) return externalVoiceUrl;
    try {
      const saved = localStorage.getItem('sammm_radhika_voice_greeting_v1');
      return saved || '';
    } catch {
      return '';
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showRecorderModal, setShowRecorderModal] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Recorder states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [recordedBase64, setRecordedBase64] = useState<string | null>(null);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync with prop if it changes
  useEffect(() => {
    if (externalVoiceUrl) {
      setCurrentVoiceUrl(externalVoiceUrl);
    }
  }, [externalVoiceUrl]);

  // Audio element listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentVoiceUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    sound.playClick();
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback failed:', err);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- RECORDING LOGIC ---
  const startRecording = async () => {
    setRecordError(null);
    setRecordedBlobUrl(null);
    setRecordedBase64(null);
    audioChunksRef.current = [];

    try {
      sound.playClick();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const blobUrl = URL.createObjectURL(audioBlob);
        setRecordedBlobUrl(blobUrl);

        // Convert to base64 so it can be saved in localStorage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setRecordedBase64(base64);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks to turn off the microphone light
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200); // 200ms slices
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 120) {
            // Auto stop at 2 minutes
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      setRecordError('Could not access microphone. Please ensure microphone permissions are granted, or upload an audio file below.');
    }
  };

  const stopRecording = () => {
    sound.playClick();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setRecordedBase64(base64);
      setRecordedBlobUrl(base64);
      sound.playChime();
    };
    reader.readAsDataURL(file);
  };

  const saveRecording = () => {
    if (!recordedBase64) return;

    sound.playChime();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#ff7597', '#e6be6d', '#85182a', '#ffffff'],
    });

    setCurrentVoiceUrl(recordedBase64);
    onSaveVoiceUrl(recordedBase64);
    try {
      localStorage.setItem('sammm_radhika_voice_greeting_v1', recordedBase64);
    } catch {}

    setShowRecorderModal(false);
  };

  const clearVoiceGreeting = () => {
    sound.playClick();
    setCurrentVoiceUrl('');
    onSaveVoiceUrl('');
    setRecordedBlobUrl(null);
    setRecordedBase64(null);
    try {
      localStorage.removeItem('sammm_radhika_voice_greeting_v1');
    } catch {}
  };

  return (
    <div className="w-full max-w-md mx-auto my-3 relative">
      {/* Hidden Audio Tag for Main Player */}
      {currentVoiceUrl && (
        <audio
          ref={audioRef}
          src={currentVoiceUrl}
          muted={isMuted}
          preload="metadata"
        />
      )}

      {/* Main Voice Greeting Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-[#e6be6d]/50 bg-gradient-to-r from-[#210a17]/90 via-[#180712]/95 to-[#210a17]/90 p-4 shadow-xl backdrop-blur-md"
      >
        {/* Top bar with avatar & title */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#85182a] to-[#d4af37] flex items-center justify-center text-white shadow-md border border-[#e6be6d]/60">
                <Mic className="w-4 h-4 text-[#ffccd7]" />
              </div>
              {isPlaying && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e6be6d] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e6be6d]" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#e6be6d] font-bold">
                  Voice Note
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  • From Radhika
                </span>
              </div>
              <h4 className="font-serif-romantic text-sm font-bold text-white">
                {currentVoiceUrl ? 'A Spoken Greeting for Sammm ❤️' : 'Voice Greeting Awaiting Recording'}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Transcript Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                setShowTranscript(!showTranscript);
              }}
              className="p-1.5 text-stone-400 hover:text-[#e6be6d] rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-xs"
              title="Show Transcript"
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
            </button>

            {/* Record / Change Audio Settings */}
            <button
              onClick={() => {
                sound.playClick();
                setShowRecorderModal(true);
              }}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-[#85182a]/50 text-stone-300 hover:text-white border border-white/10 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-all"
              title="Record or Upload Voice Greeting"
            >
              <Edit3 className="w-3 h-3 text-[#e6be6d]" />
              <span>{currentVoiceUrl ? 'Change' : 'Record'}</span>
            </button>
          </div>
        </div>

        {/* Audio Controls & Equalizer */}
        {currentVoiceUrl ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {/* Play / Pause Button */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#85182a] to-[#a32238] hover:from-[#a32238] hover:to-[#85182a] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 border border-[#e6be6d]/60 cursor-pointer shrink-0"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current text-white" />
                ) : (
                  <Play className="w-4 h-4 fill-current text-white ml-0.5" />
                )}
              </button>

              {/* Animated Waveform bars */}
              <div className="flex-1 flex items-center gap-1 h-6 px-1">
                {[12, 22, 16, 28, 14, 26, 18, 30, 20, 14, 24, 18, 12].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#85182a] rounded-full transition-all duration-200"
                    style={{
                      height: isPlaying ? `${Math.max(6, (height * (0.4 + Math.sin(currentTime * 5 + i) * 0.6)))}px` : '4px',
                      backgroundColor: isPlaying ? (i % 2 === 0 ? '#e6be6d' : '#ff7597') : '#542033',
                    }}
                  />
                ))}
              </div>

              {/* Time display */}
              <span className="text-[11px] font-mono text-[#e6be6d] font-bold shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Progress Scrubber */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-[#3d1323] rounded-lg appearance-none cursor-pointer accent-[#e6be6d]"
              />

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-stone-400 hover:text-white p-1"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ) : (
          /* Empty State: Encourages Radhika or user to record */
          <div className="p-3 bg-black/30 rounded-xl border border-dashed border-[#e6be6d]/40 text-center">
            <p className="text-xs text-stone-300 font-sans">
              No voice greeting recorded yet.
            </p>
            <button
              onClick={() => setShowRecorderModal(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#85182a] hover:bg-[#a32238] text-white text-xs font-mono font-bold transition-all shadow cursor-pointer"
            >
              <Mic className="w-3 h-3 text-[#e6be6d]" />
              <span>Record Radhika’s Voice Greeting</span>
            </button>
          </div>
        )}

        {/* Spoken Word Transcript / Subtitles */}
        <AnimatePresence>
          {showTranscript && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-white/10 text-xs font-serif-romantic text-stone-300 italic bg-black/20 p-2.5 rounded-xl border border-white/5"
            >
              <p>
                “Hey Sammm... before you start reading this, I just wanted you to hear my voice. You mean so much to me, more than words could ever describe. Happy National Boyfriend Day, my handsome doctor. I love you!”
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Headphones Hint */}
        <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-stone-400">
          <span className="flex items-center gap-1 text-[#e6be6d]">
            <Headphones className="w-3 h-3" />
            <span>Best experienced with earphones</span>
          </span>
          <span className="text-stone-500">Radhika ❤️ Sammm</span>
        </div>
      </motion.div>

      {/* RECORD / UPLOAD MODAL */}
      <AnimatePresence>
        {showRecorderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#160a16] border-2 border-[#85182a] rounded-3xl shadow-2xl p-6 text-white text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#3b1222] pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#85182a] flex items-center justify-center text-[#e6be6d]">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-romantic text-lg font-bold text-white">
                      Record or Upload Voice Greeting
                    </h3>
                    <p className="text-[11px] font-mono text-stone-400">
                      Plays when Sammm enters the Opening Cinematic
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    if (isRecording) stopRecording();
                    setShowRecorderModal(false);
                  }}
                  className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Error banner if microphone blocked */}
              {recordError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-mono">
                  {recordError}
                </div>
              )}

              {/* RECORD SECTION */}
              <div className="bg-[#240e1f] border border-[#521b33] rounded-2xl p-5 text-center mb-5 shadow-inner">
                <div className="mb-3">
                  {isRecording ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 border border-rose-500 text-rose-300 text-xs font-mono animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Recording Live... ({formatTime(recordingTime)})</span>
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-stone-400">
                      Tap the microphone to speak a sweet message for Sammm
                    </span>
                  )}
                </div>

                {/* Big Microphone Action Button */}
                <div className="my-4 flex justify-center">
                  {!isRecording ? (
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startRecording}
                      className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#85182a] to-[#d4af37] flex flex-col items-center justify-center text-white shadow-2xl border-2 border-white/20 cursor-pointer"
                      title="Start Microphone Recording"
                    >
                      <Mic className="w-8 h-8 text-white" />
                      <span className="text-[9px] font-mono uppercase tracking-wider font-bold mt-1">
                        Record
                      </span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={stopRecording}
                      className="w-20 h-20 rounded-full bg-rose-600 flex flex-col items-center justify-center text-white shadow-2xl border-2 border-white/40 cursor-pointer animate-pulse"
                      title="Stop Recording"
                    >
                      <div className="w-6 h-6 rounded bg-white" />
                      <span className="text-[9px] font-mono uppercase tracking-wider font-bold mt-1">
                        Stop
                      </span>
                    </motion.button>
                  )}
                </div>

                {/* Preview player if freshly recorded */}
                {recordedBlobUrl && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold block">
                      ✓ Recording Ready! Listen to preview:
                    </span>
                    <audio
                      controls
                      src={recordedBlobUrl}
                      className="w-full h-9 rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* UPLOAD AUDIO FILE SECTION */}
              <div className="p-4 bg-[#1a0a18] border border-stone-800 rounded-2xl mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-300 font-bold flex items-center gap-1.5">
                    <FileAudio className="w-3.5 h-3.5 text-[#e6be6d]" />
                    Or Upload Existing Audio File
                  </span>
                  <span className="text-[10px] font-mono text-stone-500">
                    MP3, WAV, M4A
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#e6be6d]/50 hover:border-[#e6be6d] bg-black/30 hover:bg-white/5 text-stone-300 text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#e6be6d]" />
                  <span>Choose Voice Note from Device</span>
                </button>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
                {currentVoiceUrl && (
                  <button
                    onClick={clearVoiceGreeting}
                    className="text-xs font-mono text-rose-400 hover:text-rose-300 underline cursor-pointer"
                  >
                    Remove Greeting
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => {
                      if (isRecording) stopRecording();
                      setShowRecorderModal(false);
                    }}
                    className="px-4 py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={saveRecording}
                    disabled={!recordedBase64}
                    className={`px-5 py-2 rounded-full font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                      recordedBase64
                        ? 'bg-gradient-to-r from-[#85182a] to-[#d4af37] text-white cursor-pointer hover:scale-105'
                        : 'bg-stone-800 text-stone-600 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Greeting</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
