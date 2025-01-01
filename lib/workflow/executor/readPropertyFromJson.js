import { TaskParamName } from "@/lib/types";
import { convertToString } from "@/lib/utils";

export async function readPropertyFromJsonExecutor(environment) {
  const jsonStr = environment.getInput(TaskParamName.Json);
  const propertyName = environment.getInput(TaskParamName.PropertyName);

  if (!jsonStr) throw new Error(`${TaskParamName.Json} not provided.`);
  if (!propertyName)
    throw new Error(`${TaskParamName.PropertyName} not provided.`);

  const json = JSON.parse(jsonStr);
  const propertyValue = json[propertyName];
  if (!json.hasOwnProperty(propertyName))
    throw new Error("Property not found in provided Json.");

  environment.setOutput(
    TaskParamName.PropertyValue,
    convertToString(propertyValue)
  );
}
