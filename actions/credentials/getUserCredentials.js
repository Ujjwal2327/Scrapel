"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";

export async function getUserCredentials() {
  return withErrorHandling(
    async () => {
      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const credentials = await prisma.credential.findMany({
        where: {
          userId,
        },
        orderBy: {
          name: "asc",
        },
      });

      return credentials;
    },
    "getUserCredentials",
    "fetch credentials"
  );
}
