import { TaskParamName } from "@/lib/types";

export async function fillInputExecutor(environment) {
  const selector = environment.getInput(TaskParamName.Selector);
  const value = environment.getInput(TaskParamName.Value);

  if (!selector) throw new Error("Selector not provided.");
  if (!value) throw new Error("Value not provided.");

  await environment.getPage().type(selector, value);
}
