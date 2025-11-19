export type SecurityItem = { title: string; summary: string; tags: string[] }
export type SecurityCase = {
  title: string
  type: string
  date: string
  summary: string
  lessons: string[]
  mitigations: string[]
  sourceLabel: string
  source: string
}

export const attacks = {
  en: [
    { title: 'Malware', summary: 'Malicious software (viruses, worms, spyware, ransomware) to steal data or cause damage.', tags: ['endpoint','ransomware','threats'] },
    { title: 'Phishing', summary: 'Impersonation via email/messages/sites to trick users into revealing secrets.', tags: ['social','email','cred-theft'] },
    { title: 'Ransomware', summary: 'Encrypts files and demands payment for decryption.', tags: ['ransomware','encryption'] },
    { title: 'Password Attacks', summary: 'Brute force, dictionary, credential stuffing to gain unauthorized access.', tags: ['auth','cred-theft'] },
    { title: 'Man-in-the-Middle (MitM)', summary: 'Intercepts and potentially alters communication between parties.', tags: ['network','interception'] },
    { title: 'DDoS', summary: 'Flood of traffic overwhelms services to make them unavailable.', tags: ['availability','network'] },
    { title: 'SQL Injection', summary: 'Injects malicious SQL into data-driven apps to manipulate databases.', tags: ['web','injection'] },
    { title: 'XSS', summary: 'Injects scripts that execute in other users’ browsers.', tags: ['web','injection'] },
    { title: 'Session Hijacking', summary: 'Steals session IDs to impersonate users.', tags: ['web','auth'] },
    { title: 'Social Engineering', summary: 'Psychological manipulation to elicit confidential actions or info.', tags: ['human','process'] },
    { title: 'DNS Spoofing', summary: 'Corrupts DNS data to reroute traffic to fake websites.', tags: ['network','dns'] },
    { title: 'Zero-Day Exploits', summary: 'Targets undisclosed software vulnerabilities.', tags: ['vulns','unknown'] },
  ] as SecurityItem[],
  ar: [
    { title: 'البرمجيات الخبيثة', summary: 'برمجيات ضارة (فيروسات، ديدان، برامج تجسس، فدية) لسرقة البيانات أو إحداث ضرر.', tags: ['الأجهزة','فدية','تهديدات'] },
    { title: 'التصيد الاحتيالي', summary: 'انتحال عبر البريد/الرسائل/المواقع لخداع المستخدمين لكشف المعلومات.', tags: ['اجتماعي','بريد','سرقة-بيانات'] },
    { title: 'برمجيات الفدية', summary: 'تشفير الملفات وطلب فدية لفك التشفير.', tags: ['فدية','تشفير'] },
    { title: 'هجمات كلمات المرور', summary: 'القوة الغاشمة/القواميس/حشو بيانات الاعتماد للوصول غير المصرح.', tags: ['تسجيل-الدخول','سرقة-بيانات'] },
    { title: 'الرجل في الوسط', summary: 'اعتراض وتعديل الاتصالات بين الأطراف دون علمهم.', tags: ['شبكة','اعتراض'] },
    { title: 'هجمات حجب الخدمة', summary: 'إغراق الخدمة بحركة مرور ضخمة لتعطيلها.', tags: ['توفر','شبكة'] },
    { title: 'حقن SQL', summary: 'إدخال استعلامات خبيثة للتلاعب بقواعد البيانات.', tags: ['ويب','حقن'] },
    { title: 'XSS', summary: 'حقن سكربتات تُنفّذ في متصفحات المستخدمين الآخرين.', tags: ['ويب','حقن'] },
    { title: 'اختطاف الجلسة', summary: 'سرقة معرّفات الجلسة لانتحال المستخدم.', tags: ['ويب','تسجيل-الدخول'] },
    { title: 'الهندسة الاجتماعية', summary: 'تلاعب نفسي لدفع الأشخاص للكشف أو التصرف.', tags: ['بشري','إجراءات'] },
    { title: 'تزوير DNS', summary: 'إفساد بيانات DNS لإعادة التوجيه لمواقع مزيفة.', tags: ['شبكة','DNS'] },
    { title: 'الثغرات يوم الصفر', summary: 'استهداف ثغرات غير مُعلنة في البرمجيات.', tags: ['ثغرات','غير-معروفة'] },
  ] as SecurityItem[],
}

export const hackers = {
  en: [
    { title: 'White Hat', summary: 'Ethical hackers who legally find and fix vulnerabilities.', tags: ['ethical','defense'] },
    { title: 'Black Hat', summary: 'Malicious hackers exploiting vulnerabilities for gain or harm.', tags: ['malicious'] },
    { title: 'Gray Hat', summary: 'Operate in legal/ethical gray areas to reveal issues without permission.', tags: ['mixed'] },
    { title: 'Red Hat', summary: 'Counter black hats, sometimes using aggressive tactics to stop them.', tags: ['counter-ops'] },
    { title: 'Blue Hat', summary: 'Find vulnerabilities before release or public discovery.', tags: ['pre-release'] },
    { title: 'Script Kiddies', summary: 'Inexperienced hackers using prebuilt tools/scripts.', tags: ['novice'] },
    { title: 'Hacktivists', summary: 'Political/social cause hackers (defacements, leaks, DDoS).', tags: ['cause'] },
  ] as SecurityItem[],
  ar: [
    { title: 'القبعة البيضاء', summary: 'مخترقون أخلاقيون يكتشفون الثغرات ويصلحونها قانونياً.', tags: ['أخلاقي','دفاع'] },
    { title: 'القبعة السوداء', summary: 'مخترقون خبيثون يستغلون الثغرات لأغراض ضارة.', tags: ['خبيث'] },
    { title: 'القبعة الرمادية', summary: 'يعملون في منطقة قانونية/أخلاقية رمادية لكشف المشاكل دون إذن.', tags: ['مختلط'] },
    { title: 'القبعة الحمراء', summary: 'يواجهون ذوي القبعات السوداء وأحياناً بأساليب هجومية.', tags: ['مضاد'] },
    { title: 'القبعة الزرقاء', summary: 'يكتشفون الثغرات قبل الإصدار أو الاكتشاف العام.', tags: ['قبل-الإصدار'] },
    { title: 'هواة السكربتات', summary: 'مبتدئون يعتمدون على سكربتات وأدوات جاهزة.', tags: ['مبتدئ'] },
    { title: 'الناشطون الإلكترونيون', summary: 'مخترقون لأهداف سياسية/اجتماعية (تشويه، تسريب، حجب خدمة).', tags: ['قضية'] },
  ] as SecurityItem[],
}

export const casesAttacks = {
  en: [
    {
      title: 'Log4Shell', type: 'Zero‑Day', date: '2021-12-09',
      summary: 'Critical RCE in Log4j via JNDI lookups affecting many Java apps.',
      lessons: ['Maintain SBOM', 'Rapid patch and temporary mitigations'],
      mitigations: ['Update Log4j', 'Disable JNDI lookups', 'WAF rules'],
      sourceLabel: 'Source', source: 'https://en.wikipedia.org/wiki/Log4Shell'
    },
    {
      title: 'SolarWinds Supply Chain', type: 'Supply Chain', date: '2020-12-13',
      summary: 'Compromised build pipeline delivered trojanized updates to customers.',
      lessons: ['Protect build systems', 'Monitor anomalous behavior', 'Use SBOM'],
      mitigations: ['CI/CD hardening', 'Signing key hygiene', 'Runtime telemetry'],
      sourceLabel: 'Source', source: 'https://en.wikipedia.org/wiki/2020_United_States_federal_government_data_breach'
    },
    {
      title: 'Equifax Breach', type: 'Web/Injection', date: '2017-09-07',
      summary: 'Exploitation of Apache Struts vulnerability led to massive PII exposure.',
      lessons: ['Track CVEs and patch windows', 'WAF/RASP for legacy apps'],
      mitigations: ['Timely patching', 'Input validation', 'Threat monitoring'],
      sourceLabel: 'Source', source: 'https://en.wikipedia.org/wiki/Equifax_data_breach'
    },
    {
      title: 'WannaCry Ransomware', type: 'Ransomware', date: '2017-05-12',
      summary: 'Global ransomware leveraging EternalBlue to exploit SMBv1, encrypting files across organizations.',
      lessons: ['Patch SMBv1', 'Segmentation', 'Tested backups'],
      mitigations: ['MS17-010', 'Network segmentation', 'Offline backups'],
      sourceLabel: 'Source', source: 'https://en.wikipedia.org/wiki/WannaCry_ransomware_attack'
    },
    {
      title: 'NotPetya', type: 'Wiper/Ransomware', date: '2017-06-27',
      summary: 'Destructive malware disguised as ransomware; spread via supply chain updates.',
      lessons: ['Validate updates', 'Allowlisting', 'Rapid isolation'],
      mitigations: ['Code signing verification', 'Application allowlisting', 'Isolate infected hosts'],
      sourceLabel: 'Source', source: 'https://en.wikipedia.org/wiki/Petya_(malware)#NotPetya'
    },
    {
      title: 'Mirai Botnet', type: 'DDoS', date: '2016-10-21',
      summary: 'IoT devices formed a botnet that launched massive DDoS attacks, impacting DNS providers.',
      lessons: ['Secure IoT defaults', 'Rate limiting and scrubbing'],
      mitigations: ['Strong credentials', 'DDoS protection services', 'IoT isolation'],
      sourceLabel: 'Source', source: 'https://en.wikipedia.org/wiki/Mirai_(botnet)'
    },
  ] as SecurityCase[],
  ar: [
    {
      title: 'Log4Shell', type: 'ثغرة يوم الصفر', date: '2021-12-09',
      summary: 'تنفيذ أوامر عن بعد في Log4j عبر JNDI أثّر على العديد من تطبيقات جافا.',
      lessons: ['الحفاظ على قائمة المكوّنات (SBOM)', 'تحديثات سريعة مع حلول مؤقتة'],
      mitigations: ['تحديث Log4j', 'تعطيل JNDI', 'قواعد WAF'],
      sourceLabel: 'المصدر', source: 'https://ar.wikipedia.org/wiki/Log4Shell'
    },
    {
      title: 'سولارويندز وسلسلة التوريد', type: 'سلسلة توريد', date: '2020-12-13',
      summary: 'اختراق خط البناء لإصدار تحديثات مُسمّمة لعملاء الشركة.',
      lessons: ['حماية أنظمة البناء', 'مراقبة السلوك الشاذ', 'استخدام SBOM'],
      mitigations: ['تقوية CI/CD', 'نظافة مفاتيح التوقيع', 'قياس الأداء أثناء التشغيل'],
      sourceLabel: 'المصدر', source: 'https://en.wikipedia.org/wiki/2020_United_States_federal_government_data_breach'
    },
    {
      title: 'اختراق إيكويفاكس', type: 'ويب/حقن', date: '2017-09-07',
      summary: 'استغلال ثغرة في Apache Struts أدى إلى تسريب واسع للبيانات الشخصية.',
      lessons: ['متابعة الثغرات والتحديثات', 'WAF/RASP للتطبيقات القديمة'],
      mitigations: ['تحديثات في الوقت المناسب', 'التحقق من المدخلات', 'مراقبة التهديدات'],
      sourceLabel: 'المصدر', source: 'https://en.wikipedia.org/wiki/Equifax_data_breach'
    },
    {
      title: 'واناكراي', type: 'فدية', date: '2017-05-12',
      summary: 'برمجية فدية استغلت SMBv1 لتشفير الملفات على نطاق واسع.',
      lessons: ['ترقيع SMBv1', 'تجزئة الشبكة', 'نسخ احتياطي مُختَبَر'],
      mitigations: ['MS17-010', 'تجزئة الشبكة', 'نسخ احتياطي دون اتصال'],
      sourceLabel: 'المصدر', source: 'https://ar.wikipedia.org/wiki/واناكراي'
    },
    {
      title: 'نوت بيتيا', type: 'ماسح/فدية', date: '2017-06-27',
      summary: 'برمجية مدمّرة متخفية كفدية انتشرت عبر تحديثات سلسلة التوريد.',
      lessons: ['تحقق من نزاهة التحديثات', 'القوائم البيضاء', 'عزل سريع'],
      mitigations: ['التحقق من التوقيع', 'قوائم السماح للتطبيقات', 'عزل الأجهزة المصابة'],
      sourceLabel: 'المصدر', source: 'https://en.wikipedia.org/wiki/Petya_(malware)#NotPetya'
    },
    {
      title: 'ميراي بوتنت', type: 'حجب خدمة', date: '2016-10-21',
      summary: 'أجهزة إنترنت الأشياء شكّلت شبكة لشن هجمات حجب خدمة ضخمة أثّرت على مزوّدي DNS.',
      lessons: ['تأمين إعدادات الأجهزة', 'تحديد المعدلات والتنظيف'],
      mitigations: ['كلمات مرور قوية', 'خدمات حماية DDoS', 'عزل شبكات IoT'],
      sourceLabel: 'المصدر', source: 'https://en.wikipedia.org/wiki/Mirai_(botnet)'
    },
  ] as SecurityCase[],
}

export const casesHackers = {
  en: [
    {
      title: 'Twitter Social Engineering', type: 'Social Engineering', date: '2020-07-15',
      summary: 'Employee-targeted attacks led to high-profile account compromises and scam posts.',
      lessons: ['Employee security training', 'Strong internal access controls'],
      mitigations: ['MFA everywhere', 'Access review/approvals', 'Incident comms playbook'],
      sourceLabel: 'Source', source: 'https://en.wikipedia.org/wiki/2020_Twitter_account_hacks'
    },
    {
      title: 'Uber 2022 Breach', type: 'Credential/Theft', date: '2022-09-15',
      summary: 'MFA fatigue and internal access misuse revealed sensitive resources.',
      lessons: ['MFA protections against push fatigue', 'Granular internal access'],
      mitigations: ['Number matching', 'Conditional access', 'Monitoring'],
      sourceLabel: 'Source', source: 'https://en.wikipedia.org/wiki/Uber#2022_data_breach'
    }
    {
      title: 'Lapsus$', type: 'Extortion/Source Code Theft', date: '2022-03-23',
      summary: 'Group compromised companies via social engineering and MFA fatigue, leaking source code.',
      lessons: ['Strong identity protections', 'Vendor access reviews'],
      mitigations: ['MFA number matching', 'Just‑in‑time access', 'Audit trails'],
      sourceLabel: 'Source', source: 'https://en.wikipedia.org/wiki/Lapsus$'
    },
    {
      title: 'Anonymous Ops', type: 'Hacktivism', date: '2022-03-01',
      summary: 'Coordinated DDoS/defacement campaigns tied to geopolitical events.',
      lessons: ['DDoS resilience', 'Rapid takedown procedures'],
      mitigations: ['Scrubbing centers', 'CSP/WAF hardening'],
      sourceLabel: 'Source', source: 'https://en.wikipedia.org/wiki/Anonymous_(hacker_group)'
    }
  ] as SecurityCase[],
  ar: [
    {
      title: 'اختراق تويتر بالهندسة الاجتماعية', type: 'هندسة اجتماعية', date: '2020-07-15',
      summary: 'استهداف الموظفين أدى لاختراق حسابات بارزة ونشر منشورات احتيالية.',
      lessons: ['تدريب أمني للموظفين', 'ضبط قوي للوصول الداخلي'],
      mitigations: ['تفعيل MFA في كل مكان', 'مراجعات الوصول والموافقات', 'خطة تواصل للحوادث'],
      sourceLabel: 'المصدر', source: 'https://en.wikipedia.org/wiki/2020_Twitter_account_hacks'
    },
    {
      title: 'اختراق أوبر 2022', type: 'بيانات اعتماد/سرقة', date: '2022-09-15',
      summary: 'إرهاق إشعارات MFA وسوء استخدام الوصول الداخلي كشف موارد حساسة.',
      lessons: ['حماية MFA ضد إرهاق الدفع', 'وصول داخلي دقيق'],
      mitigations: ['مطابقة الأرقام', 'وصول شرطي', 'مراقبة'],
      sourceLabel: 'المصدر', source: 'https://en.wikipedia.org/wiki/Uber#2022_data_breach'
    }
    {
      title: 'Lapsus$', type: 'ابتزاز/سرقة الشفرة', date: '2022-03-23',
      summary: 'استهداف الشركات بالهندسة الاجتماعية وإرهاق MFA وتسريب الشفرات.',
      lessons: ['حماية الهوية القوية', 'مراجعة وصول المورّدين'],
      mitigations: ['مطابقة الأرقام في MFA', 'وصول في الوقت المناسب', 'سجلات تدقيق'],
      sourceLabel: 'المصدر', source: 'https://en.wikipedia.org/wiki/Lapsus$'
    },
    {
      title: 'عمليات أنونيموس', type: 'نشاط إلكتروني', date: '2022-03-01',
      summary: 'حملات منسقة لحجب الخدمة وتشويه الصفحات مرتبطة بأحداث سياسية.',
      lessons: ['مرونة ضد حجب الخدمة', 'إجراءات إيقاف سريعة'],
      mitigations: ['مراكز تنظيف الحركة', 'تقوية WAF/CSP'],
      sourceLabel: 'المصدر', source: 'https://en.wikipedia.org/wiki/Anonymous_(hacker_group)'
    }
  ] as SecurityCase[],
}

export const i18nFallbacks = {
  attacks: (lang: string) => (attacks as any)[lang] || (attacks as any)['en'],
  hackers: (lang: string) => (hackers as any)[lang] || (hackers as any)['en'],
  casesAttacks: (lang: string) => (casesAttacks as any)[lang] || (casesAttacks as any)['en'],
  casesHackers: (lang: string) => (casesHackers as any)[lang] || (casesHackers as any)['en'],
}