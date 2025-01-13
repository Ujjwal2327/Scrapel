"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";

export async function getExecutionPhase(id) {
  return withErrorHandling(
    async () => {
      if (!id || typeof id !== "string")
        throw new UserError("Invalid execution phase ID.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const executionPhase = await prisma.executionPhase.findUniqueOrThrow({
        where: {
          id,
          userId,
        },
        include: {
          logs: {
            orderBy: {
              timestamp: "asc",
            },
          },
        },
      });

      return executionPhase;
    },
    "getExecutionPhase",
    "fetch execution phase"
  );
}
