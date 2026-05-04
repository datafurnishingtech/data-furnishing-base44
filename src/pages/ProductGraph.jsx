import React from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Link2, Package, Globe, Network, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from "recharts";

const relationships = [
  { rank: 1, furnisher: "Synchrony Bank", product: "Credit Card", bureau: "TransUnion", strength: "High", confidence: "96%", lastActive: "May 31, 2025" },
  { rank: 2, furnisher: "Capital One", product: "Credit Card", bureau: "Equifax", strength: "High", confidence: "95%", lastActive: "May 31, 2025" },
  { rank: 3, furnisher: "American Express", product: "Charge Card", bureau: "Experian", strength: "High", confidence: "94%", lastActive: "May 31, 2025" },
  { rank: 4, furnisher: "Citi", product: "Personal Loan", bureau: "TransUnion", strength: "Medium", confidence: "90%", lastActive: "May 31, 2025" },
  { rank: 5, furnisher: "Barclays", product: "Credit Card", bureau: "Equifax", strength: "Medium", confidence: "88%", lastActive: "May 31, 2025" },
];

const trendData = [
  { x: 1, y: 10 }, { x: 2, y: 15 }, { x: 3, y: 12 }, { x: 4, y: 20 }, { x: 5, y: 25 }, { x: 6, y: 22 }, { x: 7, y: 30 },
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

// Graph node positions (mock layout)
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
          <button className="text-xs text-primary font-medium hover:underline">Reset Filters</button>
        </PageHeader>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Linked Furnishers" value="2,847" change={12.5} icon={Link2} />
          <StatCard label="Product Nodes" value="1,248" change={9.8} icon={Package} />
          <StatCard label="Bureaus Mapped" value="5" change={0} changeLabel="No change vs last 30 days" icon={Globe} />
          <StatCard label="Active Links" value="18,732" change={15.3} icon={Network} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Furnisher</span>
            <Select><SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="All Furnishers" /></SelectTrigger><SelectContent><SelectItem value="all">All Furnishers</SelectItem></SelectContent></Select>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Product Category</span>
            <Select><SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="All Categories" /></SelectTrigger><SelectContent><SelectItem value="all">All Categories</SelectItem></SelectContent></Select>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Bureau</span>
            <Select><SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="All Bureaus" /></SelectTrigger><SelectContent><SelectItem value="all">All Bureaus</SelectItem></SelectContent></Select>
          </div>
          <div className="flex-1 max-w-[200px]">
            <span className="text-xs text-muted-foreground block mb-1">Relationship Strength</span>
            <Slider defaultValue={[20]} max={100} step={1} />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>0%</span><span>20%+</span><span>100%</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 mt-4">
            <Filter className="w-3 h-3" /> More Filters
          </Button>
        </div>

        {/* Ecosystem Graph */}
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Ecosystem Graph</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs h-7">Fit View</Button>
              <Button variant="outline" size="sm" className="text-xs h-7 w-7 p-0">−</Button>
              <Button variant="outline" size="sm" className="text-xs h-7 w-7 p-0">+</Button>
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            {[{ label: "Furnishers", color: "bg-primary" }, { label: "Products", color: "bg-emerald-500" }, { label: "Bureaus", color: "bg-accent" }].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
            <span className="text-xs text-muted-foreground ml-4">Strength</span>
            <span className="text-xs text-muted-foreground">— High</span>
            <span className="text-xs text-muted-foreground">- - Medium</span>
            <span className="text-xs text-muted-foreground">··· Low</span>
          </div>

          {/* SVG Graph */}
          <div className="relative h-80 bg-muted/20 rounded-lg overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Connection lines */}
              {furnisherNodes.map((fn) =>
                productNodes.map((pn) => (
                  <line key={`${fn.name}-${pn.name}`} x1={fn.x + 5} y1={fn.y} x2={pn.x - 3} y2={pn.y} stroke="hsl(var(--border))" strokeWidth="0.2" opacity="0.5" />
                ))
              )}
              {productNodes.map((pn) =>
                bureauNodes.map((bn) => (
                  <line key={`${pn.name}-${bn.name}`} x1={pn.x + 5} y1={pn.y} x2={bn.x - 3} y2={bn.y} stroke="hsl(var(--border))" strokeWidth="0.2" opacity="0.5" />
                ))
              )}

              {/* Furnisher nodes */}
              {furnisherNodes.map((n) => (
                <g key={n.name}>
                  <circle cx={n.x} cy={n.y} r="3.5" fill="hsl(var(--primary))" opacity="0.9" />
                  <text x={n.x - 1} y={n.y + 6} fontSize="2.2" fill="hsl(var(--foreground))" fontWeight="500">{n.name}</text>
                </g>
              ))}

              {/* Product nodes */}
              {productNodes.map((n) => (
                <g key={n.name}>
                  <circle cx={n.x} cy={n.y} r="4" fill="hsl(var(--success))" opacity="0.9" />
                  <text x={n.x - 1} y={n.y + 7} fontSize="2.2" fill="hsl(var(--foreground))" fontWeight="500">{n.name}</text>
                </g>
              ))}

              {/* Bureau nodes */}
              {bureauNodes.map((n) => (
                <g key={n.name}>
                  <circle cx={n.x} cy={n.y} r="3.5" fill="hsl(var(--accent))" opacity="0.9" />
                  <text x={n.x + 5} y={n.y + 1} fontSize="2.2" fill="hsl(var(--foreground))" fontWeight="500">{n.name}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Top Relationships */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-3">Top Relationships</h3>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-muted-foreground border-b border-border uppercase">
                <th className="text-left pb-2 font-medium w-6">#</th>
                <th className="text-left pb-2 font-medium">Furnisher</th>
                <th className="text-left pb-2 font-medium">Product</th>
                <th className="text-left pb-2 font-medium">Bureau</th>
                <th className="text-left pb-2 font-medium">Strength</th>
                <th className="text-left pb-2 font-medium">Confidence</th>
                <th className="text-left pb-2 font-medium">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {relationships.map((r) => (
                <tr key={r.rank} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-2.5 text-xs text-muted-foreground">{r.rank}</td>
                  <td className="py-2.5 text-xs font-medium">{r.furnisher}</td>
                  <td className="py-2.5 text-xs">{r.product}</td>
                  <td className="py-2.5 text-xs">{r.bureau}</td>
                  <td className="py-2.5">
                    <span className={`text-xs ${r.strength === "High" ? "text-emerald-500" : "text-amber-500"}`}>{r.strength}</span>
                  </td>
                  <td className="py-2.5 text-xs">{r.confidence}</td>
                  <td className="py-2.5 text-xs text-muted-foreground">{r.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="text-xs text-primary font-medium hover:underline mt-3">View all relationships →</button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-[280px] flex-shrink-0 space-y-4">
        {/* Bureau Coverage */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold">Bureau Coverage</h4>
            <button className="text-[10px] text-primary font-medium hover:underline">View details</button>
          </div>
          <Tabs defaultValue="map">
            <TabsList className="w-full h-7 bg-muted/50">
              <TabsTrigger value="map" className="text-[10px] h-5">Coverage Map</TabsTrigger>
              <TabsTrigger value="ranking" className="text-[10px] h-5">Coverage Ranking</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="h-28 bg-muted/20 rounded-lg mt-3 flex items-center justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Blank_US_Map_%28states_only%29.svg/1200px-Blank_US_Map_%28states_only%29.svg.png"
              alt="US Map"
              className="w-full h-full object-contain opacity-15"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {["High (90%+)", "Medium (60–89%)", "Low (30–59%)", "Minimal (<30%)", "No Coverage"].map((l, i) => (
              <div key={l} className="flex items-center gap-0.5">
                <div className={`w-2 h-2 rounded-sm ${["bg-primary", "bg-primary/60", "bg-primary/30", "bg-primary/15", "bg-muted"][i]}`} />
                <span className="text-[8px] text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <p className="text-[10px] text-muted-foreground">U.S. Coverage</p>
            <p className="text-xl font-bold">98.1%</p>
            <p className="text-[10px] text-emerald-500">↑ 2.4% vs last 30 days</p>
          </div>
        </div>

        {/* Selected Node */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-xs font-semibold">Selected Node</h4>
            <Badge className="bg-primary/10 text-primary border-0 text-[9px]">Furnisher</Badge>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">SB</div>
            <div>
              <p className="text-xs font-semibold">Synchrony Bank</p>
              <p className="text-[10px] text-muted-foreground">Furnisher ID: FURN-00124</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[9px] ml-auto">Active</Badge>
          </div>

          <h5 className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Relationship Summary</h5>
          <div className="grid grid-cols-4 gap-2 text-center mb-4">
            {[["6", "Products Linked"], ["5", "Bureaus Connected"], ["28", "Active Links"], ["94%", "Confidence Score"]].map(([v, l]) => (
              <div key={l}><p className="text-sm font-bold">{v}</p><p className="text-[9px] text-muted-foreground leading-tight">{l}</p></div>
            ))}
          </div>

          {/* Related Products */}
          <div className="pt-3 border-t border-border mb-3">
            <h5 className="text-[10px] font-semibold mb-2">Related Products</h5>
            {relatedProducts.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-1">
                <span className="text-[11px]">{p.name}</span>
                <span className={`text-[10px] ${p.strength === "High" ? "text-emerald-500" : "text-amber-500"}`}>{p.strength}</span>
              </div>
            ))}
            <button className="text-[10px] text-primary font-medium hover:underline mt-1">View all (6)</button>
          </div>

          {/* Connected Bureaus */}
          <div className="pt-3 border-t border-border mb-3">
            <h5 className="text-[10px] font-semibold mb-2">Connected Bureaus</h5>
            {connectedBureaus.map((b) => (
              <div key={b.name} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${b.color}`} />
                  <span className="text-[11px]">{b.name}</span>
                </div>
                <span className={`text-[10px] ${b.strength === "High" ? "text-emerald-500" : b.strength === "Medium" ? "text-amber-500" : "text-destructive"}`}>{b.strength}</span>
              </div>
            ))}
            <button className="text-[10px] text-primary font-medium hover:underline mt-1">View all (5)</button>
          </div>

          {/* Insights */}
          <div className="pt-3 border-t border-border">
            <h5 className="text-[10px] font-semibold mb-1">Relationship Insights</h5>
            <p className="text-[10px] text-muted-foreground">Strong reporting consistency across all major bureaus.</p>
            <button className="text-[10px] text-primary font-medium hover:underline mt-1">View insights →</button>
          </div>
        </div>
      </div>
    </div>
  );
}