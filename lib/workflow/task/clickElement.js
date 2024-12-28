import { MousePointerClick } from "lucide-react";
import { TaskParamName, TaskType } from "@/lib/types";
import { TaskParamMapping } from "./taskParamMapping";

const clickElementTask = {
  type: TaskType.CLICK_ELEMENT,
  label: "Click element",
  icon: (props) => (
    <MousePointerClick className="stroke-orange-400" {...props} />
  ),
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
  ],
  outputs: [
    {
      name: TaskParamName.WebPage,
    },
  ],
};

// Update inputs and outputs with type
clickElementTask.inputs = clickElementTask.inputs.map((input) => ({
  ...input,
  type: TaskParamMapping[input.name],
}));

clickElementTask.outputs = clickElementTask.outputs.map((output) => ({
  ...output,
  type: TaskParamMapping[output.name],
}));

export { clickElementTask };
