import React from "react";
import { X, ArrowRight, ShieldCheck } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import { PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

const COVERAGE_GAPS = [
  { name: "Small Business coverage", pct: "38%", impact: "High" },
  { name: "Specialty bureau data",   pct: "41%", impact: "Medium" },
  { name: "Tri-bureau alignment",    pct: "72%", impact: "Low" },
];

function impactBadge(impact) {
  if (impact === "High")   return "bg-destructive/10 text-destructive";
  if (impact === "Medium") return "bg-amber-500/10 text-amber-600";
  return "bg-muted text-muted-foreground";
}

export default function FurnisherCoveragePanel({ furnisher, onClose }) {
  const navigate = useNavigate();
  const coverage = furnisher.coverage ?? 0;
  const donutData = [
    { value: coverage,       fill: "#4F46E5" },
    { value: 100 - coverage, fill: "#E5E7EB" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-3.5 bg-primary/60 rounded-full flex-shrink-0" />
          <span className="text-[11.5px] font-medium text-foreground">Selected furnisher</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground/50 hover:text-foreground transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Identity */}
      <div className="flex items-center gap-2.5 mb-4">
        <FurnisherLogo domain={furnisher.domain} name={furnisher.furnisherName} size="md" />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-foreground truncate">{furnisher.furnisherName}</span>
            <span className="text-[9px] font-medium bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded">Verified</span>
          </div>
          <div className="text-[10px] text-muted-foreground/60 mt-0.5 capitalize">{furnisher.productType?.replace(/_/g, " ") || "Furnisher"}</div>
        </div>
      </div>

      {/* Overall coverage */}
      <div className="mb-3">
        <div className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Overall coverage</div>
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 flex-shrink-0">
            <PieChart width={56} height={56}>
              <Pie data={donutData} cx={24} cy={24} innerRadius={18} outerRadius={26} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                {donutData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-foreground">{coverage}%</span>
            </div>
          </div>
          <div>
            <span className="text-[9.5px] font-medium bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded block mb-1.5">High coverage</span>
            <div className="text-[10px] text-muted-foreground/60">↑ 2.1pts vs 30d</div>
          </div>
        </div>
      </div>

      {/* Bureaus covered */}
      {furnisher.bureaus?.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Bureaus reported</div>
          <div className="flex gap-1 flex-wrap">
            {furnisher.bureaus.map((b) => (
              <span key={b} className="text-[9.5px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">{b}</span>
            ))}
          </div>
        </div>
      )}

      {/* Coverage gaps */}
      <div className="pt-2.5 border-t border-border/40 mb-3">
        <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground/70 mb-2">Top coverage gaps</div>
        <div className="space-y-1.5">
          {COVERAGE_GAPS.map((g) => (
            <div key={g.name} className="flex items-center justify-between gap-2">
              <span className="text-[10.5px] text-foreground flex-1 truncate">{g.name}</span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[10.5px] font-medium tabular-nums text-foreground">{g.pct}</span>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${impactBadge(g.impact)}`}>{g.impact}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary transition-colors mt-2">
          View all gaps <ArrowRight className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* CTA */}
      <button
        onClick={() => furnisher.slug && navigate(`/furnishers/${furnisher.slug}`)}
        className="w-full h-7 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-[11px] font-medium rounded-md hover:bg-primary/90 transition-colors mt-1"
      >
        View furnisher profile <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}