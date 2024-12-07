import { useCallback, useEffect } from "react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  getOutgoers,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
// import { toast } from "sonner";
import { TaskParamMapping } from "@/lib/workflow/task/taskParamMapping";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { NodeComponent } from "./nodes/NodeComponent";
import { DeletableEdge } from "./edges/DeletableEdge";

const nodeTypes = { ScrapelNode: NodeComponent };
const edgeTypes = { default: DeletableEdge };
const snapGrid = [50, 50];
const fitViewOptions = { padding: 0.15 };

export function FlowEditor({ workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition, updateNodeData } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    } catch (error) {
      // toast.error(`Failed to fetch workflow. Please try again later.`); // getting 2 times
    }
  }, [workflow.definition, setEdges, setNodes]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();

      const taskType = e.dataTransfer.getData("application/reactflow");
      if (!taskType) return;

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const newNode = createFlowNode(taskType, position);
      setNodes((nodes) => nodes.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onConnect = useCallback(
    (connection) => {
      setEdges((edges) =>
        addEdge(
          {
            ...connection,
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          edges
        )
      );

      if (!connection.targetHandle) return;

      // clear the input value if it is present on connection
      const node = nodes.find((node) => node.id === connection.target);
      if (!node) return;

      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: { ...nodeInputs, [connection.targetHandle]: "" },
      });
    },
    [setEdges, nodes, updateNodeData]
  );

  const isValidConnection = useCallback(
    (connection) => {
      // dont connect handles of same node
      if (connection.source === connection.target) return false;

      // dont connect handles of different type
      if (
        TaskParamMapping[connection.sourceHandle] !==
        TaskParamMapping[connection.targetHandle]
      )
        return false;

      // detect cycle in flow (flow should be cycle free)
      const hasCycle = (node, visited = new Set()) => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      const target = nodes.find((node) => node.id === connection.target);
      return !hasCycle(target);
    },
    [nodes, edges]
  );

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}
