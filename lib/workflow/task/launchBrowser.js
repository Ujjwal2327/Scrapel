import { Globe } from "lucide-react";
import { TaskParamName, TaskParamType, TaskType } from "@/lib/types";

export const launchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch browser",
  icon: (props) => <Globe className="stroke-pink-400" {...props} />,
  credits: 5,
  isEntryPoint: true,
  inputs: [
    {
      name: TaskParamName.WebsiteUrl,
      type: TaskParamType.STRING,
      helperText: "eg: https://www.google.com",
      required: true,
      hideHandle: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ],
};
