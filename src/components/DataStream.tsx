/**
 * DataStream Component
 * Displays flowing code/terminal text for cyberpunk aesthetic
 */

interface DataStreamProps {
  className?: string;
  lines?: string[];
}

export default function DataStream({
  className = "",
  lines = [
    ">>> PROCESSING REQUEST...",
    "CONN STATUS: ESTABLISHED",
    "LATENCY: 12ms",
    "SECURITY: SSL/TLS 1.3",
    ">>> SYNC COMPLETE",
    "UPTIME: 99.9%",
    "NODES: 847 ACTIVE",
  ]
}: DataStreamProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden opacity-10 pointer-events-none font-mono text-xs ${className}`}
      aria-hidden="true"
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="absolute whitespace-nowrap text-primary animate-scroll-left"
          style={{
            top: `${i * 14}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${12 + i * 2}s`
          }}
        >
          {line.repeat(10)}
        </div>
      ))}
    </div>
  );
}
