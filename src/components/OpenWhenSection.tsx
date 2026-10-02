import React from 'react';
import { Mail, Sparkles, Moon, Stethoscope, Heart, HeartHandshake, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { OPEN_WHEN_ENVELOPES, OpenWhenEnvelope } from '../data/openWhenData';
import { sound } from '../services/soundEffects';

interface OpenWhenSectionProps {
  onOpenEnvelope: (envelopeId?: string) => void;
}

export const OpenWhenSection: React.FC<OpenWhenSectionProps> = ({ onOpenEnvelope }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto w-full my-12 relative text-left"
    >
      <div className="relative bg-gradient-to-b from-[#180a18] to-[#100510] border-2 border-[#85182a]/60 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Decorative corner glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#85182a]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#e6be6d]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-[#3d1222] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#e6be6d] font-bold">
                Special Keepsake
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-[#85182a]/60 text-white font-bold border border-[#ff7597]/40">
                4 SEALED LETTERS
              </span>
            </div>
            <h3 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-white mt-1">
              💌 “Open When…” Digital Envelopes
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
              Made specifically for the moments when you need my voice, reassurance, motivation, or a tight hug the most.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenEnvelope();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#85182a] to-[#a32238] hover:from-[#a32238] hover:to-[#85182a] text-white text-xs font-mono font-bold tracking-wider transition-all hover:scale-105 cursor-pointer shadow-lg border border-[#e6be6d]/40 shrink-0"
          >
            <span>VIEW ALL ENVELOPES</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Envelopes 4 Cards Preview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OPEN_WHEN_ENVELOPES.map((env) => {
            return (
              <div
                key={env.id}
                onClick={() => {
                  sound.playClick();
                  onOpenEnvelope(env.id);
                }}
                className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between bg-gradient-to-br ${env.theme.bgGradient} ${env.theme.border} hover:scale-[1.02] hover:shadow-xl`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono text-[#e6be6d] font-bold">
                    {env.envelopeNumber}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white/90 border border-white/10"
                    style={{ backgroundColor: `${env.theme.accentColor}33` }}
                  >
                    {env.tag}
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <h4 className="font-serif-romantic text-lg font-bold text-white group-hover:text-[#fbebd5] transition-colors leading-snug">
                    {env.title}
                  </h4>
                  <p className="text-xs text-stone-400 line-clamp-2">
                    {env.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {env.id === 'overthinking-2am' && '🌙'}
                      {env.id === 'medical-exams' && '🩺'}
                      {env.id === 'miss-me' && '❤️'}
                      {env.id === 'had-a-fight' && '🕊️'}
                    </span>
                    <span className="text-xs font-mono text-stone-300">
                      Tap to unseal
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#e6be6d] group-hover:underline flex items-center gap-1">
                    Open Letter →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
