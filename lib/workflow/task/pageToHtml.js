import { Code } from "lucide-react";
import { TaskParamName, TaskType } from "@/lib/types";
import { TaskParamMapping } from "./taskParamMapping";

const pageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get html from page",
  icon: (props) => <Code className="stroke-rose-400" {...props} />,
  credits: 2,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.WebPage,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.Html,
    },
    {
      name: TaskParamName.WebPage,
    },
  ],
};

// Update inputs and outputs with type
pageToHtmlTask.inputs = pageToHtmlTask.inputs.map((input) => ({
  ...input,
  type: TaskParamMapping[input.name],
}));

pageToHtmlTask.outputs = pageToHtmlTask.outputs.map((output) => ({
  ...output,
  type: TaskParamMapping[output.name],
}));

export { pageToHtmlTask };
