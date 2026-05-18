import React, { useEffect, useState } from "react";

export default function AnimatedBar({ value, className = "" }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value ?? 0), 50);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={`h-1 bg-muted rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, width))}%` }}
      />
    </div>
  );
}