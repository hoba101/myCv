"use client";

import { Sparkles } from "lucide-react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-card border-[3px] border-theme p-8 md:p-12 text-center max-w-md w-full" style={{ boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}>
        <div className="w-16 h-16 mx-auto mb-6 bg-accent-pink border-[3px] border-theme rounded-full flex items-center justify-center" style={{ boxShadow: '2px 2px 0px 0px var(--shadow-color)' }}>
          <Sparkles size={28} className="text-black" />
        </div>
        <h1 className="text-2xl font-bold text-theme mb-2">something went wrong</h1>
        <p className="text-theme-muted text-sm mb-6">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="text-xs text-theme-muted/60 mb-6 font-mono">
            error id: {error.digest}
          </p>
        )}
        <button
          onClick={unstable_retry}
          className="brutal-btn bg-accent-highlight text-black hover:bg-accent-green transition-colors"
        >
          try again
        </button>
      </div>
    </div>
  );
}
