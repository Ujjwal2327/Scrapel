"use server";
import { handleError } from "./errors";

export async function withErrorHandling(
  action,
  actionName,
  actionDescription = "perform the requested operation"
) {
  try {
    return await action();
  } catch (error) {
    return handleError(error, actionName, actionDescription);
  }
}
