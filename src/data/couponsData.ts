/**
 * Love Coupons for Sammm - Boyfriend Day Edition
 */

export interface LoveCoupon {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
  category: 'romantic' | 'food' | 'fun' | 'doctor';
  redeemedAt?: string; // Date string if redeemed
}

export const INITIAL_COUPONS: LoveCoupon[] = [
  {
    id: 'coupon-1',
    title: 'Emergency Head Massage & Stress Relief',
    subtitle: 'Valid after long study hours / exam stress',
    description: 'Redeem anytime you need a soothing 20-minute head & shoulder massage from Radhika with zero complaints.',
    icon: '💆‍♂️',
    badge: 'FOR DR. SAMMM 🩺',
    category: 'doctor',
  },
  {
    id: 'coupon-2',
    title: '“You Win This Argument” Wildcard',
    subtitle: 'One-time immediate surrender',
    description: 'Play this card and Radhika has to admit: “Okay Sammm, you were right and I was wrong.” (Use wisely! 😂)',
    icon: '🃏',
    badge: 'RARE WILDCARD 🏆',
    category: 'fun',
  },
  {
    id: 'coupon-3',
    title: 'Midnight Cravings On Radhika',
    subtitle: 'Pizza, fries, or Dairy Milk Silk',
    description: 'Anytime after 11 PM, call in this coupon and your favorite comfort food will be ordered or prepared for you.',
    icon: '🍕',
    badge: 'MIDNIGHT TREAT 🍫',
    category: 'food',
  },
  {
    id: 'coupon-4',
    title: '100% Unconditional Tight Hug',
    subtitle: 'No questions asked, unlimited duration',
    description: 'Whenever you feel exhausted, overwhelmed, or just miss me—instant long warm hug until you feel safe.',
    icon: '🫂',
    badge: 'UNLIMITED WARMTH ❤️',
    category: 'romantic',
  },
  {
    id: 'coupon-5',
    title: 'Pickleball Rematch Date',
    subtitle: 'Court No. 1 nostalgia',
    description: 'A 1-on-1 court rematch where Radhika cheers for every single ace and lets you show off your paddle skills.',
    icon: '🎾',
    badge: 'COURT REMATCH 🏓',
    category: 'fun',
  },
  {
    id: 'coupon-6',
    title: 'Long Drive With Old Bollywood Songs',
    subtitle: 'Windows down, city lights on',
    description: 'A peaceful late-night drive playing Arijit, KK, and Atif Aslam on repeat with your hands intertwined.',
    icon: '🚗',
    badge: 'FILMY ROMANCE ✨',
    category: 'romantic',
  },
  {
    id: 'coupon-7',
    title: 'Free Pass From Being Teased For 24h',
    subtitle: 'Zero roasting guaranteed',
    description: 'Radhika promises 24 whole hours of pure angelic sweetness without teasing your shy smiles! 😂',
    icon: '😇',
    badge: 'PEACE & QUIET 🕊️',
    category: 'fun',
  },
  {
    id: 'coupon-8',
    title: 'White Coat Celebration Dinner',
    subtitle: 'Grand future reservation',
    description: 'The moment your medical exam results or residency match drops, a royal 5-star celebration dinner on Radhika.',
    icon: '🩺',
    badge: 'FUTURE CELEBRATION 🥂',
    category: 'doctor',
  },
];
