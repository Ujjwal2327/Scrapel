import { TaskType } from "@/lib/types";
import { launchBrowserTask } from "./launchBrowser";
import { pageToHtmlTask } from "./pageToHtml";
import { extractTextFromElementTask } from "./extractTextFromElement";
import { fillInputTask } from "./fillInput";
import { clickElementTask } from "./clickElement";
import { waitForElementTask } from "./waitForElement";
import { deliverViaWebhookTask } from "./deliverViaWebhook";

// TaskRegistry keys correspond directly to the values in TaskType enum
export const TaskRegistry = {
  [TaskType.LAUNCH_BROWSER]: launchBrowserTask,
  [TaskType.PAGE_TO_HTML]: pageToHtmlTask,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: extractTextFromElementTask,
  [TaskType.FILL_INPUT]: fillInputTask,
  [TaskType.CLICK_ELEMENT]: clickElementTask,
  [TaskType.WAIT_FOR_ELEMENT]: waitForElementTask,
  [TaskType.DELIVER_VIA_WEBHOOK]: deliverViaWebhookTask,
};
