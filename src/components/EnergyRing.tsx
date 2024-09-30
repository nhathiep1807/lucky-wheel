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
  const strokeDasharray = 2 * Math.PI * 45;
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
        r="45"
        fill="none"
        stroke="#e5e5e5"
        strokeWidth="2"
      />
      {isHolding && (
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
      )}
    </svg>
  );
}
