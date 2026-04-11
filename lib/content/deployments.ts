export type DeploymentStatus = "Live" | "Case study" | "Archived"

export type Deployment = {
  slug: string
  code: string
  name: string
  shortName: string
  status: DeploymentStatus
  category: string
  year: string
  href?: string
  summary: string
  what: string
  why: string
  result: string
  tools: string[]
  highlights: string[]
  lessons: string[]
}

export const deployments: Deployment[] = [
  {
    slug: "goodnbad-os",
    code: "DEP-001",
    name: "GOODNBAD OS Portfolio System",
    shortName: "GOODNBAD OS",
    status: "Live",
    category: "Portfolio platform",
    year: "2026",
    href: "https://www.goodnbad.info",
    summary:
      "A Next.js portfolio rebuilt as a clear OS-inspired website for recruiters, collaborators, and technical visitors.",
    what:
      "A public identity and project system with reusable route shells, security-aware middleware, structured content, and recruiter-friendly pages.",
    why:
      "The previous site had useful content but needed a stronger structure, clearer navigation, and a premium public presentation that still carried the Goodnbad.exe identity.",
    result:
      "The homepage and dossier routes now behave like a normal website while preserving a distinctive GOODNBAD OS visual language.",
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Middleware"],
    highlights: [
      "Reusable OS shell primitives for consistent route layouts.",
      "Security hardening for admin, debug, webhook, and internal surfaces.",
      "Plain-English navigation for non-technical visitors.",
      "Structured content modules for scalable future updates.",
    ],
    lessons: [
      "A strong theme works best when it supports clarity instead of replacing it.",
      "Recruiter pages need immediate answers before deeper lore or terminal interactions.",
    ],
  },
  {
    slug: "cybersecurity-ai-lab",
    code: "DEP-002",
    name: "Cybersecurity AI Lab",
    shortName: "Security AI Lab",
    status: "Case study",
    category: "Security demo",
    year: "2025",
    href: "/cybersecurity-ai",
    summary:
      "An interactive security concept page exploring AI-assisted threat detection, risk scoring, and response workflows.",
    what:
      "A security-focused demo that turns cybersecurity concepts into visible modules for threat detection, predictive analytics, and automated response.",
    why:
      "It helped communicate cybersecurity interests through an approachable interface instead of static claims.",
    result:
      "Created a public-facing security showcase that connects AI, cloud security, and incident response concepts.",
    tools: ["React", "Next.js", "Security UX", "AI concepts", "Microsoft security concepts"],
    highlights: [
      "Interactive threat scan concept for immediate user engagement.",
      "Modular cards for detection, prediction, response, and network security.",
      "Recruiter-readable framing for technical cybersecurity topics.",
    ],
    lessons: [
      "Security demos need careful framing so they look credible instead of theatrical.",
      "Plain labels make complex topics easier to evaluate quickly.",
    ],
  },
  {
    slug: "magic-browser",
    code: "DEP-003",
    name: "Magic Browser",
    shortName: "Magic Browser",
    status: "Live",
    category: "Web experiment",
    year: "2024",
    href: "https://goodnbadexe.github.io/MagicB/",
    summary:
      "A browser-interface experiment focused on rethinking how users interact with web navigation and discovery.",
    what:
      "A front-end project that experiments with a custom browser-like experience and interface behavior.",
    why:
      "It mattered as an early product-thinking exercise: the goal was to move beyond a normal static page and design a more exploratory interaction model.",
    result:
      "Shipped as a public GitHub Pages deployment and became a useful proof point for interface prototyping.",
    tools: ["HTML", "CSS", "JavaScript", "GitHub Pages", "Interaction design"],
    highlights: [
      "Custom browser-inspired UI.",
      "Public deployment with direct visitor access.",
      "Early evidence of product and interaction experimentation.",
    ],
    lessons: [
      "Small prototypes are useful when they test one interaction idea clearly.",
      "Shipping publicly creates stronger evidence than keeping experiments local.",
    ],
  },
  {
    slug: "masarat-events",
    code: "DEP-004",
    name: "Masarat Events Website",
    shortName: "Masarat Events",
    status: "Live",
    category: "Client website",
    year: "2024",
    href: "https://www.masaratevents.com",
    summary:
      "A corporate events website built to present services, brand credibility, and public company information.",
    what:
      "A business-facing website for an events company with emphasis on clean presentation and easy visitor comprehension.",
    why:
      "The project mattered because it moved from personal experimentation into a practical external web presence for a real audience.",
    result:
      "Delivered a public company website that supports brand discovery and service communication.",
    tools: ["Web design", "Responsive layout", "Content structure", "Frontend development"],
    highlights: [
      "Business-oriented page structure.",
      "Public production site.",
      "Focus on clarity for non-technical visitors.",
    ],
    lessons: [
      "Client-facing work depends on clarity more than novelty.",
      "A site has to explain the business before it shows the craft.",
    ],
  },
  {
    slug: "prompting-is-all-you-need",
    code: "DEP-005",
    name: "Prompting Is All You Need",
    shortName: "Prompting Demo",
    status: "Live",
    category: "AI learning demo",
    year: "2024",
    href: "https://v0-prompting-is-all-you-need-ashy-delta.vercel.app/",
    summary:
      "A focused demo about prompt engineering patterns and how structured instructions change AI output quality.",
    what:
      "A learning-oriented web demo that presents prompting concepts through a concise public interface.",
    why:
      "It captured practical AI learning at a time when prompt design became a core skill for automation and software workflows.",
    result:
      "Published a shareable Vercel deployment that documents AI interaction thinking in a concrete format.",
    tools: ["Vercel", "Frontend development", "Prompt engineering", "AI workflow design"],
    highlights: [
      "Clear theme around prompt quality and instruction design.",
      "Public deployment for easy review.",
      "Connected AI experimentation to practical interface building.",
    ],
    lessons: [
      "Good prompts are structured systems, not just clever wording.",
      "AI demos are stronger when they show a practical workflow.",
    ],
  },
  {
    slug: "pixel-game",
    code: "DEP-006",
    name: "Pixel Game X and O",
    shortName: "Pixel Game",
    status: "Live",
    category: "Game prototype",
    year: "2024",
    href: "https://v0-pixel-game-idea-two.vercel.app/",
    summary:
      "A stylized tic-tac-toe game prototype using pixel-inspired visuals and simple interactive game logic.",
    what:
      "A lightweight browser game that combines classic rules with a visual style suitable for fast prototyping.",
    why:
      "It mattered as proof of interactive UI logic, state handling, and play-focused visual design.",
    result:
      "Shipped a playable browser prototype that demonstrates quick iteration from idea to deployed experience.",
    tools: ["React", "Game state", "Vercel", "Pixel-style UI", "Frontend prototyping"],
    highlights: [
      "Playable interaction instead of a static mockup.",
      "Simple rules implemented in a browser interface.",
      "Fast deployment cycle from concept to live link.",
    ],
    lessons: [
      "Games expose UI state issues quickly.",
      "Small playful builds are useful for practicing interaction polish.",
    ],
  },
]

export function getDeploymentBySlug(slug: string) {
  return deployments.find((deployment) => deployment.slug === slug)
}

export function getFeaturedDeployments() {
  return deployments.slice(0, 3)
}
