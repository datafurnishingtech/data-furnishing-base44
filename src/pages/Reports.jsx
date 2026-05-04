import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { FileText, Clock, Share2, Layout, TrendingUp, Search, Filter, MoreVertical, X, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const reports = [
  { name: "Furnisher Coverage Summary – May 2025", type: "Coverage", owner: "Alex Kim", initials: "AK", lastRun: "May 31, 2025 8:32 AM", schedule: "Monthly", status: "Completed", format: "PDF" },
  { name: "Tradeline Intelligence Snapshot", type: "Tradelines", owner: "Jamie Moore", initials: "JM", lastRun: "May 31, 2025 7:15 AM", schedule: "Weekly", status: "Completed", format: "PDF" },
  { name: "Product Graph Export – Q2 2025", type: "Product Graph", owner: "Sarah Chen", initials: "SC", lastRun: "May 30, 2025 5:42 PM", schedule: "Quarterly", status: "Completed", format: "CSV" },
  { name: "Market Opportunity Report", type: "Market", owner: "Alex Kim", initials: "AK", lastRun: "May 30, 2025 2:11 PM", schedule: "Monthly", status: "Completed", format: "PDF" },
  { name: "Data Quality Audit – May 2025", type: "Data Quality", owner: "Daniel Wu", initials: "DW", lastRun: "May 30, 2025 9:08 AM", schedule: "Monthly", status: "Completed", format: "XLSX" },
  { name: "High Impact Tradelines", type: "Tradelines", owner: "Sarah Chen", initials: "SC", lastRun: "May 29, 2025 3:05 PM", schedule: "Weekly", status: "Failed", format: "PDF" },
  { name: "Bureau Coverage Benchmark", type: "Coverage", owner: "Jamie Moore", initials: "JM", lastRun: "May 29, 2025 11:47 AM", schedule: "Monthly", status: "Completed", format: "PDF" },
  { name: "New Furnishers Trend Report", type: "Furnishers", owner: "Alex Kim", initials: "AK", lastRun: "May 28, 2025 4:22 PM", schedule: "Monthly", status: "Completed", format: "PDF" },
];

const templates = [
  { name: "Furnisher Coverage Summary", desc: "Comprehensive coverage analysis across bureaus and data sources.", metrics: 12, pages: 8, frequency: "Monthly" },
  { name: "Tradeline Intelligence Snapshot", desc: "High impact tradelines, verification status, and performance trends.", metrics: 18, pages: 15, frequency: "Weekly" },
  { name: "Product Graph Export", desc: "Ecosystem relationships, product connections, and bureau mapping.", metrics: 24, pages: 10, frequency: "Quarterly" },
  { name: "Market Opportunity Report", desc: "Identify white space, untapped markets, and growth opportunities.", metrics: 16, pages: 14, frequency: "Monthly" },
  { name: "Data Quality Audit", desc: "Data reliability, issues, trends, and quality improvement.", metrics: 14, pages: 12, frequency: "Monthly" },
];

const initColors = ["bg-primary", "bg-emerald-600", "bg-amber-600", "bg-purple-600"];

export default function Reports() {
  const [selected, setSelected] = useState(reports[0]);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Reports" subtitle="Export structured credit ecosystem intelligence and automate recurring insights." />

        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatCard label="Generated Reports" value="456" change={18.6} icon={FileText} />
          <StatCard label="Scheduled Reports" value="38" change={11.4} icon={Clock} />
          <StatCard label="Shared Reports" value="124" change={22.1} icon={Share2} />
          <StatCard label="Custom Templates" value="19" change={5.6} icon={Layout} />
          <StatCard label="Export Activity" value="9.2K" change={16.3} icon={TrendingUp} />
        </div>

        {/* Recent Reports */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Recent Reports</h3>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">Export</Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search reports by name or owner..." className="pl-9 h-8 text-xs" />
              </div>
              {["All Types", "All Owners", "All Statuses"].map((f) => (
                <Select key={f}><SelectTrigger className="w-auto min-w-[100px] h-8 text-xs"><SelectValue placeholder={f} /></SelectTrigger><SelectContent><SelectItem value="all">{f}</SelectItem></SelectContent></Select>
              ))}
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8"><Filter className="w-3 h-3" /> Filters</Button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 text-[10px] text-muted-foreground uppercase border-b border-border">
                <th className="text-left px-4 py-2 font-medium">Report Name</th>
                <th className="text-left px-3 py-2 font-medium">Type</th>
                <th className="text-left px-3 py-2 font-medium">Owner</th>
                <th className="text-left px-3 py-2 font-medium">Last Run</th>
                <th className="text-left px-3 py-2 font-medium">Schedule</th>
                <th className="text-left px-3 py-2 font-medium">Status</th>
                <th className="text-left px-3 py-2 font-medium">Format</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr
                  key={r.name}
                  onClick={() => setSelected(r)}
                  className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer ${selected?.name === r.name ? "bg-primary/5" : ""}`}
                >
                  <td className="px-4 py-3 text-xs font-medium">{r.name}</td>
                  <td className="px-3 py-3 text-xs">{r.type}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-full ${initColors[reports.indexOf(r) % initColors.length]} flex items-center justify-center text-[8px] font-bold text-white`}>{r.initials}</div>
                      <span className="text-xs">{r.owner}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{r.lastRun}</td>
                  <td className="px-3 py-3 text-xs">{r.schedule}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs ${r.status === "Completed" ? "text-emerald-500" : "text-destructive"}`}>
                      {r.status === "Completed" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-3"><Badge variant="outline" className="text-[10px] h-5">{r.format}</Badge></td>
                  <td className="px-2"><MoreVertical className="w-3.5 h-3.5 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Showing 1 to 8 of 456 reports</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, "...", 57].map((p, i) => (
                <button key={i} className={`w-7 h-7 text-xs rounded flex items-center justify-center ${p === 1 ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Templates */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Report Templates</h3>
              <p className="text-xs text-muted-foreground">Start from a template to quickly generate insights.</p>
            </div>
            <button className="text-xs text-primary font-medium hover:underline">View all templates →</button>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {templates.map((t) => (
              <div key={t.name} className="border border-border rounded-lg p-3 hover:border-primary/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold mb-1">{t.name}</h4>
                <p className="text-[10px] text-muted-foreground mb-3 line-clamp-2">{t.desc}</p>
                <div className="flex gap-3 text-[10px] text-muted-foreground mb-3">
                  <span>{t.metrics} Metrics</span>
                  <span>{t.pages} Pages</span>
                  <span>{t.frequency}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full text-[10px] h-7">Use Template</Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      {selected && (
        <div className="w-[280px] flex-shrink-0">
          <div className="bg-card rounded-xl border border-border p-5 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-semibold">{selected.name}</h3>
              </div>
              <button onClick={() => setSelected(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>

            <div className="flex gap-1 mb-4 border-b border-border">
              {["Overview", "Schedule", "History", "Sharing"].map((t, i) => (
                <button key={t} className={`text-[10px] px-2.5 py-2 font-medium border-b-2 ${i === 0 ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>{t}</button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold mb-1">Report Summary</h4>
                <p className="text-[10px] text-muted-foreground">Comprehensive coverage analysis across furnishers, products, and bureaus.</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {[["Total Furnishers", "2,847"], ["Verified Furnishers", "1,842 (64.7%)"], ["Bureau Coverage", "98.1%"], ["Products", "7,312"], ["Active Tradelines", "24.6M"], ["Data Sources", "5"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>
                ))}
              </div>

              <div className="pt-3 border-t border-border">
                <h4 className="text-xs font-semibold mb-2">Included Sections</h4>
                {["Executive Summary", "Furnisher Coverage Analysis", "Bureau Coverage Map", "Product Coverage Breakdown", "Tradeline Volume Trends", "Data Quality Overview", "Key Insights & Recommendations"].map((s) => (
                  <div key={s} className="flex items-center gap-1.5 py-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px]">{s}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border">
                <h4 className="text-xs font-semibold mb-2">Recipients (6)</h4>
                {[["Alex Kim", "alex.kim@finintel.com", "Owner"], ["Jamie Moore", "jamie.moore@finintel.com", "Viewer"], ["Sarah Chen", "sarah.chen@finintel.com", "Viewer"]].map(([name, email, role]) => (
                  <div key={name} className="flex items-center gap-2 py-1">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-white">
                      {name.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium">{name}</p>
                      <p className="text-[9px] text-muted-foreground">{email}</p>
                    </div>
                    <span className="text-[9px] text-muted-foreground">{role}</span>
                  </div>
                ))}
                <p className="text-[10px] text-primary">+3 more recipients</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] pt-3 border-t border-border">
                <div><span className="text-muted-foreground">Last Run</span><p className="font-medium">{selected.lastRun}</p></div>
                <div><span className="text-muted-foreground">Next Run</span><p className="font-medium">Jun 30, 2025 9:00 AM</p></div>
                <div><span className="text-muted-foreground">Status</span><p className="text-emerald-500 font-medium">● Completed</p></div>
              </div>

              <Button className="w-full bg-primary text-primary-foreground text-xs">Generate Report</Button>
              <Button variant="outline" className="w-full text-xs">Open Report Builder</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}