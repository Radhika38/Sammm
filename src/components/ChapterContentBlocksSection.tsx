import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ContentBlockData, loadChapterBlocks, loadChapterBlocksAsync, saveChapterBlocks } from '../data/contentBlocks';
import { ContentBlockItem } from './ContentBlockItem';
import { sound } from '../services/soundEffects';

interface ChapterContentBlocksSectionProps {
  chapterId: string;
  defaultBlocks: ContentBlockData[];
  onUploadMedia?: (mediaKey: string, dataUrl: string) => void;
  mediaConfig?: Record<string, string>;
}

export const ChapterContentBlocksSection: React.FC<ChapterContentBlocksSectionProps> = ({
  chapterId,
  defaultBlocks,
  onUploadMedia,
  mediaConfig = {},
}) => {
  const [blocks, setBlocks] = useState<ContentBlockData[]>(() => {
    const loaded = loadChapterBlocks(chapterId, defaultBlocks);
    // Merge mediaConfig urls if available, and ensure default aspectRatio/objectFit are populated
    return loaded.map((b, idx) => {
      const def = defaultBlocks[idx];
      return {
        ...b,
        aspectRatio: b.aspectRatio || def?.aspectRatio || 'auto',
        objectFit: b.objectFit || def?.objectFit || 'contain',
        mediaUrl: mediaConfig[b.mediaKey] || b.mediaUrl,
      };
    });
  });

  // Keep mediaUrl in sync when mediaConfig updates
  useEffect(() => {
    setBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        mediaUrl: mediaConfig[b.mediaKey] || b.mediaUrl,
      }))
    );
  }, [mediaConfig]);

  // Load high-resolution media & videos from persistent IndexedDB
  useEffect(() => {
    let isMounted = true;
    loadChapterBlocksAsync(chapterId, defaultBlocks).then((asyncBlocks) => {
      if (isMounted && asyncBlocks && asyncBlocks.length > 0) {
        setBlocks(
          asyncBlocks.map((b, idx) => {
            const def = defaultBlocks[idx];
            return {
              ...b,
              aspectRatio: b.aspectRatio || def?.aspectRatio || 'auto',
              objectFit: b.objectFit || def?.objectFit || 'contain',
              mediaUrl: mediaConfig[b.mediaKey] || b.mediaUrl,
            };
          })
        );
      }
    });
    return () => {
      isMounted = false;
    };
  }, [chapterId]);

  const handleUpdateBlock = (updated: ContentBlockData) => {
    const next = blocks.map((b) => (b.id === updated.id ? updated : b));
    setBlocks(next);
    saveChapterBlocks(chapterId, next);
  };

  const handleAddBlock = () => {
    sound.playClick();
    const newBlock: ContentBlockData = {
      id: `${chapterId}-block-${Date.now()}`,
      type: 'photo',
      title: 'Our Special Moment ❤️',
      body: 'Tap "Edit Text" to write your own words for this step.',
      subtitle: 'Chapter Story Step',
      mediaKey: `CUSTOM_MEDIA_${chapterId}_${Date.now()}`,
    };
    const next = [...blocks, newBlock];
    setBlocks(next);
    saveChapterBlocks(chapterId, next);
  };

  return (
    <div className="space-y-6 my-8">
      {blocks.map((block) => (
        <ContentBlockItem
          key={block.id}
          block={block}
          onUpdateBlock={handleUpdateBlock}
          onUploadMedia={onUploadMedia}
        />
      ))}

      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={handleAddBlock}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2a0715] hover:bg-[#85182a] text-[#ffd700] hover:text-white text-xs font-mono font-bold tracking-wider uppercase border border-[#e6be6d]/40 shadow-md hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Another Story Block</span>
        </button>
      </div>
    </div>
  );
};
