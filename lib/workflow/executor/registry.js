import { TaskType } from "@/lib/types";
import { launchBrowserExecutor } from "./launchBrowser";
import { pageToHtmlExecutor } from "./pageToHtml";
import { extractTextFromElementExecutor } from "./extractTextFromElement";
import { fillInputExecutor } from "./fillInput";
import { clickElementExecutor } from "./clickElement";
import { waitForElementExecutor } from "./waitForElement";
import { deliverViaWebhookExecutor } from "./deliverViaWebhook";

// ExecutorRegistry keys correspond directly to the values in TaskType enum
export const ExecutorRegistry = {
  [TaskType.LAUNCH_BROWSER]: launchBrowserExecutor,
  [TaskType.PAGE_TO_HTML]: pageToHtmlExecutor,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: extractTextFromElementExecutor,
  [TaskType.FILL_INPUT]: fillInputExecutor,
  [TaskType.CLICK_ELEMENT]: clickElementExecutor,
  [TaskType.WAIT_FOR_ELEMENT]: waitForElementExecutor,
  [TaskType.DELIVER_VIA_WEBHOOK]: deliverViaWebhookExecutor,
};

/*
  environment Syntax in executorFunction: 
  {
    getInput: (name){}, setOutput: (name,value){},
    setBrowser: (browser){}, getBrowser: (){},
    setPage: (page){}, getPage: (){},
    log: { getAll: (){}, info: (message){}, error: (message){} }
  }
*/
