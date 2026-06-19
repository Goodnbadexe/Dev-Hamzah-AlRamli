import { personnelIdentity, resumeHref } from "@/lib/content/personnel"

/** Bilingual user-facing string. URLs/emails/hrefs stay outside this shape. */
export type Bilingual = { ar: string; en: string }

export const contactProfile: {
  title: Bilingual
  description: Bilingual
  responseNote: Bilingual
} = {
  title: {
    ar: "لنبدأ محادثة",
    en: "Start a conversation",
  },
  description: {
    ar: "للأمن السيبراني وأنظمة تقنية المعلومات والأتمتة ومشاريع البرمجيات وتواصل جهات التوظيف وطلبات التعاون.",
    en: "For cybersecurity, IT systems, automation, software projects, recruiter outreach, and collaboration requests.",
  },
  responseNote: {
    ar: "أفضل وسيلة للتواصل الأول: البريد الإلكتروني أو LinkedIn. اذكر الدور والمشروع والجدول الزمني والخطوة التالية المفضلة.",
    en: "Best first contact: email or LinkedIn. Include the role, project, timeline, and preferred next step.",
  },
}

export type ContactAction = {
  /** Stable key — also used to map icons in the UI. */
  key: string
  label: Bilingual
  description: Bilingual
  href: string
  value: string
  primary: boolean
}

export const contactActions: ContactAction[] = [
  {
    key: "Email Hamzah",
    label: {
      ar: "راسل حمزة",
      en: "Email Hamzah",
    },
    description: {
      ar: "الأنسب للفرص المباشرة وتفاصيل المشاريع وتواصل جهات التوظيف.",
      en: "Best for direct opportunities, project details, and recruiter outreach.",
    },
    href: `mailto:${personnelIdentity.contact.email}?subject=Opportunity%20or%20collaboration%20for%20Hamzah%20Al-Ramli`,
    value: personnelIdentity.contact.email,
    primary: true,
  },
  {
    key: "LinkedIn",
    label: {
      ar: "LinkedIn",
      en: "LinkedIn",
    },
    description: {
      ar: "الأنسب للتعارف المهني ومحادثات التوظيف.",
      en: "Best for professional introductions and hiring conversations.",
    },
    href: personnelIdentity.contact.linkedin,
    value: "linkedin.com/in/hamzah-al-ramli-505",
    primary: false,
  },
  {
    key: "GitHub",
    label: {
      ar: "GitHub",
      en: "GitHub",
    },
    description: {
      ar: "الأنسب لمراجعة الكود العام ونشاط المشاريع.",
      en: "Best for reviewing public code and project activity.",
    },
    href: personnelIdentity.contact.github,
    value: "github.com/Goodnbadexe",
    primary: false,
  },
  {
    key: "Resume",
    label: {
      ar: "السيرة الذاتية",
      en: "Resume",
    },
    description: {
      ar: "حمّل السيرة الذاتية الحالية بصيغة PDF.",
      en: "Download the current resume as a PDF.",
    },
    href: resumeHref,
    value: "hamzah-al-ramli-resume.pdf",
    primary: false,
  },
]

export const contactTopics: Bilingual[] = [
  {
    ar: "أدوار الأمن السيبراني وأنظمة تقنية المعلومات",
    en: "Cybersecurity and IT systems roles",
  },
  {
    ar: "الأتمتة وهندسة سير العمل",
    en: "Automation and workflow engineering",
  },
  {
    ar: "أعمال Next.js وReact ومنصات الويب",
    en: "Next.js, React, and web platform work",
  },
  {
    ar: "عروض الأمن والمختبرات والتعاون التقني",
    en: "Security demos, labs, and technical collaborations",
  },
]

/** Copy for the make-outreach-easy panel header. */
export const contactResponseHeader: { eyebrow: Bilingual; title: Bilingual } = {
  eyebrow: {
    ar: "أفضل صيغة رسالة",
    en: "Best message format",
  },
  title: {
    ar: "أرسل التفاصيل المفيدة أولاً",
    en: "Send the useful details first",
  },
}

/** Eyebrow label above the page title. */
export const contactEyebrow: Bilingual = {
  ar: "تواصل",
  en: "Contact",
}
