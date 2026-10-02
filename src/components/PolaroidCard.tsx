import React from 'react';
import { Camera, Image as ImageIcon, Sparkles, Film } from 'lucide-react';

interface PolaroidCardProps {
  placeholderKey: string;
  defaultPlaceholderLabel: string;
  customUrl?: string;
  caption?: string;
  date?: string;
  rotation?: number;
  className?: string;
  badge?: string;
  type?: 'polaroid' | 'postcard' | 'film' | 'minimal';
  aspectRatio?: 'square' | '4/3' | '16/9' | '3/2' | 'auto';
  objectFit?: 'cover' | 'contain';
  onReplace?: () => void;
  onDirectUpload?: (dataUrl: string) => void;
  onClick?: () => void;
}

const isVideoUrl = (url?: string) => {
  if (!url) return false;
  return url.startsWith('data:video') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('/video');
};

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  placeholderKey,
  defaultPlaceholderLabel,
  customUrl,
  caption,
  date,
  rotation = 0,
  className = '',
  badge,
  type = 'polaroid',
  aspectRatio = 'square',
  objectFit = 'cover',
  onReplace,
  onDirectUpload,
  onClick,
}) => {
  const isPostcard = type === 'postcard';

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onDirectUpload) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onDirectUpload(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '16/9':
        return 'aspect-[16/9]';
      case '4/3':
        return 'aspect-[4/3]';
      case '3/2':
        return 'aspect-[3/2]';
      case 'auto':
        return 'aspect-auto min-h-[220px]';
      case 'square':
      default:
        return 'aspect-[4/3] sm:aspect-square';
    }
  };

  return (
    <div
      onClick={onClick}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`group relative transition-all duration-300 hover:scale-[1.02] hover:z-20 cursor-pointer ${className}`}
    >
      {/* Washi tape on top for polaroids */}
      {type === 'polaroid' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#eedec8]/60 backdrop-blur-sm shadow-xs border-dashed border border-amber-800/20 rotate-1 z-10 pointer-events-none rounded-xs" />
      )}

      {badge && (
        <span className="absolute -top-2 -right-2 z-20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#85182a] text-[#f7f2ea] rounded-full shadow-md border border-[#c4324f]/40">
          {badge}
        </span>
      )}

      <div
        className={`bg-[#fbf7f0] text-[#2c1c1f] shadow-xl transition-all duration-300 ${
          isPostcard ? 'p-3 pb-4 rounded-xl border border-[#dfd3c3]' : 'p-3 pb-5 rounded-lg border border-[#e8ded2]'
        }`}
      >
        {/* Photo Container */}
        <div className={`relative ${getAspectClass()} w-full bg-[#181119] rounded-md overflow-hidden flex items-center justify-center border border-[#e4d8c9] group-hover:border-[#96263b]/30 transition-colors`}>
          {customUrl ? (
            isVideoUrl(customUrl) ? (
              <div className="relative w-full h-full">
                <video
                  src={customUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`w-full h-full ${objectFit === 'contain' ? 'object-contain bg-black/90' : 'object-cover'}`}
                />
                <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white flex items-center gap-1 backdrop-blur-xs">
                  <Film className="w-2.5 h-2.5 text-[#e6be6d]" />
                  <span>Motion</span>
                </span>
              </div>
            ) : (
              <img
                src={customUrl}
                alt={caption || defaultPlaceholderLabel}
                className={`w-full h-full ${objectFit === 'contain' ? 'object-contain bg-black/90' : 'object-cover'}`}
                loading="lazy"
              />
            )
          ) : (
            /* Illustrative Romantic Placeholder */
            <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#24131b] via-[#351523] to-[#1a0f16] text-[#edd5dc] relative overflow-hidden select-none">
              <div className="absolute inset-0 bg-noise opacity-30" />
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#80142e]/30 rounded-full blur-xl" />
              <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#d4af37]/20 rounded-full blur-xl" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#80142e]/40 border border-[#f8d5db]/30 flex items-center justify-center mb-2 shadow-inner group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6 text-[#f8d5db]" />
                </div>
                <span className="text-[11px] font-mono tracking-wider text-[#e6be6d] uppercase font-semibold px-2 py-0.5 rounded bg-black/40 border border-[#e6be6d]/30 mb-1">
                  [{placeholderKey}]
                </span>
                <p className="text-xs text-[#f5ece0] font-medium max-w-[280px] leading-snug line-clamp-2">
                  {defaultPlaceholderLabel}
                </p>
                {onDirectUpload ? (
                  <label className="mt-2.5 flex items-center gap-1.5 text-xs text-white bg-[#85182a] hover:bg-[#a32238] px-3 py-1.5 rounded-full transition-colors border border-white/20 shadow-md cursor-pointer">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Photo/Video</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="mt-2.5 flex items-center gap-1 text-[10px] text-[#f8d5db]/80 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full transition-colors border border-white/10">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Tap to upload / change</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Direct Upload Overlay Button */}
          {onDirectUpload && (
            <label
              title="Upload / Change Photo from Device"
              className="absolute top-2 right-2 p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-black/75 hover:bg-[#85182a] text-white transition-all backdrop-blur-xs border border-white/30 cursor-pointer shadow-md group-hover:scale-105 flex items-center gap-1.5 text-[11px] font-mono z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <Camera className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className="hidden sm:inline font-sans text-xs">Upload</span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          )}

          {/* Quick Replace Overlay Button */}
          {!onDirectUpload && onReplace && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReplace();
              }}
              title="Replace this photo"
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-[#85182a] text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs border border-white/20"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Polaroid / Postcard Caption */}
        <div className="mt-3 px-1 flex flex-col justify-between">
          {caption && (
            <p className="font-handwriting text-lg sm:text-xl text-[#3b121e] leading-tight font-medium">
              {caption}
            </p>
          )}
          {date && (
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#7a5860] mt-1 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#85182a]" />
              {date}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
