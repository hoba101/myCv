/**
 * ============================================
 * MAIN PAGE — EHAB'S PORTFOLIO
 * ============================================
 * Single-page layout assembling all sections.
 * Content comes from content/site.json, editable
 * from the dashboard at /dashboard.
 */

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";
import { getContent } from "./lib/content";

export default async function Home() {
  const content = await getContent();

  return (
    <>
      {/* --- Navigation --- */}
      <Navbar handle={content.profile.handle} />

      {/* --- Main Content --- */}
      <main id="main-content" className="flex-1">
        <HeroSection />
        <ServicesSection items={content.services} />
        <SkillsSection items={content.skills} />
        <ProjectsSection items={content.projects} />
        <ContactSection links={content.socials} profile={content.profile} />
      </main>
    </>
  );
}