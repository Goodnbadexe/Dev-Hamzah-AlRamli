/**
 * GOODNBAD OS — shared type definitions and app registry
 *
 * The OS_APPS array is the single source of truth for all app routes.
 * Import this wherever you need the nav structure (taskbar, sitemap, etc.)
 */

export type OSAppId =
  | 'personnel'
  | 'deployments'
  | 'signal'
  | 'contact'
  | 'terminal'

export type AestheticZone =
  | 'window'    // interactive, app-like — OSWindow chrome
  | 'dossier'   // document-like, authoritative — classified file aesthetic
  | 'feed'      // dynamic, real-time — log/stream aesthetic

export interface OSApp {
  id:       OSAppId
  /** System identifier shown in chrome and terminal, e.g. "personnel.exe" */
  osName:   string
  /** Human-readable label shown alongside OS name for clarity */
  label:    string
  /** Route path */
  route:    string
  /** Short description for tooltips and metadata */
  desc:     string
  /** Primary aesthetic zone for this app */
  zone:     AestheticZone
  /** Taskbar display code, e.g. "01" */
  code:     string
}

export const OS_APPS: OSApp[] = [
  {
    id:     'personnel',
    osName: 'personnel.exe',
    label:  'Career & Credentials',
    route:  '/personnel',
    desc:   'CV, certifications, experience, and capabilities — presented as a classified dossier.',
    zone:   'dossier',
    code:   '01',
  },
  {
    id:     'deployments',
    osName: 'deployments.sys',
    label:  'Projects & Builds',
    route:  '/deployments',
    desc:   'Active and archived system deployments — architecture, tools, problem → outcome.',
    zone:   'window',
    code:   '02',
  },
  {
    id:     'signal',
    osName: 'signal.feed',
    label:  'Live Activity',
    route:  '/signal',
    desc:   'GitHub activity, certification updates, current focus — live system log.',
    zone:   'feed',
    code:   '03',
  },
  {
    id:     'contact',
    osName: 'contact.enc',
    label:  'Get in Touch',
    route:  '/contact',
    desc:   'Initiate an encrypted transmission. Direct channel to Hamzah Al-Ramli.',
    zone:   'window',
    code:   '04',
  },
  {
    id:     'terminal',
    osName: 'terminal.sh',
    label:  'Command Interface',
    route:  '/terminal',
    desc:   'Interactive command layer. If you know, you know.',
    zone:   'window',
    code:   '05',
  },
]

/** Lookup a single app by route path */
export function getOSAppByRoute(pathname: string): OSApp | undefined {
  return OS_APPS.find(app => app.route === pathname || pathname.startsWith(app.route + '/'))
}
