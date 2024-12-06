import { TaskType } from "@/lib/types";
import { launchBrowserTask } from "./launchBrowser";
import { pageToHtmlTask } from "./pageToHtml";
import { extractTextFromElementTask } from "./extractTextFromElement";

// TaskRegistry keys correspond directly to the values in TaskType enum
export const TaskRegistry = {
  [TaskType.LAUNCH_BROWSER]: launchBrowserTask,
  [TaskType.PAGE_TO_HTML]: pageToHtmlTask,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: extractTextFromElementTask,
};
