import { getContent } from "../../../lib/content";
import Editor from "./Editor";

export default async function ProfilePage() {
  const content = await getContent();
  return <Editor profile={content.profile} hero={content.hero} />;
}