import React from "react";

const checks = [
  { label: "8+ characters", test: (p) => p.length >= 8 },
  { label: "Uppercase", test: (p) => /[A-Z]/.test(p) },
  { label: "Number", test: (p) => /[0-9]/.test(p) },
  { label: "Symbol", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const levels = [
  { label: "Weak", color: "bg-destructive" },
  { label: "Fair", color: "bg-amber-500" },
  { label: "Good", color: "bg-amber-400" },
  { label: "Strong", color: "bg-emerald-500" },
];

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const score = checks.filter((c) => c.test(password)).length;
  const level = levels[Math.max(0, score - 1)];

  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {levels.map((l, i) => (
          <div key={l.label} className={`h-1 flex-1 rounded-full ${i < score ? level.color : "bg-muted"}`} />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{checks.filter((c) => c.test(password)).map((c) => c.label).join(" · ")}</span>
        <span>{level.label}</span>
      </div>
    </div>
  );
}