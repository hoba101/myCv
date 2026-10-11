import { getContent } from "../../../lib/content";
import Editor from "./Editor";

export default async function ProjectsPage() {
  const content = await getContent();
  return <Editor items={content.projects} />;
}