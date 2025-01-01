import { Link2 } from "lucide-react";
import { TaskParamName, TaskType } from "@/lib/types";
import { TaskParamMapping } from "./taskParamMapping";

const navigateUrlTask = {
  type: TaskType.NAVIGATE_URL,
  label: "Navigate Url",
  icon: (props) => <Link2 className="stroke-orange-400" {...props} />,
  credits: 2,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.WebPage,
      required: true,
    },
    {
      name: TaskParamName.Url,
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
navigateUrlTask.inputs = navigateUrlTask.inputs.map((input) => ({
  ...input,
  type: TaskParamMapping[input.name],
}));

navigateUrlTask.outputs = navigateUrlTask.outputs.map((output) => ({
  ...output,
  type: TaskParamMapping[output.name],
}));

export { navigateUrlTask };
