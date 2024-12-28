import { Eye } from "lucide-react";
import { TaskParamName, TaskType } from "@/lib/types";
import { TaskParamMapping } from "./taskParamMapping";

const waitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: "Wait for element",
  icon: (props) => <Eye className="stroke-amber-400" {...props} />,
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
      name: TaskParamName.Visibility,
      required: true,
      hideHandle: true,
      options: [
        { value: "visible", label: "Visible" },
        { value: "hidden", label: "Hidden" },
      ],
    },
    {
      name: TaskParamName.Timeout,
      hideHandle: true,
      min: 0,
      max: 20000,
      default: 5000,
      helperText:
        "Set the maximum wait time (in milliseconds) for the element to become visible or hidden.",
    },
  ],
  outputs: [
    {
      name: TaskParamName.WebPage,
    },
  ],
};

// Update inputs and outputs with type
waitForElementTask.inputs = waitForElementTask.inputs.map((input) => ({
  ...input,
  type: TaskParamMapping[input.name],
}));

waitForElementTask.outputs = waitForElementTask.outputs.map((output) => ({
  ...output,
  type: TaskParamMapping[output.name],
}));

export { waitForElementTask };
