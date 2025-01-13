import { getWorkflow } from "@/actions/workflows/getWorkflow";
import { Editor } from "../../_components/Editor";
import { ErrorAlert } from "@/components/ErrorAlert";

export default async function EditorPage({ params }) {
  const workflowId = decodeURIComponent(params.workflowId);

  const workflow = await getWorkflow(workflowId);

  if (workflow?.errorMessage)
    return <ErrorAlert message={workflow?.errorMessage} />;

  return <Editor workflow={workflow} />;
}
