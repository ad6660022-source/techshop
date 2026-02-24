"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only show on pointer devices (not touch)
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isInteractive = !!el.closest(
        "a, button, [role='button'], input, select, textarea, label, [tabindex]"
      );
      if (ringInnerRef.current) {
        ringInnerRef.current.dataset.hover = isInteractive ? "1" : "0";
        ringInnerRef.current.style.width = isInteractive ? "48px" : "32px";
        ringInnerRef.current.style.height = isInteractive ? "48px" : "32px";
        ringInnerRef.current.style.borderColor = isInteractive
          ? "rgba(37, 99, 235, 0.6)"
          : "rgba(37, 99, 235, 0.35)";
        ringInnerRef.current.style.background = isInteractive
          ? "rgba(37, 99, 235, 0.07)"
          : "transparent";
      }
    };

    let rafId: number;

    const animate = () => {
      // Lerp ring toward cursor
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.13;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.13;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;
        dotRef.current.style.opacity = mouse.current.x < -100 ? "0" : "1";
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
        ringRef.current.style.opacity = ringPos.current.x < -100 ? "0" : "1";
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Dot — follows instantly */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          opacity: 0,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            background: "#2563eb",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 6px rgba(37, 99, 235, 0.5)",
          }}
        />
      </div>

      {/* Ring — follows with lag */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          opacity: 0,
        }}
      >
        <div
          ref={ringInnerRef}
          style={{
            width: 32,
            height: 32,
            border: "1.5px solid rgba(37, 99, 235, 0.35)",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            transition:
              "width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.25s ease, border-color 0.25s ease",
            background: "transparent",
          }}
        />
      </div>
    </>
  );
}
