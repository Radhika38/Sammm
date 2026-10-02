/**
 * Dedicated Ambient Background Soundtrack Engine
 * Independent of the Bollywood Songs player.
 * Plays a continuous, soothing, romantic looping soundtrack throughout the story.
 * Includes both high-quality audio streams and a Web Audio API procedural lush ambient pad engine fallback.
 */

export interface AmbientTrack {
  id: string;
  title: string;
  mood: string;
  audioUrl: string;
  bpm?: number;
}

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'starlight-reverie',
    title: 'Starlight Reverie',
    mood: 'Soft Piano & Ethereal Warm Pads',
    // Royalty-free peaceful ambient looping soundtrack
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-ambient-piano-112199.mp3',
  },
  {
    id: 'midnight-whispers',
    title: 'Midnight Whispers',
    mood: 'Lofi Acoustic & Warm Rain Texture',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-study-112191.mp3',
  },
  {
    id: 'golden-sunset',
    title: 'Golden Sunset Serenade',
    mood: 'Gentle Acoustic Guitar & Velvet Strings',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=relaxing-guitar-loop-romantic-10887.mp3',
  },
  {
    id: 'procedural-zen',
    title: 'Pure Stardust (Procedural)',
    mood: 'Gentle Web Audio Harmonized Chords',
    audioUrl: '', // Uses Web Audio synthesizer directly
  },
];

class AmbientSoundtrackService {
  private audio: HTMLAudioElement | null = null;
  private currentTrack: AmbientTrack = AMBIENT_TRACKS[0];
  private isEnabled: boolean = true;
  private isPlaying: boolean = false;
  private volume: number = 0.35;
  private isDucked: boolean = false; // Ducked when Bollywood song or video plays
  private listeners: Set<() => void> = new Set();

  // Procedural Web Audio Synth fallback
  private audioCtx: AudioContext | null = null;
  private synthInterval: any = null;
  private synthGain: GainNode | null = null;

  constructor() {
    // Load saved settings
    try {
      const savedEnabled = localStorage.getItem('sammm_radhika_ambient_enabled');
      if (savedEnabled !== null) {
        this.isEnabled = savedEnabled === 'true';
      }
      const savedVol = localStorage.getItem('sammm_radhika_ambient_volume');
      if (savedVol) {
        this.volume = parseFloat(savedVol);
      }
      const savedTrackId = localStorage.getItem('sammm_radhika_ambient_track');
      if (savedTrackId) {
        const found = AMBIENT_TRACKS.find((t) => t.id === savedTrackId);
        if (found) this.currentTrack = found;
      }
    } catch {
      // ignore
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getState() {
    return {
      isEnabled: this.isEnabled,
      isPlaying: this.isPlaying,
      volume: this.volume,
      currentTrack: this.currentTrack,
      isDucked: this.isDucked,
    };
  }

  public setTrack(track: AmbientTrack) {
    this.currentTrack = track;
    try {
      localStorage.setItem('sammm_radhika_ambient_track', track.id);
    } catch {}

    if (this.isPlaying) {
      this.playTrack(track);
    } else {
      this.notify();
    }
  }

  public toggle(): boolean {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.isEnabled;
  }

  public enable() {
    this.isEnabled = true;
    try {
      localStorage.setItem('sammm_radhika_ambient_enabled', 'true');
    } catch {}
    this.play();
  }

  public disable() {
    this.isEnabled = false;
    try {
      localStorage.setItem('sammm_radhika_ambient_enabled', 'false');
    } catch {}
    this.stop();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.isDucked ? this.volume * 0.15 : this.volume;
    }
    if (this.synthGain && this.audioCtx) {
      this.synthGain.gain.setValueAtTime(this.isDucked ? this.volume * 0.08 : this.volume * 0.35, this.audioCtx.currentTime);
    }
    try {
      localStorage.setItem('sammm_radhika_ambient_volume', this.volume.toString());
    } catch {}
    this.notify();
  }

  /**
   * Ducks ambient music when user plays a Bollywood song or video
   */
  public duck() {
    this.isDucked = true;
    if (this.audio) {
      this.audio.volume = this.volume * 0.15;
    }
    if (this.synthGain && this.audioCtx) {
      this.synthGain.gain.setValueAtTime(this.volume * 0.08, this.audioCtx.currentTime);
    }
    this.notify();
  }

  /**
   * Restores ambient music volume after Bollywood song finishes
   */
  public unduck() {
    this.isDucked = false;
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    if (this.synthGain && this.audioCtx) {
      this.synthGain.gain.setValueAtTime(this.volume * 0.35, this.audioCtx.currentTime);
    }
    this.notify();
  }

  public play() {
    if (!this.isEnabled) return;
    this.playTrack(this.currentTrack);
  }

  private playTrack(track: AmbientTrack) {
    this.stopAudioElement();
    this.stopProceduralSynth();

    if (!track.audioUrl) {
      this.startProceduralSynth();
      this.isPlaying = true;
      this.notify();
      return;
    }

    try {
      this.audio = new Audio(track.audioUrl);
      this.audio.loop = true;
      this.audio.volume = this.isDucked ? this.volume * 0.15 : this.volume;

      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.notify();
          })
          .catch(() => {
            // If browser audio blocked, smoothly fallback to Web Audio pad synth
            this.startProceduralSynth();
            this.isPlaying = true;
            this.notify();
          });
      }
    } catch (e) {
      this.startProceduralSynth();
      this.isPlaying = true;
      this.notify();
    }
  }

  public stop() {
    this.isPlaying = false;
    this.stopAudioElement();
    this.stopProceduralSynth();
    this.notify();
  }

  private stopAudioElement() {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch {}
      this.audio = null;
    }
  }

  // Web Audio API procedural ambient lush pad synthesizer
  private startProceduralSynth() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.stopProceduralSynth();

      // Master gain node
      this.synthGain = this.audioCtx.createGain();
      this.synthGain.gain.setValueAtTime(this.isDucked ? this.volume * 0.08 : this.volume * 0.35, this.audioCtx.currentTime);

      // Lowpass filter for warm velvety analog texture
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, this.audioCtx.currentTime);

      this.synthGain.connect(filter);
      filter.connect(this.audioCtx.destination);

      // Romantic chord progression (Fmaj7 - Cmaj7 - Dm7 - Am7)
      const chordNotes = [
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [130.81, 196.00, 261.63, 329.63], // Cmaj7
        [146.83, 220.00, 261.63, 349.23], // Dm7
        [110.00, 164.81, 220.00, 261.63], // Am7
      ];

      let chordIdx = 0;
      const playNextChord = () => {
        if (!this.audioCtx || !this.synthGain || !this.isEnabled) return;
        const currentChord = chordNotes[chordIdx % chordNotes.length];
        chordIdx++;

        currentChord.forEach((freq, idx) => {
          if (!this.audioCtx || !this.synthGain) return;
          try {
            const osc = this.audioCtx.createOscillator();
            const noteGain = this.audioCtx.createGain();

            osc.type = idx === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            // Gentle slow attack and long warm decay
            noteGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
            noteGain.gain.linearRampToValueAtTime(0.04, this.audioCtx.currentTime + 1.2);
            noteGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 4.8);

            osc.connect(noteGain);
            noteGain.connect(this.synthGain);

            osc.start(this.audioCtx.currentTime);
            osc.stop(this.audioCtx.currentTime + 5.0);
          } catch {}
        });
      };

      playNextChord();
      this.synthInterval = setInterval(playNextChord, 4200);
    } catch {}
  }

  private stopProceduralSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.synthGain && this.audioCtx) {
      try {
        this.synthGain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
      } catch {}
      this.synthGain = null;
    }
  }

  /**
   * Initializes audio on first user gesture anywhere on the window.
   */
  public handleFirstInteraction() {
    if (this.isEnabled && !this.isPlaying) {
      this.play();
    }
  }
}

export const ambientSoundtrack = new AmbientSoundtrackService();
