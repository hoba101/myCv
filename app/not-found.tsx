import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-card border-[3px] border-theme p-8 md:p-12 text-center max-w-md w-full" style={{ boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}>
        <div className="w-16 h-16 mx-auto mb-6 bg-accent-blue border-[3px] border-theme rounded-full flex items-center justify-center" style={{ boxShadow: '2px 2px 0px 0px var(--shadow-color)' }}>
          <Sparkles size={28} className="text-black" />
        </div>
        <h1 className="text-6xl font-bold text-theme mb-2">404</h1>
        <p className="text-theme-muted text-sm mb-8">this page doesn&apos;t exist... yet.</p>
        <Link
          href="/"
          className="brutal-btn bg-accent-pink text-black hover:bg-accent-highlight transition-colors"
        >
          back to home
        </Link>
      </div>
    </div>
  );
}
