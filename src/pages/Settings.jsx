import React, { useState } from "react";
import { Building2, Users, Bell, Database, Link2, FileText, CheckCircle2, Save, Eye, EyeOff, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const settingsTabs = [
  { label: "Workspace", sublabel: "Organization & profile", icon: Building2 },
  { label: "Team roles", sublabel: "Users & permissions", icon: Users },
  { label: "Alert preferences", sublabel: "Rules & notifications", icon: Bell },
  { label: "Data sources", sublabel: "Bureaus & providers", icon: Database },
  { label: "Integrations", sublabel: "APIs & connections", icon: Link2 },
  { label: "Export defaults", sublabel: "Reports & delivery", icon: FileText },
];

const teamMembers = [
  { name: "Alex Kim", email: "alex.kim@synchrony.com", role: "Admin", permissions: "Full access", lastActive: "May 31, 2025", status: "Active", initials: "AK" },
  { name: "Jamie Morales", email: "jamie.morales@synchrony.com", role: "Analyst", permissions: "Data, reports, alerts", lastActive: "May 31, 2025", status: "Active", initials: "JM" },
  { name: "Taylor Patel", email: "taylor.patel@synchrony.com", role: "Analyst", permissions: "Data, watchlists", lastActive: "May 30, 2025", status: "Active", initials: "TP" },
  { name: "Robert White", email: "robert.white@synchrony.com", role: "Viewer", permissions: "Reports", lastActive: "May 29, 2025", status: "Active", initials: "RW" },
];

const dataSources = [
  { name: "TransUnion (TU)", status: "Verified", time: "May 31, 2025 08:12 AM", color: "bg-emerald-500" },
  { name: "Equifax (EQ)", status: "Verified", time: "May 31, 2025 08:09 AM", color: "bg-emerald-500" },
  { name: "Experian (EX)", status: "Verified", time: "May 31, 2025 08:11 AM", color: "bg-emerald-500" },
  { name: "Innovis", status: "Pending", time: "May 30, 2025 07:58 AM", color: "bg-amber-500" },
  { name: "Clarity Services", status: "Verified", time: "May 30, 2025 07:45 AM", color: "bg-emerald-500" },
];

const connectedSources = [
  { name: "TransUnion (TU)", status: "Verified" },
  { name: "Equifax (EQ)", status: "Verified" },
  { name: "Experian (EX)", status: "Verified" },
  { name: "Innovis", status: "Pending" },
  { name: "Clarity Services", status: "Verified" },
  { name: "LexisNexis", status: "Offline" },
];

const notificationHealth = [
  { name: "Alert delivery", status: "Healthy" },
  { name: "Email notifications", status: "Healthy" },
  { name: "In-app notifications", status: "Healthy" },
  { name: "Webhooks", status: "Healthy" },
];

const sourceStatusColor = { Verified: "text-emerald-500", Pending: "text-amber-500", Offline: "text-destructive" };
const sourceDotColor = { Verified: "bg-emerald-500", Pending: "bg-amber-500", Offline: "bg-destructive" };

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="mb-5">
          <h1 className="text-[15px] font-semibold text-foreground tracking-tight">Settings</h1>
          <p className="text-[11px] text-muted-foreground/70 mt-0.5">Configure your workspace, data sources, alerts, and export preferences.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {settingsTabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-normal transition-colors border ${
                i === activeTab ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground/70 border-border/60 hover:border-primary/30"
              }`}
            >
              <t.icon className="w-3 h-3" />
              <div className="text-left">
                <p className="leading-none">{t.label}</p>
                <p className={`text-[9px] mt-0.5 ${i === activeTab ? "text-white/60" : "text-muted-foreground/50"}`}>{t.sublabel}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Organization Profile */}
        <div className="bg-card rounded-lg border border-border/60 p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[11.5px] font-medium text-foreground">Organization profile</h3>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">Manage your organization details and workspace profile.</p>
            </div>
            <Button variant="outline" size="sm" className="text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60">Edit profile</Button>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-3">
            {[["Organization name", "Synchrony Bank"], ["Headquarters", "Stamford, CT, USA"], ["Website", "synchrony.com"], ["Organization ID", "SYNC-001"]].map(([label, val]) => (
              <div key={label}>
                <Label className="text-[10px] text-muted-foreground/60">{label}</Label>
                <Input value={val} className="mt-1 h-7 text-[11px] border-border/60" readOnly />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[["Industry", "Financial Services"], ["Timezone", "Eastern Time (ET)"], ["Default currency", "USD"], ["Date format", "MM/DD/YYYY"]].map(([label, placeholder]) => (
              <div key={label}>
                <Label className="text-[10px] text-muted-foreground/60">{label}</Label>
                <Select><SelectTrigger className="mt-1 h-7 text-[11px] border-border/60"><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent><SelectItem value="v">{placeholder}</SelectItem></SelectContent></Select>
              </div>
            ))}
          </div>
        </div>

        {/* Team Permissions */}
        <div className="bg-card rounded-lg border border-border/60 p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11.5px] font-medium text-foreground">Team permissions</h3>
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors">View all team members →</button>
          </div>
          <table className="w-full mb-3">
            <thead>
              <tr className="text-[9.5px] font-medium text-muted-foreground/60 border-b border-border/50 uppercase tracking-[0.06em]">
                <th className="text-left pb-2 font-medium">User</th>
                <th className="text-left pb-2 font-medium">Role</th>
                <th className="text-left pb-2 font-medium">Permissions</th>
                <th className="text-left pb-2 font-medium">Last active</th>
                <th className="text-left pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((m) => (
                <tr key={m.email} className="border-b border-border/30 last:border-0">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-semibold text-primary">{m.initials}</div>
                      <div>
                        <p className="text-[11px] font-normal text-foreground">{m.name}</p>
                        <p className="text-[10px] text-muted-foreground/60">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2">
                    <Badge className={`text-[9.5px] border-0 px-1.5 h-4 ${m.role === "Admin" ? "bg-primary text-white" : m.role === "Analyst" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{m.role}</Badge>
                  </td>
                  <td className="py-2 text-[10px] text-muted-foreground/60">{m.permissions}</td>
                  <td className="py-2 text-[10px] text-muted-foreground/60 tabular-nums">{m.lastActive}</td>
                  <td className="py-2"><span className="text-[10px] text-emerald-500">● {m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="outline" size="sm" className="text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60">+ Invite team member</Button>
        </div>

        {/* Bottom sections */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Bureau Connections */}
          <div className="bg-card rounded-lg border border-border/60 p-4">
            <h3 className="text-[11px] font-medium text-foreground mb-0.5">Bureau & data source connections</h3>
            <p className="text-[10px] text-muted-foreground/60 mb-3">Manage and monitor your data source connections.</p>
            {dataSources.map((ds) => (
              <div key={ds.name} className="flex items-center gap-2 py-1">
                <div className={`w-1.5 h-1.5 rounded-full ${ds.color} flex-shrink-0`} />
                <span className="text-[10.5px] text-foreground flex-1">{ds.name}</span>
                <Badge className={`text-[9px] h-4 border-0 px-1.5 ${ds.status === "Verified" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>{ds.status}</Badge>
              </div>
            ))}
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-2">Manage data sources →</button>
          </div>

          {/* Alert Thresholds */}
          <div className="bg-card rounded-lg border border-border/60 p-4">
            <h3 className="text-[11px] font-medium text-foreground mb-0.5">Alert thresholds</h3>
            <p className="text-[10px] text-muted-foreground/60 mb-3">Configure global thresholds for alerts.</p>
            {[["New furnisher onboarded", "75", "Impact score"], ["Coverage drop", "10%", "Change"], ["Data quality issue", "95%", "Error rate"], ["Bureau coverage drop", "15%", "Change"], ["High impact tradeline", "85", "Impact score"]].map(([name, val, unit]) => (
              <div key={name} className="flex items-center justify-between py-1">
                <span className="text-[10.5px] text-foreground">{name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10.5px] font-medium">{val}</span>
                  <span className="text-[9.5px] text-muted-foreground/60">{unit}</span>
                </div>
              </div>
            ))}
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-2">Manage alert rules →</button>
          </div>

          {/* Watchlist Preferences */}
          <div className="bg-card rounded-lg border border-border/60 p-4">
            <h3 className="text-[11px] font-medium text-foreground mb-0.5">Watchlist preferences</h3>
            <p className="text-[10px] text-muted-foreground/60 mb-3">Set defaults for watchlist monitoring.</p>
            <div className="space-y-2.5">
              {["Auto-add new high-impact furnishers", "Monitor coverage changes", "Monitor data quality issues"].map((s) => (
                <div key={s} className="flex items-center justify-between">
                  <span className="text-[10.5px] text-foreground">{s}</span>
                  <Switch defaultChecked className="scale-75" />
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] text-foreground">Default watchlist</span>
                <Select><SelectTrigger className="w-[130px] h-6 text-[10px] border-border/60"><SelectValue placeholder="High Priority Furnishers" /></SelectTrigger><SelectContent><SelectItem value="hp">High Priority Furnishers</SelectItem></SelectContent></Select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] text-foreground">Alert on inactivity (days)</span>
                <span className="text-[10.5px] font-medium text-foreground">90</span>
              </div>
            </div>
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-2">Manage watchlists →</button>
          </div>
        </div>

        {/* API & Export */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-lg border border-border/60 p-4">
            <h3 className="text-[11px] font-medium text-foreground mb-0.5">API & export settings</h3>
            <p className="text-[10px] text-muted-foreground/60 mb-3">Configure and monitor your default export behavior.</p>
            <div className="space-y-1.5">
              {[["API access", "Enabled", true], ["API environment", "Production", false], ["Rate limit", "1,000 req/min", false]].map(([k, v, green]) => (
                <div key={String(k)} className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground/60">{k}</span>
                  <span className={`text-[10px] font-medium ${green ? "text-emerald-500" : "text-foreground"}`}>{green ? "● " : ""}{v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/60">API key</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono">{showApiKey ? "df_live_a8k3..." : "••••••••••"}</span>
                  <button onClick={() => setShowApiKey(!showApiKey)}>{showApiKey ? <EyeOff className="w-3 h-3 text-muted-foreground/50" /> : <Eye className="w-3 h-3 text-muted-foreground/50" />}</button>
                  <button><Copy className="w-3 h-3 text-muted-foreground/50" /></button>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 mt-3 pt-3 border-t border-border/40">
              {[["Default export format", "CSV"], ["Date range preset", "Last 30 days"]].map(([k, v]) => (
                <div key={String(k)} className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/60">{k}</span>
                  <Select><SelectTrigger className="w-[90px] h-6 text-[10px] border-border/60"><SelectValue placeholder={v} /></SelectTrigger><SelectContent><SelectItem value="v">{v}</SelectItem></SelectContent></Select>
                </div>
              ))}
              {[["Include headers", true], ["Compress exports", true]].map(([k, v]) => (
                <div key={String(k)} className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/60">{k}</span>
                  <Switch defaultChecked={Boolean(v)} className="scale-75" />
                </div>
              ))}
            </div>
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-3">View API documentation →</button>
          </div>

          <div className="bg-card rounded-lg border border-border/60 p-4">
            <h3 className="text-[11px] font-medium text-foreground mb-0.5">Default report options</h3>
            <p className="text-[10px] text-muted-foreground/60 mb-3">Set defaults for reports and data delivery.</p>
            <div className="grid grid-cols-2 gap-3">
              {[["Default report view", "Impact score"], ["Group by", "Furnisher"], ["Sort by", "Impact (high → low)"], ["Default date range", "Last 30 days"]].map(([k, v]) => (
                <div key={k}>
                  <Label className="text-[10px] text-muted-foreground/60">{k}</Label>
                  <Select><SelectTrigger className="mt-1 h-7 text-[10px] border-border/60"><SelectValue placeholder={v} /></SelectTrigger><SelectContent><SelectItem value="v">{v}</SelectItem></SelectContent></Select>
                </div>
              ))}
            </div>
            {[["Include bureau info", true], ["Include related data", true]].map(([k, v]) => (
              <div key={String(k)} className="flex items-center justify-between mt-2.5">
                <span className="text-[10px] text-muted-foreground/60">{k}</span>
                <Switch defaultChecked={Boolean(v)} className="scale-75" />
              </div>
            ))}
            <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-3">Manage report templates →</button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-[260px] flex-shrink-0 space-y-4">
        {/* Workspace Summary */}
        <div className="bg-card rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
            <h4 className="text-[11.5px] font-medium text-foreground">Workspace summary</h4>
          </div>
          <p className="text-[10px] text-muted-foreground/60 mb-3">Your workspace health and configuration at a glance.</p>
          <div className="flex items-center justify-center mb-1">
            <div className="relative w-16 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{ value: 98 }, { value: 2 }]} dataKey="value" cx="50%" cy="50%" innerRadius={22} outerRadius={30} startAngle={90} endAngle={-270}>
                    <Cell fill="#4F46E5" />
                    <Cell fill="#E5E7EB" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[13px] font-semibold text-foreground">98%</span>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] font-medium text-foreground">Workspace health</p>
          <p className="text-center text-[10px] text-emerald-500 mt-0.5">↑ 4% vs last 30 days</p>
        </div>

        {/* Connected Data Sources */}
        <div className="bg-card rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
            <h4 className="text-[11.5px] font-medium text-foreground">Connected data sources</h4>
          </div>
          <p className="text-[10px] text-muted-foreground/60 mb-3">5 of 6 sources connected</p>
          {connectedSources.map((s) => (
            <div key={s.name} className="flex items-center justify-between py-0.5">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${sourceDotColor[s.status]} flex-shrink-0`} />
                <span className="text-[10.5px] text-foreground">{s.name}</span>
              </div>
              <span className={`text-[10px] font-medium ${sourceStatusColor[s.status]}`}>● {s.status}</span>
            </div>
          ))}
          <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-2">Manage connections →</button>
        </div>

        {/* Notification Health */}
        <div className="bg-card rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
            <h4 className="text-[11.5px] font-medium text-foreground">Notification health</h4>
          </div>
          <p className="text-[10px] text-muted-foreground/60 mb-3">All systems operational</p>
          {notificationHealth.map((n) => (
            <div key={n.name} className="flex items-center justify-between py-0.5">
              <span className="text-[10.5px] text-foreground">{n.name}</span>
              <span className="text-[10px] text-emerald-500">● {n.status}</span>
            </div>
          ))}
          <button className="text-[10px] text-primary/70 hover:text-primary transition-colors mt-2">View notification logs →</button>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-0.5 h-3.5 bg-primary/60 rounded-full" />
            <h4 className="text-[11.5px] font-medium text-foreground">Quick actions</h4>
          </div>
          {["Test data connection", "Export workspace config", "View audit log", "Restore defaults"].map((a) => (
            <button key={a} className="w-full text-left text-[10.5px] text-foreground/70 hover:text-primary py-1 transition-colors">{a}</button>
          ))}
        </div>

        <button className="w-full bg-primary text-primary-foreground text-[11px] font-medium h-8 rounded-md flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors">
          <Save className="w-3 h-3" /> Save changes
        </button>
        <p className="text-center text-[10px] text-muted-foreground/50">All changes are auto-saved</p>
      </div>
    </div>
  );
}