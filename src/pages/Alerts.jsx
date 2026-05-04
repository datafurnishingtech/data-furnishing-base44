import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Bell, AlertTriangle, Globe, ShieldCheck, CheckCircle2, Search, Filter, X, MoreVertical, Settings, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const alerts = [
  { title: "New furnisher onboarded", desc: "Brightway Financial Services", severity: "Critical", category: "New Furnisher", source: "Furnisher", detected: "2h ago", status: "New", checked: true },
  { title: "Data quality issue detected", desc: "Metro 2 fields misaligned", severity: "High", category: "Data Quality", source: "Trade Data", detected: "3h ago", status: "New" },
  { title: "Bureau coverage change", desc: "Regional Acceptance Corp.", severity: "Medium", category: "Coverage Change", source: "Bureau", detected: "4h ago", status: "New" },
  { title: "Product added", desc: "Chase Freedom Flex", severity: "Low", category: "Product Added", source: "Product", detected: "5h ago", status: "New" },
  { title: "Verification issue detected", desc: "Capital One", severity: "High", category: "Verification Issue", source: "Furnisher", detected: "6h ago", status: "Investigating" },
  { title: "Watchlist trigger", desc: "Synchrony Bank", severity: "Critical", category: "Watchlist Trigger", source: "Watchlist", detected: "8h ago", status: "New" },
  { title: "Coverage improvement", desc: "TransUnion", severity: "Medium", category: "Coverage Change", source: "Bureau", detected: "9h ago", status: "New" },
  { title: "Data source offline", desc: "Experian Secure Data", severity: "High", category: "Source Issue", source: "Data Source", detected: "10h ago", status: "Investigating" },
  { title: "Product removed", desc: "Barclays Arrival Plus", severity: "Low", category: "Product Removed", source: "Product", detected: "12h ago", status: "Informational" },
  { title: "Verification passed", desc: "American Express", severity: "Low", category: "Verification Issue", source: "Furnisher", detected: "14h ago", status: "Resolved" },
];

const severityColors = {
  Critical: "bg-destructive text-white",
  High: "bg-amber-500 text-white",
  Medium: "bg-amber-400 text-white",
  Low: "bg-muted text-muted-foreground",
};

const statusColors = {
  New: "bg-primary/10 text-primary border-primary/20",
  Investigating: "bg-amber-100 text-amber-700 border-amber-200",
  Informational: "bg-muted text-muted-foreground border-border",
  Resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const trendData = Array.from({ length: 30 }, (_, i) => ({
  x: i, y: Math.floor(Math.random() * 30) + 10,
}));

export default function Alerts() {
  const [selected, setSelected] = useState(alerts[0]);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Alerts" subtitle="Real-time monitoring of changes across the credit data ecosystem.">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Settings className="w-3 h-3" /> Alert Settings
          </Button>
        </PageHeader>

        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatCard label="New Alerts" value="128" change={18.6} icon={Bell} />
          <StatCard label="Critical Signals" value="24" change={26.7} icon={AlertTriangle} />
          <StatCard label="Coverage Changes" value="37" change={12.4} icon={Globe} />
          <StatCard label="Verification Issues" value="16" change={-8.7} icon={ShieldCheck} />
          <StatCard label="Resolved Today" value="42" change={31.0} changeLabel="vs yesterday" icon={CheckCircle2} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search alerts..." className="pl-9 h-8 text-xs" />
          </div>
          {["Severity", "Category", "Source Type", "Status"].map((f) => (
            <Select key={f}>
              <SelectTrigger className="w-auto min-w-[80px] h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
            </Select>
          ))}
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Filter className="w-3 h-3" /> More Filters
          </Button>
          <button className="text-xs text-primary font-medium hover:underline ml-auto">Clear all</button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="bg-transparent p-0 h-auto border-b border-border rounded-none w-full justify-start">
            {[["All Alerts", 128], ["Needs Attention", 28], ["Informational", 72], ["Resolved", 352]].map(([label, count]) => (
              <TabsTrigger
                key={label}
                value={label.toLowerCase().replace(" ", "_")}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-xs px-4 py-2"
              >
                {label} <span className="ml-1.5 text-muted-foreground">{count}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 text-[10px] text-muted-foreground uppercase border-b border-border">
                <th className="w-10 px-3 py-2"><Checkbox className="w-3.5 h-3.5" /></th>
                <th className="text-left px-3 py-2 font-medium">Alert</th>
                <th className="text-left px-3 py-2 font-medium">Severity</th>
                <th className="text-left px-3 py-2 font-medium">Category</th>
                <th className="text-left px-3 py-2 font-medium">Source</th>
                <th className="text-left px-3 py-2 font-medium">Detected</th>
                <th className="text-left px-3 py-2 font-medium">Status</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a, i) => (
                <tr
                  key={i}
                  onClick={() => setSelected(a)}
                  className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer ${
                    selected?.title === a.title ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-3 py-3"><Checkbox className="w-3.5 h-3.5" checked={a.checked} /></td>
                  <td className="px-3 py-3">
                    <p className="text-xs font-medium text-foreground">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground">{a.desc}</p>
                  </td>
                  <td className="px-3 py-3">
                    <Badge className={`${severityColors[a.severity]} border-0 text-[10px] px-2 h-5`}>{a.severity}</Badge>
                  </td>
                  <td className="px-3 py-3 text-xs text-foreground">{a.category}</td>
                  <td className="px-3 py-3 text-xs text-foreground">{a.source}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{a.detected}</td>
                  <td className="px-3 py-3">
                    <Badge variant="outline" className={`${statusColors[a.status]} text-[10px] px-2 h-5`}>{a.status}</Badge>
                  </td>
                  <td className="px-2"><MoreVertical className="w-3.5 h-3.5 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Showing 1 to 10 of 128 alerts</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, "...", 13].map((p, i) => (
                <button key={i} className={`w-7 h-7 text-xs rounded flex items-center justify-center ${p === 1 ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-[280px] flex-shrink-0">
          <div className="bg-card rounded-xl border border-border p-5 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">{selected.title}</h3>
              <button onClick={() => setSelected(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`${severityColors[selected.severity]} border-0 text-[10px]`}>{selected.severity}</Badge>
              <span className="text-[10px] text-muted-foreground">Alert ID: ALT-2025-051231</span>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="w-full h-7 bg-muted/50">
                {["Overview", "Activity", "Related Alerts"].map((t) => (
                  <TabsTrigger key={t} value={t.toLowerCase().replace(" ", "_")} className="text-[10px] h-5">{t}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="mt-4 space-y-3">
              <div>
                <h4 className="text-xs font-semibold mb-1">Alert Summary</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {selected.desc} has been onboarded as a new furnisher and is now reporting data to TransUnion and Equifax.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div><span className="text-muted-foreground">Detected</span><p className="font-medium">May 31, 2025 at 10:15 AM</p></div>
                <div><span className="text-muted-foreground">Source Type</span><p className="font-medium">{selected.source}</p></div>
                <div><span className="text-muted-foreground">Category</span><p className="font-medium">{selected.category}</p></div>
                <div><span className="text-muted-foreground">Status</span><p className="font-medium">{selected.status}</p></div>
                <div><span className="text-muted-foreground">Impact</span><p className="font-medium text-destructive">● High</p></div>
              </div>

              <div className="pt-3 border-t border-border">
                <h4 className="text-xs font-semibold mb-2">Affected Furnisher</h4>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">BF</div>
                  <div>
                    <p className="text-xs font-medium">{selected.desc}</p>
                    <p className="text-[10px] text-muted-foreground">brightwayfinancial.com</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
                  <div><span className="text-muted-foreground">Furnisher ID</span><p className="font-medium">FURN-009876</p></div>
                  <div><span className="text-muted-foreground">Reporting Since</span><p className="font-medium">May 30, 2025</p></div>
                  <div><span className="text-muted-foreground">Employees</span><p className="font-medium">250-999</p></div>
                  <div><span className="text-muted-foreground">Headquarters</span><p className="font-medium">Denver, CO</p></div>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <h4 className="text-xs font-semibold mb-2">Alert Trend (Last 30 Days)</h4>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[10px] text-emerald-500">↑ 18.6%</span>
                  <span className="text-[10px] text-muted-foreground">vs prior 30 days</span>
                </div>
                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <Area type="monotone" dataKey="y" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.1} strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <h4 className="text-xs font-semibold mb-1">Recommended Action</h4>
                <p className="text-[10px] text-muted-foreground mb-2">Review furnisher profile and verify data quality before including in monitoring and reporting.</p>
                <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                  Review Furnisher Profile <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}