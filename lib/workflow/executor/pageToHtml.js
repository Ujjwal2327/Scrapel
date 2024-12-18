import { TaskParamName } from "@/lib/types";

// retrieve page from environment, extract its HTML content, and save it in outputs
export async function pageToHtmlExecutor(environment) {
  const html = await environment.getPage().content();
  environment.setOutput(TaskParamName.Html, html);
}
