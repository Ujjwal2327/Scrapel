import { Brain } from "lucide-react";
import { TaskParamName, TaskType } from "@/lib/types";
import { TaskParamMapping } from "./taskParamMapping";

const extractDataWithAiTask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: "Extract data with AI",
  icon: (props) => <Brain className="stroke-rose-400" {...props} />,
  credits: 4,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.Content,
      required: true,
    },
    {
      name: TaskParamName.Model,
      required: true,
      hideHandle: true,
      options: [{ value: "gpt-4o-mini", label: "OpenAI (GPT-4o-mini)" }],
    },
    {
      name: TaskParamName.ApiKey,
      required: true,
    },
    {
      name: TaskParamName.Prompt,
      required: true,
      variant: "textarea",
      placeholder:
        "E.g. Extract a JSON object containing the selectors for the username field, password field, and login button. Use the properties usernameSelector, passwordSelector, and loginSelector in the resulting JSON.",
    },
  ],
  outputs: [
    {
      name: TaskParamName.ExtractedData,
    },
  ],
};

// Update inputs and outputs with type
extractDataWithAiTask.inputs = extractDataWithAiTask.inputs.map((input) => ({
  ...input,
  type: TaskParamMapping[input.name],
}));

extractDataWithAiTask.outputs = extractDataWithAiTask.outputs.map((output) => ({
  ...output,
  type: TaskParamMapping[output.name],
}));

export { extractDataWithAiTask };
