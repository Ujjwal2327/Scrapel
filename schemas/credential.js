import { z } from "zod";

export const createCredentialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50),
  value: z.string().trim().min(1, "Value is required").max(500),
});
