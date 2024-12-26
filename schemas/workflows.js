import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50),
  description: z.string().trim().max(80).optional(),
});

export const duplicateWorkflowSchema = createWorkflowSchema.extend({
  workflowId: z.string().trim().min(1, "Workflow id is required"),
});
