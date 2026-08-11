/**
 * CloudForge — i18n Core (self-contained plumbing)
 * ------------------------------------------------------------------
 * This module contains ONLY the language metadata and the tiny `makeT`
 * resolver. All actual UI text lives in `./translations.ts` as hardcoded
 * static objects bundled at build time — no JSON files, no external
 * language paths, no runtime fetches. Empty keys are impossible.
 */
import type { Language } from '@/types';

export type { Language };

/** Global language metadata used by the Header switcher and RTL handling. */
export const LANGUAGES: Array<{
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}> = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
];

export const DEFAULT_LANGUAGE: Language = 'en';

/** Resolve the document direction for a given language. */
export function getLangDir(language: Language): 'ltr' | 'rtl' {
  return language === 'ar' ? 'rtl' : 'ltr';
}

export type LangDict = Record<string, string>;

/**
 * Build a translation resolver for a language.
 * Lookup order: requested language -> English -> the key itself.
 * A rendered string is therefore ALWAYS non-empty.
 */
export function makeT(dict: Record<Language, LangDict>, language: Language) {
  return (key: string): string => {
    const langDict = dict[language];
    if (langDict && langDict[key]) return langDict[key];
    const enDict = dict.en;
    if (enDict && enDict[key]) return enDict[key];
    return key;
  };
}

export function isRtl(language: Language): boolean {
  return language === 'ar';
}
