import { flowValidationContext } from "@/context/FlowValidationContext";
import { useContext } from "react";

export function useFlowValidation() {
  const context = useContext(flowValidationContext);
  if (!context)
    throw new Error(
      "useFlowValidation must be used within a flowValidationContext"
    );
  return context;
}
