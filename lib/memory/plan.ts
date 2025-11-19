// === METADATA ===
// Purpose: Single source of truth for Memory Plan content (timeline, goals, CTF, skills)
// Author: @Goodnbad.exe
// Inputs: N/A
// Outputs: Structured data consumed by UI pages/components
// Assumptions: Static content; can be updated via future automation
// Tests: Render on /memory page; validate types compile
// Security: No secrets; static data only
// Complexity: O(1) access to exported objects
// === END METADATA ===

export type TimelineItem = {
  date: string;
  title: string;
  details: string[];
};

export type GoalItem = {
  area: string;
  targets: string[];
};

export type CTFItem = {
  event: string;
  writeupUrl?: string;
  highlights: string[];
};

export const memoryPlan = {
  summary: "Structured progression for skills, experience, and CTF learning",
  timeline: <TimelineItem[]>[
    {
      date: "Aug 2025 – Present",
      title: "IT Systems & Support Administrator — Calma.sa (On-site, Riyadh)",
      details: [
        "Provide end-to-end IT support and systems administration",
        "Manage daily help desk operations and core infrastructure",
        "Oversee business applications and routine maintenance",
      ],
    },
    {
      date: "2019 – 2025",
      title: "Bachelor's in Computer Science — Taylor's University",
      details: [
        "Core CS foundation and security-minded development",
        "Projects spanning web, mobile, and creative coding",
      ],
    },
    {
      date: "2022 – 2025",
      title: "Bachelor's in Creative Multimedia Design — Taylor's University",
      details: [
        "Design thinking integrated with engineering workflows",
        "UI/UX and visual communication for technical products",
      ],
    },
  ],
  goals: <GoalItem[]>[
    {
      area: "Cybersecurity",
      targets: [
        "Advance vulnerability management and MDR practices",
        "Deepen incident response procedures and playbooks",
        "Expand SIEM tooling and log analysis proficiency",
      ],
    },
    {
      area: "Systems & DevOps",
      targets: [
        "Automate updates and notifications across platforms",
        "Harden Windows and Linux endpoints/security baselines",
        "Improve observability and status reporting",
      ],
    },
    {
      area: "Full-Stack Development",
      targets: [
        "Maintain Next.js site as single source of truth",
        "Integrate safe LinkedIn → Website sync pipeline",
        "Publish regular changelog updates via automation",
      ],
    },
  ],
  ctf: <CTFItem[]>[
    {
      event: "Intro Challenges (Practice)",
      writeupUrl: undefined,
      highlights: [
        "Focus on reasoning and layered hints",
        "Use terminal CTF commands to practice flags",
      ],
    },
  ],
};