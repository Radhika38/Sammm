import React, { useState } from 'react';
import { Heart, Sparkles, Mail, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { sound } from '../services/soundEffects';

export const FinalLetter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleLetter = () => {
    sound.playClick();
    if (!isOpen) {
      sound.playEnvelopeOpen();
    }
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl mx-auto w-full my-12 text-left relative"
    >
      {/* Decorative Outer Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#85182a] via-[#e6be6d]/60 to-[#85182a] rounded-3xl blur-md opacity-40 pointer-events-none" />

      <div className="relative bg-[#fbf6ed] text-[#241219] border-2 border-[#dfcfb9] rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#85182a] via-[#a32238] to-[#6b1422] text-[#fffdfa] px-6 sm:px-8 py-4 flex items-center justify-between border-b border-[#c4324f]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fbf6ed] text-[#85182a] flex items-center justify-center font-serif-romantic font-bold text-sm shadow-md">
              S ❤️ R
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#e6be6d] font-bold block">
                The Final Letter
              </span>
              <h3 className="font-serif-romantic text-lg sm:text-xl font-bold tracking-tight text-white">
                One Last Letter For My Sammm
              </h3>
            </div>
          </div>

          <button
            onClick={toggleLetter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/25 hover:bg-black/40 text-xs font-mono text-[#fbe3b5] transition-colors border border-white/15 cursor-pointer"
          >
            <span>{isOpen ? 'Fold' : 'Unfold'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Letter Body */}
        {isOpen && (
          <div className="p-6 sm:p-12 space-y-6 text-[#29131d] font-sans leading-relaxed selection:bg-[#85182a] selection:text-white animate-fade-in">
            {/* Salutation */}
            <div>
              <h2 className="font-handwriting text-3xl sm:text-4xl text-[#85182a] font-bold">
                My Sammm,
              </h2>
            </div>

            <p className="font-serif-romantic text-lg sm:text-xl text-[#3b1725] italic leading-relaxed">
              I don’t think I’ll ever be able to properly explain how much you mean to me.
            </p>

            <p className="text-base sm:text-lg">
              Kabhi kabhi mujhe khud samajh nahi aata ki ek insaan mere liye itna important kaise ho gaya.
            </p>

            <div className="py-1">
              <span className="font-serif-romantic text-xl sm:text-2xl text-[#85182a] font-bold block">
                But you are.
              </span>
              <span className="text-sm font-semibold text-stone-600 block mt-0.5">A lot.</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#f5ebd9] border border-[#e2d0b5] space-y-2">
              <p className="font-serif-romantic text-lg text-[#85182a] font-semibold">
                You are not just someone I love.
              </p>
              <p className="text-base text-[#2e1420]">
                You are someone I feel safe with.
              </p>
              <p className="text-base text-[#2e1420]">
                Someone I want to tell everything to.
              </p>
              <p className="text-base text-[#2e1420]">
                Someone I look for when I’m happy, when I’m upset, when I’m confused, and even when I have absolutely nothing to say.
              </p>
            </div>

            <div className="space-y-1.5 text-base sm:text-lg">
              <p className="font-semibold text-[#85182a]">
                And honestly, I love having you in my life.
              </p>
              <p>I love your presence.</p>
              <p>I love talking to you.</p>
              <p>I love annoying you.</p>
              <p>I love when you tell me random things.</p>
              <p>I love your stupid little habits.</p>
              <p>I love the way you overthink everything. 😂</p>
            </div>

            <div className="p-4 rounded-xl bg-[#fae5e9] border border-[#f2bac4] text-center space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                Even though sometimes I really want to say:
              </span>
              <p className="font-handwriting text-2xl sm:text-3xl text-[#85182a] font-bold">
                “BAS KAR SAMMM, AATLU TENSION NA LE.” 😭
              </p>
            </div>

            <p className="text-base sm:text-lg">
              But that’s also something I love about you. Because I know how much you care.
            </p>

            <div className="space-y-3">
              <p className="font-serif-romantic text-lg sm:text-xl text-[#3d1827] italic">
                And I wish you could see yourself the way I see you.
              </p>
              <p className="text-base sm:text-lg text-stone-700">
                Because sometimes you doubt yourself so much… and I genuinely don’t understand why.
              </p>
              <p className="font-serif-romantic text-2xl sm:text-3xl text-[#85182a] font-extrabold">
                Tu best che, Sammm.
              </p>
            </div>

            {/* Permissions / Safe Haven block */}
            <div className="bg-[#f5ecdd] p-5 rounded-2xl border border-[#ded0bb] space-y-2 text-stone-800">
              <p className="font-semibold text-[#85182a]">You don’t have to be perfect.</p>
              <p>You don’t have to have everything figured out.</p>
              <p>You don’t have to always be strong.</p>
              <p className="italic">
                You can be tired. You can be confused. You can have bad days.
              </p>
              <p>You can tell me when you’re scared. You can tell me when you’re not okay.</p>
              <p className="font-handwriting text-2xl text-[#85182a] font-bold pt-1">
                Mare same tu badhu kahi sakis.
              </p>
            </div>

            <div className="space-y-2 text-base sm:text-lg">
              <p className="font-serif-romantic text-lg sm:text-xl text-[#2a121c] font-semibold">
                I don’t want a perfect version of you.
              </p>
              <p className="text-[#85182a] font-bold text-xl sm:text-2xl font-serif-romantic">
                I want the real you.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs sm:text-sm font-medium text-stone-700">
                <span className="p-2 bg-[#f0e4d0] rounded-lg text-center">The happy you</span>
                <span className="p-2 bg-[#f0e4d0] rounded-lg text-center">The angry you</span>
                <span className="p-2 bg-[#f0e4d0] rounded-lg text-center">The childish you</span>
                <span className="p-2 bg-[#f0e4d0] rounded-lg text-center">The overthinking you</span>
                <span className="p-2 bg-[#f0e4d0] rounded-lg text-center">The ambitious you</span>
                <span className="p-2 bg-[#f0e4d0] rounded-lg text-center">The annoying you</span>
                <span className="p-2 bg-[#f0e4d0] rounded-lg text-center">The soft you</span>
                <span className="p-2 bg-[#85182a] text-white font-bold rounded-lg text-center">Bas tu ❤️</span>
              </div>
            </div>

            {/* Mind games & honesty */}
            <div className="p-5 rounded-2xl bg-[#fdf2f4] border border-[#f0c2cb] space-y-3">
              <p className="font-handwriting text-2xl sm:text-3xl text-[#85182a] font-bold">
                And please, one thing… Mari same kyarey mind games na ramto. 😂
              </p>
              <p className="text-stone-700 text-sm sm:text-base">
                I don’t want to guess what you’re thinking. I don’t want you to hide things from me. I don’t want unnecessary misunderstandings. I just want us to be honest with each other.
              </p>
              <p className="font-serif-romantic text-base sm:text-lg text-[#3b121e] italic">
                “Because for me, love is not about being perfect. It’s about being able to say, ‘I’m not okay,’ and knowing the other person will stay.”
              </p>
              <p className="font-bold text-[#85182a]">
                And I want to be that person for you.
              </p>
            </div>

            {/* Come to me invitations */}
            <div className="space-y-2 text-base sm:text-lg text-stone-800 border-l-4 border-[#85182a] pl-4 my-4">
              <p>Whenever life feels too heavy, <strong className="text-[#85182a]">come to me</strong>.</p>
              <p>Whenever you’re tired, <strong className="text-[#85182a]">come to me</strong>.</p>
              <p>Whenever you achieve something, <strong className="text-[#85182a]">come to me first</strong>.</p>
              <p>And whenever you feel like you’ve failed, <strong className="text-[#85182a]">please still come to me</strong>.</p>
              <p className="pt-2 text-stone-700 italic text-sm sm:text-base">
                I want to celebrate your happiness with you… and I want to sit beside you through the difficult days too.
              </p>
            </div>

            {/* Doctor Dream Anchor */}
            <div className="p-5 rounded-2xl bg-[#eaf4f4] border border-[#bcdad8] space-y-2">
              <p className="text-stone-700">
                I know you have big dreams. And I genuinely believe you can achieve them.
              </p>
              <p className="font-serif-romantic text-2xl sm:text-3xl font-extrabold text-[#115e59]">
                I know tu doctor bani ne j raissss. 🩺❤️
              </p>
              <p className="text-stone-700 text-sm sm:text-base">
                And from now until that day, I want you to know that I’m standing right beside you. I’ll support you. I’ll believe in you. I’ll remind you of how capable you are when you forget.
              </p>
              <p className="text-xs font-mono text-stone-500 italic">
                And I’ll probably irritate you throughout the process too. 😂 But I’ll be there.
              </p>
            </div>

            {/* Future Wishes */}
            <div className="space-y-3">
              <p className="font-serif-romantic text-lg sm:text-xl text-[#2e1420] font-semibold">
                I don’t know what the future will look like. But I know I want you in mine.
              </p>
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-stone-700">
                <span className="px-3 py-1 bg-[#ede0cb] rounded-full">More random calls</span>
                <span className="px-3 py-1 bg-[#ede0cb] rounded-full">More stupid conversations</span>
                <span className="px-3 py-1 bg-[#ede0cb] rounded-full">More late-night talks</span>
                <span className="px-3 py-1 bg-[#ede0cb] rounded-full">More laughing at things that aren’t even funny</span>
                <span className="px-3 py-1 bg-[#ede0cb] rounded-full">More fights that we’ll eventually forget about</span>
                <span className="px-3 py-1 bg-[#ede0cb] rounded-full">More memories</span>
                <span className="px-3 py-1 bg-[#ede0cb] rounded-full">More “I miss you”</span>
                <span className="px-3 py-1 bg-[#ede0cb] rounded-full">More “take care”</span>
                <span className="px-3 py-1 bg-[#ede0cb] rounded-full">More “reached?”</span>
                <span className="px-3 py-1 bg-[#ede0cb] rounded-full">More “goodnight”</span>
              </div>
              <p className="font-handwriting text-2xl sm:text-3xl text-[#85182a] font-bold pt-2">
                And honestly… I just want more of you.
              </p>
            </div>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
              Sometimes I wish I could make you see yourself through my eyes for just five minutes. Maybe then you’d understand why I love you this much. Maybe then you’d stop doubting yourself. Maybe then you’d realize how special you actually are to me.
            </p>

            <div className="p-5 rounded-2xl bg-[#f5ecdf] border border-[#ddccb5] space-y-2">
              <p className="font-semibold text-[#85182a]">And Sammm…</p>
              <p className="text-sm sm:text-base text-stone-700">
                I know I don’t always say everything perfectly. Sometimes I might get angry. Sometimes I might overthink. Sometimes I might act like I don’t care.
              </p>
              <p className="text-base text-[#2c121e] font-serif-romantic font-semibold">
                But please never confuse my silence or my mood with a lack of love.
              </p>
              <p className="text-sm sm:text-base text-stone-700">
                Because somewhere underneath all of it… I care about you so, so much. More than I know how to put into words.
              </p>
              <p className="text-xs font-mono text-stone-500 italic">
                And maybe that’s why I’m writing all this. Because saying “I love you” feels too small for everything I feel for you.
              </p>
            </div>

            {/* Pleading to stay */}
            <div className="space-y-3 py-2">
              <p className="font-serif-romantic text-2xl sm:text-3xl text-[#85182a] font-bold">
                So I’ll just say this—
              </p>
              <p className="font-serif-romantic text-3xl sm:text-4xl text-[#1e0a13] font-black">
                Please stay.
              </p>
              <p className="text-base sm:text-lg text-stone-700">
                Don’t ever make me feel like I’m alone in this. Don’t shut me out. Don’t hide yourself from me. Just hold my hand and let me be there. I’ll figure the rest out with you.
              </p>
            </div>

            {/* Dreams & Success */}
            <div className="p-5 rounded-2xl bg-[#f8eef2] border border-[#eec5d3] space-y-3">
              <p className="text-base sm:text-lg text-stone-800">
                And if one day you become the person you’ve always dreamed of becoming… I hope you look beside you and see me smiling at you like:
              </p>
              <p className="font-handwriting text-2xl sm:text-3xl text-[#85182a] font-bold">
                “Maine bola tha na, tu kar lega.” 🥹❤️
              </p>
              <p className="text-base sm:text-lg text-stone-800 pt-2">
                And if someday things don’t go according to plan, I’ll still be there saying:
              </p>
              <p className="font-handwriting text-2xl sm:text-3xl text-[#85182a] font-bold">
                “Chal, firse try kar.”
              </p>
              <div className="pt-2 border-t border-[#eec5d3]">
                <p className="font-serif-romantic text-lg sm:text-xl font-bold text-[#2e131d]">
                  Because I don’t just want to be there for your success. I want to be there for you.
                </p>
                <p className="text-xs font-mono text-[#85182a] uppercase tracking-wider font-semibold">
                  That’s the difference.
                </p>
              </div>
            </div>

            {/* Gratitude */}
            <div className="space-y-3">
              <p className="text-base sm:text-lg text-stone-700">
                And finally… I don’t know how I got this lucky. I don’t know what I did to deserve you. I just know that I have you now… and I don’t want to take that for granted.
              </p>
              <div className="space-y-1 text-base sm:text-lg font-medium text-[#85182a]">
                <p>So, Sammm…</p>
                <p>Thank you for being you.</p>
                <p>Thank you for being patient with me.</p>
                <p>Thank you for listening to me.</p>
                <p>Thank you for being my person.</p>
                <p>And thank you for letting me love you.</p>
              </div>
            </div>

            <div className="py-2 space-y-2">
              <p className="font-serif-romantic text-2xl sm:text-3xl font-extrabold text-[#85182a]">
                I love you.
              </p>
              <p className="text-base sm:text-lg text-stone-700">
                Not just on the good days. Not just when everything is perfect. I love you on the messy days too. And I’ll keep choosing you, again and again.
              </p>
              <p className="font-semibold text-stone-800">
                Please don’t ever doubt how much you mean to me.
              </p>
            </div>

            {/* Final Creed */}
            <div className="p-6 rounded-2xl bg-[#85182a] text-[#fffdfa] space-y-2 text-center shadow-xl">
              <span className="text-xs font-mono tracking-widest uppercase text-[#e6be6d]">
                If there is one thing I want you to be completely sure about… it’s this:
              </span>
              <div className="space-y-1 py-2 font-serif-romantic text-2xl sm:text-3xl font-bold">
                <p>You are loved.</p>
                <p>You are wanted.</p>
                <p>You are important.</p>
                <p className="text-[#e6be6d]">And you have me. ❤️</p>
              </div>
              <p className="font-mono text-sm tracking-widest uppercase text-white/80">Always.</p>
            </div>

            {/* Signature */}
            <div className="pt-6 border-t border-[#dfcfb9] text-right">
              <span className="font-handwriting text-3xl sm:text-4xl text-[#85182a] font-bold block">
                — Your girl ❤️
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
