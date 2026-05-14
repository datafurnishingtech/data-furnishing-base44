import React from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Link2, Package, Globe, Network, Filter, ArrowRight } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import USCoverageHeatmap from "@/components/overview/USCoverageHeatmap";

const relationships = [
  { rank: 1, furnisher: "Synchrony Bank", product: "Credit Card", bureau: "TransUnion", strength: "High", confidence: "96%", lastActive: "May 31, 2025" },
  { rank: 2, furnisher: "Capital One", product: "Credit Card", bureau: "Equifax", strength: "High", confidence: "95%", lastActive: "May 31, 2025" },
  { rank: 3, furnisher: "American Express", product: "Charge Card", bureau: "Experian", strength: "High", confidence: "94%", lastActive: "May 31, 2025" },
  { rank: 4, furnisher: "Citi", product: "Personal Loan", bureau: "TransUnion", strength: "Medium", confidence: "90%", lastActive: "May 31, 2025" },
  { rank: 5, furnisher: "Barclays", product: "Credit Card", bureau: "Equifax", strength: "Medium", confidence: "88%", lastActive: "May 31, 2025" },
];

const relatedProducts = [
  { name: "Credit Card", strength: "High" },
  { name: "Personal Loan", strength: "High" },
  { name: "Auto Loan", strength: "Medium" },
  { name: "Point of Sale", strength: "Medium" },
];

const connectedBureaus = [
  { name: "TransUnion", strength: "High", color: "bg-emerald-500" },
  { name: "Equifax", strength: "High", color: "bg-emerald-500" },
  { name: "Experian", strength: "High", color: "bg-emerald-500" },
  { name: "Innovis", strength: "Medium", color: "bg-amber-500" },
  { name: "Clarity Services", strength: "Low", color: "bg-destructive" },
];

const furnisherNodes = [
  { name: "Synchrony Bank", x: 15, y: 30 },
  { name: "Capital One", x: 12, y: 50 },
  { name: "American Express", x: 15, y: 65 },
  { name: "Citi", x: 20, y: 80 },
  { name: "Barclays", x: 18, y: 92 },
];

const productNodes = [
  { name: "Personal Loan", x: 40, y: 20 },
  { name: "Credit Card", x: 38, y: 45 },
  { name: "Auto Loan", x: 38, y: 60 },
  { name: "Mortgage", x: 40, y: 75 },
  { name: "Point of Sale", x: 38, y: 90 },
];

const bureauNodes = [
  { name: "TransUnion", x: 65, y: 20 },
  { name: "Equifax", x: 68, y: 38 },
  { name: "Experian", x: 68, y: 55 },
  { name: "Innovis", x: 65, y: 72 },
  { name: "Clarity Services", x: 68, y: 88 },
];

export default function ProductGraph() {
  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Product Graph" subtitle="Visualize relationships between furnishers, products, and bureaus across the credit ecosystem.">
          <button className="text-[11px] text-primary/70 hover:text-primary transition-colors font-normal">Reset filters</button>
        </PageHeader>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard label="Linked furnishers" value="2,847" change={12.5} />
          <StatCard label="Product nodes" value="1,248" change={9.8} />
          <StatCard label="Bureaus mapped" value="5" change={0} changeLabel="No change vs 30d" />
          <StatCard label="Active links" value="18,732" change={15.3} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3 mb-4">
          {[["Furnisher", "All furnishers"], ["Product category", "All categories"], ["Bureau", "All bureaus"]].map(([label, placeholder]) => (
            <div key={label}>
              <p className="text-[10px] text-muted-foreground/60 mb-1">{label}</p>
              <Select><SelectTrigger className="w-[140px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal"><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent><SelectItem value="all">{placeholder}</SelectItem></SelectContent></Select>
            </div>
          ))}
          <div className="flex-1 max-w-[180px]">
            <p className="text-[10px] text-muted-foreground/60 mb-1">Relationship strength</p>
            <Slider defaultValue={[20]} max={100} step={1} />
            <div className="flex justify-between text-[9.5px] text-muted-foreground/60 mt-1">
              <span>0%</span><span>20%+</span><span>100%</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1 text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60">
            <Filter className="w-3 h-3" /> More filters
          </Button>
        </div>

        {/* Ecosystem Graph */}
        <div className="bg-card rounded-lg border border-border/60 p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11.5px] font-medium text-foreground">Ecosystem Graph</h3>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="text-[11px] h-7 px-2.5 font-normal border-border/60">Fit view</Button>
              <Button variant="outline" size="sm" className="text-[11px] h-7 w-7 p-0 border-border/60">−</Button>
              <Button variant="outline" size="sm" className="text-[11px] h-7 w-7 p-0 border-border/60">+</Button>
            </div>
          </div>
          <div className="flex gap-4 mb-3 flex-wrap">
            {[{ label: "Furnishers", color: "bg-primary" }, { label: "Products", color: "bg-emerald-500" }, { label: "Bureaus", color: "bg-accent" }].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${l.color}`} />
                <span className="text-[10px] text-muted-foreground">{l.label}</span>
              </div>
            ))}
            <span className="text-[10px] text-muted-foreground/60 ml-2">Strength:</span>
            <span className="text-[10px] text-muted-foreground/60">— High</span>
            <span className="text-[10px] text-muted-foreground/60">- - Medium</span>
            <span className="text-[10px] text-muted-foreground/60">··· Low</span>
          </div>
          <div className="relative h-72 bg-muted/20 rounded-lg overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {furnisherNodes.map((fn) => productNodes.map((pn) => (
                <line key={`${fn.name}-${pn.name}`} x1={fn.x + 5} y1={fn.y} x2={pn.x - 3} y2={pn.y} stroke="hsl(var(--border))" strokeWidth="0.2" opacity="0.5" />
              )))}
              {productNodes.map((pn) => bureauNodes.map((bn) => (
                <line key={`${pn.name}-${bn.name}`} x1={pn.x + 5} y1={pn.y} x2={bn.x - 3} y2={bn.y} stroke="hsl(var(--border))" strokeWidth="0.2" opacity="0.5" />
              )))}
              {furnisherNodes.map((n) => (
                <g key={n.name}><circle cx={n.x} cy={n.y} r="3.5" fill="hsl(var(--primary))" opacity="0.9" /><text x={n.x - 1} y={n.y + 6} fontSize="2.2" fill="hsl(var(--foreground))" fontWeight="500">{n.name}</text></g>
              ))}
              {productNodes.map((n) => (
                <g key={n.name}><circle cx={n.x} cy={n.y} r="4" fill="hsl(var(--success))" opacity="0.9" /><text x={n.x - 1} y={n.y + 7} fontSize="2.2" fill="hsl(var(--foreground))" fontWeight="500">{n.name}</text></g>
              ))}
              {bureauNodes.map((n) => (
                <g key={n.name}><circle cx={n.x} cy={n.y} r="3.5" fill="hsl(var(--accent))" opacity="0.9" /><text x={n.x + 5} y={n.y + 1} fontSize="2.2" fill="hsl(var(--foreground))" fontWeight="500">{n.name}</text></g>
              ))}
            </svg>
          </div>
        </div>

        {/* Top Relationships */}
        <div className="bg-card rounded-lg border border-border/60 p-5">
          <h3 className="text-[11.5px] font-medium text-foreground mb-3">Top Relationships</h3>
          <table className="w-full">
            <thead>
              <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                <th className="text-left pb-2 font-medium w-6">#</th>
                <th className="text-left pb-2 font-medium">Furnisher</th>
                <th className="text-left pb-2 font-medium">Product</th>
                <th className="text-left pb-2 font-medium">Bureau</th>
                <th className="text-left pb-2 font-medium">Strength</th>
                <th className="text-left pb-2 font-medium">Confidence</th>
                <th className="text-left pb-2 font-medium">Last active</th>
              </tr>
            </thead>
            <tbody>
              {relationships.map((r) => (
                <tr key={r.rank} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="py-2 text-[10px] text-muted-foreground/50 tabular-nums">{r.rank}</td>
                  <td className="py-2 text-[11px] font-normal text-foreground">{r.furnisher}</td>
                  <td className="py-2 text-[11px] text-foreground/70">{r.product}</td>
                  <td className="py-2 text-[11px] text-foreground/70">{r.bureau}</td>
                  <td className="py-2"><span className={`text-[10px] font-medium ${r.strength === "High" ? "text-emerald-500" : "text-amber-500"}`}>{r.strength}</span></td>
                  <td className="py-2 text-[11px] text-foreground/70 tabular-nums">{r.confidence}</td>
                  <td className="py-2 text-[10px] text-muted-foreground/60 tabular-nums">{r.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-2.5 flex items-center gap-1">View all relationships <ArrowRight className="w-2.5 h-2.5" /></button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-[260px] flex-shrink-0 space-y-4">
        {/* Bureau Coverage */}
        <div className="bg-card rounded-lg border border-border/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
              <h4 className="text-[11.5px] font-medium text-foreground">Bureau coverage</h4>
            </div>
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors">View details</button>
          </div>
          <USCoverageHeatmap />
          <div className="text-center mt-1">
            <p className="text-[10px] text-muted-foreground/60">U.S. coverage</p>
            <p className="text-[18px] font-semibold text-foreground leading-none mt-0.5">98.1%</p>
            <p className="text-[10px] text-emerald-500 mt-0.5">↑ 2.4% vs 30d</p>
          </div>
        </div>

        {/* Selected Node */}
        <div className="bg-card rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
            <h4 className="text-[11.5px] font-medium text-foreground">Selected node</h4>
            <span className="text-[9px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">Furnisher</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <FurnisherLogo domain="synchrony.com" name="Synchrony Bank" size="sm" />
            <div>
              <p className="text-[11px] font-medium text-foreground">Synchrony Bank</p>
              <p className="text-[10px] text-muted-foreground/60">Furnisher ID: FURN-00124</p>
            </div>
            <span className="text-[9px] font-medium bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded ml-auto">Active</span>
          </div>

          <h5 className="text-[9.5px] font-medium text-muted-foreground/60 uppercase tracking-[0.06em] mb-2">Relationship summary</h5>
          <div className="grid grid-cols-4 gap-1.5 text-center mb-3">
            {[["6", "Products"], ["5", "Bureaus"], ["28", "Links"], ["94%", "Confidence"]].map(([v, l]) => (
              <div key={l}><p className="text-[13px] font-semibold text-foreground leading-none">{v}</p><p className="text-[9px] text-muted-foreground/60 leading-tight mt-0.5">{l}</p></div>
            ))}
          </div>

          <div className="pt-2.5 border-t border-border/40 mb-3">
            <h5 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Related products</h5>
            {relatedProducts.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-0.5">
                <span className="text-[10.5px] text-foreground">{p.name}</span>
                <span className={`text-[10px] font-medium ${p.strength === "High" ? "text-emerald-500" : "text-amber-500"}`}>{p.strength}</span>
              </div>
            ))}
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-1">View all (6)</button>
          </div>

          <div className="pt-2.5 border-t border-border/40 mb-3">
            <h5 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Connected bureaus</h5>
            {connectedBureaus.map((b) => (
              <div key={b.name} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${b.color}`} />
                  <span className="text-[10.5px] text-foreground">{b.name}</span>
                </div>
                <span className={`text-[10px] font-medium ${b.strength === "High" ? "text-emerald-500" : b.strength === "Medium" ? "text-amber-500" : "text-destructive"}`}>{b.strength}</span>
              </div>
            ))}
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-1">View all (5)</button>
          </div>

          <div className="pt-2.5 border-t border-border/40">
            <h5 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1">Relationship insights</h5>
            <p className="text-[10px] text-muted-foreground/60">Strong reporting consistency across all major bureaus.</p>
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-1 flex items-center gap-1">View insights <ArrowRight className="w-2.5 h-2.5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}