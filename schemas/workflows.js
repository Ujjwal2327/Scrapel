import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50),
  description: z.string().trim().max(80).optional(),
});
