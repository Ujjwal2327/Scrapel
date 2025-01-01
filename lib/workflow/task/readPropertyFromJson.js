import { FileJson2 } from "lucide-react";
import { TaskParamName, TaskType } from "@/lib/types";
import { TaskParamMapping } from "./taskParamMapping";

const readPropertyFromJsonTask = {
  type: TaskType.READ_PROPERTY_FROM_JSON,
  label: "Read property from JSON",
  icon: (props) => <FileJson2 className="stroke-orange-400" {...props} />,
  credits: 1,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.Json,
      required: true,
    },
    {
      name: TaskParamName.PropertyName,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.PropertyValue,
    },
  ],
};

// Update inputs and outputs with type
readPropertyFromJsonTask.inputs = readPropertyFromJsonTask.inputs.map(
  (input) => ({
    ...input,
    type: TaskParamMapping[input.name],
  })
);

readPropertyFromJsonTask.outputs = readPropertyFromJsonTask.outputs.map(
  (output) => ({
    ...output,
    type: TaskParamMapping[output.name],
  })
);

export { readPropertyFromJsonTask };
