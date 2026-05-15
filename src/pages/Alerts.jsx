import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Bell, AlertTriangle, Globe, ShieldCheck, CheckCircle2, Search, Filter, X, MoreVertical, Settings, ArrowRight } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
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
  Critical: "text-destructive",
  High: "text-amber-600",
  Medium: "text-amber-500",
  Low: "text-muted-foreground",
};

const statusColors = {
  New: "text-primary",
  Investigating: "text-amber-600",
  Informational: "text-muted-foreground",
  Resolved: "text-emerald-600",
};

const trendData = Array.from({ length: 30 }, (_, i) => ({ x: i, y: Math.floor(Math.random() * 30) + 10 }));

export default function Alerts() {
  const [selected, setSelected] = useState(alerts[0]);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Alerts" subtitle="Real-time monitoring of changes across the credit data ecosystem.">
          <Button variant="outline" size="sm" className="gap-1 text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60">
            <Settings className="w-3 h-3" /> Alert settings
          </Button>
        </PageHeader>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <StatCard label="New alerts" value="128" change={18.6} />
          <StatCard label="Critical signals" value="24" change={26.7} />
          <StatCard label="Coverage changes" value="37" change={12.4} />
          <StatCard label="Verification issues" value="16" change={-8.7} />
          <StatCard label="Resolved today" value="42" change={31.0} changeLabel="vs yesterday" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
            <Input placeholder="Search alerts..." className="pl-8 h-7 text-[11px] border-border/60" />
          </div>
          {["Severity", "Category", "Source type", "Status"].map((f) => (
            <Select key={f}>
              <SelectTrigger className="w-auto min-w-[80px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal">
                <SelectValue placeholder={f} />
              </SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
            </Select>
          ))}
          <Button variant="outline" size="sm" className="gap-1 text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60">
            <Filter className="w-3 h-3" /> More filters
          </Button>
          <button className="text-[11px] text-primary/70 hover:text-primary transition-colors ml-auto">Clear all</button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="bg-transparent p-0 h-auto border-b border-border/50 rounded-none w-full justify-start">
            {[["All alerts", 128], ["Needs attention", 28], ["Informational", 72], ["Resolved", 352]].map(([label, count]) => (
              <TabsTrigger
                key={label}
                value={String(label).toLowerCase().replace(" ", "_")}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-[11px] px-3 py-2"
              >
                {label} <span className="ml-1 text-muted-foreground/60 text-[10px]">{count}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border/60 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                <th className="w-10 px-3 py-2.5"><Checkbox className="w-3 h-3" /></th>
                <th className="text-left px-3 py-2.5 font-medium">Alert</th>
                <th className="text-left px-3 py-2.5 font-medium">Severity</th>
                <th className="text-left px-3 py-2.5 font-medium">Category</th>
                <th className="text-left px-3 py-2.5 font-medium">Source</th>
                <th className="text-left px-3 py-2.5 font-medium">Detected</th>
                <th className="text-left px-3 py-2.5 font-medium">Status</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a, i) => (
                <tr
                  key={i}
                  onClick={() => setSelected(a)}
                  className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${selected?.title === a.title ? "bg-primary/5" : ""}`}
                >
                  <td className="px-3 py-2.5"><Checkbox className="w-3 h-3" checked={a.checked} /></td>
                  <td className="px-3 py-2.5">
                    <p className="text-[11px] font-normal text-foreground">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground/60">{a.desc}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge className={`${severityColors[a.severity]} text-[9.5px] px-1.5 h-4`}>{a.severity}</Badge>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-foreground/70">{a.category}</td>
                  <td className="px-3 py-2.5 text-[11px] text-foreground/70">{a.source}</td>
                  <td className="px-3 py-2.5 text-[10px] text-muted-foreground/60">{a.detected}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant="outline" className={`${statusColors[a.status]} text-[9.5px] px-1.5 h-4`}>{a.status}</Badge>
                  </td>
                  <td className="px-2"><MoreVertical className="w-3 h-3 text-muted-foreground/30" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50">
            <span className="text-[10px] text-muted-foreground/60">Showing 1–10 of 128 alerts</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, "...", 13].map((p, i) => (
                <button key={i} className={`w-6 h-6 text-[10px] rounded flex items-center justify-center ${p === 1 ? "bg-primary text-white" : "text-muted-foreground/60 hover:bg-muted"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-[260px] flex-shrink-0">
          <div className="bg-card rounded-lg border border-border/60 p-4 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
                <h3 className="text-[11.5px] font-medium text-foreground truncate">{selected.title}</h3>
              </div>
              <button onClick={() => setSelected(null)}><X className="w-3.5 h-3.5 text-muted-foreground/50" /></button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`${severityColors[selected.severity]} text-[9.5px]`}>{selected.severity}</Badge>
              <span className="text-[10px] text-muted-foreground/60">ALT-2025-051231</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 mb-4 border-b border-border/50">
              {["Overview", "Activity", "Related"].map((t, i) => (
                <button key={t} className={`text-[10.5px] px-2.5 py-1.5 border-b-2 transition-colors ${i === 0 ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground/60 hover:text-foreground"}`}>{t}</button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Alert summary</h4>
                <p className="text-[10.5px] text-muted-foreground/80 leading-relaxed">{selected.desc} has been onboarded as a new furnisher and is now reporting data to TransUnion and Equifax.</p>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                {[["Detected", "May 31, 2025 10:15 AM"], ["Source type", selected.source], ["Category", selected.category], ["Status", selected.status], ["Impact", "High"]].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[9.5px] text-muted-foreground/60">{k}</p>
                    <p className="text-[10.5px] font-medium text-foreground">{v}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-2">Affected furnisher</h4>
                <div className="flex items-center gap-2">
                  <FurnisherLogo domain="brightwayfinancial.com" name={selected.desc} size="sm" />
                  <div>
                    <p className="text-[11px] font-normal text-foreground">{selected.desc}</p>
                    <p className="text-[10px] text-muted-foreground/60">brightwayfinancial.com</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 mt-2">
                  {[["Furnisher ID", "FURN-009876"], ["Reporting since", "May 30, 2025"], ["Employees", "250–999"], ["Headquarters", "Denver, CO"]].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[9.5px] text-muted-foreground/60">{k}</p>
                      <p className="text-[10.5px] font-medium text-foreground">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Alert trend (30 days)</h4>
                <p className="text-[10px] text-emerald-500 mb-1.5">↑ 18.6% vs prior 30 days</p>
                <div className="h-14">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <Area type="monotone" dataKey="y" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.1} strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Recommended action</h4>
                <p className="text-[10px] text-muted-foreground/70 mb-2">Review furnisher profile and verify data quality before including in monitoring.</p>
                <button className="w-full border border-border/60 text-[11px] font-normal h-7 rounded-md flex items-center justify-center gap-1.5 hover:bg-muted/30 transition-colors text-foreground/80">
                  Review furnisher profile <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}