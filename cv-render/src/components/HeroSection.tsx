"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";
import {
  Sparkles,
  Shield,
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  MapPin,
  Code,
  Lock,
  Layers,
  Database,
  ExternalLink,
  Mail,
  Phone,
  Github,
  Linkedin,
  FileText,
  Languages,
  Zap,
  Bot,
  CheckCircle2,
} from "lucide-react";
import Navbar from "./Navbar";
import AIChatAgent from "./AIChatAgent";
import NeuralBackground from "./NeuralBackground";
import ArchitectureSection from "@/components/ArchitectureSection";

interface CyberLazyLoadProps {
  children: React.ReactNode;
}

function CyberLazyLoad({ children }: CyberLazyLoadProps) {
  const [loaded, setLoaded] = useState(false);
  const [isCyber, setIsCyber] = useState(false);

  useEffect(() => {
    const checkCyber = () => {
      setIsCyber(document.documentElement.classList.contains("cyberpunk"));
    };
    checkCyber();
    
    const observer = new MutationObserver(checkCyber);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!isCyber) {
    return <>{children}</>;
  }

  return (
    <motion.div
      onViewportEnter={() => {
        if (!loaded) {
          setTimeout(() => setLoaded(true), 600);
        }
      }}
      className="relative"
    >
      {!loaded ? (
        <div className="w-full py-16 flex flex-col items-center justify-center font-mono text-xs text-[var(--accent-color)] gap-2 select-none">
          <div className="animate-pulse tracking-widest">
            &gt;&gt; LOADING MODULE... [PORT_80]
          </div>
          <div className="w-48 h-[2px] bg-[var(--border-color)] overflow-hidden relative rounded-full">
            <div className="absolute top-0 left-0 h-full w-1/3 animate-[cyber-scan_1s_linear_infinite]" style={{ background: "linear-gradient(90deg, transparent, var(--accent-color), var(--accent-color-end), transparent)" }} />
          </div>
          <div className="text-[9px] tracking-[0.2em] opacity-50 mt-1">CYBERPUNK RENDERER v2.0</div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHeroHidden, setIsHeroHidden] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [loaderMounted, setLoaderMounted] = useState(true);

  // Mouse parallax for floating cards
  const mouseX = useSpring(0, { stiffness: 60, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 60, damping: 20 });
  const leftCardX = useTransform(mouseX, [-1, 1], [-8, 8]);
  const leftCardY2 = useTransform(mouseY, [-1, 1], [-6, 6]);
  const rightCardX = useTransform(mouseX, [-1, 1], [8, -8]);
  const rightCardY2 = useTransform(mouseY, [-1, 1], [-6, 6]);

  const { scrollY } = useScroll();

  // Typography Parallax (no fade)
  const heroY = useTransform(scrollY, [0, 450], [0, -80]);

  // Left Card Parallax (no fade)
  const leftCardY = useTransform(scrollY, [0, 450], [0, -120]);

  // Right Card Parallax (no fade)
  const rightCardY = useTransform(scrollY, [0, 450], [0, -140]);

  // Monitor scroll height to apply display: none when fully covered
  useMotionValueEvent(scrollY, "change", (latest) => {
    const threshold = typeof window !== "undefined" ? window.innerHeight : 800;
    if (latest > threshold) {
      if (!isHeroHidden) setIsHeroHidden(true);
    } else {
      if (isHeroHidden) setIsHeroHidden(false);
    }
  });

  // Force scroll to top (Hero section) on page load / reload
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  // Lock scroll during loading
  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoader]);

  // Mouse parallax tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    mouseX.set(nx);
    mouseY.set(ny);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-[var(--background)] text-[var(--foreground)] font-sans select-none overflow-x-hidden"
    >
      {/* Neural network animated background */}
      <NeuralBackground />
      {/* 0. CURTAIN LOADER SCREEN */}
      {loaderMounted && (
        <motion.div
          id="curtain-loader-screen"
          data-loader-active={showLoader ? "true" : "false"}
          initial={{ y: 0 }}
          animate={{
            y: showLoader ? 0 : "-100vh",
          }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            if (!showLoader) {
              setLoaderMounted(false);
            }
          }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)] border-b-2 border-[var(--accent-color)] ${!showLoader ? "pointer-events-none" : ""}`}
        >
          <div className="flex flex-col items-center gap-6 select-none">
            {/* Animated Name */}
            <motion.div
              id="loader-name-target"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: [0, 1, 1], scale: [0.98, 1, 1] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-2xl md:text-3xl font-bold font-serif text-[var(--foreground)] tracking-widest uppercase text-center"
            >
              Hasir Sayed
            </motion.div>
            
            {/* Custom Loading Progress Bar */}
            <div className="w-24 h-[1.5px] bg-[var(--border-color)] relative overflow-hidden rounded-full">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 1.8,
                  ease: "easeInOut",
                }}
                onAnimationComplete={() => {
                  setShowLoader(false);
                }}
                className="absolute top-0 left-0 h-full bg-[var(--accent-color)] cyber-grad-bg"
              />
            </div>

            {/* Subtitle fading in */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-[9px] font-mono tracking-[0.2em] text-[var(--text-muted)] uppercase mt-1 text-center"
            >
              Initialising System
            </motion.span>
          </div>
        </motion.div>
      )}

      {/* FIXED NAVBAR HEADER */}
      {/* Stays fixed at the top of the viewport */}
      <header className="fixed top-0 inset-x-0 z-40">
        <Navbar />
      </header>

      {/* 1. FIXED BACKGROUND HERO SECTION (UNMOVABLE) */}
      {/* Stays completely stationary under the curtain scroll */}
      <div
        className="fixed inset-0 h-screen w-full flex flex-col justify-center items-center p-4 md:p-6 bg-[var(--background)] z-10"
        style={{ display: isHeroHidden ? "none" : "flex" }}
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center pt-20">
          
          {/* Subtle grid background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--glow-bg),transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          {/* B. Left Floating Card: Profile & Education */}
          <motion.div
            style={{ y: leftCardY, x: leftCardX }}
            className="absolute z-10 w-[300px] md:w-[340px] left-4 md:left-12 top-[65%] md:top-[50%] -translate-y-1/2 hidden lg:block pointer-events-auto"
          >
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--border-color)] p-5 shadow-2xl hover:border-[var(--border-hover)] transition-all duration-300"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                  <span className="text-[10px] font-mono tracking-widest text-[var(--accent-color)] uppercase">
                    Profile / Field Notes
                  </span>
                  <Sparkles size={12} className="text-[var(--accent-color)]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)] font-serif leading-tight">
                    Work with evidence, ship with care.
                  </h3>
                </div>
                <div className="space-y-3 text-xs text-[var(--text-muted)] font-mono">
                  <div className="flex items-start gap-2">
                    <Code size={13} className="mt-0.5 text-[var(--text-muted)] shrink-0" />
                    <span>
                      <strong className="text-[var(--foreground)]">Focus:</strong> LLM safety, NLP, data pipelines, SLM fine-tuning
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[var(--text-muted)] shrink-0" />
                    <span>Based in Bangalore, India</span>
                  </div>
                  <div className="flex items-start gap-2 border-t border-[var(--border-color)] pt-2">
                    <GraduationCap size={14} className="mt-0.5 text-[var(--text-muted)] shrink-0" />
                    <span>
                      <strong className="text-[var(--foreground)]">Education:</strong> BS in Data Science and Applications, IIT Madras (Online program)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <GraduationCap size={14} className="mt-0.5 text-[var(--text-muted)] shrink-0" />
                    <span>
                      <strong className="text-[var(--foreground)]">Concurrent:</strong> B.Sc. in Mathematics (Honours), MDSU (expected 2027)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-t border-[var(--border-color)] pt-2 text-[10px] text-[var(--text-muted)]">
                    <Languages size={12} className="shrink-0" />
                    <span>English / Hindi</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* C. Right Floating Card: AI Safety & Janitor AI */}
          <motion.div
            style={{ y: rightCardY, x: rightCardX }}
            className="absolute z-10 w-[300px] md:w-[340px] right-4 md:right-12 top-[65%] md:top-[50%] -translate-y-1/2 hidden lg:block pointer-events-auto"
          >
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--border-color)] p-5 shadow-2xl hover:border-[var(--border-hover)] transition-all duration-300"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                  <span className="text-[10px] font-mono tracking-widest text-[var(--accent-color)] uppercase">
                    Current Role · Janitor AI
                  </span>
                  <Shield size={12} className="text-[var(--accent-color)]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)] font-serif leading-tight">
                    AI Safety and Data Pipeline Engineer
                  </h3>
                </div>
                <ul className="space-y-2 text-xs text-[var(--text-muted)] font-mono">
                  <li className="flex items-start gap-2">
                    <Lock size={12} className="mt-0.5 text-[var(--text-muted)] shrink-0" />
                    <span>Real-time PII detection and prompt injection safeguards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Layers size={12} className="mt-0.5 text-[var(--text-muted)] shrink-0" />
                    <span>3-Agent workflow (Eval, Validation, Execution)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Database size={12} className="mt-0.5 text-[var(--text-muted)] shrink-0" />
                    <span>Context optimization (35% API savings)</span>
                  </li>
                  <li className="flex items-start gap-2 border-t border-[var(--border-color)] pt-2">
                    <Sparkles size={12} className="mt-0.5 text-[var(--accent-color)] shrink-0" />
                    <span>
                      <a href="https://zenodo.org/records/21396947" target="_blank" rel="noopener" className="text-[var(--foreground)] hover:text-[var(--accent-color)] hover:underline transition-colors">
                        Published: Benchmarking SLM performance (Zenodo Record 21396947) ↗
                      </a>
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>

          {/* A. Central Typography & CTAs */}
          <motion.div
            style={{ y: heroY }}
            className="w-full max-w-xl md:max-w-2xl text-center px-4 sm:px-6 z-10 pointer-events-auto flex flex-col items-center mx-auto"
          >
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[9px] sm:text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-5 sm:mb-6 font-mono transition-colors duration-300 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="truncate">DATA SCIENCE / APPLIED AI / RESEARCH</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[var(--foreground)] font-serif leading-[1.08] sm:leading-[1.05] tracking-tight mb-4 sm:mb-6 transition-colors duration-300 w-full px-2">
              Making machines <br className="hidden sm:inline" />
              <span className="italic font-light text-[var(--text-muted)]">understand</span> people.
            </h1>

            {/* Subtitle */}
            <p className="text-[var(--text-muted)] text-xs sm:text-sm md:text-base w-full max-w-sm sm:max-w-lg mx-auto leading-relaxed mb-6 sm:mb-8 transition-colors duration-300 px-3 sm:px-0 cyber-grad-text">
              Hasir Sayed is a data science student and AI/ML engineer building
              reliable language systems, safer AI workflows, and practical data
              products.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <a
                href="#experience-section"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("experience-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-bold tracking-wider uppercase hover:shadow-[0_0_24px_var(--accent-color)] hover:opacity-90 transition-all duration-300 shadow-lg text-center cyber-btn-accent"
              >
                EXPLORE PROJECTS ↓
              </a>
              <a
                href="/HASIR_SAYED.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 sm:py-3 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-xs font-bold tracking-wider uppercase hover:bg-[var(--border-color)] hover:border-[var(--border-hover)] transition-all font-mono text-[var(--foreground)] text-center"
              >
                RESUME ↗
              </a>
            </div>

            {/* Mobile / Tablet Marquee Ticker (visible only below lg) */}
            <div className="block lg:hidden w-full mt-8 overflow-hidden">
              <div className="relative flex">
                {/* Edge fade masks */}
                <div className="absolute left-0 top-0 h-full w-10 z-10 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 h-full w-10 z-10 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none" />
                {/* Marquee track — duplicated for seamless loop */}
                <div className="flex gap-3 animate-marquee whitespace-nowrap">
                  {([
                    { icon: <MapPin size={10} />, label: "Bangalore, India" },
                    { icon: <GraduationCap size={10} />, label: "IIT Madras · BS Data Science" },
                    { icon: <Briefcase size={10} />, label: "Janitor AI · AI Safety Engineer" },
                    { icon: <Lock size={10} />, label: "Real-time PII Detection" },
                    { icon: <Bot size={10} />, label: "LLM Safety and NLP" },
                    { icon: <Layers size={10} />, label: "3-Agent Workflow" },
                    { icon: <Database size={10} />, label: "SLM Fine-tuning" },
                    { icon: <FileText size={10} />, label: "Published · Zenodo 21396947" },
                    { icon: <Languages size={10} />, label: "English / Hindi" },
                    { icon: <Zap size={10} />, label: "35% API Cost Savings" },
                  ] as { icon: React.ReactNode; label: string }[]).concat([
                    { icon: <MapPin size={10} />, label: "Bangalore, India" },
                    { icon: <GraduationCap size={10} />, label: "IIT Madras · BS Data Science" },
                    { icon: <Briefcase size={10} />, label: "Janitor AI · AI Safety Engineer" },
                    { icon: <Lock size={10} />, label: "Real-time PII Detection" },
                    { icon: <Bot size={10} />, label: "LLM Safety and NLP" },
                    { icon: <Layers size={10} />, label: "3-Agent Workflow" },
                    { icon: <Database size={10} />, label: "SLM Fine-tuning" },
                    { icon: <FileText size={10} />, label: "Published · Zenodo 21396947" },
                    { icon: <Languages size={10} />, label: "English / Hindi" },
                    { icon: <Zap size={10} />, label: "35% API Cost Savings" },
                  ]).map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--glass-bg)] text-[10px] font-mono tracking-wider text-[var(--text-muted)] shrink-0"
                    >
                      <span className="text-[var(--accent-color)]">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. NATURAL SCROLLING OVERLAY CONTAINER (CURTAIN EFFECT) */}
      {/* Starts exactly below the viewport height, scrolling UP and OVER the stationary hero */}
      <div
        id="experience-section"
        className="relative z-20 w-full min-h-screen bg-[var(--background)] rounded-t-[40px] shadow-[0_-24px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_-24px_50px_rgba(0,0,0,0.6)] border-t border-[var(--border-color)] px-6 md:px-12 mt-[100vh] pointer-events-auto"
      >
        <div className="max-w-4xl mx-auto py-12 flex flex-col gap-12 bg-transparent pb-20">
          
          {/* Section 01: Featured Work */}
          <CyberLazyLoad>
            <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-[var(--border-color)] pb-4"
            >
              <span className="text-xs font-mono tracking-widest text-[var(--accent-color)]">
                Work Experience
              </span>
              <h2 className="text-2xl md:text-4xl font-bold font-serif text-[var(--foreground)] mt-2">
                Building safer, more useful AI systems.
              </h2>
            </motion.div>

            {/* Experience timeline/cards */}
            <div className="flex flex-col gap-8">
              
              {/* Janitor AI Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ rotateX: 1.5, rotateY: -1.5, scale: 1.005 }}
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 md:p-8 hover:border-[var(--accent-color)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 flex flex-col justify-between shadow-2xl"
              >
                <div className="flex items-center justify-between gap-2 mb-2 text-[10px] text-[var(--text-muted)]">
                  <span className="font-semibold text-[var(--accent-color)] tracking-wider">JANITOR AI · BANGALORE / REMOTE</span>
                  <span>2025 — PRESENT</span>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold font-serif text-[var(--foreground)]">
                    AI Safety and Data Pipeline Engineer
                  </h3>

                  {/* Key Metrics - Clean Typography without boxed pill borders */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 my-4 border-y border-[var(--border-color)]">
                    {[
                      { n: "3", label: "Agent Architecture" },
                      { n: "15+", label: "Integrated Tools" },
                      { n: "35%", label: "Cost Savings" },
                      { n: "Real-Time", label: "PII Redaction" },
                    ].map(({ n, label }) => (
                      <div key={label} className="flex flex-col">
                        <span className="text-xl md:text-2xl font-extrabold text-[var(--foreground)] tracking-tight">{n}</span>
                        <span className="text-[10px] text-[var(--text-muted)] mt-0.5">{label}</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-sm text-[var(--foreground)] opacity-90 mb-4 leading-relaxed">
                    Built an autonomous data science tool deployed on Vercel, with decoupled data cleaning and preprocessing pipelines designed for high-throughput, maintainable workflows. Designed secure BYOK API-key handling; real-time PII detection and redaction; prompt-injection and jailbreak safeguards; and human-in-the-loop review for high-risk outputs.
                  </p>

                  <ul className="text-xs text-[var(--text-muted)] space-y-2 list-disc list-inside leading-relaxed mb-6 pl-1 border-t border-[var(--border-color)] pt-4">
                    <li>Developed a collaborative three-agent workflow (Evaluation, Structural Validation, Task Execution) that automates complex data sanitization operations.</li>
                    <li>Built real-time prompt-injection filters, jailbreak shields, and customized PII masking routines to protect user-provided data.</li>
                    <li>Optimized structural output consistency and memory retention limits using multi-agent simulation loops and adversarial test scenarios.</li>
                  </ul>
                </div>

                <div className="border-t border-[var(--border-color)] pt-4 mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold tracking-wider text-[var(--foreground)] opacity-50 mr-1">Stack:</span>
                    {["Python", "Vercel", "LangChain", "Pydantic", "Ollama", "AI safety"].map(t => (
                      <span key={t} className="text-[10px] bg-[var(--card-bg)] border border-[var(--border-color)] px-2 py-0.5 text-[var(--text-muted)] rounded">{t}</span>
                    ))}
                  </div>
                  <a
                    href="https://janitorai-beta.vercel.app"
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1 text-[11px] text-[var(--accent-color)] hover:underline self-start sm:self-auto"
                  >
                    janitorai-beta.vercel.app <ExternalLink size={10} />
                  </a>
                </div>
              </motion.div>

              {/* Independent Developer Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                whileHover={{ rotateX: 1.5, rotateY: -1.5, scale: 1.005 }}
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 md:p-8 hover:border-[var(--accent-color)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 flex flex-col justify-between shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-2">
                    <span className="font-semibold text-[var(--accent-color)] tracking-wider">INDEPENDENT · REMOTE</span>
                    <span>2024 — PRESENT</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-serif text-[var(--foreground)]">
                    AI and Agentic Systems Developer
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] opacity-70 mb-4 mt-1">Portfolio Platform</p>
                  
                  <p className="text-sm text-[var(--foreground)] opacity-90 mb-4 leading-relaxed">
                    Created and deployed an agentic portfolio platform to present technical work through a more capable, interactive experience. Integrated custom APIs and Model Context Protocol (MCP) capabilities to distribute tasks and support autonomous execution.
                  </p>

                  <ul className="text-xs text-[var(--text-muted)] space-y-2 list-disc list-inside leading-relaxed mb-6 pl-1 border-t border-[var(--border-color)] pt-4">
                    <li>Designed custom servers implementing the Model Context Protocol (MCP) to let localized LLMs safely inspect directory contexts and execute local commands.</li>
                    <li>Programmed task-orchestration workers to split complicated multi-step requests into atomic stages, achieving fully autonomous task resolution.</li>
                    <li>Optimized context window packing and conversational history trees, reducing API costs by 35% while maintaining accuracy and responsiveness.</li>
                  </ul>
                </div>

                <div className="border-t border-[var(--border-color)] pt-4 mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold tracking-wider text-[var(--foreground)] opacity-50 mr-1">Stack:</span>
                    {["Node.js", "TypeScript", "MCP SDK", "Next.js", "REST APIs"].map(t => (
                      <span key={t} className="text-[10px] bg-[var(--card-bg)] border border-[var(--border-color)] px-2 py-0.5 text-[var(--text-muted)] rounded">{t}</span>
                    ))}
                  </div>
                  <a
                    href="https://github.com/Sayyedhash888/memory-janitor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[var(--accent-color)] hover:underline self-start sm:self-auto"
                  >
                    github.com/Sayyedhash888/memory-janitor <ExternalLink size={10} />
                  </a>
                </div>
              </motion.div>

            </div>
            </div>
          </CyberLazyLoad>

          {/* Section 02: Selected Work */}
          <CyberLazyLoad>
            <div id="projects-section" className="flex flex-col gap-8 scroll-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-[var(--border-color)] pb-4"
            >
              <span className="text-xs font-mono tracking-widest text-[var(--accent-color)]">
                Featured Projects
              </span>
              <h2 className="text-2xl md:text-4xl font-bold font-serif text-[var(--foreground)] mt-2">
                Data science and AI projects, in detail.
              </h2>
            </motion.div>

            <div className="flex flex-col gap-6 mt-4">
              
              {/* Project 1 */}
              <motion.a
                href="https://github.com/Sayyedhash888/H-Ai"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 md:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/30 hover:bg-[var(--card-bg)]/60 hover:border-[var(--accent-color)] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col gap-6 group"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--accent-color)] tracking-widest">
                      Model Development
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold font-serif text-[var(--foreground)] group-hover:text-[var(--accent-color)] transition-colors mt-1">
                      Personal SLM fine-tuning
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors self-start sm:self-auto shrink-0">
                    <span>Visit repository</span>
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Description and Stack */}
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    Fine-tuned Qwen 2.5 (0.5B) on a custom domain dataset using supervised fine-tuning. Built the full loop: collection, cleaning, deduplication, dataset structuring, hyperparameter tuning, baseline evaluation, and prompt/dataset iteration. The model was deployed locally with quantisation and inference optimisation for privacy-conscious use on consumer hardware.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Qwen 2.5", "SFT", "Quantisation"].map((t) => (
                      <span key={t} className="text-[10px] font-mono border border-[var(--border-color)] bg-[var(--card-bg)] rounded px-2.5 py-1 text-[var(--text-muted)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Browser Frame Wrapper */}
                <div className="w-full rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)] shadow-md transition-colors duration-300">
                  {/* Browser Top Bar */}
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border-color)] bg-black/[0.02] dark:bg-white/[0.01]">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#ef4444]/60"></span>
                      <span className="w-2 h-2 rounded-full bg-[#eab308]/60"></span>
                      <span className="w-2 h-2 rounded-full bg-[#22c55e]/60"></span>
                    </div>
                    <div className="mx-auto bg-black/[0.04] dark:bg-white/[0.04] rounded px-3 py-0.5 text-[8px] text-[var(--text-muted)] font-mono max-w-[200px] truncate select-none text-center">
                      github.com/Sayyedhash888/H-Ai
                    </div>
                  </div>
                  {/* Video */}
                  <div className="relative aspect-video w-full bg-black/[0.02] border-t border-transparent overflow-hidden group/mockup">
                    <div className="w-full h-full transition-all duration-150 ease-out group-hover/mockup:blur-sm group-hover/mockup:scale-[1.02]">
                      <video
                        src="/h_ai_demo.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Blur Overlay & Button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/35 opacity-0 group-hover/mockup:opacity-100 transition-all duration-150 ease-out backdrop-blur-[1px] pointer-events-none">
                      <div className="px-4 py-2 rounded-full border border-white/20 bg-white/10 dark:bg-black/40 backdrop-blur-md text-white font-mono text-[10px] md:text-xs font-bold tracking-wider uppercase shadow-lg transform translate-y-2 group-hover/mockup:translate-y-0 transition-all duration-150 ease-out flex items-center gap-1.5">
                        <span>View Repository</span>
                        <ExternalLink size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>

              {/* Project 2 */}
              <motion.a
                href="https://janitorai-beta.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                className="p-6 md:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/30 hover:bg-[var(--card-bg)]/60 hover:border-[var(--accent-color)] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col gap-6 group"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--accent-color)] tracking-widest">
                      Data Product
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold font-serif text-[var(--foreground)] group-hover:text-[var(--accent-color)] transition-colors mt-1">
                      Autonomous data science tool
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors self-start sm:self-auto shrink-0">
                    <span>Visit website</span>
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Description and Stack */}
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    A deployed data product that automates complex preprocessing work. The architecture separates evaluation, structural validation, and task execution across three collaborating agents, while keeping the pipeline maintainable and responsive for real-world data-cleaning flows.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "Agents", "Data cleaning"].map((t) => (
                      <span key={t} className="text-[10px] font-mono border border-[var(--border-color)] bg-[var(--card-bg)] rounded px-2.5 py-1 text-[var(--text-muted)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Browser Frame Wrapper */}
                <div className="w-full rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)] shadow-md transition-colors duration-300">
                  {/* Browser Top Bar */}
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border-color)] bg-black/[0.02] dark:bg-white/[0.01]">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#ef4444]/60"></span>
                      <span className="w-2 h-2 rounded-full bg-[#eab308]/60"></span>
                      <span className="w-2 h-2 rounded-full bg-[#22c55e]/60"></span>
                    </div>
                    <div className="mx-auto bg-black/[0.04] dark:bg-white/[0.04] rounded px-3 py-0.5 text-[8px] text-[var(--text-muted)] font-mono max-w-[200px] truncate select-none text-center">
                      janitorai-beta.vercel.app
                    </div>
                  </div>
                  {/* Video */}
                  <div className="relative aspect-video w-full bg-black/[0.02] border-t border-transparent overflow-hidden group/mockup">
                    <div className="w-full h-full transition-all duration-150 ease-out group-hover/mockup:blur-sm group-hover/mockup:scale-[1.02]">
                      <video
                        src="/janitor_demo.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Blur Overlay & Button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/35 opacity-0 group-hover/mockup:opacity-100 transition-all duration-150 ease-out backdrop-blur-[1px] pointer-events-none">
                      <div className="px-4 py-2 rounded-full border border-white/20 bg-white/10 dark:bg-black/40 backdrop-blur-md text-white font-mono text-[10px] md:text-xs font-bold tracking-wider uppercase shadow-lg transform translate-y-2 group-hover/mockup:translate-y-0 transition-all duration-150 ease-out flex items-center gap-1.5">
                        <span>View Site</span>
                        <ExternalLink size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>

              {/* Project 3 */}
              <motion.a
                href="https://syedsabiya.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="p-6 md:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/30 hover:bg-[var(--card-bg)]/60 hover:border-[var(--accent-color)] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col gap-6 group"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--accent-color)] tracking-widest">
                      Client Product
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold font-serif text-[var(--foreground)] group-hover:text-[var(--accent-color)] transition-colors mt-1">
                      Operations and MIS Portfolio with AI Assistant
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors self-start sm:self-auto shrink-0">
                    <span>Visit website</span>
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Description and Stack */}
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    Designed and built an executive-style portfolio for a Business Operations and MIS leader. The site pairs a structured representation of experience, projects, and certifications with an AI assistant that can answer recruiter questions from portfolio knowledge.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["RAG concepts", "UX", "AI assistant"].map((t) => (
                      <span key={t} className="text-[10px] font-mono border border-[var(--border-color)] bg-[var(--card-bg)] rounded px-2.5 py-1 text-[var(--text-muted)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Browser Frame Wrapper */}
                <div className="w-full rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)] shadow-md transition-colors duration-300">
                  {/* Browser Top Bar */}
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border-color)] bg-black/[0.02] dark:bg-white/[0.01]">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#ef4444]/60"></span>
                      <span className="w-2 h-2 rounded-full bg-[#eab308]/60"></span>
                      <span className="w-2 h-2 rounded-full bg-[#22c55e]/60"></span>
                    </div>
                    <div className="mx-auto bg-black/[0.04] dark:bg-white/[0.04] rounded px-3 py-0.5 text-[8px] text-[var(--text-muted)] font-mono max-w-[200px] truncate select-none text-center">
                      syedsabiya.netlify.app
                    </div>
                  </div>
                  {/* Video */}
                  <div className="relative aspect-video w-full bg-black/[0.02] border-t border-transparent overflow-hidden group/mockup">
                    <div className="w-full h-full transition-all duration-150 ease-out group-hover/mockup:blur-sm group-hover/mockup:scale-[1.02]">
                      <video
                        src="/sabiya_demo.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Blur Overlay & Button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/35 opacity-0 group-hover/mockup:opacity-100 transition-all duration-150 ease-out backdrop-blur-[1px] pointer-events-none">
                      <div className="px-4 py-2 rounded-full border border-white/20 bg-white/10 dark:bg-black/40 backdrop-blur-md text-white font-mono text-[10px] md:text-xs font-bold tracking-wider uppercase shadow-lg transform translate-y-2 group-hover/mockup:translate-y-0 transition-all duration-150 ease-out flex items-center gap-1.5">
                        <span>View Site</span>
                        <ExternalLink size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>

              {/* Project 4 */}
              <motion.a
                href="https://syedzahid.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="p-6 md:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/30 hover:bg-[var(--card-bg)]/60 hover:border-[var(--accent-color)] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col gap-6 group"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--accent-color)] tracking-widest">
                      Client Product
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold font-serif text-[var(--foreground)] group-hover:text-[var(--accent-color)] transition-colors mt-1">
                      Professional portfolio website
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors self-start sm:self-auto shrink-0">
                    <span>Visit website</span>
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Description and Stack */}
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    Designed and developed a customized, responsive portfolio website tailored to the client's professional background and career goals.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["UX", "Responsive Design", "Custom Portfolio"].map((t) => (
                      <span key={t} className="text-[10px] font-mono border border-[var(--border-color)] bg-[var(--card-bg)] rounded px-2.5 py-1 text-[var(--text-muted)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Browser Frame Wrapper */}
                <div className="w-full rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)] shadow-md transition-colors duration-300">
                  {/* Browser Top Bar */}
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border-color)] bg-black/[0.02] dark:bg-white/[0.01]">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#ef4444]/60"></span>
                      <span className="w-2 h-2 rounded-full bg-[#eab308]/60"></span>
                      <span className="w-2 h-2 rounded-full bg-[#22c55e]/60"></span>
                    </div>
                    <div className="mx-auto bg-black/[0.04] dark:bg-white/[0.04] rounded px-3 py-0.5 text-[8px] text-[var(--text-muted)] font-mono max-w-[200px] truncate select-none text-center">
                      syedzahid.netlify.app
                    </div>
                  </div>
                  {/* Video */}
                  <div className="relative aspect-video w-full bg-black/[0.02] border-t border-transparent overflow-hidden group/mockup">
                    <div className="w-full h-full transition-all duration-150 ease-out group-hover/mockup:blur-sm group-hover/mockup:scale-[1.02]">
                      <video
                        src="/zahid_demo.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Blur Overlay & Button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/35 opacity-0 group-hover/mockup:opacity-100 transition-all duration-150 ease-out backdrop-blur-[1px] pointer-events-none">
                      <div className="px-4 py-2 rounded-full border border-white/20 bg-white/10 dark:bg-black/40 backdrop-blur-md text-white font-mono text-[10px] md:text-xs font-bold tracking-wider uppercase shadow-lg transform translate-y-2 group-hover/mockup:translate-y-0 transition-all duration-150 ease-out flex items-center gap-1.5">
                        <span>View Site</span>
                        <ExternalLink size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>

              {/* Project 5 */}
              <motion.a
                href="https://zenodo.org/records/21396947"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="p-6 md:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/30 hover:bg-[var(--card-bg)]/60 hover:border-[var(--accent-color)] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col gap-6 group"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--accent-color)] tracking-widest">
                      Research and Publications
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold font-serif text-[var(--foreground)] group-hover:text-[var(--accent-color)] transition-colors mt-1">
                      Benchmarking SLM Performance and Integration
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors self-start sm:self-auto shrink-0">
                    <span>Read publication</span>
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Description and Stack */}
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    Published research paper (Zenodo DOI: 10.5281/zenodo.21396947) systematically comparing lightweight language models across capability, inference speed, resource usage, and edge deployment trade-offs. Developed a reproducible evaluation benchmark methodology.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["DOI: 10.5281/zenodo.21396947", "Benchmarking", "Data analysis"].map((t) => (
                      <span key={t} className="text-[10px] font-mono border border-[var(--border-color)] bg-[var(--card-bg)] rounded px-2.5 py-1 text-[var(--text-muted)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mock Paper Preview */}
                <div className="w-full lg:w-[45%] shrink-0 flex flex-col items-end gap-2">
                  <div className="w-full rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)] shadow-md transition-colors duration-300">
                    {/* Browser Top Bar */}
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border-color)] bg-black/[0.02] dark:bg-white/[0.01]">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444]/60"></span>
                        <span className="w-2 h-2 rounded-full bg-[#eab308]/60"></span>
                        <span className="w-2 h-2 rounded-full bg-[#22c55e]/60"></span>
                      </div>
                      <div className="mx-auto bg-black/[0.04] dark:bg-white/[0.04] rounded px-3 py-0.5 text-[8px] text-[var(--text-muted)] font-mono max-w-[150px] truncate select-none text-center">
                        zenodo.org/records/21396947
                      </div>
                    </div>
                    {/* Research Document Mock */}
                    <div className="relative aspect-video w-full bg-[var(--card-bg)] border-t border-transparent overflow-hidden group/mockup">
                      <div className="w-full h-full p-4 flex flex-col justify-between font-sans text-left transition-all duration-150 ease-out group-hover/mockup:blur-sm group-hover/mockup:scale-[1.03]">
                        <div className="space-y-1 md:space-y-2">
                          <span className="text-[8px] font-mono tracking-widest text-[var(--accent-color)] uppercase">Zenodo Publication</span>
                          <h4 className="text-[10px] md:text-xs font-bold font-serif text-[var(--foreground)] leading-snug">
                            Small Language Model (SLM) Integration and Performance Analysis
                          </h4>
                          <p className="text-[9px] text-[var(--text-muted)] leading-normal line-clamp-3">
                            A systematic evaluation of lightweight language models across edge deployment environments, comparative inference speeds, and parameter quantization constraints.
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[8px] font-mono text-[var(--text-muted)] border-t border-[var(--border-color)] pt-1.5 mt-2">
                          <span>DOI: 10.5281/zenodo.21396947</span>
                          <span className="text-[var(--accent-color)] font-bold">PDF</span>
                        </div>
                      </div>
                      {/* Blur Overlay & Button */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/35 opacity-0 group-hover/mockup:opacity-100 transition-all duration-150 ease-out backdrop-blur-[1px] pointer-events-none">
                        <div className="px-4 py-2 rounded-full border border-white/20 bg-white/10 dark:bg-black/40 backdrop-blur-md text-white font-mono text-[10px] md:text-xs font-bold tracking-wider uppercase shadow-lg transform translate-y-2 group-hover/mockup:translate-y-0 transition-all duration-150 ease-out flex items-center gap-1.5">
                          <span>Read Paper</span>
                          <ExternalLink size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors mt-1">
                    <span>Read publication</span>
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </motion.a>

            </div>
            </div>
          </CyberLazyLoad>

          {/* Section 03: AI Architecture — "Holy Shit" Section */}
          <CyberLazyLoad>
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-[var(--border-color)] pb-4"
            >
              <span className="text-xs font-mono tracking-widest text-[var(--accent-color)]">
                System Architecture
              </span>
              <h2 className="text-2xl md:text-4xl font-bold font-serif text-[var(--foreground)] mt-2">
                How the system works.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="py-8 md:py-12"
            >
              <ArchitectureSection />
            </motion.div>
          </div>
          </CyberLazyLoad>

          {/* Section 04: Toolkit / Skills */}
          <CyberLazyLoad>
            <div id="toolkit-section" className="flex flex-col gap-8 scroll-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-[var(--border-color)] pb-4"
            >
              <span className="text-xs font-mono tracking-widest text-[var(--accent-color)]">
                Technical Toolkit
              </span>
              <h2 className="text-2xl md:text-4xl font-bold font-serif text-[var(--foreground)] mt-2">
                Grounded in data science, extended through applied AI.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Analysis",
                  skills: ["SQL", "NumPy", "Python", "Pandas", "Matplotlib", "Scikit-Learn"],
                },
                {
                  title: "Machine learning",
                  skills: ["Deep learning", "Data pipelines", "Predictive modeling", "Statistical analysis"],
                },
                {
                  title: "Language AI",
                  skills: ["RAG", "LLMs", "Ollama", "SLM fine-tuning", "Prompt engineering"],
                },
                {
                  title: "Responsible systems",
                  skills: ["Guardrails", "HITL review", "PII redaction", "Injection defences"],
                },
                {
                  title: "Engineering",
                  skills: ["Git", "MCP", "Web apps", "VS Code", "API integration"],
                },
                {
                  title: "Research",
                  skills: ["AI benchmarking", "Technical writing", "Experiment tracking"],
                },
              ].map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                  className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 hover:border-[var(--accent-color)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 flex flex-col gap-4 group"
                >
                  <h3 className="text-base font-bold font-serif text-[var(--foreground)] border-b border-[var(--border-color)] pb-2 group-hover:text-[var(--accent-color)] transition-colors">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--card-bg)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] px-2.5 py-1 text-[var(--text-muted)] transition-all rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            </div>
          </CyberLazyLoad>

          {/* Section 05: Contact */}
          <CyberLazyLoad>
            <div id="contact" className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center border-t border-[var(--border-color)] pt-12 sm:pt-16 mt-8 w-full max-w-full">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif text-[var(--foreground)] leading-tight">
              Have a difficult problem?<br />
              <span className="italic font-light text-[var(--text-muted)]">Let’s talk.</span>
            </h2>

            <div className="border-l-0 md:border-l border-[var(--border-color)] pl-0 md:pl-8 flex flex-col gap-5 sm:gap-6 w-full max-w-full">
              <p className="text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">
                For collaborations, roles, or a thoughtful technical conversation, send a note. I read every message.
              </p>

              <div className="flex flex-col border-t border-b border-[var(--border-color)] divide-y divide-[var(--border-color)] w-full max-w-sm">
                
                {/* Email */}
                <a
                  href="mailto:hasir160807@gmail.com"
                  className="flex items-center gap-3 py-3 text-[var(--foreground)] hover:text-[var(--accent-color)] transition-all hover:translate-x-1 min-w-0"
                >
                  <Mail size={16} className="text-[var(--text-muted)] shrink-0" />
                  <span className="text-xs sm:text-sm font-mono truncate">hasir160807@gmail.com</span>
                </a>

                {/* Phone */}
                <a
                  href="tel:+918955270513"
                  className="flex items-center gap-3 py-3 text-[var(--foreground)] hover:text-[var(--accent-color)] transition-all hover:translate-x-1 min-w-0"
                >
                  <Phone size={16} className="text-[var(--text-muted)] shrink-0" />
                  <span className="text-xs sm:text-sm font-mono truncate">+91 8955270513</span>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/Sayyedhash888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 text-[var(--foreground)] hover:text-[var(--accent-color)] transition-all hover:translate-x-1 min-w-0"
                >
                  <Github size={16} className="text-[var(--text-muted)] shrink-0" />
                  <span className="text-xs sm:text-sm font-mono truncate">GitHub</span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/hasir-sayed-365447413/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 text-[var(--foreground)] hover:text-[var(--accent-color)] transition-all hover:translate-x-1 min-w-0"
                >
                  <Linkedin size={16} className="text-[var(--text-muted)] shrink-0" />
                  <span className="text-xs sm:text-sm font-mono truncate">LinkedIn</span>
                </a>

                {/* Resume */}
                <a
                  href="/HASIR_SAYED.pdf"
                  target="_blank"
                  className="flex items-center gap-3 py-3 text-[var(--foreground)] hover:text-[var(--accent-color)] transition-all hover:translate-x-1 min-w-0"
                >
                  <FileText size={16} className="text-[var(--text-muted)] shrink-0" />
                  <span className="text-xs sm:text-sm font-mono truncate">Resume</span>
                </a>

              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-[var(--text-muted)] font-mono">
                <span>Bangalore, India</span>
                <span>•</span>
                <span>English / Hindi</span>
              </div>
            </div>
            </div>
          </CyberLazyLoad>

        </div>

        {/* Footer */}
        <footer className="border-t border-[var(--border-color)] py-12 sm:py-16 mt-12 px-4 sm:px-8 md:px-12 w-full max-w-full">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 sm:gap-8 text-center">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif text-[var(--foreground)] leading-tight px-2">
              Let&apos;s build something<br />
              <span className="italic font-light text-[var(--text-muted)]">people actually use.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 w-full max-w-full px-2">
              <a href="mailto:hasir160807@gmail.com" className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[10px] sm:text-xs font-mono text-[var(--foreground)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all truncate max-w-full">
                <Mail size={12} className="shrink-0" /> <span className="truncate">hasir160807@gmail.com</span>
              </a>
              <a href="https://github.com/Sayyedhash888" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[10px] sm:text-xs font-mono text-[var(--foreground)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all">
                <Github size={12} className="shrink-0" /> GitHub ↗
              </a>
              <a href="https://www.linkedin.com/in/hasir-sayed-365447413/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[10px] sm:text-xs font-mono text-[var(--foreground)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all">
                <Linkedin size={12} className="shrink-0" /> LinkedIn ↗
              </a>
              <a href="/HASIR_SAYED.pdf" target="_blank" className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[10px] sm:text-xs font-mono text-[var(--foreground)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all">
                <FileText size={12} className="shrink-0" /> Resume ↗
              </a>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-[10px] font-mono text-[var(--text-muted)]">
              <span>© 2026 Hasir Sayed</span>
              <span>·</span>
              <span>Bangalore, India</span>
              <span>·</span>
              <span>English / Hindi</span>
            </div>
          </div>
        </footer>
      </div>

      {/* FLOATING AI CHAT ASSISTANT WIDGET */}
      <AIChatAgent />
    </div>
  );
}
