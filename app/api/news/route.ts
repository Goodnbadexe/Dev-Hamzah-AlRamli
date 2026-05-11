import { NextResponse } from 'next/server'

interface KevEntry {
  cveID: string
  vendorProject: string
  product: string
  vulnerabilityName: string
  dateAdded: string
  shortDescription: string
  requiredAction: string
  dueDate: string
  knownRansomwareCampaignUse: string
  notes: string
  cwes: string[]
}

export const revalidate = 1800

export async function GET() {
  try {
    const res = await fetch(
      'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
      { next: { revalidate: 1800 } }
    )
    if (!res.ok) throw new Error(`CISA fetch failed: ${res.status}`)

    const data = await res.json()
    const vulns: KevEntry[] = data.vulnerabilities

    const recent = vulns
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 24)
      .map((v) => ({
        id: v.cveID,
        title: v.vulnerabilityName,
        vendor: v.vendorProject,
        product: v.product,
        description: v.shortDescription,
        date: v.dateAdded,
        dueDate: v.dueDate,
        ransomware: v.knownRansomwareCampaignUse,
        cwes: v.cwes ?? [],
        category: categorizeCVE(v),
        severity: getSeverity(v),
        action: v.requiredAction,
        nvdUrl: `https://nvd.nist.gov/vuln/detail/${v.cveID}`,
      }))

    return NextResponse.json({
      ok: true,
      items: recent,
      total: vulns.length,
      source: 'CISA Known Exploited Vulnerabilities Catalog',
      fetchedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}

function categorizeCVE(v: KevEntry): string {
  const text = (v.vulnerabilityName + ' ' + v.shortDescription).toLowerCase()
  const cwes = v.cwes ?? []

  if (cwes.includes('CWE-89') || text.includes('sql injection')) return 'SQL Injection'
  if (cwes.includes('CWE-79') || text.includes('cross-site scripting') || text.includes(' xss')) return 'XSS'
  if (cwes.includes('CWE-78') || text.includes('command injection') || text.includes('os command')) return 'Command Injection'
  if (cwes.includes('CWE-22') || text.includes('path traversal') || text.includes('directory traversal')) return 'Path Traversal'
  if (cwes.includes('CWE-787') || cwes.includes('CWE-119') || text.includes('out-of-bounds') || text.includes('buffer overflow')) return 'Memory Corruption'
  if (cwes.includes('CWE-502') || text.includes('deserialization')) return 'Deserialization'
  if (cwes.includes('CWE-20') || text.includes('improper input validation')) return 'Input Validation'
  if (text.includes('remote code execution') || text.includes(' rce')) return 'RCE'
  if (text.includes('privilege escalation')) return 'Privilege Escalation'
  if (text.includes('authentication bypass') || text.includes('improper authentication')) return 'Auth Bypass'
  if (text.includes('use-after-free') || text.includes('use after free')) return 'Use After Free'
  if (text.includes('ssrf') || text.includes('server-side request forgery')) return 'SSRF'
  if (text.includes('xxe') || text.includes('xml external')) return 'XXE'
  return 'Vulnerability'
}

function getSeverity(v: KevEntry): 'critical' | 'high' | 'medium' {
  if (v.knownRansomwareCampaignUse === 'Known') return 'critical'
  const desc = v.shortDescription.toLowerCase()
  if (
    desc.includes('unauthenticated') ||
    desc.includes('remote code execution') ||
    desc.includes('root privilege') ||
    desc.includes('arbitrary code')
  )
    return 'critical'
  return 'high'
}
