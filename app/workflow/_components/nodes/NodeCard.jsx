import { useReactFlow } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { useFlowValidation } from "@/hooks/useFlowValidation";

export function NodeCard({ children, nodeId, isSelected }) {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some(
    ({ nodeId: id }) => id === nodeId
  );

  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (
          !node?.position ||
          node?.measured?.width === undefined ||
          node?.measured?.height === undefined
        )
          return;

        const { x, y } = node.position;
        const { width, height } = node.measured;

        setCenter(x + width / 2, y + height / 2, { zoom: 1, duration: 500 });
      }}
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-primary",
        hasInvalidInputs &&
          (isSelected ? "border-primary/70" : "border-destructive")
      )}
    >
      {children}
    </div>
  );
}
