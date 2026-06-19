import { memoryPlan } from "@/lib/memory/plan"
import { PERSONAL_BRAND } from "@/lib/social/profiles"

/** Bilingual user-facing string. URLs/emails/hrefs/dates stay outside this shape. */
export type Bilingual = { ar: string; en: string }

export const resumeHref = "/files/hamzah-al-ramli-resume.pdf"

export const personnelIdentity = {
  name: PERSONAL_BRAND.name,
  alias: PERSONAL_BRAND.alias,
  title: PERSONAL_BRAND.title,
  tagline: PERSONAL_BRAND.tagline,
  location: PERSONAL_BRAND.location,
  summary:
    "Cybersecurity expert and creative multimedia designer — combining deep security knowledge with an eye for design and storytelling. From threat analysis and malware investigation to brand identity and full-stack builds, the work is always about making something that matters.",
  availability: "Open to cybersecurity, threat intelligence, multimedia design, and full-stack development opportunities.",
  contact: {
    email: "alramli.hamzah@gmail.com",
    phone: "+966 50 850 1717",
    linkedin: "https://www.linkedin.com/in/hamzah-al-ramli-505",
    github: "https://github.com/Goodnbadexe",
  },
}

export const experienceTimeline = memoryPlan.timeline.filter((item) =>
  item.title.toLowerCase().includes("administrator"),
)

export const educationTimeline = memoryPlan.timeline.filter((item) =>
  item.title.toLowerCase().includes("bachelor"),
)

export type Certification = {
  name: string
  issuer: string
  date: string
  credentialId?: string
  href?: string
}

export const certifications: Certification[] = [
  {
    name: "Dynamic Analyst",
    issuer: "LetsDefend",
    date: "November 2025",
    href: "https://app.letsdefend.io/my-rewards/detail/2a6c1b862a9d45578f6d41f2e5002403",
  },
  {
    name: "Malware Analyzer",
    issuer: "LetsDefend",
    date: "November 2025",
    href: "https://app.letsdefend.io/my-rewards/detail/1d8c5d1d-5905-4c6f-bd29-8850c8118fdb",
  },
  {
    name: "First Blood",
    issuer: "LetsDefend",
    date: "November 2025",
    href: "https://app.letsdefend.io/my-rewards/detail/73e9ededb1d94298b330c3a76470f2ac",
  },
  {
    name: "Google Cybersecurity Professional Certificate",
    issuer: "Google",
    date: "March 2025",
    credentialId: "YBHSSJ3B13V8",
    href: "https://www.coursera.org/account/accomplishments/professional-cert/YBHSSJ3B13V8",
  },
  {
    name: "Cybersecurity Assessment: CompTIA Security+ & CySA+",
    issuer: "IBM",
    date: "May 2025",
    credentialId: "OHC26D9YE3RX",
    href: "https://coursera.org/verify/OHC26D9YE3RX",
  },
  {
    name: "Generative AI: Boost Your Cybersecurity Career",
    issuer: "IBM",
    date: "May 2025",
    credentialId: "WLGB18GSHLCT",
    href: "https://coursera.org/verify/WLGB18GSHLCT",
  },
  {
    name: "CCNA 200-301 Network Fundamentals",
    issuer: "Simplilearn",
    date: "April 2025",
    href: "https://simplilearn.com/ccna-200-301-network-fundamentals-course-skillup",
  },
  {
    name: "Google Analytics Certification",
    issuer: "Google Digital Academy",
    date: "May 2025",
    href: "https://skillshop.credential.net/f6dd7dc8-877d-434b-b6e0-618f9ff96b5a",
  },
  {
    name: "Taylor's University Award 2024",
    issuer: "Taylor's University",
    date: "December 2024",
    href: "https://credentials.taylors.edu.my/a320a345-9d00-4aa3-b15e-25ae46231588",
  },
  {
    name: "Advanced Python Programming Professional (APPP)",
    issuer: "CASUGOL",
    date: "November 2021",
  },
]

export type CapabilityGroup = {
  /** Stable English key — used for icon/style lookup in the UI. */
  key: string
  label: Bilingual
  items: Bilingual[]
}

export const technicalCapabilities: CapabilityGroup[] = [
  {
    key: "Cybersecurity",
    label: {
      ar: "الأمن السيبراني",
      en: "Cybersecurity",
    },
    items: [
      {
        ar: "تحليل البرمجيات الخبيثة والتحقيق الديناميكي",
        en: "Malware analysis & dynamic investigation",
      },
      {
        ar: "استخبارات التهديدات وOSINT",
        en: "Threat intelligence & OSINT",
      },
      {
        ar: "أمن الشبكات (أساسيات CCNA)",
        en: "Network security (CCNA fundamentals)",
      },
      {
        ar: "إدارة الثغرات",
        en: "Vulnerability management",
      },
      {
        ar: "الاستجابة للحوادث والكشف عنها",
        en: "Incident response & detection",
      },
    ],
  },
  {
    key: "Creative & Multimedia",
    label: {
      ar: "الإبداع والوسائط المتعددة",
      en: "Creative & Multimedia",
    },
    items: [
      {
        ar: "التصميم الجرافيكي وهوية العلامة التجارية",
        en: "Graphic design & brand identity",
      },
      {
        ar: "مونتاج الفيديو — Adobe Premiere Pro، Avid",
        en: "Video editing — Adobe Premiere Pro, Avid",
      },
      {
        ar: "الرسوم المتحركة والتجارب التفاعلية",
        en: "Animation & interactive experiences",
      },
      {
        ar: "تصميم UI/UX والويب المتجاوب",
        en: "UI/UX and responsive web design",
      },
      {
        ar: "إنتاج محتوى وسائل التواصل الاجتماعي",
        en: "Social media content production",
      },
    ],
  },
  {
    key: "Development",
    label: {
      ar: "التطوير",
      en: "Development",
    },
    items: [
      {
        ar: "Next.js وReact وTypeScript",
        en: "Next.js, React, TypeScript",
      },
      {
        ar: "Python وJavaScript وJava وPHP",
        en: "Python, JavaScript, Java, PHP",
      },
      {
        ar: "iOS (Swift) وAndroid",
        en: "iOS (Swift) & Android",
      },
      {
        ar: "تطبيقات full-stack مدعومة بقواعد بيانات",
        en: "Database-backed full-stack apps",
      },
      {
        ar: "التطوير المعزز بالذكاء الاصطناعي",
        en: "AI-augmented development",
      },
    ],
  },
  {
    key: "Strategy & Tools",
    label: {
      ar: "الاستراتيجية والأدوات",
      en: "Strategy & Tools",
    },
    items: [
      {
        ar: "Google Analytics والتحليلات الرقمية",
        en: "Google Analytics & digital analytics",
      },
      {
        ar: "إدارة العلامة التجارية",
        en: "Brand management",
      },
      {
        ar: "أتمتة سير العمل (n8n، وكلاء الذكاء الاصطناعي)",
        en: "Workflow automation (n8n, AI agents)",
      },
      {
        ar: "إدارة المشاريع",
        en: "Project management",
      },
      {
        ar: "SEO واستراتيجية المحتوى",
        en: "SEO & content strategy",
      },
    ],
  },
]

export const recruiterHighlights: Bilingual[] = [
  {
    ar: "خبير أمن سيبراني بخبرة عملية في تحليل البرمجيات الخبيثة واستخبارات التهديدات وأعمال الكشف (معتمد من LetsDefend).",
    en: "Cybersecurity expert with hands-on malware analysis, threat intelligence, and detection work (LetsDefend certified).",
  },
  {
    ar: "مصمم وسائط متعددة مبدع — تصميم جرافيكي وهوية علامة تجارية وإنتاج فيديو وتجارب تفاعلية.",
    en: "Creative multimedia designer — graphic design, brand identity, video production, and interactive experiences.",
  },
  {
    ar: "مطوّر full-stack: Next.js وReact وPython وiOS/Android — يبني أشياء تعمل فعلاً.",
    en: "Full-stack builder: Next.js, React, Python, iOS/Android — ships things that actually work.",
  },
  {
    ar: "شهادة علوم حاسب من Taylor's University (حائز على جائزة الجامعة 2024).",
    en: "Computer Science degree from Taylor's University (Award recipient 2024).",
  },
  {
    ar: "مقيم في الرياض، المملكة العربية السعودية. متاح لفرص العمل عن بُعد وفي الموقع في دول الخليج.",
    en: "Based in Riyadh, Saudi Arabia. Available for remote and on-site opportunities across GCC.",
  },
]
