import { TaskParamName, TaskParamType } from "@/lib/types";

export const TaskParamMapping = {
  [TaskParamName.ExtractedText]: TaskParamType.STRING,
  [TaskParamName.Html]: TaskParamType.STRING,
  [TaskParamName.Selector]: TaskParamType.STRING,
  [TaskParamName.WebsiteUrl]: TaskParamType.STRING,
  [TaskParamName.WebPage]: TaskParamType.BROWSER_INSTANCE,
};
