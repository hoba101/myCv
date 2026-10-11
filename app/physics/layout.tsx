import type { ReactNode } from "react";
import ChapterNav from "@/app/components/physics/ChapterNav";

export default function PhysicsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="physics-shell">
      <ChapterNav />
      <main id="main-content" className="physics-main">
        {children}
      </main>
    </div>
  );
}
