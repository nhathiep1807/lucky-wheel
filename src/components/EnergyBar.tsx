import React from "react";

interface EnergyBarProps {
  value: number; // Value between 0 and 100
  height?: number; // Height of the bar in pixels
  width?: number; // Width of the bar in pixels
}

const EnergyBar: React.FC<EnergyBarProps> = ({
  value,
  height = 200,
  width = 30,
}) => {
  // Ensure the value is between 0 and 100

  const clampedValue = (200 * value) / 5000;

  return (
    <div
      className="relative overflow-hidden bg-white border border-gray-400 rounded-lg"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: `${clampedValue}px`,
          background: "linear-gradient(to top, #00ff00, #ff0000)",
        }}
      />
    </div>
  );
};

export default EnergyBar;
