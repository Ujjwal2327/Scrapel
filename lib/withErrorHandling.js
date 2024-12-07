"use server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UserError } from "./errors";

export async function withErrorHandling(
  action,
  actionName,
  actionDescription = "perform the requested operation"
) {
  try {
    return await action();
  } catch (error) {
    // Ignore NEXT_REDIRECT errors - Allow Next.js to handle the redirect

    if (error.digest?.startsWith("NEXT_REDIRECT")) throw error;

    if (error instanceof UserError) {
      console.warn(`User-facing error in ${actionName}:`, error.message);
      throw error;
    }

    if (error instanceof PrismaClientKnownRequestError) {
      let message;
      switch (error.code) {
        case "P2000": // Value out of range
          message = `One or more of your inputs exceed the allowed length or value range. Please check your input values.`;
          break;
        case "P2002": // Unique constraint violation
          message = `A record with this value already exists. Please use a unique value.`;
          break;
        case "P2003": // Foreign key constraint violation
          message = `Cannot ${actionDescription}. A related record is missing.`;
          break;
        case "P2025": // Record not found
          message = `The requested record does not exist or has been deleted.`;
          break;
        case "P2004": // Constraint violation during update
          message = `The record cannot be updated due to a constraint violation. Please check the details.`;
          break;
        case "P2011": // Field value type mismatch
          message = `The input value is not compatible with the field type. Please review the values and try again.`;
          break;
        case "P2036": // Invalid operation on related record
          message = `Cannot perform the operation because a related record is invalid. Please check your data.`;
          break;
        case "P2029": // Invalid arguments in update or delete operations
          message = `There was an issue with the operation. Please check your input and try again.`;
          break;
        case "P1001": // Database connection error
          message = `We are unable to connect to the database at the moment. Please try again later.`;
          break;
        default:
          console.error(`Unhandled Prisma error in ${actionName}:\n`, error);
          throw new Error(
            `An unexpected database error occurred while trying to ${actionDescription}.`
          );
      }
      console.warn(`User-facing Prisma error in ${actionName}:`, error.message);
      throw new UserError(message);
    }

    console.error(`Unexpected error in ${actionName}:\n`, error);
    throw new Error(`Failed to ${actionDescription}. Please try again later.`);
  }
}
