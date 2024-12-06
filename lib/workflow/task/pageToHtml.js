import { Code } from "lucide-react";
import { TaskParamName, TaskParamType, TaskType } from "@/lib/types";

export const pageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get html from page",
  icon: (props) => <Code className="stroke-rose-400" {...props} />,
  credits: 2,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.Html,
      type: TaskParamType.STRING,
    },
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ],
};
