"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  Github,
  Linkedin,
  Copy,
  Check,
  MapPin,
  Languages,
  ExternalLink,
} from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-[var(--background)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 my-auto pointer-events-auto"
            data-modal-container="true"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)] transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[10px] font-bold font-mono tracking-widest text-[var(--foreground)] uppercase mb-4">
              AVAILABLE FOR WORK
            </div>

            <h2 className="text-2xl font-serif font-extrabold text-[var(--foreground)] mb-1">
              Contact Information
            </h2>
            <p className="text-xs text-[var(--text-muted)] mb-6 font-mono">
              Direct channels to reach Hasir Sayed.
            </p>

            {/* Contact Details Cards */}
            <div className="flex flex-col gap-3 mb-6">
              {/* Email Item */}
              <a
                href="mailto:hasir160807@gmail.com"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--accent-color)] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-xl bg-[var(--background)] border border-[var(--border-color)] text-[var(--accent-color)] group-hover:bg-[var(--accent-color)] group-hover:text-white transition-colors shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Email</div>
                    <div className="text-xs sm:text-sm font-mono font-medium text-[var(--foreground)] group-hover:text-[var(--accent-color)] transition-colors truncate">
                      hasir160807@gmail.com
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    copyToClipboard("hasir160807@gmail.com", "email");
                  }}
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-all shrink-0 cursor-pointer"
                  title="Copy email"
                >
                  {copiedField === "email" ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </a>

              {/* Phone Item */}
              <a
                href="tel:+918955270513"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--accent-color)] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-xl bg-[var(--background)] border border-[var(--border-color)] text-[var(--accent-color)] group-hover:bg-[var(--accent-color)] group-hover:text-white transition-colors shrink-0">
                    <Phone size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Phone</div>
                    <div className="text-xs sm:text-sm font-mono font-medium text-[var(--foreground)] group-hover:text-[var(--accent-color)] transition-colors truncate">
                      +91 8955270513
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    copyToClipboard("+918955270513", "phone");
                  }}
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-all shrink-0 cursor-pointer"
                  title="Copy phone number"
                >
                  {copiedField === "phone" ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </a>

              {/* GitHub & LinkedIn Grid */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://github.com/Sayyedhash888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--accent-color)] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-[var(--background)] border border-[var(--border-color)] text-[var(--accent-color)] group-hover:bg-[var(--accent-color)] group-hover:text-white transition-colors shrink-0">
                      <Github size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Code</div>
                      <div className="text-xs font-mono font-bold text-[var(--foreground)] group-hover:text-[var(--accent-color)] transition-colors truncate">
                        GitHub
                      </div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent-color)] shrink-0 transition-colors" />
                </a>

                <a
                  href="https://www.linkedin.com/in/hasir-sayed-365447413/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--accent-color)] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-[var(--background)] border border-[var(--border-color)] text-[var(--accent-color)] group-hover:bg-[var(--accent-color)] group-hover:text-white transition-colors shrink-0">
                      <Linkedin size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Network</div>
                      <div className="text-xs font-mono font-bold text-[var(--foreground)] group-hover:text-[var(--accent-color)] transition-colors truncate">
                        LinkedIn
                      </div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent-color)] shrink-0 transition-colors" />
                </a>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> Bangalore, India
              </span>
              <span className="flex items-center gap-1">
                <Languages size={12} /> EN / HI
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
