import CountUp from './CountUp';

interface MetricCountUpProps {
  value: string;
  label: string;
}

/**
 * Wrapper component for CountUp animation in metrics.
 * Extracts numeric value from strings like "250+", "92%", "60+" for animation,
 * while preserving the original formatting.
 */
export default function MetricCountUp({ value, label }: MetricCountUpProps) {
  // Extract numeric value and suffix
  const match = value.match(/^(\d+(?:\.\d+)?)(.*?)$/);
  
  if (!match) {
    // Fallback for non-numeric values
    return (
      <div>
        <div className="text-primary text-4xl font-bold tracking-tight sm:text-5xl">
          {value}
        </div>
        <div className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
          {label}
        </div>
      </div>
    );
  }

  const numericValue = parseFloat(match[1]);
  const suffix = match[2];

  return (
    <div>
      <div className="text-primary text-4xl font-bold tracking-tight sm:text-5xl">
        <CountUp
          to={numericValue}
          from={0}
          duration={2}
          delay={0.2}
          separator=","
          className="inline"
        />
        <span>{suffix}</span>
      </div>
      <div className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
        {label}
      </div>
    </div>
  );
}
