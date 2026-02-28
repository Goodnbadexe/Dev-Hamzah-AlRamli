// === METADATA ===
// Purpose: Portfolio landing page UI with Education section icon behavior
// Author: @Goodnbad.exe
// Inputs: N/A
// Outputs: Rendered Next.js page; hover swaps for Taylor's icons
// Assumptions: TailwindCSS configured; images exist in /public/images
// Tests: Manual UI check at `http://localhost:3000/` Education section
// Security: No secrets; static assets only; client-side rendering
// Complexity: O(N) rendering where N = elements on page
// === END METADATA ===
'use client';

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  ArrowRight,
  Code,
  Server,
  FileCode,
  Award,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Terminal,
  Cpu,
  Braces,
  FileText,
  Download,
  ChevronDown,
  Shield,
  AlertTriangle,
  Bug,
  Brain,
  Bot,
  Lock,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HackerTerminal } from "@/components/hacker-terminal"
import { SocialButton } from "@/components/social-button"
import { MobileNav } from "@/components/mobile-nav"
import { MobileTerminal } from "@/components/mobile-terminal"
import { GlitchText } from "@/components/glitch-text"
import { MatrixBackground } from "@/components/matrix-background"
import { ParticleAnimation } from "@/components/particle-animation"
import { DateTimeDisplay } from "@/components/datetime-display"
import CluesDock from "@/components/clues-dock"

export default function Home() {
  const [showMobileTerminal, setShowMobileTerminal] = useState(false)
  const [activeSkillTab, setActiveSkillTab] = useState("programming")

  // Auto-rotate skills tabs
  useEffect(() => {
    const skillTabs = ["programming", "frontend", "backend", "devops", "mobile", "design"]
    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % skillTabs.length
      setActiveSkillTab(skillTabs[currentIndex])
    }, 4000) // Rotate every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white relative overflow-hidden">
      <MatrixBackground />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Hamzah Al-Ramli',
        url: 'https://www.goodnbad.info',
        jobTitle: 'IT Systems & Support Administrator',
        address: { '@type': 'PostalAddress', addressLocality: 'Riyadh', addressCountry: 'SA' }
      }) }} />

      {/* Navigation */}
      <header className="container mx-auto py-6 relative z-10">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-24 h-24">
              <Image
                src="/images/logo-green.png"
                alt="Goodnbad.exe Logo"
                width={96}
                height={96}
                className="rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <GlitchText text="Goodnbad.exe" className="font-bold text-xl" />
              <DateTimeDisplay />
            </div>
          </div>

          <div className="hidden md:flex gap-6">
            <Link href="#about" className="hover:text-emerald-400 transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#skills" className="hover:text-emerald-400 transition-colors relative group">
              Skills
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#projects" className="hover:text-emerald-400 transition-colors relative group">
              Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#experience" className="hover:text-emerald-400 transition-colors relative group">
              Experience
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#portfolio" className="hover:text-emerald-400 transition-colors relative group">
              Portfolio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#contact" className="hover:text-emerald-400 transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400 hidden md:flex"
              asChild
            >
              <Link href="/files/hamzah-al-ramli-resume.pdf" target="_blank" download="Hamzah-Al-Ramli-Resume.pdf">
                <FileText className="mr-2 h-4 w-4" /> Resume
              </Link>
            </Button>
            <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400 hidden md:flex" asChild>
              <Link href="/security">
                <Shield className="mr-2 h-4 w-4" /> Security Atlas
              </Link>
            </Button>
            <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500/20 hover:text-purple-400 hidden md:flex" asChild>
              <Link href="/cybersecurity-ai">
                <Brain className="mr-2 h-4 w-4" /> Cybersecurity AI
              </Link>
            </Button>

            <MobileNav 
              showTerminal={showMobileTerminal}
              onToggleTerminal={() => setShowMobileTerminal(!showMobileTerminal)}
            />
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto py-12 md:py-20 px-4">
          <HackerTerminal />
          {/* Cybersecurity badge and tagline */}
          <div className="mt-6 text-center">
            <Badge className="mb-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Shield className="w-3 h-3 mr-1" /> Cybersecurity
            </Badge>
            <p className="text-sm md:text-base text-zinc-300">
              <GlitchText text="Threat Analysis" /> • <GlitchText text="Vulnerability Management" /> • <GlitchText text="Incident Response" />
            </p>
          </div>
        </section>

        {/* Arrow Indicator */}
        <div className="flex justify-center mb-8 relative z-10">
          <div className="animate-bounce">
            <ChevronDown className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        {/* Particle Animation Section */}
        <section className="relative h-64 md:h-80 lg:h-96 mb-12 md:mb-16 lg:mb-20 overflow-hidden">
          <div className="absolute inset-0" style={{ zIndex: 1 }}>
            <ParticleAnimation />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-zinc-900/50 py-20 relative">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none">
                <Code className="w-3 h-3 mr-1" /> About Me
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <GlitchText text="Fresh Graduate & Developer" />
              </h2>
              <p className="text-zinc-400">
                Analytical and adaptive junior cybersecurity engineer with a foundation in computer science. Skilled in system security, vulnerability management, and threat analysis, with hands-on exposure to SIEM tools, network monitoring, and risk assessment.
              </p>
              {/* Bullet strengths */}
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-zinc-300">
                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-500" /> <GlitchText text="Threat Analysis" /></span>
                <span className="flex items-center gap-2"><Bug className="w-4 h-4 text-emerald-500" /> <GlitchText text="Vulnerability Management" /></span>
                <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-emerald-500" /> <GlitchText text="Incident Response" /></span>
              </div>
              {/* Cert ribbon */}
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Badge className="bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700/50 animate-pulse">Google Cybersecurity</Badge>
                <Badge className="bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700/50 animate-pulse">IBM Cybersecurity Assessment</Badge>
                <Badge className="bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700/50 animate-pulse">Google Analytics</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-emerald-500 group-hover:animate-pulse" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {/* Item 1 */}
                    <li className="flex flex-col group relative overflow-hidden pt-3 pb-3 transition-all duration-300 group-hover:pb-28">
                      {/* Large centered overlay logo appears below content on hover; no reserved space by default */}
                      <div className="absolute inset-x-0 bottom-3 z-40 pointer-events-none transition-all duration-300 h-0 group-hover:h-28">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src="/images/Taylors-University-Logo-Vector.svg-.png"
                            alt="Taylor's University Logo"
                            fill
                            priority
                            className="object-contain glitch-img transition-opacity transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-110 group-hover:translate-y-[1px]"
                          />
                        </div>
                      </div>
                      <span className="font-medium flex items-center gap-2 transition-colors duration-300 relative z-50 group-hover:text-emerald-400">
                        {/* Icon container with overlayed large logo constrained */}
                        <span className="relative inline-flex items-center justify-center w-[22px] h-[22px]">
                          {/* Default small T icon (no border) */}
                          <Image
                            src="/images/taylors-small.png"
                            alt="Taylor's University Icon"
                            width={22}
                            height={22}
                            className="transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                          />
                        </span>
                        Bachelor's in Computer Science
                      </span>
                      {/* Subline: university/date remains visible; no duplicate degree on hover */}
                      <span className="relative z-50 mt-2 text-sm text-zinc-400">
                        Taylor's University, Malaysia (2019-2025)
                      </span>
                    </li>
                    {/* Item 2 */}
                    <li className="flex flex-col group relative overflow-hidden pt-3 pb-3 transition-all duration-300 group-hover:pb-28">
                      {/* Large centered overlay logo appears below content on hover; no reserved space by default */}
                      <div className="absolute inset-x-0 bottom-3 z-40 pointer-events-none transition-all duration-300 h-0 group-hover:h-28">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src="/images/Taylors-University-Logo-Vector.svg-.png"
                            alt="Taylor's University Logo"
                            fill
                            priority
                            className="object-contain glitch-img transition-opacity transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-110 group-hover:translate-y-[1px]"
                          />
                        </div>
                      </div>
                      <span className="font-medium flex items-center gap-2 transition-colors duration-300 relative z-50 group-hover:text-emerald-400">
                        {/* Icon container with overlayed large logo constrained */}
                        <span className="relative inline-flex items-center justify-center w-[22px] h-[22px]">
                          {/* Default small T icon (no border) */}
                          <Image
                            src="/images/taylors-small.png"
                            alt="Taylor's University Icon"
                            width={22}
                            height={22}
                            className="transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                          />
                        </span>
                        Bachelor's in Creative Multimedia Design
                      </span>
                      {/* Subline: university/date remains visible; no duplicate degree on hover */}
                      <span className="relative z-50 mt-2 text-sm text-zinc-400">
                        Taylor's University, Malaysia (2022-2025)
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-500 group-hover:animate-pulse" />
                    Recent Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex flex-col">
                      <span className="font-medium">Google Cybersecurity Professional Certificate</span>
                      <span className="text-sm text-zinc-400">March 2025</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-medium">IBM Cybersecurity Assessment</span>
                      <span className="text-sm text-zinc-400">May 2025</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-medium">Google Analytics Certification</span>
                      <span className="text-sm text-zinc-400">May 2025</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-emerald-500 group-hover:animate-pulse" />
                    Core Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex flex-col">
                      <span className="font-medium">Security Risk Management</span>
                      <span className="text-sm text-zinc-400">Network Security, Vulnerability Management</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-medium">Full-Stack Development</span>
                      <span className="text-sm text-zinc-400">React, Node.js, Mobile Development</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-medium">Systems & Infrastructure</span>
                      <span className="text-sm text-zinc-400">Server-side integration, ERPs/finance, Windows Server 2012/2016, Linux ops</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-medium">Leadership & Collaboration</span>
                      <span className="text-sm text-zinc-400">Project Management, Team Leadership</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none">
                <Cpu className="w-3 h-3 mr-1" /> Technical Expertise
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <GlitchText text="Development & Security Skills" />
              </h2>
              <p className="text-zinc-400">
                My technical toolkit encompasses a wide range of disciplines, from cybersecurity to full-stack
                development and creative problem-solving.
              </p>
            </div>

            <Tabs value={activeSkillTab} onValueChange={setActiveSkillTab} className="mt-12">
              <TabsList className="flex w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-x-auto shadow-lg">
                <TabsTrigger value="programming" className="flex-shrink-0">Programming</TabsTrigger>
                <TabsTrigger value="frontend" className="flex-shrink-0">Frontend</TabsTrigger>
                <TabsTrigger value="backend" className="flex-shrink-0">Backend</TabsTrigger>
                <TabsTrigger value="devops" className="flex-shrink-0">DevOps</TabsTrigger>
                <TabsTrigger value="mobile" className="flex-shrink-0">Mobile</TabsTrigger>
                <TabsTrigger value="design" className="flex-shrink-0">Design</TabsTrigger>
              </TabsList>

              <TabsContent value="programming" className="mt-8">
                <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-700/50">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-emerald-400">
                    <Terminal className="mr-3 h-6 w-6" />🧠 Programming Languages
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 md:gap-6">
                    {[
                      {
                        name: "Python",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
                        url: "https://www.python.org",
                      },
                      {
                        name: "Java",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
                        url: "https://www.java.com",
                      },
                      {
                        name: "Kotlin",
                        icon: "https://www.vectorlogo.zone/logos/kotlinlang/kotlinlang-icon.svg",
                        url: "https://kotlinlang.org",
                      },
                      {
                        name: "Dart",
                        icon: "https://www.vectorlogo.zone/logos/dartlang/dartlang-icon.svg",
                        url: "https://dart.dev",
                      },
                      {
                        name: "C++",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
                        url: "https://www.w3schools.com/cpp/",
                      },
                      {
                        name: "PHP",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
                        url: "https://www.php.net",
                      },
                      {
                        name: "JavaScript",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
                        url: "https://www.javascript.com/",
                      },
                      {
                        name: "TypeScript",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
                        url: "https://www.typescriptlang.org/",
                      },
                    ].map((skill) => (
                      <div key={skill.name} className="group flex flex-col items-center">
                        <a href={skill.url} target="_blank" rel="noopener noreferrer" className="block">
                          <div className="w-10 h-10 md:w-12 md:h-12 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                            <img
                              src={skill.icon || "/placeholder.svg"}
                              alt={skill.name}
                              className={`w-full h-full object-contain ${skill.name === "Photoshop" ? "brightness-0 invert" : ""}`}
                            />
                          </div>
                          <span className="text-xs text-zinc-400 group-hover:text-emerald-400 transition-colors text-center">
                            {skill.name}
                          </span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="frontend" className="mt-8">
                <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-700/50">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-emerald-400">
                    <Code className="mr-3 h-6 w-6" />🎨 Frontend & Frameworks
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 md:gap-6">
                    {[
                      {
                        name: "React",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
                        url: "https://reactjs.org/",
                      },
                      {
                        name: "Next.js",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
                        url: "https://nextjs.org/",
                      },
                      {
                        name: "Vue.js",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
                        url: "https://vuejs.org/",
                      },
                      {
                        name: "Flutter",
                        icon: "https://www.vectorlogo.zone/logos/flutterio/flutterio-icon.svg",
                        url: "https://flutter.dev",
                      },
                      {
                        name: "Bootstrap",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-plain-wordmark.svg",
                        url: "https://getbootstrap.com",
                      },
                      {
                        name: "Tailwind",
                        icon: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg",
                        url: "https://tailwindcss.com/",
                      },
                      {
                        name: "HTML5",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original-wordmark.svg",
                        url: "https://www.w3schools.com/html/",
                      },
                      {
                        name: "CSS3",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg",
                        url: "https://www.w3schools.com/css/",
                      },
                    ].map((skill) => (
                      <div key={skill.name} className="group flex flex-col items-center">
                        <a href={skill.url} target="_blank" rel="noopener noreferrer" className="block">
                          <div className="w-10 h-10 md:w-12 md:h-12 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                            <img
                              src={skill.icon || "/placeholder.svg"}
                              alt={skill.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs text-zinc-400 group-hover:text-emerald-400 transition-colors text-center">
                            {skill.name}
                          </span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="backend" className="mt-8">
                <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-700/50">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-emerald-400">
                    <Server className="mr-3 h-6 w-6" />
                    🗄️ Backend & Databases
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 md:gap-6">
                    {[
                      {
                        name: "Node.js",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg",
                        url: "https://nodejs.org",
                      },
                      {
                        name: "Windows Server",
                        icon: "https://www.svgrepo.com/show/303229/microsoft-sql-server-logo.svg",
                        url: "https://learn.microsoft.com/en-us/windows-server/",
                      },
                      {
                        name: "Linux Servers",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
                        url: "https://www.linux.org/",
                      },
                      {
                        name: "MySQL",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg",
                        url: "https://www.mysql.com/",
                      },
                      {
                        name: "PostgreSQL",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original-wordmark.svg",
                        url: "https://www.postgresql.org",
                      },
                      {
                        name: "SQL Server",
                        icon: "https://www.svgrepo.com/show/303229/microsoft-sql-server-logo.svg",
                        url: "https://www.microsoft.com/en-us/sql-server",
                      },
                      {
                        name: "Oracle DB",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
                        url: "https://www.oracle.com/",
                      },
                    ].map((skill) => (
                      <div key={skill.name} className="group flex flex-col items-center">
                        <a href={skill.url} target="_blank" rel="noopener noreferrer" className="block">
                          <div className="w-10 h-10 md:w-12 md:h-12 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                            <img
                              src={skill.icon || "/placeholder.svg"}
                              alt={skill.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs text-zinc-400 group-hover:text-emerald-400 transition-colors text-center">
                            {skill.name}
                          </span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="devops" className="mt-8">
                <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-700/50">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-emerald-400">
                    <Globe className="mr-3 h-6 w-6" />
                    ☁️ DevOps & Cloud
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 md:gap-6">
                    {[
                      {
                        name: "Docker",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original-wordmark.svg",
                        url: "https://www.docker.com/",
                      },
                      {
                        name: "AWS",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
                        url: "https://aws.amazon.com",
                      },
                      {
                        name: "Azure",
                        icon: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-icon.svg",
                        url: "https://azure.microsoft.com/en-in/",
                        badge: "AI Security"
                      },
                      {
                        name: "Microsoft Entra",
                        icon: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-icon.svg",
                        url: "https://learn.microsoft.com/en-us/entra/",
                        badge: "Identity"
                      },
                      {
                        name: "Bash",
                        icon: "https://www.vectorlogo.zone/logos/gnu_bash/gnu_bash-icon.svg",
                        url: "https://www.gnu.org/software/bash/",
                      },
                      {
                        name: "Linux",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
                        url: "https://www.linux.org/",
                      },
                      {
                        name: "Git",
                        icon: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg",
                        url: "https://git-scm.com/",
                      },
                    ].map((skill) => (
                      <div key={skill.name} className="group flex flex-col items-center">
                        <a href={skill.url} target="_blank" rel="noopener noreferrer" className="block">
                          <div className="w-10 h-10 md:w-12 md:h-12 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 relative">
                            <img
                              src={skill.icon || "/placeholder.svg"}
                              alt={skill.name}
                              className="w-full h-full object-contain"
                            />
                            {skill.badge && (
                              <div className="absolute left-1 bottom-1 text-[10px] bg-blue-500/30 text-white px-1 py-0.5 rounded">
                                {skill.badge}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-zinc-400 group-hover:text-emerald-400 transition-colors text-center">
                            {skill.name}
                          </span>
                        </a>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-semibold">Microsoft AI Security Integration</span>
                    </div>
                    <p className="text-sm text-zinc-300">
                      Leveraging Microsoft Azure AI for advanced threat detection, Entra ID for identity protection, 
                      and Loop for collaborative security workflows. Experience next-generation cybersecurity 
                      with AI-powered automation and predictive analytics.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mobile" className="mt-8">
                <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-700/50">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-emerald-400">
                    <FileCode className="mr-3 h-6 w-6" />📱 Mobile & Game Dev
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 md:gap-6">
                    {[
                      {
                        name: "Android",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original-wordmark.svg",
                        url: "https://developer.android.com",
                      },
                      {
                        name: "React Native",
                        icon: "https://reactnative.dev/img/header_logo.svg",
                        url: "https://reactnative.dev/",
                      },
                      {
                        name: "Unity",
                        icon: "https://www.vectorlogo.zone/logos/unity3d/unity3d-icon.svg",
                        url: "https://unity.com/",
                      },
                      {
                        name: "Unreal Engine",
                        icon: "https://raw.githubusercontent.com/kenangundogan/fontisto/036b7eca71aab1bef8e6a0518f7329f13ed62f6b/icons/svg/brand/unreal-engine.svg",
                        url: "https://unrealengine.com/",
                      },
                    ].map((skill) => (
                      <div key={skill.name} className="group flex flex-col items-center">
                        <a href={skill.url} target="_blank" rel="noopener noreferrer" className="block">
                          <div className="w-10 h-10 md:w-12 md:h-12 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                            <img
                              src={skill.icon || "/placeholder.svg"}
                              alt={skill.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs text-zinc-400 group-hover:text-emerald-400 transition-colors text-center">
                            {skill.name}
                          </span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="design" className="mt-8">
                <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-700/50">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-emerald-400">
                    <Braces className="mr-3 h-6 w-6" />🎨 UI/UX & Design
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 md:gap-6">
                    {[
                      {
                        name: "Figma",
                        icon: "https://www.vectorlogo.zone/logos/figma/figma-icon.svg",
                        url: "https://www.figma.com/",
                      },
                      {
                        name: "Illustrator",
                        icon: "https://www.vectorlogo.zone/logos/adobe_illustrator/adobe_illustrator-icon.svg",
                        url: "https://www.adobe.com/products/illustrator.html",
                      },
                      {
                        name: "Photoshop",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
                        url: "https://www.photoshop.com/en",
                      },
                      {
                        name: "Adobe XD",
                        icon: "https://cdn.worldvectorlogo.com/logos/adobe-xd-2.svg",
                        url: "https://www.adobe.com/products/xd.html",
                      },
                      {
                        name: "Sketch",
                        icon: "https://www.vectorlogo.zone/logos/sketchapp/sketchapp-icon.svg",
                        url: "https://www.sketch.com/",
                      },
                      {
                        name: "Blender",
                        icon: "https://download.blender.org/branding/community/blender_community_badge_white.svg",
                        url: "https://www.blender.org/",
                      },
                    ].map((skill) => (
                      <div key={skill.name} className="group flex flex-col items-center">
                        <a href={skill.url} target="_blank" rel="noopener noreferrer" className="block">
                          <div className="w-10 h-10 md:w-12 md:h-12 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                            <img
                              src={skill.icon || "/placeholder.svg"}
                              alt={skill.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs text-zinc-400 group-hover:text-emerald-400 transition-colors text-center">
                            {skill.name}
                          </span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Cybersecurity Skills Progress Bars */}
            <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-700/50 mt-12">
              <h3 className="text-xl font-semibold mb-6 flex items-center text-emerald-400">
                <Award className="mr-3 h-6 w-6" />🔒 Cybersecurity Expertise
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Security Risk Management", level: 90 },
                  { name: "Network Security", level: 85 },
                  { name: "Vulnerability Management", level: 88 },
                  { name: "MDR (Managed Detection and Response)", level: 82 },
                  { name: "Malware Analysis", level: 88 },
                  { name: "Reverse Engineering", level: 85 },
                  { name: "Static & Dynamic Analysis", level: 87 },
                  { name: "KayanHR Security Systems", level: 83 },
                  { name: "Cybersecurity Foundations", level: 85 },
                ].map((skill) => (
                  <div key={skill.name} className="group">
                    <div className="flex justify-between mb-1">
                      <span className="group-hover:text-emerald-400 transition-colors">{skill.name}</span>
                      <span className="text-emerald-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      >
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="bg-zinc-900/50 py-20 relative">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none">
                <FileCode className="w-3 h-3 mr-1" /> Portfolio
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <GlitchText text="Featured Projects" />
              </h2>
              <p className="text-zinc-400">
                A showcase of my innovative projects, from interactive web applications to cybersecurity tools and
                creative coding experiments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[
                {
                  title: "Magic Browser",
                  description:
                    "A project revolutionizing internet browsing, unlocking new possibilities for productivity and enjoyment online.",
                  tags: ["Web Development", "UI/UX", "JavaScript"],
                  icon: <Globe className="h-5 w-5" />,
                  link: "https://goodnbadexe.github.io/MagicB/",
                },
                {
                  title: "Raining Characters",
                  description:
                    "Simple interface for preview with animated character rain effect and interactive design.",
                  tags: ["Animation", "CSS", "Interactive Design"],
                  icon: <Code className="h-5 w-5" />,
                  link: "https://v0-raining-characters-ten-livid.vercel.app/",
                },
                {
                  title: "Prompting Is All You Need",
                  description:
                    "All you need is prompting correctly with engineering - a demonstration of prompt engineering techniques.",
                  tags: ["AI", "Prompt Engineering", "Machine Learning"],
                  icon: <Cpu className="h-5 w-5" />,
                  link: "https://v0-prompting-is-all-you-need-ashy-delta.vercel.app/",
                },
                {
                  title: "Pixel Game X and O",
                  description: "Classic Tic-Tac-Toe game with pixel art styling and smooth animations.",
                  tags: ["Game Development", "JavaScript", "Pixel Art"],
                  icon: <FileCode className="h-5 w-5" />,
                  link: "https://v0-pixel-game-idea-two.vercel.app/",
                },
                {
                  title: "Masarat Events Website",
                  description:
                    "Tailored website for Masarat Events company with modern design and comprehensive event management features.",
                  tags: ["Web Development", "Corporate", "Event Management"],
                  icon: <Globe className="h-5 w-5" />,
                  link: "https://www.masaratevents.com",
                },
                {
                  title: "My First Website - HOS",
                  description:
                    "My very first website project - a milestone in my web development journey showcasing early skills and creativity.",
                  tags: ["Web Development", "HTML/CSS", "First Project"],
                  icon: <Server className="h-5 w-5" />,
                  link: "https://goodnbadexe.github.io/HOS/",
                },
              ].map((project, index) => (
                <Card
                  key={index}
                  className="bg-zinc-800/50 border-zinc-700 overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 glitch-border"
                >
                  <CardHeader className="pb-2">
                    <div className="mb-2 text-emerald-500 group-hover:text-emerald-400 transition-colors">
                      {project.icon}
                    </div>
                    <CardTitle className="group-hover:text-emerald-400 transition-colors">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-zinc-400 mb-4">{project.description}</CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-zinc-600 text-zinc-300 group-hover:border-emerald-500/30 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 p-0 group-hover:translate-x-1 transition-transform"
                      asChild
                    >
                      <Link href={project.link} target="_blank">
                        View Project <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none">
                <Braces className="w-3 h-3 mr-1" /> Work History
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <GlitchText text="Professional Experience" />
              </h2>
              <p className="text-zinc-400">
                My career journey spans technology leadership, development, and creative roles across multiple countries
                and industries.
              </p>
            </div>

            <div className="relative border-l-2 border-emerald-500/30 ml-3 md:ml-6 pl-6 md:pl-10 mt-12 space-y-12">
              {[
                {
                  role: "IT Systems & Support Administrator",
                  company: "Calma.sa",
                  location: "Riyadh, Saudi Arabia",
                  description: [
                    "Provide end-to-end IT support and systems administration",
                    "Manage daily help desk operations and core infrastructure",
                    "Oversee business applications and routine maintenance",
                  ],
                },
                {
                  role: "IT Support Specialist",
                  company: "Calma.sa",
                  location: "Riyadh, Saudi Arabia",
                  description: [
                    "Configured and maintained IT systems, ensuring security and operational continuity.",
                    "Provided system support and troubleshooting, reducing downtime for employees.",
                    "Managed Zoho applications and company website security patches.",
                  ],
                },
                {
                  role: "Head of Technology",
                  company: "Masarat Events",
                  location: "Riyadh, Saudi Arabia",
                  description: [
                    "Oversee full control of the company website, including content updates, backend fixes, and performance optimization.",
                    "Drive collaboration between departments and external partners through effective digital tools and communication platforms.",
                    "Lead the technology strategy and infrastructure development for the company.",
                  ],
                },
                {
                  role: "System Administrator",
                  company: "Masarat Decor",
                  location: "Riyadh, Saudi Arabia",
                  description: [
                    "Manage IT operations across the main office and two remote locations, ensuring seamless tech functionality.",
                    "Administer employee attendance systems including biometric (fingerprint) access.",
                    "Configure and support corporate email systems for all employees.",
                  ],
                },
                {
                  role: "Web Developer",
                  company: "ThunderQuote",
                  location: "Malaysia",
                  description: [
                    "Developed full-stack websites and integrated APIs.",
                    "Worked with HTML, CSS, JS, PHP, MySQL.",
                    "Ensured timely delivery through cross-functional collaboration.",
                  ],
                },
                {
                  role: "Full-stack Developer",
                  company: "Kabel",
                  location: "Malaysia",
                  description: [
                    "Created mobile apps for iOS/Android using Swift, Java, React Native.",
                    "Ensured scalability and performance through best practices.",
                    "Collaborated with cross-functional teams to ensure project success.",
                  ],
                },
              ].map((job, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-[37px] md:-left-[46px] top-0 w-6 h-6 rounded-full bg-zinc-800 border-2 border-emerald-500 group-hover:bg-emerald-500 transition-colors duration-300"></div>
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 group-hover:border-emerald-500/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {job.role}
                        </h3>
                        <p className="text-emerald-500">{job.company}</p>
                      </div>
                      <div className="text-zinc-400 mt-2 md:mt-0 md:text-right">
                        <p>{job.location}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-zinc-300">
                      {job.description.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-emerald-500 mr-2">›</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="bg-zinc-900/50 py-20 relative">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none">
                <Award className="w-3 h-3 mr-1" /> Credentials
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <GlitchText text="Certifications & Achievements" />
              </h2>
              <p className="text-zinc-400">
                Continuous learning is essential in the rapidly evolving fields of development and cybersecurity. Here
                are my recent certifications and achievements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {[
                {
                  title: "Google Cybersecurity Professional Certificate",
                  issuer: "Google",
                  date: "March 2025",
                  credentialId: "YBHSSJ3B13V8",
                  url: "https://www.coursera.org/account/accomplishments/professional-cert/YBHSSJ3B13V8",
                  skills: ["Cybersecurity", "Network Security", "Linux and SQL", "Foundations of Cybersecurity"],
                },
                {
                  title: "Malware Analysis Skill Path",
                  issuer: "LetsDefend",
                  date: "November 2025",
                  credentialId: "1901438d-f379-4456-a222-d3744d4c15be",
                  url: "https://app.letsdefend.io/certificate/show/1901438d-f379-4456-a222-d3744d4c15be",
                  skills: ["Malware Analysis", "Reverse Engineering", "Static Analysis", "Dynamic Analysis"],
                },
                {
                  title: "Cybersecurity Assessment: CompTIA Security+ & CYSA+",
                  issuer: "IBM",
                  date: "May 2025",
                  credentialId: "OHC26D9YE3RX",
                  url: "https://coursera.org/verify/OHC26D9YE3RX",
                  skills: ["CompTIA Security+", "CompTIA CySA", "Certification Exam Practice"],
                },
                {
                  title: "Generative AI: Boost Your Cybersecurity Career",
                  issuer: "IBM",
                  date: "May 2025",
                  credentialId: "WLGB18GSHLCT",
                  url: "https://coursera.org/verify/WLGB18GSHLCT",
                  skills: ["Generative AI", "Artificial Intelligence (AI)"],
                },
                {
                  title: "Taylor's University Award 2024",
                  issuer: "Taylor's University",
                  date: "December 2024",
                  credentialId: "126164641",
                  url: "https://credentials.taylors.edu.my/a320a345-9d00-4aa3-b15e-25ae46231588",
                  skills: ["Academic Excellence", "Leadership"],
                },
              ].map((cert, index) => (
                <Card
                  key={index}
                  className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 transition-all duration-300 group"
                >
                  <CardHeader>
                    <CardTitle className="group-hover:text-emerald-400 transition-colors">{cert.title}</CardTitle>
                    <CardDescription className="text-emerald-500">{cert.issuer}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-400">Issue Date:</span>
                        <span className="text-sm">{cert.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-400">Credential ID:</span>
                        <span className="text-sm font-mono">{cert.credentialId}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {cert.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs border-zinc-600 text-zinc-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 p-0 group-hover:translate-x-1 transition-transform"
                      asChild
                    >
                      <Link href={cert.url} target="_blank">
                        View Certificate <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Microsoft Integration Showcase */}
        <section className="bg-zinc-900/30 py-20 relative">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <Globe className="w-3 h-3 mr-1" /> Microsoft Skills
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <GlitchText text="Microsoft & Enterprise Security Skills" />
              </h2>
              <p className="text-zinc-400">
                Advanced cybersecurity skills with Microsoft Azure, Entra ID, and enterprise-grade 
                implementations for comprehensive threat protection and identity management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <Card className="bg-zinc-800/50 border-zinc-700 hover:border-blue-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Server className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                        Microsoft Azure Security
                      </CardTitle>
                      <CardDescription className="text-blue-400">Cloud Security Platform</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Advanced Threat Protection with AI-powered detection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Security posture management across hybrid environments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Compliance monitoring and automated remediation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Real-time security analytics and incident response</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/20 w-full" asChild>
                    <Link href="/cybersecurity-ai">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Explore Azure AI Security
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700 hover:border-purple-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Lock className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                        Microsoft Entra ID
                      </CardTitle>
                      <CardDescription className="text-purple-400">Identity & Access Management</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Risk-based authentication with conditional access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Identity protection with anomaly detection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Single sign-on across enterprise applications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Privileged identity management and monitoring</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500/20 w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    View Identity Solutions
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Server className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <CardTitle className="text-white group-hover:text-emerald-400 transition-colors">
                        Microsoft Admin Center
                      </CardTitle>
                      <CardDescription className="text-emerald-400">Unified Administration Portal</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Centralized user and device management across Microsoft 365</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Security policy deployment and compliance monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Integrated reporting and analytics for enterprise security</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Automated security workflows and threat response</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/20 w-full">
                    <Code className="mr-2 h-4 w-4" />
                    View Admin Solutions
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-4 p-6 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <div className="text-blue-400">
                  <Brain className="h-8 w-8" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white mb-1">AI-Powered Security Integration</h3>
                  <p className="text-sm text-zinc-400">
                    Leveraging Microsoft AI for predictive threat detection and automated response
                  </p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href="/cybersecurity-ai">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-20 relative">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none">
                <Globe className="w-3 h-3 mr-1" /> My Work
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <GlitchText text="Online Presence & Projects" />
              </h2>
              <p className="text-zinc-400">
                Explore my websites, GitHub repositories, and other online projects showcasing my technical and creative
                abilities.
              </p>
            </div>

            <Tabs defaultValue="websites" className="mt-12">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-zinc-800/50">
                <TabsTrigger value="websites">Websites</TabsTrigger>
                <TabsTrigger value="github">GitHub</TabsTrigger>
                <TabsTrigger value="other">Other Projects</TabsTrigger>
              </TabsList>
              <TabsContent value="websites" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Calma | كالما",
                      url: "https://calma.sa",
                      description: "Real estate agency website: content management, performance, and secure integrations.",
                      icon: <Globe />,
                    },
                    {
                      title: "Magic Browser",
                      url: "https://goodnbadexe.github.io/MagicB/",
                      description: "A revolutionary browser concept enhancing productivity and online experience.",
                      icon: <Globe />,
                    },
                    {
                      title: "Masarat Events",
                      url: "https://www.masaratevents.com",
                      description: "Corporate website for Masarat Events with modern design and event management.",
                      icon: <Globe />,
                    },
                  ].map((site, index) => (
                    <Card
                      key={index}
                      className="bg-zinc-800/50 border-zinc-700 group hover:border-emerald-500/50 transition-colors duration-300"
                    >
                      <CardHeader>
                        <div className="text-emerald-500 mb-2 group-hover:text-emerald-400 transition-colors">
                          {site.icon}
                        </div>
                        <CardTitle className="text-xl group-hover:text-emerald-400 transition-colors">
                          {site.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-zinc-400">{site.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="ghost"
                          className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 p-0 group-hover:translate-x-1 transition-transform"
                          asChild
                        >
                          <Link href={site.url} target="_blank">
                            Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="github" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "MagicB",
                      url: "https://github.com/goodnbadexe/MagicB",
                      description:
                        "Magic Browser project repository - revolutionizing the way users browse the internet.",
                      language: "JavaScript",
                    },
                    {
                      title: "Cybersecurity Portfolio",
                      url: "https://github.com/goodnbadexe/cybersecurity-portfolio",
                      description: "Personal cybersecurity portfolio showcasing projects and skills.",
                      language: "TypeScript",
                    },
                    {
                      title: "HOS - First Website",
                      url: "https://github.com/goodnbadexe/HOS",
                      description: "My very first website project - a milestone in my web development journey.",
                      language: "HTML/CSS",
                    },
                    {
                      title: "Windows Maintenance",
                      url: "https://github.com/Goodnbadexe/WindowsMaintenance",
                      description: "Comprehensive PowerShell-based automation script for Windows system maintenance, repair, and optimization.",
                      language: "PowerShell",
                    },
                  ].map((repo, index) => (
                    <Card
                      key={index}
                      className="bg-zinc-800/50 border-zinc-700 group hover:border-emerald-500/50 transition-colors duration-300"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl group-hover:text-emerald-400 transition-colors">
                            {repo.title}
                          </CardTitle>
                          <Badge className="bg-emerald-500/20 text-emerald-400">{repo.language}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-zinc-400">{repo.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="ghost"
                          className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 p-0 group-hover:translate-x-1 transition-transform"
                          asChild
                        >
                          <Link href={repo.url} target="_blank">
                            View Repository <Github className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="other" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Raining Characters",
                      description: "Interactive animation with character rain effects and modern UI design.",
                      category: "Animation Project",
                    },
                    {
                      title: "Prompting Engineering Demo",
                      description: "Demonstration of advanced prompt engineering techniques and AI interaction.",
                      category: "AI Project",
                    },
                    {
                      title: "Pixel Game Collection",
                      description: "Collection of pixel-style games including classic Tic-Tac-Toe implementation.",
                      category: "Game Development",
                    },
                  ].map((project, index) => (
                    <Card
                      key={index}
                      className="bg-zinc-800/50 border-zinc-700 group hover:border-emerald-500/50 transition-colors duration-300"
                    >
                      <CardHeader>
                        <div className="text-emerald-500 mb-2">
                          <FileCode className="h-5 w-5 group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <CardTitle className="text-xl group-hover:text-emerald-400 transition-colors">
                          {project.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge className="mb-3 bg-zinc-700 text-zinc-300">{project.category}</Badge>
                        <p className="text-zinc-400">{project.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="ghost"
                          className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 p-0 group-hover:translate-x-1 transition-transform"
                        >
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-zinc-900/50 py-20 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none">
                <Mail className="w-3 h-3 mr-1" /> Get In Touch
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <GlitchText text="Contact Me" />
              </h2>
              <p className="text-zinc-400">
                Interested in working together or have a question about my projects? Feel free to reach out through any
                of these channels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <Card className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/30 transition-colors duration-300">
                <CardHeader>
                  <CardTitle>Connect With Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="bg-emerald-500/20 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <p className="text-zinc-400">Goodnbadexe@hotmail.com</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-emerald-500/20 p-2 rounded-full">
                        <Phone className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Phone</h4>
                        <p className="text-zinc-400">+966 50 850 1717</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-emerald-500/20 p-2 rounded-full">
                        <MapPin className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-zinc-400">Riyadh, Saudi Arabia</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-emerald-500/20 p-2 rounded-full">
                        <Linkedin className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">LinkedIn</h4>
                        <p className="text-zinc-400">linkedin.com/in/hamzah-al-ramli-505</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div>
                <Card className="bg-zinc-800/50 border-zinc-700 mb-8 hover:border-emerald-500/30 transition-colors duration-300">
                  <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <SocialButton
                        icon={<Linkedin className="h-5 w-5" />}
                        label="LinkedIn"
                        href="https://linkedin.com/in/hamzah-al-ramli-505"
                      />
                      <SocialButton
                        icon={<Github className="h-5 w-5" />}
                        label="GitHub"
                        href="https://github.com/goodnbadexe"
                      />
                      <SocialButton
                        icon={<Globe className="h-5 w-5" />}
                        label="Website"
                        href="https://www.goodnbad.info"
                      />
                      <SocialButton
                        icon={<Globe className="h-5 w-5" />}
                        label="Donate"
                        href="https://www.paypal.me/goodnbadexe"
                      />
                      <SocialButton
                        icon={<Mail className="h-5 w-5" />}
                        label="Email"
                        href="mailto:Goodnbadexe@hotmail.com"
                      />
                      <SocialButton
                        icon={<Globe className="h-5 w-5" />}
                        label="About"
                        href="https://www.goodnbad.info/about"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 hover:border-emerald-500/30 transition-colors duration-300">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-emerald-500" /> Download My Resume
                  </h3>
                  <p className="text-zinc-400 mb-4">
                    Get a comprehensive overview of my skills, experience, and qualifications in my detailed resume.
                  </p>
                  <Button
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black group relative overflow-hidden"
                    asChild
                  >
                    <Link href="/files/hamzah-al-ramli-resume.pdf" target="_blank" download="Hamzah-Al-Ramli-Resume.pdf">
                      <span className="relative z-10 flex items-center justify-center">
                        Download Resume{" "}
                        <Download className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                      </span>
                      <span className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-200"></span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900/80 py-12 border-t border-zinc-800 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="relative w-16 h-16">
                <Image
                  src="/images/logo-green.png"
                  alt="Goodnbad.exe Logo"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <GlitchText text="Goodnbad.exe" className="font-bold text-xl" />
                <DateTimeDisplay />
              </div>
            </div>
            <div className="text-zinc-400 text-sm">
              © {new Date().getFullYear()} Hamzah Al-Ramli. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      
      {/* Mobile Terminal */}
      <MobileTerminal 
        isOpen={showMobileTerminal} 
        onClose={() => setShowMobileTerminal(false)} 
      />
      <CluesDock />
    </div>
  )
}
