import { personnelIdentity, resumeHref } from "@/lib/content/personnel"

export const contactProfile = {
  title: "Start a conversation",
  description:
    "For cybersecurity, IT systems, automation, software projects, recruiter outreach, and collaboration requests.",
  responseNote: "Best first contact: email or LinkedIn. Include the role, project, timeline, and preferred next step.",
}

export const contactActions = [
  {
    label: "Email Hamzah",
    description: "Best for direct opportunities, project details, and recruiter outreach.",
    href: `mailto:${personnelIdentity.contact.email}?subject=Opportunity%20or%20collaboration%20for%20Hamzah%20Al-Ramli`,
    value: personnelIdentity.contact.email,
    primary: true,
  },
  {
    label: "LinkedIn",
    description: "Best for professional introductions and hiring conversations.",
    href: personnelIdentity.contact.linkedin,
    value: "linkedin.com/in/hamzah-al-ramli-505",
    primary: false,
  },
  {
    label: "GitHub",
    description: "Best for reviewing public code and project activity.",
    href: personnelIdentity.contact.github,
    value: "github.com/Goodnbadexe",
    primary: false,
  },
  {
    label: "Resume",
    description: "Download the current resume as a PDF.",
    href: resumeHref,
    value: "hamzah-al-ramli-resume.pdf",
    primary: false,
  },
]

export const contactTopics = [
  "Cybersecurity and IT systems roles",
  "Automation and workflow engineering",
  "Next.js, React, and web platform work",
  "Security demos, labs, and technical collaborations",
]
