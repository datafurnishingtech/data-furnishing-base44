import React, { useState } from "react";
import { Building2, Users, Bell, Database, Link2, FileText, CheckCircle2, Clock, AlertCircle, Save, Eye, EyeOff, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const settingsTabs = [
  { label: "Workspace", sublabel: "Organization & Profile", icon: Building2 },
  { label: "Team Roles", sublabel: "Users & Permissions", icon: Users },
  { label: "Alert Preferences", sublabel: "Rules & Notifications", icon: Bell },
  { label: "Data Sources", sublabel: "Bureaus & Providers", icon: Database },
  { label: "Integrations", sublabel: "APIs & Connections", icon: Link2 },
  { label: "Export Defaults", sublabel: "Reports & Delivery", icon: FileText },
];

const teamMembers = [
  { name: "Alex Kim", email: "alex.kim@synchrony.com", role: "Admin", permissions: "Full Access", lastActive: "May 31, 2025", status: "Active", initials: "AK" },
  { name: "Jamie Morales", email: "jamie.morales@synchrony.com", role: "Analyst", permissions: "Data, Reports, Alerts", lastActive: "May 31, 2025", status: "Active", initials: "JM" },
  { name: "Taylor Patel", email: "taylor.patel@synchrony.com", role: "Analyst", permissions: "Data, Watchlists", lastActive: "May 30, 2025", status: "Active", initials: "TP" },
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
  { name: "TransUnion (TU)", status: "Verified", color: "text-emerald-500" },
  { name: "Equifax (EQ)", status: "Verified", color: "text-emerald-500" },
  { name: "Experian (EX)", status: "Verified", color: "text-emerald-500" },
  { name: "Innovis", status: "Pending", color: "text-amber-500" },
  { name: "Clarity Services", status: "Verified", color: "text-emerald-500" },
  { name: "LexisNexis", status: "Offline", color: "text-destructive" },
];

const notificationHealth = [
  { name: "Alert Delivery", status: "Healthy" },
  { name: "Email Notifications", status: "Healthy" },
  { name: "In-App Notifications", status: "Healthy" },
  { name: "Webhooks", status: "Healthy" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your Data Furnishing workspace, data sources, alerts, and export preferences.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {settingsTabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors border ${
                i === activeTab ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              <div className="text-left">
                <p>{t.label}</p>
                <p className={`text-[9px] ${i === activeTab ? "text-white/70" : "text-muted-foreground/60"}`}>{t.sublabel}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Organization Profile */}
        <div className="bg-card rounded-xl border border-border p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Organization Profile</h3>
              <p className="text-xs text-muted-foreground">Manage your organization details and workspace profile.</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">Edit Profile</Button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div><Label className="text-xs text-muted-foreground">Organization Name</Label><Input value="Synchrony Bank" className="mt-1 h-9 text-sm" readOnly /></div>
            <div><Label className="text-xs text-muted-foreground">Industry</Label><Select><SelectTrigger className="mt-1 h-9 text-sm"><SelectValue placeholder="Financial Services" /></SelectTrigger><SelectContent><SelectItem value="fs">Financial Services</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs text-muted-foreground">Headquarters</Label><Input value="Stamford, CT, USA" className="mt-1 h-9 text-sm" readOnly /></div>
            <div><Label className="text-xs text-muted-foreground">Website</Label><Input value="synchrony.com" className="mt-1 h-9 text-sm" readOnly /></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div><Label className="text-xs text-muted-foreground">Organization ID</Label><Input value="SYNC-001" className="mt-1 h-9 text-sm" readOnly /></div>
            <div><Label className="text-xs text-muted-foreground">Timezone</Label><Select><SelectTrigger className="mt-1 h-9 text-sm"><SelectValue placeholder="Eastern Time (ET)" /></SelectTrigger><SelectContent><SelectItem value="et">Eastern Time (ET)</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs text-muted-foreground">Default Currency</Label><Select><SelectTrigger className="mt-1 h-9 text-sm"><SelectValue placeholder="USD" /></SelectTrigger><SelectContent><SelectItem value="usd">USD</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs text-muted-foreground">Date Format</Label><Select><SelectTrigger className="mt-1 h-9 text-sm"><SelectValue placeholder="MM/DD/YYYY" /></SelectTrigger><SelectContent><SelectItem value="mdy">MM/DD/YYYY</SelectItem></SelectContent></Select></div>
          </div>
        </div>

        {/* Team Permissions */}
        <div className="bg-card rounded-xl border border-border p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Team Permissions</h3>
            <button className="text-xs text-primary font-medium hover:underline">View all team members →</button>
          </div>
          <table className="w-full mb-3">
            <thead>
              <tr className="text-[10px] text-muted-foreground uppercase border-b border-border">
                <th className="text-left pb-2 font-medium">User</th>
                <th className="text-left pb-2 font-medium">Role</th>
                <th className="text-left pb-2 font-medium">Permissions</th>
                <th className="text-left pb-2 font-medium">Last Active</th>
                <th className="text-left pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((m) => (
                <tr key={m.email} className="border-b border-border/50">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{m.initials}</div>
                      <div>
                        <p className="text-xs font-medium">{m.name}</p>
                        <p className="text-[10px] text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <Badge className={`text-[10px] border-0 ${m.role === "Admin" ? "bg-primary text-white" : m.role === "Analyst" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{m.role}</Badge>
                  </td>
                  <td className="py-2.5 text-xs text-muted-foreground">{m.permissions}</td>
                  <td className="py-2.5 text-xs text-muted-foreground">{m.lastActive}</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-500">● {m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="outline" size="sm" className="text-xs">+ Invite Team Member</Button>
        </div>

        {/* Bottom sections grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Bureau Connections */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold mb-1">Bureau & Data Source Connections</h3>
            <p className="text-[10px] text-muted-foreground mb-3">Manage and monitor your data source connections.</p>
            {dataSources.map((ds) => (
              <div key={ds.name} className="flex items-center gap-2 py-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${ds.color}`} />
                <span className="text-[11px] font-medium">{ds.name}</span>
                <Badge className={`ml-auto text-[9px] h-4 border-0 ${ds.status === "Verified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{ds.status}</Badge>
                <span className="text-[9px] text-muted-foreground">{ds.time}</span>
              </div>
            ))}
            <button className="text-[10px] text-primary font-medium hover:underline mt-2">Manage data sources →</button>
          </div>

          {/* Alert Thresholds */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold mb-1">Alert Thresholds</h3>
            <p className="text-[10px] text-muted-foreground mb-3">Configure global thresholds for alerts.</p>
            {[["New Furnisher Onboarded", 75, "Impact Score"], ["Coverage Drop", "10%", "Change"], ["Data Quality Issue", "95%", "Error Rate"], ["Bureau Coverage Drop", "15%", "Change"], ["High Impact Tradeline", 85, "Impact Score"]].map(([name, val, unit]) => (
              <div key={name} className="flex items-center justify-between py-1.5">
                <span className="text-[11px] text-foreground">{name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium">{val}</span>
                  <span className="text-[9px] text-muted-foreground">{unit}</span>
                </div>
              </div>
            ))}
            <button className="text-[10px] text-primary font-medium hover:underline mt-2">Manage alert rules →</button>
          </div>

          {/* Watchlist Preferences */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold mb-1">Watchlist Preferences</h3>
            <p className="text-[10px] text-muted-foreground mb-3">Set defaults for watchlist monitoring.</p>
            <div className="space-y-3">
              {["Auto-add new high impact furnishers", "Monitor coverage changes", "Monitor data quality issues"].map((s) => (
                <div key={s} className="flex items-center justify-between">
                  <span className="text-[11px] text-foreground">{s}</span>
                  <Switch defaultChecked className="scale-75" />
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-foreground">Default watchlist</span>
                <Select><SelectTrigger className="w-[140px] h-7 text-[10px]"><SelectValue placeholder="High Priority Furnishers" /></SelectTrigger><SelectContent><SelectItem value="hp">High Priority Furnishers</SelectItem></SelectContent></Select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-foreground">Alert on inactivity (days)</span>
                <span className="text-[11px] font-medium">90</span>
              </div>
            </div>
            <button className="text-[10px] text-primary font-medium hover:underline mt-2">Manage watchlists →</button>
          </div>
        </div>

        {/* API & Export Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold mb-1">API & Export Settings</h3>
            <p className="text-[10px] text-muted-foreground mb-3">Configure and monitor your default export behavior.</p>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="flex justify-between"><span className="text-muted-foreground">API Access</span><span className="text-emerald-500 font-medium">● Enabled</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">API Environment</span><span className="font-medium">Production</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rate Limit</span><span className="font-medium">1,000 req/min</span></div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">API Key</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono">{showApiKey ? "df_live_a8k3..." : "••••••••••"}</span>
                  <button onClick={() => setShowApiKey(!showApiKey)}>{showApiKey ? <EyeOff className="w-3 h-3 text-muted-foreground" /> : <Eye className="w-3 h-3 text-muted-foreground" />}</button>
                  <button><Copy className="w-3 h-3 text-muted-foreground" /></button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px] mt-3 pt-3 border-t border-border">
              <div className="flex justify-between"><span className="text-muted-foreground">Default Export Format</span><Select><SelectTrigger className="w-[70px] h-6 text-[10px]"><SelectValue placeholder="CSV" /></SelectTrigger><SelectContent><SelectItem value="csv">CSV</SelectItem></SelectContent></Select></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date Range Preset</span><Select><SelectTrigger className="w-[90px] h-6 text-[10px]"><SelectValue placeholder="Last 30 Days" /></SelectTrigger><SelectContent><SelectItem value="30">Last 30 Days</SelectItem></SelectContent></Select></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Include Headers</span><Switch defaultChecked className="scale-75" /></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Compress Exports</span><Switch defaultChecked className="scale-75" /></div>
            </div>
            <button className="text-[10px] text-primary font-medium hover:underline mt-3">View API documentation →</button>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold mb-1">Default Report Options</h3>
            <p className="text-[10px] text-muted-foreground mb-3">Set defaults for reports and data delivery.</p>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div><Label className="text-[10px] text-muted-foreground">Default Report View</Label><Select><SelectTrigger className="mt-1 h-7 text-[10px]"><SelectValue placeholder="Impact Score" /></SelectTrigger><SelectContent><SelectItem value="impact">Impact Score</SelectItem></SelectContent></Select></div>
              <div><Label className="text-[10px] text-muted-foreground">Group By</Label><Select><SelectTrigger className="mt-1 h-7 text-[10px]"><SelectValue placeholder="Furnisher" /></SelectTrigger><SelectContent><SelectItem value="furnisher">Furnisher</SelectItem></SelectContent></Select></div>
              <div><Label className="text-[10px] text-muted-foreground">Sort By</Label><Select><SelectTrigger className="mt-1 h-7 text-[10px]"><SelectValue placeholder="Impact Score (High → Low)" /></SelectTrigger><SelectContent><SelectItem value="impact_desc">Impact Score (High → Low)</SelectItem></SelectContent></Select></div>
              <div><Label className="text-[10px] text-muted-foreground">Default Date Range</Label><Select><SelectTrigger className="mt-1 h-7 text-[10px]"><SelectValue placeholder="Last 30 Days" /></SelectTrigger><SelectContent><SelectItem value="30">Last 30 Days</SelectItem></SelectContent></Select></div>
            </div>
            <div className="flex items-center justify-between mt-3 text-[11px]">
              <span className="text-muted-foreground">Include Bureau Info</span>
              <Switch defaultChecked className="scale-75" />
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px]">
              <span className="text-muted-foreground">Include Related Data</span>
              <Switch defaultChecked className="scale-75" />
            </div>
            <button className="text-[10px] text-primary font-medium hover:underline mt-3">Manage report templates →</button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-[260px] flex-shrink-0 space-y-4">
        {/* Workspace Summary */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-xs font-semibold mb-2">Workspace Summary</h4>
          <p className="text-[10px] text-muted-foreground mb-3">Your workspace health and configuration at a glance.</p>
          <div className="flex items-center justify-center mb-2">
            <div className="relative w-20 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{ value: 98 }, { value: 2 }]} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={36} startAngle={90} endAngle={-270}>
                    <Cell fill="#4F46E5" />
                    <Cell fill="#E5E7EB" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-bold">98%</span>
              </div>
            </div>
          </div>
          <p className="text-center text-xs font-medium">Workspace Health</p>
          <p className="text-center text-[10px] text-emerald-500">↑ 4% vs last 30 days</p>
        </div>

        {/* Connected Data Sources */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-xs font-semibold mb-1">Connected Data Sources</h4>
          <p className="text-[10px] text-muted-foreground mb-3">5 of 6 sources connected</p>
          {connectedSources.map((s) => (
            <div key={s.name} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${s.status === "Verified" ? "bg-emerald-500" : s.status === "Pending" ? "bg-amber-500" : "bg-destructive"}`} />
                <span className="text-[11px]">{s.name}</span>
              </div>
              <span className={`text-[10px] ${s.color}`}>{s.status === "Verified" ? "● Verified" : s.status === "Pending" ? "● Pending" : "● Offline"}</span>
            </div>
          ))}
          <button className="text-[10px] text-primary font-medium hover:underline mt-2">Manage connections →</button>
        </div>

        {/* Notification Health */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-xs font-semibold mb-1">Notification Health</h4>
          <p className="text-[10px] text-muted-foreground mb-3">All systems operational</p>
          {notificationHealth.map((n) => (
            <div key={n.name} className="flex items-center justify-between py-1">
              <span className="text-[11px]">{n.name}</span>
              <span className="text-[10px] text-emerald-500">● {n.status}</span>
            </div>
          ))}
          <button className="text-[10px] text-primary font-medium hover:underline mt-2">View notification logs →</button>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-xs font-semibold mb-3">Quick Actions</h4>
          {["Test Data Connection", "Export Workspace Config", "View Audit Log", "Restore Defaults"].map((a) => (
            <button key={a} className="w-full text-left text-[11px] text-foreground hover:text-primary py-1.5 transition-colors">{a}</button>
          ))}
        </div>

        <Button className="w-full bg-primary text-primary-foreground">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
        <p className="text-center text-[10px] text-muted-foreground">All changes are auto-saved</p>
      </div>
    </div>
  );
}