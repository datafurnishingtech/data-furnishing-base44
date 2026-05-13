import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Building2, Globe, Shield, TrendingUp, ArrowUp, ArrowDown, Search, Filter, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import USCoverageHeatmap from "@/components/overview/USCoverageHeatmap";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import BureauComparisonTable from "@/components/bureau/BureauComparisonTable";

const bureauCards = [
  { name: "Experian", abbr: "EX", coverage: 98.7, change: 2.6 },
  { name: "Equifax", abbr: "EQ", coverage: 97.9, change: 2.1 },
  { name: "TransUnion", abbr: "TU", coverage: 98.3, change: 2.4 },
];

const additionalBureaus = [
  { name: "Innovis", coverage: 93.6, change: 1.8 },
  { name: "SBFE", coverage: 88.4, change: 1.6 },
  { name: "Experian SB", coverage: 84.1, change: 1.3 },
];

const furnisherCoverage = [
  { name: "Synchrony Bank", domain: "synchrony.com", abbr: "SYN", product: "Synchrony Bank Credit Card", type: "Credit Card", bureaus: ["EX", "EQ", "TU", "IN", "SB", "ESB"], coverage: 97.2, confidence: "High", trend: "up" },
  { name: "Capital One", domain: "capitalone.com", abbr: "CO", product: "Quicksilver Credit Card", type: "Credit Card", bureaus: ["EX", "EQ", "TU", "IN", "SB", "ESB"], coverage: 96.1, confidence: "High", trend: "up" },
  { name: "Chase", domain: "chase.com", abbr: "CH", product: "Freedom Unlimited", type: "Credit Card", bureaus: ["EX", "EQ", "TU", "IN", "SB", "ESB"], coverage: 98.8, confidence: "High", trend: "up" },
  { name: "American Express", domain: "americanexpress.com", abbr: "AE", product: "Blue Cash Everyday", type: "Charge Card", bureaus: ["EX", "EQ", "TU", "IN"], coverage: 95.6, confidence: "High", trend: "up" },
  { name: "Citi", domain: "citibank.com", abbr: "CI", product: "Citi Double Cash", type: "Credit Card", bureaus: ["EX", "EQ", "TU", "IN", "SB", "ESB"], coverage: 94.2, confidence: "Medium", trend: "right" },
  { name: "LendingClub", domain: "lendingclub.com", abbr: "LC", product: "Personal Loan", type: "Personal Loan", bureaus: ["EX", "EQ", "TU", "IN", "SB", "ESB"], coverage: 89.3, confidence: "Medium", trend: "up" },
  { name: "Quicken Loans", domain: "quickenloans.com", abbr: "QL", product: "Fixed 30yr Mortgage", type: "Mortgage", bureaus: ["EX", "EQ", "TU", "IN", "SB"], coverage: 86.7, confidence: "Medium", trend: "up" },
  { name: "NetCredit", domain: "netcredit.com", abbr: "NC", product: "Credit Builder Loan", type: "Personal Loan", bureaus: ["EX", "EQ", "TU", "IN"], coverage: 72.1, confidence: "Low", trend: "down" },
];

const coverageGaps = [
  { name: "SBFE", gap: "54.3%", level: "High Impact" },
  { name: "Experian Small Business", gap: "61.8%", level: "High Impact" },
  { name: "Innovis", gap: "72.1%", level: "Medium" },
  { name: "Experian", gap: "98.5%", level: "Low" },
  { name: "Equifax", gap: "97.6%", level: "Low" },
];

export default function BureauCoverage() {
  const [selectedFurnisher, setSelectedFurnisher] = useState(furnisherCoverage[0]);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Bureau coverage" subtitle="Map where products and furnishers report across consumer and business bureaus.">
          <Button variant="outline" size="sm" className="gap-1 text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60">
            <Filter className="w-3 h-3" /> Filters
          </Button>
        </PageHeader>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <StatCard label="Covered furnishers" value="1,842" change={12.6} />
          <StatCard label="Consumer bureau cov." value="98.1%" change={2.4} />
          <StatCard label="Business bureau cov." value="86.7%" change={1.8} />
          <StatCard label="Verified cov. signals" value="24.6M" change={15.3} />
          <div className="bg-card rounded-lg border border-border/60 px-4 py-3.5 flex flex-col gap-2 min-w-0">
            <span className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground/70 truncate">Coverage trend</span>
            <p className="text-[14px] font-medium text-emerald-500 leading-none">Upward</p>
            <p className="text-[10px] text-muted-foreground/60">Consistent improvement</p>
          </div>
        </div>

        {/* Heatmap + Bureau Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-card rounded-lg border border-border/60 p-5">
            <h3 className="text-[11.5px] font-medium text-foreground mb-0.5">U.S. consumer coverage heatmap</h3>
            <p className="text-[10px] text-muted-foreground/60 mb-3">Coverage % of active tradelines reported by state — hover for detail</p>
            <USCoverageHeatmap />
            <div className="flex items-center justify-between mt-2.5">
              <div>
                <span className="text-[14px] font-medium text-foreground leading-none">98.1%</span>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">National avg. coverage</p>
              </div>
              <button className="text-[10px] text-primary/70 hover:text-primary transition-colors">View state details →</button>
            </div>
          </div>

          {/* Bureau Comparison */}
          <div className="bg-card rounded-lg border border-border/60 p-5">
            <div className="flex items-center justify-between mb-0.5">
              <h3 className="text-[11.5px] font-medium text-foreground">Bureau coverage comparison</h3>
              <button className="text-[10px] text-primary/70 hover:text-primary transition-colors">View all bureaus</button>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mb-3">% of active tradelines covered — sortable by any column</p>
            <BureauComparisonTable />
          </div>
        </div>

        {/* Furnisher Coverage Directory */}
        <div className="bg-card rounded-lg border border-border/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50">
            <h3 className="text-[11.5px] font-medium text-foreground mb-0.5">Furnisher coverage directory</h3>
            <p className="text-[10px] text-muted-foreground/60 mb-2.5">Explore coverage by furnisher, product, and bureau.</p>
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
              <Input placeholder="Search furnishers or products..." className="pl-8 h-7 text-[11px] border-border/60" />
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                <th className="text-left px-4 py-2.5 font-medium">Furnisher</th>
                <th className="text-left px-3 py-2.5 font-medium">Product</th>
                <th className="text-left px-3 py-2.5 font-medium">Product type</th>
                <th className="text-left px-3 py-2.5 font-medium">Covered bureaus</th>
                <th className="text-left px-3 py-2.5 font-medium">Coverage %</th>
                <th className="text-left px-3 py-2.5 font-medium">Confidence</th>
                <th className="text-left px-3 py-2.5 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {furnisherCoverage.map((f) => (
                <tr
                  key={f.name + f.product}
                  onClick={() => setSelectedFurnisher(f)}
                  className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${selectedFurnisher?.name === f.name ? "bg-primary/5" : ""}`}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <FurnisherLogo domain={f.domain} name={f.name} size="sm" />
                      <span className="text-[11px] font-normal text-foreground">{f.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-foreground/70">{f.product}</td>
                  <td className="px-3 py-2.5 text-[11px] text-foreground/70">{f.type}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-0.5 flex-wrap">
                      {f.bureaus.map((b) => (
                        <span key={b} className="text-[9px] font-medium bg-primary/10 text-primary px-1 py-0.5 rounded">{b}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] font-normal text-foreground tabular-nums">{f.coverage}%</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] font-medium ${f.confidence === "High" ? "text-emerald-500" : f.confidence === "Medium" ? "text-amber-500" : "text-destructive"}`}>{f.confidence}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    {f.trend === "up" ? <ArrowUp className="w-3 h-3 text-emerald-500" /> : f.trend === "down" ? <ArrowDown className="w-3 h-3 text-destructive" /> : <ArrowRight className="w-3 h-3 text-muted-foreground/40" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50">
            <span className="text-[10px] text-muted-foreground/60">Showing 1–8 of 1,842 results</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, "...", 231].map((p, i) => (
                <button key={i} className={`w-6 h-6 text-[10px] rounded flex items-center justify-center ${p === 1 ? "bg-primary text-white" : "text-muted-foreground/60 hover:bg-muted"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground/60 flex-wrap">
          <span className="font-medium text-foreground/70">Bureau legend</span>
          {["EX Experian", "EQ Equifax", "TU TransUnion", "IN Innovis", "SB SBFE", "ESB Experian Small Business"].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      {selectedFurnisher && (
        <div className="w-[260px] flex-shrink-0">
          <div className="bg-card rounded-lg border border-border/60 p-4 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
                <h3 className="text-[11.5px] font-medium text-foreground">Selected furnisher</h3>
              </div>
              <button onClick={() => setSelectedFurnisher(null)}><X className="w-3.5 h-3.5 text-muted-foreground/50" /></button>
            </div>
            <div className="flex items-center gap-2.5 mb-4">
              <FurnisherLogo domain={selectedFurnisher.domain} name={selectedFurnisher.name} size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-foreground">{selectedFurnisher.name}</span>
                  <span className="text-[9px] font-medium bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded">Verified</span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{selectedFurnisher.type}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Overall coverage</h4>
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{ value: selectedFurnisher.coverage }, { value: 100 - selectedFurnisher.coverage }]} dataKey="value" cx="50%" cy="50%" innerRadius={18} outerRadius={26} startAngle={90} endAngle={-270}>
                          <Cell fill="#4F46E5" />
                          <Cell fill="#E5E7EB" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-semibold">{selectedFurnisher.coverage}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-medium text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">High coverage</span>
                    <p className="text-[10px] text-muted-foreground/60 mt-1.5">↑ 2.1pts vs 30d</p>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Top coverage gaps</h4>
                <div className="space-y-1.5">
                  {coverageGaps.map((g) => (
                    <div key={g.name} className="flex items-center justify-between">
                      <span className="text-[10.5px] text-foreground">{g.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10.5px] font-medium tabular-nums">{g.gap}</span>
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                          g.level === "High Impact" ? "bg-destructive/10 text-destructive" :
                          g.level === "Medium" ? "bg-amber-500/10 text-amber-600" :
                          "bg-muted text-muted-foreground"
                        }`}>{g.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-2 flex items-center gap-1">View all gaps <ArrowRight className="w-2.5 h-2.5" /></button>
              </div>

              <button className="w-full bg-primary text-primary-foreground text-[11px] font-medium h-7 rounded-md flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors mt-1">
                View furnisher profile <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}