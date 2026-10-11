import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { isAuthenticated } from "../../lib/auth";
import { getContent } from "../../lib/content";
import DashboardShell from "./DashboardShell";
import SetupWizard from "../setup/Wizard";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/dashboard/login");
  }

  const { profile } = await getContent();

  // First run: send a fresh install through the setup wizard instead of
  // showing an empty editor.
  if (!profile.configured) {
    return <SetupWizard profile={profile} />;
  }

  return (
    <DashboardShell handle={profile.handle} logoUrl={profile.logoUrl}>
      {children}
    </DashboardShell>
  );
}