import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function ManagedITVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Abstract slow rotation of the geometric core
      gsap.to('.geo-core', {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: 'linear',
      });
      gsap.to('.geo-ring', {
        rotation: -360,
        duration: 60,
        repeat: -1,
        ease: 'linear',
      });

      // Subtle pulse of the data streams
      gsap.to('.data-stream', {
        strokeDashoffset: -100,
        duration: 3,
        repeat: -1,
        ease: 'none',
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative flex aspect-square w-full max-w-lg items-center justify-center overflow-hidden mix-blend-difference opacity-90"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer subtle rings */}
        <circle cx="200" cy="200" r="180" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
        <circle cx="200" cy="200" r="140" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="4 8" />

        {/* Abstract Data Streams connecting to center */}
        <path
          className="data-stream text-primary"
          d="M0 200 Q 100 200 200 200"
          stroke="url(#streamGrad)"
          strokeWidth="1.5"
          strokeDasharray="20 40"
        />
        <path
          className="data-stream text-primary"
          d="M400 200 Q 300 200 200 200"
          stroke="url(#streamGrad)"
          strokeWidth="1.5"
          strokeDasharray="20 40"
        />
        <path
          className="data-stream text-primary"
          d="M200 0 Q 200 100 200 200"
          stroke="url(#streamGrad)"
          strokeWidth="1.5"
          strokeDasharray="20 40"
        />
        <path
          className="data-stream text-primary"
          d="M200 400 Q 200 300 200 200"
          stroke="url(#streamGrad)"
          strokeWidth="1.5"
          strokeDasharray="20 40"
        />

        {/* Rotating Geometry */}
        <g className="geo-ring origin-center text-foreground opacity-20">
          <rect x="120" y="120" width="160" height="160" stroke="currentColor" strokeWidth="1" />
          <rect x="140" y="140" width="120" height="120" stroke="currentColor" strokeWidth="1" className="rotate-45 origin-center" />
        </g>
        
        <g className="geo-core origin-center text-primary">
           <circle cx="200" cy="200" r="40" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
           <rect x="180" y="180" width="40" height="40" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
           <circle cx="200" cy="200" r="4" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}