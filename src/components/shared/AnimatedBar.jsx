import React, { useEffect, useState } from "react";

export default function AnimatedBar({ value, className = "" }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value ?? 0), 50);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div
      className={`h-full bg-gradient-to-r from-primary/35 via-accent/75 to-primary rounded-full transition-all duration-700 ease-out ${className}`}
      style={{ width: `${width}%` }}
    />
  );
}