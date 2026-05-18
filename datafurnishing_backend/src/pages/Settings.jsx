import React, { useState } from "react";
import { Building2, Users, Bell, Database, Link2, FileText } from "lucide-react";
import LogoutAllDevices from "@/components/auth/LogoutAllDevices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/shared/PageHeader";

const settingsTabs = [
  { label: "Workspace", sublabel: "Organization & profile", icon: Building2 },
  { label: "Team roles", sublabel: "Users & permissions", icon: Users },
  { label: "Alert preferences", sublabel: "Rules & notifications", icon: Bell },
  { label: "Data sources", sublabel: "Bureaus & providers", icon: Database },
  { label: "Integrations", sublabel: "APIs & connections", icon: Link2 },
  { label: "Export defaults", sublabel: "Reports & delivery", icon: FileText },
];

const teamMembers = [
  { name: "Alex Kim", email: "alex.kim@synchrony.com", role: "Admin", lastActive: "May 31, 2025", status: "Active", initials: "AK" },
  { name: "Jamie Morales", email: "jamie.morales@synchrony.com", role: "Analyst", lastActive: "May 31, 2025", status: "Active", initials: "JM" },
  { name: "Taylor Patel", email: "taylor.patel@synchrony.com", role: "Analyst", lastActive: "May 30, 2025", status: "Active", initials: "TP" },
  { name: "Robert White", email: "robert.white@synchrony.com", role: "Viewer", lastActive: "May 29, 2025", status: "Active", initials: "RW" },
];

const dataSources = [
  { name: "TransUnion (TU)", status: "Verified", color: "bg-emerald-500" }, { name: "Equifax (EQ)", status: "Verified", color: "bg-emerald-500" },
  { name: "Experian (EX)", status: "Verified", color: "bg-emerald-500" }, { name: "Innovis", status: "Pending", color: "bg-amber-500" },
  { name: "Clarity Services", status: "Verified", color: "bg-emerald-500" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Settings" subtitle="Configure your workspace, data sources, alerts, and export preferences" />
      <div className="flex flex-1 overflow-hidden">
        {/* Tabs sidebar */}
        <div className="w-48 border-r border-border bg-card overflow-y-auto p-2 space-y-1">
          {settingsTabs.map((t, i) => {
            const Icon = t.icon;
            return (
              <button key={t.label} onClick={() => setActiveTab(i)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-[11px] transition-colors ${i === activeTab ? "bg-primary text-primary-foreground" : "text-muted-foreground/70 hover:bg-muted/50"}`}>
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <div>
                  <div className="font-medium">{t.label}</div>
                  <div className={`text-[9px] ${i === activeTab ? "text-primary-foreground/70" : "text-muted-foreground/50"}`}>{t.sublabel}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 0 && (
            <>
              <div className="bg-card rounded-lg border border-border p-4">
                <h3 className="text-[12px] font-semibold mb-3">Organization profile</h3>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  {[["Organization name", "Synchrony Bank"], ["Headquarters", "Stamford, CT, USA"], ["Website", "synchrony.com"], ["Organization ID", "SYNC-001"]].map(([label, val]) => (
                    <div key={label}><label className="text-[10px] text-muted-foreground/60 block mb-1">{label}</label><Input defaultValue={val} className="h-8 text-[11px]" /></div>
                  ))}
                </div>
                <Button size="sm" className="mt-3 h-7 text-[11px]">Save changes</Button>
              </div>
              <LogoutAllDevices />
            </>
          )}
          {activeTab === 1 && (
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="text-[12px] font-semibold mb-3">Team permissions</h3>
              <table className="w-full text-[10.5px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground/60">
                    <th className="text-left py-1.5 font-medium">User</th>
                    <th className="text-left py-1.5 font-medium">Role</th>
                    <th className="text-left py-1.5 font-medium">Last active</th>
                    <th className="text-left py-1.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((m) => (
                    <tr key={m.name} className="border-b border-border/30 last:border-0">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">{m.initials}</div>
                          <div><div className="font-medium">{m.name}</div><div className="text-muted-foreground/60">{m.email}</div></div>
                        </div>
                      </td>
                      <td className="py-2">{m.role}</td>
                      <td className="py-2 text-muted-foreground">{m.lastActive}</td>
                      <td className="py-2"><span className="text-emerald-600">● {m.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button size="sm" variant="outline" className="mt-3 h-7 text-[11px]">+ Invite team member</Button>
            </div>
          )}
          {activeTab === 2 && (
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="text-[12px] font-semibold mb-3">Alert thresholds</h3>
              <div className="space-y-2 text-[11px]">
                {[["New furnisher onboarded", "75", "Impact score"], ["Coverage drop", "10%", "Change"], ["Data quality issue", "95%", "Error rate"], ["Bureau coverage drop", "15%", "Change"]].map(([name, val, unit]) => (
                  <div key={name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <span>{name}</span>
                    <div className="flex items-center gap-2">
                      <Input defaultValue={val} className="h-6 text-[10px] w-16" />
                      <span className="text-muted-foreground/60 text-[10px]">{unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="sm" className="mt-3 h-7 text-[11px]">Save thresholds</Button>
            </div>
          )}
          {activeTab === 3 && (
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="text-[12px] font-semibold mb-3">Bureau & data source connections</h3>
              <div className="space-y-2">
                {dataSources.map((ds) => (
                  <div key={ds.name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0 text-[11px]">
                    <span className="font-medium">{ds.name}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${ds.color}`} />
                      <span className={ds.status === "Verified" ? "text-emerald-600" : "text-amber-600"}>{ds.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(activeTab === 4 || activeTab === 5) && (
            <div className="bg-card rounded-lg border border-border p-4 text-[11px] text-muted-foreground">
              <h3 className="text-[12px] font-semibold text-foreground mb-2">{settingsTabs[activeTab].label}</h3>
              <p>This section is under development. Configuration options will be available soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}