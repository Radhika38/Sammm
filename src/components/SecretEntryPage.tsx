import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Heart, Sparkles, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../services/soundEffects';
import { validateSecretLogin } from '../data/secretAuthConfig';

interface SecretEntryPageProps {
  onUnlockSuccess: () => void;
}

export const SecretEntryPage: React.FC<SecretEntryPageProps> = ({ onUnlockSuccess }) => {
  // Form inputs
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [password, setPassword] = useState('');
  const [promised, setPromised] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Card & typing animation steps
  // 0: Initial typing line 1
  // 1: Line 2
  // 2: Line 3
  // 3: Line 4
  // 4: "Because this little world is ONLY for you. ❤️" + Form revealed
  const [typeStep, setTypeStep] = useState(0);

  // States: 'idle' | 'validating' | 'error' | 'success' | 'transitioning'
  const [status, setStatus] = useState<'idle' | 'validating' | 'error' | 'success' | 'transitioning'>('idle');
  const [errorMessage, setErrorMessage] = useState<{
    main: string;
    sub: string;
    detail?: string;
  } | null>(null);

  const errorTimeoutRef = useRef<number | null>(null);

  // 3D Parallax mouse tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [entranceComplete, setEntranceComplete] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!entranceComplete || status !== 'idle') return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 10; // -5 to +5 deg
    const y = (clientY / innerHeight - 0.5) * -10; // -5 to +5 deg
    setMousePos({ x, y });
  };

  // Sequenced typewriter dialogue on first load
  useEffect(() => {
    const timers = [
      setTimeout(() => setTypeStep(1), 1200),
      setTimeout(() => setTypeStep(2), 2400),
      setTimeout(() => setTypeStep(3), 3600),
      setTimeout(() => setTypeStep(4), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Handle Form Submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (status === 'success' || status === 'transitioning') return;

    sound.playClick();
    setStatus('validating');

    // Slight suspense pause
    setTimeout(() => {
      const validation = validateSecretLogin(name, date, password, promised);

      if (validation.isValid) {
        // SUCCESS FLOW
        setStatus('success');
        sound.playChime();

        // Confetti Heart Burst around card
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.55 },
            colors: ['#ff4d79', '#ffd700', '#e6be6d', '#ffffff'],
            shapes: ['circle'],
            scalar: 1.2,
          });
        } catch {
          // ignore if canvas-confetti fails
        }

        // Cinematic Dark Transition after 2 seconds
        setTimeout(() => {
          setStatus('transitioning');
          sound.playPageTurn();

          // After transition screen, unlock the website and navigate to /story
          setTimeout(() => {
            onUnlockSuccess();
          }, 2400);
        }, 2200);

      } else {
        // ERROR FLOW
        sound.playNotification();
        setStatus('error');
        setErrorMessage({
          main: 'Ummm... 🤨 Nice try.',
          sub: "You're not my Sammm... or you're pretending REALLY badly. 😂",
          detail: validation.funnyMessage,
        });

        // Reset error message after 4.5 seconds
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = window.setTimeout(() => {
          setStatus('idle');
          setErrorMessage(null);
        }, 4500);
      }
    }, 400);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full relative flex items-center justify-center bg-[#060104] text-[#faf2ea] px-4 py-8 overflow-hidden select-none"
    >
      {/* Dark Nebulous Cosmic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Swirling Cosmic Deep Wine Nebula */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-[25%] -left-[20%] w-[140vw] h-[140vh] opacity-45 blur-[130px] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, rgba(133,24,42,0.6) 0%, rgba(58,10,25,0.45) 30%, rgba(20,5,15,0.2) 65%, transparent 85%)',
          }}
        />

        {/* Secondary Golden-Rose Nebula Swirl */}
        <motion.div
          animate={{
            scale: [1.15, 1, 1.15],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-[20%] -right-[15%] w-[110vw] h-[110vh] opacity-40 blur-[120px] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 65% 65%, rgba(230,190,109,0.35) 0%, rgba(133,24,42,0.38) 35%, rgba(35,8,22,0.2) 65%, transparent 85%)',
          }}
        />

        {/* Center Deep Violet Cosmic Eye */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-[#4a0b1c]/30 via-[#260515]/20 to-transparent blur-[140px] pointer-events-none" />

        {/* Floating Stars and Nebulous Stardust */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/80 animate-pulse pointer-events-none"
            style={{
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
              top: `${(i * 17) % 100}%`,
              left: `${(i * 23) % 100}%`,
              opacity: (i % 6) * 0.15 + 0.25,
              animationDuration: `${(i % 4) + 2.5}s`,
            }}
          />
        ))}

        {/* Drifting Golden Cosmic Dust */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute rounded-full bg-[#ffd700]/50 blur-[0.5px] pointer-events-none"
            initial={{
              y: '105vh',
              x: `${(i * 8) % 100}vw`,
              opacity: 0,
            }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.7, 0.3, 0],
              x: [`${(i * 8) % 100}vw`, `${((i * 8) % 100) + (i % 2 === 0 ? 30 : -30)}px`],
            }}
            transition={{
              duration: 18 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'linear',
            }}
            style={{
              width: `${(i % 4) + 2}px`,
              height: `${(i % 4) + 2}px`,
            }}
          />
        ))}

        {/* Subtle Floating Hearts */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute text-rose-500/25 text-xl pointer-events-none"
            initial={{ y: '100vh', opacity: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.4, 0.2, 0],
              x: [0, (i % 2 === 0 ? 30 : -30), 0],
            }}
            transition={{
              duration: 14 + i * 2,
              repeat: Infinity,
              delay: i * 2.5,
              ease: 'linear',
            }}
            style={{
              left: `${15 + i * 15}%`,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      {/* 3D PERSPECTIVE STAGE */}
      <div
        style={{ perspective: 1200 }}
        className="w-full max-w-md relative z-10 flex items-center justify-center"
      >
        {/* Main 3D Rotating Glassmorphism Login Card */}
        <motion.div
          initial={{
            opacity: 0,
            rotateX: 42,
            rotateY: -35,
            rotateZ: -10,
            scale: 0.65,
            y: 90,
            z: -300,
            filter: 'blur(12px)',
          }}
          animate={
            status === 'error'
              ? {
                  x: [-12, 12, -8, 8, -4, 4, 0],
                  rotateY: [-12, 12, -8, 8, 0],
                  rotateX: [0, 6, -6, 0],
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  z: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.5 },
                }
              : status === 'success'
              ? {
                  scale: [1, 1.04, 1.02],
                  rotateX: -4,
                  rotateY: 0,
                  rotateZ: 0,
                  boxShadow: '0 0 70px rgba(230, 190, 109, 0.5)',
                  opacity: 1,
                  y: -10,
                  z: 30,
                  filter: 'blur(0px)',
                  transition: { duration: 0.8 },
                }
              : {
                  opacity: 1,
                  rotateX: entranceComplete ? mousePos.y : 0,
                  rotateY: entranceComplete ? mousePos.x : 0,
                  rotateZ: 0,
                  scale: 1,
                  y: 0,
                  z: 0,
                  filter: 'blur(0px)',
                  transition: {
                    duration: 1.5,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }
          }
          onAnimationComplete={() => setEntranceComplete(true)}
          style={{ transformStyle: 'preserve-3d' }}
          className={`relative w-full bg-[#15050e]/80 backdrop-blur-2xl border rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_50px_rgba(133,24,42,0.35)] transition-colors duration-500 ${
            status === 'success'
              ? 'border-[#e6be6d] shadow-[0_0_60px_rgba(230,190,109,0.45)]'
              : status === 'error'
              ? 'border-rose-500/80 shadow-[0_0_40px_rgba(244,63,94,0.35)]'
              : 'border-[#e6be6d]/30 hover:border-[#e6be6d]/60'
          }`}
        >
        {/* Card Header Top Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-[#e6be6d] bg-[#310a16] border border-[#78182b]/60 px-3 py-1 rounded-full uppercase shadow-xs">
            <Lock className="w-3 h-3 text-[#e6be6d]" />
            <span>🔐 PRIVATE ACCESS</span>
          </span>
          <span className="text-[11px] font-mono text-stone-400">
            For Sammm Only ❤️
          </span>
        </div>

        {/* Animated Typing Text Intro */}
        <div className="min-h-[105px] flex flex-col justify-center space-y-1 mb-6 text-stone-200">
          <AnimatePresence mode="wait">
            {typeStep < 4 ? (
              <motion.div
                key="typing-lines"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-1 font-serif-romantic text-base sm:text-lg leading-relaxed text-[#f7ece0]"
              >
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-bold text-white text-lg"
                >
                  “Okay Sammm...
                </motion.p>
                {typeStep >= 1 && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[#ffd7a8]"
                  >
                    before you enter,
                  </motion.p>
                )}
                {typeStep >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[#f5d0de]"
                  >
                    I need to make sure
                  </motion.p>
                )}
                {typeStep >= 3 && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[#ff7597] font-semibold"
                  >
                    this is actually YOU. 👀”
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="typing-done"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-1.5"
              >
                <p className="font-serif-romantic text-base sm:text-lg text-[#f7ece0] leading-snug">
                  “Because this little world is
                </p>
                <p className="font-serif-romantic text-lg sm:text-xl font-bold text-[#e6be6d] flex items-center gap-1.5">
                  <span>ONLY for you. ❤️</span>
                  <Sparkles className="w-4 h-4 text-[#e6be6d] animate-pulse" />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#85182a]/50 to-transparent mb-5" />

        {/* SUCCESS VIEW */}
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-[#e6be6d]/20 border-2 border-[#e6be6d] mx-auto flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(230,190,109,0.5)]">
              ❤️
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-[#e6be6d] font-bold uppercase">
                ACCESS GRANTED ❤️
              </span>
              <p className="font-serif-romantic text-2xl font-bold text-white">
                “Okay... I knew it was you. 🥹”
              </p>
            </div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-serif-romantic text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ff7597] via-[#ffd700] to-[#ffffff] pt-2"
            >
              WELCOME, SAMMM ❤️
            </motion.h3>
            <p className="text-xs text-stone-400 font-mono pt-2 animate-pulse">
              Opening your secret world...
            </p>
          </motion.div>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-romantic text-xl font-bold text-white flex items-center gap-2">
                <span>PROVE YOU'RE MY SAMMM</span>
                <span className="text-base">👀</span>
              </h2>
            </div>

            {/* Error Message Display */}
            <AnimatePresence>
              {status === 'error' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-950/60 border border-rose-500/60 rounded-xl p-3.5 space-y-1 text-xs text-rose-200"
                >
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errorMessage.main}</span>
                  </div>
                  <p className="pl-6 font-medium text-stone-200">{errorMessage.sub}</p>
                  {errorMessage.detail && (
                    <p className="pl-6 text-[#ffd700] font-mono text-[11px] italic">
                      👉 {errorMessage.detail}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input 1: Your Name */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Type your name..."
                required
                autoComplete="off"
                className="w-full px-4 py-3 bg-[#0d0408]/90 border border-[#521323] focus:border-[#e6be6d] focus:ring-1 focus:ring-[#e6be6d]/50 rounded-xl text-stone-100 placeholder-stone-500 text-sm font-sans outline-none transition-all"
              />
              <span className="text-[10px] text-stone-500 font-mono block pl-1">
                Tip: Sammm / Sam
              </span>
            </div>

            {/* Input 2: Our Special Date */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider">
                Our Special Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="DD / MM / YYYY"
                required
                autoComplete="off"
                className="w-full px-4 py-3 bg-[#0d0408]/90 border border-[#521323] focus:border-[#e6be6d] focus:ring-1 focus:ring-[#e6be6d]/50 rounded-xl text-stone-100 placeholder-stone-500 text-sm font-sans outline-none transition-all"
              />
              <span className="text-[10px] text-stone-500 font-mono block pl-1">
                Format: 27/07/2026
              </span>
            </div>

            {/* Input 3: Secret Password */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider">
                Secret Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Only you should know this 🤫"
                  required
                  autoComplete="off"
                  className="w-full px-4 py-3 pr-11 bg-[#0d0408]/90 border border-[#521323] focus:border-[#e6be6d] focus:ring-1 focus:ring-[#e6be6d]/50 rounded-xl text-stone-100 placeholder-stone-500 text-sm font-sans outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1 cursor-pointer transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox: I promise I'm actually Sammm 😂 */}
            <label className="flex items-start gap-3 pt-1 cursor-pointer select-none group">
              <div
                onClick={() => {
                  sound.playClick();
                  setPromised(!promised);
                  if (status === 'error') setStatus('idle');
                }}
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                  promised
                    ? 'bg-[#85182a] border-[#e6be6d] text-white shadow-xs'
                    : 'bg-[#12040b] border-[#521323] text-transparent group-hover:border-[#85182a]'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm text-stone-300 group-hover:text-stone-100 transition-colors">
                I promise I'm actually Sammm 😂
              </span>
            </label>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={status === 'validating'}
                className={`w-full py-3.5 px-6 rounded-2xl font-serif-romantic font-bold text-base transition-all duration-300 shadow-xl cursor-pointer flex items-center justify-center gap-2 border ${
                  status === 'error'
                    ? 'bg-rose-900/80 hover:bg-rose-800 text-white border-rose-500/60'
                    : 'bg-gradient-to-r from-[#85182a] via-[#a8223b] to-[#85182a] hover:from-[#9c1c32] hover:to-[#b82542] text-white border-[#e6be6d]/40 hover:shadow-[#85182a]/50 hover:scale-[1.01]'
                }`}
              >
                <span>{status === 'error' ? 'Try Again ❤️' : 'ENTER OUR STORY ❤️ →'}</span>
              </button>
            </div>
          </form>
        )}
        </motion.div>
      </div>

      {/* FULL-SCREEN CINEMATIC DARK TRANSITION OVERLAY */}
      <AnimatePresence>
        {status === 'transitioning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-[#050104] flex flex-col items-center justify-center text-center px-6 select-none"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-5"
            >
              <span className="text-xs font-mono tracking-widest text-[#e6be6d] uppercase bg-[#280812] px-4 py-1.5 rounded-full border border-[#85182a]/60">
                ACCESS GRANTED ❤️
              </span>
              <h2 className="font-serif-romantic text-3xl sm:text-5xl font-bold text-white">
                “Your story is waiting...”
              </h2>
              <div className="flex items-center justify-center gap-3 pt-4 text-rose-500 text-2xl animate-pulse">
                <span>♥</span>
                <span className="text-3xl text-[#e6be6d]">♥</span>
                <span>♥</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
