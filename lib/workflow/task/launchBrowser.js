import { Globe } from "lucide-react";
import { TaskParamName, TaskType } from "@/lib/types";
import { TaskParamMapping } from "./taskParamMapping";

const launchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch browser",
  icon: (props) => <Globe className="stroke-pink-400" {...props} />,
  credits: 5,
  isEntryPoint: true,
  inputs: [
    {
      name: TaskParamName.WebsiteUrl,
      helperText: "eg: https://www.google.com",
      required: true,
      hideHandle: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.WebPage,
    },
  ],
};

// Update inputs and outputs with type
launchBrowserTask.inputs = launchBrowserTask.inputs.map((input) => ({
  ...input,
  type: TaskParamMapping[input.name],
}));

launchBrowserTask.outputs = launchBrowserTask.outputs.map((output) => ({
  ...output,
  type: TaskParamMapping[output.name],
}));

export { launchBrowserTask };
