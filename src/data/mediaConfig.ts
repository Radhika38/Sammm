import { MediaItem } from '../types';


const STATIC_MEDIA_BASE = `${import.meta.env.BASE_URL}media/`;

export const DEFAULT_MEDIA_CONFIG: Record<string, string> = {
  ADD_FIRST_PHOTO_HERE: `${STATIC_MEDIA_BASE}WhatsApp_Image_2026-09-29_at_6.47.42_PM.webp`,
  ADD_MAHUDI_PHOTO_HERE: `${STATIC_MEDIA_BASE}WhatsApp_Image_2026-09-29_at_7.06.05_PM.webp`,
  ADD_BHAVNATH_PHOTO_HERE: `${STATIC_MEDIA_BASE}WhatsApp_Image_2026-09-29_at_7.07.19_PM.webp`,
  ADD_CHAT_SCREENSHOTS_HERE: `${STATIC_MEDIA_BASE}WhatsApp_Image_2026-09-29_at_7.17.16_PM.webp`,
  ADD_31_MAY_PHOTO_HERE: `${STATIC_MEDIA_BASE}31may(1).mp4`,
  ADD_FIRST_MOVIE_PHOTO_HERE: `${STATIC_MEDIA_BASE}3aug.webp`,
  ADD_HIS_DREAM_PHOTO_HERE: `${STATIC_MEDIA_BASE}16aug.mp4`,
  ADD_VIDEO_HERE: '',
  ADD_MUSIC_HERE: '',
  ADD_VOICE_GREETING_HERE: '',
  ADD_OUR_PHOTOS_HERE_1: `${STATIC_MEDIA_BASE}WhatsApp_Image_2026-09-29_at_6.47.42_PM.webp`,
  ADD_OUR_PHOTOS_HERE_2: `${STATIC_MEDIA_BASE}31may(1).mp4`,
  ADD_OUR_PHOTOS_HERE_3: `${STATIC_MEDIA_BASE}23july.mp4`,
  ADD_OUR_PHOTOS_HERE_4: `${STATIC_MEDIA_BASE}1aug.webp`,
  ADD_OUR_PHOTOS_HERE_5: `${STATIC_MEDIA_BASE}3aug.webp`,
  ADD_OUR_PHOTOS_HERE_6: `${STATIC_MEDIA_BASE}6aug.webp`,
  ADD_OUR_PHOTOS_HERE_7: `${STATIC_MEDIA_BASE}9aug.mp4`,
  ADD_OUR_PHOTOS_HERE_8: `${STATIC_MEDIA_BASE}16aug.mp4`,
  ADD_OUR_PHOTOS_HERE_9: `${STATIC_MEDIA_BASE}17aug.webp`,
  ADD_OUR_PHOTOS_HERE_10: `${STATIC_MEDIA_BASE}18aug.webp`,
  ADD_OUR_PHOTOS_HERE_11: `${STATIC_MEDIA_BASE}22aug.webp`,
  ADD_OUR_PHOTOS_HERE_12: `${STATIC_MEDIA_BASE}23aug(1).mp4`,
  ADD_OUR_PHOTOS_HERE_13: '',
  ADD_OUR_PHOTOS_HERE_14: '',
  ADD_OUR_PHOTOS_HERE_15: '',
  ADD_OUR_PHOTOS_HERE_16: '',
};

export const DEFAULT_GALLERY_PHOTOS: {
  id: string;
  category: 'stupid' | 'cute' | 'random' | 'favourite' | 'us';
  title: string;
  subtitle: string;
  date: string;
  placeholderKey: string;
  defaultUrl: string;
  caption: string;
  rotation: number;
}[] = [
  {
    id: 'gal-1',
    category: 'stupid',
    title: 'That Goofy Candid 😂',
    subtitle: 'Glasses & Silly Pouts',
    date: 'Our Goofy Era',
    placeholderKey: 'ADD_OUR_PHOTOS_HERE_1',
    defaultUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    caption: 'You with your glasses looking serious, and me making goofy faces right beside you! Best cuddles and endless laughs. ❤️',
    rotation: -3,
  },
  {
    id: 'gal-2',
    category: 'cute',
    title: 'The Shy Smile & Riverfront Candid 🛵',
    subtitle: 'Adjusting Glasses & That Grin',
    date: 'Monsoon Ride',
    placeholderKey: 'ADD_OUR_PHOTOS_HERE_2',
    defaultUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    caption: 'Adjusting your glasses, resting by the helmet, and giving me that sweet shy smile when I hold your hand. Cutest boy ever! ❤️',
    rotation: 2.5,
  },
  {
    id: 'gal-3',
    category: 'random',
    title: 'Midnight Car Food Run 🚗🧀',
    subtitle: 'Cheesy Bites & Night Drives',
    date: 'Late Night Car Dates',
    placeholderKey: 'ADD_OUR_PHOTOS_HERE_3',
    defaultUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    caption: 'GPS on, hot cheesy street food in foil, and you looking so handsome eating with wooden spoons in the car. Best midnight dates ever! 🌙❤️',
    rotation: -1.8,
  },
  {
    id: 'gal-4',
    category: 'favourite',
    title: 'Elevator Mirror Twinning 🛗❤️',
    subtitle: 'Matching Shirts & Secret Whispers',
    date: 'Our Twinning Era',
    placeholderKey: 'ADD_OUR_PHOTOS_HERE_4',
    defaultUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    caption: 'Matching checkered shirts, your helmet in hand, whispering sweet secrets that made me blush. Arms around your shoulder, my happiest place! 🥰',
    rotation: 3.5,
  },
  {
    id: 'gal-5',
    category: 'favourite',
    title: 'Our First Kiss 💋❤️',
    subtitle: 'Sweet Cheeks & "Na Hai Yeh Paana"',
    date: 'The Most Magical Day',
    placeholderKey: 'ADD_OUR_PHOTOS_HERE_5',
    defaultUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
    caption: 'Open sky, "Na hai yeh paana na khona" in the air, a soft kiss on his cheek and him kissing me right back. The moment the whole world stopped! 👩‍❤️‍💋‍👨✨',
    rotation: -2.2,
  },
  {
    id: 'gal-6',
    category: 'cute',
    title: 'Our First Chocolate 🍫 S for Sammm',
    subtitle: 'Dairy Milk Silk & His Blue Bike',
    date: 'Sweetest Beginning',
    placeholderKey: 'ADD_OUR_PHOTOS_HERE_6',
    defaultUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    caption: 'Dairy Milk Silk with "S" for Sammm, given right on his metallic blue bike with "Sam" written on it. The sweetest chocolate and an even sweeter boy! 🍫💙✨',
    rotation: 1.5,
  },
  {
    id: 'gal-7',
    category: 'favourite',
    title: 'Roadside Chai at 2 AM',
    subtitle: 'Tea & deep talks',
    date: 'July 2026',
    placeholderKey: 'ADD_OUR_PHOTOS_HERE_7',
    defaultUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    caption: 'Two warm cups of chai, cool breeze, and talking about our dreams.',
    rotation: -3.2,
  },
  {
    id: 'gal-8',
    category: 'random',
    title: 'Movie Night Popcorn',
    subtitle: '“Obsession” memories',
    date: 'June 2026',
    placeholderKey: 'ADD_OUR_PHOTOS_HERE_8',
    defaultUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    caption: 'Sharing popcorn in the dark, wondering if you were going to hold my hand.',
    rotation: 2.8,
  },
  {
    id: 'gal-9',
    category: 'us',
    title: 'Doctor Sammm On Duty',
    subtitle: 'Cheering for my doctor',
    date: 'September 2026',
    placeholderKey: 'ADD_OUR_PHOTOS_HERE_9',
    defaultUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    caption: 'Stethoscopes, medical notes, and Radhika proudly cheering for you. 🩺',
    rotation: -1.5,
  },
];

export const EASTER_EGGS_LIST = [
  {
    id: 'egg-pickleball',
    title: 'Pickleball Plot Twist',
    triggerHint: 'Click the pickleball in Chapter 1',
    message: 'You really thought pickleball was just pickleball? 😂 Look where we ended up!',
    chapter: 1,
  },
  {
    id: 'egg-shy',
    title: 'The Silent Boy',
    triggerHint: 'Click the shy emoji in Chapter 2',
    message: 'Still shy? 👀 Or do you only talk nonstop when it is 2 AM now? 😂',
    chapter: 2,
  },
  {
    id: 'egg-rcb',
    title: 'RCB Victory Witness',
    triggerHint: 'Click the RCB badge in Chapter 4',
    message: 'Yes, I remember this day. 😂 RCB won and my favourite boy was right there beside me.',
    chapter: 4,
  },
  {
    id: 'egg-confession',
    title: '27 July Landmark',
    triggerHint: 'Click the 27 July date in Chapter 7',
    message: 'Best plot twist ever. ❤️ The moment everything changed forever.',
    chapter: 7,
  },
  {
    id: 'egg-heart',
    title: 'The Infinite Heart',
    triggerHint: 'Click the glowing heart in the Final Surprise',
    message: 'I love you again. In case you missed it. ❤️ Happy Boyfriend Day, my doctor!',
    chapter: 12,
  },
];
