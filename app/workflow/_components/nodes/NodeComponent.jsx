import { memo } from "react";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { NodeCard } from "./NodeCard";
import { NodeHeader } from "./NodeHeader";
import { NodeInput, NodeInputs } from "./NodeInputs";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";
import { Badge } from "@/components/ui/badge";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

export const NodeComponent = memo((props) => {
  const { id, selected, data: nodeData } = props;
  const task = TaskRegistry[nodeData.type];

  return (
    <NodeCard nodeId={id} isSelected={selected}>
      {DEV_MODE && <Badge>DEV: {props.id}</Badge>}
      <NodeHeader taskType={nodeData.type} nodeId={id} />
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput key={input.name} input={input} nodeId={id} />
        ))}
      </NodeInputs>
      <NodeOutputs>
        {task.outputs.map((output) => (
          <NodeOutput key={output.name} output={output} />
        ))}
      </NodeOutputs>
    </NodeCard>
  );
});
NodeComponent.displayName = "NodeComponent";
