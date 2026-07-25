"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  time: number;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const lastPointerMoveRef = useRef(Date.now());
  const lastClickRef = useRef(Date.now());
  const lastLoaderActiveTimeRef = useRef(0);
  const loaderStartTimeRef = useRef(0);
  const hasUserInteractedAfterCurtainRef = useRef(false);
  const wasObservingRef = useRef(false);
  const startledUntilRef = useRef(0);
  const startledPosRef = useRef({ x: -100, y: -100 });
  const depthZRef = useRef(1); // 3D depth: -1 (behind) to +1 (front)
  const pointsRef = useRef<Point[]>([]);

  // Window/Modal top snap state tracking
  const activeModalRef = useRef<Element | null>(null);
  const modalOpenTimestampRef = useRef<number>(0);
  const modalOpenPosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const hasUserMovedSinceModalOpenRef = useRef<boolean>(true);

  // Randomized 3D orbit & entrance parameters generated on mount (different every reload)
  const orbitParamsRef = useRef({
    tiltAngle: (Math.random() - 0.5) * 0.8, // Randomized 3D tilt (-23° to +23°)
    speedMultiplier: (Math.random() > 0.5 ? 1 : -1) * (0.85 + Math.random() * 0.3), // Randomized CW/CCW direction
    radiusXOffset: 35 + Math.random() * 25,
    radiusYOffset: 22 + Math.random() * 20,
    startSide: Math.random() > 0.5 ? "left" : "right", // Fly in from far left or far right
    startYRatio: 0.2 + Math.random() * 0.6, // Random vertical entry point
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Crisp high-DPI canvas buffer scaling
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

      // Clear previous frame
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const timeSinceMove = now - lastPointerMoveRef.current;
      const timeSinceClick = now - lastClickRef.current;
      const timeSinceActivity = Math.min(timeSinceMove, timeSinceClick);

      // Only start moving on its own after 8 seconds of inactivity
      const isAutonomous8s = timeSinceActivity > 8000 && hasUserInteractedAfterCurtainRef.current;

      // Track if cursor is currently moving on its own
      wasObservingRef.current = isAutonomous8s;

      const isStartled = now < startledUntilRef.current;

      // Check curtain loader and modal states
      const loaderEl = document.querySelector('[data-loader-active="true"]');
      const loaderNameEl = document.getElementById("loader-name-target");
      const curtainScreenEl = document.getElementById("curtain-loader-screen");

      let targetX = targetRef.current.x;
      let targetY = targetRef.current.y;

      const isPushingCurtain = !loaderEl && now - lastLoaderActiveTimeRef.current < 900 && !!curtainScreenEl;

      // Check for active visible modal/window containers
      const visibleModalEl = Array.from(
        document.querySelectorAll('[data-modal-container="true"]')
      ).find((el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
          style.pointerEvents !== "none"
        );
      }) as HTMLElement | null;

      if (visibleModalEl) {
        if (activeModalRef.current !== visibleModalEl) {
          activeModalRef.current = visibleModalEl;
          modalOpenTimestampRef.current = now;
          hasUserMovedSinceModalOpenRef.current = false;
          modalOpenPosRef.current = { x: targetRef.current.x, y: targetRef.current.y };
        }
      } else {
        if (activeModalRef.current !== null) {
          activeModalRef.current = null;
          hasUserMovedSinceModalOpenRef.current = true;
        }
      }

      const isModalTopSnap =
        !!visibleModalEl &&
        !hasUserMovedSinceModalOpenRef.current &&
        !isAutonomous8s &&
        !loaderEl &&
        !isPushingCurtain;

      if (loaderEl && loaderNameEl) {
        lastLoaderActiveTimeRef.current = now;
        hasUserInteractedAfterCurtainRef.current = false;

        if (loaderStartTimeRef.current === 0) {
          loaderStartTimeRef.current = now;
        }

        const rect = loaderNameEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2 + 15;

        const params = orbitParamsRef.current;
        const angle = (now / 190) * params.speedMultiplier;

        const rx = rect.width / 2 + params.radiusXOffset;
        const ry = rect.height / 2 + params.radiusYOffset;

        const rawX = Math.cos(angle) * rx;
        const rawY = Math.sin(angle) * ry;

        const cosT = Math.cos(params.tiltAngle);
        const sinT = Math.sin(params.tiltAngle);

        const orbitX = centerX + (rawX * cosT - rawY * sinT);
        const orbitY = centerY + (rawX * sinT + rawY * cosT);

        const depthZ = Math.sin(angle);
        depthZRef.current = depthZ;

        // CINEMATIC ENTRANCE: Fly in from far beyond screen bounds (0 to 520ms)
        const entranceElapsed = now - loaderStartTimeRef.current;
        const entranceDuration = 520;

        if (entranceElapsed < entranceDuration) {
          const t = entranceElapsed / entranceDuration;
          const easeProgress = 1 - Math.pow(1 - t, 3); // easeOutCubic

          const startX = params.startSide === "left" ? -180 : window.innerWidth + 180;
          const startY = window.innerHeight * params.startYRatio;

          if (currentRef.current.x < 0 || currentRef.current.y < 0) {
            currentRef.current.x = startX;
            currentRef.current.y = startY;
          }

          targetX = startX + (orbitX - startX) * easeProgress;
          targetY = startY + (orbitY - startY) * easeProgress;
        } else {
          targetX = orbitX;
          targetY = orbitY;
        }
      } else if (isPushingCurtain && curtainScreenEl) {
        hasUserInteractedAfterCurtainRef.current = false;
        depthZRef.current = 1;

        // CURTAIN RISING PHASE: Cursor pushes the bottom edge of the curtain upwards off screen!
        const rect = curtainScreenEl.getBoundingClientRect();
        targetX = window.innerWidth / 2 + Math.sin(now / 40) * 8; // power push micro-shake
        targetY = rect.bottom - 12;
      } else if (!hasUserInteractedAfterCurtainRef.current && lastLoaderActiveTimeRef.current > 0) {
        // Curtain has exited off screen, wait hidden off-screen until user clicks or moves mouse/thumb
        targetX = -100;
        targetY = -100;
        currentRef.current = { x: -100, y: -100 };
      } else if (isStartled) {
        depthZRef.current = 1;
        // Startled state: lock to exact CURRENT position where it was observing + micro jitter
        const jitterX = Math.sin(now / 25) * 5;
        const jitterY = Math.cos(now / 20) * 5;
        targetX = startledPosRef.current.x + jitterX;
        targetY = startledPosRef.current.y + jitterY;
      } else if (isModalTopSnap && visibleModalEl) {
        depthZRef.current = 1;
        // Window opening: Cursor hovers gracefully along the top edge passing time while user reads
        const rect = visibleModalEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const hoverSwayX = Math.sin(now / 550) * Math.min(45, rect.width * 0.25);
        const hoverFloatY = Math.sin(now / 280) * 3;

        targetX = centerX + hoverSwayX;
        targetY = Math.max(16, rect.top + 28 + hoverFloatY);
      } else if (isAutonomous8s) {
        depthZRef.current = 1;
        // > 8s Inactivity: Moving on its own (Autonomous Observation Mode)
        const observableEls = Array.from(
          document.querySelectorAll(
            'button, a, input, h1, h2, h3, [role="button"], [data-modal-container="true"]'
          )
        ).filter((el) => {
          const rect = el.getBoundingClientRect();
          return (
            rect.width > 20 &&
            rect.height > 10 &&
            rect.top >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.left >= 0 &&
            rect.right <= window.innerWidth
          );
        });

        if (observableEls.length > 0) {
          const dwellDuration = 3200; // 3.2s per element
          const index = Math.floor(now / dwellDuration) % observableEls.length;
          const targetEl = observableEls[index];
          const rect = targetEl.getBoundingClientRect();

          const cycleProgress = (now % dwellDuration) / dwellDuration;
          const scanOffset = Math.sin(cycleProgress * Math.PI * 2) * Math.min(45, rect.width * 0.35);

          const hoverX = rect.left + rect.width / 2 + scanOffset;
          const hoverY = rect.top + rect.height / 2 + Math.sin(now / 300) * 3;

          targetX = hoverX;
          targetY = hoverY;
        }
      } else {
        // 0 - 8 seconds of inactivity: STAYS EXACTLY WHERE THE USER LEFT IT!
        depthZRef.current = 1;
        targetX = targetRef.current.x;
        targetY = targetRef.current.y;
      }

      if (targetX >= 0 || targetY >= 0) {
        if (currentRef.current.x < -150 || currentRef.current.y < -150) {
          currentRef.current.x = targetX;
          currentRef.current.y = targetY;
        } else {
           // Lerp factor: ultra fast responsiveness when entering screen, pushing curtain, or startled
           const entranceElapsed = now - loaderStartTimeRef.current;
           const isEntering = loaderEl && entranceElapsed < 520;
 
           const isCyberpunk = document.documentElement.classList.contains("cyberpunk");
 
           const lerpFactor = isCyberpunk
             ? 0.28  // Fast but smooth — cyberpunk glitch effect is applied separately below
             : isEntering
             ? 0.35
             : isPushingCurtain
             ? 0.45
             : isStartled
             ? 0.35
             : isModalTopSnap
             ? 0.40
             : loaderEl
             ? 0.24
             : 0.16;
 
           const dx = targetX - currentRef.current.x;
           const dy = targetY - currentRef.current.y;
 
           currentRef.current.x += dx * lerpFactor;
           currentRef.current.y += dy * lerpFactor;
 
           if (Math.hypot(dx, dy) > 0.5) {
             // In cyberpunk mode add ghost echo trails at slight offset for glitch look
             const ghostOffset = isCyberpunk ? Math.sin(now / 80) * 2.5 : 0;
             pointsRef.current.push({
               x: currentRef.current.x + ghostOffset,
               y: currentRef.current.y,
               time: now,
             });
           }
        }
      }

      // Theme-aware accent color
      const isLight = document.documentElement.classList.contains("light");
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim() || (isLight ? "#bd3d36" : "#a3e635");

      // Prune stale trail points (last 300ms)
      pointsRef.current = pointsRef.current.filter((p) => now - p.time < 300);
      const pts = pointsRef.current;

      // 1. Vector connecting trail lines
      if (pts.length > 1) {
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.strokeStyle = accent;
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1];
          const b = pts[i];
          const dist = Math.hypot(b.x - a.x, b.y - a.y);
          if (dist < 80) {
            const age = now - (a.time + b.time) / 2;
            ctx.globalAlpha = Math.max(0, (1 - age / 300) * 0.25);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 2. Fading micro-dot particle nodes
      ctx.fillStyle = accent;
      for (const p of pts) {
        const ageRatio = (now - p.time) / 300;
        const alpha = Math.max(0, (1 - ageRatio) * 0.85);
        const radius = Math.max(0.5, (1 - ageRatio) * (isStartled || isPushingCurtain ? 3.5 : 2.5));
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Main glowing cursor dot with 3D Depth & visual states
      const mx = currentRef.current.x;
      const my = currentRef.current.y;
      if (mx >= -50 && my >= -50) {
        let dotRadius = 4.5;
        let shadowBlur = 12;
        let baseAlpha = 1.0;

        if (isPushingCurtain) {
          shadowBlur = 26;
          dotRadius = 6.5;
        } else if (isStartled) {
          const startledProgress = (startledUntilRef.current - now) / 750;
          dotRadius = 4.5 + Math.sin(startledProgress * Math.PI) * 4.5;
          shadowBlur = 24;
        } else if (loaderEl) {
          const z = depthZRef.current;
          if (z < 0) {
            const depthRatio = z + 1;
            dotRadius = 2.2 + depthRatio * 2.3;
            shadowBlur = 4 + depthRatio * 10;
            baseAlpha = 0.25 + depthRatio * 0.55;
          } else {
            dotRadius = 4.5 + z * 2.2;
            shadowBlur = 14 + z * 10;
            baseAlpha = 1.0;
          }
        } else if (isModalTopSnap) {
          // Gentle breathing pulse while hovering at top of window passing time
          shadowBlur = 18 + Math.sin(now / 320) * 8;
          dotRadius = 4.8 + Math.sin(now / 450) * 0.8;
        } else if (isAutonomous8s) {
          shadowBlur = 14 + Math.sin(now / 200) * 6;
          dotRadius = 5;
        }

        ctx.globalAlpha = baseAlpha;
        ctx.shadowColor = accent;
        ctx.shadowBlur = shadowBlur;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(mx, my, dotRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      animFrameId = requestAnimationFrame(render);
    };

    const triggerStartledIfNeeded = () => {
      const now = Date.now();
      // ONLY trigger startled if cursor was actively moving on its own (> 8s idle)
      if (wasObservingRef.current) {
        startledPosRef.current = { x: currentRef.current.x, y: currentRef.current.y };
        startledUntilRef.current = now + 750;
      }
    };

    const checkUserMovementOnModal = (x?: number, y?: number) => {
      const now = Date.now();
      if (!hasUserMovedSinceModalOpenRef.current && activeModalRef.current) {
        const timeSinceOpen = now - modalOpenTimestampRef.current;
        if (timeSinceOpen > 120) {
          if (x !== undefined && y !== undefined) {
            const dist = Math.hypot(x - modalOpenPosRef.current.x, y - modalOpenPosRef.current.y);
            if (dist > 6) {
              hasUserMovedSinceModalOpenRef.current = true;
            }
          } else {
            hasUserMovedSinceModalOpenRef.current = true;
          }
        }
      }
    };

    const recordMove = (x?: number, y?: number) => {
      checkUserMovementOnModal(x, y);
      triggerStartledIfNeeded();
      lastPointerMoveRef.current = Date.now();
      hasUserInteractedAfterCurtainRef.current = true;
      if (x !== undefined && y !== undefined) {
        targetRef.current = { x, y };
      }
    };

    const recordClick = (x?: number, y?: number) => {
      checkUserMovementOnModal(x, y);
      triggerStartledIfNeeded();
      lastClickRef.current = Date.now();
      lastPointerMoveRef.current = Date.now();
      hasUserInteractedAfterCurtainRef.current = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      recordMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        recordMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      recordClick();
      if (e.touches.length > 0) {
        recordMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onClick = () => {
      recordClick();
    };

    const onScroll = () => {
      recordMove();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (hover: hover) and (pointer: fine) {
              body, a, button, input, select, textarea {
                cursor: none !important;
              }
            }
            #data-trail-canvas {
              display: block !important;
            }
          `,
        }}
      />
      <canvas
        id="data-trail-canvas"
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[99999]"
      />
    </>
  );
}
