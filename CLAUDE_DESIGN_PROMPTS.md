# Claude Design Prompts — goodnbad.info

Two ready-to-paste prompts for **claude.ai/design**, plus a reference on how your
current attack globe works. Built to match the goodnbad.exe OS aesthetic
(zinc-950 + emerald `#10b981`, monospace, "classified terminal" tone).

---

## How your globe currently "sends cyber attacks"

Your live globe is `components/threat-globe.tsx` (and `signal/ThreatGlobe.tsx`).
The "attacks" are **animated great-circle arcs** between countries:

1. **`NODES`** — 17 countries stored as `[lat, lng]` (US, China, Russia, Iran, NK, …).
2. **`ThreatArc`** — an attack: `{ from, to, type, progress, speed, color, tail }`,
   where `type` is `APT | Ransomware | DDoS | Phishing | Exploit` (each a distinct color).
3. **`latLngToVec3` → `slerp3` → `vec3ToLatLng`** — converts both endpoints to 3D
   unit vectors, then **spherical-linear-interpolates** between them. That traces the
   shortest path *over the sphere's surface* (a great circle) — the curved "attack beam".
4. **`project()`** — orthographic projection of each point to 2D, hiding the back hemisphere.
5. Each arc animates by advancing `progress`; it's drawn as a fading gradient trail with a
   glowing **head dot**. When `progress > 1.1` the arc respawns from a random `INITIAL_ARCS` pair.
6. Endpoint countries pulse with emerald rings while active.

So: **pick two countries → interpolate a curve across the globe → animate a glowing head
along it → respawn.** That's the whole illusion of a live attack map.

---

## PROMPT 1 — Better cyber-attack globe (for Claude Design)

> Build an interactive **cyber threat attack globe** as a self-contained HTML/CSS/JS
> prototype. Dark hacker-OS aesthetic: background `#09090b` (zinc-950), primary accent
> emerald `#10b981`, monospace UI labels, subtle scanline texture.
>
> **The globe:** a 3D rotating Earth with real continent landmasses (use three.js +
> a globe library, or D3-geo orthographic with world-atlas country outlines). Slow
> idle rotation (~25s/revolution), draggable to spin, with a faint emerald graticule
> and an outer atmospheric glow ring.
>
> **The attacks:** animated **great-circle arcs** launching between attacker and target
> countries. Each arc has: an origin pulse, a glowing head that travels along the curve,
> and a fading tail. Color-code by threat type — APT `#ef4444`, Ransomware `#f97316`,
> DDoS `#eab308`, Phishing `#3b82f6`, Exploit `#a855f7`. Stagger 8–14 concurrent arcs.
> Target countries flash a shockwave ring on impact.
>
> **HUD overlay (monospace, terminal style):**
> - top-left: live counter — "ATTACKS / MIN", "ACTIVE NODES", a tiny sparkline
> - bottom-left: color legend for the 5 threat types
> - right rail: a scrolling live feed of events — `[04:12] APT · China → US · BLOCKED`
> - a "LIVE TRACKING" status pill with a blinking red dot
>
> **Interaction:** hover a country → tooltip with attacks sent/received; click → filter
> the feed to that country. A top toolbar to filter by threat type.
>
> Use ~20 real countries with `[lat, lng]` coordinates. Make it feel like a SOC
> (Security Operations Center) wall display — cinematic, dense, but readable. No fake
> chart-junk; every element should carry real (simulated) data. Respect
> `prefers-reduced-motion` by slowing rotation and arc speed.
>
> Reference for the arc math: convert each `[lat,lng]` to a 3D unit vector, **slerp**
> between origin and target to get the curved path, then animate a head along it.

When you export the handoff bundle, tell me to implement it as a React component in the
`components/signal/` folder, matching the `OSWindow` chrome and emerald palette already
in this codebase, and to keep it `dynamic({ ssr: false })` like the current globe so it
never blocks first paint.

---

## PROMPT 2 — Level up the whole website's visuals (for Claude Design)

> I have a cybersecurity portfolio, **goodnbad.info**, built as a fictional operating
> system — "GOODNBAD.EXE OS". Stack: Next.js 16 + React 19 + Tailwind + Radix.
> Aesthetic: dark (zinc-950), emerald `#10b981` primary accent, monospace + sans pairing,
> "classified terminal / SOC" tone. The metaphor is an OS desktop: every section is an
> app window (`OSWindow`) with a title bar, status dot, and scanline shimmer.
>
> Act as my **design director**. Use your design skills to elevate the visual quality
> without abandoning the brand. I want it to look like a real, opinionated product —
> not a generic SaaS template. Deliver HTML/CSS/JS prototypes for:
>
> 1. **A refreshed homepage / OS desktop** — stronger visual hierarchy, an editorial
>    hero, an intentional app-launcher grid (bento, not uniform cards), depth via
>    layering and shadows, and one memorable signature element.
> 2. **A polished `OSWindow` system** — refined title-bar chrome, active/idle/alert
>    states, hover micro-interactions, and a depth/elevation scale.
> 3. **A typography + color token sheet** — a distinctive display/body font pairing
>    (NOT Inter/Roboto/Arial), an emerald-anchored palette with semantic colors for the
>    threat types, spacing rhythm, and radius/shadow scales as CSS variables.
> 4. **Data-viz treatments** — how stats, feeds, and the threat globe should look as
>    first-class parts of the design system (not afterthoughts).
>
> Constraints: keep it dark and emerald, keep the terminal/monospace voice, stay
> accessible (contrast, focus states, reduced-motion), and animate only
> compositor-friendly properties (transform/opacity). Avoid: glow blobs, random
> gradients, fake dashboards, uniform card grids, generic centered hero + gradient.
>
> Give me a clear style direction first (name it), a moodboard rationale, then the
> prototypes. I'll hand the export to a coding agent to implement in Next.js.

When you export, tell me to implement it incrementally — tokens first
(`app/globals.css` + `tailwind.config.ts`), then `OSWindow`, then the homepage —
and to preserve the existing routes and brand direction per `CLAUDE.md`.

---

### After you get the Claude Design handoff back

Come back here and say: *"Fetch this design file, read its readme, and implement it"*
with the handoff URL — exactly like the Globe Loader. I'll port the prototype into your
Next.js codebase faithfully.
