/**
 * Robust Persistent Media & Chapter Storage Engine (IndexedDB + Compression)
 * Solves the browser 5MB localStorage limit and QuotaExceededError.
 * IndexedDB provides 500MB+ of persistent storage for photos & videos.
 */

const DB_NAME = 'sammm_radhika_media_vault_v1';
const DB_VERSION = 2;
const STORE_MEDIA = 'media_config';
const STORE_CHAPTER_BLOCKS = 'chapter_blocks';
const STORE_SCRAPBOOK = 'scrapbook_cards';
const STORE_VAULT = 'vault_items';

class PersistentMediaStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_MEDIA)) {
          db.createObjectStore(STORE_MEDIA);
        }
        if (!db.objectStoreNames.contains(STORE_CHAPTER_BLOCKS)) {
          db.createObjectStore(STORE_CHAPTER_BLOCKS);
        }
        if (!db.objectStoreNames.contains(STORE_SCRAPBOOK)) {
          db.createObjectStore(STORE_SCRAPBOOK);
        }
        if (!db.objectStoreNames.contains(STORE_VAULT)) {
          db.createObjectStore(STORE_VAULT);
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.dbPromise;
  }

  /**
   * Automatically compress an image DataURL before saving to prevent memory bloat
   */
  async compressImageIfNeeded(dataUrl: string, maxWidth = 1600, quality = 0.85): Promise<string> {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      return dataUrl; // return video or external URL unchanged
    }

    // If small (< 300KB), no need to compress
    if (dataUrl.length < 400 * 1024) {
      return dataUrl;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Try WebP first, fallback to JPEG
        try {
          const webp = canvas.toDataURL('image/webp', quality);
          if (webp.startsWith('data:image/webp') && webp.length < dataUrl.length) {
            resolve(webp);
            return;
          }
        } catch {
          // fallback
        }

        const jpeg = canvas.toDataURL('image/jpeg', quality);
        resolve(jpeg.length < dataUrl.length ? jpeg : dataUrl);
      };

      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  // 1. MEDIA CONFIG (Global photos & voice notes)
  async saveMedia(key: string, value: string): Promise<void> {
    try {
      const processed = await this.compressImageIfNeeded(value);
      const db = await this.getDB();
      const tx = db.transaction(STORE_MEDIA, 'readwrite');
      const store = tx.objectStore(STORE_MEDIA);
      store.put(processed, key);

      // Also try saving a lightweight reference or fallback in localStorage
      try {
        const saved = localStorage.getItem('sammm_radhika_media_v2');
        const parsed = saved ? JSON.parse(saved) : {};
        // If not huge, save in localStorage too as quick cache
        if (processed.length < 500 * 1024) {
          parsed[key] = processed;
          localStorage.setItem('sammm_radhika_media_v2', JSON.stringify(parsed));
        }
      } catch {
        // ignore localStorage quota errors since IndexedDB has it safely!
      }
    } catch (e) {
      console.warn('IndexedDB saveMedia fallback:', e);
      try {
        const saved = localStorage.getItem('sammm_radhika_media_v2');
        const parsed = saved ? JSON.parse(saved) : {};
        parsed[key] = value;
        localStorage.setItem('sammm_radhika_media_v2', JSON.stringify(parsed));
      } catch {}
    }
  }

  async getAllMedia(): Promise<Record<string, string>> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_MEDIA, 'readonly');
        const store = tx.objectStore(STORE_MEDIA);
        const result: Record<string, string> = {};

        const req = store.openCursor();
        req.onsuccess = (e) => {
          const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            result[String(cursor.key)] = cursor.value;
            cursor.continue();
          } else {
            resolve(result);
          }
        };
        req.onerror = () => resolve({});
      });
    } catch {
      return {};
    }
  }

  // 2. CHAPTER CONTENT BLOCKS (Including Chapter 4 Video!)
  async saveChapterBlocks(chapterId: string, blocks: any[]): Promise<void> {
    try {
      // Compress any photo blocks
      const processedBlocks = await Promise.all(
        blocks.map(async (block) => {
          if (block.mediaUrl && block.mediaUrl.startsWith('data:image')) {
            const compressed = await this.compressImageIfNeeded(block.mediaUrl);
            return { ...block, mediaUrl: compressed };
          }
          return block;
        })
      );

      const db = await this.getDB();
      const tx = db.transaction(STORE_CHAPTER_BLOCKS, 'readwrite');
      const store = tx.objectStore(STORE_CHAPTER_BLOCKS);
      store.put(processedBlocks, chapterId);

      // Best effort localStorage cache (stripping huge video if quota exceeded)
      try {
        localStorage.setItem(`story_chapter_blocks_v1_${chapterId}`, JSON.stringify(processedBlocks));
      } catch {
        // If quota exceeded in localStorage, strip heavy media from localStorage only
        // IndexedDB keeps full resolution video intact!
        try {
          const lightweight = processedBlocks.map((b) => ({
            ...b,
            mediaUrl: b.mediaUrl && b.mediaUrl.length > 500 * 1024 ? '' : b.mediaUrl,
          }));
          localStorage.setItem(`story_chapter_blocks_v1_${chapterId}`, JSON.stringify(lightweight));
        } catch {}
      }
    } catch (e) {
      console.error('Failed saving chapter blocks to IndexedDB:', e);
    }
  }

  async getChapterBlocks(chapterId: string): Promise<any[] | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_CHAPTER_BLOCKS, 'readonly');
        const store = tx.objectStore(STORE_CHAPTER_BLOCKS);
        const req = store.get(chapterId);
        req.onsuccess = () => {
          if (req.result && Array.isArray(req.result) && req.result.length > 0) {
            resolve(req.result);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  // 3. SCRAPBOOK POLAROID CARDS (Chapter 8)
  async saveScrapbookCards(cards: any[]): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_SCRAPBOOK, 'readwrite');
      const store = tx.objectStore(STORE_SCRAPBOOK);
      store.put(cards, 'all_cards');

      try {
        localStorage.setItem('radhika_scrapbook_cards_v2', JSON.stringify(cards));
      } catch {
        // Ignore localStorage quota, IndexedDB has it safe!
      }
    } catch (e) {
      console.error('Failed to save scrapbook to IndexedDB:', e);
    }
  }

  async getScrapbookCards(): Promise<any[] | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_SCRAPBOOK, 'readonly');
        const store = tx.objectStore(STORE_SCRAPBOOK);
        const req = store.get('all_cards');
        req.onsuccess = () => {
          if (req.result && Array.isArray(req.result)) {
            resolve(req.result);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  // 4. VAULT MEDIA ITEMS (Gallery Vault)
  async saveVaultItems(items: any[]): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_VAULT, 'readwrite');
      const store = tx.objectStore(STORE_VAULT);
      store.put(items, 'all_vault_items');
    } catch (e) {
      console.error('Failed to save vault items to IndexedDB:', e);
    }
  }

  async getVaultItems(): Promise<any[] | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_VAULT, 'readonly');
        const store = tx.objectStore(STORE_VAULT);
        const req = store.get('all_vault_items');
        req.onsuccess = () => {
          if (req.result && Array.isArray(req.result)) {
            resolve(req.result);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  // 5. FULL BACKUP EXPORT & IMPORT (Cross-device transfer)
  async exportFullBackup(): Promise<string> {
    const allMedia = await this.getAllMedia();
    const scrapbook = (await this.getScrapbookCards()) || [];

    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      appName: 'Radhika_Sammm_LoveStory',
      media: allMedia,
      scrapbook,
      localStorageBackup: { ...localStorage },
    };

    return JSON.stringify(backupData, null, 2);
  }

  async importFullBackup(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !data.appName) return false;

      // Restore media to IndexedDB
      if (data.media) {
        for (const [key, val] of Object.entries(data.media)) {
          if (typeof val === 'string') {
            await this.saveMedia(key, val);
          }
        }
      }

      // Restore scrapbook
      if (data.scrapbook && Array.isArray(data.scrapbook)) {
        await this.saveScrapbookCards(data.scrapbook);
      }

      // Restore localStorage keys
      if (data.localStorageBackup) {
        for (const [key, val] of Object.entries(data.localStorageBackup)) {
          if (typeof val === 'string') {
            try {
              localStorage.setItem(key, val);
            } catch {}
          }
        }
      }

      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
}

export const persistentMediaStorage = new PersistentMediaStorage();
