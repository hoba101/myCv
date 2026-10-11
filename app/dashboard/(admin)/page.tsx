import Link from "next/link";
import { Briefcase, ExternalLink, Sparkles, Wrench } from "lucide-react";
import { getContent } from "../../lib/content";
import { PageHeader } from "./components/Editor";

export default async function DashboardPage() {
  const content = await getContent();
  const activeSocials = content.socials.filter((link) => link.active).length;

  const stats = [
    {
      href: "/dashboard/projects",
      label: "Projects",
      value: content.projects.length,
      icon: Briefcase,
    },
    {
      href: "/dashboard/skills",
      label: "Skills",
      value: content.skills.length,
      icon: Sparkles,
    },
    {
      href: "/dashboard/services",
      label: "Services",
      value: content.services.length,
      icon: Wrench,
    },
    {
      href: "/dashboard/social",
      label: "Social links",
      value: `${activeSocials}/${content.socials.length}`,
      icon: ExternalLink,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Everything on this page is stored in content/site.json."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.href}
              href={stat.href}
              className="bg-card border-[3px] border-theme p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform"
              style={{ boxShadow: "3px 3px 0px 0px var(--shadow-color)" }}
            >
              <span className="w-11 h-11 rounded-full border-[3px] border-theme bg-accent-highlight flex items-center justify-center">
                <Icon size={18} className="text-black" />
              </span>
              <span>
                <span className="block text-2xl font-bold text-theme">
                  {stat.value}
                </span>
                <span className="block text-sm text-theme-muted">
                  {stat.label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <div
        className="mt-8 bg-card border-[3px] border-theme p-5"
        style={{ boxShadow: "3px 3px 0px 0px var(--shadow-color)" }}
      >
        <h2 className="font-bold text-theme mb-2">tips</h2>
        <ul className="text-theme-muted text-sm flex flex-col gap-1.5 list-disc pl-5">
          <li>Changes appear on the live site immediately.</li>
          <li>
            Hiding a social link keeps it saved — toggle it back on any time.
          </li>
          <li>
            Project images are optimised by Next.js. Any remote host you add
            must be allowed in <code className="font-mono">next.config.ts</code>.
          </li>
          <li>
            Back up <code className="font-mono">content/site.json</code> — it is
            the source of truth.
          </li>
        </ul>
      </div>
    </div>
  );
}