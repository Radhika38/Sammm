/**
 * Secret Login Authentication Configuration
 * You can easily customize the secret password, allowed names, and special date here!
 */

export const SECRET_AUTH_CONFIG = {
  // 🔑 Secret Password: You can change this to any word/phrase you and Sammm share!
  // (e.g. 'radhika', 'cutie', 'pickleball', 'forever')
  // We accept both this primary password and common sweet variations so he doesn't get stuck!
  primaryPassword: 'radhika',
  
  // Alternative accepted passwords (case-insensitive) just in case he types:
  acceptedAlternativePasswords: [
    'radhika',
    'radhu',
    'pickleball',
    'loveyou',
    'love you',
    'future doctor',
    'dr sammm',
    'dr. sammm',
  ],

  // 👤 Allowed Names for Sammm (case-insensitive)
  allowedNames: ['sammm', 'sam', 'samm', 'sammy', 'sammmm'],

  // 📅 Our Special Date: 27/07/2026 (or flexible formats)
  specialDate: '27/07/2026',
  
  // Valid date formats accepted (normalized)
  acceptedDates: [
    '27/07/2026',
    '27-07-2026',
    '27.07.2026',
    '27 07 2026',
    '27/7/2026',
    '27-7-2026',
    '27/07/26',
    '27-07-26',
  ],
};

/**
 * Validates the user's login attempt
 */
export function validateSecretLogin(name: string, date: string, password: string, promised: boolean): {
  isValid: boolean;
  errorField?: 'name' | 'date' | 'password' | 'promise';
  funnyMessage?: string;
} {
  const cleanName = name.trim().toLowerCase();
  const cleanDate = date.trim().replace(/\s+/g, ' ');
  const cleanPass = password.trim().toLowerCase();

  if (!promised) {
    return {
      isValid: false,
      errorField: 'promise',
      funnyMessage: "Wait! You have to check the box and promise you're actually Sammm! 😂",
    };
  }

  // Check Name
  const isNameValid = SECRET_AUTH_CONFIG.allowedNames.some(
    (allowed) => allowed.toLowerCase() === cleanName
  );
  if (!isNameValid) {
    return {
      isValid: false,
      errorField: 'name',
      funnyMessage: "Excuse me??? That's not what I call you. 😭",
    };
  }

  // Check Date
  const normalizedDate = cleanDate.replace(/-/g, '/').replace(/\./g, '/').replace(/\s/g, '/');
  const isDateValid =
    SECRET_AUTH_CONFIG.acceptedDates.some(
      (d) => d === cleanDate || d.replace(/-/g, '/').replace(/\./g, '/') === normalizedDate
    ) ||
    normalizedDate === '27/07/2026' ||
    normalizedDate === '27/7/2026' ||
    normalizedDate === '27/07/26';

  if (!isDateValid) {
    return {
      isValid: false,
      errorField: 'date',
      funnyMessage: 'Bro... our own date? Seriously? 😂',
    };
  }

  // Check Password
  const isPasswordValid =
    cleanPass === SECRET_AUTH_CONFIG.primaryPassword.toLowerCase() ||
    SECRET_AUTH_CONFIG.acceptedAlternativePasswords.some((p) => p.toLowerCase() === cleanPass);

  if (!isPasswordValid) {
    return {
      isValid: false,
      errorField: 'password',
      funnyMessage: 'Nice try, detective. 👀',
    };
  }

  return { isValid: true };
}
