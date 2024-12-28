import { TaskParamName } from "@/lib/types";

export async function pageToHtmlExecutor(environment) {
  const html = await environment.getPage().content();
  environment.setOutput(TaskParamName.Html, html);
}
