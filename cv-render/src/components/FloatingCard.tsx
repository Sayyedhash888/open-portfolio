"use client";

import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

interface FloatingCardProps {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  scrollEnd: number; // e.g. 0.35
  scrollYOffset: number; // e.g. -220
  scaleEnd?: number; // e.g. 0.85
  idleRange: number[]; // e.g. [-6, 6, -6]
  idleDuration: number; // e.g. 4
  className?: string;
}

export default function FloatingCard({
  children,
  scrollYProgress,
  scrollEnd,
  scrollYOffset,
  scaleEnd = 1,
  idleRange,
  idleDuration,
  className = "",
}: FloatingCardProps) {
  // Parallax calculations based on scroll position
  const y = useTransform(scrollYProgress, [0, scrollEnd], [0, scrollYOffset]);
  const opacity = useTransform(scrollYProgress, [0, scrollEnd], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, scrollEnd], [1, scaleEnd]);

  return (
    <motion.div
      style={{ y, opacity, scale }}
      className={`absolute z-10 w-[280px] md:w-[320px] pointer-events-auto ${className}`}
    >
      <motion.div
        animate={{ y: idleRange }}
        transition={{
          repeat: Infinity,
          duration: idleDuration,
          ease: "easeInOut",
        }}
        className="rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--border-color)] p-5 shadow-2xl hover:border-[var(--border-hover)] transition-all duration-300"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
