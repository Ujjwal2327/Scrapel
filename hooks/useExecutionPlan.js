import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { flowToExecutionPlan } from "@/lib/workflow/flowToExecutionPlan";
import { FlowToExecutionPlanError } from "@/lib/types";
import { getFlowToExecutionPlanErrorMessage } from "@/lib/utils";
import { useFlowValidation } from "./useFlowValidation";

export const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const processError = useCallback(
    (error) => {
      const errorMessage = getFlowToExecutionPlanErrorMessage(error.type);
      toast.error(errorMessage);

      switch (error.type) {
        case FlowToExecutionPlanError.INVALID_INPUTS:
          setInvalidInputs(error.invalidElements);
          break;
      }
    },
    [setInvalidInputs]
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = flowToExecutionPlan(nodes, edges);
    if (error) {
      processError(error);
      return null;
    }

    clearErrors(); //  to clear the previous errors
    return executionPlan;
  }, [toObject, processError, clearErrors]);
  return generateExecutionPlan;
};
