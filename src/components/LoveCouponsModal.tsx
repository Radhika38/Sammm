import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Ticket, Check, RotateCcw, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_COUPONS, LoveCoupon } from '../data/couponsData';
import { sound } from '../services/soundEffects';

interface LoveCouponsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoveCouponsModal: React.FC<LoveCouponsModalProps> = ({ isOpen, onClose }) => {
  const [coupons, setCoupons] = useState<LoveCoupon[]>(() => {
    try {
      const saved = localStorage.getItem('sammm_love_coupons_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_COUPONS;
  });

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('sammm_love_coupons_v1', JSON.stringify(coupons));
    } catch {
      // ignore
    }
  }, [coupons]);

  const handleRedeem = (id: string) => {
    sound.playChime();
    sound.playNotification();

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#e6be6d', '#ff7597', '#ffffff', '#ffd700'],
      });
    } catch {
      // ignore
    }

    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, redeemedAt: today } : c))
    );
  };

  const handleResetCoupons = () => {
    sound.playClick();
    setCoupons(INITIAL_COUPONS);
  };

  const handleAddCustomCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sound.playClick();
    const newCoupon: LoveCoupon = {
      id: `custom-coupon-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: 'Custom Boyfriend Day Wish',
      description: newDesc.trim() || 'Custom romantic coupon created just for Sammm.',
      icon: '🎁',
      badge: 'CUSTOM WISH ✨',
      category: 'romantic',
    };

    setCoupons([newCoupon, ...coupons]);
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

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
        className="w-full max-w-4xl bg-gradient-to-br from-[#1b0612] via-[#240816] to-[#0f0209] border-2 border-[#e6be6d]/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(133,24,42,0.4)] text-stone-100 my-8 max-h-[90vh] flex flex-col relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#85182a]/50 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#3d0d1e] border border-[#e6be6d]/50 flex items-center justify-center text-xl shadow-md">
              🎟️
            </div>
            <div>
              <h3 className="font-serif-romantic text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Sammm’s Boyfriend Day Love Coupons</span>
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
              </h3>
              <p className="text-xs text-stone-400 font-sans">
                Tear-away romantic vouchers redeemable anytime in real life! ❤️
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-full bg-[#330917] hover:bg-[#4a0f23] text-xs font-mono text-[#e6be6d] border border-[#85182a] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Coupon</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Custom Coupon Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddCustomCoupon}
              className="mt-4 p-4 rounded-2xl bg-[#11030a] border border-[#e6be6d]/40 space-y-3 shrink-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#e6be6d] font-bold">
                  Create A Custom Coupon For Sammm
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
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Coupon Title (e.g. Free Movie Night Pick)"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#1b0612] border border-[#661327] text-white text-xs outline-none focus:border-[#e6be6d]"
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Details / terms (e.g. Valid on any weekend)"
                className="w-full px-3 py-2 rounded-xl bg-[#1b0612] border border-[#661327] text-white text-xs outline-none focus:border-[#e6be6d]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#85182a] to-[#ab233c] text-white text-xs font-serif-romantic font-bold border border-[#e6be6d]/50 shadow-md cursor-pointer"
                >
                  Save Coupon 🎟️
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Scrollable Coupons Grid */}
        <div className="overflow-y-auto pr-1 mt-6 space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coupons.map((coupon) => {
              const isRedeemed = Boolean(coupon.redeemedAt);

              return (
                <div
                  key={coupon.id}
                  className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col justify-between overflow-hidden shadow-lg ${
                    isRedeemed
                      ? 'bg-[#14060d]/70 border-[#5e1a29] opacity-80'
                      : 'bg-[#200815]/90 border-[#e6be6d]/40 hover:border-[#e6be6d] hover:scale-[1.01]'
                  }`}
                >
                  {/* Left Ticket Notch */}
                  <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1b0612] border border-[#85182a]" />
                  {/* Right Ticket Notch */}
                  <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1b0612] border border-[#85182a]" />

                  {/* Coupon Header */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#e6be6d] bg-[#3a0a1a] px-2.5 py-0.5 rounded-md border border-[#85182a]/50">
                        {coupon.badge}
                      </span>
                      <span className="text-2xl">{coupon.icon}</span>
                    </div>

                    <h4 className="font-serif-romantic text-lg sm:text-xl font-bold text-white leading-snug">
                      {coupon.title}
                    </h4>
                    <p className="text-[11px] font-mono text-stone-400 mt-0.5">
                      {coupon.subtitle}
                    </p>
                    <p className="text-xs text-stone-300 font-sans leading-relaxed mt-2.5 italic">
                      “{coupon.description}”
                    </p>
                  </div>

                  {/* Stamp / Action */}
                  <div className="mt-4 pt-3 border-t border-dashed border-[#85182a]/40 flex items-center justify-between">
                    {isRedeemed ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[11px] font-mono font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>REDEEMED • {coupon.redeemedAt}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-[#e6be6d] uppercase tracking-wider">
                        ★ READY TO REDEEM
                      </span>
                    )}

                    {!isRedeemed ? (
                      <button
                        onClick={() => handleRedeem(coupon.id)}
                        className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#85182a] via-[#ba1e3d] to-[#85182a] hover:from-[#a01c34] hover:to-[#cb2545] text-white text-xs font-serif-romantic font-bold border border-[#e6be6d]/60 shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Heart className="w-3 h-3 text-[#ffd700] fill-current" />
                        <span>Redeem Now</span>
                      </button>
                    ) : (
                      <span className="text-xl">❤️</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#85182a]/50 flex items-center justify-between shrink-0 text-xs font-mono text-stone-400">
          <span>Signed with love: Radhika ❤️</span>
          <button
            onClick={handleResetCoupons}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Coupons</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
