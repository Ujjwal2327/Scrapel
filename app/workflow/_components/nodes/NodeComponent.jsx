import { memo } from "react";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { NodeCard } from "./NodeCard";
import { NodeHeader } from "./NodeHeader";
import { NodeInput, NodeInputs } from "./NodeInputs";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";

export const NodeComponent = memo((props) => {
  const { id, selected, data: nodeData } = props;
  const task = TaskRegistry[nodeData.type];

  return (
    <NodeCard nodeId={id} isSelected={selected}>
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
