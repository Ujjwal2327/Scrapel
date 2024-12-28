import { Edit3 } from "lucide-react";
import { TaskParamName, TaskParamType, TaskType } from "@/lib/types";
import { TaskParamMapping } from "./taskParamMapping";

const fillInputTask = {
  type: TaskType.FILL_INPUT,
  label: "Fill input",
  icon: (props) => <Edit3 className="stroke-orange-400" {...props} />,
  credits: 1,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.WebPage,
      required: true,
    },
    {
      name: TaskParamName.Selector,
      required: true,
    },
    {
      name: TaskParamName.Value,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.WebPage,
    },
  ],
};

// Update inputs and outputs with type
fillInputTask.inputs = fillInputTask.inputs.map((input) => ({
  ...input,
  type: TaskParamMapping[input.name],
}));

fillInputTask.outputs = fillInputTask.outputs.map((output) => ({
  ...output,
  type: TaskParamMapping[output.name],
}));

export { fillInputTask };
