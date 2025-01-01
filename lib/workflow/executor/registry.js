import { TaskType } from "@/lib/types";
import { launchBrowserExecutor } from "./launchBrowser";
import { pageToHtmlExecutor } from "./pageToHtml";
import { extractTextFromElementExecutor } from "./extractTextFromElement";
import { fillInputExecutor } from "./fillInput";
import { clickElementExecutor } from "./clickElement";
import { waitForElementExecutor } from "./waitForElement";
import { deliverViaWebhookExecutor } from "./deliverViaWebhook";
import { extractDataWithAiExecutor } from "./extractDataWithAi";
import { readPropertyFromJsonExecutor } from "./readPropertyFromJson";
import { addPropertyToJsonExecutor } from "./addPropertyToJson";
import { navigateUrlExecutor } from "./navigateUrl";
import { scrollToElementExecutor } from "./scrollToElement";

// ExecutorRegistry keys correspond directly to the values in TaskType enum
export const ExecutorRegistry = {
  [TaskType.LAUNCH_BROWSER]: launchBrowserExecutor,
  [TaskType.PAGE_TO_HTML]: pageToHtmlExecutor,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: extractTextFromElementExecutor,
  [TaskType.FILL_INPUT]: fillInputExecutor,
  [TaskType.CLICK_ELEMENT]: clickElementExecutor,
  [TaskType.WAIT_FOR_ELEMENT]: waitForElementExecutor,
  [TaskType.DELIVER_VIA_WEBHOOK]: deliverViaWebhookExecutor,
  [TaskType.EXTRACT_DATA_WITH_AI]: extractDataWithAiExecutor,
  [TaskType.READ_PROPERTY_FROM_JSON]: readPropertyFromJsonExecutor,
  [TaskType.ADD_PROPERTY_TO_JSON]: addPropertyToJsonExecutor,
  [TaskType.NAVIGATE_URL]: navigateUrlExecutor,
  [TaskType.SCROLL_TO_ELEMENT]: scrollToElementExecutor,
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
