import Link from "next/link"
import Image from "next/image"
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
  Twitter,
  Youtube,
  Instagram,
  Codepen,
  Globe,
  Terminal,
  Cpu,
  Braces,
  FileText,
  Download,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HackerTerminal } from "@/components/hacker-terminal"
import { SocialButton } from "@/components/social-button"
import { MobileNav } from "@/components/mobile-nav"
import { GlitchText } from "@/components/glitch-text"
import { MatrixBackground } from "@/components/matrix-background"
import { ParticleAnimation } from "@/components/particle-animation"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white relative overflow-hidden">
      <MatrixBackground />

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
              />
            </div>
            <GlitchText text="Goodnbad.exe" className="font-bold text-xl" />
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
              <Link href="/files/hamzah-al-ramli-resume.pdf" target="_blank">
                <FileText className="mr-2 h-4 w-4" /> Resume
              </Link>
            </Button>

            <MobileNav />
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto py-20 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none">
                <Terminal className="w-3 h-3 mr-1" /> DEV
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 glitch-stack">
                <GlitchText text="Hamzah" className="text-white" />
                <GlitchText text="Al-Ramli" className="text-emerald-500" />
              </h1>
              <p className="text-zinc-400 text-lg mb-8 border-l-2 border-emerald-500 pl-4">
                A fresh graduate and lead front-end developer with hands-on experience in web services, passionate about
                machine problem-solving, and continuously learns through mentorship, certifications, and practical
                experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-black group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    View Projects <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-200"></span>
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 hover:border-emerald-500 hover:text-emerald-500 group"
                  asChild
                >
                  <Link href="/files/hamzah-al-ramli-resume.pdf" target="_blank">
                    <span className="flex items-center">
                      Download Resume{" "}
                      <Download className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-3xl"></div>
              <div className="relative bg-zinc-800/80 p-4 rounded-lg border border-emerald-500/30 backdrop-blur-sm">
                <HackerTerminal />
              </div>
            </div>
          </div>
        </section>

        {/* Arrow Indicator */}
        <div className="flex justify-center mb-8 relative z-10">
          <div className="animate-bounce">
            <ChevronDown className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        {/* Particle Animation Section */}
        <section className="relative h-96 mb-20 overflow-hidden">
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
                A fresh graduate and lead front-end developer with hands-on experience in web services, passionate about
                machine problem-solving, and continuously learns through mentorship, certifications, and practical
                experiences. Thriving in teamwork environments and open communication, focusing on finding real-impact
                solutions. Approach challenges with an adaptive mindset, balance hard work with optimism, and believe
                that setbacks are part of the bigger plan.
              </p>
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
                  <ul className="space-y-3">
                    <li className="flex flex-col">
                      <span className="font-medium">Bachelor's in Computer Science</span>
                      <span className="text-sm text-zinc-400">Taylor's University, Malaysia (2019-2025)</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-medium">Bachelor's in Creative Multimedia Design</span>
                      <span className="text-sm text-zinc-400">Taylor's University, Malaysia (2022-2025)</span>
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

            <Tabs defaultValue="programming" className="mt-12">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 max-w-4xl mx-auto bg-zinc-800/50">
                <TabsTrigger value="programming">Programming</TabsTrigger>
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="backend">Backend</TabsTrigger>
                <TabsTrigger value="devops">DevOps</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>

              <TabsContent value="programming" className="mt-8">
                <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-700/50">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-emerald-400">
                    <Terminal className="mr-3 h-6 w-6" />🧠 Programming Languages
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
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
                          <div className="w-12 h-12 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
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

              <TabsContent value="frontend" className="mt-8">
                <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-700/50">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-emerald-400">
                    <Code className="mr-3 h-6 w-6" />🎨 Frontend & Frameworks
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
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
                          <div className="w-12 h-12 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
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
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
                    {[
                      {
                        name: "Node.js",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg",
                        url: "https://nodejs.org",
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
                          <div className="w-12 h-12 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
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
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
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
                          <div className="w-12 h-12 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
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

              <TabsContent value="mobile" className="mt-8">
                <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-700/50">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-emerald-400">
                    <FileCode className="mr-3 h-6 w-6" />📱 Mobile & Game Dev
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
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
                          <div className="w-12 h-12 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
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
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
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
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-line.svg",
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
                          <div className="w-12 h-12 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
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
                  { name: "Cybersecurity Foundations", level: 85 },
                ].map((skill) => (
                  <div key={skill.name} className="group">
                    <div className="flex justify-between mb-1">
                      <span className="group-hover:text-emerald-400 transition-colors">{skill.name}</span>
                      <span className="text-emerald-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full relative"
                        style={{ width: `${skill.level}%` }}
                      >
                        <div className="absolute inset-0 bg-emerald-400/50 animate-pulse"></div>
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
                  title: "Google Analytics Certification",
                  issuer: "Google Digital Academy (Skillshop)",
                  date: "May 2025",
                  credentialId: "143306854",
                  url: "https://skillshop.credential.net/f6dd7dc8-877d-434b-b6e0-618f9ff96b5a",
                  skills: ["Google Analytics", "Digital Marketing", "Data Analysis"],
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
                    {
                      title: "GitHub Profile",
                      url: "https://github.com/goodnbadexe",
                      description: "My GitHub repositories featuring various coding projects and experiments.",
                      icon: <Github />,
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
                      title: "Personal Projects",
                      url: "https://github.com/goodnbadexe",
                      description: "Collection of various personal projects and coding experiments.",
                      language: "Multiple",
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
                        <p className="text-zinc-400">alramli.hamzah@gmail.com</p>
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                        icon={<Instagram className="h-5 w-5" />}
                        label="Instagram"
                        href="https://instagram.com/hamzah-al-ramli"
                      />
                      <SocialButton
                        icon={<Twitter className="h-5 w-5" />}
                        label="Twitter"
                        href="https://twitter.com/hamzah-al-ramli"
                      />
                      <SocialButton
                        icon={<Youtube className="h-5 w-5" />}
                        label="YouTube"
                        href="https://youtube.com/ludusVaria"
                      />
                      <SocialButton
                        icon={<Codepen className="h-5 w-5" />}
                        label="CodePen"
                        href="https://codepen.io/hamzah-al-ramli"
                      />
                      <SocialButton
                        icon={<Globe className="h-5 w-5" />}
                        label="Portfolio"
                        href="https://hamzah-al-ramli.myportfolio.com/"
                      />
                      <SocialButton
                        icon={<Mail className="h-5 w-5" />}
                        label="Email"
                        href="mailto:alramli.hamzah@gmail.com"
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
                    <Link href="/files/hamzah-al-ramli-resume.pdf" target="_blank">
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
              <GlitchText text="Goodnbad.exe" className="font-bold text-xl" />
            </div>
            <div className="text-zinc-400 text-sm">
              © {new Date().getFullYear()} Hamzah Al-Ramli. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
