import { Text } from "lucide-react";
import { TaskParamName, TaskParamType, TaskType } from "@/lib/types";

export const extractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract text from element",
  icon: (props) => <Text className="stroke-rose-400" {...props} />,
  credits: 2,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.Html,
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: TaskParamName.Selector,
      type: TaskParamType.STRING,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.ExtractedText,
      type: TaskParamType.STRING,
    },
  ],
};
