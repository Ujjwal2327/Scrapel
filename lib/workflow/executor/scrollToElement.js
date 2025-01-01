import { TaskParamName } from "@/lib/types";

export async function scrollToElementExecutor(environment) {
  const selector = environment.getInput(TaskParamName.Selector);
  if (!selector) throw new Error(`${TaskParamName.Selector} not provided.`);

  await environment.getPage().evaluate((selector) => {
    const element = document.querySelector(selector);
    if (!element) throw new Error("Element with provided Selector not found");

    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top });
  }, selector);
}
