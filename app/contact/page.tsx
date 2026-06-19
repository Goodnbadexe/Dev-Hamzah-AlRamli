import type { Metadata } from "next"
import { OSPageShell } from "@/components/os/OSPageShell"
import { ContactContent } from "./contact-content"

export const metadata: Metadata = {
  title: "Contact | Hamzah Al-Ramli",
  description:
    "Contact Hamzah Al-Ramli for cybersecurity, IT systems, automation, software projects, recruiter outreach, and collaborations.",
  alternates: {
    canonical: "https://www.goodnbad.info/contact",
  },
}

export default function ContactPage() {
  return (
    <OSPageShell osName="contact.enc" label="Contact">
      <ContactContent />
    </OSPageShell>
  )
}
