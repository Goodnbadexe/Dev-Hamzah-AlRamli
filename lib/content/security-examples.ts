export type SecurityCase = {
  title: string
  type: string
  date: string
  summary: string
  lessons: string[]
  mitigations: string[]
  source: string
}

export const securityCases: SecurityCase[] = [
  {
    title: 'WannaCry Ransomware',
    type: 'Ransomware',
    date: 'May 2017',
    summary: 'Global ransomware leveraging EternalBlue to exploit SMBv1, encrypting files across organizations.',
    lessons: ['Patch critical systems promptly', 'Disable legacy protocols (SMBv1)', 'Maintain tested backups'],
    mitigations: ['Apply MS17-010', 'Network segmentation', 'Offline backup strategy'],
    source: 'https://en.wikipedia.org/wiki/WannaCry_ransomware_attack'
  },
  {
    title: 'NotPetya',
    type: 'Wiper/Ransomware',
    date: 'Jun 2017',
    summary: 'Destructive malware disguised as ransomware; spread via software update supply chain.',
    lessons: ['Validate supply chain integrity', 'Zero Trust on updates', 'Incident response drills'],
    mitigations: ['Code signing verification', 'Application allowlisting', 'Rapid isolate infected hosts'],
    source: 'https://en.wikipedia.org/wiki/Petya_(malware)#NotPetya'
  },
  {
    title: 'Equifax Breach',
    type: 'Web/Injection',
    date: '2017',
    summary: 'Exploitation of Apache Struts vulnerability leading to massive PII exposure.',
    lessons: ['Track CVEs and patch windows', 'WAF and RASP for legacy apps'],
    mitigations: ['Timely patching of Struts', 'Input validation', 'Threat monitoring'],
    source: 'https://en.wikipedia.org/wiki/Equifax_data_breach'
  },
  {
    title: 'SolarWinds Supply Chain',
    type: 'Supply Chain',
    date: 'Dec 2020',
    summary: 'Compromised build pipeline delivered trojanized updates to customers, enabling stealthy intrusion.',
    lessons: ['Protect build systems', 'Monitor anomalous behavior', 'Use SBOM'],
    mitigations: ['CI/CD hardening', 'Code signing keys hygiene', 'Runtime telemetry'],
    source: 'https://en.wikipedia.org/wiki/2020_United_States_federal_government_data_breach'
  },
  {
    title: 'Mirai Botnet DDoS',
    type: 'DDoS',
    date: 'Oct 2016',
    summary: 'IoT devices formed a botnet that launched massive DDoS attacks, impacting DNS providers.',
    lessons: ['Secure IoT defaults', 'Rate limiting and scrubbing'],
    mitigations: ['Strong credentials', 'DDoS protection services', 'IoT network isolation'],
    source: 'https://en.wikipedia.org/wiki/Mirai_(botnet)'
  },
  {
    title: 'Log4Shell',
    type: 'Zero‑Day',
    date: 'Dec 2021',
    summary: 'Critical RCE in Log4j via JNDI lookups, affecting countless Java applications.',
    lessons: ['Maintain SBOM', 'Rapid patch and temporary mitigations'],
    mitigations: ['Update Log4j', 'Disable JNDI lookups', 'WAF rules'],
    source: 'https://en.wikipedia.org/wiki/Log4Shell'
  },
  {
    title: 'Capital One Breach',
    type: 'Misconfiguration/SSRF',
    date: 'Jul 2019',
    summary: 'Exploited SSRF and misconfigured AWS IAM to access sensitive data.',
    lessons: ['Harden IAM policies', 'Validate metadata access'],
    mitigations: ['Least privilege', 'Block unauthorized metadata requests', 'Monitoring'],
    source: 'https://en.wikipedia.org/wiki/Capital_One#Data_breach'
  },
  {
    title: 'Twitter Social Engineering',
    type: 'Social Engineering',
    date: 'Jul 2020',
    summary: 'Employee-targeted attacks led to high-profile account compromise and scam tweets.',
    lessons: ['Employee security training', 'Strong internal access controls'],
    mitigations: ['MFA everywhere', 'Access review and approvals', 'Incident comms playbook'],
    source: 'https://en.wikipedia.org/wiki/2020_Twitter_account_hacks'
  }
]