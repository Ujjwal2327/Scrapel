import { useReactFlow } from "@xyflow/react";
import { Coins, Copy, GripVertical, Trash } from "lucide-react";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function NodeHeader({ taskType, nodeId }) {
  const task = TaskRegistry[taskType];
  const { addNodes, deleteElements, getNode, updateNode } = useReactFlow();

  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Entry point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <Coins size={16} />
            {task.credits}
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button
                onClick={() => deleteElements({ nodes: [{ id: nodeId }] })}
                variant="ghost"
                size="icon"
              >
                <Trash size={12} />
              </Button>
              <Button
                onClick={() => {
                  const node = getNode(nodeId);
                  const newX = node.position.x + 100;
                  const newY = node.position.y + 100;
                  const newNode = createFlowNode(
                    node.data.type,
                    {
                      x: newX,
                      y: newY,
                    },
                    node.data.inputs
                  );
                  node.selected = false;
                  newNode.selected = true;
                  updateNode(nodeId);
                  addNodes(newNode);
                  console.log({ newNode, node });
                }}
                variant="ghost"
                size="icon"
              >
                <Copy size={12} />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-grab"
          >
            <GripVertical size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
