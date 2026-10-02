/**
 * Couple Bucket List Data for Radhika & Sammm
 */

export interface BucketListItem {
  id: string;
  title: string;
  category: 'travel' | 'romantic' | 'food' | 'milestone';
  icon: string;
  completed: boolean;
  completedDate?: string;
  custom?: boolean;
}

export const INITIAL_BUCKET_LIST: BucketListItem[] = [
  {
    id: 'bucket-1',
    title: 'Pickleball court rematch under midnight floodlights',
    category: 'romantic',
    icon: '🎾',
    completed: true,
    completedDate: '03 May 2026',
  },
  {
    id: 'bucket-2',
    title: 'Photoshoot together wearing Dr. Sammm’s white coat & stethoscope',
    category: 'milestone',
    icon: '🩺',
    completed: false,
  },
  {
    id: 'bucket-3',
    title: 'Spontaneous late-night road trip with no maps, just Bollywood songs',
    category: 'travel',
    icon: '🚗',
    completed: false,
  },
  {
    id: 'bucket-4',
    title: 'Eat a whole bar of Dairy Milk Silk together without hands',
    category: 'food',
    icon: '🍫',
    completed: false,
  },
  {
    id: 'bucket-5',
    title: 'Watch the sunrise together after an all-night conversation',
    category: 'romantic',
    icon: '🌅',
    completed: true,
    completedDate: '27 July 2026',
  },
  {
    id: 'bucket-6',
    title: 'Cook a 3-course dinner together from scratch (and survive the mess 😂)',
    category: 'food',
    icon: '🍳',
    completed: false,
  },
  {
    id: 'bucket-7',
    title: 'Attend a live Arijit Singh / Coldplay concert holding hands',
    category: 'romantic',
    icon: '🎶',
    completed: false,
  },
  {
    id: 'bucket-8',
    title: 'A peaceful mountain cabin getaway watching rainfall together',
    category: 'travel',
    icon: '🏔️',
    completed: false,
  },
  {
    id: 'bucket-9',
    title: 'Look back at this Boyfriend Day website together on our 10th anniversary',
    category: 'milestone',
    icon: '💍',
    completed: false,
  },
];
