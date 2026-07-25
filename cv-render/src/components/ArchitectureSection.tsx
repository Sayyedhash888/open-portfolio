"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, Search, Code, Zap, Shield, User } from "lucide-react";

const ease4 = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: ease4, delay },
});

function ArchNode({
  icon, label, sub, delay, accent = false,
}: {
  icon: React.ReactNode; label: string; sub?: string; delay: number; accent?: boolean;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className={`flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border backdrop-blur-md text-center min-w-[120px] ${
        accent
          ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10 shadow-[0_0_20px_var(--accent-color)]/20"
          : "border-[var(--border-color)] bg-[var(--glass-bg)]"
      }`}
    >
      <span className={accent ? "text-[var(--accent-color)]" : "text-[var(--text-muted)]"}>{icon}</span>
      <span className={`text-xs font-bold font-mono tracking-wide ${accent ? "text-[var(--accent-color)]" : "text-[var(--foreground)]"}`}>
        {label}
      </span>
      {sub && <span className="text-[9px] font-mono text-[var(--text-muted)] leading-tight">{sub}</span>}
    </motion.div>
  );
}

function VLine({ delay, h = 24 }: { delay: number; h?: number }) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.35, ease: "easeInOut", delay }}
      style={{ originY: 0, height: h }}
      className="w-px bg-[var(--border-color)] mx-auto"
    />
  );
}

/* SVG fork: one vertical line down, then a horizontal bar, then 3 vertical drops */
function ForkLines({ delay }: { delay: number }) {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      viewBox="0 0 300 50"
      className="w-[300px] md:w-[360px] h-[50px] mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vertical stem from center top */}
      <motion.line
        x1="150" y1="0" x2="150" y2="20"
        stroke="var(--border-color)" strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.25, delay }}
      />
      {/* Horizontal crossbar */}
      <motion.line
        x1="50" y1="20" x2="250" y2="20"
        stroke="var(--border-color)" strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.15 }}
      />
      {/* Left drop */}
      <motion.line
        x1="50" y1="20" x2="50" y2="50"
        stroke="var(--border-color)" strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay: delay + 0.35 }}
      />
      {/* Center drop */}
      <motion.line
        x1="150" y1="20" x2="150" y2="50"
        stroke="var(--border-color)" strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay: delay + 0.35 }}
      />
      {/* Right drop */}
      <motion.line
        x1="250" y1="20" x2="250" y2="50"
        stroke="var(--border-color)" strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay: delay + 0.35 }}
      />
    </motion.svg>
  );
}

/* SVG merge: 3 vertical lines up, then horizontal bar, then single vertical down */
function MergeLines({ delay }: { delay: number }) {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      viewBox="0 0 300 50"
      className="w-[300px] md:w-[360px] h-[50px] mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left rise */}
      <motion.line
        x1="50" y1="0" x2="50" y2="30"
        stroke="var(--border-color)" strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay }}
      />
      {/* Center rise */}
      <motion.line
        x1="150" y1="0" x2="150" y2="30"
        stroke="var(--border-color)" strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay }}
      />
      {/* Right rise */}
      <motion.line
        x1="250" y1="0" x2="250" y2="30"
        stroke="var(--border-color)" strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay }}
      />
      {/* Horizontal merge bar */}
      <motion.line
        x1="50" y1="30" x2="250" y2="30"
        stroke="var(--border-color)" strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.15 }}
      />
      {/* Single stem down */}
      <motion.line
        x1="150" y1="30" x2="150" y2="50"
        stroke="var(--border-color)" strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay: delay + 0.35 }}
      />
    </motion.svg>
  );
}

export default function ArchitectureSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="flex flex-col items-center gap-0 select-none">
      {inView && (
        <>
          {/* User Input */}
          <ArchNode icon={<User size={16} />} label="User Input" delay={0} />
          <VLine delay={0.15} />

          {/* Router Agent */}
          <ArchNode icon={<Zap size={16} />} label="Router Agent" sub="Intent classification" delay={0.2} accent />

          {/* Fork: Router -> 3 agents */}
          <ForkLines delay={0.35} />

          {/* Three agents row */}
          <div className="grid grid-cols-3 w-[300px] md:w-[360px]">
            <div className="flex justify-center">
              <ArchNode icon={<Search size={14} />} label="Research" sub="Agent" delay={0.55} />
            </div>
            <div className="flex justify-center">
              <ArchNode icon={<Code size={14} />} label="Coding" sub="Agent" delay={0.6} />
            </div>
            <div className="flex justify-center">
              <ArchNode icon={<Bot size={14} />} label="Execution" sub="Agent" delay={0.65} />
            </div>
          </div>

          {/* Merge: 3 agents -> SLM */}
          <MergeLines delay={0.75} />

          {/* Fine-tuned SLM */}
          <ArchNode icon={<Zap size={16} />} label="Fine-tuned SLM" sub="Custom quantized model" delay={0.9} accent />
          <VLine delay={1.0} />

          {/* Safety Layer */}
          <ArchNode icon={<Shield size={16} />} label="Safety Layer" sub="PII redaction / Guardrails / HITL" delay={1.05} />
          <VLine delay={1.15} />

          {/* Response */}
          <motion.div {...fadeUp(1.2)}>
            <div className="px-5 py-2 rounded-full border border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs font-bold font-mono tracking-widest">
              RESPONSE
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
