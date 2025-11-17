import { useEffect, useRef } from "react";

interface DataStreamProps {
  density?: number; // Number of streams
  className?: string;
  variant?: "matrix" | "horizontal"; // Matrix-style vertical or horizontal scrolling
}

export default function DataStream({
  density = 15,
  className = "",
  variant = "matrix"
}: DataStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const streams: HTMLDivElement[] = [];

    if (variant === "matrix") {
      // Characters for matrix effect
      const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムネモヤユヨラリルレロワヲン";

      // Create vertical streams
      for (let i = 0; i < density; i++) {
        const stream = document.createElement("div");
        stream.className = "data-stream";

        // Random positioning
        stream.style.left = `${Math.random() * 100}%`;

        // Random animation duration (between 8-15 seconds)
        const duration = 8 + Math.random() * 7;
        stream.style.animationDuration = `${duration}s`;

        // Random delay
        stream.style.animationDelay = `${Math.random() * 5}s`;

        // Generate random text content (5-15 characters)
        const length = 5 + Math.floor(Math.random() * 10);
        let text = "";
        for (let j = 0; j < length; j++) {
          text += chars[Math.floor(Math.random() * chars.length)];
        }
        stream.textContent = text;

        // Random opacity
        stream.style.opacity = String(0.2 + Math.random() * 0.4);

        container.appendChild(stream);
        streams.push(stream);
      }
    } else {
      // Horizontal scrolling tech text
      const lines = [
        ">>> PROCESSING REQUEST...",
        "CONN STATUS: ESTABLISHED",
        "LATENCY: 12ms",
        "SECURITY: SSL/TLS 1.3",
        ">>> SYNC COMPLETE",
        "UPTIME: 99.9%",
        "NODES: 847 ACTIVE",
      ];

      lines.forEach((line, i) => {
        const stream = document.createElement("div");
        stream.className = "absolute whitespace-nowrap text-primary animate-scroll-left font-mono text-xs";
        stream.style.top = `${i * 14}%`;
        stream.style.animationDelay = `${i * 0.8}s`;
        stream.style.animationDuration = `${12 + i * 2}s`;
        stream.textContent = line.repeat(10);

        container.appendChild(stream);
        streams.push(stream);
      });
    }

    // Cleanup
    return () => {
      streams.forEach(stream => stream.remove());
    };
  }, [density, variant]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${variant === "horizontal" ? "opacity-10" : ""} ${className}`}
      aria-hidden="true"
    />
  );
}
