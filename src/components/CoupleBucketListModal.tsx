import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Check, Plus, Trash2, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_BUCKET_LIST, BucketListItem } from '../data/bucketListData';
import { sound } from '../services/soundEffects';

interface CoupleBucketListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoupleBucketListModal: React.FC<CoupleBucketListModalProps> = ({ isOpen, onClose }) => {
  const [items, setItems] = useState<BucketListItem[]>(() => {
    try {
      const saved = localStorage.getItem('radhika_sammm_bucket_list_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_BUCKET_LIST;
  });

  const [newDream, setNewDream] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('radhika_sammm_bucket_list_v1', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const toggleItem = (id: string) => {
    sound.playClick();
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed;
          if (nextState) {
            sound.playChime();
            try {
              confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.55 },
                colors: ['#e6be6d', '#ff7597', '#ffffff'],
              });
            } catch {
              // ignore
            }
          }
          const today = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
          return {
            ...item,
            completed: nextState,
            completedDate: nextState ? today : undefined,
          };
        }
        return item;
      })
    );
  };

  const handleAddDream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDream.trim()) return;

    sound.playClick();
    const newItem: BucketListItem = {
      id: `custom-dream-${Date.now()}`,
      title: newDream.trim(),
      category: 'romantic',
      icon: '✨',
      completed: false,
      custom: true,
    };

    setItems([...items, newItem]);
    setNewDream('');
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: string) => {
    sound.playClick();
    setItems(items.filter((i) => i.id !== id));
  };

  const completedCount = items.filter((i) => i.completed).length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-gradient-to-br from-[#1b0612] via-[#240816] to-[#0f0209] border-2 border-[#e6be6d]/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(133,24,42,0.4)] text-stone-100 my-8 max-h-[90vh] flex flex-col relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#85182a]/50 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#3d0d1e] border border-[#e6be6d]/50 flex items-center justify-center text-xl shadow-md">
              🌟
            </div>
            <div>
              <h3 className="font-serif-romantic text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Our Couple Bucket List</span>
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
              </h3>
              <p className="text-xs text-stone-400 font-sans">
                Sweet dreams and milestones for Radhika & Sammm ❤️
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-full bg-[#330917] hover:bg-[#4a0f23] text-xs font-mono text-[#e6be6d] border border-[#85182a] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Dream</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-4 p-3 bg-[#11030a] rounded-2xl border border-[#85182a]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#ffd700]" />
            <span className="text-xs font-mono text-stone-300">
              {completedCount} of {items.length} Dreams Achieved
            </span>
          </div>
          <div className="w-36 bg-black/60 h-2.5 rounded-full overflow-hidden border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-[#85182a] to-[#ffd700] transition-all duration-500 rounded-full"
              style={{ width: `${(completedCount / Math.max(1, items.length)) * 100}%` }}
            />
          </div>
        </div>

        {/* Add Dream Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddDream}
              className="mt-4 p-4 rounded-2xl bg-[#14040d] border border-[#e6be6d]/40 space-y-3 shrink-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#e6be6d] font-bold">
                  Add A New Dream For Us
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-stone-400 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <input
                type="text"
                value={newDream}
                onChange={(e) => setNewDream(e.target.value)}
                placeholder="What do you want us to do together? (e.g. Scuba diving in Bali)"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#1c0612] border border-[#661327] text-white text-xs outline-none focus:border-[#e6be6d]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#85182a] to-[#ab233c] text-white text-xs font-serif-romantic font-bold border border-[#e6be6d]/50 shadow-md cursor-pointer"
                >
                  Save Dream 🌟
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Scrollable List */}
        <div className="overflow-y-auto pr-1 mt-4 space-y-2.5 flex-1">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                item.completed
                  ? 'bg-[#15060d]/60 border-emerald-500/40 text-stone-300'
                  : 'bg-[#200816]/80 border-[#85182a]/40 hover:border-[#e6be6d]/60 text-white hover:scale-[1.005]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Custom Checkbox */}
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    item.completed
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                      : 'bg-[#10030a] border-[#5e1526] group-hover:border-[#e6be6d]'
                  }`}
                >
                  {item.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                <span className="text-xl">{item.icon}</span>

                <div>
                  <p
                    className={`font-serif-romantic text-sm sm:text-base leading-snug ${
                      item.completed ? 'line-through text-stone-400' : 'text-white font-medium'
                    }`}
                  >
                    {item.title}
                  </p>
                  {item.completedDate && (
                    <span className="text-[10px] font-mono text-emerald-400 mt-0.5 block">
                      Achieved: {item.completedDate} ❤️
                    </span>
                  )}
                </div>
              </div>

              {item.custom && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="p-1 text-stone-500 hover:text-rose-400 cursor-pointer"
                  title="Remove Dream"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#85182a]/50 text-center text-xs font-mono text-stone-400 shrink-0">
          “Every dream is better when I'm doing it with you.” ❤️
        </div>
      </motion.div>
    </div>
  );
};
