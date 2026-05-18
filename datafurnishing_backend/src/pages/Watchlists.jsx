import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Star, MoreVertical, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const watchlists = [
  { name: "High Priority Furnishers", desc: "Top-tier furnishers critical to our coverage", type: "Furnisher", items: 24, changes: 6, changePct: "25.0%", risk: "High", lastUpdated: "May 31, 2025", updatedAgo: "2h ago", owner: "Alex Kim", starred: true },
  { name: "Product Opportunities", desc: "High-impact products to add or expand", type: "Product", items: 38, changes: 9, changePct: "31.0%", risk: "Medium", lastUpdated: "May 31, 2025", updatedAgo: "4h ago", owner: "Alex Kim" },
  { name: "Coverage Gaps", desc: "Products and markets with low coverage", type: "Coverage", items: 31, changes: 12, changePct: "38.7%", risk: "High", lastUpdated: "May 31, 2025", updatedAgo: "1h ago", owner: "Jamie Lee" },
  { name: "Verification Watch", desc: "Entities with failed or expiring verification", type: "Furnisher", items: 16, changes: 4, changePct: "33.3%", risk: "Medium", lastUpdated: "May 31, 2025", updatedAgo: "3h ago", owner: "Alex Kim" },
  { name: "Competitive Tracking", desc: "Monitor competitor activity and expansion", type: "Competitive", items: 17, changes: 7, changePct: "53.8%", risk: "Low", lastUpdated: "May 31, 2025", updatedAgo: "5h ago", owner: "Taylor Morgan" },
];

const riskColors = { High: "bg-destructive/10 text-destructive", Medium: "bg-amber-500/10 text-amber-600", Low: "bg-emerald-500/10 text-emerald-600" };
const typeColors = { Furnisher: "bg-primary/10 text-primary", Product: "bg-emerald-500/10 text-emerald-600", Coverage: "bg-amber-500/10 text-amber-600", Competitive: "bg-purple-500/10 text-purple-700" };

const recentChanges = [
  { furnisher: "Synchrony Bank", change: "Coverage improved to 98%", time: "2h ago" },
  { furnisher: "Wells Fargo", change: "Verification expired", time: "4h ago" },
  { furnisher: "Discover Financial", change: "New product detected", time: "8h ago" },
  { furnisher: "Capital One", change: "Coverage improved to 95%", time: "8h ago" },
  { furnisher: "Citibank (Retail)", change: "Coverage declined to 72%", time: "1d ago" },
];

const trendData = Array.from({ length: 14 }, (_, i) => ({ x: i, y: 80 + Math.random() * 15 }));

export default function Watchlists() {
  const [selected, setSelected] = useState(watchlists[0]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Watchlists" subtitle="Track and monitor key furnishers, products, and coverage">
        <Button size="sm" className="h-7 text-[11px] gap-1.5"><Plus className="w-3 h-3" /> New watchlist</Button>
      </PageHeader>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 pb-0">
        <StatCard label="Total Watchlists" value="18" change={12.5} />
        <StatCard label="Total Items" value="126" change={8.2} />
        <StatCard label="High Risk Items" value="23" />
        <StatCard label="Recent Changes" value="38" change={15.0} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="All watchlists" className="px-4 pt-3">
            <TabsList className="h-7">
              {["All watchlists", "Furnishers", "Products", "Coverage", "Competitive"].map((t) => (
                <TabsTrigger key={t} value={t} className="text-[10px] h-6">{t}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <table className="w-full text-[10.5px] mt-2">
            <thead>
              <tr className="border-b border-border text-muted-foreground/60">
                <th className="px-4 py-2 w-8" />
                <th className="text-left px-3 py-2 font-medium">Watchlist</th>
                <th className="text-left px-3 py-2 font-medium hidden md:table-cell">Type</th>
                <th className="text-left px-3 py-2 font-medium">Items</th>
                <th className="text-left px-3 py-2 font-medium hidden sm:table-cell">Changes (30d)</th>
                <th className="text-left px-3 py-2 font-medium">Risk</th>
                <th className="text-left px-3 py-2 font-medium hidden lg:table-cell">Last updated</th>
                <th className="text-left px-3 py-2 font-medium hidden xl:table-cell">Owner</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {watchlists.map((w) => (
                <tr key={w.name} onClick={() => setSelected(w)} className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${selected?.name === w.name ? "bg-primary/5" : ""}`}>
                  <td className="px-4 py-2"><Star className={`w-3 h-3 ${w.starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} /></td>
                  <td className="px-3 py-2"><div className="font-medium">{w.name}</div><div className="text-muted-foreground/60">{w.desc}</div></td>
                  <td className="px-3 py-2 hidden md:table-cell"><span className={`text-[9px] px-1.5 py-0.5 rounded ${typeColors[w.type]}`}>{w.type}</span></td>
                  <td className="px-3 py-2 font-semibold">{w.items}</td>
                  <td className="px-3 py-2 text-muted-foreground hidden sm:table-cell">↑ {w.changes} ({w.changePct})</td>
                  <td className="px-3 py-2"><span className={`text-[9px] px-1.5 py-0.5 rounded ${riskColors[w.risk]}`}>{w.risk}</span></td>
                  <td className="px-3 py-2 text-muted-foreground hidden lg:table-cell"><div>{w.lastUpdated}</div><div className="text-muted-foreground/50">{w.updatedAgo}</div></td>
                  <td className="px-3 py-2 text-muted-foreground hidden xl:table-cell">{w.owner}</td>
                  <td className="px-3 py-2"><MoreVertical className="w-3 h-3 text-muted-foreground/30" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="w-72 border-l border-border overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-[11px] font-semibold truncate">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground/40 hover:text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="p-4 space-y-3 text-[10.5px]">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${typeColors[selected.type]}`}>{selected.type} watchlist</span>
                <span className="text-muted-foreground/60">{selected.items} items · {selected.updatedAgo}</span>
              </div>
              <div className="space-y-1.5">
                {[["Coverage impact", "94%"], ["Verification rate", "92%"], ["Avg. risk score", "72"], ["Movement count", "6"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-muted-foreground/60">{k}</span><span className="font-semibold">{v}</span></div>
                ))}
              </div>
              <div>
                <h4 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wide mb-2">Trend</h4>
                <ResponsiveContainer width="100%" height={50}>
                  <AreaChart data={trendData}>
                    <Area type="monotone" dataKey="y" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.15} strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wide mb-1.5">Recent changes</h4>
                {recentChanges.map((c) => (
                  <div key={c.furnisher} className="py-1.5 border-b border-border/20 last:border-0">
                    <div className="font-medium">{c.furnisher} · <span className="font-normal text-muted-foreground">{c.change}</span></div>
                    <div className="text-muted-foreground/50 text-[9px] mt-0.5">{c.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}