import React from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { Building2, TrendingUp, Globe, Package, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from "recharts";

const topFurnishers = [
  { rank: 1, name: "Synchrony Bank", tradelines: "2.3M" },
  { rank: 2, name: "Capital One", tradelines: "2.2M" },
  { rank: 3, name: "American Express", tradelines: "1.5M" },
  { rank: 4, name: "Citi", tradelines: "1.5M" },
  { rank: 5, name: "Barclays", tradelines: "1.2M" },
];

const recentAlerts = [
  { title: "New furnisher onboarded", desc: "Brightway Financial Services", time: "2h ago", color: "bg-emerald-500" },
  { title: "Coverage drop detected", desc: "Regional Acceptance Corp.", time: "5h ago", color: "bg-amber-500" },
  { title: "Data quality issue", desc: "Metro 2 fields misaligned", time: "1d ago", color: "bg-destructive" },
  { title: "Bureau coverage threshold", desc: "TransUnion below 95%", time: "2d ago", color: "bg-amber-500" },
];

const productMix = [
  { name: "Credit Cards", value: 42, color: "#4F46E5" },
  { name: "Loans", value: 23, color: "#8B5CF6" },
  { name: "Auto Loans", value: 15, color: "#A78BFA" },
  { name: "Mortgages", value: 10, color: "#C4B5FD" },
  { name: "Other", value: 10, color: "#DDD6FE" },
];

const watchlistData = [
  { name: "High Priority Furnishers", items: 28 },
  { name: "Growth Opportunities", items: 16 },
  { name: "Data Quality Watch", items: 9 },
  { name: "Coverage Gaps", items: 14 },
  { name: "New Onboardings", items: 7 },
];

const tradeActivity = [
  { id: "TRD-982731", furnisher: "Synchrony Bank", product: "Credit Card", bureau: "TransUnion", date: "May 31, 2025", status: "Verified" },
  { id: "TRD-982730", furnisher: "Capital One", product: "Credit Card", bureau: "Equifax", date: "May 31, 2025", status: "Verified" },
  { id: "TRD-982729", furnisher: "American Express", product: "Charge Card", bureau: "Experian", date: "May 31, 2025", status: "Verified" },
  { id: "TRD-982728", furnisher: "Citi", product: "Personal Loan", bureau: "TransUnion", date: "May 31, 2025", status: "Pending" },
  { id: "TRD-982727", furnisher: "Barclays", product: "Credit Card", bureau: "Equifax", date: "May 31, 2025", status: "Verified" },
];

const trendData = [
  { x: 1, y: 20 }, { x: 2, y: 25 }, { x: 3, y: 22 }, { x: 4, y: 30 }, { x: 5, y: 28 }, { x: 6, y: 35 }, { x: 7, y: 40 },
];

const recentActivity = [
  { title: "New furnisher onboarded", desc: "Brightway Financial", time: "2h ago", icon: "🟢" },
  { title: "Coverage threshold alert", desc: "American Express", time: "5h ago", icon: "🟡" },
  { title: "Data quality issue resolved", desc: "Midland Credit Management", time: "1d ago", icon: "🔴" },
];

export default function Overview() {
  return (
    <div className="flex gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <PageHeader
          title="Dashboard Overview"
          subtitle="Your Data Furnishing Intelligence Command Center"
        />

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatCard label="Furnishers" value="2,847" change={12.5} icon={Building2} />
          <StatCard label="Tradelines" value="24.6M" change={11.8} icon={TrendingUp} />
          <StatCard label="Bureau Coverage" value="98.1%" change={2.4} icon={Globe} />
          <StatCard label="Products" value="7,312" change={15.1} icon={Package} />
          <StatCard label="Verified Sources" value="1,842" change={10.3} icon={ShieldCheck} />
        </div>

        {/* Heatmap + Top Furnishers */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Heatmap placeholder */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-1">Bureau Coverage Heatmap</h3>
            <p className="text-xs text-muted-foreground mb-4">Distribution of Data Furnishing by State</p>
            <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center relative overflow-hidden">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Blank_US_Map_%28states_only%29.svg/1200px-Blank_US_Map_%28states_only%29.svg.png"
                alt="US Map"
                className="w-full h-full object-contain opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-3">
                {["High", "Medium", "Low", "Minimal", "No Coverage"].map((l, i) => (
                  <div key={l} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-sm ${
                      ["bg-primary", "bg-primary/60", "bg-primary/30", "bg-primary/15", "bg-muted"][i]
                    }`} />
                    <span className="text-[10px] text-muted-foreground">{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-lg font-bold text-emerald-500">98.1%</span>
                <p className="text-[10px] text-muted-foreground">Overall Coverage</p>
              </div>
              <button className="text-xs text-primary font-medium hover:underline">View Coverage Details</button>
            </div>
          </div>

          {/* Top Furnishers */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Top Furnishers by Tradeline Volume</h3>
              <button className="text-xs text-primary font-medium hover:underline">View all</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left pb-2 font-medium">&nbsp;</th>
                  <th className="text-left pb-2 font-medium">FURNISHER</th>
                  <th className="text-right pb-2 font-medium">TRADELINES</th>
                </tr>
              </thead>
              <tbody>
                {topFurnishers.map((f) => (
                  <tr key={f.rank} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-sm text-muted-foreground w-8">{f.rank}</td>
                    <td className="py-3 text-sm font-medium text-foreground">{f.name}</td>
                    <td className="py-3 text-sm text-foreground text-right">{f.tradelines}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-3">
              View all furnishers <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Alerts + Product Mix + Watchlist */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Recent Alerts */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Recent Alerts</h3>
              <button className="text-xs text-primary font-medium hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Mix */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-1">Product Mix</h3>
            <p className="text-xs text-muted-foreground mb-3">Distribution by Category</p>
            <div className="flex items-center gap-4">
              <div className="w-28 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={productMix} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={2}>
                      {productMix.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5">
                {productMix.map((p) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-xs text-foreground">{p.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{p.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Total Products 7,312</p>
          </div>

          {/* Watchlist Snapshot */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Watchlist Snapshot</h3>
              <button className="text-xs text-primary font-medium hover:underline">View all</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-muted-foreground border-b border-border uppercase">
                  <th className="text-left pb-2 font-medium">Watchlist</th>
                  <th className="text-right pb-2 font-medium">Items</th>
                </tr>
              </thead>
              <tbody>
                {watchlistData.map((w) => (
                  <tr key={w.name} className="border-b border-border/50 last:border-0">
                    <td className="py-2 text-xs text-foreground">{w.name}</td>
                    <td className="py-2 text-xs text-foreground text-right">{w.items}</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-2 text-xs text-primary">Total Items</td>
                  <td className="py-2 text-xs text-primary text-right">74</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Trade Activity */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Trade Activity</h3>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-muted-foreground border-b border-border uppercase">
                <th className="text-left pb-2 font-medium">Trade ID</th>
                <th className="text-left pb-2 font-medium">Furnisher</th>
                <th className="text-left pb-2 font-medium">Product</th>
                <th className="text-left pb-2 font-medium">Bureau</th>
                <th className="text-left pb-2 font-medium">Reported On</th>
                <th className="text-left pb-2 font-medium">Record Status</th>
              </tr>
            </thead>
            <tbody>
              {tradeActivity.map((t) => (
                <tr key={t.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 cursor-pointer">
                  <td className="py-3 text-xs text-muted-foreground">{t.id}</td>
                  <td className="py-3 text-xs font-medium text-foreground">{t.furnisher}</td>
                  <td className="py-3 text-xs text-foreground">{t.product}</td>
                  <td className="py-3 text-xs text-foreground">{t.bureau}</td>
                  <td className="py-3 text-xs text-foreground">{t.date}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 text-xs ${
                      t.status === "Verified" ? "text-emerald-500" : "text-amber-500"
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-3 ml-auto">
            View all trade activity <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Right Insights Panel */}
      <div className="w-[260px] flex-shrink-0 space-y-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-sm font-semibold text-foreground">Insights</h3>
          </div>

          {/* Coverage Summary */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-foreground mb-1">Coverage Summary</h4>
            <p className="text-[10px] text-muted-foreground mb-3">Your bureau coverage is above industry average.</p>
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ value: 98.1 }, { value: 1.9 }]} dataKey="value" cx="50%" cy="50%" innerRadius={32} outerRadius={42} startAngle={90} endAngle={-270}>
                      <Cell fill="#4F46E5" />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground">98.1%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-1">Total Coverage</p>
            <p className="text-center text-[10px] text-emerald-500">↑ 2.4% vs last 30 days</p>
          </div>

          {/* Trend Spotlight */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-foreground mb-1">Trend Spotlight</h4>
            <p className="text-[10px] text-muted-foreground mb-2">Tradelines volumes increased 11.8% compared to Apr 1 – Apr 30, 2025.</p>
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <Area type="monotone" dataKey="y" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.1} strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Quality */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-foreground mb-1">Data Quality</h4>
            <p className="text-[10px] text-muted-foreground mb-2">Verified sources are contributing to high data reliability.</p>
            <p className="text-xl font-bold text-foreground">98.7%</p>
            <p className="text-[10px] text-muted-foreground">Verified Data</p>
            <div className="w-full h-1.5 bg-muted rounded-full mt-1.5">
              <div className="h-full bg-primary rounded-full" style={{ width: "98.7%" }} />
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-2">Recent Activity</h4>
            <div className="space-y-2.5">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-foreground">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground">{a.desc}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-1 text-[10px] text-primary font-medium hover:underline mt-2">
              View all activity <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}