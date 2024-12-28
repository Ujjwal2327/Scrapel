import { TaskParamName, TaskParamType } from "@/lib/types";

export const TaskParamMapping = {
  [TaskParamName.Body]: TaskParamType.STRING,
  [TaskParamName.ExtractedText]: TaskParamType.STRING,
  [TaskParamName.Html]: TaskParamType.STRING,
  [TaskParamName.Selector]: TaskParamType.STRING,
  [TaskParamName.TargetUrl]: TaskParamType.STRING,
  [TaskParamName.Value]: TaskParamType.STRING,
  [TaskParamName.WebsiteUrl]: TaskParamType.STRING,

  [TaskParamName.Timeout]: TaskParamType.NUMBER,

  [TaskParamName.Visibility]: TaskParamType.SELECT,

  [TaskParamName.WebPage]: TaskParamType.BROWSER_INSTANCE,
};
