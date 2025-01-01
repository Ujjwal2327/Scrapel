import { TaskParamName, TaskParamType } from "@/lib/types";

export const TaskParamMapping = {
  [TaskParamName.Body]: TaskParamType.STRING,
  [TaskParamName.Content]: TaskParamType.STRING,
  [TaskParamName.ExtractedData]: TaskParamType.STRING,
  [TaskParamName.ExtractedText]: TaskParamType.STRING,
  [TaskParamName.Html]: TaskParamType.STRING,
  [TaskParamName.Json]: TaskParamType.STRING,
  [TaskParamName.Prompt]: TaskParamType.STRING,
  [TaskParamName.PropertyName]: TaskParamType.STRING,
  [TaskParamName.PropertyValue]: TaskParamType.STRING,
  [TaskParamName.Selector]: TaskParamType.STRING,
  [TaskParamName.TargetUrl]: TaskParamType.STRING,
  [TaskParamName.Url]: TaskParamType.STRING,
  [TaskParamName.Value]: TaskParamType.STRING,
  [TaskParamName.WebsiteUrl]: TaskParamType.STRING,

  [TaskParamName.Timeout]: TaskParamType.NUMBER,

  [TaskParamName.Model]: TaskParamType.SELECT,
  [TaskParamName.Visibility]: TaskParamType.SELECT,

  [TaskParamName.ApiKey]: TaskParamType.CREDENTIAL,
  [TaskParamName.Credential]: TaskParamType.CREDENTIAL,

  [TaskParamName.WebPage]: TaskParamType.BROWSER_INSTANCE,
};
