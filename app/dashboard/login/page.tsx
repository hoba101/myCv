import { redirect } from "next/navigation";
import { isAuthenticated, isAuthConfigured } from "../../lib/auth";
import LoginPage from "./LoginForm";

export default async function LoginRoute() {
  // No password set yet: show setup instructions instead of a dead form.
  if (!isAuthConfigured()) {
    return <LoginPage configured={false} />;
  }

  // Only skip the form when a valid session already exists.
  // Checking "configured" here instead would bounce straight back to
  // /dashboard, which redirects here again — an infinite loop.
  if (await isAuthenticated()) {
    redirect("/dashboard");
  }

  return <LoginPage configured />;
}