export function createFlowNode(nodeType, position) {
  return {
    id: crypto.randomUUID(),
    type: "ScrapelNode",
    dragHandle: ".drag-handle",
    data: {
      type: nodeType,
      inputs: {},
    },
    position: {
      x: position?.x ?? 0,
      y: position?.y ?? 0,
    },
  };
}
