"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Key,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowDown,
  UserCheck,
  FileCode,
  Lock,
  Info,
  X,
  AlertTriangle,
} from "lucide-react";

interface StepDetail {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  description: string;
  operations: string[];
  output: string;
  isAlert?: boolean;
}

const STEP_DETAILS: Record<string, StepDetail> = {
  byok: {
    id: "byok",
    number: "1",
    title: "1. User Provides Key (BYOK)",
    subtitle: "Bring Your Own Key Authentication Gate",
    badge: "Access Gate",
    accentColor: "text-[var(--accent-color)]",
    description:
      "Initializes secure access gate. Users supply their own API keys (OpenAI / Anthropic / custom endpoints), enabling zero-server key storage and complete user control over rate limits and quota.",
    operations: [
      "Client-side encrypted key validation",
      "Zero persistent logging of private credentials",
      "Dynamic rate limit and quota authorization",
    ],
    output: "Validated access token unlocking Orchestrator Engine",
  },
  raw_logs: {
    id: "raw_logs",
    number: "2",
    title: "2. User Submits Raw Logs",
    subtitle: "Unstructured Data Payload Entry",
    badge: "Ingestion Stream",
    accentColor: "text-indigo-400",
    description:
      "Accepts raw, unparsed application logs, user prompt streams, or system traces for processing without requiring pre-formatting.",
    operations: [
      "Payload integrity and UTF-8 encoding checks",
      "Multi-line log stream buffer allocation",
      "Standardized chunking for deep scanning",
    ],
    output: "Streamed raw log payload passed into Orchestrator",
  },
  injection_check: {
    id: "injection_check",
    number: "3",
    title: "3. Prompt Injection Check",
    subtitle: "Orchestrator Real-Time Security Shield",
    badge: "Security Firewall",
    accentColor: "text-red-400",
    isAlert: true,
    description:
      "Scans raw incoming payloads for prompt-injection attacks, jailbreak templates, and system prompt override attempts BEFORE any execution takes place.",
    operations: [
      "Adversarial pattern matching & vector similarity check",
      "System prompt override & indirect injection detection",
      "Immediate response block on threat detection (0ms execution leak)",
    ],
    output: "If Threat: Immediate 403 Block | If Clean: Passes to Auditor Agent",
  },
  auditor_agent: {
    id: "auditor_agent",
    number: "4",
    title: "4. Auditor Agent",
    subtitle: "Compliance & Human-in-the-Loop Evaluator",
    badge: "Quality & Audit",
    accentColor: "text-amber-400",
    description:
      "Evaluates clean payloads against compliance standards and determines whether edge-case anomalies require Human-in-the-Loop (HITL) manual sign-off.",
    operations: [
      "Compliance policy validation (GDPR / HIPAA alignment)",
      "Confidence scoring on data structure consistency",
      "Automated HITL routing for low-confidence samples",
    ],
    output: "Audited payload metadata + Compliance approval seal",
  },
  janitor_agent: {
    id: "janitor_agent",
    number: "5",
    title: "5. Janitor Agent",
    subtitle: "Sanitization & Parsing Engine",
    badge: "Data Processing",
    accentColor: "text-emerald-400",
    description:
      "Executes deep PII detection/redaction (emails, IPs, phones, API keys) and parses messy log text into a clean, normalized structural data object.",
    operations: [
      "NER & Regex PII redaction ([REDACTED_EMAIL], [REDACTED_IP])",
      "Log compression (reducing token overhead by up to 35%)",
      "JSON schema normalization & structural repair",
    ],
    output: "Cleaned, sanitized, and structured JSON object",
  },
  final_output: {
    id: "final_output",
    number: "6",
    title: "6. Final Sanitized JSON Output",
    subtitle: "Production-Ready Safe Payload Delivery",
    badge: "Delivery Output",
    accentColor: "text-[var(--accent-color)]",
    description:
      "The Orchestrator collects the sanitized result, verifies schema completeness, and dispatches the safe JSON response back to the client application.",
    operations: [
      "JSON schema verification",
      "Final security sanity check",
      "Safe API HTTP 200 payload return",
    ],
    output: "Guaranteed safe, PII-free, structured JSON response",
  },
};

function VLine({ h = 20 }: { h?: number }) {
  return (
    <div className="relative w-px mx-auto bg-[var(--border-color)]" style={{ height: h }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--accent-color)] rounded-[1px]" />
    </div>
  );
}

export default function ArchitectureSection() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeDetail = selectedStep ? STEP_DETAILS[selectedStep] : null;

  return (
    <div
      ref={ref}
      className={`w-full max-w-xl mx-auto flex flex-col items-center gap-0 select-none transition-all duration-700 ease-out transform-gpu ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* 1. BYOK Gate */}
      <div className="w-full flex flex-col items-center">
        <button
          onClick={() => setSelectedStep("byok")}
          className="w-full max-w-md flex items-center justify-start px-5 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--accent-color)] hover:bg-[var(--background)] text-left transition-colors duration-150 transform-gpu cursor-pointer shadow-md group"
        >
          <div className="flex items-center gap-3">
            <Key size={16} className="text-[var(--accent-color)] shrink-0" />
            <div>
              <div className="text-xs font-bold font-mono text-[var(--foreground)] group-hover:text-[var(--accent-color)] transition-colors">
                1. User Provides Key
              </div>
              <div className="text-[10px] font-mono text-[var(--text-muted)]">
                BYOK (Bring Your Own Key) Access Gate
              </div>
            </div>
          </div>
        </button>
      </div>

      <VLine h={22} />

      {/* 2. Raw Logs Input */}
      <div className="w-full flex flex-col items-center">
        <button
          onClick={() => setSelectedStep("raw_logs")}
          className="w-full max-w-md flex items-center justify-start px-5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--glass-bg)] hover:border-[var(--accent-color)] hover:bg-[var(--card-bg)] text-left transition-colors duration-150 transform-gpu cursor-pointer shadow-sm group"
        >
          <div className="flex items-center gap-3">
            <Lock size={14} className="text-[var(--text-muted)] shrink-0" />
            <span className="text-xs font-mono text-[var(--foreground)] group-hover:text-[var(--accent-color)] transition-colors">
              2. User Submits Raw Logs
            </span>
          </div>
        </button>
      </div>

      <VLine h={22} />

      {/* ORCHESTRATOR BOUNDARY BOX */}
      <div className="w-full p-5 sm:p-6 rounded-3xl border-2 border-indigo-500/40 bg-indigo-950/20 dark:bg-indigo-950/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-4">
        <div className="text-center">
          <span className="text-xs font-bold font-mono text-indigo-300 uppercase tracking-wider block">
            Orchestrator Engine
          </span>
          <span className="text-[10px] font-mono text-indigo-200/70">
            Owns request lifecycle end-to-end
          </span>
        </div>

        {/* 3. Prompt Injection Shield & Immediate Block Check */}
        <button
          onClick={() => setSelectedStep("injection_check")}
          className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl border border-red-500/40 bg-red-950/30 text-red-200 hover:border-red-400 hover:bg-red-950/40 text-left transition-colors duration-150 transform-gpu cursor-pointer shadow-md group"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert size={18} className="text-red-400 shrink-0" />
            <div>
              <div className="text-xs font-bold font-mono text-red-300 group-hover:text-red-200">
                3. Prompt Injection Check
              </div>
              <div className="text-[10px] font-mono text-red-200/70">
                Scans for adversarial jailbreaks
              </div>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full border border-red-500/50 bg-red-900/40 text-[9px] font-mono text-red-300 uppercase tracking-wider shrink-0">
            If Threat ➔ Block Response
          </span>
        </button>

        <ArrowDown size={14} className="text-indigo-400/60" />

        {/* 4. Auditor Agent (Standards & HITL Approval) */}
        <button
          onClick={() => setSelectedStep("auditor_agent")}
          className="w-full p-3.5 rounded-2xl border border-amber-600/40 bg-amber-950/30 text-amber-200 hover:border-amber-400 hover:bg-amber-950/40 text-left transition-colors duration-150 transform-gpu cursor-pointer shadow-md flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <UserCheck size={18} className="text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold font-mono text-amber-300 group-hover:text-amber-200">
                4. Auditor Agent
              </div>
              <div className="text-[10px] font-mono text-amber-200/70">
                Verifies standards & evaluates HITL approval requirement
              </div>
            </div>
          </div>
          <ShieldCheck size={16} className="text-amber-400 shrink-0" />
        </button>

        <ArrowDown size={14} className="text-indigo-400/60" />

        {/* 5. Janitor Agent (Clean & Parse Log) */}
        <button
          onClick={() => setSelectedStep("janitor_agent")}
          className="w-full p-3.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-200 hover:border-emerald-400 hover:bg-emerald-950/40 text-left transition-colors duration-150 transform-gpu cursor-pointer shadow-md flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold font-mono text-emerald-300 group-hover:text-emerald-200">
                5. Janitor Agent
              </div>
              <div className="text-[10px] font-mono text-emerald-200/70">
                Cleans, sanitizes PII & parses log data
              </div>
            </div>
          </div>
          <FileCode size={16} className="text-emerald-400 shrink-0" />
        </button>
      </div>

      <VLine h={24} />

      {/* 6. Final Clean JSON Output */}
      <button
        onClick={() => setSelectedStep("final_output")}
        className="px-6 py-3 rounded-full border border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/25 text-xs font-bold font-mono tracking-widest flex items-center gap-2.5 transition-colors duration-150 transform-gpu cursor-pointer shadow-[0_0_20px_var(--accent-color)]/20"
      >
        <CheckCircle2 size={16} className="text-[var(--accent-color)]" />
        <span>6. FINAL SANITIZED JSON OUTPUT</span>
      </button>

      {/* POPUP MODAL WINDOW (PORTAL) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {activeDetail && (
              <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                {/* Dark Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => setSelectedStep(null)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-md"
                />

                {/* Animated Window Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-lg bg-[var(--background)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 my-auto pointer-events-auto"
                  data-modal-container="true"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedStep(null)}
                    className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)] transition-all cursor-pointer"
                    aria-label="Close window"
                  >
                    <X size={18} />
                  </button>

                  {/* Header Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30 text-[10px] font-mono font-bold text-[var(--accent-color)] uppercase tracking-widest">
                      {activeDetail.badge}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      Step {activeDetail.number} of 6
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-[var(--foreground)] mb-1">
                    {activeDetail.title}
                  </h3>
                  <p className={`text-xs font-mono mb-4 ${activeDetail.accentColor}`}>
                    {activeDetail.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[var(--foreground)] opacity-90 leading-relaxed mb-5">
                    {activeDetail.description}
                  </p>

                  {/* Key Operations */}
                  <div className="mb-5 p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Info size={13} className="text-[var(--accent-color)]" />
                      <span>Under The Hood Operations:</span>
                    </div>
                    <ul className="space-y-2">
                      {activeDetail.operations.map((op, idx) => (
                        <li
                          key={idx}
                          className="text-xs font-mono text-[var(--foreground)] opacity-90 flex items-start gap-2"
                        >
                          <span className="text-[var(--accent-color)] font-bold shrink-0">•</span>
                          <span>{op}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stage Output */}
                  <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--text-muted)]">Stage Artifact:</span>
                    <div className="flex items-center gap-1 text-[var(--accent-color)] font-bold">
                      {activeDetail.isAlert && (
                        <AlertTriangle size={13} className="text-red-400 shrink-0 mr-0.5" />
                      )}
                      <span>{activeDetail.output}</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="mt-6">
                    <button
                      onClick={() => setSelectedStep(null)}
                      className="w-full py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--accent-color)] hover:text-slate-950 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      Close Inspection Window
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
