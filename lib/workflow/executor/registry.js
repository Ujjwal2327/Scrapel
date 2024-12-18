import { TaskType } from "@/lib/types";
import { launchBrowserExecutor } from "./launchBrowser";
import { pageToHtmlExecutor } from "./pageToHtml";
import { extractTextFromElementExecutor } from "./extractTextFromElement";

// ExecutorRegistry keys correspond directly to the values in TaskType enum
export const ExecutorRegistry = {
  [TaskType.LAUNCH_BROWSER]: launchBrowserExecutor,
  [TaskType.PAGE_TO_HTML]: pageToHtmlExecutor,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: extractTextFromElementExecutor,
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
