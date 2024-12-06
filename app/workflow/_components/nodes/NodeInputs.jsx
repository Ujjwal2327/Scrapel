import { Handle, Position, useEdges } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { colorForHandle } from "./common";
import { NodeParamField } from "./NodeParamField";

export function NodeInputs({ children }) {
  return <div className="flex flex-col divide-y gap-1">{children}</div>;
}

export function NodeInput({ input, nodeId }) {
  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );

  return (
    <div className="flex justify-start relative p-3 bg-secondary w-full">
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          isConnectable={!isConnected}
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
            colorForHandle[input.type]
          )}
        />
      )}
    </div>
  );
}
