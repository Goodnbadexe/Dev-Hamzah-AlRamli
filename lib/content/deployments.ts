/** Bilingual user-facing string. Slugs/codes/URLs/years/tool names stay outside this shape. */
export type Bilingual = { ar: string; en: string }

export type DeploymentStatus = "Live" | "Case study" | "Archived" | "Rebuilding"

export type Deployment = {
  slug: string
  code: string
  name: Bilingual
  shortName: Bilingual
  status: DeploymentStatus
  category: Bilingual
  year: string
  href?: string
  summary: Bilingual
  what: Bilingual
  why: Bilingual
  result: Bilingual
  tools: string[]
  highlights: Bilingual[]
  lessons: Bilingual[]
}

export const deployments: Deployment[] = [
  {
    slug: "goodnbad-os",
    code: "DEP-001",
    name: {
      ar: "نظام الأعمال GOODNBAD OS",
      en: "GOODNBAD OS Portfolio System",
    },
    shortName: {
      ar: "GOODNBAD OS",
      en: "GOODNBAD OS",
    },
    status: "Live",
    category: {
      ar: "منصة أعمال",
      en: "Portfolio platform",
    },
    year: "2026",
    href: "https://www.goodnbad.info",
    summary: {
      ar: "موقع portfolio مبني بـ Next.js وأُعيد بناؤه كموقع واضح مستوحى من أنظمة التشغيل لجهات التوظيف والمتعاونين والزوار التقنيين.",
      en: "A Next.js portfolio rebuilt as a clear OS-inspired website for recruiters, collaborators, and technical visitors.",
    },
    what: {
      ar: "نظام هوية ومشاريع عام يضم قوالب مسارات قابلة لإعادة الاستخدام وmiddleware يراعي الأمان ومحتوى منظّماً وصفحات ملائمة لجهات التوظيف.",
      en: "A public identity and project system with reusable route shells, security-aware middleware, structured content, and recruiter-friendly pages.",
    },
    why: {
      ar: "كان للموقع السابق محتوى مفيد لكنه احتاج إلى بنية أقوى وتنقّل أوضح وعرض عام راقٍ يحافظ في الوقت نفسه على هوية Goodnbad.exe.",
      en: "The previous site had useful content but needed a stronger structure, clearer navigation, and a premium public presentation that still carried the Goodnbad.exe identity.",
    },
    result: {
      ar: "أصبحت الصفحة الرئيسية ومسارات الملفات تتصرف كموقع اعتيادي مع الحفاظ على لغة بصرية مميزة لـ GOODNBAD OS.",
      en: "The homepage and dossier routes now behave like a normal website while preserving a distinctive GOODNBAD OS visual language.",
    },
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Middleware"],
    highlights: [
      {
        ar: "عناصر OS shell أساسية قابلة لإعادة الاستخدام لتنسيق متّسق للمسارات.",
        en: "Reusable OS shell primitives for consistent route layouts.",
      },
      {
        ar: "تعزيز الأمان لواجهات admin وdebug وwebhook والواجهات الداخلية.",
        en: "Security hardening for admin, debug, webhook, and internal surfaces.",
      },
      {
        ar: "تنقّل بلغة واضحة للزوار غير التقنيين.",
        en: "Plain-English navigation for non-technical visitors.",
      },
      {
        ar: "وحدات محتوى منظّمة قابلة للتوسّع للتحديثات المستقبلية.",
        en: "Structured content modules for scalable future updates.",
      },
    ],
    lessons: [
      {
        ar: "الثيم القوي يعمل بأفضل صورة عندما يدعم الوضوح بدلاً من أن يحلّ محله.",
        en: "A strong theme works best when it supports clarity instead of replacing it.",
      },
      {
        ar: "صفحات جهات التوظيف تحتاج إلى إجابات فورية قبل التفاصيل العميقة أو تفاعلات الـ terminal.",
        en: "Recruiter pages need immediate answers before deeper lore or terminal interactions.",
      },
    ],
  },
  {
    slug: "cybersecurity-ai-lab",
    code: "DEP-002",
    name: {
      ar: "مختبر الأمن السيبراني بالذكاء الاصطناعي",
      en: "Cybersecurity AI Lab",
    },
    shortName: {
      ar: "مختبر الأمن بالذكاء الاصطناعي",
      en: "Security AI Lab",
    },
    status: "Case study",
    category: {
      ar: "عرض أمني",
      en: "Security demo",
    },
    year: "2025",
    href: "/cybersecurity-ai",
    summary: {
      ar: "صفحة مفهوم أمني تفاعلية تستكشف كشف التهديدات المدعوم بالذكاء الاصطناعي وتقييم المخاطر وسير عمل الاستجابة.",
      en: "An interactive security concept page exploring AI-assisted threat detection, risk scoring, and response workflows.",
    },
    what: {
      ar: "عرض تجريبي يركّز على الأمن يحوّل مفاهيم الأمن السيبراني إلى وحدات مرئية لكشف التهديدات والتحليلات التنبؤية والاستجابة الآلية.",
      en: "A security-focused demo that turns cybersecurity concepts into visible modules for threat detection, predictive analytics, and automated response.",
    },
    why: {
      ar: "ساعد على إيصال الاهتمامات بالأمن السيبراني عبر واجهة سهلة الفهم بدلاً من ادّعاءات نصية ثابتة.",
      en: "It helped communicate cybersecurity interests through an approachable interface instead of static claims.",
    },
    result: {
      ar: "أنشأ عرضاً أمنياً موجّهاً للجمهور يربط بين مفاهيم الذكاء الاصطناعي وأمن السحابة والاستجابة للحوادث.",
      en: "Created a public-facing security showcase that connects AI, cloud security, and incident response concepts.",
    },
    tools: ["React", "Next.js", "Security UX", "AI concepts", "Microsoft security concepts"],
    highlights: [
      {
        ar: "مفهوم فحص تهديدات تفاعلي لإشراك المستخدم فوراً.",
        en: "Interactive threat scan concept for immediate user engagement.",
      },
      {
        ar: "بطاقات معيارية للكشف والتنبؤ والاستجابة وأمن الشبكات.",
        en: "Modular cards for detection, prediction, response, and network security.",
      },
      {
        ar: "صياغة مقروءة لجهات التوظيف لمواضيع الأمن السيبراني التقنية.",
        en: "Recruiter-readable framing for technical cybersecurity topics.",
      },
    ],
    lessons: [
      {
        ar: "العروض الأمنية تحتاج إلى صياغة دقيقة لتبدو موثوقة بدلاً من استعراضية.",
        en: "Security demos need careful framing so they look credible instead of theatrical.",
      },
      {
        ar: "التسميات الواضحة تجعل المواضيع المعقّدة أسهل في التقييم السريع.",
        en: "Plain labels make complex topics easier to evaluate quickly.",
      },
    ],
  },
  {
    slug: "magic-browser",
    code: "DEP-003",
    name: {
      ar: "Magic Browser",
      en: "Magic Browser",
    },
    shortName: {
      ar: "Magic Browser",
      en: "Magic Browser",
    },
    status: "Rebuilding",
    category: {
      ar: "تجربة ويب",
      en: "Web experiment",
    },
    year: "2024",
    href: "https://goodnbadexe.github.io/MagicB/",
    summary: {
      ar: "تجربة واجهة متصفح تركّز على إعادة التفكير في كيفية تفاعل المستخدمين مع تصفّح الويب واكتشافه.",
      en: "A browser-interface experiment focused on rethinking how users interact with web navigation and discovery.",
    },
    what: {
      ar: "مشروع front-end يجرّب تجربة شبيهة بمتصفّح مخصّص وسلوك واجهة مختلف.",
      en: "A front-end project that experiments with a custom browser-like experience and interface behavior.",
    },
    why: {
      ar: "كان مهماً كتمرين مبكر في التفكير المنتج: الهدف كان تجاوز الصفحة الثابتة الاعتيادية وتصميم نموذج تفاعل أكثر استكشافاً.",
      en: "It mattered as an early product-thinking exercise: the goal was to move beyond a normal static page and design a more exploratory interaction model.",
    },
    result: {
      ar: "أُطلق في الأصل كنشر على GitHub Pages. وتجري إعادة نشره عبر pipeline بناء مؤتمت.",
      en: "Originally shipped as a GitHub Pages deployment. Being redeployed with an automated build pipeline.",
    },
    tools: ["React", "Vite", "Framer Motion", "Tailwind CSS", "GitHub Pages"],
    highlights: [
      {
        ar: "واجهة مستوحاة من المتصفّح ومخصّصة.",
        en: "Custom browser-inspired UI.",
      },
      {
        ar: "نشر عام بوصول مباشر للزوار.",
        en: "Public deployment with direct visitor access.",
      },
      {
        ar: "دليل مبكر على التجريب في المنتج والتفاعل.",
        en: "Early evidence of product and interaction experimentation.",
      },
    ],
    lessons: [
      {
        ar: "النماذج الأولية الصغيرة مفيدة عندما تختبر فكرة تفاعل واحدة بوضوح.",
        en: "Small prototypes are useful when they test one interaction idea clearly.",
      },
      {
        ar: "النشر العام يخلق دليلاً أقوى من إبقاء التجارب محلية.",
        en: "Shipping publicly creates stronger evidence than keeping experiments local.",
      },
    ],
  },
  {
    slug: "masarat-events",
    code: "DEP-004",
    name: {
      ar: "موقع مسارات للفعاليات",
      en: "Masarat Events Website",
    },
    shortName: {
      ar: "مسارات للفعاليات",
      en: "Masarat Events",
    },
    status: "Live",
    category: {
      ar: "موقع عميل",
      en: "Client website",
    },
    year: "2024",
    href: "https://www.masaratevents.com",
    summary: {
      ar: "موقع شركة فعاليات مبني لعرض الخدمات ومصداقية العلامة التجارية والمعلومات العامة للشركة.",
      en: "A corporate events website built to present services, brand credibility, and public company information.",
    },
    what: {
      ar: "موقع موجّه للأعمال لشركة فعاليات مع التركيز على عرض نظيف وسهولة فهم الزائر.",
      en: "A business-facing website for an events company with emphasis on clean presentation and easy visitor comprehension.",
    },
    why: {
      ar: "كان المشروع مهماً لأنه انتقل من التجريب الشخصي إلى حضور ويب خارجي عملي لجمهور حقيقي.",
      en: "The project mattered because it moved from personal experimentation into a practical external web presence for a real audience.",
    },
    result: {
      ar: "تسليم موقع شركة عام يدعم اكتشاف العلامة التجارية والتعريف بالخدمات.",
      en: "Delivered a public company website that supports brand discovery and service communication.",
    },
    tools: ["Web design", "Responsive layout", "Content structure", "Frontend development"],
    highlights: [
      {
        ar: "بنية صفحات موجّهة للأعمال.",
        en: "Business-oriented page structure.",
      },
      {
        ar: "موقع إنتاج عام.",
        en: "Public production site.",
      },
      {
        ar: "تركيز على الوضوح للزوار غير التقنيين.",
        en: "Focus on clarity for non-technical visitors.",
      },
    ],
    lessons: [
      {
        ar: "العمل الموجّه للعميل يعتمد على الوضوح أكثر من الحداثة.",
        en: "Client-facing work depends on clarity more than novelty.",
      },
      {
        ar: "الموقع يجب أن يشرح العمل قبل أن يعرض الحِرفة.",
        en: "A site has to explain the business before it shows the craft.",
      },
    ],
  },
  {
    slug: "prompting-is-all-you-need",
    code: "DEP-005",
    name: {
      ar: "Prompting Is All You Need",
      en: "Prompting Is All You Need",
    },
    shortName: {
      ar: "عرض Prompting",
      en: "Prompting Demo",
    },
    status: "Live",
    category: {
      ar: "عرض تعليمي للذكاء الاصطناعي",
      en: "AI learning demo",
    },
    year: "2024",
    href: "https://v0-prompting-is-all-you-need-ashy-delta.vercel.app/",
    summary: {
      ar: "عرض مركّز حول أنماط هندسة التلقين وكيف تغيّر التعليمات المنظّمة جودة مخرجات الذكاء الاصطناعي.",
      en: "A focused demo about prompt engineering patterns and how structured instructions change AI output quality.",
    },
    what: {
      ar: "عرض ويب موجّه للتعلّم يقدّم مفاهيم التلقين عبر واجهة عامة موجزة.",
      en: "A learning-oriented web demo that presents prompting concepts through a concise public interface.",
    },
    why: {
      ar: "جسّد تعلّماً عملياً للذكاء الاصطناعي في وقت أصبح فيه تصميم التلقين مهارة أساسية للأتمتة وسير عمل البرمجيات.",
      en: "It captured practical AI learning at a time when prompt design became a core skill for automation and software workflows.",
    },
    result: {
      ar: "نشر نسخة قابلة للمشاركة على Vercel توثّق التفكير في التفاعل مع الذكاء الاصطناعي بصيغة ملموسة.",
      en: "Published a shareable Vercel deployment that documents AI interaction thinking in a concrete format.",
    },
    tools: ["Vercel", "Frontend development", "Prompt engineering", "AI workflow design"],
    highlights: [
      {
        ar: "موضوع واضح حول جودة التلقين وتصميم التعليمات.",
        en: "Clear theme around prompt quality and instruction design.",
      },
      {
        ar: "نشر عام لسهولة المراجعة.",
        en: "Public deployment for easy review.",
      },
      {
        ar: "ربط التجريب في الذكاء الاصطناعي ببناء واجهات عملية.",
        en: "Connected AI experimentation to practical interface building.",
      },
    ],
    lessons: [
      {
        ar: "التلقينات الجيدة أنظمة منظّمة، لا مجرد صياغة ذكية.",
        en: "Good prompts are structured systems, not just clever wording.",
      },
      {
        ar: "عروض الذكاء الاصطناعي أقوى عندما تُظهر سير عمل عملياً.",
        en: "AI demos are stronger when they show a practical workflow.",
      },
    ],
  },
  {
    slug: "pixel-game",
    code: "DEP-006",
    name: {
      ar: "Pixel Game X and O",
      en: "Pixel Game X and O",
    },
    shortName: {
      ar: "Pixel Game",
      en: "Pixel Game",
    },
    status: "Live",
    category: {
      ar: "نموذج لعبة أولي",
      en: "Game prototype",
    },
    year: "2024",
    href: "https://v0-pixel-game-idea-two.vercel.app/",
    summary: {
      ar: "نموذج أولي للعبة إكس-أو بأسلوب مميّز يستخدم رسومات مستوحاة من البكسل ومنطق لعب تفاعلي بسيط.",
      en: "A stylized tic-tac-toe game prototype using pixel-inspired visuals and simple interactive game logic.",
    },
    what: {
      ar: "لعبة متصفّح خفيفة تجمع القواعد الكلاسيكية بأسلوب بصري مناسب للنمذجة السريعة.",
      en: "A lightweight browser game that combines classic rules with a visual style suitable for fast prototyping.",
    },
    why: {
      ar: "كان مهماً كدليل على منطق الواجهة التفاعلية وإدارة الحالة والتصميم البصري الموجّه للّعب.",
      en: "It mattered as proof of interactive UI logic, state handling, and play-focused visual design.",
    },
    result: {
      ar: "إطلاق نموذج أولي قابل للّعب في المتصفّح يوضّح التكرار السريع من الفكرة إلى تجربة منشورة.",
      en: "Shipped a playable browser prototype that demonstrates quick iteration from idea to deployed experience.",
    },
    tools: ["React", "Game state", "Vercel", "Pixel-style UI", "Frontend prototyping"],
    highlights: [
      {
        ar: "تفاعل قابل للّعب بدلاً من نموذج ثابت.",
        en: "Playable interaction instead of a static mockup.",
      },
      {
        ar: "قواعد بسيطة منفّذة في واجهة متصفّح.",
        en: "Simple rules implemented in a browser interface.",
      },
      {
        ar: "دورة نشر سريعة من الفكرة إلى رابط حيّ.",
        en: "Fast deployment cycle from concept to live link.",
      },
    ],
    lessons: [
      {
        ar: "الألعاب تكشف مشاكل حالة الواجهة بسرعة.",
        en: "Games expose UI state issues quickly.",
      },
      {
        ar: "المشاريع المرحة الصغيرة مفيدة للتمرّن على إتقان التفاعل.",
        en: "Small playful builds are useful for practicing interaction polish.",
      },
    ],
  },
  {
    slug: "raining-characters",
    code: "DEP-007",
    name: {
      ar: "Raining Characters",
      en: "Raining Characters",
    },
    shortName: {
      ar: "Raining Characters",
      en: "Raining Characters",
    },
    status: "Live",
    category: {
      ar: "تجربة بصرية",
      en: "Visual experiment",
    },
    year: "2024",
    href: "https://v0-raining-characters-ten-livid.vercel.app/",
    summary: {
      ar: "تأثير مطر أحرف متحرك مستوحى من فيلم Matrix — مبني كتجربة front-end بصرية.",
      en: "An animated character rain effect inspired by the Matrix — built as a visual front-end experiment.",
    },
    what: {
      ar: "عرض بصري بصفحة واحدة بأحرف متحركة متساقطة تُعرض في المتصفّح.",
      en: "A single-page visual demo with cascading animated characters rendered in the browser.",
    },
    why: {
      ar: "تجربة إبداعية سريعة لاستكشاف الرسوم المتحركة عبر canvas أو DOM بفكرة بصرية معروفة.",
      en: "A quick creative experiment to explore canvas or DOM-based animation with a recognizable visual idea.",
    },
    result: {
      ar: "نُشر كنشر على Vercel وكان دليلاً مبكراً على التفكير في front-end القائم على الرسوم المتحركة.",
      en: "Published as a Vercel deployment and served as early evidence of animation-focused front-end thinking.",
    },
    tools: ["React", "Vercel", "CSS animation", "Frontend prototyping"],
    highlights: [
      {
        ar: "مفهوم رسوم متحركة لافت بصرياً.",
        en: "Visually striking animation concept.",
      },
      {
        ar: "تكرار سريع من الفكرة إلى تجربة منشورة.",
        en: "Fast iteration from idea to deployed experiment.",
      },
      {
        ar: "يُظهر تفكير front-end إبداعياً يتجاوز الواجهات النفعية.",
        en: "Demonstrates creative front-end thinking beyond utility UIs.",
      },
    ],
    lessons: [
      {
        ar: "العروض البصرية تنقل الشخصية بطرق لا يستطيع النص نقلها.",
        en: "Visual demos communicate personality in ways text cannot.",
      },
      {
        ar: "حتى تجربة رسوم متحركة بسيطة تستحق النشر علناً.",
        en: "Even a simple animation experiment is worth shipping publicly.",
      },
    ],
  },
  {
    slug: "hos-first-website",
    code: "DEP-008",
    name: {
      ar: "HOS — الموقع الأول",
      en: "HOS — First Website",
    },
    shortName: {
      ar: "HOS",
      en: "HOS",
    },
    status: "Archived",
    category: {
      ar: "مشروع البداية",
      en: "Origin project",
    },
    year: "2023",
    href: "https://goodnbadexe.github.io/HOS/",
    summary: {
      ar: "الموقع العام الأول — معلَم يؤرّخ لبداية رحلة Goodnbad.exe على الويب.",
      en: "The first public website — a milestone that marks the beginning of the Goodnbad.exe web journey.",
    },
    what: {
      ar: "موقع ثابت مبكر مستضاف على GitHub Pages، يمثّل أول نشر عام كامل.",
      en: "An early static website hosted on GitHub Pages, representing the first complete public deployment.",
    },
    why: {
      ar: "يمثّل نقطة الانطلاق: أول مرة تنتقل فيها فكرة من ملفات محلية إلى رابط حيّ متاح للجميع.",
      en: "It represents the starting point: the first time an idea went from local files to a live URL accessible to anyone.",
    },
    result: {
      ar: "نقطة مرجعية دائمة في الأعمال — أُبقي حياً كسجلّ صادق لمكان بداية العمل.",
      en: "A permanent reference point in the portfolio — kept live as an honest record of where the work started.",
    },
    tools: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    highlights: [
      {
        ar: "أول مشروع عام منشور بالكامل.",
        en: "First fully deployed public project.",
      },
      {
        ar: "أساس لكل أعمال الويب اللاحقة.",
        en: "Foundation for all subsequent web work.",
      },
      {
        ar: "يُظهر المسار الكامل من مشروع مبتدئ إلى أعمال بمستوى نظام تشغيل.",
        en: "Demonstrates the full arc from beginner project to OS-grade portfolio.",
      },
    ],
    lessons: [
      {
        ar: "كل خبير بدأ بموقعه الأول.",
        en: "Every expert started with a first website.",
      },
      {
        ar: "إبقاء الأعمال المبكرة ظاهرة يُظهر الثقة والنمو.",
        en: "Keeping early work visible shows confidence and growth.",
      },
    ],
  },
  // ── CLIENT WORK ──────────────────────────────────────────────────────────
  {
    slug: "athr-website",
    code: "DEP-009",
    name: {
      ar: "Athr — موقع عميل",
      en: "Athr — Client Website",
    },
    shortName: {
      ar: "Athr",
      en: "Athr",
    },
    status: "Live",
    category: {
      ar: "موقع عميل",
      en: "Client website",
    },
    year: "2025",
    href: "https://athr-website-pi.vercel.app",
    summary: {
      ar: "موقع علامة تجارية لـ Athr، بُني عبر جولات متعددة من مراجعة العميل وتكرارات قائمة على الملاحظات.",
      en: "A brand website for Athr, built through multiple rounds of client review and annotation-driven iterations.",
    },
    what: {
      ar: "موقع احترافي موجّه للعميل طُوّر بتعاون وثيق، مع دمج دورات ملاحظات العميل مباشرة في عملية التصميم والبناء.",
      en: "A professional client-facing website developed with close collaboration, incorporating client feedback cycles directly into the design and build process.",
    },
    why: {
      ar: "أظهر القدرة على العمل مع ملخّصات عملاء حقيقية والتكرار على الملاحظات المشروحة وتسليم موقع بمستوى إنتاج على نطاق حيّ.",
      en: "Demonstrated the ability to work with real client briefs, iterate on annotated feedback, and deliver a production-grade site on a live domain.",
    },
    result: {
      ar: "تسليم موقع منقّح ومُراجَع ومنشور يعكس علامة Athr مع استضافة إنتاج على Vercel.",
      en: "Delivered a refined, reviewed, and deployed website reflecting the Athr brand with production Vercel hosting.",
    },
    tools: ["React", "Next.js", "Vercel", "Client collaboration", "Responsive design"],
    highlights: [
      {
        ar: "جولات مراجعة متعددة قائمة على الملاحظات المشروحة.",
        en: "Multiple annotation-driven revision rounds.",
      },
      {
        ar: "نشر إنتاج حيّ.",
        en: "Live production deployment.",
      },
      {
        ar: "خبرة سير عمل عميل حقيقي.",
        en: "Real client workflow experience.",
      },
    ],
    lessons: [
      {
        ar: "العمل مع العملاء يتطلّب صبراً مع دورات الملاحظات.",
        en: "Client work requires patience with feedback loops.",
      },
      {
        ar: "الملاحظات المشروحة تجعل طلبات التعديل ملموسة وقابلة للتنفيذ.",
        en: "Annotations make revision requests concrete and actionable.",
      },
    ],
  },
  // ── DESIGN SYSTEMS ───────────────────────────────────────────────────────
  {
    slug: "macos-mojave",
    code: "DEP-010",
    name: {
      ar: "واجهة macOS Mojave — نسخة React",
      en: "macOS Mojave UI — React Clone",
    },
    shortName: {
      ar: "macOS Mojave",
      en: "macOS Mojave",
    },
    status: "Live",
    category: {
      ar: "نظام تصميم واجهات",
      en: "UI design system",
    },
    year: "2024",
    href: "https://v0-macosmojave-coral.vercel.app",
    summary: {
      ar: "إعادة إنشاء دقيقة بـ React لواجهة سطح مكتب macOS Mojave — الـ dock والنوافذ وكل التفاصيل.",
      en: "A faithful React recreation of the macOS Mojave desktop interface — dock, windows, and all.",
    },
    what: {
      ar: "تحدٍّ في front-end لإعادة إنشاء تجربة سطح مكتب macOS Mojave في المتصفّح باستخدام React وTailwind.",
      en: "A front-end challenge to replicate the macOS Mojave desktop experience in the browser using React and Tailwind.",
    },
    why: {
      ar: "دفع انضباط الواجهة الدقيق بالبكسل والفهم العميق للطبقات والرسوم المتحركة وأنماط التصميم على مستوى النظام.",
      en: "Pushed pixel-perfect UI discipline and deep understanding of layering, animation, and system-level design patterns.",
    },
    result: {
      ar: "مشروع منشور على Vercel يُظهر التفكير في أنظمة التصميم على مستوى واجهة نظام التشغيل.",
      en: "A deployed Vercel project that demonstrates design system thinking at the OS interface level.",
    },
    tools: ["React", "Tailwind CSS", "Vercel", "UI cloning", "Animation"],
    highlights: [
      {
        ar: "إعادة إنشاء الـ Dock وإطار النوافذ في macOS.",
        en: "macOS Dock and window chrome recreation.",
      },
      {
        ar: "دراسة أنماط تصميم على مستوى النظام.",
        en: "System-level design pattern study.",
      },
      {
        ar: "منشور ومتاح للجميع.",
        en: "Deployed and publicly accessible.",
      },
    ],
    lessons: [
      {
        ar: "استنساخ الأنظمة القائمة يعلّمك قيود الواجهة التي لن تواجهها أبداً عند البناء من الصفر.",
        en: "Cloning existing systems teaches interface constraints you'd never encounter building from scratch.",
      },
      {
        ar: "واجهات مستوى نظام التشغيل لا تتسامح مع المسافات والتوقيت.",
        en: "OS-level UI is unforgiving about spacing and timing.",
      },
    ],
  },
  {
    slug: "calma-recreation",
    code: "DEP-011",
    name: {
      ar: "Calma — إعادة إنشاء واجهة تطبيق",
      en: "Calma — App UI Recreation",
    },
    shortName: {
      ar: "Calma",
      en: "Calma",
    },
    status: "Live",
    category: {
      ar: "إعادة إنشاء واجهة",
      en: "UI recreation",
    },
    year: "2024",
    href: "https://v0-calma-recreation.vercel.app",
    summary: {
      ar: "إعادة إنشاء في المتصفّح لواجهة تطبيق Calma — دراسة في التصميم النظيف البسيط للمنتج.",
      en: "A browser recreation of the Calma app interface — a study in clean, minimal product design.",
    },
    what: {
      ar: "إعادة إنشاء front-end لواجهة تطبيق واقعي لدراسة لغة التصميم الهادئة البسيطة وبنية المكوّنات.",
      en: "A front-end recreation of a real-world app's UI to study calm, minimal design language and component structure.",
    },
    why: {
      ar: "مشاريع إعادة الإنشاء تصقل القدرة على هندسة قرارات التصميم عكسياً وتنفيذها بدقة.",
      en: "Recreation projects sharpen the ability to reverse-engineer design decisions and implement them precisely.",
    },
    result: {
      ar: "مشروع منشور على Vercel يلتقط اللغة البصرية لمنتج حقيقي.",
      en: "A deployed Vercel project capturing the visual language of a real product.",
    },
    tools: ["React", "Tailwind CSS", "Vercel", "UI recreation"],
    highlights: [
      {
        ar: "دراسة تصميم منتج بسيط.",
        en: "Minimal product design study.",
      },
      {
        ar: "دقة على مستوى المكوّنات.",
        en: "Component-level precision.",
      },
      {
        ar: "عمل نظيف في الرسوم المتحركة والتنسيق.",
        en: "Clean animation and layout work.",
      },
    ],
    lessons: [
      {
        ar: "إعادة إنشاء التصميم الجيد من أسرع الطرق لاستيعابه.",
        en: "Recreating good design is one of the fastest ways to internalize it.",
      },
      {
        ar: "الواجهات البسيطة أصعب في إتقانها من المعقّدة.",
        en: "Minimal interfaces are harder to get right than complex ones.",
      },
    ],
  },
  {
    slug: "fstack-portfolio",
    code: "DEP-012",
    name: {
      ar: "F Stack Portfolio",
      en: "F Stack Portfolio",
    },
    shortName: {
      ar: "F Stack",
      en: "F Stack",
    },
    status: "Archived",
    category: {
      ar: "تجربة أعمال",
      en: "Portfolio experiment",
    },
    year: "2024",
    href: "https://v0-portfoliothefstack-sigma.vercel.app",
    summary: {
      ar: "تصميم أعمال بديل يستكشف اتجاهاً بصرياً مختلفاً قبل الاستقرار على ثيم نظام التشغيل.",
      en: "An alternative portfolio design exploring a different visual direction before settling on the OS theme.",
    },
    what: {
      ar: "تنسيق أعمال استكشافي اختبر لغة تصميم وبنية مختلفة لعرض العمل.",
      en: "An exploratory portfolio layout that tested a different design language and structure for presenting work.",
    },
    why: {
      ar: "ساعد التكرار على اتجاهات أعمال متعددة في توضيح أسلوب العرض الأنسب لهوية Goodnbad.exe.",
      en: "Iterating on multiple portfolio directions helped clarify what presentation style best fits the Goodnbad.exe identity.",
    },
    result: {
      ar: "أثرٌ تصميمي مفيد ساهم في تحديد اتجاه أعمال GOODNBAD OS النهائي.",
      en: "A useful design artifact that informed the final GOODNBAD OS portfolio direction.",
    },
    tools: ["React", "Vercel", "Portfolio design", "Layout exploration"],
    highlights: [
      {
        ar: "اتجاه بصري بديل.",
        en: "Alternative visual direction.",
      },
      {
        ar: "ساهم في قرار الأعمال النهائي.",
        en: "Informed final portfolio decision.",
      },
      {
        ar: "تكرار سريع باستخدام V0.",
        en: "Rapid V0 iteration.",
      },
    ],
    lessons: [
      {
        ar: "بناء نسخ متعددة قبل الالتزام يوفّر تحوّلات مكلفة لاحقاً.",
        en: "Building multiple versions before committing saves expensive pivots later.",
      },
    ],
  },
  // ── TOOLS & EXPERIMENTS ──────────────────────────────────────────────────
  {
    slug: "ascii-art-converter",
    code: "DEP-013",
    name: {
      ar: "محوّل ASCII Art",
      en: "ASCII Art Converter",
    },
    shortName: {
      ar: "محوّل ASCII",
      en: "ASCII Converter",
    },
    status: "Live",
    category: {
      ar: "أداة إبداعية",
      en: "Creative tool",
    },
    year: "2024",
    href: "https://v0-image-to-ascii-eta.vercel.app/",
    summary: {
      ar: "أداة متصفّح تحوّل الصور إلى ASCII art — تجمع التعبير الإبداعي بمعالجة الصور الخوارزمية.",
      en: "A browser tool that converts images into ASCII art — combining creative expression with algorithmic image processing.",
    },
    what: {
      ar: "محوّل صور إلى ASCII يعمل من جهة العميل ويربط قيم سطوع البكسل بأحرف داخل المتصفّح.",
      en: "A client-side image-to-ASCII converter that maps pixel luminance values to characters in the browser.",
    },
    why: {
      ar: "استكشف تقاطع البرمجة الإبداعية وصناعة الأدوات العملية — أداة مفيدة قابلة للمشاركة.",
      en: "Explored the intersection of creative coding and practical toolmaking — a shareable, useful utility.",
    },
    result: {
      ar: "أداة منشورة متاحة لأي شخص يرغب في توليد ASCII art من صوره.",
      en: "A deployed tool accessible to anyone wanting to generate ASCII art from their images.",
    },
    tools: ["React", "Canvas API", "Vercel", "Image processing", "Creative coding"],
    highlights: [
      {
        ar: "تحويل الصور إلى ASCII في الوقت الفعلي.",
        en: "Real-time image-to-ASCII conversion.",
      },
      {
        ar: "معالجة من جهة العميل بالكامل.",
        en: "Purely client-side processing.",
      },
      {
        ar: "مزيج إبداعي وتقني.",
        en: "Creative + technical blend.",
      },
    ],
    lessons: [
      {
        ar: "الأدوات المفيدة تُشارَك؛ والأدوات الإبداعية تُذكَر.",
        en: "Useful tools get shared; creative tools get remembered.",
      },
      {
        ar: "Canvas API قوي في معالجة الصور دون backend.",
        en: "Canvas API is powerful for image manipulation without a backend.",
      },
    ],
  },
  {
    slug: "financial-dashboard",
    code: "DEP-014",
    name: {
      ar: "لوحة بيانات مالية",
      en: "Financial Dashboard",
    },
    shortName: {
      ar: "لوحة بيانات مالية",
      en: "Finance Dashboard",
    },
    status: "Live",
    category: {
      ar: "عرض واجهة",
      en: "UI demo",
    },
    year: "2024",
    href: "https://v0-financial-dashboard-beryl-delta.vercel.app",
    summary: {
      ar: "عرض واجهة لوحة بيانات مالية — رسوم بيانية نظيفة ومقاييس وأنماط تصوير بيانات.",
      en: "A financial data dashboard UI demo — clean charts, metrics, and data visualisation patterns.",
    },
    what: {
      ar: "عرض واجهة لوحة بيانات بمقاييس مالية ومكوّنات رسوم بيانية وأنماط تنسيق بيانات.",
      en: "A dashboard interface demo with financial metrics, chart components, and data layout patterns.",
    },
    why: {
      ar: "تصميم لوحات البيانات مهارة مؤسسية أساسية — أظهر هذا القدرة على عرض البيانات الكثيفة بوضوح.",
      en: "Dashboard design is a core enterprise skill — this demonstrated the ability to handle dense data clearly.",
    },
    result: {
      ar: "مشروع منشور على Vercel يُظهر كفاءة في واجهات البيانات الكثيفة.",
      en: "A deployed Vercel project showing data-heavy UI competency.",
    },
    tools: ["React", "Charts", "Tailwind CSS", "Vercel", "Data visualisation"],
    highlights: [
      {
        ar: "بيانات كثيفة معروضة بوضوح.",
        en: "Dense data presented cleanly.",
      },
      {
        ar: "مكوّنات رسوم بيانية ومقاييس.",
        en: "Chart and metric components.",
      },
      {
        ar: "أنماط واجهة مؤسسية.",
        en: "Enterprise UI patterns.",
      },
    ],
    lessons: [
      {
        ar: "لوحات البيانات الجيدة تجعل البيانات قابلة للمسح قبل أن تجعلها عميقة.",
        en: "Good dashboards make data scannable before making it deep.",
      },
      {
        ar: "اللون والتسلسل الهرمي يحملان وزناً أكبر من التسميات في واجهات البيانات.",
        en: "Colour and hierarchy carry more weight than labels in data UIs.",
      },
    ],
  },
  {
    slug: "web-voting-system",
    code: "DEP-015",
    name: {
      ar: "نظام تصويت ويب",
      en: "Web Voting System",
    },
    shortName: {
      ar: "نظام تصويت",
      en: "Voting System",
    },
    status: "Live",
    category: {
      ar: "عرض تقنية مدنية",
      en: "Civic tech demo",
    },
    year: "2024",
    href: "https://v0-web-voting-system-fm5khggy5h8.vercel.app",
    summary: {
      ar: "نموذج أولي لنظام تصويت قائم على المتصفّح يوضّح جمع الأصوات وعرض النتائج في الوقت الفعلي.",
      en: "A browser-based voting system prototype demonstrating real-time vote collection and result display.",
    },
    what: {
      ar: "واجهة نظام تصويت front-end بعرض المرشحين وإرسال الأصوات وتصوير النتائج.",
      en: "A front-end voting system UI with candidate display, vote submission, and results visualisation.",
    },
    why: {
      ar: "التقنية المدنية والأنظمة الشفافة تحديات تصميمية مهمة — استكشف هذا كيف يمكن أن تبدو واجهة تصويت نظيفة.",
      en: "Civic tech and transparent systems are important design challenges — this explored what a clean voting UI could look like.",
    },
    result: {
      ar: "نموذج أولي منشور يُظهر تصميم واجهة مدنية تفاعلية.",
      en: "A deployed prototype showing interactive civic interface design.",
    },
    tools: ["React", "Vercel", "State management", "UI design"],
    highlights: [
      {
        ar: "واجهة جمع الأصوات.",
        en: "Vote collection interface.",
      },
      {
        ar: "عرض النتائج.",
        en: "Results display.",
      },
      {
        ar: "أنماط تصميم مدنية نظيفة.",
        en: "Clean civic design patterns.",
      },
    ],
    lessons: [
      {
        ar: "الثقة في النظام تأتي من الشفافية البصرية.",
        en: "Trust in a system comes from visual transparency.",
      },
      {
        ar: "واجهات التصويت يجب أن تكون واضحة لا لبس فيها قبل كل شيء.",
        en: "Voting UIs need to be unambiguous above all else.",
      },
    ],
  },
  {
    slug: "llm-interface",
    code: "DEP-016",
    name: {
      ar: "عرض واجهة LLM",
      en: "LLM Interface Demo",
    },
    shortName: {
      ar: "عرض LLM",
      en: "LLM Demo",
    },
    status: "Live",
    category: {
      ar: "عرض ذكاء اصطناعي",
      en: "AI demo",
    },
    year: "2024",
    href: "https://v0-llm-pji4wbxkm3u.vercel.app",
    summary: {
      ar: "عرض واجهة للتفاعل مع نماذج اللغة الكبيرة — يستكشف أنماط تصميم واجهة محادثة الذكاء الاصطناعي.",
      en: "An interface demo for interacting with large language models — exploring AI chat UI design patterns.",
    },
    what: {
      ar: "واجهة محادثة ذكاء اصطناعي front-end تستكشف أنماط تجربة المستخدم لتفاعلات LLM.",
      en: "A front-end AI chat interface exploring the UX patterns of LLM interactions.",
    },
    why: {
      ar: "فهم كيفية التصميم لمحادثات الذكاء الاصطناعي مهارة أساسية في المشهد التقني الحالي.",
      en: "Understanding how to design for AI conversations is a core skill in the current technical landscape.",
    },
    result: {
      ar: "عرض منشور على Vercel يوضّح التفكير في واجهات الذكاء الاصطناعي.",
      en: "A deployed Vercel demo illustrating AI interface thinking.",
    },
    tools: ["React", "Vercel", "AI UX", "Chat interface design"],
    highlights: [
      {
        ar: "واجهة محادثة بأسلوب LLM.",
        en: "LLM-style conversation UI.",
      },
      {
        ar: "أنماط تصميم تفاعل الذكاء الاصطناعي.",
        en: "AI interaction design patterns.",
      },
      {
        ar: "ترابط رسائل نظيف.",
        en: "Clean message threading.",
      },
    ],
    lessons: [
      {
        ar: "واجهات الذكاء الاصطناعي تحتاج إلى توصيل حدود النموذج، لا قدراته فقط.",
        en: "AI UIs need to communicate model limitations, not just capabilities.",
      },
      {
        ar: "الاستجابات المتدفّقة تغيّر طريقة تفكيرك في حالات التحميل.",
        en: "Streaming responses change how you think about loading states.",
      },
    ],
  },
  {
    slug: "satori-demo",
    code: "DEP-017",
    name: {
      ar: "Satori — عرض بصري",
      en: "Satori — Visual Demo",
    },
    shortName: {
      ar: "Satori",
      en: "Satori",
    },
    status: "Live",
    category: {
      ar: "تجربة بصرية",
      en: "Visual experiment",
    },
    year: "2024",
    href: "https://v0-satori-psi.vercel.app",
    summary: {
      ar: "تجربة بصرية وعرض تصميم يستكشف أفكار واجهات إبداعية.",
      en: "A visual experiment and design demo exploring creative interface ideas.",
    },
    what: {
      ar: "تجربة بصرية مبنية بـ V0 تختبر التصيير الإبداعي ومفاهيم التصميم.",
      en: "A V0-built visual experiment testing creative rendering and design concepts.",
    },
    why: {
      ar: "التجارب الإبداعية القصيرة تبقي عضلة التصميم نشطة بين المشاريع الأكبر.",
      en: "Short creative experiments keep the design muscle active between larger projects.",
    },
    result: {
      ar: "مشروع منشور على Vercel يلتقط فكرة بصرية مركّزة.",
      en: "A deployed Vercel project capturing a focused visual idea.",
    },
    tools: ["React", "Vercel", "Creative design"],
    highlights: [
      {
        ar: "نمذجة بصرية سريعة.",
        en: "Rapid visual prototyping.",
      },
      {
        ar: "استكشاف مفهوم إبداعي.",
        en: "Creative concept exploration.",
      },
      {
        ar: "منشور وقابل للمشاركة.",
        en: "Deployed and shareable.",
      },
    ],
    lessons: [
      {
        ar: "التجارب البصرية الصغيرة تستحق النشر حتى لو لم يكن لها فائدة عملية.",
        en: "Small visual experiments are worth shipping even if they have no utility.",
      },
    ],
  },
  {
    slug: "game-prototype-2",
    code: "DEP-018",
    name: {
      ar: "نموذج لعبة II",
      en: "Game Prototype II",
    },
    shortName: {
      ar: "نموذج لعبة II",
      en: "Game Prototype II",
    },
    status: "Live",
    category: {
      ar: "نموذج لعبة أولي",
      en: "Game prototype",
    },
    year: "2024",
    href: "https://v0-game-lijol99rutq.vercel.app",
    summary: {
      ar: "نموذج أولي ثانٍ للعبة متصفّح — استمرار في استكشاف حالة اللعبة التفاعلية والواجهة.",
      en: "A second browser game prototype — continuing exploration of interactive game state and UI.",
    },
    what: {
      ar: "لعبة متصفّح قابلة للّعب بُنيت كمتابعة لـ Pixel Game، تستكشف ميكانيكيات أو مقاربات بصرية مختلفة.",
      en: "A playable browser game built as a follow-up to the Pixel Game, exploring different mechanics or visual approaches.",
    },
    why: {
      ar: "تطوير الألعاب يُظهر باستمرار تحديات حالة الواجهة والتفاعل التي لا تكشفها الواجهات الثابتة أبداً.",
      en: "Game development consistently surfaces UI state and interaction challenges that static UIs never expose.",
    },
    result: {
      ar: "نموذج لعبة أولي منشور على Vercel.",
      en: "A deployed Vercel game prototype.",
    },
    tools: ["React", "Vercel", "Game state", "Interactive UI"],
    highlights: [
      {
        ar: "لعبة متصفّح قابلة للّعب.",
        en: "Playable browser game.",
      },
      {
        ar: "إدارة حالة تفاعلية.",
        en: "Interactive state management.",
      },
      {
        ar: "متابعة لـ Pixel Game X and O.",
        en: "Follow-up to Pixel Game X and O.",
      },
    ],
    lessons: [
      {
        ar: "كل نموذج لعبة أولي يعلّم شيئاً لم يعلّمه السابق.",
        en: "Each game prototype teaches something the last one didn't.",
      },
      {
        ar: "اللعب تمرين تصميمي جادّ.",
        en: "Play is a serious design exercise.",
      },
    ],
  },
  // ── CREATIVE & EXTERNAL PLATFORMS ────────────────────────────────────────
  {
    slug: "codepen-jjmnvvq",
    code: "DEP-019",
    name: {
      ar: "CodePen — تجربة إبداعية",
      en: "CodePen — Creative Experiment",
    },
    shortName: {
      ar: "CodePen Pen",
      en: "CodePen Pen",
    },
    status: "Live",
    category: {
      ar: "برمجة إبداعية",
      en: "Creative coding",
    },
    year: "2024",
    href: "https://codepen.io/Goodnbadexe/pen/JjmNvVQ",
    summary: {
      ar: "تجربة برمجة إبداعية على CodePen — فنّ CSS وJavaScript مبني مباشرة في المتصفّح.",
      en: "A CodePen creative coding experiment — CSS and JavaScript art built directly in the browser.",
    },
    what: {
      ar: "pen برمجة إبداعية مستقلة تستكشف أفكاراً بصرية أو تفاعلية باستخدام HTML وCSS وJavaScript خالصة.",
      en: "A standalone creative coding pen exploring visual or interactive ideas using pure HTML, CSS, and JavaScript.",
    },
    why: {
      ar: "صفحات CodePen تختبر حدس البرمجة الإبداعية في بيئة مقيّدة وفورية.",
      en: "CodePen pens test creative coding instincts in a constrained, immediate environment.",
    },
    result: {
      ar: "pen عام على CodePen يُظهر قدرات front-end إبداعية.",
      en: "A public pen on CodePen demonstrating creative front-end capabilities.",
    },
    tools: ["HTML", "CSS", "JavaScript", "CodePen"],
    highlights: [
      {
        ar: "برمجة إبداعية خالصة في المتصفّح.",
        en: "Pure browser creative coding.",
      },
      {
        ar: "بلا أدوات بناء — HTML/CSS/JS خام.",
        en: "No build tools — raw HTML/CSS/JS.",
      },
      {
        ar: "عام وقابل للمشاركة.",
        en: "Public and shareable.",
      },
    ],
    lessons: [
      {
        ar: "القيود في CodePen تفرض حلولاً إبداعية تجعلها الأطر سهلة التجنّب.",
        en: "Constraints in CodePen force creative solutions that frameworks make easy to avoid.",
      },
    ],
  },
  {
    slug: "sketchfab-3d",
    code: "DEP-020",
    name: {
      ar: "Sketchfab — أعمال ثلاثية الأبعاد",
      en: "Sketchfab — 3D Portfolio",
    },
    shortName: {
      ar: "أعمال 3D",
      en: "3D Work",
    },
    status: "Live",
    category: {
      ar: "نمذجة ثلاثية الأبعاد",
      en: "3D / modelling",
    },
    year: "2024",
    href: "https://sketchfab.com/Goodnbad.exe",
    summary: {
      ar: "نماذج ومشاهد ثلاثية الأبعاد منشورة على Sketchfab — عمل أصلي مبني من الصفر.",
      en: "3D models and scenes published on Sketchfab — original work built from scratch.",
    },
    what: {
      ar: "مجموعة من النماذج والبيئات ثلاثية الأبعاد الأصلية منشورة على منصة Sketchfab.",
      en: "A collection of original 3D models and environments published on the Sketchfab platform.",
    },
    why: {
      ar: "النمذجة ثلاثية الأبعاد من الصفر توسّع التفكير التصميمي إلى البُعد المكاني — قدرة تغذّي مباشرة تجارب الويب الغامرة.",
      en: "3D modelling from scratch expands design thinking into the spatial dimension — a capability that feeds directly into immersive web experiences.",
    },
    result: {
      ar: "أعمال Sketchfab عامة من عمل ثلاثي الأبعاد أصلي متاح للجميع.",
      en: "A public Sketchfab portfolio of original 3D work accessible to anyone.",
    },
    tools: ["3D modelling", "Sketchfab", "Blender / 3D tools"],
    highlights: [
      {
        ar: "نماذج ثلاثية الأبعاد أصلية مبنية من الصفر.",
        en: "Original 3D models built from scratch.",
      },
      {
        ar: "مستضافة علناً على Sketchfab.",
        en: "Publicly hosted on Sketchfab.",
      },
      {
        ar: "تغذّي أعمال الويب ثلاثية الأبعاد والتجارب التفاعلية.",
        en: "Feeds into web 3D and interactive experience work.",
      },
    ],
    lessons: [
      {
        ar: "النمذجة ثلاثية الأبعاد من الصفر تعلّم تفكيراً مكانياً لن يعلّمه عمل واجهات ثنائية الأبعاد أبداً.",
        en: "3D from scratch teaches spatial thinking that 2D UI work never will.",
      },
      {
        ar: "نشر الأعمال ثلاثية الأبعاد يفتح أبواباً في XR والألعاب والويب الغامر.",
        en: "Publishing 3D work opens doors in XR, game, and immersive web.",
      },
    ],
  },
  {
    slug: "blogspot",
    code: "DEP-021",
    name: {
      ar: "مدونة Goodnbad.exe",
      en: "Goodnbad.exe Blog",
    },
    shortName: {
      ar: "المدونة",
      en: "Blog",
    },
    status: "Live",
    category: {
      ar: "مدونة / كتابة",
      en: "Blog / writing",
    },
    year: "2023",
    href: "https://goodnbadexe.blogspot.com",
    summary: {
      ar: "مدونة Goodnbad.exe الأصلية — حيث نُشرت الأفكار والتجارب المبكرة.",
      en: "The original Goodnbad.exe blog — where early ideas, experiments, and thoughts were published.",
    },
    what: {
      ar: "مدونة مستضافة على Blogspot تلتقط الكتابات والمشاريع والتفكير المبكر خلف هوية Goodnbad.exe.",
      en: "A Blogspot-hosted blog capturing the early writing, projects, and thinking behind the Goodnbad.exe identity.",
    },
    why: {
      ar: "الكتابة عن العمل تفرض وضوح الفكر — تسبق المدونة أعمال نظام التشغيل وتوثّق الرحلة.",
      en: "Writing about work forces clarity of thought — the blog predates the OS portfolio and documents the journey.",
    },
    result: {
      ar: "أرشيف عام للأعمال والأفكار المبكرة وأصل علامة Goodnbad.exe.",
      en: "A public archive of early work, ideas, and the origin of the Goodnbad.exe brand.",
    },
    tools: ["Blogspot", "Writing", "Content creation"],
    highlights: [
      {
        ar: "أرشيف محتوى Goodnbad.exe الأصلي.",
        en: "Original Goodnbad.exe content archive.",
      },
      {
        ar: "يوثّق الرحلة المبكرة.",
        en: "Documents the early journey.",
      },
      {
        ar: "أعمال كتابة عامة.",
        en: "Public writing portfolio.",
      },
    ],
    lessons: [
      {
        ar: "الكتابة عن عملك تخلق سجلاً لا يصنعه الكود وحده أبداً.",
        en: "Writing about your work creates a record that code alone never does.",
      },
      {
        ar: "المدونة أرخص وسيلة ممكنة لبناء حضور عام.",
        en: "A blog is the cheapest possible way to build a public presence.",
      },
    ],
  },
]

export function getDeploymentBySlug(slug: string) {
  return deployments.find((deployment) => deployment.slug === slug)
}

export function getFeaturedDeployments() {
  return deployments.slice(0, 3)
}
