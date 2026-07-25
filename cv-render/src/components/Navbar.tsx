"use client";

import React, { useEffect, useState, useRef } from "react";
import { Github, Linkedin, ArrowUpRight, Sun, Moon } from "lucide-react";

import ContactModal from "./ContactModal";

export default function Navbar() {
  const [isLight, setIsLight] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCyberpunk, setIsCyberpunk] = useState(false);
  const clickTimes = useRef<number[]>([]);
  const lastClickTimeRef = useRef(0);

  useEffect(() => {
    // Check localStorage or default to Light mode for new users
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsLight(false);
      document.documentElement.classList.remove("light");
    } else {
      setIsLight(true);
      document.documentElement.classList.add("light");
    }

    const savedCyber = localStorage.getItem("cyberpunk");
    if (savedCyber === "true") {
      setIsCyberpunk(true);
    }
  }, []);

  useEffect(() => {
    if (!isCyberpunk) return;

    document.documentElement.classList.add("cyberpunk");
    localStorage.setItem("cyberpunk", "true");

    let h = 0;
    let animId: number;

    const tick = () => {
      h = (h + 1.2) % 360;
      
      const colorA = `hsl(${h}, 100%, 50%)`;
      const colorB = `hsl(${(h + 60) % 360}, 100%, 50%)`;
      const glowColor = `hsla(${h}, 100%, 50%, 0.15)`;
      const borderHover = `hsl(${(h + 120) % 360}, 100%, 50%)`;
      
      document.documentElement.style.setProperty("--accent-color", colorA);
      document.documentElement.style.setProperty("--accent-color-end", colorB);
      document.documentElement.style.setProperty("--glow-bg", glowColor);
      document.documentElement.style.setProperty("--border-hover", borderHover);
      document.documentElement.style.setProperty("--border-color", `hsla(${h}, 100%, 50%, 0.3)`);
      
      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      document.documentElement.style.removeProperty("--accent-color");
      document.documentElement.style.removeProperty("--accent-color-end");
      document.documentElement.style.removeProperty("--glow-bg");
      document.documentElement.style.removeProperty("--border-hover");
      document.documentElement.style.removeProperty("--border-color");
      document.documentElement.classList.remove("cyberpunk");
    };
  }, [isCyberpunk]);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    lastClickTimeRef.current = now;

    if (isCyberpunk) {
      // Exit condition: 2 clicks under 2.5 seconds
      clickTimes.current = [...clickTimes.current.filter((t) => now - t < 2500), now];
      if (clickTimes.current.length >= 2) {
        setIsCyberpunk(false);
        localStorage.removeItem("cyberpunk");
        clickTimes.current = [];
      }
    } else {
      // Enter condition: 6 clicks under 10 seconds
      clickTimes.current = [...clickTimes.current.filter((t) => now - t < 10000), now];
      if (clickTimes.current.length >= 6) {
        setIsCyberpunk(true);
        localStorage.setItem("cyberpunk", "true");
        clickTimes.current = [];
      }
    }

    const updateDOM = () => {
      if (isLight) {
        document.documentElement.classList.remove("light");
        localStorage.setItem("theme", "dark");
        setIsLight(false);
      } else {
        document.documentElement.classList.add("light");
        localStorage.setItem("theme", "light");
        setIsLight(true);
      }
    };

    // If clicking rapidly (less than 550ms since last click), skip the view transition
    // and update DOM immediately to prevent animation stacking/blocking.
    if (timeSinceLastClick < 550) {
      updateDOM();
      return;
    }

    const doc = document as any;
    if (!doc.startViewTransition) {
      document.documentElement.classList.add("theme-transition");
      updateDOM();
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 530);
      return;
    }

    const transition = doc.startViewTransition(() => {
      updateDOM();
    });

    transition.ready.then(() => {
      // Smooth 60FPS curtain wipe using hardware-accelerated inset() (530ms)
      const curtainClip = isLight
        ? ["inset(0 0 100% 0)", "inset(0 0 0 0)"]
        : ["inset(100% 0 0 0)", "inset(0 0 0 0)"];

      document.documentElement.animate(
        {
          clipPath: curtainClip,
        },
        {
          duration: 530,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-10 py-3.5 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--border-color)] transition-colors duration-300">
      {/* Left side: Logo & Navigation */}
      <div className="flex items-center gap-8">
        <a
          href="#"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <span className="text-sm font-bold tracking-wider text-[var(--foreground)] cyber-grad-text">H·S</span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-muted)]">
          <a href="#experience-section" className="hover:text-[var(--foreground)] transition-colors">
            Self Experience
          </a>
          <a href="#projects-section" className="hover:text-[var(--foreground)] transition-colors">
            Projects
          </a>
          <a href="#toolkit-section" className="hover:text-[var(--foreground)] transition-colors">
            Toolkit
          </a>
        </div>
      </div>

      {/* Right side: Socials, Theme Toggle, & CTA */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 text-[var(--text-muted)] hover:text-[var(--foreground)] rounded-full hover:bg-[var(--border-color)] transition-all cursor-pointer relative overflow-hidden flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <span className={`absolute transition-all duration-300 transform ${isLight ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`}>
                <Moon size={18} />
              </span>
              <span className={`absolute transition-all duration-300 transform ${!isLight ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}>
                <Sun size={18} />
              </span>
            </div>
          </button>

          <a
            href="https://github.com/Sayyedhash888"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[var(--text-muted)] hover:text-[var(--foreground)] rounded-full hover:bg-[var(--border-color)] transition-all"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/hasir-sayed-365447413/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[var(--text-muted)] hover:text-[var(--foreground)] rounded-full hover:bg-[var(--border-color)] transition-all"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
        </div>

        <button
          onClick={() => setIsContactOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]/60 text-[10px] sm:text-[11px] font-bold tracking-widest text-[var(--foreground)] uppercase hover:border-[var(--accent-color)] hover:bg-[var(--card-bg)] transition-all font-mono shadow-sm cursor-pointer cyber-btn-accent"
        >
          <span>AVAILABLE FOR WORK</span>
          <ArrowUpRight size={12} className="text-[var(--text-muted)] shrink-0" />
        </button>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </nav>
  );
}
