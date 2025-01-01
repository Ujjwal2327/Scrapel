import { TaskParamName } from "@/lib/types";

export async function navigateUrlExecutor(environment) {
  const url = environment.getInput(TaskParamName.Url);
  if (!url) throw new Error(`${TaskParamName.Url} not provided.`);

  await environment.getPage().goto(url);
  environment.log.info(`Visited ${url}`);
}
