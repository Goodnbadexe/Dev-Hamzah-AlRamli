/**
 * Portfolio Assistant — knowledge base + deterministic matcher.
 *
 * SECURITY MODEL (important): this is a *rule-based* responder, not an LLM.
 * Input is treated purely as a lookup key against a fixed intent table — there
 * is no instruction-following layer, so it cannot be prompt-injected or
 * jailbroken. Guardrails are evaluated FIRST and SEPARATELY from knowledge
 * intents, so adversarial input can only ever route to a refusal/hint, never to
 * data. The site's real secrets (hidden routes, terminal easter eggs, CTF
 * flags) are deliberately NOT present in this file — the assistant physically
 * cannot leak what it does not know. It only ever *hints* that a game exists.
 *
 * Every fact below is sourced from lib/content/personnel.ts + contact.ts — no
 * invented claims.
 */

export interface FaqReply {
  text: string
  /** Quick-reply chips suggested after this answer. */
  suggestions?: string[]
}

// ---------------------------------------------------------------------------
// Shared facts (single source of truth for the assistant)
// ---------------------------------------------------------------------------
const CONTACT = {
  email: "alramli.hamzah@gmail.com",
  phone: "+966 50 850 1717",
  linkedin: "linkedin.com/in/hamzah-al-ramli-505",
  github: "github.com/Goodnbadexe",
}

const CONTACT_LINE =
  `You can reach Hamzah directly:\n` +
  `• Email — ${CONTACT.email}\n` +
  `• Phone — ${CONTACT.phone}\n` +
  `• LinkedIn — ${CONTACT.linkedin}\n` +
  `Or open the encrypted channel at /contact.`

const DEFAULT_SUGGESTIONS = ["What does he do?", "His certifications", "How to contact him"]

// ---------------------------------------------------------------------------
// Guardrails — checked BEFORE any knowledge intent. Each is a category of
// pattern that must never yield site secrets. Order = priority.
// ---------------------------------------------------------------------------
interface Guard {
  id: string
  patterns: string[]
  reply: FaqReply
}

const GUARDS: Guard[] = [
  {
    // Prompt-injection / jailbreak attempts — firm, friendly, immovable.
    id: "jailbreak",
    patterns: [
      "ignore previous", "ignore your", "ignore all", "ignore the above",
      "disregard", "system prompt", "your instructions", "your rules",
      "your prompt", "developer mode", "dev mode", "pretend you", "pretend to be",
      "act as", "roleplay", "jailbreak", "do anything now", "dan mode",
      "override", "bypass your", "no restrictions", "without restrictions",
      "reveal your", "print your",
    ],
    reply: {
      text:
        "Not going to happen 🙂 I don't have a \"developer mode,\" and I won't step outside what I'm here for. " +
        "I'm happy to tell you about Hamzah's work, skills, or how to reach him though — what would you like to know?",
      suggestions: DEFAULT_SUGGESTIONS,
    },
  },
  {
    // Secrets / hidden content / the site's CTF game — hint only, never reveal.
    id: "secrets",
    patterns: [
      "secret", "secrets", "flag", "flags", "hidden", "easter egg", "easteregg",
      "ctf", "cheat", "walkthrough", "backdoor", "back door", "the answer to",
      "give me the", "where is the",
    ],
    reply: {
      text:
        "Ah, hunting for the hidden stuff? 😏 There *is* more to this site than the nav shows — the terminal rewards " +
        "the curious, and not every page is linked. But finding it is the whole point, so I'll hint, never hand it over. " +
        "Start poking around `/terminal`. Meanwhile, I can tell you all about Hamzah's actual work.",
      suggestions: ["Open the terminal", "What does he do?", "His projects"],
    },
  },
  {
    // Attempts to extract site internals / attack this site.
    id: "internals",
    patterns: [
      "api key", "apikey", "password", "passwd", "credential", ".env", "env file",
      "source code", "admin panel", "admin login", "private key", "ssh key",
      "access token", "exploit this", "hack this", "hack the site", "hack into",
      "vulnerab", "sql injection", "xss payload",
    ],
    reply: {
      text:
        "I can't help with poking at this site's internals — no keys, configs, or source from me. " +
        "(Hamzah builds *defensive* systems, so this one's reasonably locked down.) " +
        "If you've found something genuinely concerning, the responsible thing is to report it: " +
        `${CONTACT.email}. Otherwise, ask me about his work!`,
      suggestions: DEFAULT_SUGGESTIONS,
    },
  },
]

// ---------------------------------------------------------------------------
// Knowledge intents — keyword-scored. Multi-word keys match as substrings;
// single-word keys match on word boundaries.
// ---------------------------------------------------------------------------
interface Intent {
  id: string
  keywords: string[]
  reply: FaqReply | (() => FaqReply)
}

const INTENTS: Intent[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "yo", "good morning", "good evening", "salam", "howdy"],
    reply: {
      text:
        "Hey 👋 I'm the portfolio assistant. I can tell you about Hamzah Al-Ramli — his cybersecurity work, " +
        "certifications, projects, and how to get in touch. What would you like to know?",
      suggestions: DEFAULT_SUGGESTIONS,
    },
  },
  {
    id: "about",
    keywords: ["who is", "who's", "about him", "about hamzah", "tell me about", "background", "bio", "introduce"],
    reply: {
      text:
        "Hamzah Al-Ramli is a Cybersecurity & Automation Architect based in Riyadh, Saudi Arabia — and also a " +
        "creative multimedia designer and full-stack developer. He works across threat analysis and malware " +
        "investigation, brand identity and design, and full-stack builds. The throughline: making things that matter.",
      suggestions: ["His skills", "His certifications", "Is he available?"],
    },
  },
  {
    id: "role",
    keywords: ["what does he do", "what do you do", "role", "title", "position", "profession", "job", "occupation"],
    reply: {
      text:
        "Core role: Cybersecurity & Automation Architect — he builds defensive systems, threat tooling, and the " +
        "automation that runs them. Alongside that he's a multimedia designer and full-stack developer.",
      suggestions: ["His cybersecurity skills", "His projects", "Hire / availability"],
    },
  },
  {
    id: "skills",
    keywords: ["skill", "skills", "stack", "tech", "technologies", "languages", "expertise", "capable", "good at", "tools"],
    reply: {
      text:
        "Hamzah works across four domains:\n" +
        "• Cybersecurity — malware analysis, threat intel & OSINT, network security (CCNA), vuln management, incident response\n" +
        "• Development — Next.js / React / TypeScript, Python, Java, PHP, iOS (Swift) & Android, full-stack apps\n" +
        "• Creative & multimedia — graphic design, brand identity, video editing (Premiere, Avid), UI/UX\n" +
        "• Strategy & tools — workflow automation (n8n, AI agents), analytics, SEO, project management",
      suggestions: ["His certifications", "His projects", "His cybersecurity focus"],
    },
  },
  {
    id: "cyber",
    keywords: ["cybersecurity", "cyber security", "malware", "threat", "soc", "blue team", "incident", "osint", "security skills", "infosec"],
    reply: {
      text:
        "On the security side, Hamzah focuses on malware analysis & dynamic investigation, threat intelligence & " +
        "OSINT, network security (CCNA fundamentals), vulnerability management, and incident response & detection. " +
        "He's earned hands-on LetsDefend credentials (Dynamic Analyst, Malware Analyzer, First Blood).",
      suggestions: ["His certifications", "His projects", "Contact him"],
    },
  },
  {
    id: "certs",
    keywords: ["cert", "certs", "certificate", "certification", "credential", "qualified", "qualification", "letsdefend", "google cybersecurity", "comptia", "ccna"],
    reply: {
      text:
        "Verified credentials (9):\n" +
        "• LetsDefend — Dynamic Analyst, Malware Analyzer, First Blood (2025)\n" +
        "• Google — Cybersecurity Professional Certificate\n" +
        "• IBM — Cybersecurity Assessment (Security+ & CySA+); Generative AI for Cybersecurity\n" +
        "• Simplilearn — CCNA 200-301 Network Fundamentals\n" +
        "• Google Analytics; Taylor's University Award 2024; CASUGOL Advanced Python\n" +
        "CEH and Security+ are also in progress. Full ledger + verify links: /personnel.",
      suggestions: ["His skills", "His education", "Contact him"],
    },
  },
  {
    id: "education",
    keywords: ["education", "degree", "university", "study", "studied", "college", "school", "academic", "taylor", "graduate"],
    reply: {
      text:
        "Hamzah holds a BSc in Computer Science from Taylor's University, and was a Taylor's University Award " +
        "recipient (2024). The full education and service record is on the dossier at /personnel.",
      suggestions: ["His certifications", "His experience", "His projects"],
    },
  },
  {
    id: "experience",
    keywords: ["experience", "work history", "employment", "career", "worked", "previous", "service record"],
    reply: {
      text:
        "His service record (work history) and roadmap are laid out on the Personnel dossier — the fastest full " +
        "picture is the resume. See /personnel, or download the CV (below).",
      suggestions: ["Download resume", "His projects", "Contact him"],
    },
  },
  {
    id: "projects",
    keywords: ["project", "projects", "portfolio", "built", "build", "deployment", "deployments", "work samples", "github", "repo", "repos"],
    reply: {
      text:
        "Hamzah's mission files and architecture write-ups live in the Deployments module — open /deployments. " +
        `Public code and activity are on GitHub: ${CONTACT.github}.`,
      suggestions: ["His skills", "His certifications", "Contact him"],
    },
  },
  {
    id: "hire",
    keywords: ["hire", "available", "availability", "freelance", "work with", "service", "services", "offer", "consult", "recruiter", "opportunity", "open to"],
    reply: {
      text:
        "Yes — Hamzah is open to work: cybersecurity & threat intelligence, automation/workflow engineering, " +
        "Next.js/React web platform work, and multimedia design. Remote & on-site across the GCC.\n\n" + CONTACT_LINE,
      suggestions: ["Contact him", "His skills", "Download resume"],
    },
  },
  {
    id: "contact",
    keywords: ["contact", "email", "reach", "get in touch", "phone", "call", "message", "talk to", "connect", "linkedin", "how do i reach"],
    reply: { text: CONTACT_LINE, suggestions: ["Download resume", "Is he available?", "His projects"] },
  },
  {
    id: "resume",
    keywords: ["resume", "cv", "download", "curriculum"],
    reply: {
      text: "You can download Hamzah's current resume (PDF) here: /files/hamzah-al-ramli-resume.pdf",
      suggestions: ["Contact him", "His certifications", "His experience"],
    },
  },
  {
    id: "location",
    keywords: ["location", "where is he", "where's he", "based", "city", "country", "riyadh", "saudi", "gcc", "relocate", "remote"],
    reply: {
      text:
        "Hamzah is based in Riyadh, Saudi Arabia, and is available for both remote and on-site work across the GCC.",
      suggestions: ["Is he available?", "Contact him", "His skills"],
    },
  },
  {
    id: "site",
    keywords: ["what is this", "what's this", "this site", "this website", "goodnbad", "the os", "globe", "threat globe", "ioc", "what is goodnbad", "how does this work"],
    reply: {
      text:
        "This is goodnbad.exe — Hamzah's portfolio built as a little operating system. The globe is a live cyber-threat " +
        "monitor: every dot is a real indicator of compromise (C2 servers, malware hosts, phishing, ransomware) " +
        "geolocated from open threat feeds — honest data, no fake attack arcs. Explore the modules from the launcher.",
      suggestions: ["His cybersecurity skills", "His projects", "Contact him"],
    },
  },
  {
    id: "self",
    keywords: ["who are you", "what are you", "are you ai", "are you a bot", "are you real", "are you an llm", "are you human", "chatgpt", "what model"],
    reply: {
      text:
        "I'm the portfolio assistant — a small, built-in guide to Hamzah's work. I'm not a general AI and I don't " +
        "browse or run commands; I just answer questions about Hamzah, his skills, and how to reach him. Ask away!",
      suggestions: DEFAULT_SUGGESTIONS,
    },
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "thx", "appreciate", "cheers"],
    reply: {
      text: "Anytime! If you want, I can point you to his projects or the best way to get in touch.",
      suggestions: ["His projects", "Contact him"],
    },
  },
  {
    id: "bye",
    keywords: ["bye", "goodbye", "see ya", "cya", "later", "good night"],
    reply: { text: "Take care 👋 Come back anytime — and don't forget to explore the site." },
  },
]

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------
function normalize(input: string): string {
  return ` ${input.toLowerCase().replace(/[^a-z0-9'\s]/g, " ").replace(/\s+/g, " ").trim()} `
}

/**
 * True if `key` matches the (space-padded, normalized) text.
 * Multi-word keys match as substrings. Single words match on word boundaries,
 * with simple singular/plural tolerance for keys of length >= 4 (so "skill"
 * matches "skills" and "certification" matches "certifications", while short
 * tokens like "hi"/"yo" stay exact and don't match "his"/"yos").
 */
function hits(norm: string, key: string): boolean {
  if (key.includes(" ")) return norm.includes(key)
  if (norm.includes(` ${key} `)) return true
  if (key.length >= 4) {
    if (norm.includes(` ${key}s `)) return true // plural of key
    if (key.endsWith("s") && norm.includes(` ${key.slice(0, -1)} `)) return true // singular of key
  }
  return false
}

const FALLBACK: FaqReply = {
  text:
    "I'm not sure I caught that — I keep things simple on purpose. I can tell you about Hamzah's background, " +
    "skills, certifications, projects, or the best way to reach him. For anything specific, email " +
    `${CONTACT.email} or open /contact.`,
  suggestions: DEFAULT_SUGGESTIONS,
}

/**
 * answerFor — the single entry point. Guardrails first, then best-scoring
 * knowledge intent, then a safe fallback. Pure & deterministic (easy to test).
 */
export function answerFor(rawInput: string): FaqReply {
  const norm = normalize(rawInput)
  if (norm.trim().length === 0) return FALLBACK

  // 1) Guardrails win, in priority order.
  for (const guard of GUARDS) {
    if (guard.patterns.some((p) => hits(norm, p))) return guard.reply
  }

  // 2) Highest-scoring knowledge intent.
  let best: Intent | null = null
  let bestScore = 0
  for (const intent of INTENTS) {
    let score = 0
    for (const kw of intent.keywords) {
      if (hits(norm, kw)) score += kw.includes(" ") ? 2 : 1
    }
    if (score > bestScore) {
      bestScore = score
      best = intent
    }
  }

  if (best && bestScore > 0) {
    return typeof best.reply === "function" ? best.reply() : best.reply
  }

  // 3) Safe fallback.
  return FALLBACK
}

/** Opening message shown when the panel is first opened. */
export const GREETING: FaqReply = {
  text:
    "Hi — I'm Hamzah's portfolio assistant 🛡️ Ask me about his cybersecurity work, certifications, projects, " +
    "or how to get in touch. (I keep to those topics on purpose.)",
  suggestions: ["What does he do?", "His certifications", "Is he available?", "How to contact him"],
}
