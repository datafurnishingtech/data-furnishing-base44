import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Search, Filter, X, Settings } from "lucide-react";
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
  Critical: "bg-destructive text-white", High: "bg-amber-500 text-white",
  Medium: "bg-amber-400 text-white", Low: "bg-muted text-muted-foreground",
};

const statusColors = {
  New: "bg-primary/10 text-primary", Investigating: "bg-amber-100 text-amber-700",
  Informational: "bg-muted text-muted-foreground", Resolved: "bg-emerald-100 text-emerald-700",
};

const trendData = Array.from({ length: 30 }, (_, i) => ({ x: i, y: Math.floor(Math.random() * 30) + 10 }));

export default function Alerts() {
  const [selected, setSelected] = useState(alerts[0]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Alerts" subtitle="Monitor and respond to data furnishing events">
        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5"><Settings className="w-3 h-3" /> Alert settings</Button>
      </PageHeader>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 pb-0">
        <StatCard label="Total Alerts" value="128" change={18.6} />
        <StatCard label="Critical" value="12" />
        <StatCard label="High" value="34" />
        <StatCard label="Resolved" value="352" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-border">
            {["Severity", "Category", "Source type", "Status"].map((f) => (
              <Select key={f}>
                <SelectTrigger className="h-7 text-[11px] w-28 border-border/60"><SelectValue placeholder={f} /></SelectTrigger>
                <SelectContent><SelectItem value="all" className="text-[11px]">All</SelectItem></SelectContent>
              </Select>
            ))}
            <Button variant="ghost" size="sm" className="h-7 text-[11px] text-muted-foreground/60 gap-1"><X className="w-3 h-3" /> Clear all</Button>
          </div>
          <Tabs defaultValue="all" className="px-4 pt-2">
            <TabsList className="h-7">
              {[["All alerts", 128], ["Needs attention", 28], ["Informational", 72], ["Resolved", 352]].map(([label, count]) => (
                <TabsTrigger key={label} value={label.toLowerCase()} className="text-[10px] h-6 gap-1">
                  {label} <span className="bg-muted text-muted-foreground px-1 py-0.5 rounded text-[9px]">{count}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <table className="w-full text-[10.5px] mt-2">
            <thead>
              <tr className="border-b border-border text-muted-foreground/60">
                <th className="px-4 py-2 w-8" />
                <th className="text-left px-3 py-2 font-medium">Alert</th>
                <th className="text-left px-3 py-2 font-medium">Severity</th>
                <th className="text-left px-3 py-2 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-3 py-2 font-medium hidden lg:table-cell">Source</th>
                <th className="text-left px-3 py-2 font-medium">Detected</th>
                <th className="text-left px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a, i) => (
                <tr key={i} onClick={() => setSelected(a)} className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${selected?.title === a.title ? "bg-primary/5" : ""}`}>
                  <td className="px-4 py-2"><Checkbox checked={a.checked} /></td>
                  <td className="px-3 py-2"><div className="font-medium">{a.title}</div><div className="text-muted-foreground/60">{a.desc}</div></td>
                  <td className="px-3 py-2"><span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${severityColors[a.severity]}`}>{a.severity}</span></td>
                  <td className="px-3 py-2 text-muted-foreground hidden md:table-cell">{a.category}</td>
                  <td className="px-3 py-2 text-muted-foreground hidden lg:table-cell">{a.source}</td>
                  <td className="px-3 py-2 text-muted-foreground/60">{a.detected}</td>
                  <td className="px-3 py-2"><span className={`text-[9px] px-1.5 py-0.5 rounded border ${statusColors[a.status]}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="w-72 border-l border-border overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-[11px] font-semibold truncate">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground/40 hover:text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="p-4 space-y-3 text-[10.5px]">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${severityColors[selected.severity]}`}>{selected.severity}</span>
                <span className="text-muted-foreground/60 text-[9px]">ALT-2025-051231</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{selected.desc} has been detected in the system.</p>
              <div className="space-y-1.5">
                {[["Detected", "May 31, 2025 10:15 AM"], ["Source type", selected.source], ["Category", selected.category], ["Status", selected.status]].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-muted-foreground/60">{k}</span><span>{v}</span></div>
                ))}
              </div>
              <div>
                <h4 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wide mb-1.5">Alert trend (30 days)</h4>
                <ResponsiveContainer width="100%" height={50}>
                  <AreaChart data={trendData}>
                    <Area type="monotone" dataKey="y" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.15} strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wide mb-1.5">Recommended action</h4>
                <p className="text-muted-foreground text-[10px]">Review furnisher profile and verify data quality before including in monitoring.</p>
                <Button size="sm" variant="outline" className="w-full h-7 text-[10px] mt-2">Review furnisher profile</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}