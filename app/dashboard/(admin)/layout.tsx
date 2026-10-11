import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { isAuthenticated } from "../../lib/auth";
import { getContent } from "../../lib/content";
import DashboardShell from "./DashboardShell";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/dashboard/login");
  }

  const { profile } = await getContent();

  return <DashboardShell handle={profile.handle}>{children}</DashboardShell>;
}