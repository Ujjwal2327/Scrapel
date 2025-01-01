import { TaskParamName } from "@/lib/types";
import { convertToString, normalizeJsonValue } from "@/lib/utils";

export async function addPropertyToJsonExecutor(environment) {
  const jsonStr = environment.getInput(TaskParamName.Json);
  const propertyName = environment.getInput(TaskParamName.PropertyName);
  let propertyValue = environment.getInput(TaskParamName.PropertyValue);

  if (!jsonStr) throw new Error(`${TaskParamName.Json} not provided.`);
  if (!propertyName)
    throw new Error(`${TaskParamName.PropertyName} not provided.`);
  if (!propertyValue)
    throw new Error(`${TaskParamName.PropertyValue} not provided.`);

  // change string to json if valid
  propertyValue = normalizeJsonValue(propertyValue);

  const json = JSON.parse(jsonStr);
  if (json.hasOwnProperty(propertyName))
    environment.log.info(
      `Property ${propertyName} already exists in the provided JSON and has been updated.`
    );

  json[propertyName] = propertyValue;

  environment.setOutput(TaskParamName.Json, convertToString(json));
}
