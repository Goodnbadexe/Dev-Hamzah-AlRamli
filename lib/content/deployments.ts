export type DeploymentStatus = "Live" | "Case study" | "Archived" | "Rebuilding"

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
    status: "Rebuilding",
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
      "Originally shipped as a GitHub Pages deployment. Being redeployed with an automated build pipeline.",
    tools: ["React", "Vite", "Framer Motion", "Tailwind CSS", "GitHub Pages"],
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
  {
    slug: "raining-characters",
    code: "DEP-007",
    name: "Raining Characters",
    shortName: "Raining Characters",
    status: "Live",
    category: "Visual experiment",
    year: "2024",
    href: "https://v0-raining-characters-ten-livid.vercel.app/",
    summary:
      "An animated character rain effect inspired by the Matrix — built as a visual front-end experiment.",
    what:
      "A single-page visual demo with cascading animated characters rendered in the browser.",
    why:
      "A quick creative experiment to explore canvas or DOM-based animation with a recognizable visual idea.",
    result:
      "Published as a Vercel deployment and served as early evidence of animation-focused front-end thinking.",
    tools: ["React", "Vercel", "CSS animation", "Frontend prototyping"],
    highlights: [
      "Visually striking animation concept.",
      "Fast iteration from idea to deployed experiment.",
      "Demonstrates creative front-end thinking beyond utility UIs.",
    ],
    lessons: [
      "Visual demos communicate personality in ways text cannot.",
      "Even a simple animation experiment is worth shipping publicly.",
    ],
  },
  {
    slug: "hos-first-website",
    code: "DEP-008",
    name: "HOS — First Website",
    shortName: "HOS",
    status: "Archived",
    category: "Origin project",
    year: "2023",
    href: "https://goodnbadexe.github.io/HOS/",
    summary:
      "The first public website — a milestone that marks the beginning of the Goodnbad.exe web journey.",
    what:
      "An early static website hosted on GitHub Pages, representing the first complete public deployment.",
    why:
      "It represents the starting point: the first time an idea went from local files to a live URL accessible to anyone.",
    result:
      "A permanent reference point in the portfolio — kept live as an honest record of where the work started.",
    tools: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    highlights: [
      "First fully deployed public project.",
      "Foundation for all subsequent web work.",
      "Demonstrates the full arc from beginner project to OS-grade portfolio.",
    ],
    lessons: [
      "Every expert started with a first website.",
      "Keeping early work visible shows confidence and growth.",
    ],
  },
  // ── CLIENT WORK ──────────────────────────────────────────────────────────
  {
    slug: "athr-website",
    code: "DEP-009",
    name: "Athr — Client Website",
    shortName: "Athr",
    status: "Live",
    category: "Client website",
    year: "2025",
    href: "https://athr-website-pi.vercel.app",
    summary: "A brand website for Athr, built through multiple rounds of client review and annotation-driven iterations.",
    what: "A professional client-facing website developed with close collaboration, incorporating client feedback cycles directly into the design and build process.",
    why: "Demonstrated the ability to work with real client briefs, iterate on annotated feedback, and deliver a production-grade site on a live domain.",
    result: "Delivered a refined, reviewed, and deployed website reflecting the Athr brand with production Vercel hosting.",
    tools: ["React", "Next.js", "Vercel", "Client collaboration", "Responsive design"],
    highlights: ["Multiple annotation-driven revision rounds.", "Live production deployment.", "Real client workflow experience."],
    lessons: ["Client work requires patience with feedback loops.", "Annotations make revision requests concrete and actionable."],
  },
  // ── DESIGN SYSTEMS ───────────────────────────────────────────────────────
  {
    slug: "macos-mojave",
    code: "DEP-010",
    name: "macOS Mojave UI — React Clone",
    shortName: "macOS Mojave",
    status: "Live",
    category: "UI design system",
    year: "2024",
    href: "https://v0-macosmojave-coral.vercel.app",
    summary: "A faithful React recreation of the macOS Mojave desktop interface — dock, windows, and all.",
    what: "A front-end challenge to replicate the macOS Mojave desktop experience in the browser using React and Tailwind.",
    why: "Pushed pixel-perfect UI discipline and deep understanding of layering, animation, and system-level design patterns.",
    result: "A deployed Vercel project that demonstrates design system thinking at the OS interface level.",
    tools: ["React", "Tailwind CSS", "Vercel", "UI cloning", "Animation"],
    highlights: ["macOS Dock and window chrome recreation.", "System-level design pattern study.", "Deployed and publicly accessible."],
    lessons: ["Cloning existing systems teaches interface constraints you'd never encounter building from scratch.", "OS-level UI is unforgiving about spacing and timing."],
  },
  {
    slug: "calma-recreation",
    code: "DEP-011",
    name: "Calma — App UI Recreation",
    shortName: "Calma",
    status: "Live",
    category: "UI recreation",
    year: "2024",
    href: "https://v0-calma-recreation.vercel.app",
    summary: "A browser recreation of the Calma app interface — a study in clean, minimal product design.",
    what: "A front-end recreation of a real-world app's UI to study calm, minimal design language and component structure.",
    why: "Recreation projects sharpen the ability to reverse-engineer design decisions and implement them precisely.",
    result: "A deployed Vercel project capturing the visual language of a real product.",
    tools: ["React", "Tailwind CSS", "Vercel", "UI recreation"],
    highlights: ["Minimal product design study.", "Component-level precision.", "Clean animation and layout work."],
    lessons: ["Recreating good design is one of the fastest ways to internalize it.", "Minimal interfaces are harder to get right than complex ones."],
  },
  {
    slug: "fstack-portfolio",
    code: "DEP-012",
    name: "F Stack Portfolio",
    shortName: "F Stack",
    status: "Archived",
    category: "Portfolio experiment",
    year: "2024",
    href: "https://v0-portfoliothefstack-sigma.vercel.app",
    summary: "An alternative portfolio design exploring a different visual direction before settling on the OS theme.",
    what: "An exploratory portfolio layout that tested a different design language and structure for presenting work.",
    why: "Iterating on multiple portfolio directions helped clarify what presentation style best fits the Goodnbad.exe identity.",
    result: "A useful design artifact that informed the final GOODNBAD OS portfolio direction.",
    tools: ["React", "Vercel", "Portfolio design", "Layout exploration"],
    highlights: ["Alternative visual direction.", "Informed final portfolio decision.", "Rapid V0 iteration."],
    lessons: ["Building multiple versions before committing saves expensive pivots later."],
  },
  // ── TOOLS & EXPERIMENTS ──────────────────────────────────────────────────
  {
    slug: "ascii-art-converter",
    code: "DEP-013",
    name: "ASCII Art Converter",
    shortName: "ASCII Converter",
    status: "Live",
    category: "Creative tool",
    year: "2024",
    href: "https://v0-image-to-ascii-eta.vercel.app/",
    summary: "A browser tool that converts images into ASCII art — combining creative expression with algorithmic image processing.",
    what: "A client-side image-to-ASCII converter that maps pixel luminance values to characters in the browser.",
    why: "Explored the intersection of creative coding and practical toolmaking — a shareable, useful utility.",
    result: "A deployed tool accessible to anyone wanting to generate ASCII art from their images.",
    tools: ["React", "Canvas API", "Vercel", "Image processing", "Creative coding"],
    highlights: ["Real-time image-to-ASCII conversion.", "Purely client-side processing.", "Creative + technical blend."],
    lessons: ["Useful tools get shared; creative tools get remembered.", "Canvas API is powerful for image manipulation without a backend."],
  },
  {
    slug: "financial-dashboard",
    code: "DEP-014",
    name: "Financial Dashboard",
    shortName: "Finance Dashboard",
    status: "Live",
    category: "UI demo",
    year: "2024",
    href: "https://v0-financial-dashboard-beryl-delta.vercel.app",
    summary: "A financial data dashboard UI demo — clean charts, metrics, and data visualisation patterns.",
    what: "A dashboard interface demo with financial metrics, chart components, and data layout patterns.",
    why: "Dashboard design is a core enterprise skill — this demonstrated the ability to handle dense data clearly.",
    result: "A deployed Vercel project showing data-heavy UI competency.",
    tools: ["React", "Charts", "Tailwind CSS", "Vercel", "Data visualisation"],
    highlights: ["Dense data presented cleanly.", "Chart and metric components.", "Enterprise UI patterns."],
    lessons: ["Good dashboards make data scannable before making it deep.", "Colour and hierarchy carry more weight than labels in data UIs."],
  },
  {
    slug: "web-voting-system",
    code: "DEP-015",
    name: "Web Voting System",
    shortName: "Voting System",
    status: "Live",
    category: "Civic tech demo",
    year: "2024",
    href: "https://v0-web-voting-system-fm5khggy5h8.vercel.app",
    summary: "A browser-based voting system prototype demonstrating real-time vote collection and result display.",
    what: "A front-end voting system UI with candidate display, vote submission, and results visualisation.",
    why: "Civic tech and transparent systems are important design challenges — this explored what a clean voting UI could look like.",
    result: "A deployed prototype showing interactive civic interface design.",
    tools: ["React", "Vercel", "State management", "UI design"],
    highlights: ["Vote collection interface.", "Results display.", "Clean civic design patterns."],
    lessons: ["Trust in a system comes from visual transparency.", "Voting UIs need to be unambiguous above all else."],
  },
  {
    slug: "llm-interface",
    code: "DEP-016",
    name: "LLM Interface Demo",
    shortName: "LLM Demo",
    status: "Live",
    category: "AI demo",
    year: "2024",
    href: "https://v0-llm-pji4wbxkm3u.vercel.app",
    summary: "An interface demo for interacting with large language models — exploring AI chat UI design patterns.",
    what: "A front-end AI chat interface exploring the UX patterns of LLM interactions.",
    why: "Understanding how to design for AI conversations is a core skill in the current technical landscape.",
    result: "A deployed Vercel demo illustrating AI interface thinking.",
    tools: ["React", "Vercel", "AI UX", "Chat interface design"],
    highlights: ["LLM-style conversation UI.", "AI interaction design patterns.", "Clean message threading."],
    lessons: ["AI UIs need to communicate model limitations, not just capabilities.", "Streaming responses change how you think about loading states."],
  },
  {
    slug: "satori-demo",
    code: "DEP-017",
    name: "Satori — Visual Demo",
    shortName: "Satori",
    status: "Live",
    category: "Visual experiment",
    year: "2024",
    href: "https://v0-satori-psi.vercel.app",
    summary: "A visual experiment and design demo exploring creative interface ideas.",
    what: "A V0-built visual experiment testing creative rendering and design concepts.",
    why: "Short creative experiments keep the design muscle active between larger projects.",
    result: "A deployed Vercel project capturing a focused visual idea.",
    tools: ["React", "Vercel", "Creative design"],
    highlights: ["Rapid visual prototyping.", "Creative concept exploration.", "Deployed and shareable."],
    lessons: ["Small visual experiments are worth shipping even if they have no utility."],
  },
  {
    slug: "game-prototype-2",
    code: "DEP-018",
    name: "Game Prototype II",
    shortName: "Game Prototype II",
    status: "Live",
    category: "Game prototype",
    year: "2024",
    href: "https://v0-game-lijol99rutq.vercel.app",
    summary: "A second browser game prototype — continuing exploration of interactive game state and UI.",
    what: "A playable browser game built as a follow-up to the Pixel Game, exploring different mechanics or visual approaches.",
    why: "Game development consistently surfaces UI state and interaction challenges that static UIs never expose.",
    result: "A deployed Vercel game prototype.",
    tools: ["React", "Vercel", "Game state", "Interactive UI"],
    highlights: ["Playable browser game.", "Interactive state management.", "Follow-up to Pixel Game X and O."],
    lessons: ["Each game prototype teaches something the last one didn't.", "Play is a serious design exercise."],
  },
  // ── CREATIVE & EXTERNAL PLATFORMS ────────────────────────────────────────
  {
    slug: "codepen-jjmnvvq",
    code: "DEP-019",
    name: "CodePen — Creative Experiment",
    shortName: "CodePen Pen",
    status: "Live",
    category: "Creative coding",
    year: "2024",
    href: "https://codepen.io/Goodnbadexe/pen/JjmNvVQ",
    summary: "A CodePen creative coding experiment — CSS and JavaScript art built directly in the browser.",
    what: "A standalone creative coding pen exploring visual or interactive ideas using pure HTML, CSS, and JavaScript.",
    why: "CodePen pens test creative coding instincts in a constrained, immediate environment.",
    result: "A public pen on CodePen demonstrating creative front-end capabilities.",
    tools: ["HTML", "CSS", "JavaScript", "CodePen"],
    highlights: ["Pure browser creative coding.", "No build tools — raw HTML/CSS/JS.", "Public and shareable."],
    lessons: ["Constraints in CodePen force creative solutions that frameworks make easy to avoid."],
  },
  {
    slug: "sketchfab-3d",
    code: "DEP-020",
    name: "Sketchfab — 3D Portfolio",
    shortName: "3D Work",
    status: "Live",
    category: "3D / modelling",
    year: "2024",
    href: "https://sketchfab.com/Goodnbad.exe",
    summary: "3D models and scenes published on Sketchfab — original work built from scratch.",
    what: "A collection of original 3D models and environments published on the Sketchfab platform.",
    why: "3D modelling from scratch expands design thinking into the spatial dimension — a capability that feeds directly into immersive web experiences.",
    result: "A public Sketchfab portfolio of original 3D work accessible to anyone.",
    tools: ["3D modelling", "Sketchfab", "Blender / 3D tools"],
    highlights: ["Original 3D models built from scratch.", "Publicly hosted on Sketchfab.", "Feeds into web 3D and interactive experience work."],
    lessons: ["3D from scratch teaches spatial thinking that 2D UI work never will.", "Publishing 3D work opens doors in XR, game, and immersive web."],
  },
  {
    slug: "blogspot",
    code: "DEP-021",
    name: "Goodnbad.exe Blog",
    shortName: "Blog",
    status: "Live",
    category: "Blog / writing",
    year: "2023",
    href: "https://goodnbadexe.blogspot.com",
    summary: "The original Goodnbad.exe blog — where early ideas, experiments, and thoughts were published.",
    what: "A Blogspot-hosted blog capturing the early writing, projects, and thinking behind the Goodnbad.exe identity.",
    why: "Writing about work forces clarity of thought — the blog predates the OS portfolio and documents the journey.",
    result: "A public archive of early work, ideas, and the origin of the Goodnbad.exe brand.",
    tools: ["Blogspot", "Writing", "Content creation"],
    highlights: ["Original Goodnbad.exe content archive.", "Documents the early journey.", "Public writing portfolio."],
    lessons: ["Writing about your work creates a record that code alone never does.", "A blog is the cheapest possible way to build a public presence."],
  },
]

export function getDeploymentBySlug(slug: string) {
  return deployments.find((deployment) => deployment.slug === slug)
}

export function getFeaturedDeployments() {
  return deployments.slice(0, 3)
}
