/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { OpeningCinematic } from './components/OpeningCinematic';
import { TopBar } from './components/TopBar';
import { MediaModal } from './components/MediaModal';
import { EasterEggsModal } from './components/EasterEggsModal';
import { EasterEggToast } from './components/EasterEggToast';
import { BollywoodMusicModal } from './components/BollywoodMusicModal';
import { OpenWhenModal } from './components/OpenWhenModal';
import { DailyLoveNoteCard } from './components/DailyLoveNoteCard';
import { RelationshipMilestones } from './components/RelationshipMilestones';
import { FloatingHeartsTransition } from './components/FloatingHeartsTransition';
import { OrigamiLoveJar } from './components/OrigamiLoveJar';
import { AmbientStardust } from './components/AmbientStardust';
import { InteractiveSparklesOverlay } from './components/InteractiveSparklesOverlay';
import { DailyLoveNoteModal } from './components/DailyLoveNoteModal';
import { OrigamiLoveJarModal } from './components/OrigamiLoveJarModal';
import { TimelineModal } from './components/TimelineModal';
import { DoctorPrescriptionModal } from './components/DoctorPrescriptionModal';
import { StoryNavigationBar } from './components/StoryNavigationBar';
import { motion, AnimatePresence } from 'framer-motion';

// Chapters
import { Chapter01Pickleball } from './components/chapters/Chapter01Pickleball';
import { Chapter02ShyBoy } from './components/chapters/Chapter02ShyBoy';
import { Chapter03AlwaysThere } from './components/chapters/Chapter03AlwaysThere';
import { Chapter04May31 } from './components/chapters/Chapter04May31';
import { Chapter05TheEnd } from './components/chapters/Chapter05TheEnd';
import { Chapter06FirstMovie } from './components/chapters/Chapter06FirstMovie';
import { Chapter07Confession } from './components/chapters/Chapter07Confession';
import { Chapter08GalleryAndQuiz } from './components/chapters/Chapter08GalleryAndQuiz';
import { Chapter09TheLetter } from './components/chapters/Chapter09TheLetter';
import { Chapter10DoctorSammm } from './components/chapters/Chapter10DoctorSammm';
import { FinalSurprise } from './components/FinalSurprise';

import { DEFAULT_MEDIA_CONFIG, EASTER_EGGS_LIST } from './data/mediaConfig';
import { BOLLYWOOD_LOVE_SONGS, BollywoodSong } from './data/bollywoodSongs';
import { sound } from './services/soundEffects';
import { TransitionNote, loadTransitionNotes, saveTransitionNotes } from './data/transitionNotes';
import { ChapterTransitionNotePopup } from './components/ChapterTransitionNotePopup';
import { TransitionNotesCustomizerModal } from './components/TransitionNotesCustomizerModal';
import { ambientSoundtrack } from './services/ambientSoundtrack';
import { SecretEntryPage } from './components/SecretEntryPage';
import { LoveCouponsModal } from './components/LoveCouponsModal';
import { CoupleBucketListModal } from './components/CoupleBucketListModal';
import { LoveCounterModal } from './components/LoveCounterModal';
import { persistentMediaStorage } from './services/persistentMediaStorage';

export default function App() {
  // Secret Entry Gateway lock (true only after successful verification in the current session)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      const sessionUnlocked = sessionStorage.getItem('storyUnlocked') === 'true';
      const isStoryUrl =
        window.location.pathname.includes('/story') || window.location.hash.includes('story');
      return sessionUnlocked && isStoryUrl;
    } catch {
      return false;
    }
  });

  const [phase, setPhase] = useState<'loading' | 'opening' | 'story'>('opening');
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const totalChapters = 11;

  // Media configuration with localStorage persistence
  const [mediaConfig, setMediaConfig] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('sammm_radhika_media_v2');
      const parsed = saved ? JSON.parse(saved) : {};
      // Static website media must remain the fallback even if an older browser
      // session contains empty/placeholder media values.
      const nonEmptySaved = Object.fromEntries(
        Object.entries(parsed || {}).filter(([, value]) => typeof value === 'string' && value.trim() !== '')
      );
      return { ...DEFAULT_MEDIA_CONFIG, ...nonEmptySaved };
    } catch {
      return DEFAULT_MEDIA_CONFIG;
    }
  });

  // Easter eggs tracker
  const [unlockedEggs, setUnlockedEggs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sammm_radhika_eggs_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeEggToast, setActiveEggToast] = useState<{
    id: string;
    title: string;
    message: string;
  } | null>(null);

  // Audio & Modals
  const [musicPlaying, setMusicPlaying] = useState<boolean>(false);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);
  const [mediaModalOpen, setMediaModalOpen] = useState<boolean>(false);
  const [mediaModalActiveKey, setMediaModalActiveKey] = useState<string | null>(null);
  const [eggsModalOpen, setEggsModalOpen] = useState<boolean>(false);
  const [bollywoodModalOpen, setBollywoodModalOpen] = useState<boolean>(false);
  const [currentBollywoodSong, setCurrentBollywoodSong] = useState<BollywoodSong>(BOLLYWOOD_LOVE_SONGS[0]);
  const [openWhenModalOpen, setOpenWhenModalOpen] = useState<boolean>(false);
  const [activeOpenWhenEnvelopeId, setActiveOpenWhenEnvelopeId] = useState<string | null>(null);

  // Dedicated Section Modals for TopBar navigation
  const [dailyNoteModalOpen, setDailyNoteModalOpen] = useState<boolean>(false);
  const [loveJarModalOpen, setLoveJarModalOpen] = useState<boolean>(false);
  const [timelineModalOpen, setTimelineModalOpen] = useState<boolean>(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState<boolean>(false);
  const [couponsModalOpen, setCouponsModalOpen] = useState<boolean>(false);
  const [bucketListModalOpen, setBucketListModalOpen] = useState<boolean>(false);
  const [loveCounterModalOpen, setLoveCounterModalOpen] = useState<boolean>(false);

  // Chapter Transition Notes (Whispers)
  const [transitionNotes, setTransitionNotes] = useState<TransitionNote[]>(() => loadTransitionNotes());
  const [activeTransitionPopup, setActiveTransitionPopup] = useState<{
    note: TransitionNote;
    targetChapter: number;
  } | null>(null);
  const [transitionEditorOpen, setTransitionEditorOpen] = useState<boolean>(false);
  const [transitionEditorSelectedId, setTransitionEditorSelectedId] = useState<string | null>(null);

  const handleOpenOpenWhenModal = (envelopeId?: string) => {
    sound.playEnvelopeOpen();
    setActiveOpenWhenEnvelopeId(envelopeId || null);
    setOpenWhenModalOpen(true);
  };

  const handleOpenDailyNote = () => {
    sound.playClick();
    setDailyNoteModalOpen(true);
  };

  const handleOpenTimeline = () => {
    sound.playClick();
    setTimelineModalOpen(true);
  };

  const handleOpenLoveJar = () => {
    sound.playClick();
    setLoveJarModalOpen(true);
  };

  const handleOpenPrescription = () => {
    sound.playClick();
    setPrescriptionModalOpen(true);
  };

  // Midnight Theme State (persisted in localStorage)
  const [midnightMode, setMidnightMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sammm_radhika_midnight_theme') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleMidnightMode = () => {
    sound.playClick();
    setMidnightMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sammm_radhika_midnight_theme', String(next));
      } catch {}
      return next;
    });
  };

  // Load photos & media from persistent IndexedDB vault on boot
  useEffect(() => {
    let isMounted = true;
    persistentMediaStorage.getAllMedia().then((storedMedia) => {
      if (isMounted && storedMedia && Object.keys(storedMedia).length > 0) {
        const nonEmptyStored = Object.fromEntries(
          Object.entries(storedMedia).filter(
            ([, value]) => typeof value === 'string' && value.trim() !== ''
          )
        );
        setMediaConfig((prev) => ({
          ...prev,
          ...nonEmptyStored,
        }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle media updates with persistent IndexedDB & auto-compression
  const handleUpdateMedia = async (key: string, value: string) => {
    // Compress image if applicable to save memory
    const compressed = await persistentMediaStorage.compressImageIfNeeded(value);
    const updated = { ...mediaConfig, [key]: compressed };
    setMediaConfig(updated);

    // 1. Save to high-capacity IndexedDB vault (500MB+ limit)
    persistentMediaStorage.saveMedia(key, compressed);

    // 2. Safe fallback in localStorage for smaller values
    try {
      if (compressed.length < 500 * 1024) {
        localStorage.setItem('sammm_radhika_media_v2', JSON.stringify(updated));
      }
    } catch {}

    if (key === 'ADD_MUSIC_HERE') {
      sound.setCustomMusic(compressed || null);
    }
  };

  // Open photo replacer directly for specific slot
  const handleOpenPhotoSlot = (key: string) => {
    sound.playClick();
    setMediaModalActiveKey(key);
    setMediaModalOpen(true);
  };

  // Easter Egg Trigger
  const handleTriggerEasterEgg = (eggId: string) => {
    const egg = EASTER_EGGS_LIST.find((e) => e.id === eggId);
    if (!egg) return;

    if (!unlockedEggs.includes(eggId)) {
      const updated = [...unlockedEggs, eggId];
      setUnlockedEggs(updated);
      try {
        localStorage.setItem('sammm_radhika_eggs_v2', JSON.stringify(updated));
      } catch {}
    }

    setActiveEggToast({
      id: egg.id,
      title: egg.title,
      message: egg.message,
    });

    setTimeout(() => {
      setActiveEggToast(null);
    }, 6000);
  };

  // Auto-play ambient background soundtrack on first interaction anywhere on page
  useEffect(() => {
    const handleFirstGesture = () => {
      ambientSoundtrack.handleFirstInteraction();
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  // Bollywood Music controls (Distinct from continuous ambient soundtrack)
  const handleSelectBollywoodSong = (song: BollywoodSong) => {
    setCurrentBollywoodSong(song);
    sound.setBollywoodSong(song);
    setMusicPlaying(true);
    ambientSoundtrack.duck();
  };

  const handleToggleMusic = () => {
    if (!musicPlaying) {
      sound.setBollywoodSong(currentBollywoodSong);
      sound.playBollywoodSong(currentBollywoodSong);
      setMusicPlaying(true);
      ambientSoundtrack.duck();
    } else {
      sound.stopMusic();
      setMusicPlaying(false);
      ambientSoundtrack.unduck();
    }
  };

  const handleToggleSfx = () => {
    sound.sfxEnabled = !sound.sfxEnabled;
    setSfxEnabled(sound.sfxEnabled);
    if (sound.sfxEnabled) {
      sound.playClick();
    }
  };

  // Scroll to top on chapter navigation
  const applyChapterChange = (chapterNum: number) => {
    setCurrentChapter(chapterNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToChapter = (targetChapter: number, skipTransition = false) => {
    if (targetChapter === currentChapter) return;

    if (!skipTransition) {
      // Find an enabled transition note between current and target chapter
      const matchingNote = transitionNotes.find(
        (n) =>
          n.enabled &&
          ((n.fromChapter === currentChapter && n.toChapter === targetChapter) ||
            (n.toChapter === targetChapter && n.fromChapter === 0))
      );

      if (matchingNote) {
        setActiveTransitionPopup({ note: matchingNote, targetChapter });
        return;
      }
    }

    applyChapterChange(targetChapter);
  };

  const handleProceedFromTransitionNote = () => {
    if (activeTransitionPopup) {
      const target = activeTransitionPopup.targetChapter;
      setActiveTransitionPopup(null);
      applyChapterChange(target);
    }
  };

  const handleCloseTransitionNote = () => {
    setActiveTransitionPopup(null);
  };

  const handleEditNoteFromPopup = (note: TransitionNote) => {
    setActiveTransitionPopup(null);
    setTransitionEditorSelectedId(note.id);
    setTransitionEditorOpen(true);
  };

  const handleSaveTransitionNotes = (updated: TransitionNote[]) => {
    setTransitionNotes(updated);
    saveTransitionNotes(updated);
  };

  const handlePreviewTransitionNote = (note: TransitionNote) => {
    setActiveTransitionPopup({ note, targetChapter: note.toChapter });
  };

  const nextChapter = () => {
    if (currentChapter < totalChapters) {
      sound.playPageTurn();
      goToChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 1) {
      sound.playPageTurn();
      goToChapter(currentChapter - 1);
    }
  };

  const handleUnlockSuccess = () => {
    try {
      sessionStorage.setItem('storyUnlocked', 'true');
      window.history.pushState({ page: 'story' }, '', `${window.location.pathname}#story`);
    } catch {
      // ignore
    }
    setIsUnlocked(true);
    setPhase('opening');
  };

  useEffect(() => {
    const handlePopState = () => {
      const isStoryUrl =
        window.location.pathname.includes('/story') || window.location.hash.includes('story');
      const sessionUnlocked = sessionStorage.getItem('storyUnlocked') === 'true';
      if (!isStoryUrl || !sessionUnlocked) {
        setIsUnlocked(false);
      } else {
        setIsUnlocked(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 🔒 LOCKED WEBSITE: If not unlocked, render ONLY the Secret Entry Gateway!
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0b080c] text-[#f7f2ea]">
        <SecretEntryPage onUnlockSuccess={handleUnlockSuccess} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-700 flex flex-col justify-between relative ${
        midnightMode
          ? 'midnight-theme bg-[#040814] text-[#e2e8f0] selection:bg-[#1e3a8a] selection:text-white'
          : 'bg-[#0b080c] text-[#f7f2ea] selection:bg-[#85182a] selection:text-white'
      }`}
    >
      {/* Ambient Warm Golden Firefly Stardust or Midnight Silver Shimmer */}
      <AmbientStardust midnightMode={midnightMode} />

      {/* Interactive Cursor / Touch Magic Sparkle & Heart Trail */}
      <InteractiveSparklesOverlay />

      {/* 1. Loading Screen */}
      {phase === 'loading' && (
        <LoadingScreen
          onStartStory={() => {
            setPhase('opening');
          }}
        />
      )}

      {/* 2. Opening Cinematic Screen */}
      {phase === 'opening' && (
        <OpeningCinematic
          voiceUrl={mediaConfig['ADD_VOICE_GREETING_HERE']}
          onSaveVoiceUrl={(url) => handleUpdateMedia('ADD_VOICE_GREETING_HERE', url)}
          onStartChapter1={() => {
            setPhase('story');
            setCurrentChapter(1);
            ambientSoundtrack.play();
          }}
        />
      )}

      {/* 3. Main Story Chapters */}
      {phase === 'story' && (
        <>
          {/* Subtle floating heart transition on chapter navigation */}
          <FloatingHeartsTransition currentChapter={currentChapter} />

          <TopBar
            currentChapter={currentChapter}
            totalChapters={totalChapters}
            musicPlaying={musicPlaying}
            sfxEnabled={sfxEnabled}
            unlockedEggsCount={unlockedEggs.length}
            totalEggsCount={EASTER_EGGS_LIST.length}
            currentSongTitle={currentBollywoodSong.title}
            midnightMode={midnightMode}
            onToggleMidnightMode={handleToggleMidnightMode}
            onOpenBollywoodModal={() => setBollywoodModalOpen(true)}
            onOpenOpenWhenModal={handleOpenOpenWhenModal}
            onOpenDailyNote={handleOpenDailyNote}
            onOpenTimeline={handleOpenTimeline}
            onOpenLoveJar={handleOpenLoveJar}
            onOpenPrescription={handleOpenPrescription}
            onOpenCoupons={() => setCouponsModalOpen(true)}
            onOpenBucketList={() => setBucketListModalOpen(true)}
            onOpenLoveCounter={() => setLoveCounterModalOpen(true)}
            onOpenTransitionNotes={() => setTransitionEditorOpen(true)}
            onToggleMusic={handleToggleMusic}
            onToggleSfx={handleToggleSfx}
            onOpenMediaModal={() => {
              setMediaModalActiveKey(null);
              setMediaModalOpen(true);
            }}
            onOpenEggsModal={() => setEggsModalOpen(true)}
            onSelectChapter={goToChapter}
          />

          <main className={`flex-1 pt-14 pb-12 transition-all duration-700 ${midnightMode ? 'midnight-filter-layer' : ''}`}>
            {/* ONLY THE STORY CHAPTER (Clean, Uncluttered, Pure Storybook Romance!) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter}
                initial={{ opacity: 0, y: 16, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.99 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {currentChapter === 1 && (
                  <Chapter01Pickleball
                    photoUrl={mediaConfig['ADD_FIRST_PHOTO_HERE']}
                    onReplacePhoto={() => handleOpenPhotoSlot('ADD_FIRST_PHOTO_HERE')}
                    onDirectUploadPhoto={(dataUrl) => handleUpdateMedia('ADD_FIRST_PHOTO_HERE', dataUrl)}
                    onNext={nextChapter}
                    onTriggerEasterEgg={handleTriggerEasterEgg}
                  />
                )}

                {currentChapter === 2 && (
                  <Chapter02ShyBoy
                    mahudiUrl={mediaConfig['ADD_MAHUDI_PHOTO_HERE']}
                    bhavnathUrl={mediaConfig['ADD_BHAVNATH_PHOTO_HERE']}
                    onReplaceMahudi={() => handleOpenPhotoSlot('ADD_MAHUDI_PHOTO_HERE')}
                    onReplaceBhavnath={() => handleOpenPhotoSlot('ADD_BHAVNATH_PHOTO_HERE')}
                    onDirectUploadMahudi={(dataUrl) => handleUpdateMedia('ADD_MAHUDI_PHOTO_HERE', dataUrl)}
                    onDirectUploadBhavnath={(dataUrl) => handleUpdateMedia('ADD_BHAVNATH_PHOTO_HERE', dataUrl)}
                    onNext={nextChapter}
                    onTriggerEasterEgg={handleTriggerEasterEgg}
                  />
                )}

                {currentChapter === 3 && (
                  <Chapter03AlwaysThere
                    chatPhotoUrl={mediaConfig['ADD_CHAT_SCREENSHOTS_HERE']}
                    onReplaceChatPhoto={() => handleOpenPhotoSlot('ADD_CHAT_SCREENSHOTS_HERE')}
                    onNext={nextChapter}
                    onTriggerEasterEgg={handleTriggerEasterEgg}
                  />
                )}

                {currentChapter === 4 && (
                  <Chapter04May31
                    may31Url={mediaConfig['ADD_31_MAY_PHOTO_HERE']}
                    onReplaceMay31={() => handleOpenPhotoSlot('ADD_31_MAY_PHOTO_HERE')}
                    onDirectUploadMay31={(videoDataUrl) => handleUpdateMedia('ADD_31_MAY_PHOTO_HERE', videoDataUrl)}
                    onNext={nextChapter}
                    onTriggerEasterEgg={handleTriggerEasterEgg}
                  />
                )}

                {currentChapter === 5 && <Chapter05TheEnd onNext={nextChapter} />}

                {currentChapter === 6 && (
                  <Chapter06FirstMovie
                    moviePhotoUrl={mediaConfig['ADD_FIRST_MOVIE_PHOTO_HERE']}
                    onReplaceMoviePhoto={() => handleOpenPhotoSlot('ADD_FIRST_MOVIE_PHOTO_HERE')}
                    onDirectUploadMoviePhoto={(dataUrl) => handleUpdateMedia('ADD_FIRST_MOVIE_PHOTO_HERE', dataUrl)}
                    onNext={nextChapter}
                    onTriggerEasterEgg={handleTriggerEasterEgg}
                  />
                )}

                {currentChapter === 7 && (
                  <Chapter07Confession
                    onNext={nextChapter}
                    onTriggerEasterEgg={handleTriggerEasterEgg}
                  />
                )}

                {currentChapter === 8 && (
                  <Chapter08GalleryAndQuiz
                    mediaConfig={mediaConfig}
                    onReplacePhoto={handleOpenPhotoSlot}
                    onDirectUploadPhoto={(key, dataUrl) => handleUpdateMedia(key, dataUrl)}
                    onNext={nextChapter}
                    onTriggerEasterEgg={handleTriggerEasterEgg}
                  />
                )}

                {currentChapter === 9 && <Chapter09TheLetter onNext={nextChapter} />}

                {currentChapter === 10 && (
                  <Chapter10DoctorSammm
                    doctorPhotoUrl={mediaConfig['ADD_HIS_DREAM_PHOTO_HERE']}
                    onReplaceDoctorPhoto={() => handleOpenPhotoSlot('ADD_HIS_DREAM_PHOTO_HERE')}
                    onDirectUploadDoctorPhoto={(dataUrl) => handleUpdateMedia('ADD_HIS_DREAM_PHOTO_HERE', dataUrl)}
                    onNext={nextChapter}
                  />
                )}

                {currentChapter === 11 && (
                  <FinalSurprise
                    onRestart={() => goToChapter(1)}
                    onTriggerEasterEgg={handleTriggerEasterEgg}
                    onOpenOpenWhen={handleOpenOpenWhenModal}
                  />
                )}

                {/* Animated Romantic Storybook Navigation Bar (Next & Previous Chapter) */}
                <StoryNavigationBar
                  currentChapter={currentChapter}
                  totalChapters={totalChapters}
                  onPrev={prevChapter}
                  onNext={nextChapter}
                  onSelectChapter={goToChapter}
                  midnightMode={midnightMode}
                />
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Persistent Chapter Switcher in bottom footer */}
          <footer className="border-t border-[#260e18] py-6 px-4 bg-[#0a050a] text-center space-y-2">
            <p className="text-xs text-stone-500 font-serif-romantic italic">
              Made with endless love by Radhika for Sammm ❤️ • Happy Boyfriend Day
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-stone-600">
              <button
                onClick={() => goToChapter(1)}
                className="hover:text-stone-300 transition-colors"
              >
                Beginning
              </button>
              <span>•</span>
              <button
                onClick={() => goToChapter(8)}
                className="hover:text-stone-300 transition-colors"
              >
                Scrapbook
              </button>
              <span>•</span>
              <button
                onClick={() => goToChapter(9)}
                className="hover:text-stone-300 transition-colors"
              >
                Letter
              </button>
              <span>•</span>
              <button
                onClick={() => goToChapter(12)}
                className="hover:text-stone-300 transition-colors"
              >
                Final Surprise & Letter
              </button>
              <span>•</span>
              <button
                onClick={handleOpenLoveJar}
                className="text-[#ffd700] hover:underline transition-colors font-bold"
              >
                Love Jar ⭐
              </button>
              <span>•</span>
              <button
                onClick={handleOpenPrescription}
                className="text-cyan-300 hover:underline transition-colors font-bold"
              >
                Rx Pad 🩺
              </button>
              <span>•</span>
              <button
                onClick={() => setCouponsModalOpen(true)}
                className="text-[#ffd700] hover:underline transition-colors font-bold"
              >
                Love Coupons 🎟️
              </button>
              <span>•</span>
              <button
                onClick={() => setBucketListModalOpen(true)}
                className="text-rose-300 hover:underline transition-colors font-bold"
              >
                Bucket List 🌟
              </button>
              <span>•</span>
              <button
                onClick={() => setLoveCounterModalOpen(true)}
                className="text-[#ff7597] hover:underline transition-colors font-bold"
              >
                Live Counter ⏰
              </button>
              <span>•</span>
              <button
                onClick={handleOpenTimeline}
                className="text-[#ff8da8] hover:underline transition-colors font-bold"
              >
                Milestones ⏳
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#ff8da8] hover:underline transition-colors font-bold"
              >
                Daily Note 💌
              </button>
              <span>•</span>
              <button
                onClick={() => handleOpenOpenWhenModal()}
                className="text-[#e6be6d] hover:underline transition-colors font-bold"
              >
                Open When… 💌
              </button>
              <span>•</span>
              <button
                onClick={() => setTransitionEditorOpen(true)}
                className="text-[#ff8da8] hover:underline transition-colors font-bold"
              >
                Whisper Notes ✉️
              </button>
              <span>•</span>
              <button
                onClick={handleToggleMidnightMode}
                className={`transition-colors font-bold ${
                  midnightMode ? 'text-sky-300 hover:text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Toggle Midnight Theme (Navy & Silver)"
              >
                {midnightMode ? 'Midnight Theme (Navy & Silver) 🌙' : 'Midnight Theme 🌙'}
              </button>
            </div>
          </footer>
        </>
      )}

      {/* Toast and Modals */}
      <EasterEggToast egg={activeEggToast} onClose={() => setActiveEggToast(null)} />

      <MediaModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        mediaConfig={mediaConfig}
        onUpdateMedia={handleUpdateMedia}
        activeKey={mediaModalActiveKey}
      />

      <EasterEggsModal
        isOpen={eggsModalOpen}
        onClose={() => setEggsModalOpen(false)}
        unlockedEggIds={unlockedEggs}
      />

      <BollywoodMusicModal
        isOpen={bollywoodModalOpen}
        onClose={() => setBollywoodModalOpen(false)}
        currentSong={currentBollywoodSong}
        isPlaying={musicPlaying}
        onSelectSong={handleSelectBollywoodSong}
        onTogglePlay={handleToggleMusic}
      />

      <OpenWhenModal
        isOpen={openWhenModalOpen}
        onClose={() => setOpenWhenModalOpen(false)}
        initialEnvelopeId={activeOpenWhenEnvelopeId}
      />

      {/* Dedicated Modals for Header Sections */}
      <DailyLoveNoteModal
        isOpen={dailyNoteModalOpen}
        onClose={() => setDailyNoteModalOpen(false)}
        onOpenOpenWhenModal={handleOpenOpenWhenModal}
      />

      <OrigamiLoveJarModal
        isOpen={loveJarModalOpen}
        onClose={() => setLoveJarModalOpen(false)}
        onOpenTimeline={handleOpenTimeline}
      />

      <TimelineModal
        isOpen={timelineModalOpen}
        onClose={() => setTimelineModalOpen(false)}
        onNavigateToChapter={goToChapter}
        onOpenOpenWhenModal={handleOpenOpenWhenModal}
      />

      <DoctorPrescriptionModal
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
      />

      {/* Love Coupons for Sammm */}
      <LoveCouponsModal
        isOpen={couponsModalOpen}
        onClose={() => setCouponsModalOpen(false)}
      />

      {/* Couple Bucket List */}
      <CoupleBucketListModal
        isOpen={bucketListModalOpen}
        onClose={() => setBucketListModalOpen(false)}
      />

      {/* Love Counter & Live Heartbeats */}
      <LoveCounterModal
        isOpen={loveCounterModalOpen}
        onClose={() => setLoveCounterModalOpen(false)}
      />

      {/* Chapter Transition Animated Pop-up */}
      <ChapterTransitionNotePopup
        note={activeTransitionPopup?.note || null}
        targetChapter={activeTransitionPopup?.targetChapter || 1}
        onProceed={handleProceedFromTransitionNote}
        onClose={handleCloseTransitionNote}
        onEditNote={handleEditNoteFromPopup}
        midnightMode={midnightMode}
      />

      {/* Chapter Transition Notes Customizer Modal */}
      <TransitionNotesCustomizerModal
        isOpen={transitionEditorOpen}
        onClose={() => setTransitionEditorOpen(false)}
        notes={transitionNotes}
        onSaveNotes={handleSaveTransitionNotes}
        onPreviewNote={handlePreviewTransitionNote}
        initialSelectedNoteId={transitionEditorSelectedId}
        midnightMode={midnightMode}
      />
    </div>
  );
}
