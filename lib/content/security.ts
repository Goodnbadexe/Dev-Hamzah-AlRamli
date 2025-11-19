export type SecurityItem = {
  title: string
  summary: string
  tags: string[]
}

export const attacks: SecurityItem[] = [
  { title: 'Malware', summary: 'Malicious software (viruses, worms, spyware, ransomware) to steal data or cause damage.', tags: ['endpoint','ransomware','threats'] },
  { title: 'Phishing', summary: 'Impersonation via email/messages/sites to trick users into revealing secrets.', tags: ['social','email','cred-theft'] },
  { title: 'Ransomware', summary: 'Encrypts files and demands payment for decryption.', tags: ['ransomware','encryption'] },
  { title: 'Password Attacks', summary: 'Brute force, dictionary, credential stuffing to gain unauthorized access.', tags: ['auth','cred-theft'] },
  { title: 'Man-in-the-Middle (MitM)', summary: 'Intercepts and potentially alters communication between two parties.', tags: ['network','interception'] },
  { title: 'DDoS', summary: 'Flood of traffic overwhelms services to make them unavailable.', tags: ['availability','network'] },
  { title: 'SQL Injection', summary: 'Injects malicious SQL into data-driven apps to manipulate databases.', tags: ['web','injection'] },
  { title: 'Cross-Site Scripting (XSS)', summary: 'Injects scripts that execute in other users’ browsers.', tags: ['web','injection'] },
  { title: 'Session Hijacking', summary: 'Steals session IDs to impersonate users.', tags: ['web','auth'] },
  { title: 'Social Engineering', summary: 'Psychological manipulation to elicit confidential actions or info.', tags: ['human','process'] },
  { title: 'DNS Spoofing', summary: 'Corrupts DNS data to reroute traffic to fake websites.', tags: ['network','dns'] },
  { title: 'Zero-Day Exploits', summary: 'Targets undisclosed software vulnerabilities.', tags: ['vulns','unknown'] },
]

export const hackers: SecurityItem[] = [
  { title: 'White Hat', summary: 'Ethical hackers who legally find and fix vulnerabilities.', tags: ['ethical','defense'] },
  { title: 'Black Hat', summary: 'Malicious hackers exploiting vulnerabilities for gain or harm.', tags: ['malicious'] },
  { title: 'Gray Hat', summary: 'Operate in legal/ethical gray areas to reveal issues without permission.', tags: ['mixed'] },
  { title: 'Red Hat', summary: 'Counter black hats, sometimes using aggressive tactics to stop them.', tags: ['counter-ops'] },
  { title: 'Blue Hat', summary: 'Employed to find vulnerabilities before release or public discovery.', tags: ['pre-release'] },
  { title: 'Script Kiddies', summary: 'Inexperienced hackers using prebuilt tools/scripts.', tags: ['novice'] },
  { title: 'Hacktivists', summary: 'Political/social cause hackers (defacements, leaks, DDoS).', tags: ['cause'] },
]