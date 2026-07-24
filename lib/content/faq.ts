// lib/content/faq.ts
// Purpose: Bilingual (Arabic + English) FAQ knowledge base that grounds the
// portfolio chat assistant. Every answer the assistant gives MUST come from
// this file (plus the context blurb) — it is the single source of truth so the
// bot never invents facts about Hamzah, his services, or the Toolkit Vault.
//
// Facts here are derived from lib/content/personnel.ts, lib/social/profiles.ts,
// lib/content/contact.ts, and lib/subscribe/config.ts. Keep them in sync.

/** Bilingual user-facing string. URLs/emails stay inline in the copy. */
export type Bilingual = { ar: string; en: string }

export type FAQItem = {
  /** Stable key — handy for React list keys and analytics. */
  key: string
  q: Bilingual
  a: Bilingual
}

/**
 * Short bilingual portfolio/context blurb injected into the system prompt.
 * Gives the model the high-level "who/what/where" so it can answer naturally
 * without restating a Q&A verbatim. Kept tight to stay cache-friendly.
 */
export const portfolioContext: Bilingual = {
  ar:
    "حمزة الرملي (الاسم المستعار Goodnbad.exe) خبير أمن سيبراني ومصمم وسائط متعددة " +
    "وأخصائي مدعوم بالذكاء الاصطناعي، مقيم في الرياض، المملكة العربية السعودية. يجمع " +
    "بين تحليل البرمجيات الخبيثة والاستخبارات التهديدية والكشف عن الحوادث من جهة، " +
    "والتصميم الجرافيكي وهوية العلامة التجارية وإنتاج الفيديو وتطوير الويب بـ Next.js و React " +
    "من جهة أخرى. حاصل على شهادة علوم الحاسوب من جامعة تايلورز (جائزة 2024). يدير أيضًا " +
    "«خزينة الأدوات» (the Toolkit Vault): اشتراك شهري بـ 8 دولار يرسل حقيبة أدوات أمن وذكاء " +
    "اصطناعي أسبوعية بصيغة PDF عبر goodnbad.info/subscribe. هذا المساعد يجيب فقط عن " +
    "الأسئلة المتعلقة بحمزة وخدماته وأعماله وخزينة الأدوات.",
  en:
    "Hamzah Al-Ramli (alias Goodnbad.exe) is a cybersecurity expert, creative " +
    "multimedia designer, and AI-augmented engineer based in Riyadh, Saudi Arabia. " +
    "He pairs malware analysis, threat intelligence, and incident detection with " +
    "graphic design, brand identity, video production, and full-stack web work in " +
    "Next.js and React. He holds a Computer Science degree from Taylor's University " +
    "(Award recipient 2024). He also runs the Toolkit Vault: an $8/month membership " +
    "that delivers a weekly security + AI tools PDF via goodnbad.info/subscribe. " +
    "This assistant answers only questions about Hamzah, his services, his work, " +
    "and the Toolkit Vault.",
}

export const faqItems: FAQItem[] = [
  {
    key: "who-is-hamzah",
    q: {
      ar: "من هو حمزة الرملي؟",
      en: "Who is Hamzah Al-Ramli?",
    },
    a: {
      ar:
        "حمزة الرملي (Goodnbad.exe) خبير أمن سيبراني ومصمم وسائط متعددة مقيم في الرياض، " +
        "المملكة العربية السعودية. يجمع بين تحليل البرمجيات الخبيثة والاستخبارات التهديدية " +
        "والكشف عن الحوادث، وبين التصميم وهوية العلامة التجارية وتطوير الويب الكامل.",
      en:
        "Hamzah Al-Ramli (Goodnbad.exe) is a cybersecurity expert and creative " +
        "multimedia designer based in Riyadh, Saudi Arabia. He combines malware " +
        "analysis, threat intelligence, and incident detection with design, brand " +
        "identity, and full-stack web development.",
    },
  },
  {
    key: "location",
    q: {
      ar: "أين يقع حمزة وهل يعمل عن بُعد؟",
      en: "Where is Hamzah based and does he work remotely?",
    },
    a: {
      ar:
        "حمزة مقيم في الرياض، المملكة العربية السعودية، ومتاح للفرص عن بُعد وفي الموقع " +
        "في مختلف دول مجلس التعاون الخليجي.",
      en:
        "Hamzah is based in Riyadh, Saudi Arabia, and is available for remote and " +
        "on-site opportunities across the GCC.",
    },
  },
  {
    key: "cybersecurity-services",
    q: {
      ar: "ما خدمات الأمن السيبراني التي يقدمها؟",
      en: "What cybersecurity services does he offer?",
    },
    a: {
      ar:
        "تحليل البرمجيات الخبيثة والتحقيق الديناميكي، والاستخبارات التهديدية وOSINT، " +
        "وأمن الشبكات (أساسيات CCNA)، وإدارة الثغرات، والاستجابة للحوادث والكشف عنها.",
      en:
        "Malware analysis and dynamic investigation, threat intelligence and OSINT, " +
        "network security (CCNA fundamentals), vulnerability management, and incident " +
        "response and detection.",
    },
  },
  {
    key: "creative-services",
    q: {
      ar: "ما خدمات التصميم والوسائط المتعددة؟",
      en: "What design and multimedia services does he offer?",
    },
    a: {
      ar:
        "التصميم الجرافيكي وهوية العلامة التجارية، ومونتاج الفيديو (Adobe Premiere Pro و Avid)، " +
        "والرسوم المتحركة والتجارب التفاعلية، وتصميم واجهات المستخدم والويب المتجاوب، وإنتاج " +
        "محتوى وسائل التواصل الاجتماعي.",
      en:
        "Graphic design and brand identity, video editing (Adobe Premiere Pro, Avid), " +
        "animation and interactive experiences, UI/UX and responsive web design, and " +
        "social media content production.",
    },
  },
  {
    key: "development-services",
    q: {
      ar: "ما خدمات التطوير والبرمجة؟",
      en: "What development services does he offer?",
    },
    a: {
      ar:
        "تطوير ويب كامل بـ Next.js و React و TypeScript، وبرمجة بلغات Python و JavaScript و Java و PHP، " +
        "وتطبيقات iOS (Swift) و Android، وتطبيقات مدعومة بقواعد بيانات، وتطوير مُعزَّز بالذكاء الاصطناعي.",
      en:
        "Full-stack web development in Next.js, React, and TypeScript; programming in " +
        "Python, JavaScript, Java, and PHP; iOS (Swift) and Android apps; database-backed " +
        "applications; and AI-augmented development.",
    },
  },
  {
    key: "automation-services",
    q: {
      ar: "هل يبني أتمتة وسير عمل بالذكاء الاصطناعي؟",
      en: "Does he build automation and AI workflows?",
    },
    a: {
      ar:
        "نعم — أتمتة سير العمل باستخدام n8n ووكلاء الذكاء الاصطناعي، وتحليلات Google Analytics، " +
        "وإدارة العلامة التجارية، وإدارة المشاريع، واستراتيجية SEO والمحتوى.",
      en:
        "Yes — workflow automation with n8n and AI agents, Google Analytics and digital " +
        "analytics, brand management, project management, and SEO and content strategy.",
    },
  },
  {
    key: "availability",
    q: {
      ar: "هل حمزة متاح للتوظيف؟",
      en: "Is Hamzah available for hire?",
    },
    a: {
      ar:
        "نعم. حمزة منفتح على فرص الأمن السيبراني والاستخبارات التهديدية وتصميم الوسائط المتعددة " +
        "والتطوير الكامل. للتواصل المباشر استخدم صفحة Contact (البريد الإلكتروني أو LinkedIn).",
      en:
        "Yes. Hamzah is open to cybersecurity, threat intelligence, multimedia design, and " +
        "full-stack development opportunities. To reach out directly, use the Contact page " +
        "(email or LinkedIn).",
    },
  },
  {
    key: "hiring-process",
    q: {
      ar: "كيف يبدأ التواصل مع جهات التوظيف؟",
      en: "How should recruiters get in touch?",
    },
    a: {
      ar:
        "أفضل وسيلة للتواصل الأول هي البريد الإلكتروني أو LinkedIn عبر صفحة Contact. اذكر الدور " +
        "والمشروع والجدول الزمني والخطوة التالية المفضلة لتسريع الرد.",
      en:
        "The best first contact is email or LinkedIn via the Contact page. Include the role, " +
        "project, timeline, and preferred next step to get a fast reply.",
    },
  },
  {
    key: "contact",
    q: {
      ar: "كيف أتواصل مع حمزة؟",
      en: "How can I contact Hamzah?",
    },
    a: {
      ar:
        "عبر صفحة Contact في الموقع، التي تتضمن البريد الإلكتروني و LinkedIn و GitHub ورابط تحميل " +
        "السيرة الذاتية. البريد و LinkedIn هما الأنسب للفرص المباشرة.",
      en:
        "Through the Contact page on this site, which lists email, LinkedIn, GitHub, and a " +
        "resume download. Email and LinkedIn are best for direct opportunities.",
    },
  },
  {
    key: "resume",
    q: {
      ar: "هل يمكنني تحميل سيرته الذاتية؟",
      en: "Can I download his resume?",
    },
    a: {
      ar:
        "نعم — يتوفر زر تحميل السيرة الذاتية (PDF) في صفحة Contact.",
      en:
        "Yes — a resume download (PDF) is available on the Contact page.",
    },
  },
  {
    key: "certifications",
    q: {
      ar: "ما الشهادات التي يحملها؟",
      en: "What certifications does he hold?",
    },
    a: {
      ar:
        "من أبرزها: شهادات LetsDefend (Dynamic Analyst و Malware Analyzer و First Blood)، وشهادة " +
        "Google للأمن السيبراني المهنية، وتقييم CompTIA Security+ و CySA+ من IBM، و«الذكاء التوليدي " +
        "لتعزيز مسيرة الأمن السيبراني» من IBM، وأساسيات شبكات CCNA 200-301.",
      en:
        "Highlights include LetsDefend badges (Dynamic Analyst, Malware Analyzer, First Blood), " +
        "the Google Cybersecurity Professional Certificate, IBM's CompTIA Security+ & CySA+ " +
        "assessment, IBM's Generative AI for Cybersecurity, and CCNA 200-301 Network Fundamentals.",
    },
  },
  {
    key: "education",
    q: {
      ar: "ما خلفيته التعليمية؟",
      en: "What is his educational background?",
    },
    a: {
      ar:
        "حاصل على شهادة في علوم الحاسوب من جامعة تايلورز (Taylor's University)، وهو من الحاصلين " +
        "على جائزة الجامعة لعام 2024.",
      en:
        "He holds a Computer Science degree from Taylor's University and is a recipient of the " +
        "Taylor's University Award 2024.",
    },
  },
  {
    key: "experience",
    q: {
      ar: "ما خبرته العملية؟",
      en: "What is his professional experience?",
    },
    a: {
      ar:
        "تجمع خبرته بين الأمن السيبراني العملي (تحليل البرمجيات الخبيثة والاستخبارات التهديدية " +
        "والكشف) وتصميم الوسائط المتعددة والبناء الكامل (Next.js و React و Python و iOS/Android). " +
        "يمكنك مراجعة GitHub والسيرة الذاتية في صفحة Contact للتفاصيل.",
      en:
        "His experience spans hands-on cybersecurity (malware analysis, threat intelligence, " +
        "detection), multimedia design, and full-stack building (Next.js, React, Python, " +
        "iOS/Android). See his GitHub and resume on the Contact page for details.",
    },
  },
  {
    key: "toolkit-vault-what",
    q: {
      ar: "ما هي «خزينة الأدوات» (the Toolkit Vault)؟",
      en: "What is the Toolkit Vault?",
    },
    a: {
      ar:
        "خزينة الأدوات اشتراك يرسل حقيبة أدوات أمن سيبراني وذكاء اصطناعي أسبوعية بصيغة PDF — أدوات " +
        "ومستودعات مختارة تنسخها مباشرة في Claude أو ChatGPT أو Codex لتحسين سير عملك. اشترك عبر " +
        "goodnbad.info/subscribe.",
      en:
        "The Toolkit Vault is a subscription that delivers a weekly security + AI tools PDF — " +
        "curated tools and repos you drop straight into Claude, ChatGPT, or Codex to upgrade " +
        "your workflow. Subscribe at goodnbad.info/subscribe.",
    },
  },
  {
    key: "toolkit-vault-price",
    q: {
      ar: "كم تكلفة خزينة الأدوات؟",
      en: "How much does the Toolkit Vault cost?",
    },
    a: {
      ar:
        "8 دولارات شهريًا، مع خيار اشتراك سنوي بسعر مخفّض. وصول فوري وإلغاء في أي وقت. اشترك عبر " +
        "goodnbad.info/subscribe.",
      en:
        "$8 per month, with a discounted yearly option. Instant access and cancel anytime. " +
        "Subscribe at goodnbad.info/subscribe.",
    },
  },
  {
    key: "toolkit-vault-who",
    q: {
      ar: "لمن صُمّمت خزينة الأدوات؟",
      en: "Who is the Toolkit Vault for?",
    },
    a: {
      ar:
        "لكل من يريد سير عمل أنظف بالذكاء الاصطناعي — مطوّرون ومتخصصو أمن وصُنّاع محتوى يبحثون عن " +
        "أدوات ومستودعات سرية لا يجدها الجميع. تتراكم الحقيبة كل أسبوع فوق ما قبله. ابدأ من " +
        "goodnbad.info/subscribe.",
      en:
        "Anyone who wants a cleaner AI workflow — developers, security folks, and creators " +
        "looking for underground tools and repos most people never find. The toolkit compounds " +
        "every week on the last. Start at goodnbad.info/subscribe.",
    },
  },
  {
    key: "subscribe-how",
    q: {
      ar: "كيف أشترك في خزينة الأدوات؟",
      en: "How do I subscribe to the Toolkit Vault?",
    },
    a: {
      ar:
        "اذهب إلى goodnbad.info/subscribe، أجب عن الأسئلة القصيرة لتخصيص خطتك، ثم أكمل الاشتراك. " +
        "الوصول فوري والإلغاء متاح في أي وقت.",
      en:
        "Go to goodnbad.info/subscribe, answer the short questions to personalize your plan, " +
        "then complete checkout. Access is instant and you can cancel anytime.",
    },
  },
  {
    key: "languages",
    q: {
      ar: "بأي اللغات يمكنني التحدث معه؟",
      en: "What languages can I use here?",
    },
    a: {
      ar:
        "هذا المساعد يرد بالعربية والإنجليزية. اطرح سؤالك بأي منهما وسيُجيب بنفس لغتك.",
      en:
        "This assistant replies in both Arabic and English. Ask in either and it will answer " +
        "in the same language you used.",
    },
  },
]
