"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  time: number;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const pointsRef = useRef<Point[]>([]);

  useEffect(() => {
    // Only activate on fine-pointer (mouse/trackpad) devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Crisp high-DPI buffer scaling
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animFrameId: number;

    const render = () => {
      const now = Date.now();

      // Clear
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Theme-aware accent color — dark is default (:root), light adds .light class
      const isLight = document.documentElement.classList.contains("light");
      const accent = isLight ? "#bd3d36" : "#a3e635";

      // Prune stale trail points
      pointsRef.current = pointsRef.current.filter((p) => now - p.time < 300);
      const pts = pointsRef.current;

      // --- 1. Vector trail lines ---
      if (pts.length > 1) {
        ctx.lineWidth = 0.8;
        ctx.lineCap = "round";
        ctx.strokeStyle = accent;
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1];
          const b = pts[i];
          const dist = Math.hypot(b.x - a.x, b.y - a.y);
          if (dist < 80) {
            const age = now - (a.time + b.time) / 2;
            ctx.globalAlpha = Math.max(0, (1 - age / 300) * 0.18);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // --- 2. Fading micro-dot nodes ---
      ctx.fillStyle = accent;
      for (const p of pts) {
        const alpha = Math.max(0, (1 - (now - p.time) / 300) * 0.75);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- 3. Main cursor dot with glow ---
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      ctx.globalAlpha = 1;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 8;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animFrameId = requestAnimationFrame(render);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      pointsRef.current.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    };

    window.addEventListener("mousemove", onMouseMove);
    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (pointer: fine) {
              * { cursor: none !important; }
              #data-trail-canvas { display: block !important; }
            }
          `,
        }}
      />
      <canvas
        id="data-trail-canvas"
        ref={canvasRef}
        style={{ display: "none" }}
        className="pointer-events-none fixed inset-0 z-[9999]"
      />
    </>
  );
}
