import { memoryPlan } from "@/lib/memory/plan"
import { PERSONAL_BRAND } from "@/lib/social/profiles"

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

export const certifications = [
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

export const technicalCapabilities = [
  {
    label: "Cybersecurity",
    items: [
      "Malware analysis & dynamic investigation",
      "Threat intelligence & OSINT",
      "Network security (CCNA fundamentals)",
      "Vulnerability management",
      "Incident response & detection",
    ],
  },
  {
    label: "Creative & Multimedia",
    items: [
      "Graphic design & brand identity",
      "Video editing — Adobe Premiere Pro, Avid",
      "Animation & interactive experiences",
      "UI/UX and responsive web design",
      "Social media content production",
    ],
  },
  {
    label: "Development",
    items: [
      "Next.js, React, TypeScript",
      "Python, JavaScript, Java, PHP",
      "iOS (Swift) & Android",
      "Database-backed full-stack apps",
      "AI-augmented development",
    ],
  },
  {
    label: "Strategy & Tools",
    items: [
      "Google Analytics & digital analytics",
      "Brand management",
      "Workflow automation (n8n, AI agents)",
      "Project management",
      "SEO & content strategy",
    ],
  },
]

export const recruiterHighlights = [
  "Cybersecurity expert with hands-on malware analysis, threat intelligence, and detection work (LetsDefend certified).",
  "Creative multimedia designer — graphic design, brand identity, video production, and interactive experiences.",
  "Full-stack builder: Next.js, React, Python, iOS/Android — ships things that actually work.",
  "Computer Science degree from Taylor's University (Award recipient 2024).",
  "Based in Riyadh, Saudi Arabia. Available for remote and on-site opportunities across GCC.",
]
