import { Database } from "lucide-react";
import { TaskParamName, TaskType } from "@/lib/types";
import { TaskParamMapping } from "./taskParamMapping";

const addPropertyToJsonTask = {
  type: TaskType.ADD_PROPERTY_TO_JSON,
  label: "Add property to JSON",
  icon: (props) => <Database className="stroke-orange-400" {...props} />,
  credits: 2,
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
    {
      name: TaskParamName.PropertyValue,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.Json,
    },
  ],
};

// Update inputs and outputs with type
addPropertyToJsonTask.inputs = addPropertyToJsonTask.inputs.map((input) => ({
  ...input,
  type: TaskParamMapping[input.name],
}));

addPropertyToJsonTask.outputs = addPropertyToJsonTask.outputs.map((output) => ({
  ...output,
  type: TaskParamMapping[output.name],
}));

export { addPropertyToJsonTask };
