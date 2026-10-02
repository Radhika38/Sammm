export interface DailyLoveNote {
  id: string;
  theme: 'sweet' | 'encouraging' | 'funny' | 'romantic' | 'gujarati';
  greeting: string;
  body: string;
  punchline?: string;
  quote?: string;
}

export const DAILY_LOVE_NOTES: DailyLoveNote[] = [
  {
    id: 'note-1',
    theme: 'romantic',
    greeting: 'Good morning, my favourite person ❤️',
    body: 'Just a gentle reminder before your day gets busy: out of all the people on this entire planet, you are the one my heart feels safest with.',
    quote: 'Distance or busy schedules change nothing. You are my home.',
    punchline: 'Have the best day today, Sammm. I love you!',
  },
  {
    id: 'note-2',
    theme: 'encouraging',
    greeting: 'To Future Dr. Sammm 🩺',
    body: 'I know how exhausting medical study and long hours can be. When your brain feels overloaded, take a deep breath. You are building something extraordinary with your own two hands.',
    quote: 'Every hard concept you master today will heal a patient tomorrow.',
    punchline: 'Tu doctor bani ne j raissss! Believe in yourself as much as I believe in you.',
  },
  {
    id: 'note-3',
    theme: 'funny',
    greeting: 'Hey you, yes YOU 👀',
    body: 'I was just remembering the shy boy who couldn’t look me in the eye during pickleball. How did that quiet boy become the sweetest, most talkative person in my life? 😂',
    quote: 'Best decision you ever made was not running away that day.',
    punchline: 'Still can’t believe you’re mine now.',
  },
  {
    id: 'note-4',
    theme: 'gujarati',
    greeting: 'Maru Mann Sammm ❤️',
    body: 'Tension na le. Whatever challenges you are facing today, remember you don’t have to carry them all alone.',
    quote: 'Mari same tu badhu kahi sakis. Hamesha tara sathe chu.',
    punchline: 'Bas smile karto reh, badhu saru thai jase.',
  },
  {
    id: 'note-5',
    theme: 'sweet',
    greeting: 'Thinking of your laugh today 🥰',
    body: 'Do you know what my favourite sound in the world is? It’s when you laugh so hard at something silly that you lose your breath. That sound instantly fixes whatever is bothering me.',
    quote: 'Your happiness is directly connected to mine.',
    punchline: 'Never stop smiling that handsome smile.',
  },
  {
    id: 'note-6',
    theme: 'encouraging',
    greeting: 'Pause & Breathe for 10 Seconds 🌿',
    body: 'Drop your shoulders, unclench your jaw, and let out that breath you’re holding. You are doing so much better than your overthinking mind tells you.',
    quote: 'You don’t have to prove anything to anyone. You are already enough.',
    punchline: 'Bas aatlu tension na le, my boy.',
  },
  {
    id: 'note-7',
    theme: 'romantic',
    greeting: 'Happy today, my boy 💖',
    body: 'Whenever anyone asks what love looks like, I think of the quiet moments between us—the late-night talks, the unspoken understanding, and how easy it is to be myself with you.',
    quote: 'You make loving you the easiest thing I have ever done.',
    punchline: 'Forever grateful for you.',
  },
  {
    id: 'note-8',
    theme: 'funny',
    greeting: 'Official Complaint Notice 📝',
    body: 'You are currently occupying 98% of the storage in my brain rent-free. What is your proposed payment method? Extra calls or extra hugs? 😂',
    quote: 'No refunds, no exchanges.',
    punchline: 'I’m keeping you forever anyway.',
  },
  {
    id: 'note-9',
    theme: 'encouraging',
    greeting: 'A quick dose of confidence ⚡',
    body: 'You are smarter than you think, stronger than you realize, and more loved than you could ever imagine. Go conquer whatever today brings.',
    quote: 'Proud of you today and every single day.',
    punchline: 'I’m your biggest fan, always.',
  },
  {
    id: 'note-10',
    theme: 'romantic',
    greeting: 'Remember 31 May? 🏆',
    body: 'RCB won on the field, but I won the biggest trophy of my life when I found you. Every day since then has been so much brighter because you are in it.',
    quote: 'Some dates change calendars. 31 May changed my life.',
    punchline: 'Here is to a lifetime of 31 Mays together.',
  },
  {
    id: 'note-11',
    theme: 'sweet',
    greeting: 'My Safe Haven 🕊️',
    body: 'On crazy hectic days when the world feels loud, just hearing your voice feels like wrapping myself in a warm blanket. Thank you for being my peace.',
    quote: 'In a noisy world, you are my quiet sanctuary.',
    punchline: 'Drink water and eat on time today, okay?',
  },
  {
    id: 'note-12',
    theme: 'gujarati',
    greeting: 'Wahla Sammm 🌸',
    body: 'Kaal su thase ena vichar ma aaje tension na le. Tamaro divas saras javanu che.',
    quote: 'Ek vaat yaad rakhje: Hu hamesha tari pachhad ubhi chu.',
    punchline: 'Love you so much, doctor saab!',
  },
  {
    id: 'note-13',
    theme: 'romantic',
    greeting: 'A Little Secret For Today 🤫',
    body: 'Every time my phone lights up and I see your name, my heart still skips a little beat. Just like it did on day one.',
    quote: 'You haven’t lost your magic on me. Not even a little bit.',
    punchline: 'Send me a picture of your smile today!',
  },
  {
    id: 'note-14',
    theme: 'funny',
    greeting: 'Doctor’s Order from Radhika 🩺',
    body: 'Prescription for today: Minimum 1 laugh every hour, 0 overthinking episodes, and at least one sweet message sent to your girlfriend. Strict compliance required!',
    quote: 'Side effects: Feeling loved and cherished.',
    punchline: 'Don’t make me come check your vitals! 😂',
  },
  {
    id: 'note-15',
    theme: 'sweet',
    greeting: 'Just Because I Love You 💌',
    body: 'There doesn’t need to be an occasion, a holiday, or a reason to tell you this. I love you simply because you are you—honest, caring, a little shy, and completely wonderful.',
    quote: 'Being yours is my favourite part of life.',
    punchline: 'Sending you the biggest virtual hug right now.',
  },
  {
    id: 'note-16',
    theme: 'encouraging',
    greeting: 'One Page at a Time 📖',
    body: 'When medical books look taller than a mountain, remember: you don’t have to climb the whole thing in an hour. Just one page, one concept, one question at a time.',
    quote: 'Small steady steps build brilliant doctors.',
    punchline: 'You’ve got this, my future Dr. Sammm.',
  },
  {
    id: 'note-17',
    theme: 'romantic',
    greeting: 'My Favourite Memory of Us ✨',
    body: 'I love replaying our quiet conversations in the car and those walks where we didn’t even need to talk much. Just having you next to me made everything feel right.',
    quote: 'With you, silence is never awkward. It’s sweet.',
    punchline: 'Counting down until we hang out again.',
  },
  {
    id: 'note-18',
    theme: 'sweet',
    greeting: 'You Are Doing Great 🌟',
    body: 'Even when you feel unproductive or tired, please give yourself credit for showing up. You give so much to your studies and the people around you.',
    quote: 'Be gentle with yourself today.',
    punchline: 'I see all your hard work, and I admire you so much.',
  },
  {
    id: 'note-19',
    theme: 'funny',
    greeting: 'Pickleball Reminder 🏓',
    body: 'Remember who initiated the conversation first? Exactly. Don’t ever forget you were being mister mysterious shy guy! 😂',
    quote: 'Look at you now, completely head over heels.',
    punchline: 'And I wouldn’t trade it for the world.',
  },
  {
    id: 'note-20',
    theme: 'romantic',
    greeting: 'Forever on your team 🤝',
    body: 'Whatever life throws our way—exams, busy shifts, distances, or changes—we tackle it together. You never have to face anything alone anymore.',
    quote: 'Two hearts, one team.',
    punchline: 'Right by your side, always.',
  },
];

/**
 * Deterministically get today's note based on current year and day of year.
 * Rotates smoothly across the 365 days of the year!
 */
export function getTodaysLoveNote(offsetDays = 0): { note: DailyLoveNote; dateFormatted: string; dayIndex: number } {
  const now = new Date();
  if (offsetDays !== 0) {
    now.setDate(now.getDate() + offsetDays);
  }

  // Calculate day of the year (0 to 365)
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const noteIndex = Math.abs(dayOfYear % DAILY_LOVE_NOTES.length);
  const note = DAILY_LOVE_NOTES[noteIndex];

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return { note, dateFormatted, dayIndex: dayOfYear };
}
