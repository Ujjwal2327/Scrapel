import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeletableEdge(props) {
  const { markerEnd, style, id } = props;
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);
  const { setEdges } = useReactFlow();

  return (
    <>
      <BaseEdge path={edgePath} style={style} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <Button
            onClick={() =>
              setEdges((edges) => edges.filter((edge) => edge.id !== id))
            }
            variant="outline"
            size="icon"
            className="rounded-full text-xs leading-none hover:shadow-lg p-0 w-full h-full"
          >
            <X className="h-1 w-1 stroke-red-400 opacity-50" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
