import { getContent } from "../../../lib/content";
import Editor from "./Editor";

export default async function SkillsPage() {
  const content = await getContent();
  return <Editor items={content.skills} />;
}