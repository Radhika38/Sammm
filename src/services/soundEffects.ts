import { BollywoodSong, BOLLYWOOD_LOVE_SONGS } from '../data/bollywoodSongs';

/**
 * Web Audio API synthesizer for sound effects and gentle ambient background music.
 * Zero external audio dependencies required, instant, responsive, and works on all browsers.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  public sfxEnabled: boolean = true;
  public musicEnabled: boolean = false;
  private musicInterval: any = null;
  private customAudio: HTMLAudioElement | null = null;
  private customMusicUrl: string | null = null;
  public currentBollywoodSong: BollywoodSong = BOLLYWOOD_LOVE_SONGS[0];
  public isBollywoodPlaying: boolean = false;
  private melodyTimeouts: any[] = [];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setCustomMusic(url: string | null) {
    this.customMusicUrl = url;
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    if (this.musicEnabled && url) {
      this.playCustomMusic();
    }
  }

  public setBollywoodSong(song: BollywoodSong) {
    this.currentBollywoodSong = song;
    if (this.isBollywoodPlaying || this.musicEnabled) {
      this.playBollywoodSong(song);
    }
  }

  public playBollywoodSong(song?: BollywoodSong) {
    this.initCtx();
    const targetSong = song || this.currentBollywoodSong;
    this.currentBollywoodSong = targetSong;
    this.stopMusic();
    this.musicEnabled = true;
    this.isBollywoodPlaying = true;

    // 1. Play real audio track if available
    if (targetSong.audioUrl) {
      if (this.customAudio) {
        this.customAudio.pause();
        this.customAudio = null;
      }
      this.customAudio = new Audio(targetSong.audioUrl);
      this.customAudio.loop = true;
      this.customAudio.volume = 0.45;
      this.customAudio.play().catch(() => {
        // Fallback to synthesized melody if browser restricts external audio
        this.playBollywoodMelody(targetSong);
      });
    } else {
      this.playBollywoodMelody(targetSong);
    }
  }

  public playBollywoodMelody(song: BollywoodSong) {
    this.clearMelodyTimeouts();
    if (!this.ctx) return;

    const playNotes = () => {
      if (!this.musicEnabled || !this.ctx) return;
      song.melodyNotes.forEach(({ note, dur, delay }) => {
        const tid = setTimeout(() => {
          if (!this.musicEnabled || !this.ctx) return;
          try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note, this.ctx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(950, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + dur + 0.05);
          } catch (_) {}
        }, delay);
        this.melodyTimeouts.push(tid);
      });
    };

    playNotes();
    const loopTid = setInterval(playNotes, 4200);
    this.melodyTimeouts.push(loopTid);
  }

  private clearMelodyTimeouts() {
    this.melodyTimeouts.forEach((t) => {
      clearTimeout(t);
      clearInterval(t);
    });
    this.melodyTimeouts = [];
  }

  public toggleMusic(enable?: boolean): boolean {
    this.initCtx();
    const target = enable !== undefined ? enable : !this.musicEnabled;
    this.musicEnabled = target;

    if (this.musicEnabled) {
      if (this.currentBollywoodSong) {
        this.playBollywoodSong(this.currentBollywoodSong);
      } else if (this.customMusicUrl) {
        this.playCustomMusic();
      } else {
        this.startAmbientMusic();
      }
    } else {
      this.stopMusic();
    }
    return this.musicEnabled;
  }

  private playCustomMusic() {
    if (!this.customMusicUrl) return;
    if (!this.customAudio) {
      this.customAudio = new Audio(this.customMusicUrl);
      this.customAudio.loop = true;
      this.customAudio.volume = 0.4;
    }
    this.customAudio.play().catch(() => {});
  }

  public stopMusic() {
    this.isBollywoodPlaying = false;
    this.clearMelodyTimeouts();
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  private startAmbientMusic() {
    this.stopMusic();
    // Warm romantic piano/electric chord progression in C/Am (Cmaj9, Am9, Fmaj7, Gsus4)
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // C E G B
      [220.00, 261.63, 329.63, 392.00], // A C E G
      [174.61, 261.63, 329.63, 392.00], // F C E G
      [196.00, 293.66, 392.00, 440.00], // G D G A
    ];
    let chordIdx = 0;

    const playChord = () => {
      if (!this.musicEnabled || !this.ctx) return;
      const chord = chords[chordIdx % chords.length];
      chordIdx++;

      chord.forEach((freq, i) => {
        setTimeout(() => {
          if (!this.musicEnabled || !this.ctx) return;
          try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.035, this.ctx.currentTime + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 3.4);
          } catch (_) {}
        }, i * 320);
      });
    };

    playChord();
    this.musicInterval = setInterval(playChord, 3800);
  }

  // SFX: Soft button click
  public playClick() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (_) {}
  }

  // SFX: Heartbeat thump-thump
  public playHeartbeat() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const thump = (timeOffset: number, freq: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + timeOffset);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + timeOffset + 0.15);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.ctx.currentTime + timeOffset);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + timeOffset);
      gain.gain.linearRampToValueAtTime(0.28, this.ctx.currentTime + timeOffset + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + timeOffset + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + timeOffset);
      osc.stop(this.ctx.currentTime + timeOffset + 0.22);
    };

    thump(0, 75);
    thump(0.16, 65);
  }

  // SFX: Pickleball bounce pop
  public playPickleballHit() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(560, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.11);
    } catch (_) {}
  }

  // SFX: Phone / Message notification tone
  public playNotification() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const notes = [659.25, 880.00]; // E5, A5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.24);
      }, idx * 110);
    });
  }

  // SFX: Envelope unseal
  public playEnvelopeOpen() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (_) {}
  }

  // SFX: Cinema Ticket Tear
  public playTicketTear() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.19);
    } catch (_) {}
  }

  // SFX: Joyous chime / Easter egg discovery
  public playChime() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.45);
      }, idx * 75);
    });
  }

  // SFX: Realistic, crisp scrapbook page turn
  public playPageTurn() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      // Soft pink/parchment friction noise
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.2 + white * 0.14;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Sweeping bandpass filter simulates paper swishing across page
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.12);
      filter.frequency.exponentialRampToValueAtTime(600, now + 0.32);
      filter.Q.setValueAtTime(1.8, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.35);

      // Delicate secondary flutter for crisp page flip feel
      const flutterBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.16), this.ctx.sampleRate);
      const flutterData = flutterBuffer.getChannelData(0);
      for (let i = 0; i < flutterData.length; i++) {
        flutterData[i] = (Math.random() * 2 - 1) * 0.22;
      }
      const flutterSource = this.ctx.createBufferSource();
      flutterSource.buffer = flutterBuffer;

      const flutterFilter = this.ctx.createBiquadFilter();
      flutterFilter.type = 'highpass';
      flutterFilter.frequency.setValueAtTime(1800, now + 0.07);

      const flutterGain = this.ctx.createGain();
      flutterGain.gain.setValueAtTime(0.001, now + 0.07);
      flutterGain.gain.linearRampToValueAtTime(0.08, now + 0.11);
      flutterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      flutterSource.connect(flutterFilter);
      flutterFilter.connect(flutterGain);
      flutterGain.connect(this.ctx.destination);

      flutterSource.start(now + 0.07);
      flutterSource.stop(now + 0.23);
    } catch (_) {}
  }

  // SFX: Calming Tibetan singing bowl / meditation chime for 2 AM overthinking
  public playCalmBell() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Harmonics for a deeply soothing peaceful Tibetan singing bowl
      const fundamentals = [432.0, 864.0, 1296.0];
      fundamentals.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const initGain = idx === 0 ? 0.22 : 0.07 / (idx + 1);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(initGain, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 4.0);
      });
    } catch (_) {}
  }

  // SFX: Warm snug hug heartbeat resonance
  public playTightHug() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [0, 0.22, 0.44].forEach((offset, idx) => {
        setTimeout(() => {
          this.playHeartbeat();
        }, offset * 1000);
      });
      setTimeout(() => {
        this.playChime();
      }, 500);
    } catch (_) {}
  }

  // SFX: Pill bottle cap unscrew and pop
  public playPillBottlePop() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Click/twist ratchet sound
      [0, 0.05, 0.1].forEach((t) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now + t);
        osc.frequency.exponentialRampToValueAtTime(180, now + t + 0.03);
        gain.gain.setValueAtTime(0.001, now + t);
        gain.gain.linearRampToValueAtTime(0.12, now + t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + 0.04);
      });

      // Soft suction bottle pop at 0.18s
      setTimeout(() => {
        if (!this.ctx) return;
        const popTime = this.ctx.currentTime;
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        popOsc.type = 'sine';
        popOsc.frequency.setValueAtTime(140, popTime);
        popOsc.frequency.exponentialRampToValueAtTime(680, popTime + 0.04);
        popOsc.frequency.exponentialRampToValueAtTime(260, popTime + 0.09);

        popGain.gain.setValueAtTime(0.001, popTime);
        popGain.gain.linearRampToValueAtTime(0.25, popTime + 0.02);
        popGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.12);

        popOsc.connect(popGain);
        popGain.connect(this.ctx.destination);
        popOsc.start(popTime);
        popOsc.stop(popTime + 0.13);
      }, 180);
    } catch (_) {}
  }
}

export const sound = new SoundSystem();
