import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { TaskParamType } from "@/lib/types";
import { StringParam } from "./param/StringParam";
import { BrowserInstanceParam } from "./param/BrowserInstanceParam";

export function NodeParamField({ param, nodeId, disabled }) {
  const { getNode, updateNodeData } = useReactFlow();
  const node = getNode(nodeId);
  const value = node?.data.inputs?.[param.name];

  const updateNodeParamValue = useCallback(
    (newValue) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [param.name]: newValue,
        },
      });
    },
    [nodeId, updateNodeData, param.name, node?.data.inputs]
  );

  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case TaskParamType.BROWSER_INSTANCE:
      return (
        <BrowserInstanceParam
          param={param}
          value={""}
          updateNodeParamValue={updateNodeParamValue}
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not Implemented</p>
        </div>
      );
  }
}
