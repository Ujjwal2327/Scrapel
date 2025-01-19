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
import { toast } from "sonner";
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
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  const flow = JSON.parse(workflow.definition);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) {
      toast("Drag and drop functionality is not supported on touch screens.", {
        description: "For the best experience, please use a laptop or desktop.",
      });
    }
  }, []);

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {
      toast.error("Invalid workflow");
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
      newNode.selected = true;
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
        fitView={flow.nodes.length === 1}
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
