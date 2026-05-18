import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { FileText, MoreVertical, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
];

const initBgColors = ["bg-primary", "bg-emerald-600", "bg-amber-600", "bg-purple-600"];

export default function Reports() {
  const [selected, setSelected] = useState(reports[0]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Reports" subtitle="Scheduled reports and export history" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 pb-0">
        <StatCard label="Total Reports" value="456" change={8.3} />
        <StatCard label="Scheduled" value="12" />
        <StatCard label="Failed" value="3" />
        <StatCard label="This Month" value="38" change={5.2} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Recent Reports */}
          <div className="bg-card rounded-lg border border-border">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="text-[12px] font-semibold">Recent reports</h3>
              <div className="flex gap-2">
                {["All types", "All owners", "All statuses"].map((f) => (
                  <Select key={f}><SelectTrigger className="h-7 text-[10px] w-24 border-border/60"><SelectValue placeholder={f} /></SelectTrigger>
                    <SelectContent><SelectItem value="all" className="text-[10px]">{f}</SelectItem></SelectContent>
                  </Select>
                ))}
              </div>
            </div>
            <table className="w-full text-[10.5px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground/60">
                  <th className="text-left px-4 py-2 font-medium">Report name</th>
                  <th className="text-left px-3 py-2 font-medium hidden md:table-cell">Type</th>
                  <th className="text-left px-3 py-2 font-medium hidden lg:table-cell">Owner</th>
                  <th className="text-left px-3 py-2 font-medium">Last run</th>
                  <th className="text-left px-3 py-2 font-medium hidden sm:table-cell">Schedule</th>
                  <th className="text-left px-3 py-2 font-medium">Status</th>
                  <th className="text-left px-3 py-2 font-medium">Format</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, idx) => (
                  <tr key={idx} onClick={() => setSelected(r)} className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${selected?.name === r.name ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-2 font-medium">{r.name}</td>
                    <td className="px-3 py-2 text-muted-foreground hidden md:table-cell">{r.type}</td>
                    <td className="px-3 py-2 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full ${initBgColors[idx % initBgColors.length]} flex items-center justify-center text-[8px] font-bold text-white`}>{r.initials}</div>
                        <span>{r.owner}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{r.lastRun}</td>
                    <td className="px-3 py-2 text-muted-foreground hidden sm:table-cell">{r.schedule}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {r.status === "Completed" ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-destructive" />}
                        <span className={r.status === "Completed" ? "text-emerald-600" : "text-destructive"}>{r.status}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{r.format}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Templates */}
          <div>
            <h3 className="text-[12px] font-semibold mb-3">Report templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templates.map((t) => (
                <div key={t.name} className="bg-card rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between mb-1.5">
                    <h4 className="text-[11px] font-semibold">{t.name}</h4>
                    <span className="text-[9px] text-muted-foreground/60">{t.frequency}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2">{t.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-[9px] text-muted-foreground/60">
                      <span>{t.metrics} metrics</span>
                      <span>{t.pages} pages</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-6 text-[10px]">Use template</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selected && (
          <div className="w-72 border-l border-border overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-[11px] font-semibold truncate">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground/40 hover:text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="p-4 space-y-3 text-[10.5px]">
              <p className="text-muted-foreground">Comprehensive analysis report.</p>
              <div className="space-y-1.5">
                {[["Total furnishers", "2,847"], ["Verified furnishers", "1,842 (64.7%)"], ["Bureau coverage", "98.1%"], ["Products", "7,312"], ["Active tradelines", "24.6M"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-muted-foreground/60">{k}</span><span className="font-medium">{v}</span></div>
                ))}
              </div>
              <div>
                <h4 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wide mb-1.5">Included sections</h4>
                {["Executive summary", "Furnisher coverage analysis", "Bureau coverage map", "Product breakdown", "Tradeline trends", "Data quality overview"].map((s) => (
                  <div key={s} className="flex items-center gap-1.5 py-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="text-[10px]">{s}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-1.5">
                {[["Last run", selected.lastRun], ["Schedule", selected.schedule], ["Status", selected.status]].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-muted-foreground/60">{k}</span><span>{v}</span></div>
                ))}
              </div>
              <Button size="sm" className="w-full h-7 text-[10px]">Generate report</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}