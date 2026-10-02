import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Camera,
  Film,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Volume2,
  VolumeX,
  Upload,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../../services/soundEffects';
import { persistentMediaStorage } from '../../services/persistentMediaStorage';

interface MemoryCard {
  id: string;
  mediaKey: string;
  caption: string;
  date: string;
  rotation?: number;
}

interface Chapter08GalleryAndQuizProps {
  mediaConfig: Record<string, string>;
  onReplacePhoto: (key: string) => void;
  onDirectUploadPhoto?: (key: string, dataUrl: string) => void;
  onNext: () => void;
  onTriggerEasterEgg: (eggId: string) => void;
}

const DEFAULT_SLOTS: MemoryCard[] = [
  { id: 'mem-1', mediaKey: 'ADD_OUR_PHOTOS_HERE_1', caption: 'Started chatorapan 😂', date: '17/5/26', rotation: -1.5 },
  { id: 'mem-2', mediaKey: 'ADD_OUR_PHOTOS_HERE_2', caption: 'Cricket date 🏏❤️', date: '31/5/26', rotation: 1.2 },
  { id: 'mem-3', mediaKey: 'ADD_OUR_PHOTOS_HERE_3', caption: 'Connection started with baarish 🌧️', date: '23/7/26', rotation: -2 },
  { id: 'mem-4', mediaKey: 'ADD_OUR_PHOTOS_HERE_4', caption: 'First mandir date as a partner 🛕❤️', date: '1/8/26', rotation: 1.8 },
  { id: 'mem-5', mediaKey: 'ADD_OUR_PHOTOS_HERE_5', caption: 'My first b’day with you 🎂', date: '3/8/26', rotation: -1 },
  { id: 'mem-6', mediaKey: 'ADD_OUR_PHOTOS_HERE_6', caption: 'Ghumi ghumi started ✨ btw this is my one of fav photos', date: '6/8/26', rotation: 2 },
  { id: 'mem-7', mediaKey: 'ADD_OUR_PHOTOS_HERE_7', caption: 'Official first fight 😭❤️', date: '9/8/26', rotation: -1.4 },
  { id: 'mem-8', mediaKey: 'ADD_OUR_PHOTOS_HERE_8', caption: 'Maroo devdas 🥹', date: '16/8/26', rotation: 1.6 },
  { id: 'mem-9', mediaKey: 'ADD_OUR_PHOTOS_HERE_9', caption: 'Patchup ❤️', date: '17/8/26', rotation: -2.1 },
  { id: 'mem-10', mediaKey: 'ADD_OUR_PHOTOS_HERE_10', caption: 'Second trip… something special happened 👀 IYKYK', date: '18/8/26', rotation: 1.3 },
  { id: 'mem-11', mediaKey: 'ADD_OUR_PHOTOS_HERE_11', caption: 'We, RF and sukoon. ❤️', date: '22/8/26', rotation: -1.7 },
  { id: 'mem-12', mediaKey: 'ADD_OUR_PHOTOS_HERE_12', caption: 'My fav view 🥹', date: '23/8/26', rotation: 2 },
  { id: 'mem-13', mediaKey: 'ADD_OUR_PHOTOS_HERE_13', caption: 'Maroo hero 🦸‍♂️❤️', date: '28/8/26', rotation: -1.2 },
  { id: 'mem-14', mediaKey: 'ADD_OUR_PHOTOS_HERE_14', caption: 'My 2 fav ❤️', date: '7/9/26', rotation: 1.8 },
  { id: 'mem-15', mediaKey: 'ADD_OUR_PHOTOS_HERE_15', caption: 'Bhondu 😂❤️', date: '19/9/26', rotation: -2.3 },
  { id: 'mem-16', mediaKey: 'ADD_OUR_PHOTOS_HERE_16', caption: 'His favourite thing to squish 😂❤️', date: '26/9/26', rotation: 1.4 },
];

export const Chapter08GalleryAndQuiz: React.FC<Chapter08GalleryAndQuizProps> = ({
  mediaConfig,
  onDirectUploadPhoto,
  onNext,
  onTriggerEasterEgg,
}) => {
  // Load customizable memory cards (captions, dates) from localStorage
  const [cards, setCards] = useState<MemoryCard[]>(() => {
    try {
      const saved = localStorage.getItem('radhika_scrapbook_cards_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If fewer than DEFAULT_SLOTS, append the 9 new slots automatically
          const existingIds = new Set(parsed.map((c: MemoryCard) => c.id));
          const missing = DEFAULT_SLOTS.filter((s) => !existingIds.has(s.id));
          if (missing.length > 0) {
            const merged = [...parsed, ...missing];
            localStorage.setItem('radhika_scrapbook_cards_v2', JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_SLOTS;
  });

  // Active editing modal state
  const [editingCard, setEditingCard] = useState<MemoryCard | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editDate, setEditDate] = useState('');

  // Save changes to localStorage and IndexedDB vault
  const saveCards = (newCards: MemoryCard[]) => {
    setCards(newCards);
    persistentMediaStorage.saveScrapbookCards(newCards);
    try {
      localStorage.setItem('radhika_scrapbook_cards_v2', JSON.stringify(newCards));
    } catch {
      // ignore
    }
  };

  // Load from IndexedDB on mount to prevent any lost cards or captions
  useEffect(() => {
    let isMounted = true;
    persistentMediaStorage.getScrapbookCards().then((indexedCards) => {
      if (isMounted && indexedCards && Array.isArray(indexedCards) && indexedCards.length > 0) {
        const existingIds = new Set(indexedCards.map((c: MemoryCard) => c.id));
        const missing = DEFAULT_SLOTS.filter((s) => !existingIds.has(s.id));
        const merged = missing.length > 0 ? [...indexedCards, ...missing] : indexedCards;
        setCards(merged);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenEdit = (card: MemoryCard) => {
    sound.playClick();
    setEditingCard(card);
    setEditCaption(card.caption || '');
    setEditDate(card.date || '');
  };

  const handleSaveEdit = () => {
    if (!editingCard) return;
    sound.playNotification();
    const updated = cards.map((c) =>
      c.id === editingCard.id
        ? { ...c, caption: editCaption.trim(), date: editDate.trim() }
        : c
    );
    saveCards(updated);
    setEditingCard(null);
  };

  const handleAddNewCard = () => {
    sound.playClick();
    const newId = `mem-${Date.now()}`;
    const newMediaKey = `CUSTOM_MEMORY_${Date.now()}`;
    const newCard: MemoryCard = {
      id: newId,
      mediaKey: newMediaKey,
      caption: '',
      date: '',
      rotation: (Math.random() * 4 - 2),
    };
    saveCards([...cards, newCard]);
  };

  const handleDeleteCard = (cardId: string) => {
    sound.playClick();
    if (cards.length <= 1) return;
    saveCards(cards.filter((c) => c.id !== cardId));
  };

  const handleFileUpload = (mediaKey: string, file: File) => {
    sound.playClick();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawResult = e.target?.result as string;
      if (rawResult) {
        // Automatically compress photo if it's an image to prevent memory exhaustion
        const processed = file.type.startsWith('image/')
          ? await persistentMediaStorage.compressImageIfNeeded(rawResult)
          : rawResult;

        persistentMediaStorage.saveMedia(mediaKey, processed);

        if (onDirectUploadPhoto) {
          onDirectUploadPhoto(mediaKey, processed);
        }
        sound.playChime();
        onTriggerEasterEgg('egg-gallery');
      }
    };
    reader.readAsDataURL(file);
  };

  const isVideo = (url?: string) => {
    if (!url) return false;
    return (
      url.startsWith('data:video') ||
      url.endsWith('.mp4') ||
      url.endsWith('.mov') ||
      url.endsWith('.webm') ||
      url.includes('/video')
    );
  };

  return (
    <section className="min-h-screen py-16 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col justify-center relative select-none">
      {/* Chapter Tag Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-4"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-[#e6be6d] bg-[#360918]/80 px-3.5 py-1.5 rounded-full border border-[#85182a]/70 shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
          <span>Chapter 08 • Our Scrapbook</span>
        </span>
        <span className="text-xs font-mono text-stone-400">
          Photos, Videos & Our Words ❤️
        </span>
      </motion.div>

      {/* Main Chapter Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center space-y-2 mb-8"
      >
        <h2 className="font-serif-romantic text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffd6e0] to-[#e6be6d]">
          Our Private Polaroid & Reel Gallery 📸🎞️
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans max-w-xl mx-auto">
          Apne hisab se photos aur videos upload karo, aur jo dil chahe likho!
        </p>
      </motion.div>

      {/* Action Bar (Add Memory Card Button) */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#e6be6d] bg-[#2a0713] border border-[#85182a]/60 px-3 py-1 rounded-full">
            {cards.length} Memories
          </span>
          <span className="text-xs text-stone-400 hidden sm:inline">
            Every little memory deserves its own place ❤️
          </span>
        </div>

        <button
          onClick={handleAddNewCard}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#85182a] to-[#a62238] hover:from-[#a01c32] hover:to-[#be2742] text-white text-xs font-mono font-bold tracking-wider uppercase border border-[#e6be6d]/50 shadow-md hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Card</span>
        </button>
      </div>

      {/* POLAROID SCRAPBOOK GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-12">
        {cards.map((card, index) => {
          const mediaUrl = mediaConfig[card.mediaKey];
          const hasMedia = Boolean(mediaUrl);
          const mediaIsVideo = isVideo(mediaUrl);

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              style={{ transform: `rotate(${card.rotation || 0}deg)` }}
              className="group relative transition-all duration-300 hover:scale-[1.02] hover:z-20"
            >
              {/* Top Washi Tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#eedec8]/65 backdrop-blur-sm shadow-xs border-dashed border border-amber-900/20 rotate-1 z-10 pointer-events-none rounded-xs" />

              {/* Action Buttons Top Bar (Upload + Edit Caption + Delete) */}
              <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                {/* Direct Upload Photo / Video */}
                <label
                  title="Upload photo or video"
                  className="p-2 rounded-full bg-black/75 hover:bg-[#85182a] text-white transition-colors cursor-pointer border border-white/30 shadow-md backdrop-blur-xs"
                >
                  {mediaIsVideo ? (
                    <Film className="w-3.5 h-3.5 text-[#e6be6d]" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 text-[#ffd700]" />
                  )}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(card.mediaKey, file);
                    }}
                    className="hidden"
                  />
                </label>

                {/* Edit Caption / Write */}
                <button
                  onClick={() => handleOpenEdit(card)}
                  title="Write / edit caption"
                  className="p-2 rounded-full bg-black/75 hover:bg-[#85182a] text-[#e6be6d] hover:text-white transition-colors cursor-pointer border border-white/30 shadow-md backdrop-blur-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Delete Card */}
                {cards.length > 1 && (
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    title="Remove card"
                    className="p-2 rounded-full bg-black/75 hover:bg-rose-800 text-stone-300 hover:text-white transition-colors cursor-pointer border border-white/20 shadow-md backdrop-blur-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* POLAROID WHITE / CREAM FRAME */}
              <div className="bg-[#fbf8f2] text-[#221217] p-3.5 pb-5 rounded-xl border border-[#ded3c5] shadow-2xl transition-all duration-300">
                {/* Media Container */}
                <div className="relative aspect-square w-full bg-[#180811] rounded-lg overflow-hidden flex items-center justify-center border border-[#e4d8c9]">
                  {hasMedia ? (
                    mediaIsVideo ? (
                      <div className="relative w-full h-full bg-black">
                        <video
                          src={mediaUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-[#ffd700] flex items-center gap-1 backdrop-blur-xs">
                          <Film className="w-3 h-3" />
                          <span>Video</span>
                        </span>
                      </div>
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={card.caption || 'Our Memory'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )
                  ) : (
                    /* Clean Minimal Romantic Placeholder */
                    <label className="w-full h-full flex flex-col items-center justify-center p-5 text-center cursor-pointer hover:bg-white/5 transition-colors group/ph">
                      <div className="w-12 h-12 rounded-full bg-[#3d0a1c]/80 border border-[#85182a] flex items-center justify-center text-white mb-2 shadow-inner group-hover/ph:scale-110 transition-transform">
                        <Camera className="w-6 h-6 text-[#ffd700]" />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#e6be6d] uppercase tracking-wider">
                        + Tap to Add Photo or Video
                      </span>
                      <span className="text-[10px] text-stone-400 mt-1">
                        Select from your phone / laptop
                      </span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(card.mediaKey, file);
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Caption Area (Clean & ONLY shows what user writes!) */}
                <div className="mt-3.5 px-1 min-h-[32px] flex flex-col justify-between">
                  {card.caption ? (
                    <p className="font-handwriting text-lg sm:text-xl text-[#3d1220] leading-snug font-medium">
                      {card.caption}
                    </p>
                  ) : (
                    <button
                      onClick={() => handleOpenEdit(card)}
                      className="text-left text-xs font-mono text-stone-400 hover:text-[#85182a] transition-colors cursor-pointer italic"
                    >
                      ✏️ + Tap to write your note...
                    </button>
                  )}

                  {card.date && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mt-1 flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5 text-[#85182a] fill-current" />
                      {card.date}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Continue To Chapter 9 Button */}
      <div className="flex justify-end pt-4 pb-12 border-t border-[#85182a]/30">
        <button
          onClick={() => {
            sound.playPageTurn();
            onNext();
          }}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#85182a] via-[#a8223b] to-[#85182a] hover:from-[#9c1a32] hover:to-[#be2744] text-white font-serif-romantic font-bold text-base rounded-full shadow-[0_0_25px_rgba(133,24,42,0.45)] hover:shadow-[0_0_35px_rgba(230,190,109,0.5)] transition-all hover:scale-105 cursor-pointer border border-[#e6be6d]/50"
        >
          <span>READ MY HEARTFELT LETTER</span>
          <ArrowRight className="w-4 h-4 text-[#ffd700] group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

      {/* EDIT MODAL: Write your own caption & date */}
      <AnimatePresence>
        {editingCard && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setEditingCard(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#190611] border-2 border-[#e6be6d]/60 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#85182a]/50 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#e6be6d]" />
                  <h3 className="font-serif-romantic text-lg font-bold text-white">
                    Write Your Note & Date ✍️
                  </h3>
                </div>
                <button
                  onClick={() => setEditingCard(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Caption Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-[#e6be6d] uppercase tracking-wider">
                  Your Custom Caption / Words
                </label>
                <textarea
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  placeholder="Apne hisab se yahan likho..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[#0e030a] border border-[#6b162a] focus:border-[#e6be6d] text-white font-sans text-sm outline-none resize-none"
                />
              </div>

              {/* Date / Subtitle Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-[#e6be6d] uppercase tracking-wider">
                  Date / Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  placeholder="e.g. October 2026, Our Favorite Day"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0e030a] border border-[#6b162a] focus:border-[#e6be6d] text-white font-sans text-sm outline-none"
                />
              </div>

              {/* Quick Photo / Video change from inside modal */}
              <div className="pt-1">
                <label className="w-full py-2.5 px-4 rounded-xl bg-[#2e0917] hover:bg-[#3d0e20] border border-[#85182a] text-xs font-mono text-stone-200 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span>Choose Photo or Video File</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && editingCard) {
                        handleFileUpload(editingCard.mediaKey, file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-stone-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#85182a] to-[#a8223a] text-white font-serif-romantic font-bold text-sm border border-[#e6be6d]/60 shadow-lg hover:scale-105 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#ffd700]" />
                  <span>Save Note ❤️</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
