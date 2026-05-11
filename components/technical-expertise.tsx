"use client";

import React, { useEffect, useRef } from "react";
import { Terminal, Code, Server, Globe, FileCode, Braces, Shield } from "lucide-react";
import { initTechnicalExpertise } from "@/lib/technical-expertise.js";

type Skill = {
  name: string;
  icon: string;
  url: string;
  badge?: string;
};

type Category = {
  id: string;
  title: string;
  icon: React.ElementType;
  skills: Skill[];
  extraContent?: React.ReactNode;
  colorClass?: string; // offense | defense | automation | cloud
};

const EXPERTISE_CATEGORIES: Category[] = [
  {
    id: "programming",
    title: "🧠 Programming Languages",
    icon: Terminal,
    colorClass: "tech-exp__item--automation",
    skills: [
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", url: "https://www.python.org" },
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", url: "https://www.java.com" },
      { name: "Kotlin", icon: "https://www.vectorlogo.zone/logos/kotlinlang/kotlinlang-icon.svg", url: "https://kotlinlang.org" },
      { name: "Dart", icon: "https://www.vectorlogo.zone/logos/dartlang/dartlang-icon.svg", url: "https://dart.dev" },
      { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", url: "https://www.w3schools.com/cpp/" },
      { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", url: "https://www.php.net" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", url: "https://www.javascript.com/" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", url: "https://www.typescriptlang.org/" },
    ],
  },
  {
    id: "frontend",
    title: "🎨 Frontend & Frameworks",
    icon: Code,
    colorClass: "tech-exp__item--automation",
    skills: [
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", url: "https://reactjs.org/" },
      { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", url: "https://nextjs.org/" },
      { name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg", url: "https://vuejs.org/" },
      { name: "Flutter", icon: "https://www.vectorlogo.zone/logos/flutterio/flutterio-icon.svg", url: "https://flutter.dev" },
      { name: "Bootstrap", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-plain-wordmark.svg", url: "https://getbootstrap.com" },
      { name: "Tailwind", icon: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg", url: "https://tailwindcss.com/" },
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original-wordmark.svg", url: "https://www.w3schools.com/html/" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg", url: "https://www.w3schools.com/css/" },
    ],
  },
  {
    id: "backend",
    title: "🗄️ Backend & Databases",
    icon: Server,
    colorClass: "tech-exp__item--defense",
    skills: [
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg", url: "https://nodejs.org" },
      { name: "Windows Server", icon: "https://www.svgrepo.com/show/303229/microsoft-sql-server-logo.svg", url: "https://learn.microsoft.com/en-us/windows-server/" },
      { name: "Linux Servers", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", url: "https://www.linux.org/" },
      { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg", url: "https://www.mysql.com/" },
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original-wordmark.svg", url: "https://www.postgresql.org" },
      { name: "SQL Server", icon: "https://www.svgrepo.com/show/303229/microsoft-sql-server-logo.svg", url: "https://www.microsoft.com/en-us/sql-server" },
      { name: "Oracle DB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg", url: "https://www.oracle.com/" },
    ],
  },
  {
    id: "devops",
    title: "☁️ DevOps & Cloud",
    icon: Globe,
    colorClass: "tech-exp__item--cloud",
    skills: [
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original-wordmark.svg", url: "https://www.docker.com/" },
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", url: "https://aws.amazon.com" },
      { name: "Azure", icon: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-icon.svg", url: "https://azure.microsoft.com/en-in/", badge: "AI Security" },
      { name: "Microsoft Entra", icon: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-icon.svg", url: "https://learn.microsoft.com/en-us/entra/", badge: "Identity" },
      { name: "Bash", icon: "https://www.vectorlogo.zone/logos/gnu_bash/gnu_bash-icon.svg", url: "https://www.gnu.org/software/bash/" },
      { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", url: "https://www.linux.org/" },
      { name: "Git", icon: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg", url: "https://git-scm.com/" },
    ],
    extraContent: (
      <div className="tech-exp__callout">
        <div className="tech-exp__calloutHeader">
          <Shield className="h-4 w-4" />
          <span className="tech-exp__calloutTitle">Microsoft AI Security Integration</span>
        </div>
        <p className="tech-exp__calloutText">
          Leveraging Microsoft Azure AI for advanced threat detection, Entra ID for identity protection,
          and Loop for collaborative security workflows. Experience next-generation cybersecurity
          with AI-powered automation and predictive analytics.
        </p>
      </div>
    ),
  },
  {
    id: "mobile",
    title: "📱 Mobile & Game Dev",
    icon: FileCode,
    colorClass: "tech-exp__item--offense",
    skills: [
      { name: "Android", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original-wordmark.svg", url: "https://developer.android.com" },
      { name: "React Native", icon: "https://reactnative.dev/img/header_logo.svg", url: "https://reactnative.dev/" },
      { name: "Unity", icon: "https://www.vectorlogo.zone/logos/unity3d/unity3d-icon.svg", url: "https://unity.com/" },
      { name: "Unreal Engine", icon: "https://raw.githubusercontent.com/kenangundogan/fontisto/036b7eca71aab1bef8e6a0518f7329f13ed62f6b/icons/svg/brand/unreal-engine.svg", url: "https://unrealengine.com/" },
    ],
  },
  {
    id: "design",
    title: "🎨 UI/UX & Design",
    icon: Braces,
    colorClass: "tech-exp__item--offense",
    skills: [
      { name: "Figma", icon: "https://www.vectorlogo.zone/logos/figma/figma-icon.svg", url: "https://www.figma.com/" },
      { name: "Illustrator", icon: "https://www.vectorlogo.zone/logos/adobe_illustrator/adobe_illustrator-icon.svg", url: "https://www.adobe.com/products/illustrator.html" },
      { name: "Photoshop", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg", url: "https://www.photoshop.com/en" },
      { name: "Adobe XD", icon: "https://cdn.worldvectorlogo.com/logos/adobe-xd-2.svg", url: "https://www.adobe.com/products/xd.html" },
      { name: "Sketch", icon: "https://www.vectorlogo.zone/logos/sketchapp/sketchapp-icon.svg", url: "https://www.sketch.com/" },
      { name: "Blender", icon: "https://download.blender.org/branding/community/blender_community_badge_white.svg", url: "https://www.blender.org/" },
    ],
  },
];

export function TechnicalExpertise() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return initTechnicalExpertise(containerRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className="tech-exp"
      aria-label="Technical expertise"
    >
      <div className="tech-exp__list">
        {EXPERTISE_CATEGORIES.map((category, index) => {
        const Icon = category.icon;
        return (
          <div
            key={category.id}
            className={`tech-exp__item${category.colorClass ? ` ${category.colorClass}` : ""}`}
            style={{ ["--tech-exp-delay" as never]: `${index * 90}ms` }}
          >
            <div className="tech-exp__itemInner">
              <h3 className="tech-exp__heading">
                <Icon className="tech-exp__headingIcon" aria-hidden="true" />
                <span className="tech-exp__headingText">{category.title}</span>
              </h3>

              <div className="tech-exp__skills" role="list">
                {category.skills.map((skill) => (
                  <a
                    key={skill.name}
                    href={skill.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tech-exp__skillLink"
                  >
                    <span className="tech-exp__skillIconWrap" aria-hidden="true">
                      <img
                        src={skill.icon || "/placeholder.svg"}
                        alt=""
                        loading="lazy"
                        className={`tech-exp__skillIcon ${skill.name === "Photoshop" ? "tech-exp__skillIcon--invert" : ""}`}
                      />
                      {skill.badge && <span className="tech-exp__skillBadge">{skill.badge}</span>}
                    </span>
                    <span className="tech-exp__skillName">{skill.name}</span>
                  </a>
                ))}
              </div>

              {category.extraContent && <div className="tech-exp__extra">{category.extraContent}</div>}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}
