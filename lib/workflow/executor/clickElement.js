import { TaskParamName } from "@/lib/types";

export async function clickElementExecutor(environment) {
  const selector = environment.getInput(TaskParamName.Selector);
  if (!selector) throw new Error(`${TaskParamName.Selector} not provided.`);

  await environment.getPage().click(selector);
}
