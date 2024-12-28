import { Send } from "lucide-react";
import { TaskParamName, TaskType } from "@/lib/types";
import { TaskParamMapping } from "./taskParamMapping";

const deliverViaWebhookTask = {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: "Deliver via webhook",
  icon: (props) => <Send className="stroke-blue-400" {...props} />,
  credits: 1,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.TargetUrl,
      required: true,
    },
    {
      name: TaskParamName.Body,
      required: true,
    },
  ],
  outputs: [],
};

// Update inputs and outputs with type
deliverViaWebhookTask.inputs = deliverViaWebhookTask.inputs.map((input) => ({
  ...input,
  type: TaskParamMapping[input.name],
}));

deliverViaWebhookTask.outputs = deliverViaWebhookTask.outputs.map((output) => ({
  ...output,
  type: TaskParamMapping[output.name],
}));

export { deliverViaWebhookTask };
