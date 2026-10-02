import React from 'react';
import { X, Sparkles, Stethoscope } from 'lucide-react';
import { DoctorPrescription } from './DoctorPrescription';
import { sound } from '../services/soundEffects';

interface DoctorPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorPrescriptionModal: React.FC<DoctorPrescriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#140a13] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden text-[#f7f2ea] flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#3d1320] flex items-center justify-between bg-gradient-to-r from-[#0d2229] via-[#102d36] to-[#0d2229]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Stethoscope className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-serif-romantic text-lg sm:text-xl font-bold tracking-wide text-[#faf2eb] flex items-center gap-2">
                The Prescription of Love (Dr. Sammm Rx)
                <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
              </h3>
              <p className="text-[11px] font-mono text-cyan-300/80">
                Official Love & Care Regimen • Prescribed for Patient Sammm by Radhika
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Rx Pad"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <DoctorPrescription />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#3d1320] bg-[#10070e] flex items-center justify-between">
          <span className="text-xs text-stone-400 font-mono italic">
            Daily dosage: Take Huggocillin and Chai-Zepam with plenty of Radhika’s love.
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-gradient-to-r from-[#85182a] to-[#a32238] hover:from-[#a32238] hover:to-[#85182a] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Back to Story
          </button>
        </div>
      </div>
    </div>
  );
};
