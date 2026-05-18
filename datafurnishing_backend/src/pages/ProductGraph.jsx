import React from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import USCoverageHeatmap from "@/components/overview/USCoverageHeatmap";

const furnisherNodes = [{ name: "Synchrony Bank", x: 15, y: 30 }, { name: "Capital One", x: 12, y: 50 }, { name: "American Express", x: 15, y: 65 }, { name: "Citi", x: 20, y: 80 }, { name: "Barclays", x: 18, y: 92 }];
const productNodes = [{ name: "Personal Loan", x: 40, y: 20 }, { name: "Credit Card", x: 38, y: 45 }, { name: "Auto Loan", x: 38, y: 60 }, { name: "Mortgage", x: 40, y: 75 }, { name: "Point of Sale", x: 38, y: 90 }];
const bureauNodes = [{ name: "TransUnion", x: 65, y: 20 }, { name: "Equifax", x: 68, y: 38 }, { name: "Experian", x: 68, y: 55 }, { name: "Innovis", x: 65, y: 72 }, { name: "Clarity Services", x: 68, y: 88 }];

const relationships = [
  { rank: 1, furnisher: "Synchrony Bank", product: "Credit Card", bureau: "TransUnion", strength: "High", confidence: "96%", lastActive: "May 31, 2025" },
  { rank: 2, furnisher: "Capital One", product: "Credit Card", bureau: "Equifax", strength: "High", confidence: "95%", lastActive: "May 31, 2025" },
  { rank: 3, furnisher: "American Express", product: "Charge Card", bureau: "Experian", strength: "High", confidence: "94%", lastActive: "May 31, 2025" },
  { rank: 4, furnisher: "Citi", product: "Personal Loan", bureau: "TransUnion", strength: "Medium", confidence: "90%", lastActive: "May 31, 2025" },
  { rank: 5, furnisher: "Barclays", product: "Credit Card", bureau: "Equifax", strength: "Medium", confidence: "88%", lastActive: "May 31, 2025" },
];

const connectedBureaus = [
  { name: "TransUnion", strength: "High", color: "bg-emerald-500" }, { name: "Equifax", strength: "High", color: "bg-emerald-500" },
  { name: "Experian", strength: "High", color: "bg-emerald-500" }, { name: "Innovis", strength: "Medium", color: "bg-amber-500" },
  { name: "Clarity Services", strength: "Low", color: "bg-destructive" },
];

export default function ProductGraph() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Product Graph" subtitle="Ecosystem relationships between furnishers, products, and bureaus">
        <Button variant="outline" size="sm" className="h-7 text-[11px]">Reset filters</Button>
      </PageHeader>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 pb-0">
        <StatCard label="Total Relationships" value="18,453" change={7.2} />
        <StatCard label="Active Furnishers" value="2,847" change={2.4} />
        <StatCard label="Products Mapped" value="7,312" change={5.8} />
        <StatCard label="Avg. Confidence" value="91%" change={1.3} />
      </div>

      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Graph */}
        <div className="flex-1 bg-card rounded-lg border border-border p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-semibold">Ecosystem Graph</h3>
            <div className="flex gap-2">
              {[{ label: "Furnishers", color: "bg-primary" }, { label: "Products", color: "bg-emerald-500" }, { label: "Bureaus", color: "bg-amber-500" }].map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${l.color}`} />
                  <span className="text-[9px] text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-64 bg-muted/20 rounded-lg overflow-hidden border border-border/40">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {furnisherNodes.map((fn) => productNodes.map((pn) => (
                <line key={`${fn.name}-${pn.name}`} x1={fn.x} y1={fn.y} x2={pn.x} y2={pn.y} stroke="hsl(var(--primary))" strokeWidth={0.3} strokeOpacity={0.3} />
              )))}
              {productNodes.map((pn) => bureauNodes.map((bn) => (
                <line key={`${pn.name}-${bn.name}`} x1={pn.x} y1={pn.y} x2={bn.x} y2={bn.y} stroke="hsl(var(--primary))" strokeWidth={0.3} strokeOpacity={0.3} />
              )))}
              {furnisherNodes.map((n) => <circle key={n.name} cx={n.x} cy={n.y} r={2.5} fill="hsl(var(--primary))" opacity={0.8} />)}
              {productNodes.map((n) => <circle key={n.name} cx={n.x} cy={n.y} r={2} fill="#10b981" opacity={0.8} />)}
              {bureauNodes.map((n) => <circle key={n.name} cx={n.x} cy={n.y} r={2.5} fill="#f59e0b" opacity={0.8} />)}
            </svg>
            {furnisherNodes.map((n) => <div key={n.name} style={{ position: "absolute", left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)" }} className="text-[7px] text-foreground/60 whitespace-nowrap pointer-events-none mt-4">{n.name}</div>)}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3">
            {[["Furnisher", "All furnishers"], ["Product category", "All categories"], ["Bureau", "All bureaus"]].map(([label, placeholder]) => (
              <div key={label} className="flex-1">
                <Select>
                  <SelectTrigger className="h-7 text-[10px]"><SelectValue placeholder={placeholder} /></SelectTrigger>
                  <SelectContent><SelectItem value="all" className="text-[10px]">{placeholder}</SelectItem></SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Top Relationships */}
          <div className="mt-4">
            <h3 className="text-[11px] font-semibold mb-2">Top Relationships</h3>
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground/60">
                  <th className="text-left py-1 font-medium">#</th>
                  <th className="text-left py-1 font-medium">Furnisher</th>
                  <th className="text-left py-1 font-medium">Product</th>
                  <th className="text-left py-1 font-medium">Bureau</th>
                  <th className="text-left py-1 font-medium">Strength</th>
                  <th className="text-left py-1 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {relationships.map((r) => (
                  <tr key={r.rank} className="border-b border-border/30 last:border-0">
                    <td className="py-1 text-muted-foreground/50">{r.rank}</td>
                    <td className="py-1">{r.furnisher}</td>
                    <td className="py-1 text-muted-foreground">{r.product}</td>
                    <td className="py-1 text-muted-foreground">{r.bureau}</td>
                    <td className="py-1"><span className={`px-1 py-0.5 rounded text-[8px] ${r.strength === "High" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>{r.strength}</span></td>
                    <td className="py-1 font-medium">{r.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-52 bg-card rounded-lg border border-border p-4 overflow-y-auto hidden xl:block">
          <div className="mb-4">
            <h4 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wide mb-1.5">Bureau Coverage</h4>
            <div className="text-xl font-bold">98.1%</div>
            <div className="text-[9px] text-emerald-600 mt-0.5">↑ 2.4% vs 30d</div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wide mb-1.5">Selected Node</h4>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">SB</div>
              <div>
                <div className="text-[11px] font-semibold">Synchrony Bank</div>
                <div className="text-[9px] text-muted-foreground/60">Active</div>
              </div>
            </div>
            <div className="space-y-1 text-[10px]">
              {[["6", "Products"], ["5", "Bureaus"], ["28", "Links"], ["94%", "Confidence"]].map(([v, l]) => (
                <div key={l} className="flex justify-between"><span className="text-muted-foreground/60">{l}</span><span className="font-semibold">{v}</span></div>
              ))}
            </div>
            <div className="mt-3">
              <h4 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wide mb-1.5">Connected Bureaus</h4>
              {connectedBureaus.map((b) => (
                <div key={b.name} className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${b.color}`} />
                    <span className="text-[10px]">{b.name}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground/60">{b.strength}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}