"use client";
import { useEffect, useRef } from "react";

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  pulsePhase: number;
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const nodeCount = 24;
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 1.8 + 1,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    const CONNECT_DIST = 200;
    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.007;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const isLight = document.documentElement.classList.contains("light");
      const accent = isLight ? "#bd3d36" : "#a3e635";
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > window.innerWidth) n.vx *= -1;
        if (n.y < 0 || n.y > window.innerHeight) n.vy *= -1;
      }
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = accent;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECT_DIST) {
            ctx.globalAlpha = (1 - dist / CONNECT_DIST) * 0.1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = accent;
      for (const n of nodes) {
        const pulse = 0.5 + 0.5 * Math.sin(t + n.pulsePhase);
        ctx.globalAlpha = 0.15 + pulse * 0.2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * (1 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
