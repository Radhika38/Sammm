export interface TransitionNote {
  id: string;
  fromChapter: number; // 0 means any preceding chapter
  toChapter: number;
  title: string;
  note: string;
  sender: string;
  emoji: string;
  enabled: boolean;
  themeColor: 'rose' | 'gold' | 'sky' | 'amber' | 'emerald';
}

export const DEFAULT_TRANSITION_NOTES: TransitionNote[] = [
  {
    id: 'note-1-2',
    fromChapter: 1,
    toChapter: 2,
    title: 'Hold on, Sammm...',
    note: 'Before turning the page, just know I still giggle thinking about how shy you were on that pickleball court! Let’s see what happened next…',
    sender: 'Radhika 💕',
    emoji: '🎾',
    enabled: true,
    themeColor: 'rose',
  },
  {
    id: 'note-2-3',
    fromChapter: 2,
    toChapter: 3,
    title: 'A Whisper for You...',
    note: 'The Mahudi and Bhavnath trips showed me who you truly are. You were quietly becoming my favorite human and my safe place.',
    sender: 'Radhika 💕',
    emoji: '🏔️',
    enabled: true,
    themeColor: 'gold',
  },
  {
    id: 'note-3-4',
    fromChapter: 3,
    toChapter: 4,
    title: '31st May Ahead 🏏',
    note: 'The day of the match, street food, and the moment you decided to stay beside me even when my world was chaotic. Ready to relive this?',
    sender: 'Radhika 💕',
    emoji: '❤️',
    enabled: true,
    themeColor: 'rose',
  },
  {
    id: 'note-4-5',
    fromChapter: 4,
    toChapter: 5,
    title: 'Before the Next Chapter...',
    note: 'Every relationship has moments of uncertainty. But look where we are today! Our story only grew stronger from here.',
    sender: 'Radhika 💕',
    emoji: '🌧️',
    enabled: true,
    themeColor: 'sky',
  },
  {
    id: 'note-5-6',
    fromChapter: 5,
    toChapter: 6,
    title: 'Movie Time! 🎬',
    note: 'Do you remember sitting next to each other during "Obsession"? My heart was beating so loud I thought you could hear it!',
    sender: 'Radhika 💕',
    emoji: '🍿',
    enabled: true,
    themeColor: 'amber',
  },
  {
    id: 'note-6-7',
    fromChapter: 6,
    toChapter: 7,
    title: 'Warning: Blushing Ahead! 🙈',
    note: 'Get ready... the next chapter holds the confession and the moment everything became official between us.',
    sender: 'Radhika 💕',
    emoji: '💌',
    enabled: true,
    themeColor: 'rose',
  },
  {
    id: 'note-7-8',
    fromChapter: 7,
    toChapter: 8,
    title: 'Our Scrapbook Memory Vault 📸',
    note: 'All our candid, stupid, cute, and favorite moments captured together. Get ready to smile at our memories!',
    sender: 'Radhika 💕',
    emoji: '✨',
    enabled: true,
    themeColor: 'gold',
  },
  {
    id: 'note-8-9',
    fromChapter: 8,
    toChapter: 9,
    title: 'Open with Your Heart...',
    note: 'The next page is a handwritten letter just for you. Take a slow, deep breath before reading it.',
    sender: 'Radhika 💕',
    emoji: '📜',
    enabled: true,
    themeColor: 'rose',
  },
  {
    id: 'note-9-10',
    fromChapter: 9,
    toChapter: 10,
    title: 'Doctor Sammm On Duty! 🩺',
    note: 'To the future doctor who cures everyone with his care and cures me with his smile. Look what Dr. Radhika prescribed for you!',
    sender: 'Radhika 💕',
    emoji: '👨‍⚕️',
    enabled: true,
    themeColor: 'emerald',
  },
  {
    id: 'note-10-11',
    fromChapter: 10,
    toChapter: 11,
    title: 'The Final Surprise Awaits! 🎁',
    note: 'You reached the grand finale of our storybook! But wait... Radhika has one last grand surprise waiting for you inside.',
    sender: 'Radhika 💕',
    emoji: '💖',
    enabled: true,
    themeColor: 'gold',
  },
];

const LOCAL_STORAGE_KEY = 'sammm_radhika_transition_notes_v1';

export function loadTransitionNotes(): TransitionNote[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load transition notes from localStorage', e);
  }
  return DEFAULT_TRANSITION_NOTES;
}

export function saveTransitionNotes(notes: TransitionNote[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save transition notes to localStorage', e);
  }
}
