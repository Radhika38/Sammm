import React, { useState } from 'react';
import {
  Camera,
  Film,
  Type,
  Layout,
  Edit3,
  Check,
  X,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentBlockData, ContentBlockType } from '../data/contentBlocks';
import { sound } from '../services/soundEffects';
import { persistentMediaStorage } from '../services/persistentMediaStorage';

interface ContentBlockItemProps {
  block: ContentBlockData;
  onUpdateBlock: (updated: ContentBlockData) => void;
  onUploadMedia?: (mediaKey: string, dataUrl: string) => void;
  className?: string;
}

export const ContentBlockItem: React.FC<ContentBlockItemProps> = ({
  block,
  onUpdateBlock,
  onUploadMedia,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(block.title || '');
  const [editBody, setEditBody] = useState(block.body || '');
  const [editSubtitle, setEditSubtitle] = useState(block.subtitle || '');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null);

  const handleMediaLoaded = (e: React.SyntheticEvent<HTMLVideoElement | HTMLImageElement, Event>) => {
    const el = e.currentTarget;
    if ('videoWidth' in el && el.videoWidth && el.videoHeight) {
      setNaturalDimensions({ width: el.videoWidth, height: el.videoHeight });
    } else if ('naturalWidth' in el && el.naturalWidth && el.naturalHeight) {
      setNaturalDimensions({ width: el.naturalWidth, height: el.naturalHeight });
    }
  };

  const isVideoUrl = (url?: string) => {
    if (!url) return false;
    return (
      url.startsWith('data:video') ||
      url.endsWith('.mp4') ||
      url.endsWith('.mov') ||
      url.endsWith('.webm') ||
      url.includes('/video')
    );
  };

  const hasMedia = Boolean(block.mediaUrl);
  const currentIsVideo = block.type === 'video' || isVideoUrl(block.mediaUrl);

  const handleTypeChange = (newType: ContentBlockType) => {
    sound.playClick();
    onUpdateBlock({ ...block, type: newType });
  };

  const handleOpenEdit = () => {
    sound.playClick();
    setEditTitle(block.title || '');
    setEditBody(block.body || '');
    setEditSubtitle(block.subtitle || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    sound.playNotification();
    onUpdateBlock({
      ...block,
      title: editTitle.trim(),
      body: editBody.trim(),
      subtitle: editSubtitle.trim(),
    });
    setIsEditing(false);
  };

  const selectedRatio = block.aspectRatio || 'auto';
  const objectFitMode = block.objectFit || 'contain';

  const handleRatioChange = (ratio: 'auto' | '9/16' | '16/9' | 'square') => {
    sound.playClick();
    onUpdateBlock({ ...block, aspectRatio: ratio });
  };

  const handleFitToggle = () => {
    sound.playClick();
    onUpdateBlock({
      ...block,
      objectFit: objectFitMode === 'cover' ? 'contain' : 'cover',
    });
  };

  // Determine computed aspect ratio and orientation
  let computedAspectRatio: string | undefined = undefined;
  let isVertical = false;

  if (selectedRatio === 'auto') {
    if (naturalDimensions) {
      computedAspectRatio = `${naturalDimensions.width} / ${naturalDimensions.height}`;
      isVertical = naturalDimensions.height > naturalDimensions.width;
    } else {
      computedAspectRatio = currentIsVideo ? '16 / 9' : '16 / 9';
    }
  } else if (selectedRatio === '9/16') {
    computedAspectRatio = '9 / 16';
    isVertical = true;
  } else if (selectedRatio === '16/9') {
    computedAspectRatio = '16 / 9';
    isVertical = false;
  } else if (selectedRatio === 'square') {
    computedAspectRatio = '1 / 1';
    isVertical = false;
  } else if (selectedRatio === '4/3') {
    computedAspectRatio = '4 / 3';
    isVertical = false;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playClick();
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        if (result) {
          const isFileVideo = file.type.startsWith('video/');
          const compressed = !isFileVideo
            ? await persistentMediaStorage.compressImageIfNeeded(result)
            : result;

          const updatedType: ContentBlockType =
            block.type === 'text'
              ? isFileVideo
                ? 'video'
                : 'photo'
              : block.type;

          onUpdateBlock({
            ...block,
            mediaUrl: compressed,
            type: updatedType,
          });

          if (onUploadMedia) {
            onUploadMedia(block.mediaKey, compressed);
          }
          sound.playChime();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`relative group bg-[#180712]/90 border border-[#85182a]/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_35px_rgba(133,24,42,0.2)] backdrop-blur-xl transition-all duration-300 hover:border-[#e6be6d]/60 ${className}`}
    >
      {/* Top Block Control Bar: Easily toggle between Photo, Video, Text, Combo */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5 pb-3 border-b border-[#85182a]/40">
        <div className="flex items-center gap-1 bg-[#10030a] p-1 rounded-xl border border-[#521323]">
          <button
            type="button"
            onClick={() => handleTypeChange('photo')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
              block.type === 'photo'
                ? 'bg-[#85182a] text-white font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Switch to Photo slot"
          >
            <Camera className="w-3 h-3" />
            <span>Photo</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('video')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
              block.type === 'video'
                ? 'bg-[#85182a] text-white font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Switch to Video container"
          >
            <Film className="w-3 h-3" />
            <span>Video</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('text')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
              block.type === 'text'
                ? 'bg-[#85182a] text-white font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Switch to Custom Text area"
          >
            <Type className="w-3 h-3" />
            <span>Text</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('media-with-text')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
              block.type === 'media-with-text'
                ? 'bg-[#85182a] text-white font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Switch to Media + Custom Text Combo"
          >
            <Layout className="w-3 h-3" />
            <span className="hidden sm:inline">Combo</span>
          </button>
        </div>

        {/* Right Action Icons: Upload Media & Edit Text */}
        <div className="flex items-center gap-2">
          {block.type !== 'text' && (
            <label
              title="Upload Photo or Video"
              className="px-3 py-1.5 rounded-full bg-[#2d0816] hover:bg-[#85182a] text-white text-xs font-mono border border-[#85182a] flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Upload className="w-3 h-3 text-[#ffd700]" />
              <span className="text-[11px]">Upload</span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          <button
            type="button"
            onClick={handleOpenEdit}
            title="Edit Title & Story Words"
            className="px-3 py-1.5 rounded-full bg-[#2d0816] hover:bg-[#85182a] text-[#e6be6d] hover:text-white text-xs font-mono border border-[#85182a] flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <Edit3 className="w-3 h-3" />
            <span className="text-[11px]">Edit Text</span>
          </button>
        </div>
      </div>

      {/* CONTENT DISPLAY AREA */}
      <div>
        {/* 1. MEDIA CONTAINER (If Photo, Video, or Combo) */}
        {block.type !== 'text' && (
          <div className="mb-4">
            {hasMedia && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 mb-2.5 text-xs">
                <div className="flex items-center gap-1 bg-[#10030a] p-1 rounded-xl border border-[#4a0d1d]">
                  <span className="text-[10px] font-mono text-stone-400 px-1 uppercase">Frame:</span>
                  <button
                    type="button"
                    onClick={() => handleRatioChange('auto')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono cursor-pointer transition-colors ${
                      selectedRatio === 'auto' ? 'bg-[#85182a] text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title="Auto fit to exact video/photo dimensions"
                  >
                    📐 Auto Fit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRatioChange('9/16')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono cursor-pointer transition-colors ${
                      selectedRatio === '9/16' ? 'bg-[#85182a] text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title="Mobile Reel / Portrait (9:16)"
                  >
                    📱 9:16
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRatioChange('16/9')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono cursor-pointer transition-colors ${
                      selectedRatio === '16/9' ? 'bg-[#85182a] text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title="Widescreen (16:9)"
                  >
                    🖥️ 16:9
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRatioChange('square')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono cursor-pointer transition-colors ${
                      selectedRatio === 'square' ? 'bg-[#85182a] text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title="Square (1:1)"
                  >
                    🔲 1:1
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleFitToggle}
                  className="px-2.5 py-1 rounded-xl bg-[#10030a] hover:bg-[#2e0917] text-[#e6be6d] border border-[#4a0d1d] text-[11px] font-mono cursor-pointer transition-colors"
                  title="Toggle between Crop (Cover) and Full View (Contain)"
                >
                  {objectFitMode === 'contain' ? '🖼️ Full (Contain)' : '🔍 Fill (Cover)'}
                </button>
              </div>
            )}

            {hasMedia ? (
              currentIsVideo ? (
                /* Video Container with Dynamic Natural Frame */
                <div
                  className={`relative rounded-2xl overflow-hidden bg-black border border-[#85182a]/50 shadow-inner group/vid transition-all duration-300 ${
                    isVertical ? 'max-w-xs sm:max-w-sm mx-auto' : 'w-full'
                  }`}
                  style={{
                    aspectRatio: computedAspectRatio,
                    maxHeight: isVertical ? '75vh' : '65vh',
                  }}
                >
                  <video
                    src={block.mediaUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onLoadedMetadata={handleMediaLoaded}
                    className={`w-full h-full ${
                      objectFitMode === 'contain' ? 'object-contain' : 'object-cover'
                    }`}
                    ref={(el) => {
                      if (el) {
                        if (isVideoPlaying) el.play().catch(() => {});
                        else el.pause();
                      }
                    }}
                  />
                  {/* Floating Video Controls */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    <button
                      type="button"
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="text-white hover:text-[#ffd700] p-1 cursor-pointer transition-colors"
                      title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
                    >
                      {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:text-[#ffd700] p-1 cursor-pointer transition-colors"
                      title={isMuted ? 'Unmute Video' : 'Mute Video'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[10px] font-mono text-[#e6be6d] border-l border-white/20 pl-2">
                      Motion Video
                    </span>
                  </div>
                </div>
              ) : (
                /* Photo Container with Dynamic Natural Frame */
                <div
                  className={`relative rounded-2xl overflow-hidden bg-[#10030a] border border-[#85182a]/50 shadow-md transition-all duration-300 ${
                    isVertical ? 'max-w-xs sm:max-w-sm mx-auto' : 'w-full'
                  }`}
                  style={{
                    aspectRatio: computedAspectRatio,
                    maxHeight: isVertical ? '75vh' : '65vh',
                  }}
                >
                  <img
                    src={block.mediaUrl}
                    alt={block.title || 'Chapter Photo'}
                    onLoad={handleMediaLoaded}
                    className={`w-full h-full ${
                      objectFitMode === 'contain' ? 'object-contain' : 'object-cover'
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-mono text-[#e6be6d] flex items-center gap-1">
                    <Camera className="w-3 h-3 text-[#ffd700]" />
                    <span>Photo</span>
                  </div>
                </div>
              )
            ) : (
              /* Clean Minimal Placeholder to Upload */
              <label className="flex flex-col items-center justify-center p-8 sm:p-10 rounded-2xl border-2 border-dashed border-[#85182a]/50 hover:border-[#e6be6d] bg-[#12030b]/60 cursor-pointer transition-colors text-center group/empty">
                <div className="w-14 h-14 rounded-full bg-[#3d0a1b] border border-[#85182a] flex items-center justify-center text-white mb-2 shadow-inner group-hover/empty:scale-110 transition-transform">
                  {block.type === 'video' ? (
                    <Film className="w-6 h-6 text-[#ffd700]" />
                  ) : (
                    <Camera className="w-6 h-6 text-[#ffd700]" />
                  )}
                </div>
                <span className="text-sm font-mono font-bold text-[#e6be6d] uppercase tracking-wider">
                  + Upload {block.type === 'video' ? 'Video' : 'Photo'}
                </span>
                <span className="text-xs text-stone-400 mt-1">
                  Tap to select from your phone or device
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}

        {/* 2. CUSTOM TEXT AREA (Title, Body, Subtitle) */}
        {(block.type === 'text' || block.type === 'media-with-text' || block.title || block.body) && (
          <div className="space-y-2">
            {block.subtitle && (
              <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#e6be6d] bg-[#360918]/80 px-2.5 py-0.5 rounded-md border border-[#85182a]/60">
                {block.subtitle}
              </span>
            )}

            {block.title && (
              <h3 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                {block.title}
              </h3>
            )}

            {block.body ? (
              <p className="font-serif-romantic text-base sm:text-lg text-stone-200 leading-relaxed italic pt-1">
                “{block.body}”
              </p>
            ) : (
              <button
                type="button"
                onClick={handleOpenEdit}
                className="text-left text-xs font-mono text-stone-400 hover:text-[#e6be6d] italic cursor-pointer transition-colors block py-1"
              >
                ✏️ + Tap here to write your words for this step...
              </button>
            )}
          </div>
        )}
      </div>

      {/* EDIT MODAL FOR TITLE, SUBTITLE & BODY */}
      <AnimatePresence>
        {isEditing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#190611] border-2 border-[#e6be6d]/60 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#85182a]/50 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#e6be6d]" />
                  <h4 className="font-serif-romantic text-lg font-bold text-white">
                    Edit Content Block ✍️
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1 text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#e6be6d] uppercase tracking-wider">
                  Title / Heading
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. The Moment Everything Changed"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e030a] border border-[#6b162a] focus:border-[#e6be6d] text-white text-sm outline-none"
                />
              </div>

              {/* Subtitle / Date */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#e6be6d] uppercase tracking-wider">
                  Date / Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  placeholder="e.g. 03 May 2026 • Court No. 1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e030a] border border-[#6b162a] focus:border-[#e6be6d] text-white text-sm outline-none"
                />
              </div>

              {/* Body Text */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#e6be6d] uppercase tracking-wider">
                  Your Story Words / Caption
                </label>
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  placeholder="Apne hisab se yahan likho..."
                  rows={4}
                  className="w-full p-3.5 rounded-xl bg-[#0e030a] border border-[#6b162a] focus:border-[#e6be6d] text-white text-sm outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#85182a]/40">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-mono text-stone-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#85182a] to-[#a8223a] text-white font-serif-romantic font-bold text-sm border border-[#e6be6d]/60 shadow-lg hover:scale-105 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#ffd700]" />
                  <span>Save Words ❤️</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
