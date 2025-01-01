import { ArrowUp } from "lucide-react";
import { TaskParamName, TaskType } from "@/lib/types";
import { TaskParamMapping } from "./taskParamMapping";

const scrollToElementTask = {
  type: TaskType.SCROLL_TO_ELEMENT,
  label: "Scroll to element",
  icon: (props) => <ArrowUp className="stroke-orange-400" {...props} />,
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
scrollToElementTask.inputs = scrollToElementTask.inputs.map((input) => ({
  ...input,
  type: TaskParamMapping[input.name],
}));

scrollToElementTask.outputs = scrollToElementTask.outputs.map((output) => ({
  ...output,
  type: TaskParamMapping[output.name],
}));

export { scrollToElementTask };
