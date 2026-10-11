import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { isAuthenticated } from "../../lib/auth";
import DashboardShell from "./DashboardShell";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/dashboard/login");
  }
  return <DashboardShell>{children}</DashboardShell>;
}