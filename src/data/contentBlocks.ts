/**
 * Universal Content Block Data & Storage
 * Enables dynamic, customizable content blocks for Chapter 01 through Chapter 10.
 * Users can easily toggle between photo slots, video containers, and custom text areas.
 */

export type ContentBlockType = 'photo' | 'video' | 'text' | 'media-with-text';

export interface ContentBlockData {
  id: string;
  type: ContentBlockType;
  title: string;
  body: string;
  subtitle?: string;
  badge?: string;
  mediaKey: string;
  mediaUrl?: string;
  aspectRatio?: '16/9' | '4/3' | 'square' | '9/16' | 'auto';
  objectFit?: 'cover' | 'contain';
}

import { persistentMediaStorage } from '../services/persistentMediaStorage';

const STORAGE_PREFIX = 'story_chapter_blocks_v1_';

export function loadChapterBlocks(chapterId: string, defaultBlocks: ContentBlockData[]): ContentBlockData[] {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${chapterId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load blocks for chapter', chapterId, e);
  }
  return defaultBlocks;
}

export async function loadChapterBlocksAsync(
  chapterId: string,
  defaultBlocks: ContentBlockData[]
): Promise<ContentBlockData[]> {
  try {
    const indexed = await persistentMediaStorage.getChapterBlocks(chapterId);
    if (indexed && Array.isArray(indexed) && indexed.length > 0) {
      return indexed;
    }
  } catch {}
  return loadChapterBlocks(chapterId, defaultBlocks);
}

export function saveChapterBlocks(chapterId: string, blocks: ContentBlockData[]): void {
  // 1. Save to high-capacity IndexedDB (500MB+ for videos and full photos)
  persistentMediaStorage.saveChapterBlocks(chapterId, blocks);

  // 2. Best-effort lightweight localStorage cache
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${chapterId}`, JSON.stringify(blocks));
  } catch (e) {
    console.warn('LocalStorage quota exceeded (safely stored in IndexedDB):', e);
  }
}
