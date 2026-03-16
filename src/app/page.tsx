"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Github, Linkedin, Mail, ArrowUpRight, Package } from "lucide-react";
import { SectionReveal } from "@/components/section-reveal";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const heroVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  }),
};

const techStack = [
  { label: "Flutter", highlight: true },
  { label: "Dart", highlight: true },
  { label: "Swift" },
  { label: "Kotlin" },
  { label: "iOS" },
  { label: "Android" },
  { label: "Clean Architecture" },
  { label: "Mobile Leadership" },
  { label: "CI/CD" },
  { label: "Digital Health" },
];

const experience = [
  {
    title: "Technical Lead — Mobile Apps",
    company: "SHL Telemedizin GmbH",
    location: "Munich, Germany",
    period: "Feb 2024 – Present",
    current: true,
  },
  {
    title: "Senior Software Engineer",
    company: "SHL Telemedizin GmbH",
    location: "Munich, Germany · Flutter, Dart",
    period: "Jan 2022 – Jan 2024",
  },
  {
    title: "Chief Technology Officer",
    company: "Airo.Care GmbH",
    location: "Ingolstadt, Germany",
    period: "Aug 2019 – Jul 2023",
  },
  {
    title: "Senior Software Engineer",
    company: "Bayerische Telemedallianz",
    location: "Baar-Ebenhausen, Germany · Flutter, Dart",
    period: "Feb 2021 – Nov 2021",
  },
  {
    title: "Head of Software Engineering",
    company: "GO-IN Gesundheitsorganisation Ingolstadt",
    location: "Ingolstadt, Germany · Flutter, Dart",
    period: "Apr 2019 – Feb 2021",
  },
  {
    title: "Artificial Intelligence Engineer",
    company: "Digital Product School — UnternehmerTUM",
    location: "Munich, Germany",
    period: "May 2019 – Jul 2019",
  },
  {
    title: "Software Engineer",
    company: "GO-IN Gesundheitsorganisation Ingolstadt",
    location: "Ingolstadt, Germany",
    period: "Jan 2019 – Mar 2019",
  },
  {
    title: "Android Development Intern",
    company: "GO-IN Gesundheitsorganisation Ingolstadt",
    location: "Ingolstadt, Germany · Android, Firebase",
    period: "Oct 2018 – Dec 2018",
  },
];

const ossProjects = [
  {
    title: "pub.dev — Flutter & Dart packages",
    desc: "Published packages under adiltirur.dev",
    href: "https://pub.dev/publishers/adiltirur.dev/packages",
  },
  {
    title: "Medium — articles on mobile development",
    desc: "Insights and learnings from building mobile apps",
    href: "https://medium.com/@adiltirur",
  },
  {
    title: "GitHub — @adiltirur",
    desc: "All public repositories and contributions",
    href: "https://github.com/adiltirur",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <header className="py-14 pb-12 sm:py-24 sm:pb-20">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6">
          <motion.div
            custom={0.05}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-5 flex items-center gap-2"
          >
            <span className="inline-block w-5 h-px bg-blue-600 dark:bg-blue-400" />
            Technical Lead · Mobile Engineering · Munich
          </motion.div>

          <motion.h1
            custom={0.15}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-[clamp(32px,6vw,52px)] font-semibold tracking-tight leading-[1.1] mb-3"
          >
            Adil Tirur
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-[3px] h-[0.85em] bg-blue-600 dark:bg-blue-400 ml-1 align-middle"
            />
          </motion.h1>

          <motion.p
            custom={0.22}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="font-mono text-xs text-muted-foreground mb-5"
          >
            {`// full name: Adil Chakkala Paramba — Tirur is where I'm from, and it just stuck.`}
          </motion.p>

          <motion.p
            custom={0.3}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg text-muted-foreground font-normal mb-9 max-w-[520px]"
          >
            Building robust mobile experiences from architecture to delivery. Flutter enthusiast. Robotics grad. Certified scuba diver.
          </motion.p>

          <motion.div
            custom={0.38}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-5 flex-wrap mb-9"
          >
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              Munich, Germany
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Briefcase className="h-4 w-4 flex-shrink-0" />
              SHL Telemedizin &amp; GradSprint LLP
            </span>
          </motion.div>

          <motion.div
            custom={0.46}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-3 flex-wrap items-center"
          >
              <a className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors" href="https://github.com/adiltirur" target="_blank" rel="noopener">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
              <a className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors" href="https://linkedin.com/in/adil-cp/" target="_blank" rel="noopener">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </a>
              <a className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors" href="mailto:adiltirur@gmail.com">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </a>
          </motion.div>
        </div>
      </header>

      {/* ABOUT */}
      <section id="about" className="py-14 sm:py-[72px] border-t border-border">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6">
          <SectionReveal>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-8">
              {/* about */}
            </p>
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <h2 className="text-2xl font-semibold tracking-tight mb-5">A bit about me</h2>
          </SectionReveal>

          <SectionReveal delay={0.16}>
            <p className="text-[15.5px] text-muted-foreground leading-[1.85] mb-4">
              I&apos;m a <strong className="text-foreground font-medium">Technical Lead for Mobile Apps</strong> at{" "}
              <strong className="text-foreground font-medium">SHL Telemedizin GmbH</strong> in Munich, and the{" "}
              <strong className="text-foreground font-medium">Founder of GradSprint LLP</strong>. My day-to-day lives at
              the intersection of clean architecture, mobile engineering, and building products that genuinely improve
              people&apos;s lives — currently in the digital health space.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.24}>
            <p className="text-[15.5px] text-muted-foreground leading-[1.85] mb-4">
              Here&apos;s the twist: I actually have an academic degree in{" "}
              <strong className="text-foreground font-medium">Robotics</strong>. Somehow I ended up deep in mobile
              development and never looked back — turns out a robot&apos;s loss is Flutter&apos;s gain. I love the craft
              of writing clean, maintainable code and I&apos;m particularly passionate about{" "}
              <strong className="text-foreground font-medium">Flutter &amp; Dart</strong>, which I&apos;ve been working
              with since its early days.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.32}>
            <p className="text-[15.5px] text-muted-foreground leading-[1.85] mb-7">
              Outside of work, I&apos;m slowly navigating Europe one trip at a time, and I&apos;m a{" "}
              <strong className="text-foreground font-medium">certified scuba diver</strong> — because apparently
              exploring the depths of the ocean and the depths of a codebase are the same kind of fun.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.4}>
            <div className="flex gap-2.5 flex-wrap mt-7 mb-8">
                <a className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors text-xs px-2.5 py-1" href="https://pub.dev/publishers/adiltirur.dev/packages" target="_blank" rel="noopener">
                  <Package className="h-3.5 w-3.5 mr-2" />
                  pub.dev packages
                </a>
                <a className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors text-xs px-2.5 py-1" href="https://medium.com/@adiltirur" target="_blank" rel="noopener">
                  Medium articles
                </a>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.48}>
            <div className="flex flex-wrap gap-2 mt-2">
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech.label}
                  initial={{ opacity: 0, scale: 0.88, y: 8 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.055, duration: 0.4, ease: EASE }}
                  whileHover={{ y: -2 }}
                  className={`font-mono text-xs px-3 py-1 rounded-md border cursor-default ${
                    tech.highlight
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                      : "bg-muted border-border text-muted-foreground"
                  }`}
                >
                  {tech.label}
                </motion.span>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-14 sm:py-[72px] border-t border-border">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6">
          <SectionReveal>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-8">
              {/* experience */}
            </p>
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <h2 className="text-2xl font-semibold tracking-tight mb-8">Where I&apos;ve worked</h2>
          </SectionReveal>

          <div className="flex flex-col">
            {experience.map((exp, i) => (
              <SectionReveal key={i} delay={0.08 + i * 0.08}>
                <div className="group grid grid-cols-[1px_1fr] gap-x-4 sm:gap-x-6 pb-8 sm:pb-10 last:pb-0">
                  <div className="relative mt-[6px] w-px bg-border">
                    <div
                      className={`absolute top-0 left-1/2 -translate-x-1/2 w-[9px] h-[9px] rounded-full border-2 border-blue-500 transition-all duration-300 group-hover:scale-[1.4] ${
                        exp.current ? "bg-blue-500" : "bg-background"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-start flex-wrap gap-1 mb-1">
                      <span className="text-[15px] font-semibold text-foreground">
                        {exp.title}
                        {exp.current && (
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 ml-2 align-middle">
                            current
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground pt-0.5">
                        {exp.period}
                      </span>
                    </div>
                    <div className="text-[13px] text-blue-600 dark:text-blue-400 font-medium mb-1">{exp.company}</div>
                    <div className="font-mono text-xs text-muted-foreground">{exp.location}</div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN SOURCE */}
      <section id="oss" className="py-14 sm:py-[72px] border-t border-border">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6">
          <SectionReveal>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-8">
              {/* open source */}
            </p>
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <h2 className="text-2xl font-semibold tracking-tight mb-5">Packages &amp; writing</h2>
          </SectionReveal>
          <SectionReveal delay={0.16}>
            <p className="text-[15px] text-muted-foreground mb-7">
              I publish Flutter and Dart packages on pub.dev and share mobile engineering insights on Medium. More
              packages coming — the goal is definitely packages (plural).
            </p>
          </SectionReveal>

          <div className="flex flex-col gap-3">
            {ossProjects.map((proj, i) => (
              <SectionReveal key={i} delay={0.24 + i * 0.08}>
                <motion.a
                  href={proj.href}
                  target="_blank"
                  rel="noopener"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="group flex justify-between items-start gap-4 p-4 sm:p-6 rounded-xl border border-border bg-card hover:border-blue-500 dark:hover:border-blue-400 transition-colors shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="text-[15px] font-semibold text-card-foreground mb-1">{proj.title}</div>
                    <div className="text-[13px] text-muted-foreground">{proj.desc}</div>
                  </div>
                  <ArrowUpRight className="h-[18px] w-[18px] text-muted-foreground flex-shrink-0 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-[250ms]" />
                </motion.a>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={0.56}>
            <p className="mt-5 text-[13px] text-muted-foreground">
              All open source work is provided under the MIT License. See{" "}
              <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms
              </Link>{" "}
              &amp;{" "}
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy
              </Link>{" "}
              for full details.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-14 sm:py-[72px] border-t border-border">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6">
          <SectionReveal>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-8">
              {/* contact */}
            </p>
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <h2 className="text-2xl font-semibold tracking-tight mb-5">Get in touch</h2>
          </SectionReveal>
          <SectionReveal delay={0.16}>
            <div className="bg-muted border border-border rounded-xl p-5 sm:p-9">
              <p className="text-muted-foreground mb-6 text-[15px]">
                Whether it&apos;s a project, a role, a collaboration on Flutter packages, or just a chat about mobile
                engineering — my inbox is open.
              </p>
              <div className="flex flex-wrap gap-3">
                  <a className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors" href="mailto:adiltirur@gmail.com">
                    <Mail className="h-4 w-4 mr-2" />
                    adiltirur@gmail.com
                  </a>
                  <a className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors" href="https://github.com/adiltirur" target="_blank" rel="noopener">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                  <a className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors" href="https://linkedin.com/in/adil-cp/" target="_blank" rel="noopener">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 flex justify-between items-center flex-wrap gap-3">
          <span className="font-mono text-xs text-muted-foreground">© 2026 adiltirur.dev</span>
          <div className="flex gap-5 flex-wrap">
            {[
              { label: "GitHub", href: "https://github.com/adiltirur", external: true },
              { label: "LinkedIn", href: "https://linkedin.com/in/adil-cp/", external: true },
              { label: "Medium", href: "https://medium.com/@adiltirur", external: true },
              { label: "Terms", href: "/terms", external: false },
              { label: "Privacy", href: "/privacy", external: false },
            ].map((link) => (
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener"
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
