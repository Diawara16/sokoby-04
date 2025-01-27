import { fr } from "./languages/fr";
import { en } from "./languages/en";
import { es } from "./languages/es";
import { zh } from "./languages/zh";
import { pt } from "./languages/pt";
import { de } from "./languages/de";
import { ar } from "./languages/ar";
import { ru } from "./languages/ru";
import { it } from "./languages/it";
import { nl } from "./languages/nl";

export const translations = {
  fr,
  en,
  es,
  zh,
  pt,
  de,
  ar,
  ru,
  it,
  nl,
} as const;

export const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'zh', name: '中文' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' }
];