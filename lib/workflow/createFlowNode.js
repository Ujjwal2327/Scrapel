import { TaskRegistry } from "./task/registry";

export function createFlowNode(nodeType, position, nodeInputs) {
  return {
    id: crypto.randomUUID(),
    type: "ScrapelNode",
    dragHandle: ".drag-handle",
    data: {
      type: nodeType,
      inputs: nodeInputs
        ? nodeInputs
        : Object.fromEntries(
            TaskRegistry[nodeType].inputs.map(({ name }) => [name, ""])
          ),
    },
    position: {
      x: position?.x ?? 0,
      y: position?.y ?? 0,
    },
  };
}
