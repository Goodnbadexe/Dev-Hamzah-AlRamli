import { memoryPlan } from "@/lib/memory/plan"
import { PERSONAL_BRAND } from "@/lib/social/profiles"

export const resumeHref = "/files/hamzah-al-ramli-resume.pdf"

export const personnelIdentity = {
  name: PERSONAL_BRAND.name,
  alias: PERSONAL_BRAND.alias,
  title: PERSONAL_BRAND.title,
  location: PERSONAL_BRAND.location,
  summary:
    "Cybersecurity and automation-focused systems administrator building secure infrastructure, operational workflows, and practical software systems.",
  availability: "Open to cybersecurity, IT systems, automation, and software engineering opportunities.",
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
    name: "Google Analytics Certification",
    issuer: "Google Digital Academy",
    date: "May 2025",
    credentialId: "143306854",
    href: "https://skillshop.credential.net/f6dd7dc8-877d-434b-b6e0-618f9ff96b5a",
  },
  {
    name: "Taylor's University Award 2024",
    issuer: "Taylor's University",
    date: "December 2024",
    credentialId: "126164641",
    href: "https://credentials.taylors.edu.my/a320a345-9d00-4aa3-b15e-25ae46231588",
  },
]

export const technicalCapabilities = [
  {
    label: "Cybersecurity Operations",
    items: [
      "Security risk management",
      "Network security fundamentals",
      "Vulnerability management",
      "Managed detection and response",
      "Incident response playbooks",
    ],
  },
  {
    label: "Systems & Infrastructure",
    items: [
      "Windows and Linux administration",
      "Help desk operations",
      "Endpoint hardening",
      "Business application support",
      "Infrastructure maintenance",
    ],
  },
  {
    label: "Software Engineering",
    items: [
      "Next.js and React",
      "Node.js automation",
      "Python scripting",
      "Database-backed applications",
      "Mobile and web development",
    ],
  },
  {
    label: "Automation & Tooling",
    items: [
      "Workflow automation",
      "Git and deployment pipelines",
      "Docker fundamentals",
      "AI-assisted operations",
      "Status reporting systems",
    ],
  },
]

export const recruiterHighlights = [
  "On-site IT systems and support experience in Riyadh.",
  "Computer science and creative multimedia education from Taylor's University.",
  "Security-first builder with practical web, mobile, automation, and infrastructure skills.",
  "Public resume is available for immediate review.",
]
