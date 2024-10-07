type EnergyRingProps = {
  width?: number;
  height?: number;
  holdTime: number;
  maxHoldTime?: number;
  isHolding?: boolean;
  className?: string;
};
export default function EnergyRing({
  width = 500,
  height = 500,
  holdTime,
  maxHoldTime = 5000,
  isHolding,
  className,
}: EnergyRingProps) {
  const progress = Math.min(holdTime / maxHoldTime, 1);
  const strokeDasharray = 2 * Math.PI * 49;
  const strokeDashoffset = strokeDasharray * (1 - progress);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={`${className}`}
    >
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fa52db" />
          <stop offset="50%" stopColor="#52faf7" />
          <stop offset="100%" stopColor="#00ff00" />
        </linearGradient>
      </defs>

      <circle
        cx="50"
        cy="50"
        r="49"
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(180 50 50)"
        style={{
          transition: "stroke-dashoffset 0.1s linear",
          opacity: isHolding || progress > 0 ? 1 : 0,
        }}
      />
    </svg>
  );
}
