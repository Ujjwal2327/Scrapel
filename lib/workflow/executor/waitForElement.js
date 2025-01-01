import { TaskParamName } from "@/lib/types";

// Waits for an element to appear or disappear based on the provided selector, visibility, and timeout.
export async function waitForElementExecutor(environment) {
  const selector = environment.getInput(TaskParamName.Selector);
  const visibility = environment.getInput(TaskParamName.Visibility);
  const timeout = Number(environment.getInput(TaskParamName.Timeout)) || 5000;

  if (!selector) throw new Error(`${TaskParamName.Selector} not provided.`);
  if (!visibility) throw new Error(`${TaskParamName.Visibility} not provided.`);

  await environment.getPage().waitForSelector(selector, {
    visible: visibility === "visible",
    hidden: visibility === "hidden",
    timeout,
  });

  environment.log.info(`Element "${selector}" become "${visibility}".`);
}
