import { TaskRegistry } from "./task/registry";
import { FlowToExecutionPlanError } from "@/lib/types";

export function flowToExecutionPlan(nodes, edges) {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint)
    return {
      error: { type: FlowToExecutionPlanError.NO_ENTRY_POINT },
    };

  const inputsWithErrors = []; // Example syntax:  [{ nodeId, inputs: ["Web page"] }]
  const planned = new Set(); // Set of visited nodeIds

  const invalidInputsForEntry = getInvalidInputs(entryPoint, edges, planned); // Example syntax: ["Web page"]
  if (invalidInputsForEntry.length) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputsForEntry,
    });
    // planned.add(entryPoint.id); // redundant as we will do this eventually
  }

  const executionPlan = [{ phase: 1, nodes: [entryPoint] }];
  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase = { phase, nodes: [] };

    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) continue;

      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      if (invalidInputs.length) {
        const incomers = getIncomers(currentNode, nodes, edges);
        const currentNodeReadyToPlan = incomers.every((incomer) =>
          planned.has(incomer.id)
        );
        if (currentNodeReadyToPlan) {
          // currentNode is ready to plan but has invalid inputs even now - this means the flow is invalid flow
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
          planned.add(currentNode.id); // Mark the invalid node as planned
        }
        continue; // Skip adding to the phase since it's invalid
      }

      // If no invalid inputs, the node is ready to be added to the next phase
      nextPhase.nodes.push(currentNode);
    }

    // Add nodes in nextPhase to the planned set
    for (const node of nextPhase.nodes) planned.add(node.id);
    executionPlan.push(nextPhase);
  }

  if (inputsWithErrors.length) {
    return {
      error: {
        type: FlowToExecutionPlanError.INVALID_INPUTS,
        invalidElements: inputsWithErrors,
      },
    };
  }

  return { executionPlan };
}

// return array of invalid inputs of a particular node PROVIDED its time to visit (plan) this node. Example returnb syntax - ["Web page"]
function getInvalidInputs(node, edges, planned) {
  const invalidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];

    // check input value provided by user
    if (inputValue.length) continue;

    // check incoming edges to input
    const inputLinkedToOutput = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    const inputLinkedToPlannedOutput =
      inputLinkedToOutput && planned.has(inputLinkedToOutput.source);

    const requiredInputProvidedByPlannedOutput =
      input.required && inputLinkedToPlannedOutput;

    // if input is req but not linked to any node or connected node is not planned (visited) yet - invalid input
    if (requiredInputProvidedByPlannedOutput) continue;

    // if input is not req, it should either not linked with any node or if linked, then the node should be already planned (visited)
    if (!input.required) {
      if (!inputLinkedToOutput || inputLinkedToPlannedOutput) continue;
    }

    invalidInputs.push(input.name);
  }

  return invalidInputs;
}

function getIncomers(node, nodes, edges) {
  if (!node.id) return [];
  const incomersIds = new Set();
  edges.forEach((edge) => {
    if (edge.target === node.id) incomersIds.add(edge.source);
  });

  return nodes.filter((node) => incomersIds.has(node.id));
}
