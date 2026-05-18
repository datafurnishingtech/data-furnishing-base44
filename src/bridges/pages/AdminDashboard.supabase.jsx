import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/AuthContext";
import { listProfilesPaged, updateProfileAccess, fetchProfileStats, listAuditLogsPaged, logAdminAction, bootstrapAdminProfileInDb } from "@/services/profileService";
import { isSuperAdminEmail } from "@/lib/accessHelpers";
import { getCompanyCount, getProductCount } from "@/services/intelligenceService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const PAGE_SIZE = 20;

export default function AdminDashboard() {
  const { user, refreshProfile } = useAuth();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("pending");
  const debouncedSearch = useDebouncedValue(search, 400);

  useEffect(() => {
    if (user?.email && isSuperAdminEmail(user.email)) {
      bootstrapAdminProfileInDb().then(() => {
        qc.invalidateQueries({ queryKey: ["admin-users"] });
        qc.invalidateQueries({ queryKey: ["admin-profile-stats"] });
      });
    }
  }, [user?.email, qc]);

  const { data: stats } = useQuery({ queryKey: ["admin-profile-stats"], queryFn: fetchProfileStats, staleTime: 30_000 });
  const { data: companyCount = 0 } = useQuery({ queryKey: ["admin-company-count"], queryFn: getCompanyCount, staleTime: 60_000 });
  const { data: productCount = 0 } = useQuery({ queryKey: ["admin-product-count"], queryFn: getProductCount, staleTime: 60_000 });
  const { data: usersPage, isLoading, isError, error } = useQuery({
    queryKey: ["admin-users", page, debouncedSearch, status],
    queryFn: () => listProfilesPaged({ page, pageSize: PAGE_SIZE, search: debouncedSearch, status }),
  });
  const { data: logsPage } = useQuery({ queryKey: ["admin-audit-logs", 1], queryFn: () => listAuditLogsPaged({ page: 1, pageSize: 15 }) });

  const mutation = useMutation({
    mutationFn: async ({ id, patch }) => {
      const updated = await updateProfileAccess(id, patch);
      await logAdminAction(user.id, `profile_${patch.approval_status || patch.role || "update"}`, id, patch);
      return updated;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-profile-stats"] });
      qc.invalidateQueries({ queryKey: ["admin-audit-logs"] });
      if (user) refreshProfile();
    },
  });

  const totalPages = useMemo(() => Math.max(1, Math.ceil((usersPage?.total || 0) / PAGE_SIZE)), [usersPage?.total]);

  const statItems = [
    ["Total users", stats?.total ?? "—"], ["Pending", stats?.pending ?? "—"],
    ["Active", stats?.active ?? "—"], ["Rejected", stats?.rejected ?? "—"],
    ["Suspended", stats?.suspended ?? "—"], ["Companies", companyCount], ["Products", productCount],
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Admin Dashboard" subtitle="User management and platform statistics" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {usersPage?.forbidden && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-200 text-[11px] text-amber-700">
            Your session is not recognized as an active admin in the database, so user lists are hidden. Ask a database admin to set your <code>profiles</code> row to <code>role = 'admin'</code> and <code>approval_status = 'active'</code>.
          </div>
        )}
        {isError && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-[11px] text-destructive">
            {error?.message || "Could not load users."} Apply the latest Supabase migration that adds <code>admin_list_profiles</code>.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
          {statItems.map(([label, val]) => (
            <div key={label} className="bg-card rounded-lg border border-border px-3 py-2.5">
              <div className="text-[9px] text-muted-foreground/60 uppercase tracking-wide mb-0.5">{label}</div>
              <div className="text-lg font-semibold">{typeof val === "number" ? val.toLocaleString() : val}</div>
            </div>
          ))}
        </div>

        {/* User Directory */}
        <div className="bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-[12px] font-semibold">User directory</h2>
            {status === "pending" && (stats?.pending ?? 0) > 0 && (
              <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full">{Number(stats.pending)} pending</span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 border-b border-border">
            <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search users…" className="h-8 text-[11px] max-w-xs" />
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="h-8 text-[11px] w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["all", "pending", "active", "rejected", "suspended"].map((s) => (
                  <SelectItem key={s} value={s} className="text-[11px] capitalize">{s === "all" ? "All statuses" : s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground/60">
                  <th className="text-left px-4 py-2 font-medium">Email</th>
                  <th className="text-left px-3 py-2 font-medium">Role</th>
                  <th className="text-left px-3 py-2 font-medium">Status</th>
                  <th className="text-left px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="text-center py-6 text-muted-foreground/60">Loading…</td></tr>
                ) : (usersPage?.rows || []).length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-6 text-muted-foreground/60">
                    {status === "pending" ? "No pending users." : "No users match this filter."}
                  </td></tr>
                ) : (usersPage?.rows || []).map((row) => (
                  <tr key={row.id} className="border-b border-border/30 last:border-0 hover:bg-muted/10">
                    <td className="px-4 py-2">{row.email}</td>
                    <td className="px-3 py-2 capitalize">{row.role}</td>
                    <td className="px-3 py-2 capitalize">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${row.approval_status === "active" ? "bg-emerald-500/10 text-emerald-600" : row.approval_status === "pending" ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}`}>
                        {row.approval_status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        {row.approval_status !== "active" && <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => mutation.mutate({ id: row.id, patch: { approval_status: "active" } })} disabled={mutation.isPending}>Approve</Button>}
                        {row.approval_status === "pending" && <Button size="sm" variant="outline" className="h-6 text-[10px] text-destructive border-destructive/30" onClick={() => mutation.mutate({ id: row.id, patch: { approval_status: "rejected" } })} disabled={mutation.isPending}>Reject</Button>}
                        {row.approval_status === "active" && <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => mutation.mutate({ id: row.id, patch: { approval_status: "suspended" } })} disabled={mutation.isPending}>Suspend</Button>}
                        {row.approval_status === "suspended" && <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => mutation.mutate({ id: row.id, patch: { approval_status: "active" } })} disabled={mutation.isPending}>Reactivate</Button>}
                        <Select value={row.role} onValueChange={(role) => mutation.mutate({ id: row.id, patch: { role } })} disabled={mutation.isPending}>
                          <SelectTrigger className="h-6 text-[10px] w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user" className="text-[10px]">User</SelectItem>
                            <SelectItem value="admin" className="text-[10px]">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border text-[10px] text-muted-foreground">
            <span>Page {page} / {totalPages} · {(usersPage?.total ?? 0).toLocaleString()} users</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-6 text-[10px]" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <Button size="sm" variant="outline" className="h-6 text-[10px]" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h2 className="text-[12px] font-semibold mb-3">Recent admin activity</h2>
          {(logsPage?.rows || []).length === 0 ? <p className="text-[11px] text-muted-foreground/60">No log rows yet.</p> : (
            <div className="space-y-1.5">
              {(logsPage?.rows || []).map((log) => (
                <div key={log.id} className="flex items-center gap-3 text-[10px] py-1 border-b border-border/20 last:border-0">
                  <span className="text-muted-foreground/50 shrink-0">{new Date(log.created_at).toLocaleString()}</span>
                  <span className="font-medium">{log.action}</span>
                  <span className="text-muted-foreground/60 truncate">{log.target_id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}