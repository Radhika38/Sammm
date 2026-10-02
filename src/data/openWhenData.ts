export interface OpenWhenEnvelope {
  id: string;
  envelopeNumber: string;
  title: string;
  tag: string;
  subtitle: string;
  theme: {
    bgGradient: string;
    border: string;
    accentColor: string;
    sealColor: string;
    sealText: string;
  };
  salutation: string;
  guidingNote: string;
  coreLetter: string[];
  gujaratiPunchline?: string;
  interactiveFeature: 'breathing' | 'prescription' | 'memory-randomizer' | 'make-up-hug';
}

export const OPEN_WHEN_ENVELOPES: OpenWhenEnvelope[] = [
  {
    id: 'overthinking-2am',
    envelopeNumber: 'Envelope No. 01',
    title: 'Open when you’re overthinking & anxious at 2 AM',
    tag: '2 AM Anxiety & Deep Thoughts',
    subtitle: 'When the world is quiet and your brain refuses to switch off',
    theme: {
      bgGradient: 'from-[#140a24] via-[#211038] to-[#0c0517]',
      border: 'border-[#795290]/50',
      accentColor: '#c084fc',
      sealColor: '#581c87',
      sealText: '🌙 2 AM',
    },
    salutation: 'My dearest overthinker,',
    guidingNote: 'First rule of 2 AM: Drop your shoulders. Unclench your jaw. Take a slow, deep breath.',
    coreLetter: [
      'If you are opening this right now, I know that familiar heavy silence in your room. Your mind is probably replaying five different scenarios, worrying about things that haven’t even happened, or questioning your own decisions.',
      'So let me be the voice in your head right now to tell you:',
      'You don’t have to carry the entire universe on your shoulders tonight.',
      'Whatever went wrong today, it’s done. Whatever is coming tomorrow, we will handle it when tomorrow comes.',
      'You are doing so much better than you give yourself credit for. I see how hard you try, how deeply you care, and how genuine your heart is.',
      'Whenever life feels too heavy, remember you have a safe home in me. Always.',
    ],
    gujaratiPunchline: '“BAS KAR SAMMM, AATLU TENSION NA LE.” 😭❤️',
    interactiveFeature: 'breathing',
  },
  {
    id: 'medical-exams',
    envelopeNumber: 'Envelope No. 02',
    title: 'Open when studying for medical exams feels impossible',
    tag: 'Future Dr. Sammm 🩺',
    subtitle: 'When textbooks feel endless, energy is zero, and self-doubt creeps in',
    theme: {
      bgGradient: 'from-[#071f1e] via-[#0d2e2c] to-[#051413]',
      border: 'border-[#14b8a6]/40',
      accentColor: '#2dd4bf',
      sealColor: '#0f766e',
      sealText: '🩺 Rx',
    },
    salutation: 'To My Future Brilliant Doctor,',
    guidingNote: 'A medical degree is tough because you are being trained to save lives. You are built for this.',
    coreLetter: [
      'I know today felt grueling. I know how heavy the syllabus is, how exhausting the revisions are, and how quiet the struggle can be when everyone else thinks you have it all under control.',
      'When you look at that thick stack of medical books and doubt your own ability, please close your eyes and borrow my belief in you for a minute.',
      'I believe in your brain. I believe in your work ethic. I believe in your heart.',
      'All these sleepless nights, hard-earned concepts, and sacrifice aren’t going to waste. They are shaping the doctor whose patients will say, “Thank God I found Dr. Sammm.”',
      'And whenever you feel tired, remember my promise:',
      'On the day you put that white coat on and hold your degree, I am going to look at you with tears in my eyes and the biggest proudest smile saying:',
    ],
    gujaratiPunchline: '“Maine bola tha na, tu kar lega. Tu doctor bani ne j raissss!” 🩺🥹❤️',
    interactiveFeature: 'prescription',
  },
  {
    id: 'miss-me',
    envelopeNumber: 'Envelope No. 03',
    title: 'Open when you miss me',
    tag: 'Love & Longing ❤️',
    subtitle: 'When schedules are crazy and you just want my presence',
    theme: {
      bgGradient: 'from-[#2e0915] via-[#420f1f] to-[#1c040b]',
      border: 'border-[#ff577d]/40',
      accentColor: '#ff7597',
      sealColor: '#85182a',
      sealText: '❤️ US',
    },
    salutation: 'My favourite boy,',
    guidingNote: 'Distance and busy days are temporary. The way my heart chooses you is forever.',
    coreLetter: [
      'If you’re opening this right now, chances are I’m already missing you too.',
      'I miss your random calls. I miss your laugh when we joke about things that aren’t even funny. I miss annoying you and hearing you complain about it.',
      'Whenever you wish I was there with you, close your eyes for five seconds. Picture my hand in yours, and remember how fiercely you are loved.',
      'You are not just a part of my day; you are the reason my day feels special.',
      'No matter how hectic life gets, you will always be my favourite person to come home to.',
    ],
    gujaratiPunchline: '“Mare same tu badhu kahi sakis. I miss you too, Sammm.” ❤️',
    interactiveFeature: 'memory-randomizer',
  },
  {
    id: 'had-a-fight',
    envelopeNumber: 'Envelope No. 04',
    title: 'Open when we had a fight',
    tag: 'Making Up & Honesty 🫂',
    subtitle: 'When words went wrong, pride flared up, or silence feels heavy',
    theme: {
      bgGradient: 'from-[#2b1208] via-[#3d1a0c] to-[#180903]',
      border: 'border-[#ea580c]/40',
      accentColor: '#fb923c',
      sealColor: '#9a3412',
      sealText: '🕊️ PEACE',
    },
    salutation: 'Hey… listen to me for a moment,',
    guidingNote: 'We are on the SAME team. Always. It’s not You vs Me; it’s You & Me vs The Problem.',
    coreLetter: [
      'I know things might feel tense right now. Maybe one of us got defensive, maybe words came out sharper than intended, or maybe misunderstandings happened.',
      'Before you let anger settle in, remember this simple truth:',
      'I am never fighting against you. I only fight because you matter to me more than anything.',
      'I don’t want to go to sleep with cold silence between us. I don’t want either of us to overthink and question where we stand.',
      'Love is not about never disagreeing. It is about knowing that no matter how messy an argument gets, we don’t let go of each other’s hand.',
      'Mari same kyarey mind games na ramto. Drop your pride, I’m dropping mine right now. Let’s talk.',
    ],
    gujaratiPunchline: '“Chal, fight bandh karie. Let me hear your voice.” ❤️',
    interactiveFeature: 'make-up-hug',
  },
];

export const MISS_YOU_REASONS = [
  'Remember when we played pickleball and you were pretending not to be shy? Look where we ended up! 😂',
  'I miss your 2 AM voice when you are half-asleep but still want to keep talking.',
  'I miss when you try to act tough and then five seconds later become the sweetest softest boy.',
  'I miss our inside jokes that literally nobody else on this planet would ever understand.',
  'Remember RCB winning on May 31st and how happy you were? That smile was everything.',
  'I miss the way you tell me random facts with so much excitement.',
  'You don’t have to do anything grand. Just having you around makes everything 100x better.',
  'Remember our first movie together? You were so nervous pretending you were cool! 🍿',
  'I miss you every time something funny happens and my first instinct is to message you.',
  'Just a gentle reminder: You are my safe person, my priority, and my favourite human.',
];

export const STUDY_PEPTALKS = [
  '“Doctor Sammm, every page you turn today is a life you will save tomorrow.” 🩺',
  '“Take a 5-minute break, stretch, drink water. Your brain is a muscle, let it recharge.”',
  '“Stethoscope around your neck, white coat on your shoulders. Visualize that picture right now.”',
  '“Don’t let one difficult chapter make you forget that you are exceptionally smart.”',
  '“Proud of you for not quitting, even on the days you feel completely burnt out.”',
];
