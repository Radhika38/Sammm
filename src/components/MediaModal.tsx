import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Check,
  Image as ImageIcon,
  Sparkles,
  Volume2,
  Video,
  Film,
  Play,
  Pause,
  Trash2,
  Plus,
  Maximize2,
  Heart,
  ChevronLeft,
  ChevronRight,
  FolderHeart,
  Calendar,
  Grid,
  Layers
} from 'lucide-react';
import { sound } from '../services/soundEffects';
import { persistentMediaStorage } from '../services/persistentMediaStorage';

export interface VaultMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  caption?: string;
  date?: string;
  chapterTag?: string;
  isFavorite?: boolean;
}

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaConfig: Record<string, string>;
  onUpdateMedia: (key: string, value: string) => void;
  activeKey?: string | null;
}

const VAULT_STORAGE_KEY = 'sammm_radhika_media_vault_v3';

const INITIAL_VAULT_ITEMS: VaultMediaItem[] = [
  {
    id: 'vault-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1000&auto=format&fit=crop&q=80',
    title: 'Pickleball First Sight',
    caption: '03 May 2026 • The moment you entered the court and everything changed.',
    date: '03 May 2026',
    chapterTag: 'Chapter 01',
    isFavorite: true,
  },
  {
    id: 'vault-2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    title: 'Mahudi & Bhavnath Roadtrip',
    caption: '10 May 2026 • Long drives, quiet smiles, and your shy glances.',
    date: '10 May 2026',
    chapterTag: 'Chapter 02',
    isFavorite: true,
  },
  {
    id: 'vault-3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80',
    title: '31 May RCB Match Victory',
    caption: '31 May 2026 • Cheering together until our voices were gone.',
    date: '31 May 2026',
    chapterTag: 'Chapter 04',
    isFavorite: false,
  },
  {
    id: 'vault-4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1000&auto=format&fit=crop&q=80',
    title: 'First Movie "Obsession"',
    caption: '02 June 2026 • Popcorn, dim lights, and hearts beating fast.',
    date: '02 June 2026',
    chapterTag: 'Chapter 06',
    isFavorite: true,
  },
  {
    id: 'vault-5',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80',
    title: '27 July Confession Night',
    caption: '27 July 2026 • When unsaid feelings finally found their voice.',
    date: '27 July 2026',
    chapterTag: 'Chapter 07',
    isFavorite: true,
  },
];

export const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  mediaConfig,
  onUpdateMedia,
  activeKey = null,
}) => {
  // Tabs: 'vault' (Unlimited Photos & Videos) or 'slots' (Chapter specific photo slots)
  const [activeTab, setActiveTab] = useState<'vault' | 'slots'>(activeKey ? 'slots' : 'vault');

  // Vault Items (Unlimited Photos & Videos)
  const [vaultItems, setVaultItems] = useState<VaultMediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_VAULT_ITEMS;
  });

  // Filter / Category
  const [filterTag, setFilterTag] = useState<string>('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');

  // New Media Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<'image' | 'video'>('image');
  const [newChapterTag, setNewChapterTag] = useState('General');
  const [showAddForm, setShowAddForm] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Slideshow Theater Mode
  const [slideshowIndex, setSlideshowIndex] = useState<number | null>(null);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);

  // Chapter Slots State
  const [selectedSlotKey, setSelectedSlotKey] = useState<string>(activeKey || 'ADD_FIRST_PHOTO_HERE');
  const [slotInputUrl, setSlotInputUrl] = useState<string>('');

  useEffect(() => {
    if (activeKey) {
      setSelectedSlotKey(activeKey);
      setActiveTab('slots');
    }
  }, [activeKey]);

  useEffect(() => {
    setSlotInputUrl(mediaConfig[selectedSlotKey] || '');
  }, [selectedSlotKey, mediaConfig]);

  // Load Vault items from IndexedDB
  useEffect(() => {
    let isMounted = true;
    persistentMediaStorage.getVaultItems().then((items) => {
      if (isMounted && items && Array.isArray(items) && items.length > 0) {
        setVaultItems(items);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist Vault
  const saveVault = (items: VaultMediaItem[]) => {
    setVaultItems(items);
    persistentMediaStorage.saveVaultItems(items);
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  };

  if (!isOpen) return null;

  // Handle Multi-file Upload for Vault (Images & Videos!)
  const handleVaultMultiUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    sound.playChime();
    const newAdded: VaultMediaItem[] = [];
    let processed = 0;

    Array.from(files).forEach((file, index) => {
      const isVideo = file.type.startsWith('video');
      const reader = new FileReader();

      reader.onload = async (event) => {
        const raw = event.target?.result as string;
        const processedMedia = !isVideo
          ? await persistentMediaStorage.compressImageIfNeeded(raw)
          : raw;

        newAdded.push({
          id: `vault_${Date.now()}_${index}`,
          type: isVideo ? 'video' : 'image',
          url: processedMedia,
          title: file.name.replace(/\.[^/.]+$/, '').slice(0, 30),
          caption: `Added on ${new Date().toLocaleDateString('en-GB')}`,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          chapterTag: newChapterTag,
          isFavorite: false,
        });

        processed += 1;
        if (processed === files.length) {
          const updated = [...newAdded, ...vaultItems];
          saveVault(updated);
          setSaveSuccessNotice(`Added ${files.length} new ${files.length === 1 ? 'memory' : 'memories'}!`);
          setTimeout(() => setSaveSuccessNotice(null), 3000);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  // Add Item via Link/URL
  const handleAddViaLink = () => {
    if (!newUrl.trim()) return;

    const newItem: VaultMediaItem = {
      id: `vault_${Date.now()}`,
      type: newType,
      url: newUrl.trim(),
      title: newTitle.trim() || (newType === 'video' ? 'Our Video Clip' : 'Our Memory Photo'),
      caption: newCaption.trim() || `Added with love`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      chapterTag: newChapterTag,
      isFavorite: false,
    };

    saveVault([newItem, ...vaultItems]);
    setNewUrl('');
    setNewTitle('');
    setNewCaption('');
    setShowAddForm(false);
    sound.playChime();
    setSaveSuccessNotice('Media added successfully!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const handleDeleteVaultItem = (id: string) => {
    sound.playClick();
    const updated = vaultItems.filter((item) => item.id !== id);
    saveVault(updated);
  };

  const handleToggleFavorite = (id: string) => {
    sound.playClick();
    const updated = vaultItems.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    saveVault(updated);
  };

  // Slot handlers
  const handleSlotFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUpdateMedia(selectedSlotKey, result);
        setSlotInputUrl(result);
        sound.playChime();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSlotUrl = () => {
    onUpdateMedia(selectedSlotKey, slotInputUrl);
    sound.playChime();
    setSaveSuccessNotice('Chapter slot updated!');
    setTimeout(() => setSaveSuccessNotice(null), 2500);
  };

  const mediaSlots = [
    { key: 'ADD_FIRST_PHOTO_HERE', title: 'Chapter 01 - First Meet (Pickleball)', hint: '03 May 2026' },
    { key: 'ADD_MAHUDI_PHOTO_HERE', title: 'Chapter 02 - Mahudi Trip Postcard', hint: '10 May 2026' },
    { key: 'ADD_BHAVNATH_PHOTO_HERE', title: 'Chapter 02 - Bhavnath Trip Postcard', hint: '10 May 2026' },
    { key: 'ADD_CHAT_SCREENSHOTS_HERE', title: 'Chapter 03 - Late Night Chat / Call', hint: 'Safe Place' },
    { key: 'ADD_31_MAY_PHOTO_HERE', title: 'Chapter 04 - 31 May / RCB Match Day (Video / Reel)', hint: '31 May 2026' },
    { key: 'ADD_FIRST_MOVIE_PHOTO_HERE', title: 'Chapter 06 - First Movie "Obsession"', hint: '02 June 2026' },
    { key: 'ADD_OUR_PHOTOS_HERE_1', title: 'Chapter 08 - Scrapbook Photo 1', hint: 'Stupid Moments' },
    { key: 'ADD_OUR_PHOTOS_HERE_2', title: 'Chapter 08 - Scrapbook Photo 2', hint: 'Cute Moments' },
    { key: 'ADD_OUR_PHOTOS_HERE_3', title: 'Chapter 08 - Scrapbook Photo 3', hint: 'Random Moments' },
    { key: 'ADD_OUR_PHOTOS_HERE_4', title: 'Chapter 08 - Scrapbook Photo 4', hint: 'Favourite Memories' },
    { key: 'ADD_OUR_PHOTOS_HERE_5', title: 'Chapter 08 - Scrapbook Photo 5', hint: 'Just Us' },
    { key: 'ADD_HIS_DREAM_PHOTO_HERE', title: 'Chapter 10 - Doctor Sammm Dreams', hint: 'Stethoscope / Career' },
    { key: 'ADD_VIDEO_HERE', title: 'Special Surprise Video / Reel', hint: 'MP4 / video file' },
    { key: 'ADD_MUSIC_HERE', title: 'Background Song (Custom MP3/Audio)', hint: 'Audio link or file' },
    { key: 'ADD_VOICE_GREETING_HERE', title: 'Opening Cinematic - Voice Greeting from Radhika', hint: 'Voice recording' },
  ];

  const filteredVault = vaultItems.filter((item) => {
    const matchesTag = filterTag === 'all' || item.chapterTag === filterTag;
    const matchesType = mediaTypeFilter === 'all' || item.type === mediaTypeFilter;
    return matchesTag && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#140a13] border border-[#ff7597]/40 rounded-3xl shadow-2xl overflow-hidden text-[#f7f2ea] flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#3d1320] flex items-center justify-between bg-gradient-to-r from-[#200a18] via-[#2d0f22] to-[#200a18]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <FolderHeart className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-serif-romantic text-lg sm:text-xl font-bold tracking-wide text-[#faf2eb] flex items-center gap-2">
                Our Photo & Video Vault
                <Sparkles className="w-4 h-4 text-[#ffd700] animate-spin" />
              </h3>
              <p className="text-[11px] font-mono text-[#ff8da8]">
                Add as many photos & video clips as you want • Saved in your private album
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Media Vault"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Tabs */}
        <div className="px-5 py-2.5 border-b border-[#3d1320] bg-[#120710] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('vault');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'vault'
                  ? 'bg-gradient-to-r from-[#85182a] to-[#a32238] text-white shadow-md'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All Photos & Videos ({vaultItems.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('slots');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'slots'
                  ? 'bg-gradient-to-r from-[#85182a] to-[#a32238] text-white shadow-md'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Chapter Story Slots (15)</span>
            </button>
          </div>

          {activeTab === 'vault' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowAddForm(!showAddForm);
                }}
                className="px-3 py-1.5 rounded-full bg-[#2a0e20] hover:bg-[#3d142e] border border-[#ff7597]/40 text-xs font-mono text-pink-200 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo / Video</span>
              </button>

              {vaultItems.length > 0 && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setSlideshowIndex(0);
                    setIsPlayingSlideshow(true);
                  }}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Romantic Reel</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Success Alert Banner */}
        {saveSuccessNotice && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/60 px-5 py-2 text-xs font-mono text-emerald-200 flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccessNotice}</span>
          </div>
        )}

        {/* TAB 1: UNLIMITED PHOTO & VIDEO VAULT */}
        {activeTab === 'vault' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
            {/* Quick Upload Action Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1c0b17] via-[#240e1e] to-[#1c0b17] border border-[#ff7597]/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ff7597]/10 flex items-center justify-center text-[#ff7597]">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif-romantic font-bold text-sm text-[#faf4ee]">
                    Quick Add Multiple Photos or Video Clips
                  </h4>
                  <p className="text-xs text-stone-400">
                    Select photos or short video clips from your phone or laptop.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <label className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#85182a] to-[#a32238] hover:from-[#a32238] hover:to-[#85182a] text-white text-xs font-mono font-bold rounded-xl cursor-pointer transition-all shadow-md">
                  <Upload className="w-4 h-4" />
                  <span>Upload Files...</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleVaultMultiUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2.5 rounded-xl bg-[#2a0e20] hover:bg-[#3d142e] border border-[#ff7597]/40 text-xs font-mono text-pink-200 transition-colors cursor-pointer"
                >
                  {showAddForm ? 'Close Form' : 'Paste Link'}
                </button>
              </div>
            </div>

            {/* Add Via Link Expandable Form */}
            {showAddForm && (
              <div className="p-4 rounded-2xl bg-[#1a0a14] border border-[#ff7597]/40 space-y-3 animate-fade-in">
                <h5 className="text-xs font-mono font-bold text-[#e6be6d] uppercase tracking-wider flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Add Photo or Video URL</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-stone-400 block mb-1">Type:</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as 'image' | 'video')}
                      className="w-full bg-[#120710] border border-[#521625] rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="image">📸 Photo / Image</option>
                      <option value="video">🎥 Video Clip (MP4 / Link)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-stone-400 block mb-1">Memory Title:</label>
                    <input
                      type="text"
                      placeholder="e.g. Our Cute Laugh"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-[#120710] border border-[#521625] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-stone-400 block mb-1">Chapter Tag:</label>
                    <select
                      value={newChapterTag}
                      onChange={(e) => setNewChapterTag(e.target.value)}
                      className="w-full bg-[#120710] border border-[#521625] rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="General">General Memory</option>
                      <option value="Chapter 01">Chapter 01 (Pickleball)</option>
                      <option value="Chapter 02">Chapter 02 (Mahudi/Bhavnath)</option>
                      <option value="Chapter 04">Chapter 04 (31 May)</option>
                      <option value="Chapter 06">Chapter 06 (Movie)</option>
                      <option value="Chapter 07">Chapter 07 (Confession)</option>
                      <option value="Chapter 08">Chapter 08 (Scrapbook)</option>
                      <option value="Chapter 10">Chapter 10 (Doctor Sammm)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-stone-400 block mb-1">Direct Media URL:</label>
                  <input
                    type="text"
                    placeholder="https://... (direct image or mp4 video link)"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-[#120710] border border-[#521625] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-stone-400 block mb-1">Romantic Caption / Note:</label>
                  <input
                    type="text"
                    placeholder="What made this moment special with Sammm?"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full bg-[#120710] border border-[#521625] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-stone-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddViaLink}
                    className="px-4 py-2 bg-gradient-to-r from-[#85182a] to-[#a32238] text-white text-xs font-mono font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Save to Vault
                  </button>
                </div>
              </div>
            )}

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono text-stone-500 mr-1">Filter:</span>
                {['all', 'image', 'video'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      sound.playClick();
                      setMediaTypeFilter(type as any);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono capitalize transition-colors cursor-pointer ${
                      mediaTypeFilter === type
                        ? 'bg-[#ff7597]/20 border border-[#ff7597] text-[#ff8da8]'
                        : 'bg-white/5 text-stone-400 hover:bg-white/10'
                    }`}
                  >
                    {type === 'all' ? 'All Formats' : type === 'image' ? '📸 Photos' : '🎥 Videos'}
                  </button>
                ))}
              </div>

              <span className="text-[11px] font-mono text-stone-400">
                Showing {filteredVault.length} of {vaultItems.length} memories
              </span>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredVault.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl bg-[#1c0c18] border border-white/10 hover:border-[#ff7597]/60 overflow-hidden shadow-lg transition-all hover:scale-[1.02] flex flex-col"
                >
                  {/* Media Display Container */}
                  <div className="relative aspect-4/3 w-full bg-black/60 overflow-hidden">
                    {item.type === 'video' ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-black">
                        <video
                          src={item.url}
                          controls
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 text-[10px] font-mono text-sky-300 flex items-center gap-1 pointer-events-none">
                          <Film className="w-3 h-3 text-sky-400" />
                          <span>Video</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          sound.playClick();
                          setSlideshowIndex(index);
                          setIsPlayingSlideshow(true);
                        }}
                        className="w-full h-full cursor-pointer relative"
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                          <span className="text-[11px] font-mono text-white flex items-center gap-1">
                            <Maximize2 className="w-3 h-3" />
                            Click to expand
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Favorite Heart Button */}
                    <button
                      onClick={() => handleToggleFavorite(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black text-rose-400 border border-white/15 transition-transform hover:scale-110 cursor-pointer z-10"
                      title="Favorite Memory"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-300'}`}
                      />
                    </button>
                  </div>

                  {/* Caption & Metadata */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h6 className="font-serif-romantic font-bold text-xs text-[#faf2eb] truncate">
                          {item.title}
                        </h6>
                        {item.chapterTag && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-stone-300 shrink-0">
                            {item.chapterTag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed italic">
                        “{item.caption || 'A beautiful moment with you.'}”
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5 text-[10px] font-mono text-stone-400">
                      <span>{item.date || 'Memory'}</span>
                      <button
                        onClick={() => handleDeleteVaultItem(item.id)}
                        className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                        title="Delete from Vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVault.length === 0 && (
              <div className="text-center py-12 border border-dashed border-stone-800 rounded-3xl p-6">
                <ImageIcon className="w-10 h-10 text-stone-600 mx-auto mb-2" />
                <p className="text-sm font-serif-romantic text-stone-300">No photos or videos in this category yet.</p>
                <p className="text-xs text-stone-500 mt-1">Click "Upload Files" above to add your first photo or video!</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CHAPTER SPECIFIC STORY SLOTS */}
        {activeTab === 'slots' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            <p className="text-xs text-[#d8c2c8] leading-relaxed">
              Customize the exact photos, voice notes, and songs embedded inside the chapters of Sammm’s storybook.
            </p>

            {/* Slot selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#e6be6d] font-mono">
                Choose Story Slot to Personalize:
              </label>
              <select
                value={selectedSlotKey}
                onChange={(e) => {
                  sound.playClick();
                  setSelectedSlotKey(e.target.value);
                }}
                className="w-full bg-[#201019] border border-[#6b1b2d] rounded-xl px-4 py-2.5 text-sm text-[#f7f2ea] focus:outline-hidden focus:ring-2 focus:ring-[#85182a]"
              >
                {mediaSlots.map((slot) => (
                  <option key={slot.key} value={slot.key}>
                    {slot.title} ({slot.hint})
                  </option>
                ))}
              </select>
            </div>

            {/* Preview & Current Value */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#1c0f17] p-4 rounded-2xl border border-[#4a1424]">
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs text-stone-400 mb-2 font-mono">Current Slot Preview</span>
                <div className="w-48 h-48 bg-black/40 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center relative shadow-inner">
                  {mediaConfig[selectedSlotKey] ? (
                    selectedSlotKey === 'ADD_MUSIC_HERE' || selectedSlotKey === 'ADD_VOICE_GREETING_HERE' ? (
                      <div className="p-4 text-center">
                        <Volume2 className="w-10 h-10 text-[#e6be6d] mx-auto mb-2" />
                        <span className="text-xs text-stone-200 font-mono">Custom Audio Active</span>
                      </div>
                    ) : selectedSlotKey === 'ADD_VIDEO_HERE' || selectedSlotKey === 'ADD_31_MAY_PHOTO_HERE' || mediaConfig[selectedSlotKey]?.startsWith('data:video') ? (
                      <video
                        src={mediaConfig[selectedSlotKey]}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={mediaConfig[selectedSlotKey]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="p-4 text-center flex flex-col items-center">
                      <ImageIcon className="w-10 h-10 text-stone-600 mb-1" />
                      <span className="text-[11px] text-stone-400 font-mono">[{selectedSlotKey}]</span>
                      <span className="text-[10px] text-stone-500 mt-1">Default illustration active</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Input methods */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1.5 flex items-center gap-1.5 font-mono">
                    <Upload className="w-3.5 h-3.5 text-[#e6be6d]" />
                    Upload from Device:
                  </label>
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#85182a] hover:bg-[#a32237] text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-md">
                    <span>Browse File from Device...</span>
                    <input
                      type="file"
                      accept="image/*,video/*,audio/*"
                      onChange={handleSlotFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1.5 flex items-center gap-1.5 font-mono">
                    <LinkIcon className="w-3.5 h-3.5 text-[#e6be6d]" />
                    Or Paste Direct Web URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={slotInputUrl}
                      onChange={(e) => setSlotInputUrl(e.target.value)}
                      placeholder="https://... (image, video, or audio)"
                      className="flex-1 bg-[#10080e] border border-[#521625] rounded-xl px-3 py-2 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-hidden focus:ring-1 focus:ring-[#85182a]"
                    />
                    <button
                      onClick={handleSaveSlotUrl}
                      className="px-3 py-2 bg-[#42111d] hover:bg-[#611a2c] text-white text-xs font-semibold rounded-xl transition-colors border border-[#85182a] cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {mediaConfig[selectedSlotKey] && (
                  <button
                    onClick={() => {
                      onUpdateMedia(selectedSlotKey, '');
                      setSlotInputUrl('');
                      sound.playClick();
                    }}
                    className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                  >
                    Reset to default illustration
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#3d1320] bg-[#10070e] flex items-center justify-between">
          <span className="text-xs text-stone-400 font-mono italic">
            {vaultItems.length} photos & videos stored safely in your story vault.
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-gradient-to-r from-[#85182a] to-[#a32238] hover:from-[#a32238] hover:to-[#85182a] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Done & Read Story
          </button>
        </div>
      </div>

      {/* FULLSCREEN ROMANTIC SLIDESHOW THEATER MODAL */}
      {slideshowIndex !== null && vaultItems[slideshowIndex] && (
        <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 animate-fade-in">
          {/* Slideshow Top Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between text-white py-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-rose-400">❤️</span>
              <span className="font-serif-romantic font-bold text-sm">
                Memory {slideshowIndex + 1} of {vaultItems.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingSlideshow(!isPlayingSlideshow)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                {isPlayingSlideshow ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingSlideshow ? 'Pause Reel' : 'Auto Play'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setSlideshowIndex(null);
                  setIsPlayingSlideshow(false);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Slideshow Center Media */}
          <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center my-4 overflow-hidden">
            {vaultItems[slideshowIndex].type === 'video' ? (
              <video
                src={vaultItems[slideshowIndex].url}
                controls
                autoPlay
                className="max-h-[70vh] max-w-full rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={vaultItems[slideshowIndex].url}
                alt={vaultItems[slideshowIndex].title}
                className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-700"
              />
            )}

            {/* Prev / Next Arrows */}
            <button
              onClick={() => {
                sound.playClick();
                setSlideshowIndex((slideshowIndex - 1 + vaultItems.length) % vaultItems.length);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-transform hover:scale-110 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setSlideshowIndex((slideshowIndex + 1) % vaultItems.length);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-transform hover:scale-110 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Slideshow Caption & Details */}
          <div className="w-full max-w-2xl text-center pb-2">
            <h4 className="font-serif-romantic text-lg sm:text-xl font-bold text-white mb-1">
              {vaultItems[slideshowIndex].title}
            </h4>
            <p className="text-sm font-sans text-rose-200 italic max-w-lg mx-auto">
              “{vaultItems[slideshowIndex].caption}”
            </p>
            <span className="text-xs font-mono text-stone-400 mt-1 block">
              {vaultItems[slideshowIndex].date} • {vaultItems[slideshowIndex].chapterTag || 'Sammm & Radhika'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
