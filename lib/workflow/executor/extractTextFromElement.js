import * as cheerio from "cheerio";
import { TaskParamName } from "@/lib/types";

// extract element text from html input via selector input, and save it in outputs
export async function extractTextFromElementExecutor(environment) {
  const selector = environment.getInput(TaskParamName.Selector);
  const html = environment.getInput(TaskParamName.Html);

  if (!selector) throw new Error("Selector not provided.");
  if (!html) throw new Error("Html not defined.");

  const $ = cheerio.load(html);
  const element = $(selector);
  if (!element?.length) throw new Error("Element not found.");

  // const extractedText2 = element.text();
  const extractedText = $.text(element);
  if (!extractedText) throw new Error("Element has no text content.");

  environment.setOutput(TaskParamName.ExtractedText, extractedText);
}
