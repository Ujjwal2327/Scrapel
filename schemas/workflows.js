import { z } from "zod";

export const workflowSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50),
  description: z.string().trim().max(80).optional(),
});

export const createWorkflowSchema = workflowSchema.extend({
  isDemo: z.boolean(),
});

export const duplicateWorkflowSchema = workflowSchema.extend({
  workflowId: z.string().trim().min(1, "Workflow id is required"),
});

export const renameWorkflowSchema = duplicateWorkflowSchema;
