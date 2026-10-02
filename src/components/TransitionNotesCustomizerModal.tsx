import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Save,
  Trash2,
  Eye,
  RotateCcw,
  Sparkles,
  Heart,
  Check,
  ChevronRight,
  Edit2
} from 'lucide-react';
import { TransitionNote, DEFAULT_TRANSITION_NOTES } from '../data/transitionNotes';
import { sound } from '../services/soundEffects';

interface TransitionNotesCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: TransitionNote[];
  onSaveNotes: (notes: TransitionNote[]) => void;
  onPreviewNote: (note: TransitionNote) => void;
  initialSelectedNoteId?: string | null;
  midnightMode?: boolean;
}

const EMOJI_OPTIONS = ['💌', '🎾', '🏔️', '🏏', '❤️', '🍿', '✨', '📜', '🩺', '🌅', '🎁', '⭐', '💍', '🧸', '🌹'];
const THEME_OPTIONS: Array<TransitionNote['themeColor']> = ['rose', 'gold', 'sky', 'amber', 'emerald'];

export const TransitionNotesCustomizerModal: React.FC<TransitionNotesCustomizerModalProps> = ({
  isOpen,
  onClose,
  notes,
  onSaveNotes,
  onPreviewNote,
  initialSelectedNoteId,
  midnightMode = false,
}) => {
  const [localNotes, setLocalNotes] = useState<TransitionNote[]>(notes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(() => {
    return initialSelectedNoteId || notes[0]?.id || null;
  });
  const [saveToast, setSaveToast] = useState(false);

  // Sync when prop changes or modal opens
  React.useEffect(() => {
    setLocalNotes(notes);
    if (initialSelectedNoteId) {
      setSelectedNoteId(initialSelectedNoteId);
    } else if (!selectedNoteId && notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, initialSelectedNoteId, isOpen]);

  const activeNote = localNotes.find((n) => n.id === selectedNoteId) || localNotes[0];

  const handleUpdateActiveNote = (fields: Partial<TransitionNote>) => {
    if (!activeNote) return;
    const updated = localNotes.map((n) => (n.id === activeNote.id ? { ...n, ...fields } : n));
    setLocalNotes(updated);
  };

  const handleToggleNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const updated = localNotes.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n));
    setLocalNotes(updated);
  };

  const handleSaveAll = () => {
    sound.playChime();
    onSaveNotes(localNotes);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleResetDefaults = () => {
    sound.playClick();
    if (confirm('Reset all chapter transition notes to default love messages?')) {
      setLocalNotes(DEFAULT_TRANSITION_NOTES);
      onSaveNotes(DEFAULT_TRANSITION_NOTES);
      setSelectedNoteId(DEFAULT_TRANSITION_NOTES[0].id);
      sound.playChime();
    }
  };

  const handleAddNewNote = () => {
    sound.playClick();
    const newId = `note_custom_${Date.now()}`;
    const newNote: TransitionNote = {
      id: newId,
      fromChapter: 1,
      toChapter: 2,
      title: 'A Little Secret...',
      note: 'Write your personalized short note here for Sammm to see before turning the page!',
      sender: 'Radhika 💕',
      emoji: '💌',
      enabled: true,
      themeColor: 'rose',
    };
    const updated = [newNote, ...localNotes];
    setLocalNotes(updated);
    setSelectedNoteId(newId);
  };

  const handleDeleteNote = (id: string) => {
    sound.playClick();
    if (localNotes.length <= 1) {
      alert('Keep at least one transition note!');
      return;
    }
    const updated = localNotes.filter((n) => n.id !== id);
    setLocalNotes(updated);
    if (selectedNoteId === id) {
      setSelectedNoteId(updated[0]?.id || null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`relative w-full max-w-4xl h-[90vh] max-h-[760px] rounded-3xl flex flex-col shadow-2xl overflow-hidden border-2 ${
            midnightMode
              ? 'bg-[#060c18] border-sky-500/40 text-stone-100 shadow-sky-950/60'
              : 'bg-[#180a14] border-[#e6be6d]/60 text-stone-100 shadow-[#85182a]/40'
          }`}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#85182a] to-[#d4af37] flex items-center justify-center text-xl shadow-md border border-white/20">
                💌
              </div>
              <div>
                <h2 className="font-serif-romantic text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <span>Chapter Transition Notes</span>
                  <span className="text-xs font-mono text-[#ffd700] px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                    Animated Pop-ups
                  </span>
                </h2>
                <p className="text-xs font-mono text-stone-400">
                  Short, personalized whisper notes that appear when moving between chapters
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold transition-all shadow-md cursor-pointer hover:scale-105"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Success notice */}
          {saveToast && (
            <div className="bg-emerald-900/90 text-emerald-200 border-b border-emerald-500/50 py-2 px-6 text-xs font-mono flex items-center justify-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>All chapter transition notes have been saved to browser storage!</span>
            </div>
          )}

          {/* Main 2-Column Layout */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Left Column: List of Transitions (5 cols) */}
            <div className="md:col-span-5 border-r border-white/10 flex flex-col h-full bg-black/20">
              <div className="p-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                  Transitions ({localNotes.length})
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleAddNewNote}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#85182a]/60 hover:bg-[#85182a] text-white text-xs font-mono border border-white/20 transition-colors cursor-pointer"
                    title="Add custom transition note"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                  <button
                    onClick={handleResetDefaults}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/10 transition-colors cursor-pointer"
                    title="Reset to default messages"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {localNotes.map((item) => {
                  const isSelected = item.id === selectedNoteId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedNoteId(item.id);
                      }}
                      className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#85182a]/40 to-[#470f1e]/40 border-[#ff7597] shadow-md text-white'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{item.emoji}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-bold text-[#ffd700]">
                              Ch {item.fromChapter || 1} → {item.toChapter}
                            </span>
                            {!item.enabled && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-stone-800 text-stone-400">
                                Muted
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-serif-romantic truncate text-stone-200">
                            {item.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Toggle On/Off Switch */}
                        <button
                          onClick={(e) => handleToggleNote(item.id, e)}
                          className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                            item.enabled ? 'bg-emerald-600' : 'bg-stone-700'
                          }`}
                          title={item.enabled ? 'Enabled (Click to mute)' : 'Muted (Click to enable)'}
                        >
                          <span
                            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                              item.enabled ? 'left-3.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                        <ChevronRight className={`w-4 h-4 text-stone-500 group-hover:translate-x-0.5 transition-transform ${isSelected ? 'text-[#ff7597]' : ''}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Note Editor & Live Preview (7 cols) */}
            {activeNote ? (
              <div className="md:col-span-7 flex flex-col h-full overflow-y-auto p-5 sm:p-6 space-y-4">
                {/* Top Quick Actions for Selected Note */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-stone-400">Editing:</span>
                    <span className="text-xs font-mono font-bold text-[#ffd700] px-2 py-0.5 rounded bg-black/40 border border-white/10">
                      Chapter {activeNote.fromChapter} → Chapter {activeNote.toChapter}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPreviewNote(activeNote)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-stone-200 transition-colors cursor-pointer border border-white/15"
                      title="Test how this animated pop-up appears on screen"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#ffd700]" />
                      <span>Preview Pop-up</span>
                    </button>

                    <button
                      onClick={() => handleDeleteNote(activeNote.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title="Delete this transition note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chapter from & to selector */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                      From Chapter
                    </label>
                    <select
                      value={activeNote.fromChapter}
                      onChange={(e) => handleUpdateActiveNote({ fromChapter: Number(e.target.value) })}
                      className="w-full bg-[#1e0a15] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-[#ff7597]"
                    >
                      {[...Array(11)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Chapter {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                      Target Chapter
                    </label>
                    <select
                      value={activeNote.toChapter}
                      onChange={(e) => handleUpdateActiveNote({ toChapter: Number(e.target.value) })}
                      className="w-full bg-[#1e0a15] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-[#ff7597]"
                    >
                      {[...Array(11)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Chapter {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Title & Emoji */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                      Note Title
                    </label>
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) => handleUpdateActiveNote({ title: e.target.value })}
                      placeholder="e.g. Hold on, Sammm..."
                      className="w-full bg-[#1e0a15] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-[#ff7597]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                      Emoji
                    </label>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={activeNote.emoji}
                        onChange={(e) => handleUpdateActiveNote({ emoji: e.target.value })}
                        className="w-full bg-[#1e0a15] border border-white/15 rounded-xl px-2 py-2 text-sm text-center text-white focus:outline-hidden focus:border-[#ff7597]"
                      >
                        {EMOJI_OPTIONS.map((em) => (
                          <option key={em} value={em}>
                            {em}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Note Message Area */}
                <div>
                  <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Personalized Love Message</span>
                    <span className="text-[10px] text-stone-500 font-normal">
                      Appears in the romantic parchment card
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    value={activeNote.note}
                    onChange={(e) => handleUpdateActiveNote({ note: e.target.value })}
                    placeholder="Write a sweet whisper message for Sammm..."
                    className="w-full bg-[#1e0a15] border border-white/15 rounded-2xl p-3.5 text-sm sm:text-base font-serif-romantic italic text-[#f7f2ea] focus:outline-hidden focus:border-[#ff7597] leading-relaxed resize-none"
                  />
                </div>

                {/* Sender Signature */}
                <div>
                  <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                    Signature / Author
                  </label>
                  <input
                    type="text"
                    value={activeNote.sender}
                    onChange={(e) => handleUpdateActiveNote({ sender: e.target.value })}
                    placeholder="e.g. Radhika 💕"
                    className="w-full bg-[#1e0a15] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-[#ff7597]"
                  />
                </div>

                {/* Live Preview Card */}
                <div className="mt-2 pt-3 border-t border-white/10">
                  <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block mb-2">
                    Live Appearance Preview
                  </span>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#fffbf4] to-[#f4e4d0] text-[#2c151c] shadow-lg border border-[#e6be6d]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{activeNote.emoji}</span>
                      <h4 className="font-serif-romantic text-lg font-bold">{activeNote.title}</h4>
                    </div>
                    <p className="font-serif-romantic text-sm italic leading-relaxed text-[#381622]">
                      “{activeNote.note}”
                    </p>
                    <p className="mt-2 text-right font-handwriting text-xl text-[#85182a] font-bold">
                      — {activeNote.sender}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="md:col-span-7 flex items-center justify-center p-8 text-stone-500 font-mono text-xs">
                Select a note on the left to edit
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between bg-black/40 text-xs font-mono">
            <span className="text-stone-400">
              💡 Notes will automatically appear when Sammm clicks "Next Chapter" or selects a chapter!
            </span>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#85182a] to-[#a32238] hover:from-[#a32238] hover:to-[#85182a] text-white font-bold transition-all shadow-md cursor-pointer hover:scale-105"
            >
              Save All Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
