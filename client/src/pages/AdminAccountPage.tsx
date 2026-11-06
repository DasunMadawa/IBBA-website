import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { KeyRound, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function AdminAccountPage() {
  const { user, logout } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const update = trpc.staffAuth.updateAccount.useMutation({
    onSuccess: async () => {
      toast.success("Account updated. Sign in again with the new credentials.");
      await logout();
    },
    onError: error => toast.error(error.message),
  });

  return <DashboardLayout><div className="admin-page"><header className="admin-header"><div><p>Account</p><h1>Login settings</h1><span>Change this administrator’s name, email, or password.</span></div></header><form className="admin-form admin-account-form" onSubmit={event => { event.preventDefault(); update.mutate({ email, displayName, currentPassword, newPassword }); }}><div className="admin-form-title"><div><p>Secure credentials</p><h2>Update this account</h2></div><KeyRound aria-hidden="true" /></div><label><Label htmlFor="admin-account-name">Display name</Label><Input id="admin-account-name" value={displayName} onChange={event => setDisplayName(event.target.value)} required /></label><label><Label htmlFor="admin-account-email">Email</Label><Input id="admin-account-email" type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label><label><Label htmlFor="admin-account-current">Current password</Label><Input id="admin-account-current" type="password" autoComplete="current-password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required /></label><label><Label htmlFor="admin-account-new">New password (optional)</Label><Input id="admin-account-new" type="password" autoComplete="new-password" minLength={14} value={newPassword} onChange={event => setNewPassword(event.target.value)} /><small>Leave blank to keep the current password. New passwords must contain at least 14 characters.</small></label><div className="admin-form-actions"><Button type="submit" disabled={update.isPending}>{update.isPending ? <Loader2 className="animate-spin" /> : <KeyRound />}Update account</Button><span>You will be signed out after a successful change.</span></div></form></div></DashboardLayout>;
}
