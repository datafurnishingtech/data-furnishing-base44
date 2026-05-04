import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Building2, Globe, Shield, TrendingUp, ArrowUp, ArrowDown, Search, Filter, X, ArrowRight, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const bureauCards = [
  { name: "Experian", abbr: "EX", coverage: 98.7, change: 2.6 },
  { name: "EQUIFAX", abbr: "EQ", coverage: 97.9, change: 2.1 },
  { name: "TransUnion", abbr: "TU", coverage: 98.3, change: 2.4 },
];

const additionalBureaus = [
  { name: "innovis", coverage: 93.6, change: 1.8 },
  { name: "sbfe", coverage: 88.4, change: 1.6 },
  { name: "Experian", label: "experian", coverage: 84.1, change: 1.3 },
];

const furnisherCoverage = [
  { name: "Synchrony Bank", abbr: "SYN", product: "Synchrony Bank Credit Card", type: "Credit Card", bureaus: ["EX", "EQ", "TU", "IN", "SB", "ESB"], coverage: 97.2, confidence: "High", trend: "up" },
  { name: "Capital One", abbr: "CO", product: "Quicksilver Credit Card", type: "Credit Card", bureaus: ["EX", "EQ", "TU", "IN", "SB", "ESB"], coverage: 96.1, confidence: "High", trend: "up" },
  { name: "Chase", abbr: "CH", product: "Freedom Unlimited", type: "Credit Card", bureaus: ["EX", "EQ", "TU", "IN", "SB", "ESB"], coverage: 98.8, confidence: "High", trend: "up" },
  { name: "American Express", abbr: "AE", product: "Blue Cash Everyday", type: "Charge Card", bureaus: ["EX", "EQ", "TU", "IN"], coverage: 95.6, confidence: "High", trend: "up" },
  { name: "Citi", abbr: "CI", product: "Citi Double Cash", type: "Credit Card", bureaus: ["EX", "EQ", "TU", "IN", "SB", "ESB"], coverage: 94.2, confidence: "Medium", trend: "right" },
  { name: "LendingClub", abbr: "LC", product: "Personal Loan", type: "Personal Loan", bureaus: ["EX", "EQ", "TU", "IN", "SB", "ESB"], coverage: 89.3, confidence: "Medium", trend: "up" },
  { name: "QuickLoans", abbr: "QL", product: "Fixed 30yr Mortgage", type: "Mortgage", bureaus: ["EX", "EQ", "TU", "IN", "SB"], coverage: 86.7, confidence: "Medium", trend: "up" },
  { name: "NetCredit", abbr: "NC", product: "Credit Builder Loan", type: "Personal Loan", bureaus: ["EX", "EQ", "TU", "IN"], coverage: 72.1, confidence: "Low", trend: "down" },
];

const coverageGaps = [
  { name: "SBFE", gap: "54.3%", level: "High Impact" },
  { name: "Experian Small Business", gap: "61.8%", level: "High Impact" },
  { name: "Innovis", gap: "72.1%", level: "Medium" },
  { name: "Experian", gap: "98.5%", level: "Low" },
  { name: "Equifax", gap: "97.6%", level: "Low" },
  { name: "TransUnion", gap: "98.0%", level: "Low" },
];

export default function BureauCoverage() {
  const [selectedFurnisher, setSelectedFurnisher] = useState(furnisherCoverage[0]);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Bureau Coverage" subtitle="Map where products and furnishers report across consumer and business bureaus.">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Filter className="w-3 h-3" /> Filters
          </Button>
        </PageHeader>

        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatCard label="Total Covered Furnishers" value="1,842" change={12.6} icon={Building2} />
          <StatCard label="Consumer Bureau Coverage" value="98.1%" change={2.4} icon={Globe} />
          <StatCard label="Business Bureau Coverage" value="86.7%" change={1.8} icon={Shield} />
          <StatCard label="Verified Coverage Signals" value="24.6M" change={15.3} icon={TrendingUp} />
          <div className="bg-card rounded-xl border border-border p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Coverage Trend</span>
            <p className="text-2xl font-bold text-foreground mt-3">Upward</p>
            <p className="text-xs text-muted-foreground mt-1">Consistent improvement</p>
          </div>
        </div>

        {/* Heatmap + Bureau Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold mb-1">U.S. Consumer Coverage Heatmap</h3>
            <p className="text-xs text-muted-foreground mb-3">Coverage intensity represents % of active tradelines reported</p>
            <div className="h-44 bg-muted/20 rounded-lg flex items-center justify-center relative overflow-hidden">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Blank_US_Map_%28states_only%29.svg/1200px-Blank_US_Map_%28states_only%29.svg.png"
                alt="US Map"
                className="w-full h-full object-contain opacity-15"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
            </div>
            <div className="flex gap-3 mt-3">
              {["90%+", "70–90%", "50–70%", "30–50%", "Below 30%", "No Coverage"].map((l, i) => (
                <div key={l} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-sm ${
                    ["bg-primary", "bg-primary/70", "bg-primary/50", "bg-primary/30", "bg-primary/15", "bg-muted"][i]
                  }`} />
                  <span className="text-[9px] text-muted-foreground">{l}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-lg font-bold">98.1%</span>
                <p className="text-[10px] text-muted-foreground">National Avg. Coverage</p>
              </div>
              <button className="text-xs text-primary font-medium hover:underline">View state details →</button>
            </div>
          </div>

          {/* Bureau Comparison */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Bureau Coverage Comparison</h3>
              <button className="text-xs text-primary font-medium hover:underline">View all bureaus</button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">% of active tradelines covered</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {bureauCards.map((b) => (
                <div key={b.name} className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">{b.name}</p>
                  <p className="text-xl font-bold text-foreground">{b.coverage}%</p>
                  <p className="text-[10px] text-emerald-500">↑ {b.change}pts</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {additionalBureaus.map((b) => (
                <div key={b.name} className="text-center p-3 bg-muted/20 rounded-lg">
                  <p className="text-[10px] font-bold text-muted-foreground mb-1">{b.name}</p>
                  <p className="text-base font-bold text-foreground">{b.coverage}%</p>
                  <p className="text-[10px] text-emerald-500">↑ {b.change}pts</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Furnisher Coverage Directory */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold mb-1">Furnisher Coverage Directory</h3>
            <p className="text-xs text-muted-foreground">Explore coverage by furnisher, product, and bureau.</p>
            <div className="flex items-center gap-3 mt-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search furnishers or products..." className="pl-9 h-8 text-xs" />
              </div>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 text-[10px] text-muted-foreground uppercase border-b border-border">
                <th className="text-left px-4 py-2 font-medium">Furnisher</th>
                <th className="text-left px-3 py-2 font-medium">Product</th>
                <th className="text-left px-3 py-2 font-medium">Product Type</th>
                <th className="text-left px-3 py-2 font-medium">Covered Bureaus</th>
                <th className="text-left px-3 py-2 font-medium">Coverage %</th>
                <th className="text-left px-3 py-2 font-medium">Confidence</th>
                <th className="text-left px-3 py-2 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {furnisherCoverage.map((f) => (
                <tr
                  key={f.name + f.product}
                  onClick={() => setSelectedFurnisher(f)}
                  className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer ${
                    selectedFurnisher?.name === f.name ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">
                        {f.abbr}
                      </div>
                      <span className="text-xs font-medium">{f.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-foreground">{f.product}</td>
                  <td className="px-3 py-3 text-xs text-foreground">{f.type}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-0.5">
                      {f.bureaus.map((b) => (
                        <span key={b} className="text-[9px] font-medium bg-primary/10 text-primary px-1 py-0.5 rounded">{b}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs font-medium">{f.coverage}%</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs ${f.confidence === "High" ? "text-emerald-500" : f.confidence === "Medium" ? "text-amber-500" : "text-destructive"}`}>
                      {f.confidence}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {f.trend === "up" ? (
                      <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />
                    ) : f.trend === "down" ? (
                      <ArrowDown className="w-3.5 h-3.5 text-destructive" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Showing 1 to 8 of 1,842 results</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, "...", 231].map((p, i) => (
                <button key={i} className={`w-7 h-7 text-xs rounded flex items-center justify-center ${p === 1 ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
          <span className="font-medium">Bureau Legend</span>
          {["EX Experian", "EQ Equifax", "TU TransUnion", "IN Innovis", "SB SBFE", "ESB Experian Small Business"].map((l) => (
            <span key={l}>{l}</span>
          ))}
          <span>— Not Reported</span>
        </div>
      </div>

      {/* Right Panel */}
      {selectedFurnisher && (
        <div className="w-[280px] flex-shrink-0">
          <div className="bg-card rounded-xl border border-border p-5 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Selected Furnisher</h3>
              <button onClick={() => setSelectedFurnisher(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{selectedFurnisher.abbr}</div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{selectedFurnisher.name}</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] px-1.5 h-4">Verified</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{selectedFurnisher.type}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold mb-2">Overall Coverage</h4>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{ value: selectedFurnisher.coverage }, { value: 100 - selectedFurnisher.coverage }]} dataKey="value" cx="50%" cy="50%" innerRadius={22} outerRadius={30} startAngle={90} endAngle={-270}>
                          <Cell fill="#4F46E5" />
                          <Cell fill="#E5E7EB" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">{selectedFurnisher.coverage}%</span>
                    </div>
                  </div>
                  <div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">High Coverage</Badge>
                    <p className="text-[10px] text-muted-foreground mt-1">↑ 2.1pts vs last 30 days</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <h4 className="text-xs font-semibold mb-2">Top Coverage Gaps</h4>
                <div className="space-y-1.5">
                  {coverageGaps.slice(0, 5).map((g) => (
                    <div key={g.name} className="flex items-center justify-between">
                      <span className="text-[11px] text-foreground">{g.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium">{g.gap}</span>
                        <Badge className={`text-[9px] h-4 px-1.5 border-0 ${
                          g.level === "High Impact" ? "bg-destructive/10 text-destructive" :
                          g.level === "Medium" ? "bg-amber-100 text-amber-700" :
                          "bg-muted text-muted-foreground"
                        }`}>{g.level}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="text-[10px] text-primary font-medium hover:underline mt-2">View all gaps →</button>
              </div>

              <Button className="w-full bg-primary text-primary-foreground text-xs">
                View Furnisher Profile <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}