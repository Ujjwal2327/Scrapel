import { getWorkflow } from "@/actions/workflows/getWorkflow";
import { Editor } from "../../_components/Editor";
import { ErrorAlert } from "@/components/ErrorAlert";

export function generateMetadata() {
  return {
    title: "Workflow Builder - Scrapel | Build Web Scrapers Visually",
    description:
      "Design, customize, and manage your web scraping workflows with Scrapel's intuitive drag-and-drop builder. Automate tasks without writing code.",
  };
}

export default async function EditorPage({ params }) {
  const workflowId = decodeURIComponent(params.workflowId);

  const workflow = await getWorkflow(workflowId);

  if (workflow?.errorMessage)
    return <ErrorAlert message={workflow?.errorMessage} />;

  return <Editor workflow={workflow} />;
}
