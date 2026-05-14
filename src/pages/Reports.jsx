import React, { useState } from "react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import TablePagination from "@/components/shared/TablePagination";
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(reports.length / pageSize);
  const paginated = reports.slice((page - 1) * pageSize, page * pageSize);

  function handlePageSizeChange(size) {
    setPageSize(size);
    setPage(1);
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PageHeader title="Reports" subtitle="Export structured credit ecosystem intelligence and automate recurring insights." />

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <StatCard label="Generated reports" value="456" change={18.6} />
          <StatCard label="Scheduled reports" value="38" change={11.4} />
          <StatCard label="Shared reports" value="124" change={22.1} />
          <StatCard label="Custom templates" value="19" change={5.6} />
          <StatCard label="Export activity" value="9.2K" change={16.3} />
        </div>

        {/* Recent Reports */}
        <div className="bg-card rounded-lg border border-border/60 overflow-hidden mb-5">
          <div className="px-4 py-3 border-b border-border/50">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[11.5px] font-medium text-foreground">Recent reports</h3>
              <Button variant="outline" size="sm" className="text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60">Export</Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                <Input placeholder="Search reports by name or owner..." className="pl-8 h-7 text-[11px] border-border/60" />
              </div>
              {["All types", "All owners", "All statuses"].map((f) => (
                <Select key={f}><SelectTrigger className="w-auto min-w-[90px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal"><SelectValue placeholder={f} /></SelectTrigger><SelectContent><SelectItem value="all">{f}</SelectItem></SelectContent></Select>
              ))}
              <Button variant="outline" size="sm" className="gap-1 text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60"><Filter className="w-3 h-3" /> Filters</Button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                <th className="text-left px-4 py-2.5 font-medium">Report name</th>
                <th className="text-left px-3 py-2.5 font-medium">Type</th>
                <th className="text-left px-3 py-2.5 font-medium">Owner</th>
                <th className="text-left px-3 py-2.5 font-medium">Last run</th>
                <th className="text-left px-3 py-2.5 font-medium">Schedule</th>
                <th className="text-left px-3 py-2.5 font-medium">Status</th>
                <th className="text-left px-3 py-2.5 font-medium">Format</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r, idx) => (
                <tr key={r.name} onClick={() => setSelected(r)} className={`border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${selected?.name === r.name ? "bg-primary/5" : ""}`}>
                  <td className="px-4 py-2.5 text-[11px] font-normal text-foreground">{r.name}</td>
                  <td className="px-3 py-2.5 text-[11px] text-foreground/70">{r.type}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-full ${initColors[idx % initColors.length]} flex items-center justify-center text-[8px] font-bold text-white`}>{r.initials}</div>
                      <span className="text-[11px] text-foreground/70">{r.owner}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[10px] text-muted-foreground/60 tabular-nums">{r.lastRun}</td>
                  <td className="px-3 py-2.5 text-[11px] text-foreground/70">{r.schedule}</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${r.status === "Completed" ? "text-emerald-500" : "text-destructive"}`}>
                      {r.status === "Completed" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5"><Badge variant="outline" className="text-[9.5px] h-4 px-1.5 border-border/60">{r.format}</Badge></td>
                  <td className="px-2"><MoreVertical className="w-3 h-3 text-muted-foreground/30" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={456}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>

        {/* Report Templates */}
        <div className="bg-card rounded-lg border border-border/60 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[11.5px] font-medium text-foreground">Report templates</h3>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">Start from a template to quickly generate insights.</p>
            </div>
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors flex items-center gap-1">View all templates <ArrowRight className="w-2.5 h-2.5" /></button>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {templates.map((t) => (
              <div key={t.name} className="border border-border/60 rounded-lg p-3 hover:border-primary/30 transition-colors">
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-[11px] font-medium text-foreground mb-1 leading-snug">{t.name}</h4>
                <p className="text-[10px] text-muted-foreground/70 mb-2.5 line-clamp-2 leading-relaxed">{t.desc}</p>
                <div className="flex gap-2 text-[9.5px] text-muted-foreground/60 mb-2.5">
                  <span>{t.metrics} metrics</span>
                  <span>{t.pages} pages</span>
                </div>
                <button className="w-full border border-border/60 text-[10px] h-6 rounded flex items-center justify-center hover:bg-muted/30 transition-colors text-foreground/70">Use template</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      {selected && (
        <div className="w-[260px] flex-shrink-0">
          <div className="bg-card rounded-lg border border-border/60 p-4 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
                <h3 className="text-[11px] font-medium text-foreground truncate">{selected.name}</h3>
              </div>
              <button onClick={() => setSelected(null)}><X className="w-3.5 h-3.5 text-muted-foreground/50" /></button>
            </div>

            <div className="flex gap-0 mb-3 border-b border-border/50">
              {["Overview", "Schedule", "History", "Sharing"].map((t, i) => (
                <button key={t} className={`text-[10px] px-2 py-1.5 border-b-2 transition-colors ${i === 0 ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground/60 hover:text-foreground"}`}>{t}</button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Report summary</h4>
                <p className="text-[10.5px] text-muted-foreground/70 leading-relaxed">Comprehensive coverage analysis across furnishers, products, and bureaus.</p>
              </div>

              <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
                {[["Total furnishers", "2,847"], ["Verified furnishers", "1,842 (64.7%)"], ["Bureau coverage", "98.1%"], ["Products", "7,312"], ["Active tradelines", "24.6M"], ["Data sources", "5"]].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[9.5px] text-muted-foreground/60">{k}</p>
                    <p className="text-[10.5px] font-medium text-foreground">{v}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Included sections</h4>
                {["Executive summary", "Furnisher coverage analysis", "Bureau coverage map", "Product coverage breakdown", "Tradeline volume trends", "Data quality overview", "Key insights & recommendations"].map((s) => (
                  <div key={s} className="flex items-center gap-1.5 py-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 flex-shrink-0" />
                    <span className="text-[10px] text-foreground/80">{s}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2.5 border-t border-border/40">
                <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.06em] mb-1.5">Recipients (6)</h4>
                {[["Alex Kim", "alex.kim@finintel.com", "Owner"], ["Jamie Moore", "jamie.moore@finintel.com", "Viewer"], ["Sarah Chen", "sarah.chen@finintel.com", "Viewer"]].map(([name, email, role]) => (
                  <div key={name} className="flex items-center gap-2 py-0.5">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[7px] font-bold text-white flex-shrink-0">
                      {name.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium text-foreground">{name}</p>
                      <p className="text-[9px] text-muted-foreground/60">{email}</p>
                    </div>
                    <span className="text-[9px] text-muted-foreground/50">{role}</span>
                  </div>
                ))}
                <p className="text-[10px] text-primary/70 mt-1">+3 more recipients</p>
              </div>

              <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 pt-2.5 border-t border-border/40">
                <div><p className="text-[9.5px] text-muted-foreground/60">Last run</p><p className="text-[10px] font-medium text-foreground tabular-nums">{selected.lastRun}</p></div>
                <div><p className="text-[9.5px] text-muted-foreground/60">Next run</p><p className="text-[10px] font-medium text-foreground">Jun 30, 2025 9:00 AM</p></div>
                <div><p className="text-[9.5px] text-muted-foreground/60">Status</p><p className="text-[10px] font-medium text-emerald-500">● Completed</p></div>
              </div>

              <button className="w-full bg-primary text-primary-foreground text-[11px] font-medium h-7 rounded-md flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors">Generate report</button>
              <button className="w-full border border-border/60 text-[11px] font-normal h-7 rounded-md flex items-center justify-center gap-1.5 hover:bg-muted/30 transition-colors text-foreground/70">Open report builder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}