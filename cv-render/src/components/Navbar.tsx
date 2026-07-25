"use client";

import React, { useEffect, useState } from "react";
import { Github, Linkedin, ArrowUpRight, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLight(true);
      document.documentElement.classList.add("light");
    } else {
      setIsLight(false);
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
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

    const doc = document as any;
    if (!doc.startViewTransition) {
      document.documentElement.classList.add("theme-transition");
      updateDOM();
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 700);
      return;
    }

    const transition = doc.startViewTransition(() => {
      updateDOM();
    });

    transition.ready.then(() => {
      const clipPath = isLight
        ? [
            "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
            "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ]
        : [
            "polygon(0 0, 100% 0, 100% 0, 0 0)",
            "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 750,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border-color)] rounded-full shadow-lg transition-colors duration-300">
      {/* Left side: Logo & Navigation */}
      <div className="flex items-center gap-8">
        <a
          href="#"
          className="text-base font-bold tracking-wider text-[var(--foreground)] hover:opacity-80 transition-opacity font-mono"
        >
          H·S
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

        <a
          href="mailto:hasir160807@gmail.com"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[11px] font-bold tracking-widest text-[var(--foreground)] uppercase hover:bg-[var(--border-color)] hover:border-[var(--border-hover)] transition-all font-mono shadow-inner"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-color)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-color)]"></span>
          </span>
          AVAILABLE FOR WORK
          <ArrowUpRight size={12} className="text-[var(--text-muted)]" />
        </a>
      </div>
    </nav>
  );
}
