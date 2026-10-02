export interface BollywoodSong {
  id: string;
  title: string;
  movie: string;
  singers: string;
  year: string;
  lyricsSnippet: string;
  fullLyricsSnippet: string[];
  dedicationNote: string;
  audioUrl?: string;
  youtubeId: string;
  themeColor: string;
  melodyNotes: { note: number; dur: number; delay: number }[];
}

export const BOLLYWOOD_LOVE_SONGS: BollywoodSong[] = [
  {
    id: 'kesariya',
    title: 'Kesariya',
    movie: 'Brahmāstra',
    singers: 'Arijit Singh, Pritam',
    year: '2022',
    lyricsSnippet: 'Kesariya tera ishq hai piya, rang jaaun jo main haath lagaun…',
    fullLyricsSnippet: [
      'Kesariya tera ishq hai piya,',
      'Rang jaaun jo main haath lagaun…',
      'Din beete saare teri fikr mein,',
      'Rain saari teri khair manaun. ❤️',
    ],
    dedicationNote: 'For the one who brought every shade of gold into my life.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-romance-112194.mp3',
    youtubeId: 'BddP6PYo2gs',
    themeColor: '#e6be6d',
    melodyNotes: [
      { note: 392.00, dur: 0.35, delay: 0 },    // G4
      { note: 440.00, dur: 0.35, delay: 350 },  // A4
      { note: 493.88, dur: 0.45, delay: 700 },  // B4
      { note: 440.00, dur: 0.35, delay: 1150 }, // A4
      { note: 392.00, dur: 0.50, delay: 1500 }, // G4
      { note: 329.63, dur: 0.45, delay: 2000 }, // E4
      { note: 293.66, dur: 0.60, delay: 2450 }, // D4
      { note: 392.00, dur: 0.70, delay: 3050 }, // G4
    ],
  },
  {
    id: 'tum-hi-ho',
    title: 'Tum Hi Ho',
    movie: 'Aashiqui 2',
    singers: 'Arijit Singh, Mithoon',
    year: '2013',
    lyricsSnippet: 'Kyunki tum hi ho, ab tum hi ho, zindagi ab tum hi ho…',
    fullLyricsSnippet: [
      'Hum tere bin ab reh nahi sakte,',
      'Tere bina kya wajood mera?',
      'Tujhse juda agar ho jayenge,',
      'Toh khud se hi ho jayenge juda…',
      'Kyunki tum hi ho, ab tum hi ho, zindagi ab tum hi ho. ❤️',
    ],
    dedicationNote: 'Because no matter where we go, everything comes back to you.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=romantic-piano-10658.mp3',
    youtubeId: 'Umqb9KENgmk',
    themeColor: '#ff577d',
    melodyNotes: [
      { note: 311.13, dur: 0.4, delay: 0 },    // Eb4
      { note: 293.66, dur: 0.35, delay: 400 }, // D4
      { note: 261.63, dur: 0.45, delay: 750 }, // C4
      { note: 233.08, dur: 0.35, delay: 1200 },// Bb3
      { note: 207.65, dur: 0.4, delay: 1550 }, // Ab3
      { note: 196.00, dur: 0.7, delay: 1950 }, // G3
      { note: 261.63, dur: 0.9, delay: 2650 }, // C4
    ],
  },
  {
    id: 'apna-bana-le',
    title: 'Apna Bana Le',
    movie: 'Bhediya',
    singers: 'Arijit Singh, Sachin-Jigar',
    year: '2022',
    lyricsSnippet: 'Apna bana le piya, apna bana le piya, dil ke nagar mein shehar tu basa le piya…',
    fullLyricsSnippet: [
      'Tu mera koi na hoke bhi kuch laage,',
      'Kiya re jo bhi toone, dil pe mere chaahe…',
      'Apna bana le piya, apna bana le piya,',
      'Dil ke nagar mein shehar tu basa le piya. ❤️',
    ],
    dedicationNote: 'Back from our pickleball days to right now—you were always mine.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/11/01/audio_008d5e8659.mp3?filename=soft-romantic-acoustic-guitar-9943.mp3',
    youtubeId: 'ElZfdU54Cp8',
    themeColor: '#d4af37',
    melodyNotes: [
      { note: 293.66, dur: 0.35, delay: 0 },   // D4
      { note: 329.63, dur: 0.35, delay: 350 }, // E4
      { note: 392.00, dur: 0.45, delay: 700 }, // G4
      { note: 440.00, dur: 0.40, delay: 1150 },// A4
      { note: 493.88, dur: 0.50, delay: 1550 },// B4
      { note: 440.00, dur: 0.40, delay: 2050 },// A4
      { note: 392.00, dur: 0.80, delay: 2450 },// G4
    ],
  },
  {
    id: 'raataan-lambiyan',
    title: 'Raataan Lambiyan',
    movie: 'Shershaah',
    singers: 'Jubin Nautiyal, Asees Kaur, Tanishk Bagchi',
    year: '2021',
    lyricsSnippet: 'Kaate kate na re raataan lambiyan, sun mere dil de mehermaan…',
    fullLyricsSnippet: [
      'Teri meri gallan ho gayi mashhoor,',
      'Kar na kabhi tu mujhe nazron se door…',
      'Kaate kate na re raataan lambiyan,',
      'Chhupa lu tujhko apni baahon mein main har dum. ❤️',
    ],
    dedicationNote: 'For all those late nights on the phone when neither of us wanted to hang up.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f72c01.mp3?filename=indian-flute-lofi-12345.mp3',
    youtubeId: 'gvyUuxdRdR4',
    themeColor: '#85182a',
    melodyNotes: [
      { note: 329.63, dur: 0.35, delay: 0 },   // E4
      { note: 369.99, dur: 0.35, delay: 350 }, // F#4
      { note: 392.00, dur: 0.45, delay: 700 }, // G4
      { note: 440.00, dur: 0.35, delay: 1150 },// A4
      { note: 493.88, dur: 0.55, delay: 1500 },// B4
      { note: 440.00, dur: 0.40, delay: 2050 },// A4
      { note: 392.00, dur: 0.70, delay: 2450 },// G4
    ],
  },
  {
    id: 'tum-se-hi',
    title: 'Tum Se Hi',
    movie: 'Jab We Met',
    singers: 'Mohit Chauhan, Pritam',
    year: '2007',
    lyricsSnippet: 'Tum se hi din hota hai, surmayi shaam aati hai, tum se hi…',
    fullLyricsSnippet: [
      'Aadhe se aadhe hain hum tere bina,',
      'Poore huye hain jo tu mil gaya…',
      'Tum se hi din hota hai, surmayi shaam aati hai,',
      'Tum se hi, tum se hi… ❤️',
    ],
    dedicationNote: 'Every good thing in my day somehow feels tied to you.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=acoustic-guitars-ambient-14731.mp3',
    youtubeId: 'cbqvxbfP_q8',
    themeColor: '#ff8da8',
    melodyNotes: [
      { note: 261.63, dur: 0.4, delay: 0 },    // C4
      { note: 329.63, dur: 0.4, delay: 400 },  // E4
      { note: 392.00, dur: 0.45, delay: 800 }, // G4
      { note: 493.88, dur: 0.4, delay: 1250 }, // B4
      { note: 440.00, dur: 0.45, delay: 1650 },// A4
      { note: 392.00, dur: 0.75, delay: 2100 },// G4
    ],
  },
  {
    id: 'pehla-nasha',
    title: 'Pehla Nasha',
    movie: 'Jo Jeeta Wohi Sikandar',
    singers: 'Udit Narayan, Sadhana Sargam, Jatin-Lalit',
    year: '1992',
    lyricsSnippet: 'Pehla nasha, pehla khumaar, naya pyaar hai naya intezaar…',
    fullLyricsSnippet: [
      'Chahe tum kuch na kaho, maine sun liya,',
      'Ke saathi pyaar ka mujhe chun liya…',
      'Pehla nasha, pehla khumaar,',
      'Naya pyaar hai, naya intezaar. ❤️',
    ],
    dedicationNote: 'Classic forever. The sweet awkward start of something timeless.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=gentle-piano-love-theme-21558.mp3',
    youtubeId: '3c8X_5B9P8Y',
    themeColor: '#f7c59f',
    melodyNotes: [
      { note: 293.66, dur: 0.4, delay: 0 },    // D4
      { note: 369.99, dur: 0.4, delay: 400 },  // F#4
      { note: 440.00, dur: 0.45, delay: 800 }, // A4
      { note: 392.00, dur: 0.35, delay: 1250 },// G4
      { note: 369.99, dur: 0.45, delay: 1600 },// F#4
      { note: 329.63, dur: 0.4, delay: 2050 }, // E4
      { note: 293.66, dur: 0.8, delay: 2450 }, // D4
    ],
  },
  {
    id: 'tere-hawaale',
    title: 'Tere Hawaale',
    movie: 'Laal Singh Chaddha',
    singers: 'Arijit Singh, Shilpa Rao, Pritam',
    year: '2022',
    lyricsSnippet: 'Mainu chadh gaya ishq da rang, main saare dhang chhad ke…',
    fullLyricsSnippet: [
      'Faasle na rahein koi aaj itne qareeb aao,',
      'Main tum mein samaa jaaun, tum mujh mein samaa jaao…',
      'Mainu chadh gaya ishq da rang,',
      'Main saare dhang chhad ke tere hawaale ho gaya. ❤️',
    ],
    dedicationNote: 'Surrendering to the quiet truth that I am completely yours.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c363989c93.mp3?filename=romantic-meditation-ambient-126241.mp3',
    youtubeId: 'pvi_5j-p0_w',
    themeColor: '#ab223c',
    melodyNotes: [
      { note: 261.63, dur: 0.4, delay: 0 },    // C4
      { note: 293.66, dur: 0.35, delay: 400 }, // D4
      { note: 329.63, dur: 0.45, delay: 750 }, // E4
      { note: 392.00, dur: 0.4, delay: 1200 }, // G4
      { note: 440.00, dur: 0.5, delay: 1600 }, // A4
      { note: 392.00, dur: 0.7, delay: 2100 }, // G4
    ],
  },
];
