import { redirect } from "next/navigation";
import { isAuthConfigured, isAuthenticated } from "../../lib/auth";
import LoginPage from "./LoginForm";

export default async function LoginRoute() {
  // Only bounce away from the login page when there is genuinely a session.
  // Keying this off `isAuthConfigured()` instead made the route redirect to
  // /dashboard for everyone, which the proxy then bounced straight back here —
  // an unbreakable loop for any signed-out visitor.
  if (await isAuthenticated()) {
    redirect("/dashboard");
  }
  return <LoginPage configured={isAuthConfigured()} />;
}
