export type Lang = 'en' | 'ar'

export const strings = {
  en: {
    heroTitle: 'Hacking Attacks & Hacker Types',
    heroDesc: 'Explore core attack vectors and hacker profiles with concise summaries and tags. Use this as a learning path companion to your terminal CTFs.',
    tabAttacks: 'Attacks',
    tabHackers: 'Hackers',
    casesTitle: 'Real‑Life Cases',
    switchLabel: 'Language',
  },
  ar: {
    heroTitle: 'أنواع الهجمات وأنواع المخترقين',
    heroDesc: 'استكشف متجهات الهجمات وأنواع المخترقين مع ملخصات وعلامات موجزة. استخدمها كمسار تعلم إلى جانب تحديات CTF.',
    tabAttacks: 'الهجمات',
    tabHackers: 'المخترقون',
    casesTitle: 'حالات واقعية',
    switchLabel: 'اللغة',
  },
} as const