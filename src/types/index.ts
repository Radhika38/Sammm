export interface MediaItem {
  id: string;
  placeholderKey: string;
  label: string;
  category: 'first-meet' | 'mahudi' | 'bhavnath' | 'may31' | 'movie' | 'gallery' | 'doctor' | 'video';
  url: string;
  caption: string;
  aspect?: 'square' | 'portrait' | 'landscape';
}

export interface EasterEgg {
  id: string;
  title: string;
  message: string;
  chapter: number;
}
