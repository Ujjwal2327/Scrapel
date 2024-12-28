import { Text } from "lucide-react";
import { TaskParamName, TaskType } from "@/lib/types";
import { TaskParamMapping } from "./taskParamMapping";

const extractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract text from element",
  icon: (props) => <Text className="stroke-rose-400" {...props} />,
  credits: 2,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.Html,
      required: true,
      variant: "textarea",
    },
    {
      name: TaskParamName.Selector,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.ExtractedText,
    },
  ],
};

// Update inputs and outputs with type
extractTextFromElementTask.inputs = extractTextFromElementTask.inputs.map(
  (input) => ({
    ...input,
    type: TaskParamMapping[input.name],
  })
);

extractTextFromElementTask.outputs = extractTextFromElementTask.outputs.map(
  (output) => ({
    ...output,
    type: TaskParamMapping[output.name],
  })
);

export { extractTextFromElementTask };
