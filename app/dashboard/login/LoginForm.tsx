"use client";

import { Lock } from "lucide-react";
import { useActionState } from "react";
import { loginAction, type AuthState } from "../../actions/auth";

export default function LoginPage({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    loginAction,
    {}
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="bg-card border-[3px] border-theme p-8 md:p-10 w-full max-w-sm"
        style={{ boxShadow: "4px 4px 0px 0px var(--shadow-color)" }}
      >
        <div
          className="w-14 h-14 mx-auto mb-6 bg-accent-pink border-[3px] border-theme rounded-full flex items-center justify-center"
          style={{ boxShadow: "2px 2px 0px 0px var(--shadow-color)" }}
        >
          <Lock size={24} className="text-black" />
        </div>

        <h1 className="text-2xl font-bold text-theme text-center mb-2">
          dashboard
        </h1>
        <p className="text-theme-muted text-sm text-center mb-8">
          sign in to manage your site content
        </p>

        {!configured ? (
          <div className="bg-accent-highlight border-[3px] border-theme p-4 text-black text-sm leading-relaxed">
            <strong className="block mb-1">setup required</strong>
            Set <code className="font-mono">DASHBOARD_PASSWORD</code> in{" "}
            <code className="font-mono">.env.local</code>, then restart the dev
            server.
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-theme">
                Password
              </span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                autoFocus
                className="bg-theme text-theme border-[3px] border-theme px-4 py-3 outline-none focus-visible:border-accent-pink"
              />
            </label>

            {state.error ? (
              <p className="text-accent-pink text-sm font-semibold" role="alert">
                {state.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="brutal-btn bg-accent-highlight text-black disabled:opacity-60 disabled:cursor-wait"
            >
              {pending ? "signing in..." : "sign in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}